
import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
import TwnsChatPanel                    from "../../chat/view/ChatPanel";
import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import TwnsCommonDamageChartPanel       from "../../common/view/CommonDamageChartPanel";
import MpwModel                         from "../../multiPlayerWar/model/MpwModel";
import MpwProxy                         from "../../multiPlayerWar/model/MpwProxy";
import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import TwnsTwWar                        from "../../testWar/model/TwWar";
import CompatibilityHelpers             from "../../tools/helpers/CompatibilityHelpers";
import FloatText                        from "../../tools/helpers/FloatText";
import FlowManager                      from "../../tools/helpers/FlowManager";
import Helpers                          from "../../tools/helpers/Helpers";
import Types                            from "../../tools/helpers/Types";
import Lang                             from "../../tools/lang/Lang";
import TwnsLangTextType                 from "../../tools/lang/LangTextType";
import Notify                           from "../../tools/notify/Notify";
import TwnsNotifyType                   from "../../tools/notify/NotifyType";
import ProtoTypes                       from "../../tools/proto/ProtoTypes";
import TwnsUiButton                     from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
import UserModel                        from "../../user/model/UserModel";
import UserProxy                        from "../../user/model/UserProxy";
import TwnsUserSettingsPanel            from "../../user/view/UserSettingsPanel";
import TwnsMpwWar                       from "../model/MpwWar";

namespace TwnsMpwWarMenuPanel {
    import CommonConfirmPanel           = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import MpwWar                       = TwnsMpwWar.MpwWar;
    import CommonDamageChartPanel       = TwnsCommonDamageChartPanel.CommonDamageChartPanel;
    import UserSettingsPanel            = TwnsUserSettingsPanel.UserSettingsPanel;
    import SpmCreateSfwSaveSlotsPanel   = TwnsSpmCreateSfwSaveSlotsPanel.SpmCreateSfwSaveSlotsPanel;
    import TwWar                        = TwnsTwWar.TwWar;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;

    // eslint-disable-next-line no-shadow
    enum MenuType {
        Main,
        Advanced,
    }

    export class MpwWarMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MpwWarMenuPanel;

        private readonly _group!                : eui.Group;
        private readonly _listCommand!          : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;
        private readonly _labelNoCommand!       : TwnsUiLabel.UiLabel;
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnHome!              : TwnsUiButton.UiButton;
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;

        private _menuType       = MenuType.Main;

        public static show(): void {
            if (!MpwWarMenuPanel._instance) {
                MpwWarMenuPanel._instance = new MpwWarMenuPanel();
            }
            MpwWarMenuPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (MpwWarMenuPanel._instance) {
                await MpwWarMenuPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }
        public static getIsOpening(): boolean {
            const instance = MpwWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/multiPlayerWar/MpwWarMenuPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MsgSpmCreateSfw,                    callback: this._onNotifyMsgSpmCreateSfw },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnHome,        callback: this._onTouchedBtnHome },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            this._showOpenAnimation();

            this._menuType = MenuType.Main;
            this._updateView();

