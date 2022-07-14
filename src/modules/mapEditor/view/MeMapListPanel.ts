
// import TwnsCommonAlertPanel     from "../../common/view/CommonAlertPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import FlowManager              from "../../tools/helpers/FlowManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiZoomableMap        from "../../tools/ui/UiZoomableMap";
// import MeModel                  from "../model/MeModel";
// import MeProxy                  from "../model/MeProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import NotifyType       = Notify.NotifyType;
    import IMapEditorData   = CommonProto.Map.IMapEditorData;
    import LangTextType     = Lang.LangTextType;

    export type OpenDataForMeMapListPanel = void;
    export class MeMapListPanel extends TwnsUiPanel.UiPanel<OpenDataForMeMapListPanel> {
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
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMeGetDataList,    callback: this._onNotifySMeGetDataList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listMap.setItemRenderer(MapRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._labelLoading.visible = true;

            MapEditor.MeProxy.reqMeGetMapDataList();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public async setAndReviseSelectedIndex(newIndex: number | null): Promise<void> {
            const oldIndex      = this._selectedIndex;
            const dataArray     = this._dataForListMap;
            this._selectedIndex = ((newIndex != null) && (dataArray[newIndex])) ? newIndex : null;

            if ((oldIndex != null) && (dataArray[oldIndex])) {
                this._listMap.updateSingleData(oldIndex, dataArray[oldIndex]);
            }

            if ((newIndex != null) && (dataArray[newIndex])) {
                this._listMap.updateSingleData(newIndex, dataArray[newIndex]);
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
        private _onNotifySMeGetDataList(): void {
            const newData               = this._createDataForListMap(MapEditor.MeModel.getDataDict());
            this._dataForListMap        = newData;
            this._labelLoading.visible  = false;

            if (newData.length > 0) {
                this._listMap.bindData(newData);
            } else {
                this._listMap.clear();
            }
            this.setAndReviseSelectedIndex(0);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(): void {
            FlowManager.gotoLobby();
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

        private _createDataForListMap(dict: Map<number, IMapEditorData>): DataForMapRenderer[] {
            const dataList: DataForMapRenderer[] = [];

            let index = 0;
            for (const [, info] of dict) {
                dataList.push({
                    index,
                    panel   : this,
                    mapData : info,
                });
                ++index;
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const mapData = this._dataForListMap[index].mapData.mapRawData;
            if (!mapData) {
                this._labelNoData.visible = true;
                this._zoomMap.clearMap();

            } else {
                this._labelNoData.visible = false;
                this._zoomMap.showMapByMapData(mapData, await Config.ConfigManager.getLatestGameConfig());
            }
        }
    }

    type DataForMapRenderer = {
        index   : number;
        mapData : IMapEditorData;
        panel   : MeMapListPanel;
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
            this._btnChoose.setShortSfxCode(Types.ShortSfxCode.None);
            this._btnNext.setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            const data                  = this._getData();
            const mapData               = data.mapData;
            const mapRawData            = mapData.mapRawData;
            const status                = Helpers.getExisted(mapData.reviewStatus);
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelStatus.text      = Lang.getMapReviewStatusText(status) ?? CommonConstants.ErrorTextForUndefined;
            this._labelStatus.textColor = getReviewStatusTextColor(status);
            this._labelName.text        = Lang.getLanguageText({ textArray: mapRawData ? mapRawData.mapNameArray : [] }) || `(${Lang.getText(LangTextType.B0277)})`;
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(): void {
            const data          = this._getData();
            const mapData       = data.mapData;
            const reviewStatus  = mapData.reviewStatus;

            if (reviewStatus === Types.MapReviewStatus.Rejected) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0305),
                    content : mapData.reviewComment || Lang.getText(LangTextType.B0001),
                    callback: () => {
                        FlowManager.gotoMapEditorWar(Helpers.getExisted(mapData.mapRawData), Helpers.getExisted(mapData.slotIndex), false);
                    },
                });
            } else if (reviewStatus === Types.MapReviewStatus.Accepted) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonAlertPanel, {
                    title   : Lang.getText(LangTextType.B0326),
                    content : mapData.reviewComment || Lang.getText(LangTextType.B0001),
                    callback: () => {
                        FlowManager.gotoMapEditorWar(Helpers.getExisted(mapData.mapRawData), Helpers.getExisted(mapData.slotIndex), false);
                    },
                });
            } else {
                FlowManager.gotoMapEditorWar(mapData.mapRawData, Helpers.getExisted(mapData.slotIndex), false);
            }
        }
    }

    function getReviewStatusTextColor(status: Types.MapReviewStatus): number {
        switch (status) {
            case Types.MapReviewStatus.None     : return 0xffffff;
            case Types.MapReviewStatus.Reviewing: return 0xffff00;
            case Types.MapReviewStatus.Rejected : return 0xff0000;
            case Types.MapReviewStatus.Accepted : return 0x00ff00;
            default                             : return 0xffffff;
        }
    }
}

// export default TwnsMeMapListPanel;
