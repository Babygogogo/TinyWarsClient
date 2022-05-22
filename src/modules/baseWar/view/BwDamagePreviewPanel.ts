
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import StageManager             from "../../tools/helpers/StageManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import WarDamageCalculator      from "../../tools/warHelpers/WarDamageCalculator";
// import TwnsBwWar                from "../model/BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType       = Notify.NotifyType;
    import LangTextType     = Lang.LangTextType;

    export type OpenDataForBwDamagePreviewPanel = {
        war: BwWar;
    };
    export class BwDamagePreviewPanel extends TwnsUiPanel.UiPanel<OpenDataForBwDamagePreviewPanel> {
        private readonly _group!                : eui.Group;
        private readonly _labelAttackTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelAttackValue!     : TwnsUiLabel.UiLabel;
        private readonly _labelCounterTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelCounterValue!    : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                // { type: Notify.Type.GlobalTouchBegin,           callback: this._onNotifyGlobalTouchBegin },
                // { type: Notify.Type.GlobalTouchMove,            callback: this._onNotifyGlobalTouchMove },
                // { type: Notify.Type.TileAnimationTick,          callback: this._onNotifyTileAnimationTick },
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.ZoomableContentsMoved,           callback: this._onNotifyZoomableContentsMoved },
                { type: NotifyType.BwCursorGridIndexChanged,        callback: this._onNotifyBwCursorGridIndexChanged },
                { type: NotifyType.BwActionPlannerMovePathChanged,  callback: this._onNotifyBwActionPlannerMovePathChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._group,  callback: this._onTouchedGroup },
            ]);

            this._updateView();
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
        private _onNotifyZoomableContentsMoved(): void {
            this._updatePosition();
        }
        private _onNotifyBwCursorGridIndexChanged(): void {
            this._updateView();
        }
        private _onNotifyBwActionPlannerMovePathChanged(): void {
            this._updateView();
        }

        private _onTouchedGroup(): void {
            const war               = this._getOpenData().war;
            const defenderGridIndex = war.getCursor().getGridIndex();
            const defenderUnit      = war.getUnitMap().getUnitOnMap(defenderGridIndex);
            if (defenderUnit == null) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
                return;
            }

            const actionPlanner         = war.getActionPlanner();
            const tileMap               = war.getTileMap();
            const commonSettingsManager = war.getCommonSettingManager();
            const allTiles              = tileMap.getAllTiles();
            const allCities             = allTiles.filter(v => v.getType() === CommonConstants.TileType.City);
            const allCommandTowers      = allTiles.filter(v => v.getType() === CommonConstants.TileType.CommandTower);
            const attackerUnit          = Helpers.getExisted(actionPlanner.getFocusUnit());
            const attackerPlayer        = attackerUnit.getPlayer();
            const attackerGridIndex     = actionPlanner.getMovePathDestination();
            const attackerPlayerIndex   = attackerUnit.getPlayerIndex();
            const attackerArmorType     = attackerUnit.getArmorType();
            const defenderArmorType     = defenderUnit.getArmorType();
            const defenderPlayer        = defenderUnit.getPlayer();
            const defenderPlayerIndex   = defenderUnit.getPlayerIndex();
            const hasFog                = war.getFogMap().checkHasFogCurrently();
            const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const canSeeHiddenInfo1     = (!hasFog) || (watcherTeamIndexes.has(attackerPlayer.getTeamIndex()));
            const canSeeHiddenInfo2     = (!hasFog) || (watcherTeamIndexes.has(defenderPlayer.getTeamIndex()));
            const coSkillType1          = attackerPlayer.getCoUsingSkillType();
            const coSkillType2          = defenderPlayer.getCoUsingSkillType();
            const getIsAffectedByCo1    = Helpers.createLazyFunc((): boolean => {
                if (attackerUnit.getHasLoadedCo()) {
                    return true;
                }

                const distance = GridIndexHelpers.getMinDistance(attackerGridIndex, attackerPlayer.getCoGridIndexListOnMap());
                return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
            });
            const getIsAffectedByCo2    = Helpers.createLazyFunc((): boolean => {
                if (defenderUnit.getHasLoadedCo()) {
                    return true;
                }

                const distance = GridIndexHelpers.getMinDistance(defenderGridIndex, defenderPlayer.getCoGridIndexListOnMap());
                return (distance != null) && (distance <= defenderPlayer.getCoZoneRadius());
            });

            PanelHelpers.open(PanelHelpers.PanelDict.CommonDamageCalculatorPanel, {
                data: {
                    gameConfig   : war.getGameConfig(),
                    weatherType     : war.getWeatherManager().getCurrentWeatherType(),
                    attackerData    : {
                        coId            : attackerPlayer.getCoId(),
                        coSkillType     : attackerPlayer.checkCoIsUsingActiveSkill()
                            ? coSkillType1
                            : (getIsAffectedByCo1() ? Types.CoSkillType.Passive : null),
                        unitType        : attackerUnit.getUnitType(),
                        unitHp          : attackerUnit.getCurrentHp(),
                        unitWeaponType  : (attackerUnit.getPrimaryWeaponBaseDamage(defenderArmorType) != null)
                            ? (Types.WeaponType.Primary)
                            : (attackerUnit.getSecondaryWeaponBaseDamage(defenderArmorType) != null
                                ? Types.WeaponType.Secondary
                                : null
                            ),
                        unitPromotion   : attackerUnit.getCurrentPromotion(),
                        tileType        : tileMap.getTile(attackerGridIndex).getType(),
                        towersCount     : allCommandTowers.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length,
                        offenseBonus    : commonSettingsManager.getSettingsAttackPowerModifier(attackerPlayerIndex),
                        upperLuck       : commonSettingsManager.getSettingsLuckUpperLimit(attackerPlayerIndex),
                        lowerLuck       : commonSettingsManager.getSettingsLuckLowerLimit(attackerPlayerIndex),
                        fund            : canSeeHiddenInfo1 ? attackerPlayer.getFund() : 0,
                        citiesCount     : canSeeHiddenInfo1 ? allCities.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length : 0,
                    },
                    defenderData    : {
                        coId            : defenderPlayer.getCoId(),
                        coSkillType     : defenderPlayer.checkCoIsUsingActiveSkill()
                            ? coSkillType2
                            : (getIsAffectedByCo2() ? Types.CoSkillType.Passive : null),
                        unitType        : defenderUnit.getUnitType(),
                        unitHp          : defenderUnit.getCurrentHp(),
                        unitWeaponType  : (defenderUnit.getPrimaryWeaponBaseDamage(attackerArmorType) != null)
                            ? (Types.WeaponType.Primary)
                            : (defenderUnit.getSecondaryWeaponBaseDamage(attackerArmorType) != null
                                ? Types.WeaponType.Secondary
                                : null
                            ),
                        unitPromotion   : defenderUnit.getCurrentPromotion(),
                        tileType        : tileMap.getTile(defenderGridIndex).getType(),
                        towersCount     : allCommandTowers.filter(v => v.getPlayerIndex() === defenderPlayerIndex).length,
                        offenseBonus    : commonSettingsManager.getSettingsAttackPowerModifier(defenderPlayerIndex),
                        upperLuck       : commonSettingsManager.getSettingsLuckUpperLimit(defenderPlayerIndex),
                        lowerLuck       : commonSettingsManager.getSettingsLuckLowerLimit(defenderPlayerIndex),
                        fund            : canSeeHiddenInfo2 ? defenderPlayer.getFund() : 0,
                        citiesCount     : canSeeHiddenInfo2 ? allCities.filter(v => v.getPlayerIndex() === defenderPlayerIndex).length : 0,
                    },
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updatePosition();

            const war               = this._getOpenData().war;
            const cursor            = war.getCursor();
            const actionPlanner     = cursor.getWar().getActionPlanner();
            const group             = this._group;
            const gridIndex         = cursor.getGridIndex();
            const labelAttackTitle  = this._labelAttackTitle;
            const labelAttackValue  = this._labelAttackValue;
            const labelCounterTitle = this._labelCounterTitle;
            const labelCounterValue = this._labelCounterValue;
            const state             = actionPlanner.getState();

            if ((state === Types.ActionPlannerState.MakingMovePath)     ||
                (state === Types.ActionPlannerState.ChoosingAttackTarget)
            ) {
                const unitMap       = war.getUnitMap();
                const attackerUnit  = Helpers.getExisted(actionPlanner.getFocusUnit());
                const movePath      = actionPlanner.getMovePath();
                if (!attackerUnit.checkCanAttackTargetAfterMovePath(movePath, gridIndex)) {
                    group.visible = false;
                } else {
                    const attackerUnitId        = attackerUnit.getUnitId();
                    const battleDamageInfoArray = WarHelpers.WarDamageCalculator.getEstimatedBattleDamage({
                        war,
                        attackerMovePath: movePath,
                        launchUnitId    : attackerUnit.getLoaderUnitId() == null ? null : attackerUnitId,
                        targetGridIndex : gridIndex,
                    });
                    const damages = WarHelpers.WarDamageCalculator.getAttackAndCounterDamage({
                        battleDamageInfoArray,
                        attackerUnitId,
                        targetGridIndex     : gridIndex,
                        unitMap,
                    });

                    const { attackDamage, counterDamage }   = damages;
                    const target                            = unitMap.getUnitOnMap(gridIndex) || war.getTileMap().getTile(gridIndex);
                    const attackerSkinId                    = attackerUnit.getSkinId();
                    const targetSkinId                      = target.getSkinId();
                    group.visible                           = true;
                    labelAttackTitle.textColor              = WarHelpers.WarCommonHelpers.getTextColorForSkinId(attackerSkinId);
                    labelAttackTitle.stroke                 = WarHelpers.WarCommonHelpers.getTextStrokeForSkinId(attackerSkinId);
                    labelCounterTitle.textColor             = WarHelpers.WarCommonHelpers.getTextColorForSkinId(targetSkinId);
                    labelCounterTitle.stroke                = WarHelpers.WarCommonHelpers.getTextStrokeForSkinId(targetSkinId);
                    labelAttackValue.text                   = `${attackDamage == null ? `---` : attackDamage} / ${target.getCurrentHp()}`;
                    labelCounterValue.text                  = `${counterDamage == null ? `---` : counterDamage} / ${attackerUnit.getCurrentHp()}`;
                }

            } else {
                group.visible = false;
            }
        }

        private _updatePosition(): void {
            const war           = this._getOpenData().war;
            const container     = war.getView().getFieldContainer();
            const contents      = container.getContents();
            const gridIndex     = war.getCursor().getGridIndex();
            const gridSize      = CommonConstants.GridSize;
            const stage         = StageManager.getStage();
            const group         = this._group;
            const groupWidth    = group.width;
            const groupHeight   = group.height;
            const point         = contents.localToGlobal(
                (gridIndex.x + 0.5) * gridSize.width,
                (gridIndex.y) * gridSize.height,
            );
            group.x         = Math.max(0, Math.min(point.x - groupWidth / 2, stage.stageWidth - groupWidth));
            group.y         = Math.max(40, Math.min(point.y - groupHeight, stage.stageHeight - groupHeight));
        }

        private _updateComponentsForLanguage(): void {
            this._labelAttackTitle.text     = `${Lang.getText(LangTextType.B0077)}:`;
            this._labelCounterTitle.text    = `${Lang.getText(LangTextType.B0078)}:`;
        }
    }
}

// export default TwnsBwDamagePreviewPanel;
