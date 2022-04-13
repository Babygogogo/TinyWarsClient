
// import TwnsCommonBlockPanel                 from "../../common/view/CommonBlockPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import MpwModel                             from "../../multiPlayerWar/model/MpwModel";
// import MpwProxy                             from "../../multiPlayerWar/model/MpwProxy";
// import TwnsMrrMainMenuPanel                 from "../../multiRankRoom/view/MrrMainMenuPanel";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarMapModel                          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMrwMyWarListPanel {
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class MrwMyWarListPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupTab!         : eui.Group;
        private readonly _tabSettings!      : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage>;

        private readonly _groupNavigator!   : eui.Group;
        private readonly _labelMultiPlayer! : TwnsUiLabel.UiLabel;
        private readonly _labelMyWar!       : TwnsUiLabel.UiLabel;
        private readonly _labelChooseWar!   : TwnsUiLabel.UiLabel;

        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnNextStep!      : TwnsUiButton.UiButton;

        private readonly _groupWarList!     : eui.Group;
        private readonly _listWar!          : TwnsUiScrollList.UiScrollList<DataForWarRenderer>;
        private readonly _labelNoWar!       : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!     : TwnsUiLabel.UiLabel;

        private _isTabInitialized   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MrwPreviewingWarIdChanged,   callback: this._onNotifyMrwPreviewingWarIdChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listWar.setItemRenderer(WarRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._isTabInitialized  = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMrwPreviewingWarIdChanged(): void {
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrrMainMenuPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }

        private _onTouchedBtnNextStep(): void {
            const warId = Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId();
            if (warId != null) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonBlockPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0040),
                });
                Twns.MultiPlayerWar.MpwProxy.reqMpwCommonContinueWar(warId);
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
                    pageData    : await this._createDataForCommonWarMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : TwnsCommonWarPlayerInfoPage.CommonWarPlayerInfoPage,
                    pageData    : await this._createDataForCommonWarPlayerInfoPage(),
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

        private async _updateGroupWarList(): Promise<void> {
            const labelLoading      = this._labelLoading;
            const labelNoWar        = this._labelNoWar;
            const listWar           = this._listWar;
            const dataArray         = await this._createDataForListWar();
            labelLoading.visible    = false;
            labelNoWar.visible      = !dataArray.length;
            listWar.bindData(dataArray);

            const warId = Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId();
            if (dataArray.every(v => v.warId != warId)) {
                Twns.MultiPlayerWar.MpwModel.setMrwPreviewingWarId(dataArray.length ? dataArray[0].warId : null);
            }
        }

        private async _updateComponentsForPreviewingWarInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const warId         = Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId();
            if (warId == null) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;
                btnNextStep.setRedVisible(Twns.MultiPlayerWar.MpwModel.checkIsRedForMyWar(await Twns.MultiPlayerWar.MpwModel.getWarProgressInfo(warId)));

                this._updateCommonWarMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private async _updateCommonWarMapInfoPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            }
        }

        private async _updateCommonWarPlayerInfoPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(1, await this._createDataForCommonWarPlayerInfoPage());
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

        private async _createDataForListWar(): Promise<DataForWarRenderer[]> {
            const dataArray: DataForWarRenderer[] = [];
            for (const warId of await Twns.MultiPlayerWar.MpwModel.getMyMrwWarIdArray()) {
                dataArray.push({
                    warId,
                });
            }

            return dataArray.sort((v1, v2) => v1.warId - v2.warId);
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const warId         = Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId();
            const warSettings   = warId == null ? null : await Twns.MultiPlayerWar.MpwModel.getWarSettings(warId);
            const mapId         = warSettings?.settingsForMrw?.mapId;
            return mapId == null
                ? null
                : {
                    gameConfig  : await Twns.Config.ConfigManager.getGameConfig(Helpers.getExisted(warSettings?.settingsForCommon?.configVersion)),
                    mapInfo     : { mapId },
                };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return await Twns.MultiPlayerWar.MpwModel.createDataForCommonWarPlayerInfoPage(Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId());
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await Twns.MultiPlayerWar.MpwModel.createDataForCommonWarBasicSettingsPage(Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId());
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return await Twns.MultiPlayerWar.MpwModel.createDataForCommonWarAdvancedSettingsPage(Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId());
        }

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
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

    type DataForWarRenderer = {
        warId: number;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgRed!       : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MrwPreviewingWarIdChanged,  callback: this._onNotifyMrwPreviewingWarIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const warId             = this._getData().warId;
            const warProgressInfo   = await Twns.MultiPlayerWar.MpwModel.getWarProgressInfo(warId);
            const warSettings       = await Twns.MultiPlayerWar.MpwModel.getWarSettings(warId);
            const imgRed            = this._imgRed;
            const labelName         = this._labelName;
            if ((warProgressInfo == null) || (warSettings == null)) {
                imgRed.visible  = false;
                labelName.text  = ``;
            } else {
                imgRed.visible  = Twns.MultiPlayerWar.MpwModel.checkIsRedForMyWar(warProgressInfo);
                labelName.text  = await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(warSettings.settingsForMrw?.mapId)) || CommonConstants.ErrorTextForUndefined;
            }
        }

        private _onNotifyMrwPreviewingWarIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            Twns.MultiPlayerWar.MpwModel.setMrwPreviewingWarId(this._getData().warId);
        }

        private _updateState(): void {
            this.currentState = this._getData().warId === Twns.MultiPlayerWar.MpwModel.getMrwPreviewingWarId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

// export default TwnsMrwMyWarListPanel;
