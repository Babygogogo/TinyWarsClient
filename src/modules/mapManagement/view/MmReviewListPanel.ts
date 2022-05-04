
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import FlowManager              from "../../tools/helpers/FlowManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiZoomableMap        from "../../tools/ui/UiZoomableMap";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import WarMapProxy              from "../../warMap/model/WarMapProxy";
// import TwnsMmMainMenuPanel      from "./MmMainMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapManagement {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;
    import IMapEditorData   = CommonProto.Map.IMapEditorData;

    export type OpenDataForMmReviewListPanel = void;
    export class MmReviewListPanel extends TwnsUiPanel.UiPanel<OpenDataForMmReviewListPanel> {
        private readonly _zoomMap!          : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _labelNoData!      : TwnsUiLabel.UiLabel;
        private readonly _labelMenuTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!     : TwnsUiLabel.UiLabel;
        private readonly _listMap!          : TwnsUiScrollList.UiScrollList<DataForMapRenderer>;
        private readonly _btnBack!          : TwnsUiButton.UiButton;

        private _dataForListMap     : DataForMapRenderer[] = [];
        private _selectedIndex      : number | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMmGetReviewingMaps,  callback: this._onMsgMmGetReviewingMaps },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listMap.setItemRenderer(MapRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._labelLoading.visible  = true;
            this._labelNoData.visible   = false;

            Twns.WarMap.WarMapProxy.reqMmGetReviewingMaps();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex      = this.getSelectedIndex();
            const dataList      = this._dataForListMap;
            this._selectedIndex = dataList[newIndex] ? newIndex : null;

            if ((oldIndex != null) && (dataList[oldIndex])) {
                this._listMap.updateSingleData(oldIndex, dataList[oldIndex]);
            }

            if (dataList[newIndex]) {
                this._listMap.updateSingleData(newIndex, dataList[newIndex]);
                await this._showMap(newIndex);
            } else {
                this._zoomMap.clearMap();
            }
        }
        public getSelectedIndex(): number | null {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onMsgMmGetReviewingMaps(): void {
            const newData               = this._createDataForListMap(Twns.WarMap.WarMapModel.getMmReviewingMaps());
            this._dataForListMap        = newData;
            this._labelLoading.visible  = false;

            if (newData.length > 0) {
                this._labelNoData.visible = false;
                this._listMap.bindData(newData);
            } else {
                this._labelNoData.visible = true;
                this._listMap.clear();
            }
            this.setSelectedIndex(0);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmMainMenuPanel, void 0);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelNoData.text      = Lang.getText(LangTextType.B0278);
            this._labelMenuTitle.text   = Lang.getText(LangTextType.B0272);
            this._labelLoading.text     = Lang.getText(LangTextType.A0078);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
        }

        private _createDataForListMap(rawDataList: IMapEditorData[] | null): DataForMapRenderer[] {
            const dataList: DataForMapRenderer[] = [];

            let index = 0;
            for (const data of rawDataList || []) {
                dataList.push({
                    index,
                    panel   : this,
                    mapEditorData : data,
                });
                ++index;
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const mapData = this._dataForListMap[index].mapEditorData.mapRawData;
            if (!mapData) {
                this._zoomMap.clearMap();
            } else {
                this._zoomMap.showMapByMapData(mapData, await Twns.Config.ConfigManager.getLatestGameConfig());
            }
        }
    }

    type DataForMapRenderer = {
        index   : number;
        mapEditorData : IMapEditorData;
        panel   : MmReviewListPanel;
    };
    class MapRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelStatus!  : TwnsUiLabel.UiLabel;
        private readonly _btnNext!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
        }

        protected _onDataChanged(): void {
            const data                  = this._getData();
            const mapEditorData         = data.mapEditorData;
            const mapRawData            = Twns.Helpers.getExisted(mapEditorData.mapRawData);
            const status                = Twns.Helpers.getExisted(mapEditorData.reviewStatus);
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Twns.Types.UiState.Down : Twns.Types.UiState.Up;
            this._labelStatus.text      = Lang.getMapReviewStatusText(status) ?? CommonConstants.ErrorTextForUndefined;
            this._labelStatus.textColor = getReviewStatusTextColor(status);
            this._labelName.text        = Lang.getLanguageText({ textArray: mapRawData.mapNameArray }) || `(${Lang.getText(LangTextType.B0277)})`;
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(): void {
            const data = this._getData().mapEditorData;
            Twns.FlowManager.gotoMapEditorWar(Twns.Helpers.getExisted(data.mapRawData), Twns.Helpers.getExisted(data.slotIndex), true);
        }
    }

    function getReviewStatusTextColor(status: Twns.Types.MapReviewStatus): number {
        switch (status) {
            case Twns.Types.MapReviewStatus.None     : return 0xffffff;
            case Twns.Types.MapReviewStatus.Reviewing: return 0xffff00;
            case Twns.Types.MapReviewStatus.Rejected : return 0xff0000;
            case Twns.Types.MapReviewStatus.Accepted : return 0x00ff00;
            default                             : return 0xffffff;
        }
    }
}

// export default TwnsMmReviewListPanel;
