
namespace TinyWars.MapEditor {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;

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
            MeChooseTileObjectPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MeChooseTileObjectPanel._instance) {
                await MeChooseTileObjectPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeChooseTileObjectPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
            ]);
            this._listRecent.setItemRenderer(TileObjectRenderer);
            this._listCategory.setItemRenderer(CategoryRenderer);

            this._updateComponentsForLanguage();

            this._updateListRecent();
            this._updateListCategory();
        }

        protected async _onClosed(): Promise<void> {
            this._listCategory.clear();
            this._listRecent.clear();
        }

        public updateOnChooseTileObject(data: DataForDrawTileObject): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => {
                const oldData = v.dataForDrawTileObject;
                return (oldData.objectType != data.objectType)
                    || (oldData.playerIndex != data.playerIndex)
                    || (oldData.shapeId != data.shapeId);
            });
            dataList.length     = 0;
            dataList[0]         = {
                dataForDrawTileObject   : data,
                panel                   : this,
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
            const mapping = new Map<number, DataForDrawTileObject[]>();
            for (const [objectType, cfg] of ConfigManager.getTileObjectShapeCfgs()) {
                for (let playerIndex = cfg.minPlayerIndex; playerIndex <= cfg.maxPlayerIndex; ++playerIndex) {
                    if (!mapping.has(playerIndex)) {
                        mapping.set(playerIndex, []);
                    }

                    const dataListForDrawTileObject = mapping.get(playerIndex);
                    for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                        dataListForDrawTileObject.push({
                            objectType,
                            playerIndex,
                            shapeId
                        });
                    }
                }
            }

            const dataList: DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawTileObject] of mapping) {
                dataList.push({
                    dataListForDrawTileObject,
                    panel                       : this,
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
        dataListForDrawTileObject   : DataForDrawTileObject[];
        panel                       : MeChooseTileObjectPanel;
    }

    class CategoryRenderer extends GameUi.UiListItemRenderer {
        private _labelCategory  : GameUi.UiLabel;
        private _listTileObject : GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listTileObject.setItemRenderer(TileObjectRenderer);
            this._listTileObject.scrollPolicyH = eui.ScrollPolicy.OFF;
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                      = this.data as DataForCategoryRenderer;
            const dataListForDrawTileObject = data.dataListForDrawTileObject;
            this._labelCategory.text        = Lang.getPlayerForceName(dataListForDrawTileObject[0].playerIndex);

            const dataListForTileObject : DataForTileObjectRenderer[] = [];
            const panel                 = data.panel;
            for (const dataForDrawTileObject of dataListForDrawTileObject) {
                dataListForTileObject.push({
                    panel,
                    dataForDrawTileObject,
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
        dataForDrawTileObject   : DataForDrawTileObject;
        panel                   : MeChooseTileObjectPanel;
    }

    class TileObjectRenderer extends GameUi.UiListItemRenderer {
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
            const data                  = this.data as DataForTileObjectRenderer;
            const dataForDrawTileObject = data.dataForDrawTileObject;
            const tileObjectType        = dataForDrawTileObject.objectType;
            this._labelName.text        = Lang.getTileName(ConfigManager.getTileType(Types.TileBaseType.Plain, tileObjectType));
            this._tileView.init({
                tileObjectType,
                tileObjectShapeId   : dataForDrawTileObject.shapeId,
                tileBaseShapeId     : null,
                tileBaseType        : null,
                playerIndex         : dataForDrawTileObject.playerIndex,
            });
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data                  = this.data as DataForTileObjectRenderer;
            const panel                 = data.panel;
            const dataForDrawTileObject = data.dataForDrawTileObject;
            panel.updateOnChooseTileObject(dataForDrawTileObject);
            panel.close();
            MeModel.getWar().getDrawer().setModeDrawTileObject(dataForDrawTileObject);
        }
    }
}
