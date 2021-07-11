
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { ChatPanel }                    from "../../chat/view/ChatPanel";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonInputPanel }             from "../../common/view/CommonInputPanel";
import { UserSettingsPanel }            from "../../user/view/UserSettingsPanel";
import { MfrCreateSettingsPanel }       from "../../multiFreeRoom/view/MfrCreateSettingsPanel";
import { SpmCreateSfwSaveSlotsPanel }   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import { BwPlayer }                     from "../../baseWar/model/BwPlayer";
import { BwUnitMap }                    from "../../baseWar/model/BwUnitMap";
import { BwCoListPanel }                from "../../baseWar/view/BwCoListPanel";
import { SpwActionPlanner }             from "../model/SpwActionPlanner";
import { SpwPlayerManager }             from "../model/SpwPlayerManager";
import { SpwWar }                       from "../model/SpwWar";
import { SpwChooseCoPanel }             from "./SpwChooseCoPanel";
import { SpwLoadWarPanel }              from "./SpwLoadWarPanel";
import { TwWar }                        from "../../testWar/model/TwWar";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as FloatText                   from "../../../utility/FloatText";
import * as FlowManager                 from "../../../utility/FlowManager";
import * as Lang                        from "../../../utility/Lang";
import * as Logger                      from "../../../utility/Logger";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as BwWarRuleHelper             from "../../baseWar/model/BwWarRuleHelper";
import * as MfrModel                    from "../../multiFreeRoom/model/MfrModel";
import * as UserModel                   from "../../user/model/UserModel";
import * as UserProxy                   from "../../user/model/UserProxy";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as SpmProxy                    from "../../singlePlayerMode/model/SpmProxy";
import * as SpwModel                    from "../model/SpwModel";

// eslint-disable-next-line no-shadow
const enum MenuType {
    Main,
    Advanced,
}

