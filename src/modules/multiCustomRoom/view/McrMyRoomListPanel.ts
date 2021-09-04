
import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import McrModel                             from "../../multiCustomRoom/model/McrModel";
import McrProxy                             from "../../multiCustomRoom/model/McrProxy";
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
import McrJoinModel                         from "../model/McrJoinModel";
import TwnsMcrMainMenuPanel                 from "./McrMainMenuPanel";
import TwnsMcrRoomInfoPanel                 from "./McrRoomInfoPanel";
import CommonConstants                      from "../../tools/helpers/CommonConstants";

namespace TwnsMcrMyRoomListPanel {
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class McrMyRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMyRoomListPanel;

        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelMultiPlayer!     : TwnsUiLabel.UiLabel;
        private readonly _labelMyRoom!          : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupRoomList!        : eui.Group;
        private readonly _listRoom!             : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom!          : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;
        private _isTabInitialized   = false;

        public static show(): void {
            if (!McrMyRoomListPanel._instance) {
                McrMyRoomListPanel._instance = new McrMyRoomListPanel();
            }
            McrMyRoomListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McrMyRoomListPanel._instance) {
                await McrMyRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrMyRoomListPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.McrJoinedPreviewingRoomIdChanged,    callback: this._onNotifyMcrJoinedPreviewingRoomIdChanged },
                { type: NotifyType.MsgMcrGetJoinedRoomInfoList,         callback: this._onNotifyMsgMcrGetJoinedRoomInfoList },
                { type: NotifyType.MsgMcrCreateRoom,                    callback: this._onNotifyMsgCreateRoom },
                { type: NotifyType.MsgMcrDeleteRoomByServer,            callback: this._onNotifyMsgMcrDeleteRoomByServer },
                { type: NotifyType.MsgMcrJoinRoom,                      callback: this._onNotifyMsgMcrJoinRoom },
                { type: NotifyType.MsgMcrDeletePlayer,                  callback: this._onNotifyMsgMcrDeletePlayer },
                { type: NotifyType.MsgMcrExitRoom,                      callback: this._onNotifyMsgMcrExitRoom },
                { type: NotifyType.MsgMcrGetRoomInfo,                   callback: this._onNotifyMsgMcrGetRoomInfo },
                { type: NotifyType.MsgMcrSetSelfSettings,               callback: this._onNotifyMsgMcrSetSelfSettings },
                { type: NotifyType.MsgMcrSetReady,                      callback: this._onNotifyMsgMcrSetReady },
                { type: NotifyType.MsgMcrGetOwnerPlayerIndex,           callback: this._onNotifyMsgMcrGetOwnerPlayerIndex },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listRoom.setItemRenderer(RoomRenderer);

            this._showOpenAnimation();

            this._hasReceivedData   = false;
            this._isTabInitialized  = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupRoomList();
            this._updateComponentsForPreviewingRoomInfo();

            McrProxy.reqMcrGetJoinedRoomInfoList();
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

        private _onNotifyMcrJoinedPreviewingRoomIdChanged(): void {
            this._updateComponentsForPreviewingRoomInfo();
        }

        private _onNotifyMsgMcrGetJoinedRoomInfoList(): void {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForPreviewingRoomInfo();
        }

        private _onNotifyMsgCreateRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrDeleteRoomByServer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrJoinRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrJoinRoom.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrExitRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrExitRoom.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateComponentsForPreviewingRoomInfo();
            }
        }

        private _onNotifyMsgMcrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMcrSetReady(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrSetReady.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMcrGetOwnerPlayerIndex(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrGetOwnerPlayerIndex.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private _onTouchedBtnNextStep(): void {
            const roomId = McrJoinModel.getJoinedPreviewingRoomId();
            if (roomId != null) {
                this.close();
                TwnsMcrRoomInfoPanel.McrRoomInfoPanel.show({
                    roomId,
                });
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
            this._labelMyRoom.text          = Lang.getText(LangTextType.B0410);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoRoom.text          = Lang.getText(LangTextType.B0582);
            this._btnNextStep.label         = Lang.getText(LangTextType.B0398);
        }

        private _updateGroupRoomList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoRoom   = this._labelNoRoom;
            const listRoom      = this._listRoom;
            if (!this._hasReceivedData) {
                labelLoading.visible    = true;
                labelNoRoom.visible     = false;
                listRoom.clear();

            } else {
                const dataArray         = this._createDataForListRoom();
                labelLoading.visible    = false;
                labelNoRoom.visible     = !dataArray.length;
                listRoom.bindData(dataArray);

                const roomId = McrJoinModel.getJoinedPreviewingRoomId();
                if (dataArray.every(v => v.roomId != roomId)) {
                    McrJoinModel.setJoinedPreviewingRoomId(dataArray.length ? dataArray[0].roomId : null);
                }
            }
        }

        private _updateComponentsForPreviewingRoomInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = McrJoinModel.getJoinedPreviewingRoomId();
            if ((!this._hasReceivedData) || (roomId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

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

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const roomId = McrJoinModel.getJoinedPreviewingRoomId();
            const mapId = roomId == null ? null : (await McrModel.getRoomInfo(roomId))?.settingsForMcw?.mapId;
            return mapId == null
                ? null
                : { mapInfo : { mapId, }, };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return await McrModel.createDataForCommonWarPlayerInfoPage(McrJoinModel.getJoinedPreviewingRoomId());
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await McrModel.createDataForCommonWarBasicSettingsPage(McrJoinModel.getJoinedPreviewingRoomId(), true);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return await McrModel.createDataForCommonWarAdvancedSettingsPage(McrJoinModel.getJoinedPreviewingRoomId());
        }

        private _createDataForListRoom(): DataForRoomRenderer[] {
            const dataArray: DataForRoomRenderer[] = [];
            for (const roomId of McrModel.getJoinedRoomIdSet()) {
                dataArray.push({
                    roomId,
                });
            }

            return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
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
                obj         : this._groupRoomList,
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
                    obj         : this._groupRoomList,
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

    type DataForRoomRenderer = {
        roomId: number;
    };
    class RoomRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _btnNext!      : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgRed!       : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.McrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMcrJoinedPreviewingRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomId            = this._getData().roomId;
            this._imgRed.visible    = await McrModel.checkIsRedForRoom(roomId);

            const settingsForMcw    = Helpers.getExisted((await McrModel.getRoomInfo(roomId))?.settingsForMcw);
            const warName           = settingsForMcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForMcw.mapId)).then(v => this._labelName.text = v || CommonConstants.ErrorTextForUndefined);
            }
        }

        private _onNotifyMcrJoinedPreviewingRoomIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            McrJoinModel.setJoinedPreviewingRoomId(this._getData().roomId);
        }

        private _onTouchTapBtnNext(): void {
            McrMyRoomListPanel.hide();
            TwnsMcrRoomInfoPanel.McrRoomInfoPanel.show({
                roomId  : this._getData().roomId,
            });
        }

        private _updateState(): void {
            this.currentState = this._getData().roomId === McrJoinModel.getJoinedPreviewingRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsMcrMyRoomListPanel;
