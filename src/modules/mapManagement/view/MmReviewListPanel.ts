
import { TwnsUiListItemRenderer }   from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }              from "../../../utility/ui/UiPanel";
import { TwnsUiButton }              from "../../../utility/ui/UiButton";
import { TwnsUiLabel }              from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }         from "../../../utility/ui/UiScrollList";
import { UiZoomableMap }        from "../../../utility/ui/UiZoomableMap";
import { MmMainMenuPanel }      from "./MmMainMenuPanel";
import { FlowManager }          from "../../../utility/FlowManager";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { Types }                from "../../../utility/Types";
import { WarMapModel }          from "../../warMap/model/WarMapModel";
import { WarMapProxy }          from "../../warMap/model/WarMapProxy";
import IMapEditorData           = ProtoTypes.Map.IMapEditorData;

export class MmReviewListPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MmReviewListPanel;

    private _zoomMap        : UiZoomableMap;
    private _labelNoData    : TwnsUiLabel.UiLabel;
    private _labelMenuTitle : TwnsUiLabel.UiLabel;
    private _labelLoading   : TwnsUiLabel.UiLabel;
    private _listMap        : TwnsUiScrollList.UiScrollList<DataForMapRenderer>;
    private _btnBack        : TwnsUiButton.UiButton;

    private _dataForListMap     : DataForMapRenderer[] = [];
    private _selectedWarIndex   : number;

    public static show(): void {
        if (!MmReviewListPanel._instance) {
            MmReviewListPanel._instance = new MmReviewListPanel();
        }
        MmReviewListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MmReviewListPanel._instance) {
            await MmReviewListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/mapManagement/MmReviewListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMmGetReviewingMaps,  callback: this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
        ]);
        this._listMap.setItemRenderer(MapRenderer);

        this._updateComponentsForLanguage();
        this._labelLoading.visible  = true;
        this._labelNoData.visible   = false;

        WarMapProxy.reqMmGetReviewingMaps();
    }

    public async setSelectedIndex(newIndex: number): Promise<void> {
        const oldIndex         = this._selectedWarIndex;
        const dataList         = this._dataForListMap;
        this._selectedWarIndex = dataList[newIndex] ? newIndex : undefined;

        if (dataList[oldIndex]) {
            this._listMap.updateSingleData(oldIndex, dataList[oldIndex]);
        }

        if (dataList[newIndex]) {
            this._listMap.updateSingleData(newIndex, dataList[newIndex]);
            await this._showMap(newIndex);
        } else {
            this._zoomMap.clearMap();
        }
    }
    public getSelectedIndex(): number {
        return this._selectedWarIndex;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onMsgMmGetReviewingMaps(e: egret.Event): void {
        const newData               = this._createDataForListMap(WarMapModel.getMmReviewingMaps());
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

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
        MmMainMenuPanel.show();
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
            this._zoomMap.showMapByMapData(mapData);
        }
    }
}

type DataForMapRenderer = {
    index   : number;
    mapEditorData : IMapEditorData;
    panel   : MmReviewListPanel;
};
class MapRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
    private _btnChoose      : TwnsUiButton.UiButton;
    private _labelName      : TwnsUiLabel.UiLabel;
    private _labelStatus    : TwnsUiLabel.UiLabel;
    private _btnNext        : TwnsUiButton.UiButton;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
    }

    protected _onDataChanged(): void {
        const data                  = this.data;
        const mapEditorData         = data.mapEditorData;
        const mapRawData            = mapEditorData.mapRawData;
        const status                = mapEditorData.reviewStatus;
        this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
        this._labelStatus.text      = Lang.getMapReviewStatusText(status);
        this._labelStatus.textColor = getReviewStatusTextColor(status);
        this._labelName.text        = Lang.getLanguageText({ textArray: mapRawData.mapNameArray }) || `(${Lang.getText(LangTextType.B0277)})`;
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        const data = this.data;
        data.panel.setSelectedIndex(data.index);
    }

    private _onTouchTapBtnNext(e: egret.TouchEvent): void {
        const data = this.data.mapEditorData;
        FlowManager.gotoMapEditorWar(data.mapRawData, data.slotIndex, true);
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
