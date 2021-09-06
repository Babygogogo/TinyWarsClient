
import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers         from "../../tools/helpers/CompatibilityHelpers";
import Helpers                      from "../../tools/helpers/Helpers";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiMapInfo                from "../../tools/ui/UiMapInfo";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import TwnsUiZoomableMap            from "../../tools/ui/UiZoomableMap";
import WarMapModel                  from "../../warMap/model/WarMapModel";
import McrCreateModel               from "../model/McrCreateModel";
import TwnsMcrCreateSearchMapPanel  from "./McrCreateSearchMapPanel";
import TwnsMcrCreateSettingsPanel   from "./McrCreateSettingsPanel";
import TwnsMcrMainMenuPanel         from "./McrMainMenuPanel";

namespace TwnsMcrCreateMapListPanel {
    import McrCreateSearchMapPanel  = TwnsMcrCreateSearchMapPanel.McrCreateSearchMapPanel;
    import McrCreateSettingsPanel   = TwnsMcrCreateSettingsPanel.McrCreateSettingsPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IDataForMapTag           = ProtoTypes.Map.IDataForMapTag;

    type FiltersForMapList = {
        mapName?        : string | null;
        mapDesigner?    : string | null;
        playersCount?   : number | null;
        playedTimes?    : number | null;
        minRating?      : number | null;
        mapTag?         : IDataForMapTag | null;
    };
    export class McrCreateMapListPanel extends TwnsUiPanel.UiPanel<FiltersForMapList | null> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateMapListPanel;

        private readonly _groupMapView!         : eui.Group;
        private readonly _zoomMap!              : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelMultiPlayer!     : TwnsUiLabel.UiLabel;
        private readonly _labelCreateRoom!      : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap!       : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnSearch!            : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupMapList!         : eui.Group;
        private readonly _listMap!              : TwnsUiScrollList.UiScrollList<DataForMapNameRenderer>;
        private readonly _labelNoMap!           : TwnsUiLabel.UiLabel;

        private readonly _uiMapInfo!            : TwnsUiMapInfo.UiMapInfo;

        private _mapFilters                     : FiltersForMapList = {};

        public static show(mapFilters: FiltersForMapList | null): void {
            if (!McrCreateMapListPanel._instance) {
                McrCreateMapListPanel._instance = new McrCreateMapListPanel();
            }

            McrCreateMapListPanel._instance.open(mapFilters);
        }
        public static async hide(): Promise<void> {
            if (McrCreateMapListPanel._instance) {
                await McrCreateMapListPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }
        public static getInstance(): McrCreateMapListPanel {
            return McrCreateMapListPanel._instance;
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateMapListPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listMap.setItemRenderer(MapNameRenderer);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();

            this.setMapFilters(this._getOpenData() || this._mapFilters);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });
        }

        public async setAndReviseSelectedMapId(newMapId: number, needScroll: boolean): Promise<void> {
            const listMap   = this._listMap;
            const index     = Helpers.getExisted(listMap.getRandomIndex(v => v.mapId === newMapId));
            listMap.setSelectedIndex(index);
            this._showMap(listMap.getSelectedData()?.mapId ?? null);

            if (needScroll) {
                listMap.scrollVerticalToIndex(index);
            }
        }
        private _getSelectedMapId(): number | null {
            return this._listMap.getSelectedData()?.mapId ?? null;
        }

        public async setMapFilters(mapFilters: FiltersForMapList): Promise<void> {
            this._mapFilters = mapFilters;

            const oldSelectedMapId      = this._getSelectedMapId();
            const dataArray             = await this._createDataForListMap().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            const length                = dataArray.length;
            const listMap               = this._listMap;
            this._labelNoMap.visible    = length <= 0;
            listMap.bindData(dataArray);
            this.setAndReviseSelectedMapId(oldSelectedMapId ?? 0, true);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnSearch(): void {
            McrCreateSearchMapPanel.show();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const selectedMapId = this._getSelectedMapId();
            if (selectedMapId != null) {
                this.close();
                await McrCreateModel.resetDataByMapId(selectedMapId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                McrCreateSettingsPanel.show();
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelCreateRoom.text          = Lang.getText(LangTextType.B0000);
            this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0137);
            this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
            this._labelLoading.text             = Lang.getText(LangTextType.A0150);
            this._labelNoMap.text               = Lang.getText(LangTextType.A0010);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
            this._btnNextStep.label             = Lang.getText(LangTextType.B0566);
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const dataArray                                 : DataForMapNameRenderer[] = [];
            const mapFilters                                = this._mapFilters;
            const filterTag                                 = mapFilters.mapTag || {};
            const mapName                                   = (mapFilters.mapName || "").toLowerCase();
            const mapDesigner                               = (mapFilters.mapDesigner || "").toLowerCase();
            const { playersCount, playedTimes, minRating }  = mapFilters;

            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapExtraData      = Helpers.getExisted(mapBriefData.mapExtraData);
                const mapTag            = mapBriefData.mapTag || {};
                const realMapName       = Helpers.getExisted(await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }));
                const rating            = await WarMapModel.getAverageRating(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                const actualPlayedTimes = await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                if ((!mapBriefData.ruleAvailability?.canMcw)                                                            ||
                    (!mapExtraData.isEnabled)                                                                           ||
                    (!mapExtraData.mapComplexInfo?.mapAvailability?.canMcw)                                             ||
                    ((mapName) && (realMapName.toLowerCase().indexOf(mapName) < 0))                                     ||
                    ((mapDesigner) && (!mapBriefData.designerName?.toLowerCase().includes(mapDesigner)))                ||
                    ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))                           ||
                    ((playedTimes != null) && (actualPlayedTimes < playedTimes))                                        ||
                    ((minRating != null) && ((rating == null) || (rating < minRating)))                                 ||
                    ((filterTag.fog != null) && ((!!mapTag.fog) !== filterTag.fog))
                ) {
                    continue;
                } else {
                    dataArray.push({
                        mapId,
                        mapName : realMapName,
                        panel   : this,
                    });
                }
            }

            return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _showMap(mapId: number | null): Promise<void> {
            const zoomMap   = this._zoomMap;
            const uiMapInfo = this._uiMapInfo;
            if (mapId == null) {
                zoomMap.visible     = false;
                uiMapInfo.visible   = false;
            } else {
                zoomMap.visible     = true;
                uiMapInfo.visible   = true;
                zoomMap.showMapByMapData(Helpers.getExisted(await WarMapModel.getRawData(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; })));
                uiMapInfo.setData({
                    mapInfo: {
                        mapId,
                    },
                });
            }
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._groupMapView,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnSearch,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupMapList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._uiMapInfo,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._groupMapView,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._groupNavigator,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnSearch,
                    beginProps  : { alpha: 1, y: 80 },
                    endProps    : { alpha: 0, y: 40 },
                });
                Helpers.resetTween({
                    obj         : this._btnNextStep,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupMapList,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._uiMapInfo,
                    beginProps  : { alpha: 1, right: 0 },
                    endProps    : { alpha: 0, right: -40 },
                });
            });
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : McrCreateMapListPanel;
    };
    class MapNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _btnNext!      : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const label = this._labelName;
            label.text  = ``;
            label.text  = await WarMapModel.getMapNameInCurrentLanguage(this._getData().mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedMapId(data.mapId, false);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            const data = this._getData();
            data.panel.close();
            await McrCreateModel.resetDataByMapId(data.mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            McrCreateSettingsPanel.show();
        }
    }
}

export default TwnsMcrCreateMapListPanel;
