
namespace GameUi {
    export class UiScrollList extends eui.Scroller {
        private _itemRenderer : any;
        private _dataProvider : eui.ArrayCollection;

        private _scrollVerticalPercentage   : number;
        private _scrollHorizontalPercentage : number;

        public constructor() {
            super();

            this._dataProvider = new eui.ArrayCollection();

            this.addEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);
        }

        public setItemRenderer(itemRenderer: any): void {
            this._itemRenderer = itemRenderer;
            if ((this.viewport) && (this.viewport instanceof eui.List)) {
                this.viewport.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedListItem, this);
                this.viewport.itemRenderer = itemRenderer;
            }
        }

        public bindData(data : any[]): void {
            const provider = this._dataProvider;
            for (let i = 0; i < data.length; ++i) {
                const newItem = data[i];
                let oldItem   = provider.getItemAt(i);

                if (oldItem == null) {
                    provider.addItem(newItem);
                } else {
                    provider.replaceItemAt(newItem, i);
                }
            }
            for (let i = provider.length - 1; i >= data.length; --i) {
                provider.removeItemAt(i);
            }

            if ((this.viewport) && (this.viewport instanceof eui.List)) {
                this.viewport.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedListItem, this);
                if (this.viewport.dataProvider != provider) {
                    this.viewport.dataProvider = provider;
                }
            }
        }

        public scrollVerticalTo(percentage : number) : void {
            if (this.viewport) {
                this._scrollVerticalPercentage = percentage;
                this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollVertical, this);
            }
        }

        public scrollHorizontalTo(percentage : number) : void {
            if (this.viewport) {
                this._scrollHorizontalPercentage = percentage;
                this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollHorizontal, this);
            }
        }

        public getViewList() : eui.List {
            return this.viewport as eui.List;
        }

        public getDataProvider() : eui.ArrayCollection {
            return this._dataProvider;
        }

        public updateSingleData(index : number, data : any) : void {
            let dataProvider = this._dataProvider;
            if (!dataProvider) {
                return;
            }
            egret.assert(index >= 0 && index <= dataProvider.length, "UIScrollList.updateSingleData() 索引越界!");

            dataProvider.replaceItemAt(data, index);
        }

        public clear() : void {
            this.bindData([]);
            if (this.viewport) {
                this.viewport.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedListItem, this);
            }
        }

        private _onAllSkinPartsAdded(e : egret.Event) : void {
            if (e.target === this) {
                this.removeEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);

                let list = this.viewport as eui.List;
                list.itemRenderer = this._itemRenderer;
                list.dataProvider = this._dataProvider;
                list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedListItem, this);
            }
        }

        private _onTouchedListItem(e : eui.ItemTapEvent) : void {
            const item : any = (this.viewport as eui.List).getElementAt(e.itemIndex);
            if(item){
                item.onItemTapEvent && item.onItemTapEvent(e);
            }
        }

        private _onEnterFrameScrollVertical(e : egret.Event) : void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollVertical, this);

            const viewport = this.viewport;
            viewport.scrollV = this._scrollVerticalPercentage / 100 * Math.max(0, viewport.contentHeight - viewport.height);
        }

        private _onEnterFrameScrollHorizontal(e : egret.Event) : void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollHorizontal, this);

            const viewport = this.viewport;
            viewport.scrollH = this._scrollHorizontalPercentage / 100  * Math.max(0, viewport.contentWidth - viewport.width);
        }
    }
}
