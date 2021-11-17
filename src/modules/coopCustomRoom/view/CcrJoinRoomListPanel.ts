
// import TwnsCommonJoinRoomPasswordPanel      from "../../common/view/CommonJoinRoomPasswordPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import CcrModel                             from "../../coopCustomRoom/model/CcrModel";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
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
// import CcrJoinModel                         from "../model/CcrJoinModel";
// import CcrProxy                             from "../model/CcrProxy";
// import TwnsCcrMainMenuPanel                 from "./CcrMainMenuPanel";
// import TwnsCcrRoomInfoPanel                 from "./CcrRoomInfoPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCcrJoinRoomListPanel {
    import CcrRoomInfoPanel                         = TwnsCcrRoomInfoPanel.CcrRoomInfoPanel;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class CcrJoinRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CcrJoinRoomListPanel;

        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelMultiPlayer!     : TwnsUiLabel.UiLabel;
        private readonly _labelJoinRoom!        : TwnsUiLabel.UiLabel;
        private readonly _labelChooseRoom!      : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupRoomList!        : eui.Group;
        private readonly _listRoom!             : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom!          : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;
        private _isTabInitialized   = false;

        public static show(): void {
            if (!CcrJoinRoomListPanel._instance) {
                CcrJoinRoomListPanel._instance = new CcrJoinRoomListPanel();
            }
            CcrJoinRoomListPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (CcrJoinRoomListPanel._instance) {
                await CcrJoinRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/coopCustomRoom/CcrJoinRoomListPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.CcrJoinTargetRoomIdChanged,      callback: this._onNotifyCcrJoinTargetRoomIdChanged },
                { type: NotifyType.MsgCcrGetJoinableRoomInfoList,   callback: this._onMsgCcrGetJoinableRoomInfoList },
                { type: NotifyType.MsgCcrCreateRoom,                callback: this._onNotifyMsgCreateRoom },
                { type: NotifyType.MsgCcrDeleteRoomByServer,        callback: this._onNotifyMsgCcrDeleteRoomByServer },
                { type: NotifyType.MsgCcrJoinRoom,                  callback: this._onNotifyMsgCcrJoinRoom },
                { type: NotifyType.MsgCcrDeletePlayer,              callback: this._onNotifyMsgCcrDeletePlayer },
                { type: NotifyType.MsgCcrExitRoom,                  callback: this._onNotifyMsgCcrExitRoom },
                { type: NotifyType.MsgCcrGetRoomInfo,               callback: this._onNotifyMsgCcrGetRoomInfo },
                { type: NotifyType.MsgCcrSetSelfSettings,           callback: this._onNotifyMsgCcrSetSelfSettings },
                { type: NotifyType.MsgCcrSetReady,                  callback: this._onNotifyMsgCcrSetReady },
                { type: NotifyType.MsgCcrGetOwnerPlayerIndex,       callback: this._onNotifyMsgCcrGetOwnerPlayerIndex },
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
            this._updateComponentsForTargetRoomInfo();

            CcrProxy.reqCcrGetJoinableRoomInfoList();
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

        private _onNotifyCcrJoinTargetRoomIdChanged(): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private async _onMsgCcrGetJoinableRoomInfoList(): Promise<void> {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();
        }

        private _onNotifyMsgCreateRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgCcrDeleteRoomByServer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgCcrJoinRoom(e: egret.Event): void {
            const data      = e.data as ProtoTypes.NetMessage.MsgCcrJoinRoom.IS;
            const roomId    = Helpers.getExisted(data.roomId);
            if (data.userId === UserModel.getSelfUserId()) {
                this.close();
                CcrRoomInfoPanel.show({ roomId });
                FloatText.show(Lang.getFormattedText(LangTextType.F0069, roomId));
            } else {
                if (roomId === CcrJoinModel.getTargetRoomId()) {
                    this._updateCommonWarPlayerInfoPage();
                }

                this._updateGroupRoomList();
            }
        }

        private _onNotifyMsgCcrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrDeletePlayer.IS;
            if (data.roomId === CcrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgCcrExitRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrExitRoom.IS;
            if (data.roomId === CcrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
            if (data.roomId === CcrJoinModel.getTargetRoomId()) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onNotifyMsgCcrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrSetSelfSettings.IS;
            if (data.roomId === CcrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgCcrSetReady(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrSetReady.IS;
            if (data.roomId === CcrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgCcrGetOwnerPlayerIndex(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetOwnerPlayerIndex.IS;
            if (data.roomId === CcrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsCcrMainMenuPanel.CcrMainMenuPanel.show();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const roomInfo = await CcrModel.getRoomInfo(Helpers.getExisted(CcrJoinModel.getTargetRoomId()));
            if (roomInfo) {
                const settingsForCcw    = Helpers.getExisted(roomInfo.settingsForCcw);
                const callback          = () => {
                    const joinData = CcrJoinModel.getFastJoinData(roomInfo);
                    if (joinData) {
                        CcrProxy.reqCcrJoinRoom(joinData);
                    } else {
                        FloatText.show(Lang.getText(LangTextType.A0145));
                        CcrProxy.reqCcrGetJoinableRoomInfoList();
                    }
                };
                if (!settingsForCcw.warPassword) {
                    callback();
                } else {
                    TwnsCommonJoinRoomPasswordPanel.CommonJoinRoomPasswordPanel.show({
                        mapId               : Helpers.getExisted(settingsForCcw.mapId),
                        warName             : settingsForCcw.warName ?? null,
                        password            : settingsForCcw.warPassword,
                        callbackOnSucceed   : callback,
                    });
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
            this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0646);
            this._labelJoinRoom.text        = Lang.getText(LangTextType.B0580);
            this._labelChooseRoom.text      = Lang.getText(LangTextType.B0581);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoRoom.text          = Lang.getText(LangTextType.B0582);
            this._btnNextStep.label         = Lang.getText(LangTextType.B0583);
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

                const roomId = CcrJoinModel.getTargetRoomId();
                if (dataArray.every(v => v.roomId != roomId)) {
                    CcrJoinModel.setTargetRoomId(dataArray.length ? dataArray[0].roomId : null);
                }
            }
        }

        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = CcrJoinModel.getTargetRoomId();
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
            for (const roomId of CcrModel.getUnjoinedRoomIdSet()) {
                dataArray.push({
                    roomId,
                });
            }

            return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const roomId    = CcrJoinModel.getTargetRoomId();
            const mapId     = roomId == null ? null : (await CcrModel.getRoomInfo(roomId))?.settingsForCcw?.mapId;
            return mapId == null
                ? null
                : { mapInfo: { mapId } };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            const roomId = CcrJoinModel.getTargetRoomId();
            return roomId == null ? null : await CcrModel.createDataForCommonWarPlayerInfoPage(roomId);
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const roomId = CcrJoinModel.getTargetRoomId();
            return roomId == null ? null : await CcrModel.createDataForCommonWarBasicSettingsPage(roomId, false);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            const roomId = CcrJoinModel.getTargetRoomId();
            return roomId == null ? null : await CcrModel.createDataForCommonWarAdvancedSettingsPage(roomId);
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
        private readonly _labelName!: TwnsUiLabel.UiLabel;

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
            this._setNotifyListenerArray([
                { type: NotifyType.CcrJoinTargetRoomIdChanged, callback: this._onNotifyCcrJoinTargetRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomInfo = await CcrModel.getRoomInfo(this._getData().roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForCcw        = Helpers.getExisted(roomInfo.settingsForCcw);
            this._imgPassword.visible   = !!settingsForCcw.warPassword;

            const warName = settingsForCcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(settingsForCcw.mapId)).then(v => this._labelName.text = v ?? CommonConstants.ErrorTextForUndefined);
            }
        }

        private _onNotifyCcrJoinTargetRoomIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            CcrJoinModel.setTargetRoomId(this._getData().roomId);
        }

        private _updateState(): void {
            this.currentState = this._getData().roomId === CcrJoinModel.getTargetRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

// export default TwnsCcrJoinRoomListPanel;
