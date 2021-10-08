
import CommonConstants          from "../../tools/helpers/CommonConstants";
import Helpers                  from "../../tools/helpers/Helpers";
import StageManager             from "../../tools/helpers/StageManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import WarDamageCalculator      from "../../tools/warHelpers/WarDamageCalculator";
import TwnsBwWar                from "../model/BwWar";

namespace TwnsBwDamagePreviewPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import BwWar            = TwnsBwWar.BwWar;

    export type OpenDataForBwDamagePreviewPanel = {
        war: BwWar;
    };
    export class BwDamagePreviewPanel extends TwnsUiPanel.UiPanel<OpenDataForBwDamagePreviewPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwDamagePreviewPanel;

        private readonly _group!                : eui.Group;
        private readonly _labelAttackTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelAttackValue!     : TwnsUiLabel.UiLabel;
        private readonly _labelCounterTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelCounterValue!    : TwnsUiLabel.UiLabel;

        public static show(openData: OpenDataForBwDamagePreviewPanel): void {
            if (!BwDamagePreviewPanel._instance) {
                BwDamagePreviewPanel._instance = new BwDamagePreviewPanel();
            }

            const instance = BwDamagePreviewPanel._instance;
            if (!instance.getIsOpening()) {
                instance.open(openData);
            }
        }
        public static async hide(): Promise<void> {
            if (BwDamagePreviewPanel._instance) {
                await BwDamagePreviewPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = `resource/skins/baseWar/BwDamagePreviewPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                // { type: Notify.Type.GlobalTouchBegin,           callback: this._onNotifyGlobalTouchBegin },
                // { type: Notify.Type.GlobalTouchMove,            callback: this._onNotifyGlobalTouchMove },
                // { type: Notify.Type.TileAnimationTick,          callback: this._onNotifyTileAnimationTick },
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.ZoomableContentsMoved,           callback: this._onNotifyZoomableContentsMoved },
                { type: NotifyType.BwCursorGridIndexChanged,        callback: this._onNotifyBwCursorGridIndexChanged },
                { type: NotifyType.BwActionPlannerMovePathChanged,  callback: this._onNotifyBwActionPlannerMovePathChanged },
            ]);

            this._updateView();
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
                    const battleDamageInfoArray = WarDamageCalculator.getEstimatedBattleDamage({
                        war,
                        attackerMovePath: movePath,
                        launchUnitId    : attackerUnit.getLoaderUnitId() == null ? null : attackerUnitId,
                        targetGridIndex : gridIndex,
                    });
                    const damages = WarDamageCalculator.getAttackAndCounterDamage({
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
                    labelAttackTitle.textColor              = WarCommonHelpers.getTextColorForSkinId(attackerSkinId);
                    labelAttackTitle.stroke                 = WarCommonHelpers.getTextStrokeForSkinId(attackerSkinId);
                    labelCounterTitle.textColor             = WarCommonHelpers.getTextColorForSkinId(targetSkinId);
                    labelCounterTitle.stroke                = WarCommonHelpers.getTextStrokeForSkinId(targetSkinId);
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

export default TwnsBwDamagePreviewPanel;
