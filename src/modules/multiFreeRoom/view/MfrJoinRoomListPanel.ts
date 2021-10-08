
import TwnsCommonJoinRoomPasswordPanel      from "../../common/view/CommonJoinRoomPasswordPanel";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import MfrModel                             from "../../multiFreeRoom/model/MfrModel";
import MfrProxy                             from "../../multiFreeRoom/model/MfrProxy";
import FloatText                            from "../../tools/helpers/FloatText";
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
import UserModel                            from "../../user/model/UserModel";
import MfrJoinModel                         from "../model/MfrJoinModel";
import TwnsMfrMainMenuPanel                 from "./MfrMainMenuPanel";
import TwnsMfrRoomInfoPanel                 from "./MfrRoomInfoPanel";

namespace TwnsMfrJoinRoomListPanel {
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class MfrJoinRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrJoinRoomListPanel;

        private readonly _groupTab!         : eui.Group;
        private readonly _tabSettings!      : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarPlayerInfoPage>;

        private readonly _groupNavigator!   : eui.Group;
        private readonly _labelMultiPlayer! : TwnsUiLabel.UiLabel;
        private readonly _labelFreeMode!    : TwnsUiLabel.UiLabel;
        private readonly _labelJoinRoom!    : TwnsUiLabel.UiLabel;

        private readonly _btnBack!           : TwnsUiButton.UiButton;
        private readonly _btnNextStep!       : TwnsUiButton.UiButton;

        private readonly _groupRoomList!     : eui.Group;
        private readonly _listRoom!          : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom!       : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!      : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;
        private _isTabInitialized   = false;

        public static show(): void {
            if (!MfrJoinRoomListPanel._instance) {
                MfrJoinRoomListPanel._instance = new MfrJoinRoomListPanel();
            }
            MfrJoinRoomListPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (MfrJoinRoomListPanel._instance) {
                await MfrJoinRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrJoinRoomListPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MfrJoinTargetRoomIdChanged,      callback: this._onNotifyMfrJoinTargetRoomIdChanged },
                { type: NotifyType.MsgMfrGetJoinableRoomInfoList,   callback: this._onNotifyMsgMfrGetJoinableRoomInfoList },
                { type: NotifyType.MsgMfrCreateRoom,                callback: this._onNotifyMsgCreateRoom },
                { type: NotifyType.MsgMfrDeleteRoomByServer,        callback: this._onNotifyMsgMfrDeleteRoomByServer },
                { type: NotifyType.MsgMfrJoinRoom,                  callback: this._onNotifyMsgMfrJoinRoom },
                { type: NotifyType.MsgMfrDeletePlayer,              callback: this._onNotifyMsgMfrDeletePlayer },
                { type: NotifyType.MsgMfrExitRoom,                  callback: this._onNotifyMsgMfrExitRoom },
                { type: NotifyType.MsgMfrGetRoomInfo,               callback: this._onNotifyMsgMfrGetRoomInfo },
                { type: NotifyType.MsgMfrSetSelfSettings,           callback: this._onNotifyMsgMfrSetSelfSettings },
                { type: NotifyType.MsgMfrSetReady,                  callback: this._onNotifyMsgMfrSetReady },
                { type: NotifyType.MsgMfrGetOwnerPlayerIndex,       callback: this._onNotifyMsgMfrGetOwnerPlayerIndex },
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

            MfrProxy.reqMfrGetJoinableRoomInfoList();
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

        private _onNotifyMfrJoinTargetRoomIdChanged(): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private async _onNotifyMsgMfrGetJoinableRoomInfoList(): Promise<void> {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();
        }

        private _onNotifyMsgCreateRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrDeleteRoomByServer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrJoinRoom(e: egret.Event): void {
            const data      = e.data as ProtoTypes.NetMessage.MsgMfrJoinRoom.IS;
            const roomId    = Helpers.getExisted(data.roomId);
            if (data.userId === UserModel.getSelfUserId()) {
                this.close();
                TwnsMfrRoomInfoPanel.MfrRoomInfoPanel.show({ roomId });
                FloatText.show(Lang.getFormattedText(LangTextType.F0069, roomId));
            } else if (roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMfrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrDeletePlayer.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrExitRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrExitRoom.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }

            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onNotifyMsgMfrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrSetSelfSettings.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMfrSetReady(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrSetReady.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMfrGetOwnerPlayerIndex(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetOwnerPlayerIndex.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsMfrMainMenuPanel.MfrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const roomId    = MfrJoinModel.getTargetRoomId();
            const roomInfo  = roomId == null ? null : await MfrModel.getRoomInfo(roomId);
            if (roomInfo) {
                const settingsForMfw    = Helpers.getExisted(roomInfo.settingsForMfw);
                const callback          = () => {
                    const joinData = MfrJoinModel.getFastJoinData(roomInfo);
                    if (joinData) {
                        MfrProxy.reqMfrJoinRoom(joinData);
                    } else {
                        FloatText.show(Lang.getText(LangTextType.A0145));
                        MfrProxy.reqMfrGetJoinableRoomInfoList();
                    }
                };

                const warPassword = settingsForMfw.warPassword;
                if (!warPassword) {
                    callback();
                } else {
                    TwnsCommonJoinRoomPasswordPanel.CommonJoinRoomPasswordPanel.show({
                        mapId               : null,
                        warName             : settingsForMfw.warName ?? null,
                        password            : warPassword,
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
            this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0137);
            this._labelFreeMode.text        = Lang.getText(LangTextType.B0557);
            this._labelJoinRoom.text        = Lang.getText(LangTextType.B0580);
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
                : (await MfrModel.getRoomInfo(roomId))?.settingsForMfw?.initialWarData;
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
        roomId  : number;
    };
    class RoomRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _btnNext!      : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgPassword!  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const roomInfo = await MfrModel.getRoomInfo(this._getData().roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMfw        = Helpers.getExisted(roomInfo.settingsForMfw);
            this._imgPassword.visible   = !!settingsForMfw.warPassword;
            this._labelName.text        = settingsForMfw.warName || `--`;
        }

        private _onTouchTapBtnChoose(): void {
            MfrJoinModel.setTargetRoomId(this._getData().roomId);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            const roomInfo = await MfrModel.getRoomInfo(this._getData().roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMfw    = Helpers.getExisted(roomInfo.settingsForMfw);
            const callback          = () => {
                const joinData = MfrJoinModel.getFastJoinData(roomInfo);
                if (joinData) {
                    MfrProxy.reqMfrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0145));
                    MfrProxy.reqMfrGetJoinableRoomInfoList();
                }
            };
            if (!settingsForMfw.warPassword) {
                callback();
            } else {
                TwnsCommonJoinRoomPasswordPanel.CommonJoinRoomPasswordPanel.show({
                    mapId               : null,
                    warName             : settingsForMfw.warName ?? null,
                    password            : settingsForMfw.warPassword,
                    callbackOnSucceed   : callback,
                });
            }
        }
    }
}

export default TwnsMfrJoinRoomListPanel;
