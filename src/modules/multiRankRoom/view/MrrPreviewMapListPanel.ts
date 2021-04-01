
namespace TinyWars.MultiRankRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import WarMapModel  = WarMap.WarMapModel;

    type OpenDataForMrrPreviewMapListPanel = {
        hasFog  : boolean;
    }
    export class MrrPreviewMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrPreviewMapListPanel;

        private _listMap        : GameUi.UiScrollList<DataForMapNameRenderer>;
        private _zoomMap        : GameUi.UiZoomableMap;
        private _btnBack        : GameUi.UiButton;
        private _labelNoMap     : GameUi.UiLabel;
        private _labelLoading   : GameUi.UiLabel;

        private _groupInfo          : eui.Group;
        private _labelMenuTitle     : GameUi.UiLabel;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelRating        : GameUi.UiLabel;
        private _labelPlayedTimes   : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number;

        public static show(openData: OpenDataForMrrPreviewMapListPanel): void {
            if (!MrrPreviewMapListPanel._instance) {
                MrrPreviewMapListPanel._instance = new MrrPreviewMapListPanel();
            }

            MrrPreviewMapListPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (MrrPreviewMapListPanel._instance) {
                await MrrPreviewMapListPanel._instance.close();
            }
        }
        public static getInstance(): MrrPreviewMapListPanel {
            return MrrPreviewMapListPanel._instance;
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrPreviewMapListPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listMap.setItemRenderer(MapNameRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            this._zoomMap.clearMap();
            this._listMap.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedMapId(newMapId: number): Promise<void> {
            const dataList = this._dataForList;
            if (dataList.length <= 0) {
                this._selectedMapId = null;
            } else {
                const index                 = dataList.findIndex(data => data.mapId === newMapId);
                const newIndex              = index >= 0 ? index : Math.floor(Math.random() * dataList.length);
                const oldIndex              = dataList.findIndex(data => data.mapId === this._selectedMapId);
                this._selectedMapId   = dataList[newIndex].mapId;
                (dataList[oldIndex])    && (this._listMap.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listMap.updateSingleData(newIndex, dataList[newIndex]));

                await this._showMap(dataList[newIndex].mapId);
            }
        }
        public getSelectedMapId(): number {
            return this._selectedMapId;
        }

        public async _updateView(): Promise<void> {
            this._dataForList           = await this._createDataForListMap();
            const length                = this._dataForList.length;
            this._labelNoMap.visible    = length <= 0;
            this._listMap.bindData(this._dataForList);
            this.setSelectedMapId(this._selectedMapId);

            if (length) {
                for (let index = 0; index < length; ++index) {
                    if (this._dataForList[index].mapId === this._selectedMapId) {
                        this._listMap.scrollVerticalTo((index + 1) / length * 100);
                        break;
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MrrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0227);
            this._labelLoading.text     = Lang.getText(Lang.Type.A0150);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const data      : DataForMapNameRenderer[] = [];
            const hasFog    = this._getOpenData<OpenDataForMrrPreviewMapListPanel>().hasFog;
            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapExtraData      = mapBriefData.mapExtraData;
                const mapAvailability   = mapExtraData.mapComplexInfo.availability;
                if ((!mapExtraData.isEnabled)                                       ||
                    ((hasFog) && (!mapAvailability.canMrwFog))                      ||
                    ((!hasFog) && (!mapAvailability.canMrwStd))                     ||
                    (!(await WarMapModel.getRawData(mapId)).warRuleArray.some(v => {
                        return (v.ruleAvailability.canMrw)
                            && (hasFog === v.ruleForGlobalParams.hasFogByDefault);
                    }))
                ) {
                    continue;
                } else {
                    data.push({
                        mapId,
                        mapName : Lang.getLanguageText({ textArray: mapBriefData.mapNameArray }),
                        panel   : this,
                    });
                }
            }

            return data.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _showMap(mapId: number): Promise<void> {
            const mapRawData                = await WarMapModel.getRawData(mapId);
            const rating                    = await WarMapModel.getAverageRating(mapId);
            this._labelMapName.text         = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text        = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelPlayersCount.text    = Lang.getFormattedText(Lang.Type.F0002, mapRawData.playersCountUnneutral);
            this._labelRating.text          = Lang.getFormattedText(Lang.Type.F0003, rating != null ? rating.toFixed(2) : Lang.getText(Lang.Type.B0001));
            this._labelPlayedTimes.text     = Lang.getFormattedText(Lang.Type.F0004, await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId));
            this._groupInfo.visible         = true;
            this._groupInfo.alpha           = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            this._zoomMap.showMapByMapData(mapRawData);
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : MrrPreviewMapListPanel;
    }

    class MapNameRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForMapNameRenderer;
            this.currentState   = data.mapId === data.panel.getSelectedMapId() ? Types.UiState.Down : Types.UiState.Up;
            WarMapModel.getMapNameInCurrentLanguage(data.mapId).then(v => this._labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedMapId(data.mapId);
        }
    }
}
