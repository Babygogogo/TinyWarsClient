
namespace TinyWars.MapEditor {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import StageManager     = Utility.StageManager;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import Types            = Utility.Types;

    const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
    const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
    const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
    const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
    const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
    const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
    const _LEFT_X               = 0;
    const _RIGHT_X              = 880;

    export class MeTileBriefPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeTileBriefPanel;

        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _tileView       = new MeTileView();
        private _labelName      : GameUi.UiLabel;
        private _labelGridIndex : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _labelDefense   : GameUi.UiLabel;
        private _imgDefense     : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;

        private _war        : MeWar;
        private _cursor     : MeCursor;
        private _tileMap    : MeTileMap;

        public static show(): void {
            if (!MeTileBriefPanel._instance) {
                MeTileBriefPanel._instance = new MeTileBriefPanel();
            }
            MeTileBriefPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MeTileBriefPanel._instance) {
                await MeTileBriefPanel._instance.close();
            }
        }
        public static getInstance(): MeTileBriefPanel {
            return MeTileBriefPanel._instance;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = `resource/skins/mapEditor/MeTileBriefPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.BwCursorGridIndexChanged,       callback: this._onNotifyMcwCursorGridIndexChanged },
                { type: Notify.Type.McwWarMenuPanelOpened,          callback: this._onNotifyMcwWarMenuPanelOpened },
                { type: Notify.Type.McwWarMenuPanelClosed,          callback: this._onNotifyMcwWarMenuPanelClosed },
                { type: Notify.Type.BwCoListPanelOpened,            callback: this._onNotifyMcwCoListPanelOpened },
                { type: Notify.Type.BwCoListPanelClosed,            callback: this._onNotifyMcwCoListPanelClosed },
                { type: Notify.Type.McwProduceUnitPanelOpened,      callback: this._onNotifyMcwProduceUnitPanelOpened },
                { type: Notify.Type.McwProduceUnitPanelClosed,      callback: this._onNotifyMcwProduceUnitPanelClosed },
                { type: Notify.Type.MeTileChanged,                  callback: this._onNotifyMeTileChanged },
                { type: Notify.Type.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedThis, },
            ]);

            this._conTileView.addChild(this._tileView.getImgBase());
            this._conTileView.addChild(this._tileView.getImgObject());

            const war       = MeModel.getWar();
            this._war       = war;
            this._tileMap   = war.getTileMap() as MeTileMap;
            this._cursor    = war.getField().getCursor() as MeCursor;

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            this._war       = null;
            this._tileMap   = null;
            this._cursor    = null;
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
        private _onNotifyMeTileChanged(e: egret.Event): void {
            const data = e.data as Notify.Data.MeTileChanged;
            if (GridIndexHelpers.checkIsEqual(data.gridIndex, this._cursor.getGridIndex())) {
                this._updateView();
            }
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
            if ((MeWarMenuPanel.getIsOpening())) {
                this.visible = false;
            } else {
                this.visible = true;

                const gridIndex = this._cursor.getGridIndex();
                const tile      = this._tileMap.getTile(gridIndex);
                this._tileView.setData({
                    tileData    : tile.serialize(),
                    hasFog      : false,
                    skinId      : tile.getSkinId(),
                });
                this._tileView.updateView();
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
            const unitBriefPanel = MeUnitBriefPanel.getInstance();
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
