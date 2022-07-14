
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiMapInfo                from "../../tools/ui/UiMapInfo";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsUiZoomableMap            from "../../tools/ui/UiZoomableMap";
// import WarMapModel                  from "../../warMap/model/WarMapModel";
// import McrCreateModel               from "../model/McrCreateModel";
// import TwnsMcrCreateSearchMapPanel  from "./McrCreateSearchMapPanel";
// import TwnsMcrCreateSettingsPanel   from "./McrCreateSettingsPanel";
// import TwnsMcrMainMenuPanel         from "./McrMainMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom {
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;

    export type OpenDataForMcrCreateMapListPanel = {
        mapFilter   : Common.MapFilter | null;
    };
    export class McrCreateMapListPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrCreateMapListPanel> {
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

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
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

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnSearch(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonMapFilterPanel, {
                mapFilter           : this._getOpenData().mapFilter,
                callbackOnConfirm   : mapFilter => {
                    PanelHelpers.open(PanelHelpers.PanelDict.McrCreateMapListPanel, {
                        mapFilter,
                    });
                },
                callbackOnReset     : () => {
                    PanelHelpers.open(PanelHelpers.PanelDict.McrCreateMapListPanel, {
                        mapFilter   : null,
                    });
                }
            });
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            PanelHelpers.open(PanelHelpers.PanelDict.McrMainMenuPanel, void 0);
            PanelHelpers.open(PanelHelpers.PanelDict.LobbyTopPanel, void 0);
            PanelHelpers.open(PanelHelpers.PanelDict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const selectedMapId = this._getSelectedMapId();
            if (selectedMapId != null) {
                this.close();
                await MultiCustomRoom.McrCreateModel.resetDataByMapId(selectedMapId);
                PanelHelpers.open(PanelHelpers.PanelDict.McrCreateSettingsPanel, void 0);
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        public async _updateView(): Promise<void> {
            const oldSelectedMapId      = this._getSelectedMapId();
            const dataArray             = await this._createDataForListMap();
            this._labelNoMap.visible    = dataArray.length <= 0;
            this._listMap.bindData(dataArray);
            await this.setAndReviseSelectedMapId(oldSelectedMapId ?? -1, true);
        }

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
            const mapFilter             = this._getOpenData().mapFilter;
            const filterMapTagIdFlags   = mapFilter?.mapTagIdFlags;
            const filterMapName         = mapFilter?.mapName?.trim().toLowerCase();
            const filterMapDesigner     = mapFilter?.mapDesigner?.trim().toLowerCase();
            const filterPlayersCount    = mapFilter?.playersCount;
            const filterMinRating       = mapFilter?.minRating;
            const filterPlayedTimes     = mapFilter?.playedTimes;
            const dataArray             : DataForMapNameRenderer[] = [];

            const promiseArray: Promise<void>[] = [];
            for (const mapId of WarMap.WarMapModel.getEnabledMapIdArray()) {
                promiseArray.push((async () => {
                    const mapBriefData = await WarMap.WarMapModel.getBriefData(mapId);
                    if ((mapBriefData == null) || (!mapBriefData.ruleAvailability?.canMcw)) {
                        return;
                    }
                    if (!mapBriefData.mapExtraData?.isEnabled) {
                        return;
                    }
                    if ((filterMapDesigner) && (!mapBriefData.designerName?.toLowerCase().includes(filterMapDesigner))) {
                        return;
                    }
                    if ((filterPlayersCount) && (mapBriefData.playersCountUnneutral !== filterPlayersCount)) {
                        return;
                    }
                    if ((filterPlayedTimes != null) && (await WarMap.WarMapModel.getTotalPlayedTimes(mapId) < filterPlayedTimes)) {
                        return;
                    }

                    const realMapName = Helpers.getExisted(await WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId));
                    if ((filterMapName) && (realMapName.toLowerCase().indexOf(filterMapName) < 0)) {
                        return;
                    }

                    const rating = await WarMap.WarMapModel.getAverageRating(mapId);
                    if ((filterMinRating != null)                       &&
                        ((rating == null) || (rating < filterMinRating))
                    ) {
                        return;
                    }

                    const mapTagIdFlags = mapBriefData.mapTagIdFlags;
                    if ((filterMapTagIdFlags)                                                                       &&
                        ((mapTagIdFlags == null) || ((filterMapTagIdFlags & mapTagIdFlags) !== filterMapTagIdFlags))
                    ) {
                        return;
                    }

                    dataArray.push({
                        mapId,
                        mapName : realMapName,
                        panel   : this,
                    });
                })());
            }

            await Promise.all(promiseArray);
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
                zoomMap.showMapByMapData(Helpers.getExisted(await WarMap.WarMapModel.getRawData(mapId)), await Config.ConfigManager.getLatestGameConfig());
                uiMapInfo.setData({
                    hasFog  : null,
                    mapInfo : {
                        mapId,
                    },
                });
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupMapView,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : McrCreateMapListPanel;
    };
    class MapNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const label = this._labelName;
            label.text  = ``;
            label.text  = await WarMap.WarMapModel.getMapNameInCurrentLanguage(this._getData().mapId) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedMapId(data.mapId, false);
        }
    }
}

// export default TwnsMcrCreateMapListPanel;
