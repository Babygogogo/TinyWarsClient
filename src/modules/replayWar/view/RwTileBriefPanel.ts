
namespace TinyWars.ReplayWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import StageManager = Utility.StageManager;
    import Types        = Utility.Types;

    const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
    const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
    const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
    const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
    const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
    const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
    const _LEFT_X               = 0;
    const _RIGHT_X              = 880;

    export class RwTileBriefPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: RwTileBriefPanel;

        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _tileView       = new RwTileView();
        private _labelName      : GameUi.UiLabel;
        private _labelGridIndex : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _labelDefense   : GameUi.UiLabel;
        private _imgDefense     : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;

        private _war        : RwWar;
        private _cursor     : RwCursor;
        private _tileMap    : RwTileMap;

        public static show(): void {
            if (!RwTileBriefPanel._instance) {
                RwTileBriefPanel._instance = new RwTileBriefPanel();
            }
            RwTileBriefPanel._instance.open(undefined);
        }
        public static hide(): void {
            if (RwTileBriefPanel._instance) {
                RwTileBriefPanel._instance.close();
            }
        }
        public static getInstance(): RwTileBriefPanel {
            return RwTileBriefPanel._instance;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = `resource/skins/replayWar/RwTileBriefPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.BwCursorGridIndexChanged,       callback: this._onNotifyMcwCursorGridIndexChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyMcwActionPlannerStateChanged },
                { type: Notify.Type.McwWarMenuPanelOpened,          callback: this._onNotifyMcwWarMenuPanelOpened },
                { type: Notify.Type.McwWarMenuPanelClosed,          callback: this._onNotifyMcwWarMenuPanelClosed },
                { type: Notify.Type.BwCoListPanelOpened,            callback: this._onNotifyMcwCoListPanelOpened },
                { type: Notify.Type.BwCoListPanelClosed,            callback: this._onNotifyMcwCoListPanelClosed },
                { type: Notify.Type.McwProduceUnitPanelOpened,      callback: this._onNotifyMcwProduceUnitPanelOpened },
                { type: Notify.Type.McwProduceUnitPanelClosed,      callback: this._onNotifyMcwProduceUnitPanelClosed },
                { type: Notify.Type.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedThis, },
            ]);
            this._conTileView.addChild(this._tileView.getImgBase());
            this._conTileView.addChild(this._tileView.getImgObject());

            this._war       = RwModel.getWar();
            this._tileMap   = this._war.getTileMap() as RwTileMap;
            this._cursor    = this._war.getField().getCursor() as RwCursor;

            this._updateView();
        }
        protected _onClosed(): void {
            delete this._war;
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
        private _onNotifyMcwCursorGridIndexChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwActionPlannerStateChanged(e: egret.Event): void {
            const planner = this._war.getActionPlanner();
            if ((planner.getPreviousState() === Types.ActionPlannerState.ExecutingAction) &&
                (planner.getState() !== Types.ActionPlannerState.ExecutingAction)
            ) {
                this._updateView();
            }
        }
        private _onNotifyMcwWarMenuPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwWarMenuPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwCoListPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwCoListPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwProduceUnitPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwProduceUnitPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyTileAnimationTick(e: egret.Event): void {
            this._tileView.updateView();
        }

        private _onTouchedThis(e: egret.TouchEvent): void {
            const tile = this._tileMap.getTile(this._cursor.getGridIndex());
            (tile) && (BaseWar.BwTileDetailPanel.show({ tile }));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            if ((RwWarMenuPanel.getIsOpening()) || (RwProduceUnitPanel.getIsOpening()) || (RwCoListPanel.getIsOpening())) {
                this.visible = false;
            } else {
                this.visible = true;

                const gridIndex = this._cursor.getGridIndex();
                const tile      = this._tileMap.getTile(gridIndex);
                const tileView  = this._tileView;
                tileView.setData({
                    tileData    : tile.serialize(),
                    skinId      : tile.getSkinId(),
                    hasFog      : tile.getHasFog(),
                });
                tileView.updateView();
                this._labelDefense.text     = `${Math.floor(tile.getDefenseAmount() / 10)}`;
                this._labelName.text        = Lang.getTileName(tile.getType());
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

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
            const tileBriefPanel = this;
            const unitBriefPanel = RwUnitBriefPanel.getInstance();
            let target = e.target as egret.DisplayObject;
            while (target) {
                if ((target) && ((target === tileBriefPanel) || (target === unitBriefPanel))) {
                    return;
                }
                target = target.parent;
            }

            const stageWidth = StageManager.getStage().stageWidth;
            if (e.stageX >= stageWidth / 4 * 3) {
                this._group.x = _LEFT_X;
            } else if (e.stageX < stageWidth / 4) {
                this._group.x = _RIGHT_X;
            }
        }
    }
}
