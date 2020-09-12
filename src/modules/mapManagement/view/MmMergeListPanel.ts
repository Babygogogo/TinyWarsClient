
namespace TinyWars.MapManagement {
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import Helpers      = Utility.Helpers;
    import WarMapModel  = WarMap.WarMapModel;

    export class MmMergeListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmMergeListPanel;

        private _listMap        : GameUi.UiScrollList;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _labelNoMap     : GameUi.UiLabel;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelMapNameEnglish: GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelRating        : GameUi.UiLabel;
        private _labelPlayedTimes   : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;
        private _labelModifyTime    : GameUi.UiLabel;

        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapFileName: string;

        public static show(): void {
            if (!MmMergeListPanel._instance) {
                MmMergeListPanel._instance = new MmMergeListPanel();
            }

            MmMergeListPanel._instance.open();
        }
        public static hide(): void {
            if (MmMergeListPanel._instance) {
                MmMergeListPanel._instance.close();
            }
        }
        public static getInstance(): MmMergeListPanel {
            return MmMergeListPanel._instance;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/mapManagement/MmMergeListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.SMmMergeMap,        callback: this._onNotifySMmMergeMap },
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected async _onOpened(): Promise<void> {
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);

            this._groupInfo.visible     = false;
            this._labelNoMap.visible    = true;
            this._labelNoMap.text       = Lang.getText(Lang.Type.A0078);

