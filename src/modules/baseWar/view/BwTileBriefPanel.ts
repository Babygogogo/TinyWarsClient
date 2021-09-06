
import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
import StageManager             from "../../tools/helpers/StageManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import NotifyData               from "../../tools/notify/NotifyData";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsBwWar                from "../model/BwWar";
import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
import TwnsBwProduceUnitPanel   from "./BwProduceUnitPanel";
import TwnsBwTileDetailPanel    from "./BwTileDetailPanel";
import TwnsBwTileView           from "./BwTileView";
import TwnsBwUnitBriefPanel     from "./BwUnitBriefPanel";
import CommonConstants from "../../tools/helpers/CommonConstants";

namespace TwnsBwTileBriefPanel {
    import BwCoListPanel        = TwnsCommonCoListPanel.CommonCoListPanel;
    import BwProduceUnitPanel   = TwnsBwProduceUnitPanel.BwProduceUnitPanel;
    import BwTileDetailPanel    = TwnsBwTileDetailPanel.BwTileDetailPanel;
    import BwTileView           = TwnsBwTileView.BwTileView;
    import BwWar                = TwnsBwWar.BwWar;
    import Tween                = egret.Tween;
    import NotifyType           = TwnsNotifyType.NotifyType;

    const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
    // const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
    // const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
    // const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
    const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
    const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
    const _CELL_WIDTH           = 80;

    type OpenData = {
        war : BwWar;
    };
    export class BwTileBriefPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwTileBriefPanel;

        private readonly _group!            : eui.Group;
        private readonly _conTileView!      : eui.Group;
        private readonly _tileView          = new BwTileView();
        private readonly _labelName!        : TwnsUiLabel.UiLabel;
        private readonly _labelGridIndex!   : TwnsUiLabel.UiLabel;
        private readonly _labelState!       : TwnsUiLabel.UiLabel;
        private readonly _labelDefense!     : TwnsUiLabel.UiLabel;
        private readonly _imgDefense!       : TwnsUiImage.UiImage;
        private readonly _imgState!         : TwnsUiImage.UiImage;