export class SpwWarMenuPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: SpwWarMenuPanel;

    private _group          : eui.Group;
    private _listCommand    : UiScrollList<DataForCommandRenderer>;
    private _labelNoCommand : UiLabel;
    private _btnBack        : UiButton;

    private _groupInfo              : eui.Group;
    private _labelMenuTitle         : UiLabel;
    private _labelWarInfoTitle      : UiLabel;
    private _labelPlayerInfoTitle   : UiLabel;
    private _btnMapNameTitle        : UiButton;
    private _labelMapName           : UiLabel;
    private _listWarInfo            : UiScrollList<DataForInfoRenderer>;
    private _btnBuildings           : UiButton;
    private _listPlayer             : UiScrollList<DataForPlayerRenderer>;

    private _war            : SpwWar;
    private _unitMap        : BwUnitMap;
    private _actionPlanner  : SpwActionPlanner;
    private _dataForList    : DataForCommandRenderer[];
    private _menuType       = MenuType.Main;

    public static show(): void {
        if (!SpwWarMenuPanel._instance) {
            SpwWarMenuPanel._instance = new SpwWarMenuPanel();
        }
        SpwWarMenuPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (SpwWarMenuPanel._instance) {
            await SpwWarMenuPanel._instance.close();
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
            { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.BwActionPlannerStateChanged,        callback: this._onNotifyBwPlannerStateChanged },
            { type: Notify.Type.BwCoIdChanged,                      callback: this._onNotifyBwCoIdChanged },
            { type: Notify.Type.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
            { type: Notify.Type.MsgSpmSaveScw,                      callback: this._onMsgSpmSaveScw },
            { type: Notify.Type.MsgSpmSaveSfw,                      callback: this._onMsgSpmSaveSfw },
            { type: Notify.Type.MsgSpmCreateSfw,                    callback: this._onMsgSpmCreateSfw },
            { type: Notify.Type.MsgSpmDeleteWarSaveSlot,            callback: this._onNotifyMsgSpmDeleteWarSaveSlot },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack, callback: this._onTouchedBtnBack },
        ]);
        this._listCommand.setItemRenderer(CommandRenderer);
        this._listPlayer.setItemRenderer(PlayerRenderer);
        this._listWarInfo.setItemRenderer(InfoRenderer);

        const war           = SpwModel.getWar();
        this._war           = war;
        this._unitMap       = war.getUnitMap();
        this._actionPlanner = war.getActionPlanner() as SpwActionPlanner;
        this._menuType      = MenuType.Main;

        this._updateView();

        Notify.dispatch(Notify.Type.BwWarMenuPanelOpened);
    }
    protected async _onClosed(): Promise<void> {
        this._war           = null;
        this._unitMap       = null;
        this._dataForList   = null;

        Notify.dispatch(Notify.Type.BwWarMenuPanelClosed);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyBwPlannerStateChanged(): void {
        const war = this._war;
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
        FloatText.show(Lang.getText(Lang.Type.A0073));
    }

    private _onMsgSpmSaveSfw(): void {
        FloatText.show(Lang.getText(Lang.Type.A0073));
    }

    private _onMsgSpmCreateSfw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
        CommonConfirmPanel.show({
            content : Lang.getText(Lang.Type.A0107),
            callback: () => {
                FlowManager.gotoSinglePlayerWar({
                    slotIndex       : data.slotIndex,
                    slotExtraData   : data.extraData,
                    warData         : data.warData,
                });
            },
        });
    }

    private _onNotifyMsgSpmDeleteWarSaveSlot(): void {
        FloatText.show(Lang.getFormattedText(Lang.Type.A0141));
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
            Logger.error(`McwWarMenuPanel._onTouchedBtnBack() invalid this._menuType: ${type}`);
            this.close();
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
        this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0155);
        this._labelWarInfoTitle.text    = Lang.getText(Lang.Type.B0223);
        this._labelPlayerInfoTitle.text = Lang.getText(Lang.Type.B0224);
        this._btnMapNameTitle.label     = Lang.getText(Lang.Type.B0225);
        this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        this._updateListWarInfo();
    }

    private async _updateGroupInfo(): Promise<void> {
        const war               = this._war;
        const mapFileName       = war.getMapId();
        this._labelMapName.text = `${await WarMapModel.getMapNameInCurrentLanguage(mapFileName) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getDesignerName(mapFileName) || "----"})`;
    }

    private _updateListWarInfo(): void {
        const dataList: DataForInfoRenderer[] = [
            this._createWarInfoTurnIndex(),
        ];
        this._listWarInfo.bindData(dataList);
    }

    public updateListPlayer(): void {
        const war   = this._war;
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
        const war                   = this._war;
        const turnIndex             = war.getTurnManager().getTurnIndex();
        const executedActionsCount  = war.getExecutedActionManager().getExecutedActionsCount();
        return {
            titleText               : Lang.getText(Lang.Type.B0091),
            infoText                : `${turnIndex} (${Lang.getText(Lang.Type.B0090)}: ${executedActionsCount})`,
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
            Logger.error(`McwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`);
            return [];
        }
    }

    private _createDataForMainMenu(): DataForCommandRenderer[] {
        return [
            // this._createCommandOpenCoInfoMenu(),
            this._createCommandSaveScw(),
            this._createCommandSaveSfw(),
            this._createCommandLoadGame(),
            this._createCommandOpenAdvancedMenu(),
            // this._createCommandChat(),
            this._createCommandGotoLobby(),
        ].filter(v => !!v);
    }

    private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
        return [
            this._createCommandPlayerDeleteUnit(),
            this._createCommandSimulation(),
            this._createCommandCreateMfr(),
            this._createCommandDeleteWar(),
            this._createCommandUserSettings(),
            this._createCommandSetPathMode(),
        ].filter(v => !!v);
    }

    private _createCommandOpenAdvancedMenu(): DataForCommandRenderer | undefined {
        return {
            name    : Lang.getText(Lang.Type.B0080),
            callback: () => {
                this._menuType = MenuType.Advanced;
                this._updateListCommand();
            },
        };
    }

    private _createCommandChat(): DataForCommandRenderer | null {
        return {
            name    : Lang.getText(Lang.Type.B0383),
            callback: () => {
                this.close();
                ChatPanel.show({});
            },
        };
    }

    private _createCommandOpenCoInfoMenu(): DataForCommandRenderer | undefined {
        return {
            name    : Lang.getText(Lang.Type.B0140),
            callback: () => {
                const war = this._war;
                BwCoListPanel.show({
                    war,
                    selectedIndex: war.getPlayerIndexInTurn() - 1,
                });
                this.close();
            },
        };
    }

    private _createCommandSaveScw(): DataForCommandRenderer | null {
        const war = this._war;
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
            name    : Lang.getText(Lang.Type.B0260),
            callback: () => {
                CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0071),
                    callback: () => {
                        SpmProxy.reqSpmSaveScw(war);
                    },
                });
            },
        };
    }

    private _createCommandSaveSfw(): DataForCommandRenderer | null {
        const war = this._war;
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
            name    : Lang.getText(Lang.Type.B0260),
            callback: () => {
                CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0071),
                    callback: () => {
                        SpmProxy.reqSpmSaveSfw(war);
                    },
                });
            },
        };
    }

    private _createCommandLoadGame(): DataForCommandRenderer | null {
        const war = this._war;
        if ((!war)                                                              ||
            (!war.checkIsHumanInTurn())                                         ||
            (!war.getTurnManager().getPhaseCode())                              ||
            (war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)
        ) {
            return null;
        } else {
            return {
                name    : Lang.getText(Lang.Type.B0261),
                callback: () => {
                    SpwLoadWarPanel.show();
                },
            };
        }
    }

    private _createCommandGotoLobby(): DataForCommandRenderer | undefined {
        return {
            name    : Lang.getText(Lang.Type.B0054),
            callback: () => {
                CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0054),
                    content : Lang.getText(Lang.Type.A0025),
                    callback: () => FlowManager.gotoLobby(),
                });
            },
        };
    }

    private _createCommandPlayerDeleteUnit(): DataForCommandRenderer | undefined {
        const war = this._war;
        if ((!war.checkIsHumanInTurn())                                         ||
            (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
            (this._actionPlanner.getState() !== Types.ActionPlannerState.Idle)
        ) {
            return undefined;
        } else {
            return {
                name    : Lang.getText(Lang.Type.B0081),
                callback: () => {
                    const unitMap       = war.getUnitMap();
                    const unit          = unitMap.getUnitOnMap(war.getCursor().getGridIndex());
                    const playerIndex   = war.getPlayerIndexInTurn();
                    if (!unit) {
                        FloatText.show(Lang.getText(Lang.Type.A0027));
                    } else if ((unit.getPlayerIndex() !== playerIndex) || (unit.getActionState() !== Types.UnitActionState.Idle)) {
                        FloatText.show(Lang.getText(Lang.Type.A0028));
                    } else if (unitMap.countUnitsOnMapForPlayer(playerIndex) <= 1) {
                        FloatText.show(Lang.getText(Lang.Type.A0076));
                    } else {
                        CommonConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0081),
                            content : Lang.getText(Lang.Type.A0029),
                            callback: () => this._actionPlanner.setStateRequestingPlayerDeleteUnit(),
                        });
                    }
                },
            };
        }
    }

    private _createCommandSimulation(): DataForCommandRenderer | null {
        const war = this._war;
        return {
            name    : Lang.getText(Lang.Type.B0325),
            callback: () => {
                if (war.getIsExecutingAction()) {
                    FloatText.show(Lang.getText(Lang.Type.A0103));
                } else {
                    SpmCreateSfwSaveSlotsPanel.show(war.serializeForCreateSfw());
                }
            },
        };
    }

    private _createCommandCreateMfr(): DataForCommandRenderer | null {
        const war = this._war;
        return {
            name    : Lang.getText(Lang.Type.B0557),
            callback: async () => {
                if (war.getPlayerManager().getAliveOrDyingTeamsCount(false) < 2) {
                    FloatText.show(Lang.getText(Lang.Type.A0199));
                    return;
                }

                const warData = war.serializeForCreateMfr();
                if (warData == null) {
                    FloatText.show(Lang.getText(Lang.Type.A0200));
                    return;
                }

                const errorCode = await (new TwWar()).init(warData);
                if (errorCode) {
                    FloatText.show(Lang.getErrorText(errorCode));
                    return;
                }

                CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0201),
                    callback: () => {
                        MfrModel.Create.resetDataByInitialWarData(warData);
                        MfrCreateSettingsPanel.show();
                        this.close();
                    }
                });
            }
        };
    }

    private _createCommandDeleteWar(): DataForCommandRenderer | null {
        const war           = this._war;
        const saveSlotIndex = war ? war.getSaveSlotIndex() : null;
        return saveSlotIndex == null
            ? null
            : {
                name    : Lang.getText(Lang.Type.B0420),
                callback: () => {
                    CommonConfirmPanel.show({
                        content : Lang.getText(Lang.Type.A0140),
                        callback: () => {
                            SpmProxy.reqSpmDeleteWarSaveSlot(saveSlotIndex);
                        },
                    });
                },
            };
    }
    private _createCommandUserSettings(): DataForCommandRenderer | null {
        return {
            name    : Lang.getText(Lang.Type.B0560),
            callback: () => {
                UserSettingsPanel.show();
            }
        };
    }
    private _createCommandSetPathMode(): DataForCommandRenderer {
        return {
            name    : Lang.getText(Lang.Type.B0430),
            callback: () => {
                const isEnabled = UserModel.getSelfSettingsIsSetPathMode();
                CommonConfirmPanel.show({
                    content : Lang.getFormattedText(
                        Lang.Type.F0033,
                        Lang.getText(isEnabled ? Lang.Type.B0431 : Lang.Type.B0432),
                    ),
                    textForConfirm  : Lang.getText(Lang.Type.B0433),
                    textForCancel   : Lang.getText(Lang.Type.B0434),
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

class CommandRenderer extends UiListItemRenderer<DataForCommandRenderer> {
    private _group      : eui.Group;
    private _labelName  : UiLabel;

    protected _onDataChanged(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        this.data.callback();
    }

    private _updateView(): void {
        const data = this.data;
        this._labelName.text    = data.name;
    }
}

type DataForPlayerRenderer = {
    war         : SpwWar;
    playerIndex : number;
    panel       : SpwWarMenuPanel;
};

class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private _group          : eui.Group;
    private _btnName        : UiButton;
    private _labelForce     : UiLabel;
    private _labelLost      : UiLabel;
    private _listInfo       : UiScrollList<DataForInfoRenderer>;

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
        const data  = this.data;
        const war   = data.war;
        if (war.getCanCheat()) {
            const playerIndex   = data.playerIndex;
            const player        = war.getPlayer(playerIndex);
            const isHuman       = player.getUserId() != null;
            CommonConfirmPanel.show({
                content : isHuman ? Lang.getText(Lang.Type.A0110) : Lang.getText(Lang.Type.A0111),
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
        const data                  = this.data;
        const war                   = data.war;
        const playerIndex           = data.playerIndex;
        const player                = war.getPlayer(playerIndex);
        const isPlayerInTurn        = playerIndex === war.getPlayerIndexInTurn();
        this._btnName.label         = player.getUserId() != null ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256);
        this._labelForce.textColor  = isPlayerInTurn ? 0x00FF00 : 0xFFFFFF;
        this._labelForce.text       = `${Lang.getPlayerForceName(playerIndex)}`
            + `  ${Lang.getPlayerTeamName(player.getTeamIndex())}`
            + `  ${isPlayerInTurn ? Lang.getText(Lang.Type.B0086) : ""}`;
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
        const data          = this.data;
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
            titleText               : Lang.getText(Lang.Type.B0397),
            infoText                : Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId()),
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
            titleText               : Lang.getText(Lang.Type.B0032),
            infoText                : (isInfoKnown || isCheating) ? `${player.getFund()}` : `?`,
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : !isCheating
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : `P${player.getPlayerIndex()} ${Lang.getText(Lang.Type.B0032)}`,
                        currentValue    : "" + currValue,
                        maxChars        : 7,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
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
            titleText               : Lang.getText(Lang.Type.B0158),
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
                    SpwChooseCoPanel.show({
                        war,
                        playerIndex: player.getPlayerIndex(),
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
            titleText               : Lang.getText(Lang.Type.B0159),
            infoText                : `${!hasLoadedCo ? `--` : currEnergyText} / ${powerEnergy == null ? "--" : powerEnergy} / ${superPowerEnergy == null ? "--" : superPowerEnergy}`,
            infoColor               : 0xFFFFFF,
            callbackOnTouchedTitle  : ((!war.getCanCheat()) || (!maxValue))
                ? null
                : () => {
                    if (!hasLoadedCo) {
                        FloatText.show(Lang.getText(Lang.Type.A0109));
                    } else {
                        CommonInputPanel.show({
                            title           : `P${playerIndex} ${Lang.getText(Lang.Type.B0159)}`,
                            currentValue    : "" + currValue,
                            maxChars        : 3,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                const value = text ? Number(text) : NaN;
                                if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
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
            titleText               : Lang.getText(Lang.Type.B0160),
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
            titleText               : Lang.getText(Lang.Type.B0178),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    const maxValue  = CommonConstants.WarRuleInitialFundMaxLimit;
                    const minValue  = CommonConstants.WarRuleInitialFundMinLimit;
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0178),
                        currentValue    : "" + currValue,
                        maxChars        : 7,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                BwWarRuleHelper.setInitialFund(war.getWarRule(), playerIndex, value);
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
            titleText               : Lang.getText(Lang.Type.B0179),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0179),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                BwWarRuleHelper.setIncomeMultiplier(war.getWarRule(), playerIndex, value);
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
            titleText               : Lang.getText(Lang.Type.B0180),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0180),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                BwWarRuleHelper.setEnergyAddPctOnLoadCo(war.getWarRule(), playerIndex, value);
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
            titleText               : Lang.getText(Lang.Type.B0181),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0181),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                BwWarRuleHelper.setEnergyGrowthMultiplier(war.getWarRule(), playerIndex, value);
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
            titleText               : Lang.getText(Lang.Type.B0182),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0182),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                BwWarRuleHelper.setMoveRangeModifier(war.getWarRule(), playerIndex, value);
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
            titleText               : Lang.getText(Lang.Type.B0183),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0183),
                        currentValue    : "" + currValue,
                        maxChars        : 5,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                BwWarRuleHelper.setAttackPowerModifier(war.getWarRule(), playerIndex, value);
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
            titleText               : Lang.getText(Lang.Type.B0184),
            infoText                : `${currValue}`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0184),
                        currentValue    : "" + currValue,
                        maxChars        : 3,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                BwWarRuleHelper.setVisionRangeModifier(war.getWarRule(), playerIndex, value);
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
            titleText               : Lang.getText(Lang.Type.B0189),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0189),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                const upperLimit    = war.getCommonSettingManager().getSettingsLuckUpperLimit(playerIndex);
                                const warRule       = war.getWarRule();
                                if (value <= upperLimit) {
                                    BwWarRuleHelper.setLuckLowerLimit(warRule, playerIndex, value);
                                } else {
                                    BwWarRuleHelper.setLuckUpperLimit(warRule, playerIndex, value);
                                    BwWarRuleHelper.setLuckLowerLimit(warRule, playerIndex, upperLimit);
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
            titleText               : Lang.getText(Lang.Type.B0190),
            infoText                : `${currValue}%`,
            infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            callbackOnTouchedTitle  : !war.getCanCheat()
                ? null
                : () => {
                    CommonInputPanel.show({
                        title           : Lang.getText(Lang.Type.B0190),
                        currentValue    : "" + currValue,
                        maxChars        : 4,
                        charRestrict    : "0-9\\-",
                        tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                        callback        : panel => {
                            const text  = panel.getInputText();
                            const value = text ? Number(text) : NaN;
                            if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                FloatText.show(Lang.getText(Lang.Type.A0098));
                            } else {
                                const lowerLimit    = war.getCommonSettingManager().getSettingsLuckLowerLimit(playerIndex);
                                const warRule       = war.getWarRule();
                                if (value >= lowerLimit) {
                                    BwWarRuleHelper.setLuckUpperLimit(warRule, playerIndex, value);
                                } else {
                                    BwWarRuleHelper.setLuckLowerLimit(warRule, playerIndex, value);
                                    BwWarRuleHelper.setLuckUpperLimit(warRule, playerIndex, lowerLimit);
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
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private _btnTitle   : UiButton;
    private _labelValue : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnTitle, callback: this._onTouchedBtnTitle },
        ]);
    }

    protected _onDataChanged(): void {
        const data                  = this.data;
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
