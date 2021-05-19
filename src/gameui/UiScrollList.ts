
namespace TinyWars.GameUi {
    import Notify       = Utility.Notify;
    import Logger       = Utility.Logger;
    import StageManager = Utility.StageManager;
    import UiListener   = Utility.Types.UiListener;

    export class UiScrollList<DataForRenderer> extends eui.Scroller {
        private _isChildrenCreated  = false;
        private _isOpening          = false;

        private _notifyListenerArray: Notify.Listener[];
        private _uiListenerArray    : UiListener[];

        private _list                   : eui.List;

        private _cachedItemRenderer     : new () => GameUi.UiListItemRenderer<DataForRenderer>;
        private _cachedListDataArray    : DataForRenderer[];
        private readonly _mousePoint    = new egret.Point();

        public constructor() {
            super();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;
            this._doOpen();
        }

        private _onAddedToStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            this._doOpen();
        }

        private _onRemovedFromStage(e: egret.Event): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            this._doClose();
        }

        private _doOpen(): void {
            if (!this._checkIsReadyForOpen()) {
                return;
            }

            if (!this.getIsOpening()) {
                this._setIsOpening(true);

                this._onOpened();
                this._registerListeners();
            }
        }
        private _doClose(): void {
            if (this.getIsOpening()) {
                this._setIsOpening(false);

                this._unregisterListeners();
                this._setUiListenerArray(undefined);
                this._setNotifyListenerArray(undefined);
                this._onClosed();
            }
        }

        private _onOpened(): void {
            if (this.numChildren !== 1) {
                Logger.error(`UiScrollList._onAllSkinPartsAdded() this.numChildren !== 1`);
                return;
            }

            const list = this.getChildAt(0);
            if ((list == null) || (!(list instanceof eui.List))) {
                Logger.error(`UiScrollList._onAllSkinPartsAdded() invalid list!`);
                return;
            }

            this._setNotifyListenerArray([
                { type: Notify.Type.MouseWheel, callback: this._onNotifyMouseWheel },
            ]);
            this._setUiListenerArray([
                { ui: list, callback: this._onItemTapList,      eventType: eui.ItemTapEvent.ITEM_TAP },
                { ui: list, callback: this._onTouchBeginList,   eventType: egret.TouchEvent.TOUCH_BEGIN },
            ]);

            this._list          = list;
            list.dataProvider   = new eui.ArrayCollection();

            if (this._cachedItemRenderer) {
                list.itemRenderer           = this._cachedItemRenderer;
                this._cachedItemRenderer    = null;
            }

            if (this._cachedListDataArray) {
                this.bindData(this._cachedListDataArray);
                this._cachedListDataArray = null;
            }
        }
        private _onClosed(): void {
            this.clear();
        }

        private _checkIsReadyForOpen(): boolean {
            return (this.stage != null)
                && (this._isChildrenCreated);
        }
        public getIsOpening(): boolean {
            return this._isOpening;
        }
        private _setIsOpening(opening: boolean): void {
            this._isOpening = opening;
        }

        private _setNotifyListenerArray(array: Notify.Listener[]): void {
            this._notifyListenerArray = array;
        }
        private _getNotifyListenerArray(): Notify.Listener[] | undefined {
            return this._notifyListenerArray;
        }
        private _setUiListenerArray(array: UiListener[]): void {
            this._uiListenerArray = array;
        }
        private _getUiListenerArray(): UiListener[] | undefined {
            return this._uiListenerArray;
        }

        private _registerListeners(): void {
            const notifyListenerArray = this._getNotifyListenerArray();
            if (notifyListenerArray) {
                Utility.Notify.addEventListeners(notifyListenerArray, this);
            }

            const uiListenerArray = this._getUiListenerArray();
            if (uiListenerArray) {
                for (const l of uiListenerArray) {
                    l.ui.addEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }

        private _unregisterListeners(): void {
            const notifyListenerArray = this._getNotifyListenerArray();
            if (notifyListenerArray) {
                Utility.Notify.removeEventListeners(notifyListenerArray, this);
            }

            const uiListenerArray = this._getUiListenerArray();
            if (uiListenerArray) {
                for (const l of uiListenerArray) {
                    l.ui.removeEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }

        private _onItemTapList(e: eui.ItemTapEvent): void {
            if (!this.getIsOpening()) {
                return;
            }

            const item = this._list.getElementAt(e.itemIndex);
            if (item instanceof UiListItemRenderer) {
                item.onItemTapEvent(e);
            }
        }
        private _onTouchBeginList(e: egret.TouchEvent): void {
            Utility.SoundManager.playEffect("button.mp3");
        }
        private _onNotifyMouseWheel(e: egret.Event): void {
            if (!this.getIsOpening()) {
                return;
            }

            const { x, y } = this.globalToLocal(StageManager.getMouseX(), StageManager.getMouseY(), this._mousePoint);
            if ((x >= 0) && (x <= this.width) && (y >= 0) && (y <= this.height)) {
                this.stopAnimation();

                const value     = - e.data / 2;
                const list      = this._list;
                list.scrollV    = Math.max(0, Math.min(list.scrollV + value, list.contentHeight - list.height));
                list.scrollH    = Math.max(0, Math.min(list.scrollH + value, list.contentWidth - list.width));
            }
        }

        public setItemRenderer(itemRenderer: new () => GameUi.UiListItemRenderer<DataForRenderer>): void {
            if (this.getIsOpening()) {
                this._list.itemRenderer = itemRenderer;
            } else {
                this._cachedItemRenderer = itemRenderer;
            }
        }

        public bindData(dataArray: DataForRenderer[]): void {
            if (!this.getIsOpening()) {
                this._cachedListDataArray = dataArray;
            } else {
                this._getDataProvider().replaceAll(dataArray);

                // 修正从多子项切换到少子项时，且曾经拖动到比较远的的情况下，切换后可能没有显示子项的问题
                this.validateNow();
                const list      = this._list;
                list.scrollV    = Math.max(0, Math.min(list.scrollV, list.contentHeight - list.height));
                list.scrollH    = Math.max(0, Math.min(list.scrollH, list.contentWidth - list.width));
            }
        }
        public updateSingleData(index: number, data: DataForRenderer): void {
            if (this.getIsOpening()) {
                const dataProvider = this._getDataProvider();
                if ((index < 0) || (index >= dataProvider.length)) {
                    Logger.error(`UiScrollList.updateSingleData() invalid index.`);
                } else {
                    dataProvider.replaceItemAt(data, index);
                }
            } else {
                const cachedDataArray = this._cachedListDataArray;
                if ((cachedDataArray)                   &&
                    (index < cachedDataArray.length)    &&
                    (index >= 0)
                ) {
                    cachedDataArray[index] = data;
                }
            }
        }
        public refresh(): void {
            if (this.getIsOpening()) {
                this._getDataProvider().refresh();
            }
        }

        public clear() : void {
            this._cachedItemRenderer    = null;
            this._cachedListDataArray   = null;

            if (this.getIsOpening()) {
                this._getDataProvider().removeAll();
            }
        }

        public setSelectedIndex(index: number): void {
            if (this.getIsOpening()) {
                this._list.selectedIndex = index;
            }
        }
        public getSelectedIndex(): number | undefined {
            return this.getIsOpening() ? this._list.selectedIndex : undefined;
        }

        public scrollVerticalTo(percentage: number) : void {
            egret.callLater(() => {
                if (this.getIsOpening()) {
                    const list      = this._list;
                    list.scrollV    = percentage / 100 * Math.max(0, list.contentHeight - list.height);
                }
            }, this);
        }
        public scrollHorizontalTo(percentage : number) : void {
            egret.callLater(() => {
                if (this.getIsOpening()) {
                    const list      = this._list;
                    list.scrollH    = percentage / 100 * Math.max(0, list.contentWidth - list.width);
                }
            }, this);
        }
        public setScrollPolicyV(policy: string): void {
            this.scrollPolicyV = policy;
        }
        public setScrollPolicyH(policy: string): void {
            this.scrollPolicyH = policy;
        }

        private _getDataProvider(): eui.ArrayCollection | null {
            if (this.getIsOpening()) {
                return this._list.dataProvider as eui.ArrayCollection;
            } else {
                return null;
            }
        }
    }
}
