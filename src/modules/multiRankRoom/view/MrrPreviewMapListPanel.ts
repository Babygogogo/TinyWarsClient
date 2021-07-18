
import TwnsCommonMapInfoPage                from "../../common/view/CommonMapInfoPage";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import Helpers                              from "../../tools/helpers/Helpers";
import Types                                from "../../tools/helpers/Types";
import Lang                                 from "../../tools/lang/Lang";
import TwnsLangTextType                     from "../../tools/lang/LangTextType";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import TwnsUiButton                         from "../../tools/ui/UiButton";
import TwnsUiLabel                          from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
import TwnsUiTab                            from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
import WarMapModel                          from "../../warMap/model/WarMapModel";
import MrrModel                             from "../model/MrrModel";
import TwnsMrrMainMenuPanel                 from "./MrrMainMenuPanel";
import TwnsMrrPreviewAdvancedSettingsPage   from "./MrrPreviewAdvancedSettingsPage";
import TwnsMrrPreviewBasicSettingsPage      from "./MrrPreviewBasicSettingsPage";

namespace TwnsMrrPreviewMapListPanel {
    import OpenDataForMrrPreviewAdvancedSettingsPage    = TwnsMrrPreviewAdvancedSettingsPage.OpenDataForMrrPreviewAdvancedSettingsPage;
    import MrrPreviewAdvancedSettingsPage               = TwnsMrrPreviewAdvancedSettingsPage.MrrPreviewAdvancedSettingsPage;
    import OpenDataForMrrPreviewBasicSettingsPage       = TwnsMrrPreviewBasicSettingsPage.OpenDataForMrrPreviewBasicSettingsPage;
    import MrrPreviewBasicSettingsPage                  = TwnsMrrPreviewBasicSettingsPage.MrrPreviewBasicSettingsPage;
    import OpenDataForCommonMapInfoPage                 = TwnsCommonMapInfoPage.OpenDataForCommonMapInfoPage;
    import LangTextType                                 = TwnsLangTextType.LangTextType;
    import NotifyType                                   = TwnsNotifyType.NotifyType;

    type OpenDataForMrrPreviewMapListPanel = {
        hasFog: boolean;
    };
    export class MrrPreviewMapListPanel extends TwnsUiPanel.UiPanel<OpenDataForMrrPreviewMapListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrPreviewMapListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonMapInfoPage | OpenDataForMrrPreviewBasicSettingsPage | OpenDataForMrrPreviewAdvancedSettingsPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelRankMatch        : TwnsUiLabel.UiLabel;
        private readonly _labelPreviewMap       : TwnsUiLabel.UiLabel;
        private readonly _labelMapType          : TwnsUiLabel.UiLabel;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnSwitch             : TwnsUiButton.UiButton;

        private readonly _groupMapList          : eui.Group;
        private readonly _listMap               : TwnsUiScrollList.UiScrollList<DataForMapNameRenderer>;
        private readonly _labelNoMap            : TwnsUiLabel.UiLabel;
        private readonly _labelLoading          : TwnsUiLabel.UiLabel;

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

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrPreviewMapListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MrrPreviewingMapIdChanged,  callback: this._onNotifyMrrPreviewingMapIdChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listMap.setItemRenderer(MapNameRenderer);

            this._showOpenAnimation();

            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupMapList();
            this._updateComponentsForTargetMapInfo();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMrrPreviewingMapIdChanged(): void {
            this._updateComponentsForTargetMapInfo();
        }

