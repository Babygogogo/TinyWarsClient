
import TwnsBwPlayer                     from "../../baseWar/model/BwPlayer";
import TwnsCommonChooseCoPanel          from "../../common/view/CommonChooseCoPanel";
import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import TwnsCommonInputPanel             from "../../common/view/CommonInputPanel";
import MfrCreateModel                   from "../../multiFreeRoom/model/MfrCreateModel";
import TwnsMfrCreateSettingsPanel       from "../../multiFreeRoom/view/MfrCreateSettingsPanel";
import SpmProxy                         from "../../singlePlayerMode/model/SpmProxy";
import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import TwnsTwWar                        from "../../testWar/model/TwWar";
import CommonConstants                  from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers             from "../../tools/helpers/CompatibilityHelpers";
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
import WarRuleHelpers                   from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                        from "../../user/model/UserModel";
import UserProxy                        from "../../user/model/UserProxy";
import TwnsUserSettingsPanel            from "../../user/view/UserSettingsPanel";
import WarMapModel                      from "../../warMap/model/WarMapModel";
import SpwModel                         from "../model/SpwModel";
import TwnsSpwPlayerManager             from "../model/SpwPlayerManager";
import TwnsSpwWar                       from "../model/SpwWar";
import TwnsSpwLoadWarPanel              from "./SpwLoadWarPanel";

namespace TwnsSpwWarMenuPanel {
    import CommonConfirmPanel           = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import SpmCreateSfwSaveSlotsPanel   = TwnsSpmCreateSfwSaveSlotsPanel.SpmCreateSfwSaveSlotsPanel;
    import SpwPlayerManager             = TwnsSpwPlayerManager.SpwPlayerManager;
    import SpwWar                       = TwnsSpwWar.SpwWar;
    import SpwLoadWarPanel              = TwnsSpwLoadWarPanel.SpwLoadWarPanel;
    import TwWar                        = TwnsTwWar.TwWar;
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;
    import BwPlayer                     = TwnsBwPlayer.BwPlayer;

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

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelWarInfoTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerInfoTitle! : TwnsUiLabel.UiLabel;
        private readonly _btnMapNameTitle!      : TwnsUiButton.UiButton;
        private readonly _labelMapName!         : TwnsUiLabel.UiLabel;
        private readonly _listWarInfo!          : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;
        private readonly _btnBuildings!         : TwnsUiButton.UiButton;
        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

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

