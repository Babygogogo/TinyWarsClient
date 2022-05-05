
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
// import Twns.Notify               from "../../tools/notify/NotifyType";
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
namespace Twns.ReplayWar {
    import OpenDataForRwReplayWarInfoPage       = Twns.ReplayWar.OpenDataForRwReplayWarInfoPage;
    import OpenDataForCommonWarMapInfoPage      = Twns.Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage   = Twns.Common.OpenDataForCommonWarPlayerInfoPage;
    import RwReplayWarInfoPage                  = Twns.ReplayWar.RwReplayWarInfoPage;
    import LangTextType                         = Twns.Lang.LangTextType;
    import NotifyType                           = Twns.Notify.NotifyType;

    export type OpenDataForRwReplayListPanel = void;
    export class RwReplayListPanel extends TwnsUiPanel.UiPanel<OpenDataForRwReplayListPanel> {
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
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.RwPreviewingReplayIdChanged,     callback: this._onNotifyRwPreviewingReplayIdChanged },
                { type: NotifyType.MsgReplayGetReplayIdArray,       callback: this._onNotifyMsgReplayGetReplayIdArray },
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

            Twns.ReplayWar.RwProxy.reqReplayGetReplayIdArray(null);
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

        private _onNotifyMsgReplayGetReplayIdArray(): void {
            this._hasReceivedData = true;

            const replayId      = Twns.ReplayWar.RwModel.getPreviewingReplayId();
            const replayIdArray = Twns.ReplayWar.RwModel.getReplayIdArray() || [];
            if (replayIdArray.every(v => v !== replayId)) {
                Twns.ReplayWar.RwModel.setPreviewingReplayId(replayIdArray[0] ?? null);
            } else {
                this._updateGroupReplayList();
                this._updateComponentsForPreviewingReplayInfo();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.McrMainMenuPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyTopPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyBottomPanel, void 0);
        }
        private _onTouchedBtnSearch(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.RwSearchReplayPanel, void 0);
        }
        private async _onTouchedBtnNextStep(): Promise<void> {
            const replayId = Twns.ReplayWar.RwModel.getPreviewingReplayId();
            if (replayId != null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonBlockPanel, {
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0040),
                });

                const data = await Twns.ReplayWar.RwModel.getReplayData(replayId);
                if (data) {
                    Twns.FlowManager.gotoReplayWar(data, Twns.Helpers.getExisted(replayId));
                } else {
                    Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.CommonBlockPanel);
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
                const replayId          = Twns.ReplayWar.RwModel.getPreviewingReplayId();
                labelLoading.visible    = false;
                labelNoReplay.visible   = !dataArray.length;
                listReplay.bindData(dataArray);
                listReplay.setSelectedIndex(dataArray.findIndex(v => v.replayId === replayId));
            }
        }

        private _updateComponentsForPreviewingReplayInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const replayId      = Twns.ReplayWar.RwModel.getPreviewingReplayId();
            if ((!this._hasReceivedData) || (replayId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                this._updateCommonWarMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
                this._updateRwReplayWarInfoPage();
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

        private _updateRwReplayWarInfoPage(): void {
            if (this._isTabInitialized) {
                const replayId = Twns.ReplayWar.RwModel.getPreviewingReplayId();
                this._tabSettings.updatePageData(2, (replayId == null ? null : { replayId }) as OpenDataForRwReplayWarInfoPage);
            }
        }

        private _createDataForListReplay(): DataForReplayRenderer[] {
            const dataArray: DataForReplayRenderer[] = [];
            for (const replayId of Twns.ReplayWar.RwModel.getReplayIdArray() || []) {
                dataArray.push({
                    replayId,
                });
            }

            return dataArray.sort((v1, v2) => v2.replayId - v1.replayId);
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const replayId = Twns.ReplayWar.RwModel.getPreviewingReplayId();
            if (replayId == null) {
                return null;
            }

            const replayInfo    = Twns.Helpers.getExisted(await Twns.ReplayWar.RwModel.getReplayInfo(replayId));
            const mapId         = replayInfo.mapId;
            const gameConfig    = await Twns.Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(replayInfo.configVersion));
            if (mapId != null) {
                return {
                    gameConfig,
                    mapInfo     : { mapId },
                };
            } else {
                const replayData = (await Twns.ReplayWar.RwModel.getReplayData(replayId))?.settingsForMfw?.initialWarData;
                return replayData == null
                    ? null
                    : {
                        gameConfig,
                        warInfo     : {
                            warData : replayData,
                            players : replayData.playerManager?.players
                        }
                    };
            }
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            const replayId = Twns.ReplayWar.RwModel.getPreviewingReplayId();
            if (replayId == null) {
                return null;
            }

            const replayBriefInfo = await Twns.ReplayWar.RwModel.getReplayInfo(replayId);
            if (replayBriefInfo == null) {
                return null;
            }

            const playerInfoArray: Twns.Common.PlayerInfo[] = [];
            for (const playerInfo of replayBriefInfo.playerInfoList || []) {
                const userId = playerInfo.userId ?? null;
                playerInfoArray.push({
                    playerIndex         : Twns.Helpers.getExisted(playerInfo.playerIndex),
                    teamIndex           : Twns.Helpers.getExisted(playerInfo.teamIndex),
                    isAi                : userId == null,
                    userId,
                    coId                : Twns.Helpers.getExisted(playerInfo.coId),
                    unitAndTileSkinId   : Twns.Helpers.getExisted(playerInfo.unitAndTileSkinId),
                    isReady             : null,
                    isInTurn            : null,
                    isDefeat            : !playerInfo.isAlive,
                    restTimeToBoot      : playerInfo.restTimeToBoot ?? null,
                });
            }

            return {
                gameConfig              : await Twns.Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(replayBriefInfo.configVersion)),
                playersCountUnneutral   : playerInfoArray.length,
                roomOwnerPlayerIndex    : null,
                callbackOnExitRoom      : null,
                callbackOnDeletePlayer  : null,
                playerInfoArray,
                enterTurnTime           : null,
            };
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
                obj         : this._btnSearch,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupReplayList,
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

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
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
                obj         : this._btnSearch,
                beginProps  : { alpha: 1, y: 80 },
                endProps    : { alpha: 0, y: 40 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupReplayList,
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

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
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
            this._setShortSfxCode(Twns.Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const replayBriefInfo   = await Twns.ReplayWar.RwModel.getReplayInfo(this._getData().replayId);
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
                labelType.text  = Lang.getWarTypeName(Twns.Helpers.getExisted(replayBriefInfo.warType)) ?? Twns.CommonConstants.ErrorTextForUndefined;
                labelName.text  = mapId == null
                    ? `----`
                    : await Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId) ?? Twns.CommonConstants.ErrorTextForUndefined;
            }
        }

        private _onTouchTapBtnChoose(): void {
            Twns.ReplayWar.RwModel.setPreviewingReplayId(this._getData().replayId);
        }
    }
}

// export default TwnsRwReplayListPanel;