        private _onTouchedBtnBack(): void {
            this.close();
            TwnsMrrMainMenuPanel.MrrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnSwitch(): Promise<void> {
            const hasFog = this._getOpenData().hasFog;
            this.close();
            MrrPreviewMapListPanel.show({ hasFog: !hasFog });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _initTabSettings(): void {
            const hasFog = this._getOpenData().hasFog;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonMapInfoPage.CommonMapInfoPage,
                    pageData    : this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : MrrPreviewBasicSettingsPage,
                    pageData    : { hasFog, mapId: null } as OpenDataForMrrPreviewBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : MrrPreviewAdvancedSettingsPage,
                    pageData    : { hasFog, mapId: null } as OpenDataForMrrPreviewAdvancedSettingsPage,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text     = Lang.getText(LangTextType.A0040);
            this._labelRankMatch.text   = Lang.getText(LangTextType.B0404);
            this._labelPreviewMap.text  = Lang.getText(LangTextType.B0594);
            this._labelMapType.text     = Lang.getText(this._getOpenData().hasFog ? LangTextType.B0596 : LangTextType.B0595);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
            this._labelNoMap.text       = Lang.getText(LangTextType.B0582);
            this._btnSwitch.label       = Lang.getText(LangTextType.B0597);
        }

        private async _updateGroupMapList(): Promise<void> {
            const labelLoading      = this._labelLoading;
            const labelNoMap        = this._labelNoMap;
            const listMap           = this._listMap;
            labelNoMap.visible      = false;

            const dataArray         = await this._createDataForListMap();
            labelLoading.visible    = false;
            labelNoMap.visible      = !dataArray.length;
            listMap.bindData(dataArray);

            const mapId = MrrModel.getPreviewingMapId();
            if (dataArray.every(v => v.mapId != mapId)) {
                MrrModel.setPreviewingMapId(dataArray.length ? dataArray[0].mapId : null);
            }
        }

        private async _updateComponentsForTargetMapInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const mapId         = MrrModel.getPreviewingMapId();
            if (mapId == null) {
                groupTab.visible    = false;
            } else {
                groupTab.visible    = true;

                const tab       = this._tabSettings;
                const hasFog    = this._getOpenData().hasFog;
                tab.updatePageData(1, { hasFog, mapId } as OpenDataForMrrPreviewBasicSettingsPage);
                tab.updatePageData(2, { hasFog, mapId } as OpenDataForMrrPreviewAdvancedSettingsPage);
                this._updateCommonMapInfoPage();
            }
        }

        private _updateCommonMapInfoPage(): void {
            this._tabSettings.updatePageData(0, this._createDataForCommonMapInfoPage());
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const hasFog        = this._getOpenData().hasFog;
            const promiseArray  : Promise<ProtoTypes.Map.IMapRawData>[] = [];
            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapExtraData = mapBriefData.mapExtraData;
                if (!mapExtraData.isEnabled) {
                    continue;
                }

                const mapAvailability = mapExtraData.mapComplexInfo.mapAvailability;
                if (((hasFog) && (mapAvailability.canMrwFog))   ||
                    ((!hasFog) && (mapAvailability.canMrwStd))
                ) {
                    promiseArray.push(WarMapModel.getRawData(mapId));
                }
            }

            const dataArray : DataForMapNameRenderer[] = [];
            for (const mapRawData of await Promise.all(promiseArray)) {
                if ((mapRawData) &&
                    (mapRawData.warRuleArray.some(v => {
                        return (v.ruleAvailability.canMrw)
                            && (hasFog === v.ruleForGlobalParams.hasFogByDefault);
                    }))
                ) {
                    const mapId = mapRawData.mapId;
                    dataArray.push({
                        mapId,
                        mapName : Lang.getLanguageText({ textArray: mapRawData.mapNameArray }),
                    });
                }
            }

            return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private _createDataForCommonMapInfoPage(): OpenDataForCommonMapInfoPage {
            const mapId = MrrModel.getPreviewingMapId();
            return mapId == null
                ? {}
                : { mapInfo: { mapId } };
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
                obj         : this._groupMapList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnSwitch,
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
                    obj         : this._groupMapList,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnSwitch,
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
    };
    class TabItemRenderer extends TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
    };
    class MapNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
        private readonly _btnChoose     : TwnsUiButton.UiButton;
        private readonly _labelName     : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MrrPreviewingMapIdChanged, callback: this._onNotifyMrrPreviewingMapIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            this._labelName.text = (await WarMapModel.getMapNameInCurrentLanguage(this.data.mapId)) || `??`;
        }

        private _onNotifyMrrPreviewingMapIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            MrrModel.setPreviewingMapId(this.data.mapId);
        }

        private _updateState(): void {
            this.currentState = this.data.mapId === MrrModel.getPreviewingMapId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsMrrPreviewMapListPanel;
