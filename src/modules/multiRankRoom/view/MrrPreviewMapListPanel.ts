
import TwnsCommonMapInfoPage                from "../../common/view/CommonMapInfoPage";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import ConfigManager                        from "../../tools/helpers/ConfigManager";
import Helpers                              from "../../tools/helpers/Helpers";
import Logger                               from "../../tools/helpers/Logger";
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

namespace TwnsMrrPreviewMapListPanel {
    import OpenDataForCommonWarAdvancedSettingsPage     = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage        = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonMapInfoPage                 = TwnsCommonMapInfoPage.OpenDataForCommonMapInfoPage;
    import LangTextType                                 = TwnsLangTextType.LangTextType;
    import NotifyType                                   = TwnsNotifyType.NotifyType;
    import WarBasicSettingsType                         = Types.WarBasicSettingsType;

    type OpenDataForMrrPreviewMapListPanel = {
        hasFog: boolean;
    };
    export class MrrPreviewMapListPanel extends TwnsUiPanel.UiPanel<OpenDataForMrrPreviewMapListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrPreviewMapListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonMapInfoPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarAdvancedSettingsPage>;

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

        protected async _onOpened(): Promise<void> {
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

            await this._initTabSettings();
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
        private async _initTabSettings(): Promise<void> {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonMapInfoPage.CommonMapInfoPage,
                    pageData    : this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : TwnsCommonWarBasicSettingsPage.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : TwnsCommonWarAdvancedSettingsPage.CommonWarAdvancedSettingsPage,
                    pageData    : await this._createDataForCommonWarAdvancedSettingsPage(),
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

                this._updateCommonMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private _updateCommonMapInfoPage(): void {
            this._tabSettings.updatePageData(0, this._createDataForCommonMapInfoPage());
        }

        private async _updateCommonWarBasicSettingsPage(): Promise<void> {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarBasicSettingsPage());
        }

        private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarAdvancedSettingsPage());
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

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const mapId         = MrrModel.getPreviewingMapId();
            const mapRawData    = await WarMapModel.getRawData(mapId);
            if (mapRawData == null) {
                return { dataArrayForListSettings: [] };
            }

            const hasFog        = this._getOpenData().hasFog;
            const warRuleArray  = mapRawData.warRuleArray.filter(v => {
                return (v.ruleAvailability.canMrw) && (hasFog === v.ruleForGlobalParams.hasFogByDefault);
            });
            if (!warRuleArray.length) {
                return { dataArrayForListSettings: [] };
            }

            const warRule           = warRuleArray[0];
            const bootTimerParams   = CommonConstants.WarBootTimerDefaultParams;
            const timerType         = bootTimerParams[0] as Types.BootTimerType;
            const openData          : OpenDataForCommonWarBasicSettingsPage = {
                dataArrayForListSettings    : [
                    {
                        settingsType    : WarBasicSettingsType.MapName,
                        currentValue    : await WarMapModel.getMapNameInCurrentLanguage(mapId),
                        warRule,
                        callbackOnModify: undefined,
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarRuleTitle,
                        currentValue    : undefined,
                        warRule,
                        callbackOnModify: undefined,
                    },
                    {
                        settingsType    : WarBasicSettingsType.HasFog,
                        currentValue    : undefined,
                        warRule,
                        callbackOnModify: undefined,
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerType,
                        currentValue    : timerType,
                        warRule,
                        callbackOnModify: undefined,
                    },
                ],
            };
            if (timerType === Types.BootTimerType.Regular) {
                openData.dataArrayForListSettings.push({
                    settingsType    : WarBasicSettingsType.TimerRegularParam,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: undefined,
                });
            } else if (timerType === Types.BootTimerType.Incremental) {
                openData.dataArrayForListSettings.push(
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                        currentValue    : bootTimerParams[1],
                        warRule,
                        callbackOnModify: undefined,
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                        currentValue    : bootTimerParams[2],
                        warRule,
                        callbackOnModify: undefined,
                    },
                );
            } else {
                Logger.error(`MrrPreviewMapListPanel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
            }

            return openData;
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage | undefined> {
            const mapRawData = await WarMapModel.getRawData(MrrModel.getPreviewingMapId());
            if (mapRawData == null) {
                return undefined;
            }

            const hasFog        = this._getOpenData().hasFog;
            const warRuleArray  = mapRawData.warRuleArray.filter(v => {
                return (v.ruleAvailability.canMrw) && (hasFog === v.ruleForGlobalParams.hasFogByDefault);
            });
            if (!warRuleArray.length) {
                return undefined;
            }

            return {
                configVersion   : ConfigManager.getLatestFormalVersion(),
                warRule         : warRuleArray[0],
                warType         : hasFog ? Types.WarType.MrwFog : Types.WarType.MrwStd,
            };
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
