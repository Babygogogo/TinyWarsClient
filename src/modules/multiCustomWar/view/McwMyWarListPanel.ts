
import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import TwnsMcrMainMenuPanel                 from "../../multiCustomRoom/view/McrMainMenuPanel";
import MpwModel                             from "../../multiPlayerWar/model/MpwModel";
import MpwProxy                             from "../../multiPlayerWar/model/MpwProxy";
import Helpers                              from "../../tools/helpers/Helpers";
import Logger                               from "../../tools/helpers/Logger";
import Types                                from "../../tools/helpers/Types";
import Lang                                 from "../../tools/lang/Lang";
import TwnsLangTextType                     from "../../tools/lang/LangTextType";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import TwnsUiButton                         from "../../tools/ui/UiButton";
import TwnsUiLabel                          from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
import TwnsUiTab                            from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
import WarMapModel                          from "../../warMap/model/WarMapModel";
import TwnsMcwWarPlayerInfoPage             from "./McwWarPlayerInfoPage";

namespace TwnsMcwMyWarListPanel {
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import McwWarPlayerInfoPage                     = TwnsMcwWarPlayerInfoPage.McwWarPlayerInfoPage;
    import OpenDataForMcwWarPlayerInfoPage          = TwnsMcwWarPlayerInfoPage.OpenDataForMcwWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import LangTextType                             = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    export class McwMyWarListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwMyWarListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForMcwWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : TwnsUiLabel.UiLabel;
        private readonly _labelMyWar            : TwnsUiLabel.UiLabel;
        private readonly _labelChooseWar        : TwnsUiLabel.UiLabel;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnNextStep           : TwnsUiButton.UiButton;

        private readonly _groupWarList          : eui.Group;
        private readonly _listWar               : TwnsUiScrollList.UiScrollList<DataForWarRenderer>;
        private readonly _labelNoWar            : TwnsUiLabel.UiLabel;
        private readonly _labelLoading          : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;
        private _isTabInitialized   = false;

