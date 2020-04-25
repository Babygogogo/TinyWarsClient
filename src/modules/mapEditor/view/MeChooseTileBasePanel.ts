
namespace TinyWars.MapEditor {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;
    import Types    = Utility.Types;

    const MAX_RECENT_COUNT = 10;

    export class MeChooseTileBasePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseTileBasePanel;

        private _listCategory       : GameUi.UiScrollList;
        private _listRecent         : GameUi.UiScrollList;
        private _labelRecentTitle   : GameUi.UiLabel;
        private _btnCancel          : GameUi.UiButton;
        private _groupFill          : eui.Group;
        private _imgFill            : GameUi.UiImage;
        private _labelFill          : GameUi.UiLabel;

        private _needFill           : boolean;
        private _dataListForRecent  : DataForTileBaseRenderer[] = [];

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
                { ui: this._groupFill,  callback: this._onTouchedGroupFill },
            ];
            this._listCategory.setItemRenderer(CategoryRenderer);
            this._listRecent.setItemRenderer(TileBaseRenderer);
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._needFill = false;
            this._updateImgFill();
            this._updateListTileObject();
            this._updateListRecent();
        }

        protected _onClosed(): void {
            this._listCategory.clear();
            this._listRecent.clear();
        }

        public getNeedFill(): boolean {
            return this._needFill;
        }

        public updateOnChooseTileBase(baseViewId: number): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => v.baseViewId !== baseViewId);
            dataList.length     = 0;
            dataList[0]         = {
                baseViewId,
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
            const viewListForTileBase = this._listCategory.getViewList();
            for (let i = 0; i < viewListForTileBase.numChildren; ++i) {
                const child = viewListForTileBase.getChildAt(i);
                (child instanceof CategoryRenderer) && (child.updateOnTileAnimationTick());
            }

            const viewListForRecent = this._listRecent.getViewList();
            for (let i = 0; i < viewListForRecent.numChildren; ++i) {
                const child = viewListForRecent.getChildAt(i);
                (child instanceof TileBaseRenderer) && (child.updateOnTileAnimationTick());
            }
        }

        private _onTouchedGroupFill(e: egret.Event): void {
            this._needFill = !this._needFill;
            this._updateImgFill();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelFill.text        = Lang.getText(Lang.Type.B0294);
            this._labelRecentTitle.text = `${Lang.getText(Lang.Type.B0372)}:`
        }

        private _updateImgFill(): void {
            this._imgFill.visible = this._needFill;
        }

        private _createDataForListCategory(): DataForCategoryRenderer[] {
            const typeMap = new Map<number, number[]>();
            ConfigManager.forEachTileBaseType((baseType, baseViewId) => {
                if (baseViewId !== 0) {
                    if (typeMap.has(baseType)) {
                        typeMap.get(baseType).push(baseViewId);
                    } else {
                        typeMap.set(baseType, [baseViewId]);
                    }
                }
            });
            const dataList: DataForCategoryRenderer[] = [];
            for (const [, baseViewIdList] of typeMap) {
                dataList.push({
                    baseViewIdList,
                    panel   : this,
                });
            }

            return dataList;
        }

        private _updateListTileObject(): void {
            this._listCategory.bindData(this._createDataForListCategory());
            this._listCategory.scrollVerticalTo(0);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        baseViewIdList  : number[];
        panel           : MeChooseTileBasePanel;
    }

    class CategoryRenderer extends eui.ItemRenderer {
        private _labelCategory  : GameUi.UiLabel;
        private _listTileBase   : GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listTileBase.setItemRenderer(TileBaseRenderer);
            this._listTileBase.scrollPolicyH = eui.ScrollPolicy.OFF;
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForCategoryRenderer;
            const baseViewIdList        = data.baseViewIdList;
            this._labelCategory.text    = Lang.getTileName(ConfigManager.getTileType(ConfigManager.getTileBaseType(baseViewIdList[0]), Types.TileObjectType.Empty));

            const dataListForTileBase   : DataForTileBaseRenderer[] = [];
            const panel                 = data.panel;
            for (const baseViewId of baseViewIdList) {
                dataListForTileBase.push({
                    panel,
                    baseViewId,
                });
            }
            this._listTileBase.bindData(dataListForTileBase);
        }

        public updateOnTileAnimationTick(): void {
            const viewListForTileBase = this._listTileBase.getViewList();
            for (let i = 0; i < viewListForTileBase.numChildren; ++i) {
                const child = viewListForTileBase.getChildAt(i);
                (child instanceof TileBaseRenderer) && (child.updateOnTileAnimationTick());
            }
        }
    }

    type DataForTileBaseRenderer = {
        baseViewId  : number;
        panel       : MeChooseTileBasePanel;
    }

    class TileBaseRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
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
            const data          = this.data as DataForTileBaseRenderer;
            const baseViewId    = data.baseViewId;
            this._tileView.init(baseViewId, null);
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data          = this.data as DataForTileBaseRenderer;
            const panel         = data.panel;
            const baseViewId    = data.baseViewId;
            if (!panel.getNeedFill()) {
                panel.updateOnChooseTileBase(baseViewId);
                panel.close();
                MeManager.getWar().getDrawer().setModeDrawTileBase(baseViewId);
            } else {
                Common.ConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0089),
                    callback: () => {
                        const war           = MeManager.getWar();
                        const configVersion = war.getConfigVersion();
                        war.getTileMap().forEachTile(tile => {
                            tile.init({
                                gridX       : tile.getGridX(),
                                gridY       : tile.getGridY(),
                                objectViewId: tile.getObjectViewId(),
                                baseViewId  : data.baseViewId,
                            }, configVersion);
                            tile.startRunning(war);
                            tile.updateView();
                        });

                        panel.updateOnChooseTileBase(baseViewId);
                        panel.close();
                        Notify.dispatch(Notify.Type.MeTileChanged, { gridIndex: war.getField().getCursor().getGridIndex() } as Notify.Data.MeTileChanged);
                    },
                });
            }
        }
    }
}
