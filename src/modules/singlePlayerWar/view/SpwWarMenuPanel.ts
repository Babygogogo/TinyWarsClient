
import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import SpmProxy                         from "../../singlePlayerMode/model/SpmProxy";
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
import SpwModel                         from "../model/SpwModel";
import TwnsSpwWar                       from "../model/SpwWar";
import TwnsSpwLoadWarPanel              from "./SpwLoadWarPanel";

namespace TwnsSpwWarMenuPanel {
    import CommonConfirmPanel           = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import SpmCreateSfwSaveSlotsPanel   = TwnsSpmCreateSfwSaveSlotsPanel.SpmCreateSfwSaveSlotsPanel;
    import SpwWar                       = TwnsSpwWar.SpwWar;
    import SpwLoadWarPanel              = TwnsSpwLoadWarPanel.SpwLoadWarPanel;
    import TwWar                        = TwnsTwWar.TwWar;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;

    // eslint-disable-next-line no-shadow
    enum MenuType {
        Main,
        Advanced,
    }

    export class SpwWarMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: SpwWarMenuPanel;

        private readonly _group!                : eui.Group;
        private readonly _listCommand!          : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;
        private readonly _labelNoCommand!       : TwnsUiLabel.UiLabel;
        private readonly _btnBack!              : TwnsUiButton.UiButton;

        private _war?           : SpwWar;
        private _dataForList?   : DataForCommandRenderer[] | null;
        private _menuType       = MenuType.Main;

        public static show(): void {
            if (!SpwWarMenuPanel._instance) {
                SpwWarMenuPanel._instance = new SpwWarMenuPanel();
            }
            SpwWarMenuPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (SpwWarMenuPanel._instance) {
                await SpwWarMenuPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }
        public static getIsOpening(): boolean {
            const instance = SpwWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/singlePlayerWar/SpwWarMenuPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MsgSpmSaveScw,                      callback: this._onMsgSpmSaveScw },
                { type: NotifyType.MsgSpmSaveSfw,                      callback: this._onMsgSpmSaveSfw },
                { type: NotifyType.MsgSpmCreateSfw,                    callback: this._onMsgSpmCreateSfw },
                { type: NotifyType.MsgSpmDeleteWarSaveSlot,            callback: this._onNotifyMsgSpmDeleteWarSaveSlot },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            const war           = Helpers.getExisted(SpwModel.getWar());
            this._menuType      = MenuType.Main;
            this._setWar(war);

            this._updateView();

            Notify.dispatch(NotifyType.BwWarMenuPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            delete this._war;
            delete this._dataForList;

            Notify.dispatch(NotifyType.BwWarMenuPanelClosed);
        }

        private _setWar(war: SpwWar): void {
            this._war = war;
        }
        private _getWar(): SpwWar {
            return Helpers.getDefined(this._war);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyUnitAndTileTextureVersionChanged(): void {
            this._updateView();
        }

        private _onMsgSpmSaveScw(): void {
            FloatText.show(Lang.getText(LangTextType.A0073));
        }

        private _onMsgSpmSaveSfw(): void {
            FloatText.show(Lang.getText(LangTextType.A0073));
        }

        private _onMsgSpmCreateSfw(e: egret.Event): void {
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

        private _onNotifyMsgSpmDeleteWarSaveSlot(): void {
            FloatText.show(Lang.getFormattedText(LangTextType.A0141));
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateListCommand();
        }

        private _updateListCommand(): void {
            this._dataForList = this._createDataForListCommand();
            if (!this._dataForList.length) {
                this._labelNoCommand.visible = true;
                this._listCommand.clear();
            } else {
                this._labelNoCommand.visible = false;
                this._listCommand.bindData(this._dataForList);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Menu item data creators.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createDataForListCommand(): DataForCommandRenderer[] {
            const type = this._menuType;
            if (type === MenuType.Main) {
                return this._createDataForMainMenu();
            } else if (type === MenuType.Advanced) {
                return this._createDataForAdvancedMenu();
            } else {
                throw Helpers.newError(`McwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`);
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                // this._createCommandOpenCoInfoMenu(),
                this._createCommandOpenUnitListPanel(),
                this._createCommandSaveScw(),
                this._createCommandSaveSfw(),
                this._createCommandLoadGame(),
                this._createCommandOpenAdvancedMenu(),
                // this._createCommandChat(),
                this._createCommandGotoMyWarListPanel(),
                this._createCommandGotoLobby(),
            ]);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandPlayerDeleteUnit(),
                this._createCommandSimulation(),
                this._createCommandCreateMfr(),
                this._createCommandDeleteWar(),
                this._createCommandUserSettings(),
                this._createCommandSetPathMode(),
            ]);
        }

        private _createCommandOpenAdvancedMenu(): DataForCommandRenderer | null {
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

        private _createCommandSaveScw(): DataForCommandRenderer | null {
            const war = this._getWar();
            if ((!war)                                                              ||
                (!war.checkIsHumanInTurn())                                         ||
                (!war.getTurnManager().getPhaseCode())                              ||
                (war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)
            ) {
                return null;
            }

            const warType = war.getWarType();
            if ((warType !== Types.WarType.ScwFog) && (warType !== Types.WarType.ScwStd)) {
                return null;
            }

            return {
                name    : Lang.getText(LangTextType.B0260),
                callback: () => {
                    CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0071),
                        callback: () => {
                            SpmProxy.reqSpmSaveScw(war);
                        },
                    });
                },
            };
        }

