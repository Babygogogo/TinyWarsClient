
import TwnsUiComponent          from "./UiComponent";
import TwnsUiTabItemRenderer    from "./UiTabItemRenderer";
import TwnsUiTabPage            from "./UiTabPage";
import Logger                   from "../helpers/Logger";
import SoundManager             from "../helpers/SoundManager";

namespace TwnsUiTab {
    export class UiTab<DataForTabItemRenderer, DataForPage> extends TwnsUiComponent.UiComponent {
        private readonly _bar           : eui.TabBar;  // 页签栏
        private readonly _page          : eui.Group;   // 页面内容，仅用于占位

        private _tabDataArray           : DataForUiTab<DataForTabItemRenderer, DataForPage>[] = [];
        private _selectedIndex          : number;

        private _cachedItemRenderer     : new () => TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer>;
        private _cachedTabDataArray     : DataForUiTab<DataForTabItemRenderer, DataForPage>[];
        private _cachedPageDataDict     = new Map<number, DataForPage>();
        private _cachedSelectedIndex    : number;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._bar,    callback: this._onItemTapBar,       eventType: eui.ItemTapEvent.ITEM_TAP },
                { ui: this._bar,    callback: this._onTouchBeginBar,    eventType: egret.TouchEvent.TOUCH_BEGIN },
            ]);

            const bar               = this._bar;
            bar.dataProvider        = new eui.ArrayCollection();
            bar.requireSelection    = true;

            if (this._cachedItemRenderer) {
                bar.itemRenderer            = this._cachedItemRenderer;
                this._cachedItemRenderer    = null;
            }

            if (this._cachedTabDataArray) {
                const tabDataArray  = this._cachedTabDataArray;
                const pageDataDict  = this._cachedPageDataDict;
                for (const [index, pageData] of pageDataDict) {
                    if (tabDataArray[index]) {
                        tabDataArray[index].pageData = pageData;
                    }
                }
                this.bindData(tabDataArray, this._cachedSelectedIndex);

                this._cachedTabDataArray    = null;
                this._cachedSelectedIndex   = null;
                pageDataDict.clear();
            }
        }

        protected async _onClosed(): Promise<void> {
            this.clear();
        }

        private _onItemTapBar(e: eui.ItemTapEvent): void {
            const index = e.itemIndex;
            const data  = this._getTabDataArray()[index];
            if ((data.callbackOnTouchedItem == null) || (data.callbackOnTouchedItem())) {
                this._setSelectedIndex(index);
            } else {
                this._bar.selectedIndex = this.getSelectedIndex();
            }
        }
        private _onTouchBeginBar(e: egret.Event): void {
            SoundManager.playEffect("button.mp3");
        }

        private _setSelectedIndex(index: number): void {
            if (!this.getIsOpening()) {
                Logger.error(`UiTab._setSelectedIndex() not opening.`);
                return;
            }

            const data = this._getTabDataArray()[index];
            if (!data) {
                Logger.error(`UiTab.setSelectedIndex() empty data.`);
                return;
            }

            this._removeAllCachedPagesFromParent();
            this._bar.selectedIndex = index;
            this._selectedIndex     = index;

            if (!data.pageInstance) {
                data.pageInstance = new data.pageClass();
            }
            data.pageInstance.open(this._page, data.pageData);
        }
        public getSelectedIndex() : number {
            return this._selectedIndex;
        }

        public getPageInstance(index: number): TwnsUiTabPage.UiTabPage<DataForPage> {
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

        public setBarItemRenderer(itemRenderer: new () => TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer>): void {
            if (this.getIsOpening()) {
                this._bar.itemRenderer = itemRenderer;
            } else {
                this._cachedItemRenderer = itemRenderer;
            }
        }

        public bindData(dataArray: DataForUiTab<DataForTabItemRenderer, DataForPage>[], selectedIndex = 0): void {
            if (!dataArray.length) {
                Logger.error(`UiTab.bindData() empty data.`);
                return;
            }

            if (!this.getIsOpening()) {
                this._cachedTabDataArray    = dataArray;
                this._cachedSelectedIndex   = selectedIndex;
            } else {
                this.clear();
                this._getTabDataArray().push(...dataArray);

                const itemDataArray: DataForTabItemRenderer[] = [];
                for (const tabData of dataArray) {
                    itemDataArray.push(tabData.tabItemData);
                }
                (this._bar.dataProvider as eui.ArrayCollection).source = itemDataArray;

                this._setSelectedIndex(selectedIndex);
            }
        }

        private _getTabDataArray(): DataForUiTab<DataForTabItemRenderer, DataForPage>[] {
            return this._tabDataArray;
        }

        public updatePageData(index: number, pageData: DataForPage, refreshPage = true): void {
            if (!this.getIsOpening()) {
                this._cachedPageDataDict.set(index, pageData);
                return;
            }

            const tabData = this._getTabDataArray()[index];
            if (!tabData) {
                Logger.error(`UiTab.updatePageData() invalid index.`);
                return;
            }

            tabData.pageData = pageData;
            if ((index === this.getSelectedIndex()) && (refreshPage)) {
                this._setSelectedIndex(index);
            }
        }

        public clear() : void {
            this._removeAllCachedPagesFromParent();
            this._getTabDataArray().length  = 0;
            this._selectedIndex             = null;
            this._cachedItemRenderer        = null;
            this._cachedSelectedIndex       = null;
            this._cachedTabDataArray        = null;
            this._cachedPageDataDict.clear();

            if (this.getIsOpening()) {
                (this._bar.dataProvider as eui.ArrayCollection).removeAll();
            }
        }

        private _removeAllCachedPagesFromParent() : void {
            for (const data of this._getTabDataArray()) {
                const pageInstance = data.pageInstance;
                (pageInstance) && (pageInstance.close());
            }
        }
    }

    type DataForUiTab<DataForTabItemRenderer, DataForPage> = {
        callbackOnTouchedItem?  : () => boolean;
        tabItemData?            : DataForTabItemRenderer;

        pageClass               : new () => TwnsUiTabPage.UiTabPage<DataForPage>;
        pageData?               : DataForPage;

        /**
         * 页面的实例。设计意图是作为UiTab的页面缓存使用，因此外部不必提供此值；
         * 但如果提供了，则UiTab会直接使用此实例，而忽略掉pageClassName和pageSkinName属性。
         */
        pageInstance?           : TwnsUiTabPage.UiTabPage<DataForPage>;
    };
}

export default TwnsUiTab;