            Notify.dispatch(NotifyType.BwWarMenuPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });

            Notify.dispatch(NotifyType.BwWarMenuPanelClosed);
        }

        private _getWar(): MpwWar {
            return Helpers.getExisted(MpwModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAndTileTextureVersionChanged(): void {
            this._updateView();
        }
        private _onNotifyMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0107),
                callback: () => {
                    FlowManager.gotoSinglePlayerWar({
                        slotIndex       : Helpers.getExisted(data.slotIndex),
                        slotExtraData   : Helpers.getExisted(data.extraData),
                        warData         : Helpers.getExisted(data.warData),
                    });
                },
            });
        }

        private _onTouchedBtnBack(): void {
            const type = this._menuType;
            if (type === MenuType.Main) {
                this.close();
            } else if (type === MenuType.Advanced) {
                this._menuType = MenuType.Main;
                this._updateListCommand();
            } else {
                throw Helpers.newError(`Invalid menuType: ${type}`);
            }
        }

        private _onTouchedBtnHome(): void {
            CommonConfirmPanel.show({
                title   : Lang.getText(LangTextType.B0054),
                content : Lang.getText(LangTextType.A0025),
                callback: () => FlowManager.gotoLobby(),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, left: -40 })
                .to({ alpha: 1, left: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                const group = this._group;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, left: 0 })
                    .to({ alpha: 0, left: -40 }, 200)
                    .call(resolve);
            });
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateListCommand();
        }

        private _updateListCommand(): void {
            const dataArray = this._createDataForList();
            if (!dataArray.length) {
                this._labelNoCommand.visible = true;
                this._listCommand.clear();
            } else {
                this._labelNoCommand.visible = false;
                this._listCommand.bindData(dataArray);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(LangTextType.B0155);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Menu item data creators.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createDataForList(): DataForCommandRenderer[] {
            const type = this._menuType;
            if (type === MenuType.Main) {
                return this._createDataForMainMenu();
            } else if (type === MenuType.Advanced) {
                return this._createDataForAdvancedMenu();
            } else {
                throw Helpers.newError(`MpwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`);
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandOpenUnitListPanel(),
                this._createCommandOpenDamageChartPanel(),
                this._createCommandPlayerAgreeDraw(),
                this._createCommandPlayerDeclineDraw(),
                this._createCommandSyncWar(),
                this._createCommandOpenAdvancedMenu(),
                this._createCommandGotoWarListPanel(),
            ]);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandPlayerDeleteUnit(),
                this._createCommandPlayerRequestDraw(),
                this._createCommandPlayerSurrender(),
                this._createCommandSimulation(),
                this._createCommandCreateMfr(),
                this._createCommandUserSettings(),
                this._createCommandSetPathMode(),
            ]);
        }

        private _createCommandOpenAdvancedMenu(): DataForCommandRenderer {
            return {
                name    : Lang.getText(LangTextType.B0080),
                callback: () => {
                    this._menuType = MenuType.Advanced;
                    this._updateListCommand();
                },
            };
        }

        private _createCommandOpenUnitListPanel(): DataForCommandRenderer {
            return {
                name    : Lang.getText(LangTextType.B0152),
                callback: () => {
                    const war           = this._getWar();
                    const actionPlanner = war.getField().getActionPlanner();
                    if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                        actionPlanner.setStateIdle();
                        this.close();
                        TwnsBwUnitListPanel.BwUnitListPanel.show({ war });
                    }
                },
            };
        }
        private _createCommandOpenDamageChartPanel(): DataForCommandRenderer {
            return {
                name    : Lang.getText(LangTextType.B0440),
                callback: () => {
                    CommonDamageChartPanel.show();
                    this.close();
                },
            };
        }

        private _createCommandSyncWar(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0089),
                callback: () => {
                    const war = this._getWar();
                    MpwProxy.reqMpwCommonSyncWar(
                        war,
                        war.getActionPlanner().checkIsStateRequesting()
                            ? Types.SyncWarRequestType.PlayerForce
                            : Types.SyncWarRequestType.PlayerRequest
                    );
                    this.close();
                },
            };
        }

        private _createCommandGotoWarListPanel(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0652),
                callback: () => {
                    CommonConfirmPanel.show({
                        title   : Lang.getText(LangTextType.B0652),
                        content : Lang.getText(LangTextType.A0225),
                        callback: () => {
                            FlowManager.gotoMyWarListPanel(this._getWar().getWarType());
                        },
                    });
                },
            };
        }

        private _createCommandChat(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0383),
                callback: () => {
                    this.close();
                    TwnsChatPanel.ChatPanel.show({});
                },
            };
        }

        private _createCommandPlayerRequestDraw(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const player        = war.getPlayerInTurn();
            const actionPlanner = war.getActionPlanner();
            if ((player !== war.getPlayerLoggedIn())                                ||
                (player.getHasVotedForDraw())                                       ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (actionPlanner.getState() !== Types.ActionPlannerState.Idle)        ||
                (war.getDrawVoteManager().getRemainingVotes() != null)
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0083),
                    callback: () => {
                        CommonConfirmPanel.show({
                            content : Lang.getText(LangTextType.A0031),
                            callback: () => actionPlanner.setStateRequestingPlayerVoteForDraw(true),
                        });
                    },
                };
            }
        }

        private _createCommandPlayerSurrender(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const actionPlanner = war.getActionPlanner();
            if ((war.getPlayerInTurn() !== war.getPlayerLoggedIn())                 ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (actionPlanner.checkIsStateRequesting())
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0055),
                    callback: () => {
                        CommonConfirmPanel.show({
                            title   : Lang.getText(LangTextType.B0055),
                            content : Lang.getText(LangTextType.A0026),
                            callback: () => actionPlanner.setStateRequestingPlayerSurrender(),
                        });
                    },
                };
            }
        }

        private _createCommandSimulation(): DataForCommandRenderer | null {
            const war = this._getWar();
            return {
                name    : Lang.getText(LangTextType.B0325),
                callback: () => {
                    if (war.getIsExecutingAction()) {
                        FloatText.show(Lang.getText(LangTextType.A0103));
                    } else {
                        SpmCreateSfwSaveSlotsPanel.show(war.serializeForCreateSfw());
                    }
                },
            };
        }

        private _createCommandCreateMfr(): DataForCommandRenderer | null {
            const war = this._getWar();
            return {
                name    : Lang.getText(LangTextType.B0557),
                callback: async () => {
                    if (war.getPlayerManager().getAliveOrDyingTeamsCount(false) < 2) {
                        FloatText.show(Lang.getText(LangTextType.A0199));
                        return;
                    }

                    const warData = war.serializeForCreateMfr();
                    if (warData == null) {
                        FloatText.show(Lang.getText(LangTextType.A0200));
                        return;
                    }

                    const errorCode = await (new TwWar()).init(warData).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0201),
                        callback: () => {
                            FlowManager.gotoMfrCreateSettingsPanel(warData);
                        }
                    });
                }
            };
        }

        private _createCommandPlayerAgreeDraw(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const player        = war.getPlayerInTurn();
            const actionPlanner = war.getActionPlanner();
            if ((player !== war.getPlayerLoggedIn())                                ||
                (player.getHasVotedForDraw())                                       ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (actionPlanner.getState() !== Types.ActionPlannerState.Idle)        ||
                (!war.getDrawVoteManager().getRemainingVotes())
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0084),
                    callback: () => {
                        CommonConfirmPanel.show({
                            content : Lang.getText(LangTextType.A0032),
                            callback: () => actionPlanner.setStateRequestingPlayerVoteForDraw(true),
                        });
                    },
                };
            }
        }

        private _createCommandPlayerDeclineDraw(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const player        = war.getPlayerInTurn();
            const actionPlanner = war.getActionPlanner();
            if ((player !== war.getPlayerLoggedIn())                                ||
                (player.getHasVotedForDraw())                                       ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (actionPlanner.getState() !== Types.ActionPlannerState.Idle)        ||
                (!war.getDrawVoteManager().getRemainingVotes())
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0085),
                    callback: () => {
                        CommonConfirmPanel.show({
                            content : Lang.getText(LangTextType.A0033),
                            callback: () => actionPlanner.setStateRequestingPlayerVoteForDraw(false),
                        });
                    },
                };
            }
        }

        private _createCommandPlayerDeleteUnit(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const actionPlanner = war.getActionPlanner();
            if ((war.getPlayerInTurn() !== war.getPlayerLoggedIn())                 ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (actionPlanner.getState() !== Types.ActionPlannerState.Idle)
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0081),
                    callback: () => {
                        const unitMap       = war.getUnitMap();
                        const unit          = unitMap.getUnitOnMap(war.getCursor().getGridIndex());
                        const playerIndex   = war.getPlayerIndexLoggedIn();
                        if (!unit) {
                            FloatText.show(Lang.getText(LangTextType.A0027));
                        } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== Types.UnitActionState.Idle)) {
                            FloatText.show(Lang.getText(LangTextType.A0028));
                        } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                            FloatText.show(Lang.getText(LangTextType.A0076));
                        } else {
                            CommonConfirmPanel.show({
                                title   : Lang.getText(LangTextType.B0081),
                                content : Lang.getText(LangTextType.A0029),
                                callback: () => actionPlanner.setStateRequestingPlayerDeleteUnit(),
                            });
                        }
                    },
                };
            }
        }
        private _createCommandUserSettings(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0560),
                callback: () => {
                    UserSettingsPanel.show();
                }
            };
        }
        private _createCommandSetPathMode(): DataForCommandRenderer {
            return {
                name    : Lang.getText(LangTextType.B0430),
                callback: () => {
                    const isEnabled = UserModel.getSelfSettingsIsSetPathMode();
                    CommonConfirmPanel.show({
                        content : Lang.getFormattedText(
                            LangTextType.F0033,
                            Lang.getText(isEnabled ? LangTextType.B0431 : LangTextType.B0432),
                        ),
                        textForConfirm  : Lang.getText(LangTextType.B0433),
                        textForCancel   : Lang.getText(LangTextType.B0434),
                        callback: () => {
                            if (!isEnabled) {
                                UserProxy.reqUserSetSettings({
                                    isSetPathMode   : true,
                                });
                            }
                        },
                        callbackOnCancel: () => {
                            if (isEnabled) {
                                UserProxy.reqUserSetSettings({
                                    isSetPathMode   : false,
                                });
                            }
                        }
                    });
                }
            };
        }
    }

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    };
    class CommandRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(): void {
            this._getData().callback();
        }

        private _updateView(): void {
            const data              = this._getData();
            this._labelName.text    = data.name;
        }
    }
}

export default TwnsMpwWarMenuPanel;
