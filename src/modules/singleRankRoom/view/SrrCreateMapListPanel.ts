
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import TwnsSpmMainMenuPanel         from "../../singlePlayerMode/view/SpmMainMenuPanel";
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
// import ScrCreateModel               from "../model/ScrCreateModel";
// import TwnsScrCreateSearchMapPanel  from "./ScrCreateSearchMapPanel";
// import TwnsScrCreateSettingsPanel   from "./ScrCreateSettingsPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleRankRoom {
    import LangTextType                     = Lang.LangTextType;
    import NotifyType                       = Notify.NotifyType;
    import OpenDataForCommonWarMapInfoPage  = Common.OpenDataForCommonMapInfoPage;
    import OpenDataForSpmRankPage           = SinglePlayerMode.OpenDataForSpmRankPage;

    export type OpenDataForSrrCreateMapListPanel = {
        mapFilter: Common.MapFilter | null;
    };
    export class SrrCreateMapListPanel extends TwnsUiPanel.UiPanel<OpenDataForSrrCreateMapListPanel> {
        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForSpmRankPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelSinglePlayer!    : TwnsUiLabel.UiLabel;
        private readonly _labelWarRoomMode!     : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap!       : TwnsUiLabel.UiLabel;

        private readonly _btnHelp!              : TwnsUiButton.UiButton;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnSearch!            : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupMapList!         : eui.Group;
        private readonly _listMap!              : TwnsUiScrollList.UiScrollList<DataForMapNameRenderer>;
        private readonly _labelNoMap!           : TwnsUiLabel.UiLabel;

        private _isTabInitialized   = false;
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number | null = null;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
                { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._isTabInitialized = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();

            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setAndReviseSelectedMapId(newMapId: number | null): void {
            const dataList = this._dataForList;
            if (dataList.length <= 0) {
                this._selectedMapId = null;
            } else {
                const index         = dataList.findIndex(data => data.mapId === newMapId);
                const newIndex      = index >= 0 ? index : Math.floor(Math.random() * dataList.length);
                const oldIndex      = dataList.findIndex(data => data.mapId === this._selectedMapId);
                this._selectedMapId = dataList[newIndex].mapId;
                (dataList[oldIndex])    && (this._listMap.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listMap.updateSingleData(newIndex, dataList[newIndex]));

                this._listMap.setSelectedIndex(newIndex);
            }
            this._updateComponentsForPreviewingMapInfo();
        }
        public getSelectedMapId(): number | null {
            return this._selectedMapId;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnSearch(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonMapFilterPanel, {
                mapFilter           : this._getOpenData().mapFilter,
                callbackOnConfirm   : mapFilter => {
                    PanelHelpers.open(PanelHelpers.PanelDict.SrrCreateMapListPanel, {
                        mapFilter,
                    });
                },
                callbackOnReset     : () => {
                    PanelHelpers.open(PanelHelpers.PanelDict.SrrCreateMapListPanel, {
                        mapFilter   : null,
                    });
                }
            });
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            PanelHelpers.open(PanelHelpers.PanelDict.SpmMainMenuPanel, void 0);
            PanelHelpers.open(PanelHelpers.PanelDict.LobbyTopPanel, void 0);
            PanelHelpers.open(PanelHelpers.PanelDict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const selectedMapId = this.getSelectedMapId();
            if (selectedMapId != null) {
                this.close();
                await SingleRankRoom.SrrCreateModel.resetDataByMapId(selectedMapId);
                PanelHelpers.open(PanelHelpers.PanelDict.SrrCreateSettingsPanel, void 0);
                PanelHelpers.open(PanelHelpers.PanelDict.SrrCreateQuickSettingsPanel, void 0);
            }
        }

        private _onTouchedBtnHelp(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonHelpPanel, {
                title   : Lang.getText(LangTextType.B0614),
                content : Lang.getText(LangTextType.R0011),
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const dataArray             = await this._createDataArrayForListMap();
            this._dataForList           = dataArray;

            const length                = dataArray.length;
            const listMap               = this._listMap;
            this._labelNoMap.visible    = length <= 0;
            listMap.bindData(dataArray);
            this.setAndReviseSelectedMapId(this._selectedMapId);

            if (length > 1) {
                const index = dataArray.findIndex(v => v.mapId === this._selectedMapId);
                (index >= 0) && (listMap.scrollVerticalTo(index / (length - 1) * 100));
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelWarRoomMode.text         = Lang.getText(LangTextType.B0614);
            this._labelSinglePlayer.text        = Lang.getText(LangTextType.B0138);
            this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
            this._labelNoMap.text               = Lang.getText(LangTextType.A0010);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
            this._btnNextStep.label             = Lang.getText(LangTextType.B0566);
        }

        private async _initTabSettings(): Promise<void> {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : Common.CommonWarMapInfoPage,
                    pageData    : await this._createDataForCommonWarMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0436) },
                    pageClass   : SinglePlayerMode.SpmRankPage,
                    pageData    : await this._createDataForCommonWarPlayerInfoPage(),
                },
            ]);
            this._isTabInitialized = true;
        }

        private async _createDataArrayForListMap(): Promise<DataForMapNameRenderer[]> {
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
                    if ((mapBriefData == null) || (!mapBriefData.ruleAvailability?.canSrw)) {
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

        private async _updateComponentsForPreviewingMapInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            if (this._selectedMapId == null) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                this._updateCommonMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private async _updateCommonMapInfoPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            }
        }

        private _updateCommonWarPlayerInfoPage(): void {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(1, this._createDataForCommonWarPlayerInfoPage());
            }
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const mapId = this._selectedMapId;
            return mapId == null
                ? null
                : {
                    gameConfig  : await Config.ConfigManager.getLatestGameConfig(),
                    mapInfo     : { mapId },
                };
        }

        private _createDataForCommonWarPlayerInfoPage(): OpenDataForSpmRankPage {
            return { mapId: this._selectedMapId };
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnHelp,
                beginProps  : { alpha: 0, y: -16 },
                endProps    : { alpha: 1, y: 24 },
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnHelp,
                beginProps  : { alpha: 1, y: 24 },
                endProps    : { alpha: 0, y: -16 },
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : SrrCreateMapListPanel;
    };

    class MapNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data          = this._getData();
            WarMap.WarMapModel.getMapNameInCurrentLanguage(data.mapId).then(v => this._labelName.text = v || CommonConstants.ErrorTextForUndefined);
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedMapId(data.mapId);
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    };
    class TabItemRenderer extends TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this._getData().name;
        }
    }
}

// export default TwnsSrrCreateMapListPanel;
