
import TwnsBwWar                from "../../baseWar/model/BwWar";
import TwnsBwUnitListPanel      from "../../baseWar/view/BwUnitListPanel";
import ChatModel                from "../../chat/model/ChatModel";
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import FloatText                from "../../tools/helpers/FloatText";
import Helpers                  from "../../tools/helpers/Helpers";
import SoundManager             from "../../tools/helpers/SoundManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import TwnsUserPanel            from "../../user/view/UserPanel";
import TwnsSpwWarMenuPanel      from "./SpwWarMenuPanel";

namespace TwnsSpwTopPanel {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import ChatPanel            = TwnsChatPanel.ChatPanel;
    import UserPanel            = TwnsUserPanel.UserPanel;
    import BwUnitListPanel      = TwnsBwUnitListPanel.BwUnitListPanel;
    import SpwWarMenuPanel      = TwnsSpwWarMenuPanel.SpwWarMenuPanel;
    import BwWar                = TwnsBwWar.BwWar;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;

    type OpenData = {
        war : BwWar;
    };
    export class SpwTopPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: SpwTopPanel;

        private readonly _groupPlayer!          : eui.Group;
        private readonly _labelPlayer!          : TwnsUiLabel.UiLabel;
        private readonly _labelSinglePlayer!    : TwnsUiLabel.UiLabel;
        private readonly _labelFund!            : TwnsUiLabel.UiLabel;
        private readonly _groupCo!              : eui.Group;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;
        private readonly _labelCurrEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelPowerEnergy!     : TwnsUiLabel.UiLabel;
        private readonly _labelZoneEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _btnChat!              : TwnsUiButton.UiButton;
        private readonly _btnUnitList!          : TwnsUiButton.UiButton;
        private readonly _btnFindBuilding!      : TwnsUiButton.UiButton;
        private readonly _btnEndTurn!           : TwnsUiButton.UiButton;
        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnMenu!              : TwnsUiButton.UiButton;

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
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwTurnPhaseCodeChanged,         callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: NotifyType.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.MsgChatGetAllReadProgressList,  callback: this._onMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,      callback: this._onMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,          callback: this._onMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,              callback: this._onMsgChatAddMessage },
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
            this._btnCancel.setShortSfxCode(Types.ShortSfxCode.None);

            this._updateView();
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
            SoundManager.playCoBgmWithWar(this._getOpenData().war, false);
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelCoAndEnergy();
            SoundManager.playCoBgmWithWar(this._getOpenData().war, false);
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
            const userId = this._getOpenData().war.getPlayerInTurn().getUserId();
            (userId) && (UserPanel.show({ userId }));
        }
        private _onTouchedGroupCo(): void {
            const war = this._getOpenData().war;
            TwnsCommonCoListPanel.CommonCoListPanel.show({ war });
            SpwWarMenuPanel.hide();
        }
        private _onTouchedBtnChat(): void {
            SpwWarMenuPanel.hide();
            ChatPanel.show({});
        }
        private _onTouchedBtnUnitList(): void {
            const war = this._getOpenData().war;
            war.getField().getActionPlanner().setStateIdle();
            BwUnitListPanel.show({ war });
        }
        private _onTouchedBtnFindBuilding(): void {
            const war           = this._getOpenData().war;
            const field         = war.getField();
            const actionPlanner = field.getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();

                const gridIndex = WarCommonHelpers.getIdleBuildingGridIndex(war);
                if (!gridIndex) {
                    FloatText.show(Lang.getText(LangTextType.A0077));
                } else {
                    const cursor = field.getCursor();
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                }
            }
        }
        private _onTouchedBtnEndTurn(): void {
            const war = this._getOpenData().war;
            if ((war.getDrawVoteManager().getRemainingVotes()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
                FloatText.show(Lang.getText(LangTextType.A0034));
            } else {
                CommonConfirmPanel.show({
                    title   : Lang.getText(LangTextType.B0036),
                    content : this._getHintForEndTurn(),
                    callback: () => war.getActionPlanner().setStateRequestingPlayerEndTurn(),
                });
            }
        }
        private _onTouchedBtnCancel(): void {
            this._getOpenData().war.getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnMenu(): void {
            const actionPlanner = this._getOpenData().war.getActionPlanner();
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
            this._labelSinglePlayer.text = Lang.getText(LangTextType.B0138);
        }

        private _updateLabelPlayer(): void {
            const war                   = this._getOpenData().war;
            const player                = war.getPlayerInTurn();
            const name                  = player.getUserId() != null ? Lang.getText(LangTextType.B0031) : Lang.getText(LangTextType.B0256);
            this._labelPlayer.text      = `${name} (${Lang.getPlayerForceName(player.getPlayerIndex())}, ${Lang.getUnitAndTileSkinName(player.getUnitAndTileSkinId())})`;
            this._labelPlayer.textColor = 0xFFFFFF;
        }

        private _updateLabelFund(): void {
            const war               = this._getOpenData().war;
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
            const war = this._getOpenData().war;
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
            const war                   = this._getOpenData().war;
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.visible    = (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main)
                && (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle);
        }

        private _updateBtnFindUnit(): void {
            const war                   = this._getOpenData().war;
            const turnManager           = war.getTurnManager();
            this._btnUnitList.visible   = (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnFindBuilding(): void {
            const war                       = this._getOpenData().war;
            const turnManager               = war.getTurnManager();
            this._btnFindBuilding.visible   = (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnCancel(): void {
            const war               = this._getOpenData().war;
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
            const war           = this._getOpenData().war;
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
                (idleUnitsCount) && (hints.push(Lang.getFormattedText(LangTextType.F0006, idleUnitsCount)));
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
                            Helpers.getExisted(idleBuildingsDict.get(tileType)).push(gridIndex);
                        }
                    }
                }
                const textArrayForBuildings: string[] = [];
                for (const [tileType, gridIndexArray] of idleBuildingsDict) {
                    textArrayForBuildings.push(Lang.getFormattedText(
                        LangTextType.F0007, gridIndexArray.length,
                        Lang.getTileName(tileType),
                        gridIndexArray.map(v => `(${v.x}, ${v.y})`).join(`, `)),
                    );
                }
                (textArrayForBuildings.length) && (hints.push(textArrayForBuildings.join(`\n`)));
            }

            hints.push(Lang.getText(LangTextType.A0024));
            return hints.join(`\n\n`);
        }
    }
}

export default TwnsSpwTopPanel;
