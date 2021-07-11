
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { ChatPanel }                    from "../../chat/view/ChatPanel";
import { UserPanel }                    from "../../user/view/UserPanel";
import { BwCoListPanel }                from "../../baseWar/view/BwCoListPanel";
import { BwUnitListPanel }              from "../../baseWar/view/BwUnitListPanel";
import { SpwWarMenuPanel }              from "./SpwWarMenuPanel";
import { BwWar }                        from "../../baseWar/model/BwWar";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as FloatText                   from "../../../utility/FloatText";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as Types                       from "../../../utility/Types";
import * as BwHelpers                   from "../../baseWar/model/BwHelpers";
import * as ChatModel                   from "../../chat/model/ChatModel";

type OpenData = {
    war : BwWar;
};
export class SpwTopPanel extends UiPanel<OpenData> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: SpwTopPanel;

    private _groupPlayer        : eui.Group;
    private _labelPlayer        : UiLabel;
    private _labelSinglePlayer  : UiLabel;
    private _labelFund          : UiLabel;
    private _groupCo            : eui.Group;
    private _labelCo            : UiLabel;
    private _labelCurrEnergy    : UiLabel;
    private _labelPowerEnergy   : UiLabel;
    private _labelZoneEnergy    : UiLabel;
    private _btnChat            : UiButton;
    private _btnUnitList        : UiButton;
    private _btnFindBuilding    : UiButton;
    private _btnEndTurn         : UiButton;
    private _btnCancel          : UiButton;
    private _btnMenu            : UiButton;

    private _war    : BwWar;

    public static show(openData: OpenData): void {
        if (!SpwTopPanel._instance) {
            SpwTopPanel._instance = new SpwTopPanel();
        }
        SpwTopPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (SpwTopPanel._instance) {
            await SpwTopPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/singlePlayerWar/SpwTopPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.BwTurnPhaseCodeChanged,         callback: this._onNotifyBwTurnPhaseCodeChanged },
            { type: Notify.Type.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
            { type: Notify.Type.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
            { type: Notify.Type.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
            { type: Notify.Type.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
            { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
            { type: Notify.Type.MsgChatGetAllReadProgressList,  callback: this._onMsgChatGetAllReadProgressList },
            { type: Notify.Type.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
            { type: Notify.Type.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
            { type: Notify.Type.MsgChatAddMessage,              callback: this._onMsgChatAddMessage },
        ]);
        this._setUiListenerArray([
            { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
            { ui: this._groupCo,            callback: this._onTouchedGroupCo },
            { ui: this._btnChat,            callback: this._onTouchedBtnChat },
            { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
            { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
            { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
            { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
            { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
        ]);

        this._war = this._getOpenData().war;
        this._updateView();
    }

    protected async _onClosed(): Promise<void> {
        this._war = null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyBwTurnPhaseCodeChanged(): void {
        this._updateBtnEndTurn();
        this._updateBtnFindUnit();
        this._updateBtnFindBuilding();
        this._updateBtnCancel();
    }
    private _onNotifyBwPlayerFundChanged(): void {
        this._updateLabelFund();
    }
    private _onNotifyBwPlayerIndexInTurnChanged(): void {
        this._updateView();
    }
    private _onNotifyBwCoEnergyChanged(): void {
        this._updateLabelCoAndEnergy();
    }
    private _onNotifyBwCoUsingSkillChanged(): void {
        this._updateLabelCoAndEnergy();
    }
    private _onNotifyBwActionPlannerStateChanged(): void {
        this._updateBtnEndTurn();
        this._updateBtnCancel();
    }
    private _onMsgChatGetAllReadProgressList(): void {
        this._updateBtnChat();
    }
    private _onMsgChatUpdateReadProgress(): void {
        this._updateBtnChat();
    }
    private _onMsgChatGetAllMessages(): void {
        this._updateBtnChat();
    }
    private _onMsgChatAddMessage(): void {
        this._updateBtnChat();
    }

    private _onTouchedGroupPlayer(): void {
        const userId = this._war.getPlayerInTurn().getUserId();
        (userId) && (UserPanel.show({ userId }));
    }
    private _onTouchedGroupCo(): void {
        const war = this._war;
        BwCoListPanel.show({
            war,
            selectedIndex: Math.max(war.getPlayerIndexInTurn() - 1, 0),
        });
        SpwWarMenuPanel.hide();
    }
    private _onTouchedBtnChat(): void {
        SpwWarMenuPanel.hide();
        ChatPanel.show({});
    }
    private _onTouchedBtnUnitList(): void {
        const war = this._war;
        war.getField().getActionPlanner().setStateIdle();
        BwUnitListPanel.show({ war });
    }
    private _onTouchedBtnFindBuilding(): void {
        const war           = this._war;
        const field         = war.getField();
        const actionPlanner = field.getActionPlanner();
        if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
            actionPlanner.setStateIdle();

            const gridIndex = BwHelpers.getIdleBuildingGridIndex(war);
            if (!gridIndex) {
                FloatText.show(Lang.getText(Lang.Type.A0077));
            } else {
                const cursor = field.getCursor();
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
            }
        }
    }
    private _onTouchedBtnEndTurn(): void {
        const war = this._war;
        if ((war.getDrawVoteManager().getRemainingVotes()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
            FloatText.show(Lang.getText(Lang.Type.A0034));
        } else {
            CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0036),
                content : this._getHintForEndTurn(),
                callback: () => this._war.getActionPlanner().setStateRequestingPlayerEndTurn(),
            });
        }
    }
    private _onTouchedBtnCancel(): void {
        this._war.getField().getActionPlanner().setStateIdle();
    }
    private _onTouchedBtnMenu(): void {
        const actionPlanner = this._war.getActionPlanner();
        if (!actionPlanner.checkIsStateRequesting()) {
            actionPlanner.setStateIdle();
        }
        SpwWarMenuPanel.show();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for views.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelPlayer();
        this._updateLabelFund();
        this._updateLabelCoAndEnergy();
        this._updateBtnEndTurn();
        this._updateBtnFindUnit();
        this._updateBtnFindBuilding();
        this._updateBtnCancel();
        this._updateBtnChat();
    }

    private _updateComponentsForLanguage(): void {
        this._labelSinglePlayer.text = Lang.getText(Lang.Type.B0138);
    }

    private _updateLabelPlayer(): void {
        const war                   = this._war;
        const player                = war.getPlayerInTurn();
        const name                  = player.getUserId() != null ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256);
        this._labelPlayer.text      = `${name} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`;
        this._labelPlayer.textColor = 0xFFFFFF;
    }

    private _updateLabelFund(): void {
        const war               = this._war;
        const playerInTurn      = war.getPlayerInTurn();
        if ((war.getFogMap().checkHasFogCurrently())                                                        &&
            (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(playerInTurn.getTeamIndex()))
        ) {
            this._labelFund.text = `????`;
        } else {
            this._labelFund.text = `${playerInTurn.getFund()}`;
        }
    }

    private _updateLabelCoAndEnergy(): void {
        const war = this._war;
        if ((war) && (war.getIsRunning())) {
            const player        = war.getPlayerInTurn();
            const coId          = player.getCoId();
            this._labelCo.text  = `${coId == null ? "----" : ConfigManager.getCoBasicCfg(war.getConfigVersion(), coId).name}`;

            const skillType = player.getCoUsingSkillType();
            if (skillType === Types.CoSkillType.Power) {
                this._labelCurrEnergy.text = "COP";
            } else if (skillType === Types.CoSkillType.SuperPower) {
                this._labelCurrEnergy.text = "SCOP";
            } else {
                const currentEnergy = player.getCoCurrentEnergy();
                this._labelCurrEnergy.text = `${currentEnergy == null ? `--` : currentEnergy}`;
            }

            const powerEnergy           = player.getCoPowerEnergy();
            const superPowerEnergy      = player.getCoSuperPowerEnergy();
            this._labelPowerEnergy.text = `P ${powerEnergy == null ? `--` : powerEnergy} / ${superPowerEnergy == null ? `--` : superPowerEnergy}`;

            const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
            this._labelZoneEnergy.text  = `Z ${zoneEnergyText.length ? zoneEnergyText : `--`}`;
        }
    }

    private _updateBtnEndTurn(): void {
        const war                   = this._war;
        const turnManager           = war.getTurnManager();
        this._btnEndTurn.visible    = (war.checkIsHumanInTurn())
            && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
            && (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
    }

    private _updateBtnFindUnit(): void {
        const war                   = this._war;
        const turnManager           = war.getTurnManager();
        this._btnUnitList.visible   = (war.checkIsHumanInTurn())
            && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
    }

    private _updateBtnFindBuilding(): void {
        const war                       = this._war;
        const turnManager               = war.getTurnManager();
        this._btnFindBuilding.visible   = (war.checkIsHumanInTurn())
            && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
    }

    private _updateBtnCancel(): void {
        const war               = this._war;
        const turnManager       = war.getTurnManager();
        const actionPlanner     = war.getActionPlanner();
        const state             = actionPlanner.getState();
        this._btnCancel.visible = (war.checkIsHumanInTurn())
            && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
            && (state !== Types.ActionPlannerState.Idle)
            && (state !== Types.ActionPlannerState.ExecutingAction)
            && (!actionPlanner.checkIsStateRequesting());
    }

    private _updateBtnChat(): void {
        this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _getHintForEndTurn(): string {
        const war           = this._war;
        const playerIndex   = war.getPlayerIndexInTurn();
        const unitMap       = war.getUnitMap();
        const hints         = new Array<string>();

        {
            let idleUnitsCount = 0;
            for (const unit of unitMap.getAllUnitsOnMap()) {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getActionState() === Types.UnitActionState.Idle)) {
                    ++idleUnitsCount;
                }
            }
            (idleUnitsCount) && (hints.push(Lang.getFormattedText(Lang.Type.F0006, idleUnitsCount)));
        }

        {
            const idleBuildingsDict = new Map<Types.TileType, Types.GridIndex[]>();
            for (const tile of war.getTileMap().getAllTiles()) {
                if ((tile.checkIsUnitProducerForPlayer(playerIndex)) && (!unitMap.getUnitOnMap(tile.getGridIndex()))) {
                    const tileType  = tile.getType();
                    const gridIndex = tile.getGridIndex();
                    if (!idleBuildingsDict.has(tileType)) {
                        idleBuildingsDict.set(tileType, [gridIndex]);
                    } else {
                        idleBuildingsDict.get(tileType).push(gridIndex);
                    }
                }
            }
            const textArrayForBuildings: string[] = [];
            for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                textArrayForBuildings.push(Lang.getFormattedText(
                    Lang.Type.F0007, gridIndexArray.length,
                    Lang.getTileName(tileType),
                    gridIndexArray.map(v => `(${v.x}, ${v.y})`).join(`, `)),
                );
            }
            (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
        }

        hints.push(Lang.getText(Lang.Type.A0024));
        return hints.join(`\n\n`);
    }
}
