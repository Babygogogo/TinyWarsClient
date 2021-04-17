
namespace TinyWars.GameUi {
    import Logger = Utility.Logger;

    export class UiTab<DataForTabItemRenderer> extends UiComponent {
        private readonly _bar           : eui.TabBar;  // 页签栏
        private readonly _page          : eui.Group;   // 页面内容，仅用于占位

        private readonly _dataProvider  = new eui.ArrayCollection();
        private _barItemRenderer        : new () => UiTabItemRenderer<DataForTabItemRenderer>;
        private _selectedIndex          : number = -1;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._bar,    callback: this._onTouchedBarItem, eventType: eui.ItemTapEvent.ITEM_TAP },
            ]);

            this._bar.itemRenderer     = this._barItemRenderer;
            this._bar.dataProvider     = this.getDataProvider();
            this._bar.requireSelection = true;

            this.setSelectedIndex(0);
        }

        private _onTouchedBarItem(e: eui.ItemTapEvent): void {
            const index = e.itemIndex;
            const data  = (this.getDataProvider().getItemAt(index)) as DataForUiTab<DataForTabItemRenderer>;
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

            const data = (this.getDataProvider().getItemAt(index)) as DataForUiTab<DataForTabItemRenderer>;
            if (data) {
                data.pageInstance = data.pageInstance || this._createPageInstance(data);

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

        public getPageInstance(index : number) : UiTabPage {
            const data = this.getDataProvider().getItemAt(index) as DataForUiTab<DataForTabItemRenderer>;
            if (!data.pageInstance) {
                data.pageInstance = this._createPageInstance(data);
            }
            return data.pageInstance;
        }

        public setBarItemRenderer(itemRenderer: new () => UiTabItemRenderer<DataForTabItemRenderer>): void {
            this._barItemRenderer = itemRenderer;
            if (this._bar) {
                this._bar.itemRenderer = itemRenderer;
            }
        }

        public bindData(data: DataForUiTab<DataForTabItemRenderer>[], selectedIndex: number = 0): void {
            if (!data.length) {
                Logger.error(`UiTab.bindData() empty data.`);
                return;
            }

            this.clear();
            const dataProvider = this.getDataProvider();
            dataProvider.replaceAll(data.concat());

            const bar = this._bar;
            if (bar) {
                bar.dataProvider = dataProvider;
                this.setSelectedIndex(selectedIndex);
            }
        }

        public getDataProvider() : eui.ArrayCollection {
            return this._dataProvider;
        }

        public updateSingleData(index : number, data : DataForUiTab<DataForTabItemRenderer>, refreshPage : boolean = true) : void {
            const dataProvider = this.getDataProvider();
            if ((index < 0) || (index >= dataProvider.length)) {
                Logger.error(`UiTab.updateSingleData() invalid index.`);
            }

            const oldData = dataProvider.getItemAt(index) as DataForUiTab<DataForTabItemRenderer>;
            if (oldData.pageClass == data.pageClass) {
                data.pageInstance = oldData.pageInstance;
            }

            dataProvider.replaceItemAt(data, index);
            if ((index === this.getSelectedIndex()) && (refreshPage)) {
                this.setSelectedIndex(index);
            }
        }
        public updatePageData(index: number, pageData: any, refreshPage = true): void {
            const dataProvider = this.getDataProvider();
            if ((index < 0) || (index >= dataProvider.length)) {
                Logger.error(`UiTab.updateSingleData() invalid index.`);
                return;
            }

            (dataProvider.getItemAt(index) as DataForUiTab<DataForTabItemRenderer>).pageData = pageData;
            if ((index === this.getSelectedIndex()) && (refreshPage)) {
                this.setSelectedIndex(index);
            }
        }

        public clear() : void {
            this._removeAllCachedPagesFromParent();
        }

        private _createPageInstance(data : DataForUiTab<DataForTabItemRenderer>) : UiTabPage | undefined {
            return new data.pageClass();
        }

        private _removeAllCachedPagesFromParent() : void {
            const dataProvider = this.getDataProvider();
            for (let i = 0; i < dataProvider.length; ++i) {
                const pageInstance = (dataProvider.getItemAt(i) as DataForUiTab<DataForTabItemRenderer>).pageInstance;
                if (pageInstance) {
                    pageInstance.close();
                }
            }
        }
    }

    export type DataForUiTab<DataForTabItemRenderer> = {
        callbackOnTouchedItem?  : () => boolean;
        tabItemData?            : DataForTabItemRenderer;

        pageClass               : new() => UiTabPage;
        pageData?               : any;

        /**
         * 页面的实例。设计意图是作为UiTab的页面缓存使用，因此外部不必提供此值；
         * 但如果提供了，则UiTab会直接使用此实例，而忽略掉pageClassName和pageSkinName属性。
         */
        pageInstance?           : UiTabPage;
    }
}
