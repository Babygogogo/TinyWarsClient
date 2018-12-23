
namespace TinyWars.GameUi {
    import Logger = Utility.Logger;

    export class UiTab extends eui.Component {
        private _bar     : eui.TabBar;  // 页签栏
        private _page    : eui.Group;   // 页面内容，仅用于占位

        private _dataProvider    : eui.ArrayCollection;
        private _barItemRenderer : any;
        private _selectedIndex   : number = -1;

        public constructor() {
            super();

            this.addEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);
        }

        protected _onAllSkinPartsAdded(e : egret.Event) {
            if (e.target === this) {
                this.removeEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);

                this._bar.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedBarItem, this);
                this._bar.itemRenderer     = this._barItemRenderer;
                this._bar.dataProvider     = this._dataProvider;
                this._bar.requireSelection = true;

                if (this._dataProvider) {
                    this.setSelectedIndex(0);
                }
            }
        }

        private _onTouchedBarItem(e: eui.ItemTapEvent): void {
            const index = e.itemIndex;
            const data  = (this._dataProvider.getItemAt(index)) as DataForUiTab;
            if ((data.callbackOnTouchedItem == null) || (data.callbackOnTouchedItem())) {
                this.setSelectedIndex(index);
            } else {
                this._bar.selectedIndex = this._selectedIndex;
            }
        }

        public setSelectedIndex(index: number): void {
            this._removeAllCachedPagesFromParent();
            this._bar.selectedIndex = index;
            this._selectedIndex     = index;

            const data = (this._dataProvider.getItemAt(index)) as DataForUiTab;
            if (data) {
                data.pageInstance = data.pageInstance || this._createPageInstance(data);

                const pageInstance = data.pageInstance;
                if (!pageInstance) {
                    Logger.error("pageInstance is null");
                } else {
                    this._page.addChild(pageInstance);
                    pageInstance.open(data.pageData);
                }
            }
        }

        public getSelectedIndex() : number {
            return this._selectedIndex;
        }

        public getPageInstance(index : number) : UiTabPage {
            const data = this._dataProvider.getItemAt(index) as DataForUiTab;
            if (!data.pageInstance) {
                data.pageInstance = this._createPageInstance(data);
            }
            return data.pageInstance;
        }

        public setBarItemRenderer(itemRenderer: new () => eui.ItemRenderer ): void {
            this._barItemRenderer = itemRenderer;
            if (this._bar) {
                this._bar.itemRenderer = itemRenderer;
            }
        }

        public bindData(data : DataForUiTab[], selectedIndex : number = 0): void {
            egret.assert(data.length > 0, "UiTab.bindData() empty data is not allowed!");
            this.clear();

            this._dataProvider     = new eui.ArrayCollection(data.concat());
            this._bar.dataProvider = this._dataProvider;
            this.setSelectedIndex(selectedIndex);
        }

        public getData() : eui.ArrayCollection {
            return this._dataProvider;
        }

        public updateSingleData(index : number, data : DataForUiTab, refreshPage : boolean = true) : void {
            let dataProvider = this._dataProvider;
            if (!dataProvider) {
                return;
            }
            egret.assert(index >= 0 && index <= dataProvider.length, "UiTab.updateSingleData() 索引越界!");

            const oldData = dataProvider.getItemAt(index) as DataForUiTab;
            if (oldData.pageClass == data.pageClass) {
                data.pageInstance = oldData.pageInstance;
            }

            dataProvider.replaceItemAt(data, index);
            if ((index === this.getSelectedIndex()) && (refreshPage)) {
                this.setSelectedIndex(index);
            }
        }

        public clear() : void {
            this._removeAllCachedPagesFromParent();
        }

        private _createPageInstance(data : DataForUiTab) : UiTabPage | undefined {
            const pageClass = data.pageClass;
            if (typeof pageClass !== "string") {
                return new pageClass();
            } else {
                const def = egret.getDefinitionByName(pageClass)
                if (def) {
                    return new def();
                } else {
                    Logger.error("UiTab._createPageInstance() 找不到pageClassName对应的类: " + pageClass);
                    return undefined;
                }
            }
        }

        private _removeAllCachedPagesFromParent() : void {
            const dataProvider = this._dataProvider;
            if (dataProvider) {
                for (let i = 0; i < dataProvider.length; ++i) {
                    const pageInstance = (dataProvider.getItemAt(i) as DataForUiTab).pageInstance;
                    if ((pageInstance) && (pageInstance.parent)) {
                        pageInstance.close();
                        pageInstance.parent.removeChild(pageInstance);
                    }
                }
            }
        }
    }

    export type DataForUiTab = {
        callbackOnTouchedItem?: () => boolean;
        tabItemData          ?: any;

        pageClass : string | (new() => UiTabPage);
        pageData ?: any;
        /**
         * 页面的实例。设计意图是作为UiTab的页面缓存使用，因此外部不必提供此值；
         * 但如果提供了，则UiTab会直接使用此实例，而忽略掉pageClassName和pageSkinName属性。
         */
        pageInstance?: UiTabPage;
    }
}
