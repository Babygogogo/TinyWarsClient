
namespace TinyWars.MapEditor {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    const MAX_RECENT_COUNT = 10;

    export class MeChooseTileObjectPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseTileObjectPanel;

        private _labelRecentTitle   : GameUi.UiLabel;
        private _listRecent         : GameUi.UiScrollList;
        private _listCategory       : GameUi.UiScrollList;
        private _btnCancel          : GameUi.UiButton;

        private _dataListForRecent  : DataForTileObjectRenderer[] = [];

        public static show(): void {
            if (!MeChooseTileObjectPanel._instance) {
                MeChooseTileObjectPanel._instance = new MeChooseTileObjectPanel();
            }
            MeChooseTileObjectPanel._instance.open();
        }
        public static hide(): void {
            if (MeChooseTileObjectPanel._instance) {
                MeChooseTileObjectPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/mapEditor/MeChooseTileObjectPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this.close },
            ];
            this._listRecent.setItemRenderer(TileObjectRenderer);
            this._listCategory.setItemRenderer(CategoryRenderer);
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._updateListRecent();
            this._updateListCategory();
        }

        protected _onClosed(): void {
            this._listCategory.clear();
            this._listRecent.clear();
        }

        public updateOnChooseTileObject(objectViewId: number): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => v.objectViewId !== objectViewId);
            dataList.length     = 0;
            dataList[0]         = {
                objectViewId,
                panel   : this,
            };
            for (const v of filteredList) {
                if (dataList.length < MAX_RECENT_COUNT) {
                    dataList.push(v);
                } else {
                    break;
                }
            }
            this._updateListRecent();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            const viewListForCategory = this._listCategory.getViewList();
            for (let i = 0; i < viewListForCategory.numChildren; ++i) {
                const child = viewListForCategory.getChildAt(i);
                (child instanceof CategoryRenderer) && (child.updateOnTileAnimationTick());
            }

            const viewListForRecent = this._listRecent.getViewList();
            for (let i = 0; i < viewListForRecent.numChildren; ++i) {
                const child = viewListForRecent.getChildAt(i);
                (child instanceof TileObjectRenderer) && (child.updateOnTileAnimationTick());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelRecentTitle.text = `${Lang.getText(Lang.Type.B0372)}:`
        }

        private _createDataForListCategory(): DataForCategoryRenderer[] {
            const mapping = new Map<number, number[]>();
            ConfigManager.forEachTileObjectTypeAndPlayerIndex((value, objectViewId) => {
                const playerIndex = value.playerIndex;
                if (objectViewId !== 0) {
                    if (mapping.has(playerIndex)) {
                        mapping.get(playerIndex).push(objectViewId);
                    } else {
                        mapping.set(playerIndex, [objectViewId]);
                    }
                }
            });
            const dataList: DataForCategoryRenderer[] = [];
            for (const [, objectViewIdList] of mapping) {
                dataList.push({
                    objectViewIdList,
                    panel   : this,
                });
            }

            return dataList;
        }

        private _updateListCategory(): void {
            const dataList = this._createDataForListCategory();
            this._listCategory.bindData(dataList);
            this._listCategory.scrollVerticalTo(0);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        objectViewIdList: number[];
        panel           : MeChooseTileObjectPanel;
    }

    class CategoryRenderer extends eui.ItemRenderer {
        private _labelCategory  : GameUi.UiLabel;
        private _listTileObject : GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listTileObject.setItemRenderer(TileObjectRenderer);
            this._listTileObject.scrollPolicyH = eui.ScrollPolicy.OFF;
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForCategoryRenderer;
            const objectViewIdList      = data.objectViewIdList;
            this._labelCategory.text    = Lang.getPlayerForceName(ConfigManager.getTileObjectTypeAndPlayerIndex(objectViewIdList[0]).playerIndex);

            const dataListForTileObject : DataForTileObjectRenderer[] = [];
            const panel                 = data.panel;
            for (const objectViewId of objectViewIdList) {
                dataListForTileObject.push({
                    panel,
                    objectViewId,
                });
            }
            this._listTileObject.bindData(dataListForTileObject);
        }

        public updateOnTileAnimationTick(): void {
            const viewList = this._listTileObject.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof TileObjectRenderer) && (child.updateOnTileAnimationTick());
            }
        }
    }

    type DataForTileObjectRenderer = {
        objectViewId: number;
        panel       : MeChooseTileObjectPanel;
    }

    class TileObjectRenderer extends eui.ItemRenderer {
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
            const data              = this.data as DataForTileObjectRenderer;
            this._labelName.text    = Lang.getTileName(ConfigManager.getTileType(Types.TileBaseType.Plain, ConfigManager.getTileObjectTypeAndPlayerIndex(data.objectViewId).tileObjectType));
            this._tileView.init(null, data.objectViewId);
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data          = this.data as DataForTileObjectRenderer;
            const panel         = data.panel;
            const objectViewId  = data.objectViewId;
            panel.updateOnChooseTileObject(objectViewId);
            panel.close();
            MeManager.getWar().getDrawer().setModeDrawTileObject(objectViewId);
        }
    }
}
