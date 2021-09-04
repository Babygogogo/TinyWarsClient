
import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import ConfigManager                        from "../../tools/helpers/ConfigManager";
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

namespace TwnsMrrPreviewMapListPanel {
    import OpenDataForCommonWarAdvancedSettingsPage     = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage        = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage              = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
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

        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarAdvancedSettingsPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelRankMatch!       : TwnsUiLabel.UiLabel;
        private readonly _labelPreviewMap!      : TwnsUiLabel.UiLabel;
        private readonly _labelMapType!         : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnSwitch!            : TwnsUiButton.UiButton;

        private readonly _groupMapList!         : eui.Group;
        private readonly _listMap!              : TwnsUiScrollList.UiScrollList<DataForMapNameRenderer>;
        private readonly _labelNoMap!           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _isTabInitialized = false;

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

            this._isTabInitialized = false;
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
                    pageClass   : TwnsCommonWarMapInfoPage.CommonWarMapInfoPage,
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
            this._isTabInitialized = true;
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
            const mapId             = MrrModel.getPreviewingMapId();
            labelLoading.visible    = false;
            labelNoMap.visible      = !dataArray.length;
            listMap.bindData(dataArray);
            listMap.setSelectedIndex(dataArray.findIndex(v => v.mapId === mapId));
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
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, this._createDataForCommonMapInfoPage());
            }
        }

        private async _updateCommonWarBasicSettingsPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(1, await this._createDataForCommonWarBasicSettingsPage());
            }
        }

        private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(2, await this._createDataForCommonWarAdvancedSettingsPage());
            }
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const hasFog        = this._getOpenData().hasFog;
            const promiseArray  : Promise<ProtoTypes.Map.IMapRawData | null>[] = [];
            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapExtraData = mapBriefData.mapExtraData;
                if (!mapExtraData?.isEnabled) {
                    continue;
                }

                const mapAvailability = Helpers.getExisted(mapExtraData.mapComplexInfo?.mapAvailability);
                if (((hasFog) && (mapAvailability.canMrwFog))   ||
                    ((!hasFog) && (mapAvailability.canMrwStd))
                ) {
                    promiseArray.push(WarMapModel.getRawData(mapId));
                }
            }

            const dataArray : DataForMapNameRenderer[] = [];
            for (const mapRawData of await Promise.all(promiseArray)) {
                if ((mapRawData) &&
                    (mapRawData.warRuleArray?.some(v => {
                        return (v.ruleAvailability?.canMrw)
                            && (hasFog === v.ruleForGlobalParams?.hasFogByDefault);
                    }))
                ) {
                    dataArray.push({
                        mapId   : Helpers.getExisted(mapRawData.mapId),
                        mapName : Lang.getLanguageText({ textArray: mapRawData.mapNameArray }) || CommonConstants.ErrorTextForUndefined,
                    });
                }
            }

            return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private _createDataForCommonMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const mapId = MrrModel.getPreviewingMapId();
            return mapId == null
                ? {}
                : { mapInfo: { mapId } };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const mapId = MrrModel.getPreviewingMapId();
            if (mapId == null) {
                return null;
            }

            const mapRawData = await WarMapModel.getRawData(mapId);
            if (mapRawData == null) {
                return null;
            }

            const hasFog        = this._getOpenData().hasFog;
            const warRuleArray  = mapRawData.warRuleArray?.filter(v => {
                return (v.ruleAvailability?.canMrw) && (hasFog === v.ruleForGlobalParams?.hasFogByDefault);
            });
            if ((warRuleArray == null) || (!warRuleArray.length)) {
                return null;
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
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.WarRuleTitle,
                        currentValue    : null,
                        warRule,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.HasFog,
                        currentValue    : null,
                        warRule,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerType,
                        currentValue    : timerType,
                        warRule,
                        callbackOnModify: null,
                    },
                ],
            };
            if (timerType === Types.BootTimerType.Regular) {
                openData.dataArrayForListSettings.push({
                    settingsType    : WarBasicSettingsType.TimerRegularParam,
                    currentValue    : bootTimerParams[1],
                    warRule,
                    callbackOnModify: null,
                });
            } else if (timerType === Types.BootTimerType.Incremental) {
                openData.dataArrayForListSettings.push(
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam1,
                        currentValue    : bootTimerParams[1],
                        warRule,
                        callbackOnModify: null,
                    },
                    {
                        settingsType    : WarBasicSettingsType.TimerIncrementalParam2,
                        currentValue    : bootTimerParams[2],
                        warRule,
                        callbackOnModify: null,
                    },
                );
            } else {
                throw new Error(`Invalid timerType: ${timerType}`);
            }

            return openData;
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            const mapId = MrrModel.getPreviewingMapId();
            if (mapId == null) {
                return null;
            }

            const mapRawData    = Helpers.getExisted(await WarMapModel.getRawData(mapId));
            const hasFog        = this._getOpenData().hasFog;
            const warRuleArray  = mapRawData.warRuleArray?.filter(v => {
                return (v.ruleAvailability?.canMrw) && (hasFog === v.ruleForGlobalParams?.hasFogByDefault);
            });
            if ((warRuleArray == null) || (!warRuleArray.length)) {
                return null;
            }

            return {
                configVersion   : Helpers.getExisted(ConfigManager.getLatestConfigVersion()),
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
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this._getData().name;
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
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
            this._labelName.text = (await WarMapModel.getMapNameInCurrentLanguage(this._getData().mapId)) || `??`;
        }

        private _onTouchTapBtnChoose(): void {
            MrrModel.setPreviewingMapId(this._getData().mapId);
        }
    }
}

export default TwnsMrrPreviewMapListPanel;