        public static show(): void {
            if (!McwMyWarListPanel._instance) {
                McwMyWarListPanel._instance = new McwMyWarListPanel();
            }
            McwMyWarListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McwMyWarListPanel._instance) {
                await McwMyWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwMyWarListPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.McwPreviewingWarIdChanged,      callback: this._onNotifyMcwPreviewingWarIdChanged },
                { type: NotifyType.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listWar.setItemRenderer(WarRenderer);

            this._showOpenAnimation();

            this._hasReceivedData   = false;
            this._isTabInitialized  = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();

            MpwProxy.reqMpwCommonGetMyWarInfoList();
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

        private _onNotifyMcwPreviewingWarIdChanged(): void {
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onNotifyMsgMpwCommonGetMyWarInfoList(): void {
            this._hasReceivedData = true;
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private _onTouchedBtnNextStep(): void {
            const warId = MpwModel.getMcwPreviewingWarId();
            if (warId != null) {
                MpwProxy.reqMpwCommonContinueWar(warId);
            }
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
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : McwWarPlayerInfoPage,
                    pageData    : { warId: null } as OpenDataForMcwWarPlayerInfoPage,
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
            this._labelLoading.text         = Lang.getText(LangTextType.A0040);
            this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0137);
            this._labelMyWar.text           = Lang.getText(LangTextType.B0588);
            this._labelChooseWar.text       = Lang.getText(LangTextType.B0589);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoWar.text           = Lang.getText(LangTextType.B0210);
            this._btnNextStep.label         = Lang.getText(LangTextType.B0024);
        }

        private _updateGroupWarList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoWar    = this._labelNoWar;
            const listWar       = this._listWar;
            if (!this._hasReceivedData) {
                labelLoading.visible    = true;
                labelNoWar.visible     = false;
                listWar.clear();

            } else {
                const dataArray         = this._createDataForListWar();
                labelLoading.visible    = false;
                labelNoWar.visible      = !dataArray.length;
                listWar.bindData(dataArray);

                const warId = MpwModel.getMcwPreviewingWarId();
                if (dataArray.every(v => v.warId != warId)) {
                    MpwModel.setMcwPreviewingWarId(dataArray.length ? dataArray[0].warId : undefined);
                }
            }
        }

        private _updateComponentsForPreviewingWarInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const warId         = MpwModel.getMcwPreviewingWarId();
            if ((!this._hasReceivedData) || (warId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;
                btnNextStep.setRedVisible(MpwModel.checkIsRedForMyWar(MpwModel.getMyWarInfo(warId)));

                const tab = this._tabSettings;
                tab.updatePageData(1, { warId } as OpenDataForMcwWarPlayerInfoPage);
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
                this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
            }
        }

        private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(3, await this._createDataForCommonWarAdvancedSettingsPage());
            }
        }

        private _createDataForListWar(): DataForWarRenderer[] {
            const dataArray: DataForWarRenderer[] = [];
            for (const warInfo of MpwModel.getMyMcwWarInfoArray()) {
                const warId = warInfo.warId;
                if (warId == null) {
                    Logger.error(`McwMyWarListPanel._createDataForListWar() empty warId.`);
                    continue;
                }
                dataArray.push({
                    warId,
                });
            }

            return dataArray.sort((v1, v2) => v1.warId - v2.warId);
        }

        private _createDataForCommonMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const mapId = MpwModel.getMyWarInfo(MpwModel.getMcwPreviewingWarId())?.settingsForMcw?.mapId;
            return mapId == null
                ? {}
                : { mapInfo: { mapId } };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await MpwModel.createDataForCommonWarBasicSettingsPage(MpwModel.getMcwPreviewingWarId());
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return await MpwModel.createDataForCommonWarAdvancedSettingsPage(MpwModel.getMcwPreviewingWarId());
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
                obj         : this._groupWarList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
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
                    obj         : this._groupWarList,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnNextStep,
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

    type DataForWarRenderer = {
        warId: number;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private readonly _btnChoose     : TwnsUiButton.UiButton;
        private readonly _btnNext       : TwnsUiButton.UiButton;
        private readonly _labelName     : TwnsUiLabel.UiLabel;
        private readonly _imgRed        : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.McwPreviewingWarIdChanged,  callback: this._onNotifyMcwPreviewingWarIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const warId     = this.data.warId;
            const warInfo   = MpwModel.getMyWarInfo(warId);
            const imgRed    = this._imgRed;
            const labelName = this._labelName;
            if (!warInfo) {
                imgRed.visible  = false;
                labelName.text  = ``;
            } else {
                imgRed.visible = MpwModel.checkIsRedForMyWar(warInfo);

                const settingsForMcw = warInfo.settingsForMcw;
                if (settingsForMcw == null) {
                    Logger.error(`McwMyWarListPanel.WarRenderer._onDataChanged() empty settingsForMcw.`);
                    labelName.text = ``;
                } else {
                    const warName = settingsForMcw.warName;
                    if (warName) {
                        labelName.text = warName;
                    } else {
                        const mapId = settingsForMcw.mapId;
                        if (mapId == null) {
                            Logger.error(`McwMyWarListPanel.WarRenderer._onDataChanged() empty mapId.`);
                            labelName.text = ``;
                        } else {
                            const mapName = await WarMapModel.getMapNameInCurrentLanguage(mapId);
                            if (mapName == null) {
                                Logger.error(`McwMyWarListPanel.WarRenderer._onDataChanged() empty mapName.`);
                                labelName.text = ``;
                            } else {
                                labelName.text = mapName;
                            }
                        }
                    }
                }
            }
        }

        private _onNotifyMcwPreviewingWarIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            MpwModel.setMcwPreviewingWarId(this.data.warId);
        }

        private _onTouchTapBtnNext(): void {
            MpwProxy.reqMpwCommonContinueWar(this.data.warId);
        }

        private _updateState(): void {
            this.currentState = this.data.warId === MpwModel.getMcwPreviewingWarId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsMcwMyWarListPanel;
