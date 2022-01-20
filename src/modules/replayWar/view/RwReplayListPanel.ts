
// import TwnsCommonBlockPanel         from "../../common/view/CommonBlockPanel";
// import TwnsCommonWarMapInfoPage     from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage  from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import TwnsMcrMainMenuPanel         from "../../multiCustomRoom/view/McrMainMenuPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import FlowManager                  from "../../tools/helpers/FlowManager";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsUiTab                    from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer        from "../../tools/ui/UiTabItemRenderer";
// import WarMapModel                  from "../../warMap/model/WarMapModel";
// import RwModel                      from "../model/RwModel";
// import RwProxy                      from "../model/RwProxy";
// import TwnsRwReplayWarInfoPage      from "./RwReplayWarInfoPage";
// import TwnsRwSearchReplayPanel      from "./RwSearchReplayPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsRwReplayListPanel {
    import OpenDataForRwReplayWarInfoPage       = TwnsRwReplayWarInfoPage.OpenDataForRwReplayWarInfoPage;
    import OpenDataForCommonWarMapInfoPage      = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage   = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import RwReplayWarInfoPage                  = TwnsRwReplayWarInfoPage.RwReplayWarInfoPage;
    import LangTextType                         = TwnsLangTextType.LangTextType;
    import NotifyType                           = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class RwReplayListPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForRwReplayWarInfoPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelReplay!          : TwnsUiLabel.UiLabel;
        private readonly _labelChooseReplay!    : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;
        private readonly _btnSearch!            : TwnsUiButton.UiButton;

        private readonly _groupReplayList!      : eui.Group;
        private readonly _listReplay!           : TwnsUiScrollList.UiScrollList<DataForReplayRenderer>;
        private readonly _labelNoReplay!        : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;
        private _isTabInitialized   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.RwPreviewingReplayIdChanged,    callback: this._onNotifyRwPreviewingReplayIdChanged },
                { type: NotifyType.MsgReplayGetInfoList,           callback: this._onNotifyMsgReplayGetInfoList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listReplay.setItemRenderer(ReplayRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._hasReceivedData   = false;
            this._isTabInitialized  = false;
            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupReplayList();
            this._updateComponentsForPreviewingReplayInfo();

            RwProxy.reqReplayInfos(null);
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

        private _onNotifyRwPreviewingReplayIdChanged(): void {
            this._updateGroupReplayList();
            this._updateComponentsForPreviewingReplayInfo();
        }

        private _onNotifyMsgReplayGetInfoList(): void {
            this._hasReceivedData = true;

            const replayId          = RwModel.getPreviewingReplayId();
            const replayInfoArray   = RwModel.getReplayInfoList() || [];
            if (replayInfoArray.every(v => v.replayBriefInfo?.replayId !== replayId)) {
                RwModel.setPreviewingReplayId(replayInfoArray[0]?.replayBriefInfo?.replayId ?? null);
            } else {
                this._updateGroupReplayList();
                this._updateComponentsForPreviewingReplayInfo();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrMainMenuPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }
        private _onTouchedBtnSearch(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.RwSearchReplayPanel, void 0);
        }
        private async _onTouchedBtnNextStep(): Promise<void> {
            const replayId = RwModel.getPreviewingReplayId();
            if (replayId != null) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonBlockPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0040),
                });

                const data = await RwModel.getReplayData(replayId);
                if (data) {
                    FlowManager.gotoReplayWar(data, Helpers.getExisted(replayId));
                } else {
                    TwnsPanelManager.close(TwnsPanelConfig.Dict.CommonBlockPanel);
                }
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
                    pageData    : this._createDataForCommonWarPlayerInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : RwReplayWarInfoPage,
                    pageData    : null,
                },
            ]);
            this._isTabInitialized = true;
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(LangTextType.A0040);
            this._labelReplay.text          = Lang.getText(LangTextType.B0092);
            this._labelChooseReplay.text    = Lang.getText(LangTextType.B0598);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoReplay.text        = Lang.getText(LangTextType.B0241);
            this._btnNextStep.label         = Lang.getText(LangTextType.B0024);
            this._btnSearch.label           = Lang.getText(LangTextType.B0228);
        }

        private _updateGroupReplayList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoReplay = this._labelNoReplay;
            const listReplay    = this._listReplay;
            if (!this._hasReceivedData) {
                labelLoading.visible    = true;
                labelNoReplay.visible   = false;
                listReplay.clear();

            } else {
                const dataArray         = this._createDataForListReplay();
                const replayId          = RwModel.getPreviewingReplayId();
                labelLoading.visible    = false;
                labelNoReplay.visible   = !dataArray.length;
                listReplay.bindData(dataArray);
                listReplay.setSelectedIndex(dataArray.findIndex(v => v.replayId === replayId));
            }
        }

        private _updateComponentsForPreviewingReplayInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const replayId      = RwModel.getPreviewingReplayId();
            if ((!this._hasReceivedData) || (replayId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                const tab = this._tabSettings;
                tab.updatePageData(2, { replayId } as OpenDataForRwReplayWarInfoPage);
                this._updateCommonWarMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private async _updateCommonWarMapInfoPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonWarMapInfoPage());
            }
        }

        private _updateCommonWarPlayerInfoPage(): void {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(1, this._createDataForCommonWarPlayerInfoPage());
            }
        }

        private _createDataForListReplay(): DataForReplayRenderer[] {
            const dataArray: DataForReplayRenderer[] = [];
            for (const replayInfo of RwModel.getReplayInfoList() || []) {
                dataArray.push({
                    replayId: Helpers.getExisted(replayInfo.replayBriefInfo?.replayId),
                });
            }

            return dataArray.sort((v1, v2) => v2.replayId - v1.replayId);
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const replayId = RwModel.getPreviewingReplayId();
            if (replayId == null) {
                return {};
            }

            const mapId = RwModel.getReplayInfo(replayId)?.replayBriefInfo?.mapId;
            if (mapId != null) {
                return { mapInfo: { mapId } };
            } else {
                const replayData = (await RwModel.getReplayData(replayId))?.settingsForMfw?.initialWarData;
                return replayData == null
                    ? {}
                    : { warInfo: {
                        warData : replayData,
                        players : replayData.playerManager?.players
                    } };
            }
        }

        private _createDataForCommonWarPlayerInfoPage(): OpenDataForCommonWarPlayerInfoPage {
            const replayId = RwModel.getPreviewingReplayId();
            if (replayId == null) {
                return null;
            }

            const replayInfo = RwModel.getReplayInfo(replayId);
            if (replayInfo == null) {
                return null;
            }

            const replayBriefInfo   = Helpers.getExisted(replayInfo.replayBriefInfo);
            const playerInfoArray   : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
            for (const playerInfo of replayBriefInfo.playerInfoList || []) {
                const userId = playerInfo.userId ?? null;
                playerInfoArray.push({
                    playerIndex         : Helpers.getExisted(playerInfo.playerIndex),
                    teamIndex           : Helpers.getExisted(playerInfo.teamIndex),
                    isAi                : userId == null,
                    userId,
                    coId                : Helpers.getExisted(playerInfo.coId),
                    unitAndTileSkinId   : Helpers.getExisted(playerInfo.unitAndTileSkinId),
                    isReady             : null,
                    isInTurn            : null,
                    isDefeat            : !playerInfo.isAlive,
                });
            }

            return {
                configVersion           : Helpers.getExisted(replayBriefInfo.configVersion),
                playersCountUnneutral   : playerInfoArray.length,
                roomOwnerPlayerIndex    : null,
                callbackOnExitRoom      : null,
                callbackOnDeletePlayer  : null,
                playerInfoArray,
            };
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
                obj         : this._btnSearch,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Helpers.resetTween({
                obj         : this._groupReplayList,
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
                obj         : this._btnSearch,
                beginProps  : { alpha: 1, y: 80 },
                endProps    : { alpha: 0, y: 40 },
            });
            Helpers.resetTween({
                obj         : this._groupReplayList,
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

    type DataForReplayRenderer = {
        replayId: number;
    };
    class ReplayRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForReplayRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;
        private readonly _labelId!      : TwnsUiLabel.UiLabel;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const replayInfo        = RwModel.getReplayInfo(this._getData().replayId);
            const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
            const labelId           = this._labelId;
            const labelType         = this._labelType;
            const labelName         = this._labelName;
            if (replayBriefInfo == null) {
                labelId.text    = ``;
                labelType.text  = ``;
                labelName.text  = ``;
            } else {
                const mapId     = replayBriefInfo.mapId;
                labelId.text    = `ID: ${replayBriefInfo.replayId}`;
                labelType.text  = Lang.getWarTypeName(Helpers.getExisted(replayBriefInfo.warType)) ?? CommonConstants.ErrorTextForUndefined;
                labelName.text  = mapId == null
                    ? `----`
                    : await WarMapModel.getMapNameInCurrentLanguage(mapId) ?? CommonConstants.ErrorTextForUndefined;
            }
        }

        private _onTouchTapBtnChoose(): void {
            RwModel.setPreviewingReplayId(this._getData().replayId);
        }
    }
}

// export default TwnsRwReplayListPanel;
