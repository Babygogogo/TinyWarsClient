
import TwnsBwPlayer                     from "../../baseWar/model/BwPlayer";
import TwnsBwBuildingListPanel          from "../../baseWar/view/BwBuildingListPanel";
import TwnsChatPanel                    from "../../chat/view/ChatPanel";
import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import TwnsCommonDamageChartPanel       from "../../common/view/CommonDamageChartPanel";
import MfrCreateModel                   from "../../multiFreeRoom/model/MfrCreateModel";
import TwnsMfrCreateSettingsPanel       from "../../multiFreeRoom/view/MfrCreateSettingsPanel";
import MpwModel                         from "../../multiPlayerWar/model/MpwModel";
import MpwProxy                         from "../../multiPlayerWar/model/MpwProxy";
import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import TwnsTwWar                        from "../../testWar/model/TwWar";
import CommonConstants                  from "../../tools/helpers/CommonConstants";
import ConfigManager                    from "../../tools/helpers/ConfigManager";
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
import WarMapModel                      from "../../warMap/model/WarMapModel";
import TwnsMpwWar                       from "../model/MpwWar";

namespace TwnsMpwWarMenuPanel {
    import CommonConfirmPanel           = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import MpwWar                       = TwnsMpwWar.MpwWar;
    import BwBuildingListPanel          = TwnsBwBuildingListPanel.BwBuildingListPanel;
    import CommonDamageChartPanel       = TwnsCommonDamageChartPanel.CommonDamageChartPanel;
    import UserSettingsPanel            = TwnsUserSettingsPanel.UserSettingsPanel;
    import MfrCreateSettingsPanel       = TwnsMfrCreateSettingsPanel.MfrCreateSettingsPanel;
    import SpmCreateSfwSaveSlotsPanel   = TwnsSpmCreateSfwSaveSlotsPanel.SpmCreateSfwSaveSlotsPanel;
    import TwWar                        = TwnsTwWar.TwWar;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import BwPlayer                     = TwnsBwPlayer.BwPlayer;

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

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelWarInfoTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerInfoTitle! : TwnsUiLabel.UiLabel;
        private readonly _btnMapNameTitle!      : TwnsUiButton.UiButton;
        private readonly _labelMapName!         : TwnsUiLabel.UiLabel;
        private readonly _listWarInfo!          : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;
        private readonly _btnBuildings!         : TwnsUiButton.UiButton;
        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        private _menuType       = MenuType.Main;

        public static show(): void {
            if (!MpwWarMenuPanel._instance) {
                MpwWarMenuPanel._instance = new MpwWarMenuPanel();
            }
            MpwWarMenuPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (MpwWarMenuPanel._instance) {
                await MpwWarMenuPanel._instance.close();
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
                { type: NotifyType.BwActionPlannerStateChanged,        callback: this._onNotifyBwPlannerStateChanged },
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MsgSpmCreateSfw,                    callback: this._onNotifyMsgSpmCreateSfw },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnHome,        callback: this._onTouchedBtnHome },
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._listWarInfo.setItemRenderer(InfoRenderer);

            this._showOpenAnimation();

            this._menuType = MenuType.Main;
            this._updateView();

            Notify.dispatch(NotifyType.BwWarMenuPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            Notify.dispatch(NotifyType.BwWarMenuPanelClosed);
        }

        private _getWar(): MpwWar {
            return Helpers.getExisted(MpwModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwPlannerStateChanged(): void {
            const war = this._getWar();
            if (war.getPlayerInTurn() === war.getPlayerLoggedIn()) {
                this.close();
            } else {
                this._updateListPlayer();
            }
        }
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
                throw new Error(`Invalid menuType: ${type}`);
            }
        }

        private _onTouchedBtnHome(): void {
            CommonConfirmPanel.show({
                title   : Lang.getText(LangTextType.B0054),
                content : Lang.getText(LangTextType.A0025),
                callback: () => FlowManager.gotoLobby(),
            });
        }

