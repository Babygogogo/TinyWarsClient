
namespace TinyWars.Replay {
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

    export class ReplayTileBriefPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayTileBriefPanel;

        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _tileView       : ReplayTileView;
        private _labelName      : GameUi.UiLabel;
        private _labelGridIndex : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _labelDefense   : GameUi.UiLabel;
        private _imgDefense     : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;

        private _war        : ReplayWar;
        private _cursor     : ReplayCursor;
        private _tileMap    : ReplayTileMap;

        public static show(): void {
            if (!ReplayTileBriefPanel._instance) {
                ReplayTileBriefPanel._instance = new ReplayTileBriefPanel();
            }
            ReplayTileBriefPanel._instance.open();
        }
        public static hide(): void {
            if (ReplayTileBriefPanel._instance) {
                ReplayTileBriefPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/replay/ReplayTileBriefPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.BwCursorGridIndexChanged,      callback: this._onNotifyMcwCursorGridIndexChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,   callback: this._onNotifyMcwActionPlannerStateChanged },
                { type: Notify.Type.McwWarMenuPanelOpened,          callback: this._onNotifyMcwWarMenuPanelOpened },
                { type: Notify.Type.McwWarMenuPanelClosed,          callback: this._onNotifyMcwWarMenuPanelClosed },
                { type: Notify.Type.McwProduceUnitPanelOpened,      callback: this._onNotifyMcwProduceUnitPanelOpened },
                { type: Notify.Type.McwProduceUnitPanelClosed,      callback: this._onNotifyMcwProduceUnitPanelClosed },
                { type: Notify.Type.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
            ];
            this._uiListeners = [
                { ui: this, callback: this._onTouchedThis, },
            ];

            this._tileView = new ReplayTileView();
            this._conTileView.addChild(this._tileView.getImgBase());
            this._conTileView.addChild(this._tileView.getImgObject());
        }
        protected _onOpened(): void {
            this._war       = ReplayModel.getWar();
            this._tileMap   = this._war.getTileMap() as ReplayTileMap;
            this._cursor    = this._war.getField().getCursor() as ReplayCursor;

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
        private _onNotifyMcwProduceUnitPanelOpened(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwProduceUnitPanelClosed(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyTileAnimationTick(e: egret.Event): void {
            this._tileView.updateOnAnimationTick();
        }

        private _onTouchedThis(e: egret.TouchEvent): void {
            Utility.FloatText.show("TODO");
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            if (ReplayWarMenuPanel.getIsOpening()) {
                this.visible = false;
            } else {
                this.visible = true;

                const gridIndex = this._cursor.getGridIndex();
                const tile      = this._tileMap.getTile(gridIndex);
                this._tileView.init(tile).startRunningView();
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
            if (e.target !== this._group) {
                this._group.x = (e.stageX >= StageManager.getStage().stageWidth / 2) ? _LEFT_X : _RIGHT_X;
            }
        }
    }
}