        public static show(openData: OpenData): void {
            if (!BwTileBriefPanel._instance) {
                BwTileBriefPanel._instance = new BwTileBriefPanel();
            }
            BwTileBriefPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwTileBriefPanel._instance) {
                await BwTileBriefPanel._instance.close();
            }
        }
        public static getInstance(): BwTileBriefPanel {
            return BwTileBriefPanel._instance;
        }

        public constructor() {
            super();

            this.skinName = `resource/skins/baseWar/BwTileBriefPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: NotifyType.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: NotifyType.BwCursorGridIndexChanged,       callback: this._onNotifyBwCursorGridIndexChanged },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.BwWarMenuPanelOpened,           callback: this._onNotifyBwWarMenuPanelOpened },
                { type: NotifyType.BwWarMenuPanelClosed,           callback: this._onNotifyBwWarMenuPanelClosed },
                { type: NotifyType.BwCoListPanelOpened,            callback: this._onNotifyBwCoListPanelOpened },
                { type: NotifyType.BwCoListPanelClosed,            callback: this._onNotifyBwCoListPanelClosed },
                { type: NotifyType.BwProduceUnitPanelOpened,       callback: this._onNotifyBwProduceUnitPanelOpened },
                { type: NotifyType.BwProduceUnitPanelClosed,       callback: this._onNotifyBwProduceUnitPanelClosed },
                { type: NotifyType.MeTileChanged,                  callback: this._onNotifyMeTileChanged },
                { type: NotifyType.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedThis, },
            ]);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());

            const group     = this._group;
            group.alpha     = 0;
            group.bottom    = -40;
            this._showOpenAnimation();

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyGlobalTouchBegin(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyGlobalTouchMove(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyBwCursorGridIndexChanged(): void {
            this._updateView();
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            const planner = this._getOpenData().war.getActionPlanner();
            if ((planner.getPreviousState() === Types.ActionPlannerState.ExecutingAction) &&
                (planner.getState() !== Types.ActionPlannerState.ExecutingAction)
            ) {
                this._updateView();
            }
        }
        private _onNotifyBwWarMenuPanelOpened(): void {
            this._updateView();
        }
        private _onNotifyBwWarMenuPanelClosed(): void {
            this._updateView();
        }
        private _onNotifyBwCoListPanelOpened(): void {
            this._updateView();
        }
        private _onNotifyBwCoListPanelClosed(): void {
            this._updateView();
        }
        private _onNotifyBwProduceUnitPanelOpened(): void {
            this._updateView();
        }
        private _onNotifyBwProduceUnitPanelClosed(): void {
            this._updateView();
        }
        private _onNotifyMeTileChanged(e: egret.Event): void {
            const data = e.data as NotifyData.MeTileChanged;
            if (GridIndexHelpers.checkIsEqual(data.gridIndex, this._getOpenData().war.getCursor().getGridIndex())) {
                this._updateView();
            }
        }
        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateView();
        }

        private _onTouchedThis(): void {
            const war   = this._getOpenData().war;
            const tile  = war.getTileMap().getTile(war.getCursor().getGridIndex());
            (tile) && (BwTileDetailPanel.show({ tile }));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const war = this._getOpenData().war;
            if ((war.getIsWarMenuPanelOpening())            ||
                (BwProduceUnitPanel.getIsOpening()) ||
                (BwCoListPanel.getIsOpening())
            ) {
                this.visible = false;
            } else {
                this.visible = true;

                const gridIndex = war.getCursor().getGridIndex();
                const tile      = war.getTileMap().getTile(gridIndex);
                const tileView  = this._tileView;
                tileView.setData({
                    tileData    : tile.serialize(),
                    hasFog      : tile.getHasFog(),
                    skinId      : tile.getSkinId(),
                });
                tileView.updateView();
                this._labelDefense.text     = `${Math.floor(tile.getDefenseAmount() / 10)}`;
                this._labelName.text        = Lang.getTileName(tile.getType()) ?? CommonConstants.ErrorTextForUndefined;
                this._labelGridIndex.text   = `x${gridIndex.x} y${gridIndex.y}`;

                if (tile.getCurrentHp() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = _IMAGE_SOURCE_HP;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${tile.getCurrentHp()}`;
                } else if (tile.getCurrentCapturePoint() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = _IMAGE_SOURCE_CAPTURE;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${tile.getCurrentCapturePoint()}`;
                } else if (tile.getCurrentBuildPoint() != null) {
                    this._imgState.visible      = true;
                    this._imgState.source       = _IMAGE_SOURCE_BUILD;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${tile.getCurrentBuildPoint()}`;
                } else {
                    this._imgState.visible      = false;
                    this._labelState.visible    = false;
                }
            }
        }

        private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
            const unitBriefPanel = TwnsBwUnitBriefPanel.BwUnitBriefPanel.getInstance();
            let target = e.target as egret.DisplayObject;
            while (target) {
                if ((target) && ((target === this) || (target === unitBriefPanel))) {
                    return;
                }
                target = target.parent;
            }

            const stageWidth    = StageManager.getStage().stageWidth;
            const group         = this._group;
            const currentX      = group.x;
            const newX          = e.stageX >= stageWidth / 4 * 3
                ? 0
                : (e.stageX < stageWidth / 4
                    ? stageWidth - _CELL_WIDTH
                    : currentX
                );
            if (newX !== currentX) {
                await this._showCloseAnimation();
                group.x = newX;
                this._showOpenAnimation();
            }
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            Tween.removeTweens(group);
            Tween.get(group)
                .to({ bottom: 0, alpha: 1 }, 50);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                const group = this._group;
                Tween.removeTweens(group);
                Tween.get(group)
                    .to({ bottom: -40, alpha: 0 }, 50)
                    .call(() => resolve());
            });
        }
    }
}

export default TwnsBwTileBriefPanel;
