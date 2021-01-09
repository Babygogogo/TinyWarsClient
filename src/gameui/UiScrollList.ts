
namespace TinyWars.GameUi {
    import Notify       = Utility.Notify;
    import Logger       = Utility.Logger;
    import StageManager = Utility.StageManager;

    export class UiScrollList extends eui.Scroller {
        private _itemRenderer : new () => GameUi.UiListItemRenderer;
        private _dataProvider : eui.ArrayCollection;

        private _scrollVerticalPercentage   : number;
        private _scrollHorizontalPercentage : number;
        private _mousePoint                 = new egret.Point();

        public constructor() {
            super();

            this._dataProvider = new eui.ArrayCollection();

            this.addEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public setItemRenderer(itemRenderer: new () => GameUi.UiListItemRenderer): void {
            if (this._itemRenderer !== itemRenderer) {
                this._itemRenderer              = itemRenderer;
                this.getViewList().itemRenderer = itemRenderer;
            }
        }

        public bindData(data : any[]): void {
            const provider = this._dataProvider;
            for (let i = 0; i < data.length; ++i) {
                const newItem = data[i];
                if (provider.getItemAt(i) == null) {
                    provider.addItem(newItem);
                } else {
                    provider.replaceItemAt(newItem, i);
                }
            }
            for (let i = provider.length - 1; i >= data.length; --i) {
                provider.removeItemAt(i);
            }

            const viewport = this.getViewList();
            if (viewport) {
                viewport.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedListItem, this);
                if (viewport.dataProvider != provider) {
                    viewport.dataProvider = provider;
                }

                // 修正从多子项切换到少子项时，且曾经拖动到比较远的的情况下，切换后可能没有显示子项的问题
                this.validateNow();
                viewport.scrollV = Math.max(0, Math.min(viewport.scrollV, viewport.contentHeight - viewport.height));
                viewport.scrollH = Math.max(0, Math.min(viewport.scrollH, viewport.contentWidth - viewport.width));
            }
        }

        public scrollVerticalTo(percentage : number) : void {
            if (this.getViewList()) {
                this._scrollVerticalPercentage = percentage;
                this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollVertical, this);
            }
        }

        public scrollHorizontalTo(percentage : number) : void {
            if (this.getViewList()) {
                this._scrollHorizontalPercentage = percentage;
                this.addEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollHorizontal, this);
            }
        }

        public getViewList(): eui.List {
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

        public refresh(): void {
            this._dataProvider.refresh();
        }

        public clear() : void {
            this.bindData([]);

            const list = this.getViewList();
            if (list) {
                list.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedListItem, this);
            }
        }

        private _onAllSkinPartsAdded(e : egret.Event) : void {
            if (e.target === this) {
                this.removeEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);

                const list = this.getViewList();
                if (!(list instanceof eui.List)) {
                    Logger.error(`UiScrollList._onAllSkinPartsAdded() invalid list!`);
                    return;
                }

                list.itemRenderer = this._itemRenderer;
                list.dataProvider = this._dataProvider;
                list.addEventListener(eui.ItemTapEvent.ITEM_TAP, this._onTouchedListItem, this);
            }
        }

        private _onAddedToStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.addEventListener(Notify.Type.MouseWheel, this._onNotifyMouseWheel, this);
        }

        private _onRemovedFromStage(e: egret.Event): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.removeEventListener(Notify.Type.MouseWheel, this._onNotifyMouseWheel, this);
        }

        private _onTouchedListItem(e : eui.ItemTapEvent) : void {
            const item: any = this.getViewList().getElementAt(e.itemIndex);
            (item) && (item.onItemTapEvent) && item.onItemTapEvent(e);
        }

        private _onEnterFrameScrollVertical(e : egret.Event) : void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollVertical, this);

            const viewport = this.getViewList();
            viewport.scrollV = this._scrollVerticalPercentage / 100 * Math.max(0, viewport.contentHeight - viewport.height);
        }

        private _onEnterFrameScrollHorizontal(e : egret.Event) : void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this._onEnterFrameScrollHorizontal, this);

            const viewport = this.getViewList();
            viewport.scrollH = this._scrollHorizontalPercentage / 100  * Math.max(0, viewport.contentWidth - viewport.width);
        }

        private _onNotifyMouseWheel(e: egret.Event): void {
            const { x, y } = this.globalToLocal(StageManager.getMouseX(), StageManager.getMouseY(), this._mousePoint);
            if ((x >= 0) && (x <= this.width) && (y >= 0) && (y <= this.height)) {
                this.stopAnimation();

                const value         = - e.data / 2;
                const viewport      = this.getViewList();
                viewport.scrollV    = Math.max(0, Math.min(viewport.scrollV + value, viewport.contentHeight - viewport.height));
                viewport.scrollH    = Math.max(0, Math.min(viewport.scrollH + value, viewport.contentWidth - viewport.width));
            }
        }
    }
}
