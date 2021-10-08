
import TwnsCommonBlockPanel         from "../../common/view/CommonBlockPanel";
import TwnsCommonWarMapInfoPage     from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarPlayerInfoPage  from "../../common/view/CommonWarPlayerInfoPage";
import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
import TwnsMcrMainMenuPanel         from "../../multiCustomRoom/view/McrMainMenuPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import FlowManager                  from "../../tools/helpers/FlowManager";
import Helpers                      from "../../tools/helpers/Helpers";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import TwnsUiTab                    from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer        from "../../tools/ui/UiTabItemRenderer";
import WarMapModel                  from "../../warMap/model/WarMapModel";
import RwModel                      from "../model/RwModel";
import RwProxy                      from "../model/RwProxy";
import TwnsRwReplayWarInfoPage      from "./RwReplayWarInfoPage";
import TwnsRwSearchReplayPanel      from "./RwSearchReplayPanel";

namespace TwnsRwReplayListPanel {
    import OpenDataForRwReplayWarInfoPage       = TwnsRwReplayWarInfoPage.OpenDataForRwReplayWarInfoPage;
    import OpenDataForCommonWarMapInfoPage      = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage   = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import RwReplayWarInfoPage                  = TwnsRwReplayWarInfoPage.RwReplayWarInfoPage;
    import RwSearchReplayPanel                  = TwnsRwSearchReplayPanel.RwSearchReplayPanel;
    import LangTextType                         = TwnsLangTextType.LangTextType;
    import NotifyType                           = TwnsNotifyType.NotifyType;
    import CommonBlockPanel                     = TwnsCommonBlockPanel.CommonBlockPanel;

    export class RwReplayListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RwReplayListPanel;

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

        public static show(): void {
            if (!RwReplayListPanel._instance) {
                RwReplayListPanel._instance = new RwReplayListPanel();
            }
            RwReplayListPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (RwReplayListPanel._instance) {
                await RwReplayListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/replayWar/RwReplayListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.RwPreviewingReplayIdChanged,    callback: this._onNotifyRwPreviewingReplayIdChanged },
                { type: NotifyType.MsgReplayGetInfoList,           callback: this._onNotifyMsgReplayGetInfoList },
                { type: NotifyType.MsgReplayGetData,               callback: this._onNotifyMsgReplayGetData },
                { type: NotifyType.MsgReplayGetDataFailed,         callback: this._onNotifyMsgReplayGetDataFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listReplay.setItemRenderer(ReplayRenderer);

            this._showOpenAnimation();

            this._hasReceivedData   = false;
            this._isTabInitialized  = false;
            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupReplayList();
            this._updateComponentsForPreviewingReplayInfo();

            RwProxy.reqReplayInfos(null);
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

        private _onNotifyMsgReplayGetData(): void {
            const data = Helpers.getExisted(RwModel.getReplayData());
            FlowManager.gotoReplayWar(Helpers.getExisted(data.encodedWar), Helpers.getExisted(data.replayId));
        }

        private _onNotifyMsgReplayGetDataFailed(): void {
            CommonBlockPanel.hide();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }
        private _onTouchedBtnSearch(): void {
            RwSearchReplayPanel.show();
        }
        private _onTouchedBtnNextStep(): void {
            const replayId = RwModel.getPreviewingReplayId();
            if (replayId != null) {
                CommonBlockPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0040),
                });
                RwProxy.reqReplayGetData(replayId);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _initTabSettings(): void {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonWarMapInfoPage.CommonWarMapInfoPage,
                    pageData    : this._createDataForCommonWarMapInfoPage(),
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

        private _updateCommonWarMapInfoPage(): void {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, this._createDataForCommonWarMapInfoPage());
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

        private _createDataForCommonWarMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const replayId  = RwModel.getPreviewingReplayId();
            const mapId     = replayId == null ? null : RwModel.getReplayInfo(replayId)?.replayBriefInfo?.mapId;
            return mapId == null
                ? {}
                : { mapInfo: { mapId } };
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

    type DataForReplayRenderer = {
        replayId: number;
    };
    class ReplayRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForReplayRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _btnNext!      : TwnsUiButton.UiButton;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;
        private readonly _labelId!      : TwnsUiLabel.UiLabel;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
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
                labelId.text    = `ID: ${replayBriefInfo.replayId}`;
                labelType.text  = Lang.getWarTypeName(Helpers.getExisted(replayBriefInfo.warType)) ?? CommonConstants.ErrorTextForUndefined;
                labelName.text  = await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(replayBriefInfo.mapId)) ?? CommonConstants.ErrorTextForUndefined;
            }
        }

        private _onTouchTapBtnChoose(): void {
            RwModel.setPreviewingReplayId(this._getData().replayId);
        }

        private _onTouchTapBtnNext(): void {
            CommonBlockPanel.show({
                title   : Lang.getText(LangTextType.B0088),
                content : Lang.getText(LangTextType.A0040),
            });
            RwProxy.reqReplayGetData(this._getData().replayId);
        }
    }
}

export default TwnsRwReplayListPanel;
