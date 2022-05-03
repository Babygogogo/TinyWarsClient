
// import Helpers                  from "../helpers/Helpers";
// import SoundManager             from "../helpers/SoundManager";
// import StageManager             from "../helpers/StageManager";
// import Types                    from "../helpers/Types";
// import Notify                   from "../notify/Notify";
// import Twns.Notify           from "../notify/NotifyType";
// import TwnsUiListItemRenderer   from "./UiListItemRenderer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUiScrollList {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import NotifyType           = Twns.Notify.NotifyType;
    import UiListener           = Types.UiListener;
    import ShortSfxCode         = Types.ShortSfxCode;

    export class UiScrollList<DataForRenderer> extends eui.Scroller {
        private _isChildrenCreated          = false;
        private _isOpening                  = false;

        private _notifyListenerArray        : Twns.Notify.Listener[] | null = null;
        private _uiListenerArray            : UiListener[] | null = null;
        private _shortSfxCodeForTouchList   = ShortSfxCode.None;

        private _list?                      : eui.List;

        private _cachedItemRenderer         : (new () => TwnsUiListItemRenderer.UiListItemRenderer<DataForRenderer>) | null = null;
        private _cachedListDataArray        : DataForRenderer[] | null = null;
        private _cachedSelectedIndex        : number | null = null;
        private _cachedSelectedIndexArray   : number[] | null = null;
        private _cachedScrollVerPercentage  : number | null = null;
        private _cachedScrollHorPercentage  : number | null = null;

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

        private _onAddedToStage(): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            this._doOpen();
        }

        private _onRemovedFromStage(): void {
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
                this._setUiListenerArray(null);
                this._setNotifyListenerArray(null);
                this._onClosed();
            }
        }

        private _onOpened(): void {
            if (this.numChildren !== 1) {
                throw Helpers.newError(`UiScrollList._onAllSkinPartsAdded() this.numChildren !== 1`, ClientErrorCode.UiScrollList_OnOpened_00);
            }

            const list = this.getChildAt(0);
            if ((list == null) || (!(list instanceof eui.List))) {
                throw Helpers.newError(`UiScrollList._onAllSkinPartsAdded() invalid list!`, ClientErrorCode.UiScrollList_OnOpened_01);
            }

            this._setNotifyListenerArray([
                { type: NotifyType.MouseWheel, callback: this._onNotifyMouseWheel },
            ]);
            this._setUiListenerArray([
                { ui: list,     callback: this._onResizeList,       eventType: egret.Event.RESIZE },
                { ui: list,     callback: this._onItemTapList,      eventType: eui.ItemTapEvent.ITEM_TAP },
                { ui: list,     callback: this._onTouchBeginList,   eventType: egret.TouchEvent.TOUCH_BEGIN },
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

            if (this._cachedSelectedIndex != null) {
                this.setSelectedIndex(this._cachedSelectedIndex);
                this._cachedSelectedIndex = null;
            }

            if (this._cachedSelectedIndexArray != null) {
                this.setSelectedIndexArray(this._cachedSelectedIndexArray);
                this._cachedSelectedIndexArray = null;
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

        private _getList(): eui.List {
            return Helpers.getExisted(this._list);
        }

        private _setNotifyListenerArray(array: Twns.Notify.Listener[] | null): void {
            this._notifyListenerArray = array;
        }
        private _getNotifyListenerArray(): Twns.Notify.Listener[] | null {
            return this._notifyListenerArray;
        }
        private _setUiListenerArray(array: UiListener[] | null): void {
            this._uiListenerArray = array;
        }
        private _getUiListenerArray(): UiListener[] | null {
            return this._uiListenerArray;
        }

        private _registerListeners(): void {
            const notifyListenerArray = this._getNotifyListenerArray();
            if (notifyListenerArray) {
                Twns.Notify.addEventListeners(notifyListenerArray, this);
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
                Twns.Notify.removeEventListeners(notifyListenerArray, this);
            }

            const uiListenerArray = this._getUiListenerArray();
            if (uiListenerArray) {
                for (const l of uiListenerArray) {
                    l.ui.removeEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }

        private _onResizeList(): void {
            if (this._cachedScrollHorPercentage != null) {
                this.scrollHorizontalTo(this._cachedScrollHorPercentage);
            }
            if (this._cachedScrollVerPercentage != null) {
                this.scrollVerticalTo(this._cachedScrollVerPercentage);
            }
        }
        private _onItemTapList(e: egret.Event): void {
            if (!this.getIsOpening()) {
                return;
            }

            const data = e as eui.ItemTapEvent;
            const item = this._getList().getElementAt(data.itemIndex);
            if (item instanceof TwnsUiListItemRenderer.UiListItemRenderer) {
                SoundManager.playShortSfx(item.getShortSfxCode());
                item.onItemTapEvent(data);
            }

            this._cachedScrollHorPercentage = null;
            this._cachedScrollVerPercentage = null;
        }
        private _onTouchBeginList(): void {
            SoundManager.playShortSfx(this.getShortSfxCodeForTouchList());
        }
        private _onNotifyMouseWheel(e: egret.Event): void {
            if (!this.getIsOpening()) {
                return;
            }

            const { x, y } = this.globalToLocal(StageManager.getMouseX(), StageManager.getMouseY(), this._mousePoint);
            if ((x >= 0) && (x <= this.width) && (y >= 0) && (y <= this.height)) {
                this.stopAnimation();

                const value     = - e.data / 2;
                const list      = this._getList();
                list.scrollV    = Math.max(0, Math.min(list.scrollV + value, list.contentHeight - list.height));
                list.scrollH    = Math.max(0, Math.min(list.scrollH + value, list.contentWidth - list.width));
            }
        }

        public setItemRenderer(itemRenderer: new () => TwnsUiListItemRenderer.UiListItemRenderer<DataForRenderer>): void {
            if (this.getIsOpening()) {
                this._getList().itemRenderer = itemRenderer;
            } else {
                this._cachedItemRenderer = itemRenderer;
            }
        }

        public bindData(dataArray: DataForRenderer[]): void {
            if (!this.getIsOpening()) {
                this._cachedListDataArray = dataArray;
                return;
            }

            const dataProvider = this._getDataProvider();
            if (dataProvider == null) {
                throw Helpers.newError(`UiScrollList.bindData() empty dataProvider.`, ClientErrorCode.UiScrollList_BindData_00);
            }

            dataProvider.replaceAll(dataArray);

            // 修正从多子项切换到少子项时，且曾经拖动到比较远的的情况下，切换后可能没有显示子项的问题
            this.validateNow();
            const list      = this._getList();
            list.scrollV    = Math.max(0, Math.min(list.scrollV, list.contentHeight - list.height));
            list.scrollH    = Math.max(0, Math.min(list.scrollH, list.contentWidth - list.width));
        }
        public updateSingleData(index: number, data: DataForRenderer): void {
            if (this.getIsOpening()) {
                const dataProvider = this._getDataProvider();
                if (dataProvider == null) {
                    throw Helpers.newError(`UiScrollList.updateSingleData() empty dataProvider.`, ClientErrorCode.UiScrollList_UpdateSingleData_00);
                }

                if ((index < 0) || (index >= dataProvider.length)) {
                    throw Helpers.newError(`UiScrollList.updateSingleData() invalid index.`, ClientErrorCode.UiScrollList_UpdateSingleData_01);
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
                const dataProvider = this._getDataProvider();
                if (dataProvider == null) {
                    throw Helpers.newError(`UiScrollList.refresh() empty dataProvider.`, ClientErrorCode.UiScrollList_Refresh_00);
                }

                dataProvider.refresh();
            }
        }
        public getBoundDataArrayLength(): number | null {
            return this._getDataProvider()?.length ?? null;
        }
        public getBoundDataArray(): DataForRenderer[] | null {
            return this._getDataProvider()?.source ?? null;
        }

        public clear() : void {
            this._cachedItemRenderer        = null;
            this._cachedListDataArray       = null;
            this._cachedSelectedIndex       = null;
            this._cachedSelectedIndexArray  = null;
            this._cachedScrollHorPercentage = null;
            this._cachedScrollVerPercentage = null;

            this._getDataProvider()?.removeAll();
        }

        public setSelectedIndex(index: number): void {
            if (this.getIsOpening()) {
                this._getList().selectedIndex = index;
            } else {
                this._cachedSelectedIndex = index;
            }
        }
        public getSelectedIndex(): number | null {
            return this.getIsOpening() ? this._getList().selectedIndex : null;
        }
        public setSelectedIndexArray(indexArray: number[]): void {
            if (this.getIsOpening()) {
                this._getList().selectedIndices = indexArray;
            } else {
                this._cachedSelectedIndexArray = indexArray;
            }
        }
        public getSelectedData(): DataForRenderer | null {
            return this.getIsOpening() ? this._getList().selectedItem : null;
        }
        public getSelectedDataArray(): DataForRenderer[] | null {
            return this.getIsOpening() ? this._getList().selectedItems : null;
        }

        public findIndex(predicate: (v: DataForRenderer) => boolean): number | null {
            return this.getIsOpening()
                ? Helpers.getExisted(this._getDataProvider()).source.findIndex(predicate)
                : null;
        }
        public getFirstIndex(predicate: (v: DataForRenderer) => boolean): number | null {
            if (!this.getIsOpening()) {
                return null;
            } else {
                const firstIndex = Helpers.getExisted(this.findIndex(predicate));
                if (firstIndex >= 0) {
                    return firstIndex;
                } else {
                    const dataLength = Helpers.getExisted(this._getDataProvider()?.length);
                    return (dataLength <= 0)
                        ? -1
                        : 0;
                }
            }
        }
        public getRandomIndex(predicate: (v: DataForRenderer) => boolean): number | null {
            if (!this.getIsOpening()) {
                return null;
            } else {
                const firstIndex = Helpers.getExisted(this.findIndex(predicate));
                if (firstIndex >= 0) {
                    return firstIndex;
                } else {
                    const dataLength = Helpers.getExisted(this._getDataProvider()?.length);
                    return (dataLength <= 0)
                        ? -1
                        : Math.floor(Math.random() * dataLength);
                }
            }
        }

        public scrollVerticalTo(percentage: number) : void {
            this._cachedScrollVerPercentage = percentage;
            if (this.getIsOpening()) {
                const list      = this._getList();
                list.scrollV    = percentage / 100 * Math.max(0, list.contentHeight - list.height);
            }
        }
        public scrollVerticalToIndex(index: number): void {
            if (this.getIsOpening()) {
                const length = Helpers.getExisted(this._getDataProvider()?.length);
                this.scrollVerticalTo(Math.max(0, index) / Math.max(1, length - 1) * 100);
            }
        }

        public scrollHorizontalTo(percentage : number) : void {
            this._cachedScrollHorPercentage = percentage;
            if (this.getIsOpening()) {
                const list      = this._getList();
                list.scrollH    = percentage / 100 * Math.max(0, list.contentWidth - list.width);
            }
        }

        public setScrollPolicyV(policy: string): void {
            this.scrollPolicyV = policy;
        }
        public setScrollPolicyH(policy: string): void {
            this.scrollPolicyH = policy;
        }

        public setShortSfxCodeForTouchList(code: ShortSfxCode): void {
            this._shortSfxCodeForTouchList = code;
        }
        public getShortSfxCodeForTouchList(): ShortSfxCode {
            return this._shortSfxCodeForTouchList;
        }

        private _getDataProvider(): eui.ArrayCollection | null {
            if (this.getIsOpening()) {
                return this._getList().dataProvider as eui.ArrayCollection;
            } else {
                return null;
            }
        }
    }
}

// export default TwnsUiScrollList;
