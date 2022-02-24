
// import TwnsCommonJoinRoomPasswordPanel      from "../../common/view/CommonJoinRoomPasswordPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import MfrModel                             from "../../multiFreeRoom/model/MfrModel";
// import MfrProxy                             from "../../multiFreeRoom/model/MfrProxy";
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
// import MfrJoinModel                         from "../model/MfrJoinModel";
// import TwnsMfrMainMenuPanel                 from "./MfrMainMenuPanel";
// import TwnsMfrRoomInfoPanel                 from "./MfrRoomInfoPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMfrJoinRoomListPanel {
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class MfrJoinRoomListPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarPlayerInfoPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelMultiPlayer!     : TwnsUiLabel.UiLabel;
        private readonly _labelFreeMode!        : TwnsUiLabel.UiLabel;
        private readonly _labelJoinRoom!        : TwnsUiLabel.UiLabel;

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
                { type: NotifyType.MfrJoinTargetRoomIdChanged,      callback: this._onNotifyMfrJoinTargetRoomIdChanged },
                { type: NotifyType.MsgMfrGetJoinableRoomIdArray,    callback: this._onNotifyMsgMfrGetJoinableRoomIdArray },
                { type: NotifyType.MsgMfrJoinRoom,                  callback: this._onNotifyMsgMfrJoinRoom },
                { type: NotifyType.MsgMfrGetRoomStaticInfo,         callback: this._onNotifyMsgMfrGetRoomStaticInfo },
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,         callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
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

            MfrProxy.reqMfrGetJoinableRoomIdArray(null);
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

        private _onNotifyMfrJoinTargetRoomIdChanged(): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private async _onNotifyMsgMfrGetJoinableRoomIdArray(): Promise<void> {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();
        }

        private _onNotifyMsgMfrJoinRoom(e: egret.Event): void {
            const data      = e.data as ProtoTypes.NetMessage.MsgMfrJoinRoom.IS;
            const roomId    = Helpers.getExisted(data.roomId);
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MfrRoomInfoPanel, { roomId });
            FloatText.show(Lang.getFormattedText(LangTextType.F0069, roomId));
        }

        private _onNotifyMsgMfrGetRoomStaticInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomStaticInfo.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onNotifyMsgMfrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomPlayerInfo.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MfrMainMenuPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const roomId = MfrJoinModel.getTargetRoomId();
            if (roomId == null) {
                return;
            }

            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MfrModel.getRoomStaticInfo(roomId),
                MfrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo != null) && (roomPlayerInfo != null)) {
                const settingsForMfw    = Helpers.getExisted(roomStaticInfo.settingsForMfw);
                const callback          = () => {
                    const joinData = MfrJoinModel.getFastJoinData(roomStaticInfo, roomPlayerInfo);
                    if (joinData) {
                        MfrProxy.reqMfrJoinRoom(joinData);
                    } else {
                        FloatText.show(Lang.getText(LangTextType.A0145));
                        MfrProxy.reqMfrGetJoinableRoomIdArray(null);
                    }
                };

                const warPassword = settingsForMfw.warPassword;
                if (!warPassword) {
                    callback();
                } else {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonJoinRoomPasswordPanel, {
                        mapId               : null,
                        warName             : settingsForMfw.warName ?? null,
                        password            : warPassword,
                        callbackOnSucceed   : callback,
                    });
                }
            }
        }

        private _onTouchedBtnSearch(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MfrSearchRoomPanel, void 0);
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
            this._labelFreeMode.text        = Lang.getText(LangTextType.B0557);
            this._labelJoinRoom.text        = Lang.getText(LangTextType.B0580);
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
                const roomId            = MfrJoinModel.getTargetRoomId();
                labelLoading.visible    = false;
                labelNoRoom.visible     = !dataArray.length;
                listRoom.bindData(dataArray);
                listRoom.setSelectedIndex(dataArray.findIndex(v => v.roomId === roomId));
            }
        }

        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = MfrJoinModel.getTargetRoomId();
            if ((!this._hasReceivedData) || (roomId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                this._updateCommonMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private async _updateCommonMapInfoPage(): Promise<void> {
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
            for (const roomId of MfrModel.getUnjoinedRoomIdSet()) {
                dataArray.push({
                    roomId,
                });
            }

            return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const roomId    = MfrJoinModel.getTargetRoomId();
            const warData   = roomId == null
                ? null
                : (await MfrModel.getRoomStaticInfo(roomId))?.settingsForMfw?.initialWarData;
            return warData == null
                ? null
                : { warInfo: { warData, players: null } };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            const roomId = MfrJoinModel.getTargetRoomId();
            return roomId == null
                ? null
                : await MfrModel.createDataForCommonWarPlayerInfoPage(roomId);
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const roomId = MfrJoinModel.getTargetRoomId();
            return roomId == null
                ? null
                : await MfrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            const roomId = MfrJoinModel.getTargetRoomId();
            return roomId == null
                ? null
                : await MfrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
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
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgPassword!  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const roomId    = this._getData().roomId;
            const roomInfo  = await MfrModel.getRoomStaticInfo(roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMfw        = Helpers.getExisted(roomInfo.settingsForMfw);
            this._imgPassword.visible   = !!settingsForMfw.warPassword;
            this._labelName.text        = settingsForMfw.warName || `#${roomId}`;
        }

        private _onTouchTapBtnChoose(): void {
            MfrJoinModel.setTargetRoomId(this._getData().roomId);
        }
    }
}

// export default TwnsMfrJoinRoomListPanel;