        private _onTouchedBtnBuildings(): void {
            BwBuildingListPanel.show({ war: this._getWar() });
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

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                const group = this._group;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, left: 0 })
                    .to({ alpha: 0, left: -40 }, 200);

                const groupInfo = this._groupInfo;
                egret.Tween.removeTweens(groupInfo);
                egret.Tween.get(groupInfo)
                    .set({ alpha: 1, right: 0 })
                    .to({ alpha: 0, right: -40 }, 200)
                    .call(resolve);
            });
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateListCommand();
            this._updateGroupInfo();
            this._updateListPlayer();
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
            this._labelMenuTitle.text                   = Lang.getText(LangTextType.B0155);
            this._labelWarInfoTitle.text                = Lang.getText(LangTextType.B0223);
            this._labelPlayerInfoTitle.text             = Lang.getText(LangTextType.B0224);
            this._btnMapNameTitle.label                 = Lang.getText(LangTextType.B0225);
            this._btnBuildings.label                    = Lang.getText(LangTextType.B0333);
            this._updateListWarInfo();
        }

        private async _updateGroupInfo(): Promise<void> {
            const war   = this._getWar();
            const mapId = war.getMapId();
            const label = this._labelMapName;
            if (mapId == null) {
                label.text = `----`;
            } else {
                label.text = `${await WarMapModel.getMapNameInCurrentLanguage(mapId) || "----"} (${Lang.getText(LangTextType.B0163)}: ${await WarMapModel.getDesignerName(mapId) || "----"})`;
            }
        }

        private _updateListWarInfo(): void {
            const war       = this._getWar();
            const dataList  : DataForInfoRenderer[] = [
                {
                    titleText   : Lang.getText(LangTextType.B0226),
                    infoText    : `${war.getWarId()}`,
                    infoColor   : 0xFFFFFF,
                },
                {
                    titleText   : Lang.getText(LangTextType.B0091),
                    infoText    : `${war.getTurnManager().getTurnIndex()} (${Lang.getText(LangTextType.B0090)}: ${war.getExecutedActionManager().getExecutedActionsCount()})`,
                    infoColor   : 0xFFFFFF,
                },
            ];
            this._listWarInfo.bindData(dataList);
        }

        private _updateListPlayer(): void {
            const war   = this._getWar();
            const data  : DataForPlayerRenderer[] = [];
            war.getPlayerManager().forEachPlayer(false, (player) => {
                data.push({
                    war,
                    player,
                });
            });
            this._listPlayer.bindData(data.sort((p1, p2) => p1.player.getPlayerIndex() - p2.player.getPlayerIndex()));
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
                throw new Error(`MpwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`);
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandOpenDamageChartPanel(),
                this._createCommandPlayerUseCop(),
                this._createCommandPlayerUseScop(),
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

        private _createCommandOpenDamageChartPanel(): DataForCommandRenderer {
            return {
                name    : Lang.getText(LangTextType.B0440),
                callback: () => {
                    CommonDamageChartPanel.show();
                    this.close();
                },
            };
        }

        private _createCommandPlayerUseCop(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const skillType     = Types.CoSkillType.Power;
            const playerInTurn  = war.getPlayerInTurn();
            const actionPlanner = war.getActionPlanner();
            if ((playerInTurn !== war.getPlayerLoggedIn())                          ||
                (!playerInTurn.checkCanUseCoSkill(skillType))                       ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (actionPlanner.checkIsStateRequesting())
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0142),
                    callback: () => {
                        CommonConfirmPanel.show({
                            title   : Lang.getText(LangTextType.B0142),
                            content : Lang.getText(LangTextType.A0054),
                            callback: () => actionPlanner.setStateRequestingPlayerUseCoSkill(skillType),
                        });
                    },
                };
            }
        }

        private _createCommandPlayerUseScop(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const skillType     = Types.CoSkillType.SuperPower;
            const playerInTurn  = war.getPlayerInTurn();
            const actionPlanner = war.getActionPlanner();
            if ((playerInTurn !== war.getPlayerLoggedIn())                          ||
                (!playerInTurn.checkCanUseCoSkill(skillType))                       ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (actionPlanner.checkIsStateRequesting())
            ) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0144),
                    callback: () => {
                        CommonConfirmPanel.show({
                            title   : Lang.getText(LangTextType.B0144),
                            content : Lang.getText(LangTextType.A0058),
                            callback: () => actionPlanner.setStateRequestingPlayerUseCoSkill(skillType),
                        });
                    },
                };
            }
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

                    const errorCode = await (new TwWar()).init(warData);
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0201),
                        callback: () => {
                            MfrCreateModel.resetDataByInitialWarData(warData);
                            MfrCreateSettingsPanel.show();
                            this.close();
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

    function getTextColor(value: number, defaultValue: number): number {
        if (value > defaultValue) {
            return 0x00FF00;
        } else if (value < defaultValue) {
            return 0xFF0000;
        } else {
            return 0xFFFFFF;
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

    type DataForPlayerRenderer = {
        war     : MpwWar;
        player  : BwPlayer;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelForce!   : TwnsUiLabel.UiLabel;
        private readonly _labelLost!    : TwnsUiLabel.UiLabel;
        private readonly _listInfo!     : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected async _onDataChanged(): Promise<void> {
            const data                  = this._getData();
            const war                   = data.war;
            const player                = data.player;
            this._labelName.text        = await player.getNickname();
            this._labelName.textColor   = player === war.getPlayerInTurn() ? 0x00FF00 : 0xFFFFFF;
            this._labelForce.text       = `${Lang.getPlayerForceName(player.getPlayerIndex())}`
                + `  ${Lang.getPlayerTeamName(player.getTeamIndex())}`
                + `  ${player === war.getPlayerInTurn() ? Lang.getText(LangTextType.B0086) : ""}`;

            if (player.getAliveState() !== Types.PlayerAliveState.Alive) {
                this._labelLost.visible = true;
                this._listInfo.visible  = false;
            } else {
                this._labelLost.visible = false;
                this._listInfo.visible  = true;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this._getData();
            const war           = data.war;
            const player        = data.player;
            const isInfoKnown   = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(player.getTeamIndex()));
            return [
                this._createDataColor(war, player, isInfoKnown),
                this._createDataFund(war, player, isInfoKnown),
                this._createDataBuildings(war, player, isInfoKnown),
                this._createDataCoName(war, player, isInfoKnown),
                this._createDataEnergy(war, player, isInfoKnown),
                this._createDataUnitAndValue(war, player, isInfoKnown),

                this._createDataInitialFund(war, player, isInfoKnown),
                this._createDataIncomeMultiplier(war, player, isInfoKnown),
                this._createDataEnergyAddPctOnLoadCo(war, player, isInfoKnown),
                this._createDataEnergyGrowthMultiplier(war, player, isInfoKnown),
                this._createDataMoveRangeModifier(war, player, isInfoKnown),
                this._createDataAttackPowerModifier(war, player, isInfoKnown),
                this._createDataVisionRangeModifier(war, player, isInfoKnown),
                this._createDataLuckLowerLimit(war, player, isInfoKnown),
                this._createDataLuckUpperLimit(war, player, isInfoKnown),
            ];
        }
        private _createDataColor(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0397),
                infoText    : Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId()) || CommonConstants.ErrorTextForUndefined,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataFund(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            return {
                titleText   : Lang.getText(LangTextType.B0032),
                infoText    : isInfoKnown ? `${player.getFund()}` : `?`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataBuildings(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const info = this._getTilesCountAndIncome(war, player.getPlayerIndex());
            return {
                titleText   : Lang.getText(LangTextType.B0158),
                infoText    : `${info.count} / +${info.income}${isInfoKnown ? `` : `  ?`}`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataCoName(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const coId  = player.getCoId();
            const cfg   = coId == null ? null : ConfigManager.getCoBasicCfg(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), coId);
            return {
                titleText   : `CO`,
                infoText    : !cfg ? `(${Lang.getText(LangTextType.B0001)})` : `${cfg.name}`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataEnergy(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const currValue         = player.getCoCurrentEnergy();
            const powerEnergy       = player.getCoPowerEnergy();
            const superPowerEnergy  = player.getCoSuperPowerEnergy();
            const skillType         = player.getCoUsingSkillType();
            const currEnergyText    = skillType === Types.CoSkillType.Passive
                ? "" + currValue
                : skillType === Types.CoSkillType.Power ? "COP" : "SCOP";
            return {
                titleText               : Lang.getText(LangTextType.B0159),
                infoText                : `${currValue == null ? `--` : currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataUnitAndValue(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const unitsCountAndValue = this._getUnitsCountAndValue(war, player.getPlayerIndex());
            return {
                titleText               : Lang.getText(LangTextType.B0160),
                infoText                : `${unitsCountAndValue.count} / ${unitsCountAndValue.value}${isInfoKnown ? `` : `  ?`}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsIncomeMultiplier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataEnergyAddPctOnLoadCo(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsEnergyAddPctOnLoadCo(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsEnergyGrowthMultiplier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsMoveRangeModifier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsAttackPowerModifier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(
            war         : MpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            };
        }

        private _getTilesCountAndIncome(war: MpwWar, playerIndex: number): { count: number, income: number } {
            let count   = 0;
            let income  = 0;
            for (const tile of war.getTileMap().getAllTiles()) {
                if (tile.getPlayerIndex() === playerIndex) {
                    ++count;
                    income += tile.getIncomeForPlayer(playerIndex);
                }
            }
            return { count, income };
        }

        private _getUnitsCountAndValue(war: MpwWar, playerIndex: number): { count: number, value: number } {
            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            const unitMap       = war.getUnitMap();
            let count           = 0;
            let value           = 0;
            for (const unit of unitMap.getAllUnitsOnMap()) {
                if (unit.getPlayerIndex() === playerIndex) {
                    ++count;
                    value += Math.floor(unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp());

                    if ((teamIndexes.has(unit.getTeamIndex())) || (!war.getFogMap().checkHasFogCurrently())) {
                        for (const unitLoaded of unitMap.getUnitsLoadedByLoader(unit, true)) {
                            ++count;
                            value += Math.floor(unitLoaded.getProductionFinalCost() * unitLoaded.getNormalizedCurrentHp() / unitLoaded.getNormalizedMaxHp());
                        }
                    }
                }
            }
            return { count, value };
        }
    }

    type DataForInfoRenderer = {
        titleText   : string;
        infoText    : string;
        infoColor   : number;
    };

    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _btnTitle!     : TwnsUiButton.UiButton;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data                  = this._getData();
            this._btnTitle.label        = data.titleText;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
        }
    }
}

export default TwnsMpwWarMenuPanel;
