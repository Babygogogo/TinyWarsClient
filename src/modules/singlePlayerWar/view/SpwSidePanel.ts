
// import TwnsBwWarInfoPanel       from "../../baseWar/view/BwWarInfoPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsSpwWar               from "../model/SpwWar";
// import TwnsSpwWarMenuPanel      from "./SpwWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsSpwSidePanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenData = {
        war     : TwnsSpwWar.SpwWar;
    };
    export class SpwSidePanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupLeft!    : eui.Group;
        private readonly _btnCop!       : TwnsUiButton.UiButton;
        private readonly _btnScop!      : TwnsUiButton.UiButton;

        private readonly _groupRight!   : eui.Group;
        private readonly _btnNextUnit!  : TwnsUiButton.UiButton;
        private readonly _btnNextTile!  : TwnsUiButton.UiButton;
        private readonly _btnEndTurn!   : TwnsUiButton.UiButton;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnInfo!      : TwnsUiButton.UiButton;
        private readonly _btnMenu!      : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwTurnPhaseCodeChanged,          callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwActionPlannerStateChanged,     callback: this._onNotifyBwActionPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCop,             callback: this._onTouchedBtnCop },
                { ui: this._btnScop,            callback: this._onTouchedBtnScop },
                { ui: this._btnNextUnit,        callback: this._onTouchedBtnNextUnit, },
                { ui: this._btnNextTile,        callback: this._onTouchedBtnNextTile, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnInfo,            callback: this._onTouchedBtnInfo },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ]);
            this._btnCop.setShortSfxCode(Types.ShortSfxCode.None);
            this._btnScop.setShortSfxCode(Types.ShortSfxCode.None);
            this._btnNextUnit.setShortSfxCode(Types.ShortSfxCode.None);
            this._btnNextTile.setShortSfxCode(Types.ShortSfxCode.None);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwTurnPhaseCodeChanged(): void {
            this._updateDynamicButtons();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(): void {
            const war = this._getOpenData().war;
            this._updateDynamicButtons();
            SoundManager.playCoBgmWithWar(war, false);
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateBtnCop();
            this._updateBtnScop();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateBtnCop();
            this._updateBtnScop();
            SoundManager.playCoBgmWithWar(this._getOpenData().war, false);
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            this._updateDynamicButtons();
        }

        private _onTouchedBtnCop(): void {
            const war       = this._getOpenData().war;
            const skillType = Types.CoSkillType.Power;
            if (!war.getPlayerInTurn().checkCanUseCoSkill(skillType)) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
            } else {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    title   : Lang.getText(LangTextType.B0142),
                    content : Lang.getText(LangTextType.A0054),
                    callback: () => war.getActionPlanner().setStateRequestingPlayerUseCoSkill(skillType),
                });
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            }
        }
        private _onTouchedBtnScop(): void {
            const war       = this._getOpenData().war;
            const skillType = Types.CoSkillType.SuperPower;
            if (!war.getPlayerInTurn().checkCanUseCoSkill(skillType)) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
            } else {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    title   : Lang.getText(LangTextType.B0144),
                    content : Lang.getText(LangTextType.A0058),
                    callback: () => war.getActionPlanner().setStateRequestingPlayerUseCoSkill(skillType),
                });
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            }
        }
        private _onTouchedBtnNextUnit(): void {
            const war           = this._getOpenData().war;
            const field         = war.getField();
            const actionPlanner = field.getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();

                const gridIndex = WarCommonHelpers.getIdleUnitGridIndex(war);
                if (!gridIndex) {
                    SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
                } else {
                    const cursor = field.getCursor();
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
                }
            }
        }
        private _onTouchedBtnNextTile(): void {
            const war           = this._getOpenData().war;
            const field         = war.getField();
            const actionPlanner = field.getActionPlanner();
            if ((!actionPlanner.checkIsStateRequesting()) && (actionPlanner.getState() !== Types.ActionPlannerState.ExecutingAction)) {
                actionPlanner.setStateIdle();

                const gridIndex = WarCommonHelpers.getIdleBuildingGridIndex(war);
                if (!gridIndex) {
                    SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
                } else {
                    const cursor = field.getCursor();
                    cursor.setGridIndex(gridIndex);
                    cursor.updateView();
                    war.getView().tweenGridToCentralArea(gridIndex);
                    war.getGridVisualEffect().showEffectAiming(gridIndex, 800);
                    SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
                }
            }
        }
        private _onTouchedBtnEndTurn(): void {
            const war = this._getOpenData().war;
            if ((war.getDrawVoteManager().getRemainingVotes()) && (!war.getPlayerInTurn().getHasVotedForDraw())) {
                FloatText.show(Lang.getText(LangTextType.A0034));
            } else {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    title   : Lang.getText(LangTextType.B0036),
                    content : this._getHintForEndTurn(),
                    callback: () => this._getOpenData().war.getActionPlanner().setStateRequestingPlayerEndTurn(),
                });
            }
        }
        private _onTouchedBtnCancel(): void {
            this._getOpenData().war.getField().getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnInfo(): void {
            const war           = this._getOpenData().war;
            const actionPlanner = war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            TwnsPanelManager.open(TwnsPanelConfig.Dict.BwWarInfoPanel, { war });
        }
        private _onTouchedBtnMenu(): void {
            const actionPlanner = this._getOpenData().war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpwWarMenuPanel, void 0);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateDynamicButtons();
        }
        private _updateDynamicButtons(): void {
            this._updateBtnCop();
            this._updateBtnScop();
            this._updateBtnEndTurn();
            this._updateBtnNextUnit();
            this._updateBtnNextTile();
            this._updateBtnCancel();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCop.label      = Lang.getText(LangTextType.B0142);
            this._btnScop.label     = Lang.getText(LangTextType.B0144);
            this._btnNextUnit.label = Lang.getText(LangTextType.B0685);
            this._btnNextTile.label = Lang.getText(LangTextType.B0686);
            this._btnEndTurn.label  = Lang.getText(LangTextType.B0036);
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._btnInfo.label     = Lang.getText(LangTextType.B0223);
            this._btnMenu.label     = Lang.getText(LangTextType.B0155);
        }

        private _updateBtnCop(): void {
            const war       = this._getOpenData().war;
            const player    = war.getPlayerInTurn();
            const btn       = this._btnCop;
            if ((war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)   ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)      ||
                (!war.checkIsHumanInTurn())                                             ||
                (player.getCoType() !== Types.CoType.Global)                            ||
                (player.getCoPowerEnergy() == null)
            ) {
                (btn.parent) && (btn.parent.removeChild(btn));
            } else {
                (!btn.parent) && (this._groupLeft.addChildAt(btn, 0));
                btn.icon = player.checkCanUseCoSkill(Types.CoSkillType.Power) ? `commonIcon0009` : `commonIcon0010`;
            }
        }

        private _updateBtnScop(): void {
            const war       = this._getOpenData().war;
            const player    = war.getPlayerInTurn();
            const btn       = this._btnScop;
            if ((war.getActionPlanner().getState() !== Types.ActionPlannerState.Idle)   ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)      ||
                (!war.checkIsHumanInTurn())                                             ||
                (player.getCoType() !== Types.CoType.Global)                            ||
                (player.getCoSuperPowerEnergy() == null)
            ) {
                (btn.parent) && (btn.parent.removeChild(btn));
            } else {
                (!btn.parent) && (this._groupLeft.addChild(btn));
                btn.icon = player.checkCanUseCoSkill(Types.CoSkillType.SuperPower) ? `commonIcon0011` : `commonIcon0012`;
            }
        }

        private _updateBtnEndTurn(): void {
            const war                   = this._getOpenData().war;
            const turnManager           = war.getTurnManager();
            this._btnEndTurn.visible    = (war.getActionPlanner().getState() === Types.ActionPlannerState.Idle)
                && (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        private _updateBtnNextUnit(): void {
            const war           = this._getOpenData().war;
            const actionPlanner = war.getActionPlanner();
            const turnManager   = war.getTurnManager();
            const btn           = this._btnNextUnit;
            if ((actionPlanner.getState() !== Types.ActionPlannerState.Idle)    ||
                (!war.checkIsHumanInTurn())                                     ||
                (turnManager.getPhaseCode() !== Types.TurnPhaseCode.Main)
            ) {
                btn.visible = false;
            } else {
                btn.visible = true;
                btn.icon    = WarCommonHelpers.getIdleUnitGridIndex(war) == null ? `commonIcon0018` : `commonIcon0015`;
            }
        }

        private _updateBtnNextTile(): void {
            const war           = this._getOpenData().war;
            const actionPlanner = war.getActionPlanner();
            const turnManager   = war.getTurnManager();
            const btn           = this._btnNextTile;
            if ((actionPlanner.getState() !== Types.ActionPlannerState.Idle)    ||
                (!war.checkIsHumanInTurn())                                     ||
                (turnManager.getPhaseCode() !== Types.TurnPhaseCode.Main)
            ) {
                btn.visible = false;
            } else {
                btn.visible = true;
                btn.icon    = WarCommonHelpers.getIdleBuildingGridIndex(war) == null ? `commonIcon0019` : `commonIcon0016`;
            }
        }

        private _updateBtnCancel(): void {
            const war               = this._getOpenData().war;
            const turnManager       = war.getTurnManager();
            const actionPlanner     = war.getActionPlanner();
            const state             = actionPlanner.getState();
            this._btnCancel.visible = (state !== Types.ActionPlannerState.Idle)
                && (state !== Types.ActionPlannerState.ExecutingAction)
                && (!actionPlanner.checkIsStateRequesting())
                && (war.checkIsHumanInTurn())
                && (turnManager.getPhaseCode() === Types.TurnPhaseCode.Main);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _getHintForEndTurn(): string {
            const war           = this._getOpenData().war;
            const playerIndex   = war.getPlayerIndexInTurn();
            const unitMap       = war.getUnitMap();
            const hints         = new Array<string>();

            if (playerIndex != null) {
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
            }

            hints.push(Lang.getText(LangTextType.A0024));
            return hints.join(`\n\n`);
        }
    }
}

// export default TwnsSpwSidePanel;