        private _createCommandSaveSfw(): DataForCommandRenderer | null {
            const war = this._getWar();
            if ((!war)                                                              ||
                (!war.checkIsHumanInTurn())                                         ||
                (!war.getTurnManager().getPhaseCode())                              ||
                (war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)
            ) {
                return null;
            }

            const warType = war.getWarType();
            if ((warType !== Types.WarType.SfwFog) && (warType !== Types.WarType.SfwStd)) {
                return null;
            }

            return {
                name    : Lang.getText(LangTextType.B0260),
                callback: () => {
                    CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0071),
                        callback: () => {
                            SpmProxy.reqSpmSaveSfw(war);
                        },
                    });
                },
            };
        }

        private _createCommandLoadGame(): DataForCommandRenderer | null {
            const war = this._getWar();
            if ((!war)                                                              ||
                (!war.checkIsHumanInTurn())                                         ||
                (!war.getTurnManager().getPhaseCode())                              ||
                (war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0261),
                    callback: () => {
                        SpwLoadWarPanel.show();
                    },
                };
            }
        }

        private _createCommandGotoMyWarListPanel(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0652),
                callback: () => {
                    CommonConfirmPanel.show({
                        title   : Lang.getText(LangTextType.B0652),
                        content : Lang.getText(LangTextType.A0225),
                        callback: () => FlowManager.gotoMyWarListPanel(this._getWar().getWarType()),
                    });
                },
            };
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0054),
                callback: () => {
                    CommonConfirmPanel.show({
                        title   : Lang.getText(LangTextType.B0054),
                        content : Lang.getText(LangTextType.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
            };
        }

        private _createCommandPlayerDeleteUnit(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const actionPlanner = war.getActionPlanner();
            if ((!war.checkIsHumanInTurn())                                         ||
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
                        const playerIndex   = war.getPlayerIndexInTurn();
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

                    const warData   = war.serializeForCreateMfr();
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

        private _createCommandDeleteWar(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const saveSlotIndex = war ? war.getSaveSlotIndex() : null;
            return saveSlotIndex == null
                ? null
                : {
                    name    : Lang.getText(LangTextType.B0420),
                    callback: () => {
                        CommonConfirmPanel.show({
                            content : Lang.getText(LangTextType.A0140),
                            callback: () => {
                                SpmProxy.reqSpmDeleteWarSaveSlot(saveSlotIndex);
                            },
                        });
                    },
                };
        }
        private _createCommandUserSettings(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0560),
                callback: () => {
                    TwnsUserSettingsPanel.UserSettingsPanel.show();
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

export default TwnsSpwWarMenuPanel;
