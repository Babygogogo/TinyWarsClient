
namespace TinyWars.ReplayWar {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import FlowManager      = Utility.FlowManager;
    import WarMapModel      = WarMap.WarMapModel;

    export class RwReplayListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RwReplayListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : GameUi.UiTab<DataForTabItemRenderer, OpenDataForRwReplayMapInfoPage | OpenDataForRwReplayPlayerInfoPage | OpenDataForRwReplayWarInfoPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelReplay           : GameUi.UiLabel;
        private readonly _labelChooseReplay     : GameUi.UiLabel;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnNextStep           : GameUi.UiButton;
        private readonly _btnSearch             : GameUi.UiButton;

        private readonly _groupReplayList       : eui.Group;
        private readonly _listReplay            : GameUi.UiScrollList<DataForReplayRenderer>;
        private readonly _labelNoReplay         : GameUi.UiLabel;
        private readonly _labelLoading          : GameUi.UiLabel;

        private _hasReceivedData    = false;

        public static show(): void {
            if (!RwReplayListPanel._instance) {
                RwReplayListPanel._instance = new RwReplayListPanel();
            }
            RwReplayListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (RwReplayListPanel._instance) {
                await RwReplayListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/replayWar/RwReplayListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.RwPreviewingReplayIdChanged,    callback: this._onNotifyRwPreviewingReplayIdChanged },
                { type: Notify.Type.MsgReplayGetInfoList,           callback: this._onNotifyMsgReplayGetInfoList },
                { type: Notify.Type.MsgReplayGetData,               callback: this._onNotifyMsgReplayGetData },
                { type: Notify.Type.MsgReplayGetDataFailed,         callback: this._onNotifyMsgReplayGetDataFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listReplay.setItemRenderer(ReplayRenderer);

            this._showOpenAnimation();

            this._hasReceivedData = false;
            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupReplayList();
            this._updateComponentsForPreviewingReplayInfo();

            RwProxy.reqReplayInfos(null);
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyRwPreviewingReplayIdChanged(e: egret.Event): void {
            this._updateComponentsForPreviewingReplayInfo();
        }

        private _onNotifyMsgReplayGetInfoList(e: egret.Event): void {
            this._hasReceivedData = true;
            this._updateGroupReplayList();
            this._updateComponentsForPreviewingReplayInfo();
        }

        private _onNotifyMsgReplayGetData(e: egret.Event): void {
            const data = RwModel.getReplayData();
            FlowManager.gotoReplayWar(data.encodedWar, data.replayId);
        }

        private _onNotifyMsgReplayGetDataFailed(e: egret.Event): void {
            Common.CommonBlockPanel.hide();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MultiCustomRoom.McrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }
        private _onTouchedBtnSearch(e: egret.TouchEvent): void {
            RwSearchReplayPanel.show();
        }
        private _onTouchedBtnNextStep(e: egret.TouchEvent): void {
            const replayId = RwModel.getPreviewingReplayId();
            if (replayId != null) {
                Common.CommonBlockPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0040),
                });
                RwProxy.reqReplayGetData(replayId);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _initTabSettings(): void {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0298) },
                    pageClass   : RwReplayMapInfoPage,
                    pageData    : { replayId: null } as OpenDataForRwReplayMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                    pageClass   : RwReplayPlayerInfoPage,
                    pageData    : { replayId: null } as OpenDataForRwReplayPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : RwReplayWarInfoPage,
                    pageData    : { replayId: null } as OpenDataForRwReplayWarInfoPage,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(Lang.Type.A0040);
            this._labelReplay.text          = Lang.getText(Lang.Type.B0092);
            this._labelChooseReplay.text    = Lang.getText(Lang.Type.B0598);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoReplay.text        = Lang.getText(Lang.Type.B0241);
            this._btnNextStep.label         = Lang.getText(Lang.Type.B0024);
            this._btnSearch.label           = Lang.getText(Lang.Type.B0228);
        }

        private _updateGroupReplayList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoReplay = this._labelNoReplay;
            const listReplay    = this._listReplay;
            if (!this._hasReceivedData) {
                labelLoading.visible    = true;
                labelNoReplay.visible   = false;
                listReplay.clear();

            } else {
                const dataArray         = this._createDataForListReplay();
                labelLoading.visible    = false;
                labelNoReplay.visible   = !dataArray.length;
                listReplay.bindData(dataArray);

                const replayId = RwModel.getPreviewingReplayId();
                if (dataArray.every(v => v.replayId != replayId)) {
                    RwModel.setPreviewingReplayId(dataArray.length ? dataArray[0].replayId : null);
                }
            }
        }

        private _updateComponentsForPreviewingReplayInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const replayId      = RwModel.getPreviewingReplayId();
            if ((!this._hasReceivedData) || (replayId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                const tab = this._tabSettings;
                tab.updatePageData(0, { replayId } as OpenDataForRwReplayMapInfoPage);
                tab.updatePageData(1, { replayId } as OpenDataForRwReplayPlayerInfoPage);
                tab.updatePageData(2, { replayId } as OpenDataForRwReplayWarInfoPage);
            }
        }

        private _createDataForListReplay(): DataForReplayRenderer[] {
            const dataArray: DataForReplayRenderer[] = [];
            for (const replayInfo of RwModel.getReplayInfoList() || []) {
                dataArray.push({
                    replayId: replayInfo.replayBriefInfo.replayId,
                });
            }

            return dataArray.sort((v1, v2) => v2.replayId - v1.replayId);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnSearch,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Helpers.resetTween({
                obj         : this._groupReplayList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._groupNavigator,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnSearch,
                    beginProps  : { alpha: 1, y: 80 },
                    endProps    : { alpha: 0, y: 40 },
                });
                Helpers.resetTween({
                    obj         : this._groupReplayList,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnNextStep,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupTab,
                    beginProps  : { alpha: 1, },
                    endProps    : { alpha: 0, },
                });
            });
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    }
    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            this._labelName.text = this.data.name;
        }
    }

    type DataForReplayRenderer = {
        replayId: number;
    }
    class ReplayRenderer extends GameUi.UiListItemRenderer<DataForReplayRenderer> {
        private readonly _btnChoose     : GameUi.UiButton;
        private readonly _btnNext       : GameUi.UiButton;
        private readonly _labelType     : GameUi.UiLabel;
        private readonly _labelId       : GameUi.UiLabel;
        private readonly _labelName     : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.RwPreviewingReplayIdChanged,  callback: this._onNotifyRwPreviewingReplayIdChanged },
            ]);
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            this._updateState();

            const replayInfo        = RwModel.getReplayInfo(this.data.replayId);
            const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
            const labelId           = this._labelId;
            const labelType         = this._labelType;
            const labelName         = this._labelName;
            if (replayBriefInfo == null) {
                labelId.text    = null;
                labelType.text  = null;
                labelName.text  = null;
            } else {
                labelId.text    = `ID: ${replayBriefInfo.replayId}`;
                labelType.text  = Lang.getWarTypeName(replayBriefInfo.warType);
                labelName.text  = await WarMapModel.getMapNameInCurrentLanguage(replayBriefInfo.mapId);
            }
        }

        private _onNotifyRwPreviewingReplayIdChanged(e: egret.Event): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            RwModel.setPreviewingReplayId(this.data.replayId);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            Common.CommonBlockPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0040),
            });
            RwProxy.reqReplayGetData(this.data.replayId);
        }

        private _updateState(): void {
            this.currentState = this.data.replayId === RwModel.getPreviewingReplayId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}
