
namespace TinyWars.GameUi {
    import Logger = Utility.Logger;

    export class UiTab<DataForTabItemRenderer, DataForPage> extends UiComponent {
        private readonly _bar           : eui.TabBar;  // 页签栏
        private readonly _page          : eui.Group;   // 页面内容，仅用于占位

        private readonly _tabDataArray  : DataForUiTab<DataForTabItemRenderer, DataForPage>[] = [];
        private _barItemRenderer        : new () => UiTabItemRenderer<DataForTabItemRenderer>;
        private _selectedIndex          : number = -1;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._bar,    callback: this._onTouchedBarItem, eventType: eui.ItemTapEvent.ITEM_TAP },
            ]);

            const bar               = this._bar;
            bar.itemRenderer        = this._barItemRenderer;
            bar.dataProvider        = new eui.ArrayCollection();
            bar.requireSelection    = true;

            this.setSelectedIndex(0);
        }

        protected async _onClosed(): Promise<void> {
            this.clear();
        }

        private _onTouchedBarItem(e: eui.ItemTapEvent): void {
            const index = e.itemIndex;
            const data  = this._getTabDataArray()[index];
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

            const data = this._getTabDataArray()[index];
            if (data) {
                if (!data.pageInstance) {
                    data.pageInstance = new data.pageClass();
                }

                const pageInstance = data.pageInstance;
                if (!pageInstance) {
                    Logger.error("pageInstance is null");
                } else {
                    pageInstance.open(this._page, data.pageData);
                }
            }
        }
        public getSelectedIndex() : number {
            return this._selectedIndex;
        }

        public getPageInstance(index: number) : UiTabPage<DataForPage> {
            const tabData = this._getTabDataArray()[index];
            if (!tabData) {
                return undefined;
            } else {
                if (!tabData.pageInstance) {
                    tabData.pageInstance = new tabData.pageClass();
                }
                return tabData.pageInstance;
            }
        }

        public setBarItemRenderer(itemRenderer: new () => UiTabItemRenderer<DataForTabItemRenderer>): void {
            this._barItemRenderer = itemRenderer;
            if (this._bar) {
                this._bar.itemRenderer = itemRenderer;
            }
        }

        public bindData(dataArray: DataForUiTab<DataForTabItemRenderer, DataForPage>[], selectedIndex: number = 0): void {
            if (!dataArray.length) {
                Logger.error(`UiTab.bindData() empty data.`);
                return;
            }

            this.clear();
            this._getTabDataArray().push(...dataArray);

            const bar = this._bar;
            if (bar) {
                const itemDataArray: DataForTabItemRenderer[] = [];
                for (const tabData of dataArray) {
                    itemDataArray.push(tabData.tabItemData);
                }

                const dataProvider = bar.dataProvider as eui.ArrayCollection;
                (bar.dataProvider as eui.ArrayCollection).source = itemDataArray;
                dataProvider.refresh();

                // this.setSelectedIndex(selectedIndex);
                this.setSelectedIndex(Math.floor(Math.random() * dataArray.length));
            }
        }

        private _getTabDataArray(): DataForUiTab<DataForTabItemRenderer, DataForPage>[] {
            return this._tabDataArray;
        }

        public updatePageData(index: number, pageData: DataForPage, refreshPage = true): void {
            const tabData = this._getTabDataArray()[index];
            if (!tabData) {
                Logger.error(`UiTab.updatePageData() invalid index.`);
                return;
            }

            tabData.pageData = pageData;
            if ((index === this.getSelectedIndex()) && (refreshPage)) {
                this.setSelectedIndex(index);
            }
        }

        public clear() : void {
            this._removeAllCachedPagesFromParent();
            this._getTabDataArray().length = 0;
        }

        private _removeAllCachedPagesFromParent() : void {
            for (const data of this._getTabDataArray()) {
                const pageInstance = data.pageInstance;
                (pageInstance) && (pageInstance.close());
            }
        }
    }

    export type DataForUiTab<DataForTabItemRenderer, DataForPage> = {
        callbackOnTouchedItem?  : () => boolean;
        tabItemData?            : DataForTabItemRenderer;

        pageClass               : new () => UiTabPage<DataForPage>;
        pageData?               : DataForPage;

        /**
         * 页面的实例。设计意图是作为UiTab的页面缓存使用，因此外部不必提供此值；
         * 但如果提供了，则UiTab会直接使用此实例，而忽略掉pageClassName和pageSkinName属性。
         */
        pageInstance?           : UiTabPage<DataForPage>;
    }
}