            this._dataForList           = await this._createDataForListMap();
            this._labelNoMap.text       = Lang.getText(Lang.Type.B0269);
            this._updateView();
        }
        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
            this._listMap.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedMapFileName(newMapFileName: string): Promise<void> {
            const dataList = this._dataForList;
            if (dataList.length <= 0) {
                this._selectedMapFileName = null;
            } else {
                const index                 = dataList.findIndex(data => data.mapFileName === newMapFileName);
                const newIndex              = index >= 0 ? index : Math.floor(Math.random() * dataList.length);
                const oldIndex              = dataList.findIndex(data => data.mapFileName === this._selectedMapFileName);
                this._selectedMapFileName   = dataList[newIndex].mapFileName;
                (dataList[oldIndex])    && (this._listMap.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listMap.updateSingleData(newIndex, dataList[newIndex]));

                await this._showMap(dataList[newIndex].mapFileName);
            }
        }
        public getSelectedMapFileName(): string {
            return this._selectedMapFileName;
        }

        public getDataForList(): DataForMapNameRenderer[] {
            return this._dataForList;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private async _onNotifySMmMergeMap(e: egret.Event): Promise<void> {
            this._dataForList       = await this._createDataForListMap();
            this._labelNoMap.text   = Lang.getText(Lang.Type.B0269);
            this._updateView();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            MmMergeListPanel.hide();
            MmMainMenuPanel.show();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const length                = this._dataForList.length;
            this._labelNoMap.visible    = length <= 0;
            this._listMap.bindData(this._dataForList);
            this.setSelectedMapFileName(this._selectedMapFileName);
            (length) && (this._listMap.scrollVerticalTo((this._dataForList.findIndex(data => data.mapFileName === this._selectedMapFileName) + 1) / length * 100));
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0227);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const dict = new Map<string, DataForMapNameRenderer[]>();
            for (const [mapFileName, extraData] of WarMapModel.getExtraDataDict()) {
                if (!extraData.isDeleted) {
                    const signature = getSignatureForMap((await WarMapModel.getMapRawData(mapFileName)) as Types.MapRawData);
                    const data      : DataForMapNameRenderer = {
                        mapFileName,
                        signature,
                        panel       : this,
                    };
                    if (dict.has(signature)) {
                        dict.get(signature).push(data);
                    } else {
                        dict.set(signature, [data]);
                    }
                }
            }

            const dataList: DataForMapNameRenderer[] = [];
            for (const [k, v] of dict) {
                if (v.length > 1) {
                    dataList.push(...v);
                }
            }
            return dataList;
        }

        private async _showMap(mapFileName: string): Promise<void> {
            const mapRawData                = await WarMapModel.getMapRawData(mapFileName);
            const mapExtraData              = await WarMapModel.getExtraData(mapFileName);
            const modifiedTime              = mapRawData.modifiedTime;
            this._labelMapName.text         = Lang.getFormattedText(Lang.Type.F0000, mapExtraData.mapName);
            this._labelMapNameEnglish.text  = Lang.getFormattedText(Lang.Type.F0000, mapExtraData.mapNameEnglish);
            this._labelDesigner.text        = Lang.getFormattedText(Lang.Type.F0001, mapRawData.mapDesigner);
            this._labelPlayersCount.text    = Lang.getFormattedText(Lang.Type.F0002, mapRawData.playersCount);
            this._labelModifyTime.text      = Lang.getFormattedText(Lang.Type.F0024, modifiedTime == null ? Lang.getText(Lang.Type.B0001) : Helpers.getTimestampShortText(modifiedTime));
            this._labelRating.text          = Lang.getFormattedText(Lang.Type.F0003, mapExtraData.rating != null ? mapExtraData.rating.toFixed(2) : Lang.getText(Lang.Type.B0001));
            this._labelPlayedTimes.text     = Lang.getFormattedText(Lang.Type.F0004, mapExtraData.mcwPlayedTimes + mapExtraData.rankPlayedTimes);
            this._groupInfo.visible         = true;
            this._groupInfo.alpha           = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
            tileMapView.updateWithTileDataList(mapRawData.tileBases);
            tileMapView.updateWithObjectViewIdArray(mapRawData.tileObjects);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithMapRawData(mapRawData);

            const gridSize = Utility.ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapRawData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapRawData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    function getSignatureForMap(mapRawData: Types.MapRawData): string {
        const strList: string[] = [];
        for (const tileBaseViewId of mapRawData.tileBases) {
            strList.push("" + Utility.ConfigManager.getTileBaseType(tileBaseViewId));
        }
        for (const tileObjectViewId of mapRawData.tileObjects) {
            const cfg = Utility.ConfigManager.getTileObjectTypeAndPlayerIndex(tileObjectViewId);
            strList.push("" + cfg.playerIndex + cfg.tileObjectType);
        }
        for (const tileData of mapRawData.tileDataList || []) {
            const cfg = Utility.ConfigManager.getTileObjectTypeAndPlayerIndex(tileData.objectViewId);
            strList.push(
                `${tileData.gridX}${tileData.gridY}`                                                +
                `${Utility.ConfigManager.getTileBaseType(tileData.baseViewId)}`                             +
                `${cfg.playerIndex}${cfg.tileObjectType}`                                           +
                `${tileData.currentBuildPoint}${tileData.currentCapturePoint}${tileData.currentHp}`
            );
        }
        for (const unitViewId of mapRawData.units || []) {
            strList.push("" + unitViewId);
        }
        for (const unitData of mapRawData.unitDataList || []) {
            strList.push(
                `${unitData.gridX}${unitData.gridY}${unitData.viewId}${unitData.unitId}`                                            +
                `${unitData.currentBuildMaterial}${unitData.currentFuel}${unitData.currentHp}${unitData.currentProduceMaterial}`    +
                `${unitData.currentPromotion}${unitData.flareCurrentAmmo}${unitData.isBuildingTile}${unitData.isCapturingTile}`     +
                `${unitData.isDiving}${unitData.loaderUnitId}${unitData.primaryWeaponCurrentAmmo}${unitData.state}`
            );
        }

        return strList.join("");
    }

    type DataForMapNameRenderer = {
        mapFileName : string;
        signature   : string;
        panel       : MmMergeListPanel;
    }

    class MapNameRenderer extends eui.ItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _btnNext  : GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForMapNameRenderer;
            this.currentState   = data.mapFileName === data.panel.getSelectedMapFileName() ? Types.UiState.Down : Types.UiState.Up;
            WarMapModel.getMapNameInCurrentLanguage(data.mapFileName).then(v => this._labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedMapFileName(data.mapFileName);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            if (data) {
                const dataList  = data.panel.getDataForList();
                const srcData   = dataList ? dataList.find(d => (d.signature === data.signature) && (d.mapFileName !== data.mapFileName)) : null;
                if (!srcData) {
                    FloatText.show(Lang.getText(Lang.Type.B0269));
                } else {
                    Common.CommonConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0079),
                        callback: () => {
                            WarMap.WarMapProxy.reqMergeMap(srcData.mapFileName, data.mapFileName);
                        },
                    });
                }
            }
        }
    }
}
