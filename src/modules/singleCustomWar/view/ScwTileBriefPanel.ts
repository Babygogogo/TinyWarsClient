
namespace TinyWars.SingleCustomWar {
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import StageManager         = Utility.StageManager;
    import Types                = Utility.Types;
    import ConfigManager        = Utility.ConfigManager;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
    const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
    const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
    const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
    const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
    const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
    const _LEFT_X               = 0;
    const _RIGHT_X              = 880;

    export class ScwTileBriefPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScwTileBriefPanel;

        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _tileView       = new ScwTileView();
        private _labelName      : GameUi.UiLabel;
        private _labelGridIndex : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _labelDefense   : GameUi.UiLabel;
        private _imgDefense     : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;

        private _war        : ScwWar;
        private _cursor     : ScwCursor;
        private _tileMap    : ScwTileMap;

        public static show(): void {
            if (!ScwTileBriefPanel._instance) {
                ScwTileBriefPanel._instance = new ScwTileBriefPanel();
            }
            ScwTileBriefPanel._instance.open();
        }
        public static hide(): void {
            if (ScwTileBriefPanel._instance) {
                ScwTileBriefPanel._instance.close();
            }
        }
        public static getInstance(): ScwTileBriefPanel {
            return ScwTileBriefPanel._instance;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = `resource/skins/multiCustomWar/McwTileBriefPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.BwCursorGridIndexChanged,       callback: this._onNotifyBwCursorGridIndexChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
                { type: Notify.Type.McwWarMenuPanelOpened,          callback: this._onNotifyMcwWarMenuPanelOpened },
                { type: Notify.Type.McwWarMenuPanelClosed,          callback: this._onNotifyMcwWarMenuPanelClosed },
                { type: Notify.Type.BwCoListPanelOpened,            callback: this._onNotifyBwCoListPanelOpened },
                { type: Notify.Type.BwCoListPanelClosed,            callback: this._onNotifyBwCoListPanelClosed },
                { type: Notify.Type.McwProduceUnitPanelOpened,      callback: this._onNotifyMcwProduceUnitPanelOpened },
                { type: Notify.Type.McwProduceUnitPanelClosed,      callback: this._onNotifyMcwProduceUnitPanelClosed },
                { type: Notify.Type.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedThis, },
            ]);

            this._conTileView.addChild(this._tileView.getImgBase());
            this._conTileView.addChild(this._tileView.getImgObject());

            this._war       = ScwModel.getWar();
            this._tileMap   = this._war.getTileMap() as ScwTileMap;
            this._cursor    = this._war.getField().getCursor() as ScwCursor;

            this._updateView();
        }
        protected _onClosed(): void {
            this._war = null;
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
        private _onNotifyBwCursorGridIndexChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwActionPlannerStateChanged(e: egret.Event): void {
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
        private _onNotifyBwCoListPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoListPanelClosed(e: egret.Event): void {
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
            if ((ScwWarMenuPanel.getIsOpening()) || (ScwProduceUnitPanel.getIsOpening()) || (ScwCoListPanel.getIsOpening())) {
                this.visible = false;
            } else {
                this.visible = true;

                const gridIndex             = this._cursor.getGridIndex();
                const tileView              = this._tileView;
                const tile                  = this._war.getTileMap().getTile(gridIndex);
                this._labelDefense.text     = `${Math.floor(tile.getDefenseAmount() / 10)}`;
                this._labelName.text        = Lang.getTileName(tile.getType());
                this._labelGridIndex.text   = `x${gridIndex.x} y${gridIndex.y}`;
                tileView.setData({
                    tileData    : tile.serialize(),
                    hasFog      : tile.getHasFog(),
                    skinId      : tile.getSkinId(),
                });
                tileView.updateView();

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
            const unitBriefPanel = ScwUnitBriefPanel.getInstance();
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

        // private _getScwTileForShow(gridIndex: Types.GridIndex): ScwTile {
        //     const war       = this._war;
        //     const rawTile   = this._tileMap.getTile(gridIndex) as ScwTile;
        //     if (VisibilityHelpers.checkIsTileVisibleToTeams(war, gridIndex, (war.getPlayerManager() as ScwPlayerManager).getWatcherTeamIndexesForScw())) {
        //         return rawTile;
        //     } else {
        //         const tile      = new ScwTile();
        //         const currentHp = rawTile.getCurrentHp();
        //         tile.init({
        //             gridX       : gridIndex.x,
        //             gridY       : gridIndex.y,
        //             objectViewId: rawTile.getType() === Types.TileType.Headquarters ? rawTile.getObjectViewId() : rawTile.getNeutralObjectViewId(),
        //             baseViewId  : rawTile.getBaseViewId(),
        //         }, war.getConfigVersion());

        //         tile.startRunning(war);
        //         tile.setCurrentBuildPoint(tile.getMaxBuildPoint());
        //         tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
        //         tile.setCurrentHp(currentHp);

        //         return tile;
        //     }
        // }
    }
}
