
namespace TinyWars.MapEditor {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    export class MeChooseTileBasePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseTileBasePanel;

        private _listTileObject : GameUi.UiScrollList;
        private _btnCancel      : GameUi.UiButton;

        public static show(): void {
            if (!MeChooseTileBasePanel._instance) {
                MeChooseTileBasePanel._instance = new MeChooseTileBasePanel();
            }
            MeChooseTileBasePanel._instance.open();
        }
        public static hide(): void {
            if (MeChooseTileBasePanel._instance) {
                MeChooseTileBasePanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/mapEditor/MeChooseTileBasePanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this.close },
            ];
            this._listTileObject.setItemRenderer(TileBaseRenderer);
            this._listTileObject.scrollPolicyH = eui.ScrollPolicy.OFF;
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._updateListTileObject();
        }

        protected _onClosed(): void {
            this._listTileObject.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            const viewList = this._listTileObject.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof TileBaseRenderer) && (child.updateOnTileAnimationTick());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label = Lang.getText(Lang.Type.B0154);
        }

        private _createDataForListTileObject(): DataForTileBaseRenderer[] {
            const dataList: DataForTileBaseRenderer[] = [];
            ConfigManager.forEachTileBaseType((value, baseViewId) => {
                if (baseViewId !== 0) {
                    dataList.push({
                        baseViewId: baseViewId,
                    });
                }
            });
            return dataList;
        }

        private _updateListTileObject(): void {
            const dataList = this._createDataForListTileObject();
            this._listTileObject.bindData(dataList);
            this._listTileObject.scrollVerticalTo(0);
        }
    }

    type DataForTileBaseRenderer = {
        baseViewId: number;
    }

    class TileBaseRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _conTileView    : eui.Group;

        private _tileView   = new MeTileSimpleView();

        protected childrenCreated(): void {
            super.childrenCreated();

            const tileView = this._tileView;
            this._conTileView.addChild(tileView.getImgBase());
            this._conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();
        }

        public updateOnTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        protected dataChanged(): void {
            const data              = this.data as DataForTileBaseRenderer;
            const baseViewId        = data.baseViewId;
            this._labelName.text    = Lang.getTileName(ConfigManager.getTileType(ConfigManager.getTileBaseType(baseViewId), Types.TileObjectType.Empty));
            this._tileView.init(baseViewId, null);
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data = this.data as DataForTileBaseRenderer;
            MeChooseTileBasePanel.hide();
            MeManager.getWar().getDrawer().setModeDrawTileBase(data.baseViewId);
        }
    }
}
