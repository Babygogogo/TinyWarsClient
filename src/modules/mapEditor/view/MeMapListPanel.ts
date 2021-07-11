
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { CommonAlertPanel }             from "../../common/view/CommonAlertPanel";
import { LobbyBottomPanel }             from "../../lobby/view/LobbyBottomPanel";
import { LobbyPanel }                   from "../../lobby/view/LobbyPanel";
import { LobbyTopPanel }                from "../../lobby/view/LobbyTopPanel";
import * as FlowManager                 from "../../../utility/FlowManager";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as MeModel                     from "../model/MeModel";
import * as MeProxy                     from "../model/MeProxy";
import IMapEditorData                   = ProtoTypes.Map.IMapEditorData;

export class MeMapListPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MeMapListPanel;

    private _zoomMap        : UiZoomableMap;
    private _labelNoData    : UiLabel;
    private _labelMenuTitle : UiLabel;
    private _labelLoading   : UiLabel;
    private _listMap        : UiScrollList<DataForMapRenderer>;
    private _btnBack        : UiButton;

    private _dataForListMap     : DataForMapRenderer[] = [];
    private _selectedWarIndex   : number;

    public static show(): void {
        if (!MeMapListPanel._instance) {
            MeMapListPanel._instance = new MeMapListPanel();
        }
        MeMapListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MeMapListPanel._instance) {
            await MeMapListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/mapEditor/MeMapListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgMeGetDataList,     callback: this._onNotifySMeGetDataList },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
        ]);
        this._listMap.setItemRenderer(MapRenderer);

        this._updateComponentsForLanguage();
        this._labelLoading.visible = true;

        MeProxy.reqMeGetMapDataList();
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
    private _onNotifySMeGetDataList(e: egret.Event): void {
        const newData               = this._createDataForListMap(MeModel.getDataDict());
        this._dataForListMap        = newData;
        this._labelLoading.visible  = false;

        if (newData.length > 0) {
            this._listMap.bindData(newData);
        } else {
            this._listMap.clear();
        }
        this.setSelectedIndex(0);
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
        LobbyPanel.show();
        LobbyTopPanel.show();
        LobbyBottomPanel.show();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelNoData.text      = Lang.getText(Lang.Type.B0278);
        this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0272);
        this._labelLoading.text     = Lang.getText(Lang.Type.A0078);
        this._btnBack.label         = Lang.getText(Lang.Type.B0146);
    }

    private _createDataForListMap(dict: Map<number, IMapEditorData>): DataForMapRenderer[] {
        const dataList: DataForMapRenderer[] = [];

        let index = 0;
        for (const [slotIndex, info] of dict) {
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
            this._zoomMap.showMapByMapData(mapData);
        }
    }
}

type DataForMapRenderer = {
    index   : number;
    mapData : IMapEditorData;
    panel   : MeMapListPanel;
};
class MapRenderer extends UiListItemRenderer<DataForMapRenderer> {
    private _btnChoose      : UiButton;
    private _labelName      : UiLabel;
    private _labelStatus    : UiLabel;
    private _btnNext        : UiButton;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
    }

    protected _onDataChanged(): void {
        const data                  = this.data;
        const mapData               = data.mapData;
        const mapRawData            = mapData.mapRawData;
        const status                = mapData.reviewStatus;
        this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
        this._labelStatus.text      = Lang.getMapReviewStatusText(status);
        this._labelStatus.textColor = getReviewStatusTextColor(status);
        this._labelName.text        = Lang.getLanguageText({ textArray: mapRawData ? mapRawData.mapNameArray : [] }) || `(${Lang.getText(Lang.Type.B0277)})`;
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        const data = this.data;
        data.panel.setSelectedIndex(data.index);
    }

    private _onTouchTapBtnNext(e: egret.TouchEvent): void {
        const data          = this.data;
        const mapData       = data.mapData;
        const reviewStatus  = mapData.reviewStatus;

        if (reviewStatus === Types.MapReviewStatus.Rejected) {
            CommonAlertPanel.show({
                title   : Lang.getText(Lang.Type.B0305),
                content : mapData.reviewComment || Lang.getText(Lang.Type.B0001),
                callback: () => {
                    FlowManager.gotoMapEditorWar(mapData.mapRawData, mapData.slotIndex, false);
                },
            });
        } else if (reviewStatus === Types.MapReviewStatus.Accepted) {
            CommonAlertPanel.show({
                title   : Lang.getText(Lang.Type.B0326),
                content : mapData.reviewComment || Lang.getText(Lang.Type.B0001),
                callback: () => {
                    FlowManager.gotoMapEditorWar(mapData.mapRawData, mapData.slotIndex, false);
                },
            });
        } else {
            FlowManager.gotoMapEditorWar(mapData.mapRawData, mapData.slotIndex, false);
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
