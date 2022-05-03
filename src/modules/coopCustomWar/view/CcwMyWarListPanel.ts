
// import TwnsCommonBlockPanel                 from "../../common/view/CommonBlockPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsCcrMainMenuPanel                 from "../../coopCustomRoom/view/CcrMainMenuPanel";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import MpwModel                             from "../../multiPlayerWar/model/MpwModel";
// import MpwProxy                             from "../../multiPlayerWar/model/MpwProxy";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import Twns.Notify                       from "../../tools/notify/NotifyType";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarMapModel                          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CoopCustomWar {
    import OpenDataForCommonWarMapInfoPage          = Twns.Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = Twns.Common.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Twns.Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = Twns.Common.OpenDataForCommonWarBasicSettingsPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = Twns.Notify.NotifyType;
    import MpwModel                                 = MultiPlayerWar.MpwModel;

    export type OpenDataForCcwMyWarListPanel = void;
    export class CcwMyWarListPanel extends TwnsUiPanel.UiPanel<OpenDataForCcwMyWarListPanel> {
        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelMultiPlayer!     : TwnsUiLabel.UiLabel;
        private readonly _labelMyWar!           : TwnsUiLabel.UiLabel;
        private readonly _labelChooseWar!       : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupWarList!         : eui.Group;
        private readonly _listWar!              : TwnsUiScrollList.UiScrollList<DataForWarRenderer>;
        private readonly _labelNoWar!           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _isTabInitialized   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
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
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setAndReviseSelectedWarId(newWarId: number, needScroll: boolean): void {
            const listWar   = this._listWar;
            const index     = Twns.Helpers.getExisted(listWar.getRandomIndex(v => v.warId === newWarId));
            listWar.setSelectedIndex(index);
            this._updateComponentsForPreviewingWarInfo();

            if (needScroll) {
                listWar.scrollVerticalToIndex(index);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrMainMenuPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyTopPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyBottomPanel, void 0);
        }

        private _onTouchedBtnNextStep(): void {
            const warId = this._listWar.getSelectedData()?.warId;
            if (warId != null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonBlockPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0040),
                });
                MultiPlayerWar.MpwProxy.reqMpwCommonContinueWar(warId);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initTabSettings(): Promise<void> {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : Twns.Common.CommonWarMapInfoPage,
                    pageData    : await this._createDataForCommonWarMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : Twns.Common.CommonWarPlayerInfoPage,
                    pageData    : await this._createDataForCommonWarPlayerInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : Twns.Common.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : Twns.Common.CommonWarAdvancedSettingsPage,
                    pageData    : await this._createDataForCommonWarAdvancedSettingsPage(),
                },
            ]);
            this._isTabInitialized = true;
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(LangTextType.A0040);
            this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0646);
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

            this.setAndReviseSelectedWarId(dataArray[0]?.warId, true);
        }

        private async _updateComponentsForPreviewingWarInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const warId         = this._listWar.getSelectedData()?.warId;
            if (warId == null) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;
                btnNextStep.setRedVisible(MpwModel.checkIsRedForMyWar(await MpwModel.getWarProgressInfo(warId)));

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
            for (const warId of await MpwModel.getMyCcwWarIdArray()) {
                dataArray.push({
                    warId,
                    panel   : this,
                });
            }

            return dataArray.sort((v1, v2) => v1.warId - v2.warId);
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const warId         = this._listWar.getSelectedData()?.warId;
            const warSettings   = warId == null ? null : await MpwModel.getWarSettings(warId);
            const mapId         = warSettings?.settingsForCcw?.mapId;
            return mapId == null
                ? null
                : {
                    gameConfig  : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(warSettings?.settingsForCommon?.configVersion)),
                    mapInfo     : { mapId },
                };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return await MpwModel.createDataForCommonWarPlayerInfoPage(this._listWar.getSelectedData()?.warId ?? null);
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await MpwModel.createDataForCommonWarBasicSettingsPage(this._listWar.getSelectedData()?.warId ?? null);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return await MpwModel.createDataForCommonWarAdvancedSettingsPage(this._listWar.getSelectedData()?.warId ?? null);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
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
        warId   : number;
        panel   : CcwMyWarListPanel;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private readonly _labelWarId!           : TwnsUiLabel.UiLabel;
        private readonly _labelRestTimeToBoot!  : TwnsUiLabel.UiLabel;
        private readonly _labelName!            : TwnsUiLabel.UiLabel;
        private readonly _imgRed!               : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TimeTick,                    callback: this._onNotifyTimeTick },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateImgRed();
            this._updateLabelRestTimeToBoot();

            const warId             = this._getData().warId;
            this._labelWarId.text   = `#${warId}`;

            const warSettings       = await MpwModel.getWarSettings(warId);
            const labelName         = this._labelName;
            if (warSettings == null) {
                labelName.text  = ``;
            } else {
                const settingsForCcw    = Twns.Helpers.getExisted(warSettings.settingsForCcw);
                const warName           = settingsForCcw.warName;
                if (warName) {
                    labelName.text = warName;
                } else {
                    const mapId     = Twns.Helpers.getExisted(settingsForCcw.mapId);
                    const mapName   = Twns.Helpers.getExisted(await Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId));
                    labelName.text  = mapName;
                }
            }
        }

        private _onNotifyTimeTick(): void {
            this._updateLabelRestTimeToBoot();
        }
        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedWarId(data.warId, false);
        }

        private async _updateImgRed(): Promise<void> {
            const warProgressInfo   = await MpwModel.getWarProgressInfo(this._getData().warId);
            this._imgRed.visible    = MpwModel.checkIsRedForMyWar(warProgressInfo);
        }

        private async _updateLabelRestTimeToBoot(): Promise<void> {
            const warId             = this._getData().warId;
            const warSettings       = await MpwModel.getWarSettings(warId);
            const warProgressInfo   = await MpwModel.getWarProgressInfo(warId);
            const userId            = Twns.User.UserModel.getSelfUserId();
            const label             = this._labelRestTimeToBoot;
            if ((warSettings == null)       ||
                (warProgressInfo == null)   ||
                (userId == null)            ||
                (warProgressInfo.isEnded)
            ) {
                label.text = ``;
                return;
            }

            const playerIndexInTurn = Twns.Helpers.getExisted(warProgressInfo.playerIndexInTurn);
            const playerInfo        = warProgressInfo.playerInfoList?.find(v => v.playerIndex === playerIndexInTurn);
            if (playerInfo?.userId !== userId) {
                label.text = ``;
                return;
            }

            const enterTurnTime     = warProgressInfo.enterTurnTime;
            const restTimeToBoot    = playerInfo.restTimeToBoot;
            const restTime          = (restTimeToBoot == null) || (enterTurnTime == null)
                ? null
                : Math.max(0, restTimeToBoot + enterTurnTime - Twns.Timer.getServerTimestamp());
            if (restTime == null) {
                label.text      = ``;
            } else {
                label.text      = Twns.Helpers.getTimeDurationText2(restTime);
                label.textColor = restTime >= 30 * 60
                    ? 0xFFFFFF
                    : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400);
            }
        }
    }
}

// export default TwnsCcwMyWarListPanel;
