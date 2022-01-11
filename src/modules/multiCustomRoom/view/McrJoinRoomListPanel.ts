
// import TwnsCommonJoinRoomPasswordPanel      from "../../common/view/CommonJoinRoomPasswordPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import McrModel                             from "../../multiCustomRoom/model/McrModel";
// import McrProxy                             from "../../multiCustomRoom/model/McrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import FloatText                            from "../../tools/helpers/FloatText";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import UserModel                            from "../../user/model/UserModel";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import McrJoinModel                         from "../model/McrJoinModel";
// import TwnsMcrMainMenuPanel                 from "./McrMainMenuPanel";
// import TwnsMcrRoomInfoPanel                 from "./McrRoomInfoPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMcrJoinRoomListPanel {
    import OpenDataForWarCommonMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class McrJoinRoomListPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForWarCommonMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelMultiPlayer!     : TwnsUiLabel.UiLabel;
        private readonly _labelJoinRoom!        : TwnsUiLabel.UiLabel;
        private readonly _labelChooseRoom!      : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;
        private readonly _btnSearch!            : TwnsUiButton.UiButton;

        private readonly _groupRoomList!        : eui.Group;
        private readonly _listRoom!             : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom!          : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;
        private _isTabInitialized   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.McrJoinTargetRoomIdChanged,      callback: this._onNotifyMcrJoinTargetRoomIdChanged },
                { type: NotifyType.MsgMcrGetJoinableRoomInfoList,   callback: this._onMsgMcrGetJoinableRoomInfoList },
                { type: NotifyType.MsgMcrDeleteRoomByServer,        callback: this._onNotifyMsgMcrDeleteRoomByServer },
                { type: NotifyType.MsgMcrJoinRoom,                  callback: this._onNotifyMsgMcrJoinRoom },
                { type: NotifyType.MsgMcrDeletePlayer,              callback: this._onNotifyMsgMcrDeletePlayer },
                { type: NotifyType.MsgMcrExitRoom,                  callback: this._onNotifyMsgMcrExitRoom },
                { type: NotifyType.MsgMcrGetRoomInfo,               callback: this._onNotifyMsgMcrGetRoomInfo },
                { type: NotifyType.MsgMcrSetSelfSettings,           callback: this._onNotifyMsgMcrSetSelfSettings },
                { type: NotifyType.MsgMcrSetReady,                  callback: this._onNotifyMsgMcrSetReady },
                { type: NotifyType.MsgMcrGetOwnerPlayerIndex,       callback: this._onNotifyMsgMcrGetOwnerPlayerIndex },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
                { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listRoom.setItemRenderer(RoomRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._hasReceivedData   = false;
            this._isTabInitialized  = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();

            McrProxy.reqMcrGetJoinableRoomInfoList(null);
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

        private _onNotifyMcrJoinTargetRoomIdChanged(): void {
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();
        }

        private async _onMsgMcrGetJoinableRoomInfoList(): Promise<void> {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();
        }

        private _onNotifyMsgMcrDeleteRoomByServer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrJoinRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrJoinRoom.IS;
            if (data.userId === UserModel.getSelfUserId()) {
                const roomId = Helpers.getExisted(data.roomId);
                this.close();
                TwnsPanelManager.open(TwnsPanelConfig.Dict.McrRoomInfoPanel, { roomId });
                FloatText.show(Lang.getFormattedText(LangTextType.F0069, roomId));
            }
        }

        private _onNotifyMsgMcrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS;
            if (data.roomId === McrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrExitRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrExitRoom.IS;
            if (data.roomId === McrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
            if (data.roomId === McrJoinModel.getTargetRoomId()) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onNotifyMsgMcrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS;
            if (data.roomId === McrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMcrSetReady(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrSetReady.IS;
            if (data.roomId === McrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMcrGetOwnerPlayerIndex(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrGetOwnerPlayerIndex.IS;
            if (data.roomId === McrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrMainMenuPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const roomId = McrJoinModel.getTargetRoomId();
            if (roomId == null) {
                return;
            }

            const roomInfo = await McrModel.getRoomInfo(roomId);
            if (roomInfo) {
                const settingsForMcw    = Helpers.getExisted(roomInfo.settingsForMcw);
                const callback          = () => {
                    const joinData = McrJoinModel.getFastJoinData(roomInfo);
                    if (joinData) {
                        McrProxy.reqMcrJoinRoom(joinData);
                    } else {
                        FloatText.show(Lang.getText(LangTextType.A0145));
                        McrProxy.reqMcrGetJoinableRoomInfoList(null);
                    }
                };
                if (!settingsForMcw.warPassword) {
                    callback();
                } else {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonJoinRoomPasswordPanel, {
                        mapId               : Helpers.getExisted(settingsForMcw.mapId),
                        warName             : settingsForMcw.warName ?? null,
                        password            : settingsForMcw.warPassword,
                        callbackOnSucceed   : callback,
                    });
                }
            }
        }

        private _onTouchedBtnSearch(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrSearchRoomPanel, void 0);
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
            this._labelJoinRoom.text        = Lang.getText(LangTextType.B0580);
            this._labelChooseRoom.text      = Lang.getText(LangTextType.B0581);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoRoom.text          = Lang.getText(LangTextType.B0582);
            this._btnNextStep.label         = Lang.getText(LangTextType.B0583);
            this._btnSearch.label           = Lang.getText(LangTextType.B0228);
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
                const roomId            = McrJoinModel.getTargetRoomId();
                labelLoading.visible    = false;
                labelNoRoom.visible     = !dataArray.length;
                listRoom.bindData(dataArray);
                listRoom.setSelectedIndex(dataArray.findIndex(v => v.roomId === roomId));
            }
        }

        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = McrJoinModel.getTargetRoomId();
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

        private _createDataForListRoom(): DataForRoomRenderer[] {
            const dataArray: DataForRoomRenderer[] = [];
            for (const roomId of McrModel.getUnjoinedRoomIdSet()) {
                dataArray.push({
                    roomId,
                });
            }

            return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForWarCommonMapInfoPage> {
            const roomId    = McrJoinModel.getTargetRoomId();
            const mapId     = roomId == null ? null : (await McrModel.getRoomInfo(roomId))?.settingsForMcw?.mapId;
            return mapId == null
                ? null
                : { mapInfo : { mapId, }, };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return await McrModel.createDataForCommonWarPlayerInfoPage(McrJoinModel.getTargetRoomId());
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await McrModel.createDataForCommonWarBasicSettingsPage(McrJoinModel.getTargetRoomId(), false);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return await McrModel.createDataForCommonWarAdvancedSettingsPage(McrJoinModel.getTargetRoomId());
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

    type DataForRoomRenderer = {
        roomId  : number;
    };
    class RoomRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _labelId!      : TwnsUiLabel.UiLabel;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgPassword!  : TwnsUiLabel.UiLabel;

        protected async _onDataChanged(): Promise<void> {
            const roomId        = this._getData().roomId;
            this._labelId.text  = `#${roomId}`;

            const roomInfo = await McrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMcw        = Helpers.getExisted(roomInfo.settingsForMcw);
            this._imgPassword.visible   = !!settingsForMcw.warPassword;

            const warName = settingsForMcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForMcw.mapId)).then(v => this._labelName.text = v || CommonConstants.ErrorTextForUndefined);
            }
        }

        public onItemTapEvent(): void {
            McrJoinModel.setTargetRoomId(this._getData().roomId);
        }
    }
}

// export default TwnsMcrJoinRoomListPanel;