            this.skinName = `resource/skins/singlePlayerWar/SpwWarMenuPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateChanged,        callback: this._onNotifyBwPlannerStateChanged },
                { type: NotifyType.BwCoIdChanged,                      callback: this._onNotifyBwCoIdChanged },
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
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._listWarInfo.setItemRenderer(InfoRenderer);

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
        private _onNotifyBwPlannerStateChanged(): void {
            const war = this._getWar();
            if (war.checkIsHumanInTurn()) {
                this.close();
            } else {
                this.updateListPlayer();
            }
        }

        private _onNotifyBwCoIdChanged(): void {
            this.updateListPlayer();
        }

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
            this._updateGroupInfo();
            this.updateListPlayer();
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
            this._labelMenuTitle.text       = Lang.getText(LangTextType.B0155);
            this._labelWarInfoTitle.text    = Lang.getText(LangTextType.B0223);
            this._labelPlayerInfoTitle.text = Lang.getText(LangTextType.B0224);
            this._btnMapNameTitle.label     = Lang.getText(LangTextType.B0225);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._updateListWarInfo();
        }

        private async _updateGroupInfo(): Promise<void> {
            const war   = this._getWar();
            const mapId = war.getMapId();
            const label = this._labelMapName;
            if (mapId == null) {
                label.text = `----`;
            } else {
                label.text = `${await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }) ?? CommonConstants.ErrorTextForUndefined} (${Lang.getText(LangTextType.B0163)}: ${await WarMapModel.getDesignerName(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }) ?? CommonConstants.ErrorTextForUndefined})`;
            }
        }

        private _updateListWarInfo(): void {
            const dataList: DataForInfoRenderer[] = [
                this._createWarInfoTurnIndex(),
            ];
            this._listWarInfo.bindData(dataList);
        }

        public updateListPlayer(): void {
            const war   = this._getWar();
            const data  : DataForPlayerRenderer[] = [];
            war.getPlayerManager().forEachPlayer(false, (player: BwPlayer) => {
                data.push({
                    war,
                    playerIndex : player.getPlayerIndex(),
                    panel       : this,
                });
            });
            this._listPlayer.bindData(data.sort((d1, d2) => d1.playerIndex - d2.playerIndex));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // War info data creators.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createWarInfoTurnIndex(): DataForInfoRenderer {
            const war                   = this._getWar();
            const turnIndex             = war.getTurnManager().getTurnIndex();
            const executedActionsCount  = war.getExecutedActionManager().getExecutedActionsCount();
            return {
                titleText               : Lang.getText(LangTextType.B0091),
                infoText                : `${turnIndex} (${Lang.getText(LangTextType.B0090)}: ${executedActionsCount})`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
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
                this._createCommandPlayerUseCop(),
                this._createCommandPlayerUseScop(),
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

        // private _createCommandChat(): DataForCommandRenderer | null {
        //     return {
        //         name    : Lang.getText(LangTextType.B0383),
        //         callback: () => {
        //             this.close();
        //             ChatPanel.show({});
        //         },
        //     };
        // }

        // private _createCommandOpenCoInfoMenu(): DataForCommandRenderer | null {
        //     return {
        //         name    : Lang.getText(LangTextType.B0140),
        //         callback: () => {
        //             const war = this._getWar();
        //             BwCoListPanel.show({
        //                 war,
        //                 selectedIndex: war.getPlayerIndexInTurn() - 1,
        //             });
        //             this.close();
        //         },
        //     };
        // }

        private _createCommandPlayerUseCop(): DataForCommandRenderer | null {
            const war           = this._getWar();
            const skillType     = Types.CoSkillType.Power;
            const playerInTurn  = war.getPlayerInTurn();
            const actionPlanner = war.getActionPlanner();
            if ((!war.checkIsHumanInTurn())                                         ||
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
            if ((!war.checkIsHumanInTurn())                                         ||
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
                            MfrCreateModel.resetDataByInitialWarData(warData);
                            TwnsMfrCreateSettingsPanel.MfrCreateSettingsPanel.show();
                            this.close();
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
        war         : SpwWar;
        playerIndex : number;
        panel       : SpwWarMenuPanel;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _btnName!      : TwnsUiButton.UiButton;
        private readonly _labelForce!   : TwnsUiLabel.UiLabel;
        private readonly _labelLost!    : TwnsUiLabel.UiLabel;
        private readonly _listInfo!     : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnName,    callback: this._onTouchedBtnName },
            ]);
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedBtnName(): void {
            const data  = this._getData();
            const war   = data.war;
            if (war.getCanCheat()) {
                const playerIndex   = data.playerIndex;
                const player        = war.getPlayer(playerIndex);
                const isHuman       = player.getUserId() != null;
                CommonConfirmPanel.show({
                    content : isHuman ? Lang.getText(LangTextType.A0110) : Lang.getText(LangTextType.A0111),
                    callback: () => {
                        if (!isHuman) {
                            player.setUserId(UserModel.getSelfUserId());
                        } else {
                            player.setUserId(null);
                            SpwModel.checkAndHandleAutoActionsAndRobotRecursively(war);
                        }
                        this._updateView();
                    },
                });
            }
        }

        private _updateView(): void {
            const data                  = this._getData();
            const war                   = data.war;
            const playerIndex           = data.playerIndex;
            const player                = war.getPlayer(playerIndex);
            const isPlayerInTurn        = playerIndex === war.getPlayerIndexInTurn();
            this._btnName.label         = player.getUserId() != null ? Lang.getText(LangTextType.B0031) : Lang.getText(LangTextType.B0256);
            this._labelForce.textColor  = isPlayerInTurn ? 0x00FF00 : 0xFFFFFF;
            this._labelForce.text       = `${Lang.getPlayerForceName(playerIndex)}`
                + `  ${Lang.getPlayerTeamName(player.getTeamIndex())}`
                + `  ${isPlayerInTurn ? Lang.getText(LangTextType.B0086) : ""}`;
            this._btnName.setTextColor(war.getCanCheat() ? 0x00FF00 : 0xFFFFFF);

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
            const playerIndex   = data.playerIndex;
            const panel         = data.panel;
            const player        = war.getPlayer(playerIndex);
            const isInfoKnown   = (!war.getFogMap().checkHasFogCurrently()) || ((war.getPlayerManager() as SpwPlayerManager).getAliveWatcherTeamIndexesForSelf().has(player.getTeamIndex()));
            return [
                this._createDataColor(war, player, isInfoKnown, panel),
                this._createDataFund(war, player, isInfoKnown, panel),
                this._createDataBuildings(war, player, isInfoKnown, panel),
                this._createDataCoName(war, player, isInfoKnown, panel),
                this._createDataEnergy(war, player, isInfoKnown, panel),
                this._createDataUnitAndValue(war, player, isInfoKnown, panel),
                this._createDataInitialFund(war, player, isInfoKnown, panel),
                this._createDataIncomeMultiplier(war, player, isInfoKnown, panel),
                this._createDataEnergyAddPctOnLoadCo(war, player, isInfoKnown, panel),
                this._createDataEnergyGrowthMultiplier(war, player, isInfoKnown, panel),
                this._createDataMoveRangeModifier(war, player, isInfoKnown, panel),
                this._createDataAttackPowerModifier(war, player, isInfoKnown, panel),
                this._createDataVisionRangeModifier(war, player, isInfoKnown, panel),
                this._createDataLuckLowerLimit(war, player, isInfoKnown, panel),
                this._createDataLuckUpperLimit(war, player, isInfoKnown, panel),
            ];
        }
        private _createDataColor(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(LangTextType.B0397),
                infoText                : Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId()) ?? CommonConstants.ErrorTextForUndefined,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataFund(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const currValue     = player.getFund();
            const maxValue      = CommonConstants.WarRuleInitialFundMaxLimit;
            const minValue      = CommonConstants.WarRuleInitialFundMinLimit;
            const isCheating    = war.getCanCheat();
            return {
                titleText               : Lang.getText(LangTextType.B0032),
                infoText                : (isInfoKnown || isCheating) ? `${player.getFund()}` : `?`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : !isCheating
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : `P${player.getPlayerIndex()} ${Lang.getText(LangTextType.B0032)}`,
                            currentValue    : "" + currValue,
                            maxChars        : 7,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    player.setFund(value);
                                    menuPanel.updateListPlayer();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataBuildings(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const info = getTilesCountAndIncome(war, player.getPlayerIndex());
            return {
                titleText               : Lang.getText(LangTextType.B0158),
                infoText                : `${info.count} / +${info.income}${isInfoKnown ? `` : `  ?`}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataCoName(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const cfg = ConfigManager.getCoBasicCfg(war.getConfigVersion(), player.getCoId());
            return {
                titleText               : `CO`,
                infoText                : cfg.name,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        const currentCoId = player.getCoId();
                        TwnsCommonChooseCoPanel.CommonChooseCoPanel.show({
                            currentCoId,
                            availableCoIdArray  : ConfigManager.getEnabledCoArray(war.getConfigVersion()).map(v => v.coId),
                            callbackOnConfirm   : (newCoId) => {
                                if (newCoId !== currentCoId) {
                                    player.setCoId(newCoId);
                                    player.setCoCurrentEnergy(Math.min(player.getCoCurrentEnergy(), player.getCoMaxEnergy()));

                                    war.getTileMap().getView().updateCoZone();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataEnergy(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const currValue         = player.getCoCurrentEnergy();
            const maxValue          = player.getCoMaxEnergy();
            const minValue          = 0;
            const powerEnergy       = player.getCoPowerEnergy();
            const superPowerEnergy  = player.getCoSuperPowerEnergy();
            const skillType         = player.getCoUsingSkillType();
            const playerIndex       = player.getPlayerIndex();
            const hasLoadedCo       = war.getUnitMap().checkIsCoLoadedByAnyUnit(playerIndex);
            const currEnergyText    = skillType === Types.CoSkillType.Passive
                ? "" + currValue
                : skillType === Types.CoSkillType.Power ? "COP" : "SCOP";

            return {
                titleText               : Lang.getText(LangTextType.B0159),
                infoText                : `${!hasLoadedCo ? `--` : currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : ((!war.getCanCheat()) || (!maxValue))
                    ? null
                    : () => {
                        if (!hasLoadedCo) {
                            FloatText.show(Lang.getText(LangTextType.A0109));
                        } else {
                            TwnsCommonInputPanel.CommonInputPanel.show({
                                title           : `P${playerIndex} ${Lang.getText(LangTextType.B0159)}`,
                                currentValue    : "" + currValue,
                                maxChars        : 3,
                                charRestrict    : "0-9",
                                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                                callback        : panel => {
                                    const text  = panel.getInputText();
                                    const value = text ? Number(text) : NaN;
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(LangTextType.A0098));
                                    } else {
                                        player.setCoCurrentEnergy(value);
                                        menuPanel.updateListPlayer();
                                    }
                                },
                            });
                        }
                    },
            };
        }
        private _createDataUnitAndValue(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel
        ): DataForInfoRenderer {
            const unitsCountAndValue = getUnitsCountAndValue(war, player.getPlayerIndex());
            return {
                titleText               : Lang.getText(LangTextType.B0160),
                infoText                : `${unitsCountAndValue.count} / ${unitsCountAndValue.value}${isInfoKnown ? `` : `  ?`}`,
                infoColor               : 0xFFFFFF,
                callbackOnTouchedTitle  : null,
            };
        }
        private _createDataInitialFund(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(LangTextType.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                        const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0178),
                            currentValue    : "" + currValue,
                            maxChars        : 7,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    WarRuleHelpers.setInitialFund(war.getWarRule(), playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                },
            };
        }
        private _createDataIncomeMultiplier(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsIncomeMultiplier(playerIndex);
            const maxValue      = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue      = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0179),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    WarRuleHelpers.setIncomeMultiplier(war.getWarRule(), playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataEnergyAddPctOnLoadCo(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsEnergyAddPctOnLoadCo(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyAddPctOnLoadCoMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0180),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    WarRuleHelpers.setEnergyAddPctOnLoadCo(war.getWarRule(), playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataEnergyGrowthMultiplier(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsEnergyGrowthMultiplier(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0181),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    WarRuleHelpers.setEnergyGrowthMultiplier(war.getWarRule(), playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataMoveRangeModifier(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsMoveRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0182),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    WarRuleHelpers.setMoveRangeModifier(war.getWarRule(), playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataAttackPowerModifier(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsAttackPowerModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0183),
                            currentValue    : "" + currValue,
                            maxChars        : 5,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    WarRuleHelpers.setAttackPowerModifier(war.getWarRule(), playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataVisionRangeModifier(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0184),
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    WarRuleHelpers.setVisionRangeModifier(war.getWarRule(), playerIndex, value);
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataLuckLowerLimit(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0189),
                            currentValue    : "" + currValue,
                            maxChars        : 4,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    const upperLimit    = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
                                    const warRule       = war.getWarRule();
                                    if (value <= upperLimit) {
                                        WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                                    } else {
                                        WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                                        WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, upperLimit);
                                    }
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
        private _createDataLuckUpperLimit(
            war         : SpwWar,
            player      : BwPlayer,
            isInfoKnown : boolean,
            menuPanel   : SpwWarMenuPanel,
        ): DataForInfoRenderer {
            const playerIndex   = player.getPlayerIndex();
            const currValue     = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(LangTextType.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
                callbackOnTouchedTitle  : !war.getCanCheat()
                    ? null
                    : () => {
                        TwnsCommonInputPanel.CommonInputPanel.show({
                            title           : Lang.getText(LangTextType.B0190),
                            currentValue    : "" + currValue,
                            maxChars        : 4,
                            charRestrict    : "0-9\\-",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(LangTextType.A0098));
                                } else {
                                    const lowerLimit    = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
                                    const warRule       = war.getWarRule();
                                    if (value >= lowerLimit) {
                                        WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, value);
                                    } else {
                                        WarRuleHelpers.setLuckLowerLimit(warRule, playerIndex, value);
                                        WarRuleHelpers.setLuckUpperLimit(warRule, playerIndex, lowerLimit);
                                    }
                                    this._updateView();
                                }
                            },
                        });
                    },
            };
        }
    }

    type DataForInfoRenderer = {
        titleText               : string;
        infoText                : string;
        infoColor               : number;
        callbackOnTouchedTitle  : (() => void) | null;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _btnTitle!     : TwnsUiButton.UiButton;
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnTitle, callback: this._onTouchedBtnTitle },
            ]);
        }

        protected _onDataChanged(): void {
            const data                  = this._getData();
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
            this._btnTitle.label        = data.titleText;
            this._btnTitle.setTextColor(data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF);
        }

        private _onTouchedBtnTitle(): void {
            const data      = this.data;
            const callback  = data ? data.callbackOnTouchedTitle : null;
            (callback) && (callback());
        }
    }

    function getTilesCountAndIncome(war: SpwWar, playerIndex: number): { count: number, income: number } {
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

    function getUnitsCountAndValue(war: SpwWar, playerIndex: number): { count: number, value: number } {
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

export default TwnsSpwWarMenuPanel;
