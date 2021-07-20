
import TwnsCommonJoinRoomPasswordPanel  from "../../common/view/CommonJoinRoomPasswordPanel";
import TwnsCommonMapInfoPage            from "../../common/view/CommonMapInfoPage";
import TwnsCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage";
import TwnsLobbyBottomPanel             from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                from "../../lobby/view/LobbyTopPanel";
import MfrModel                         from "../../multiFreeRoom/model/MfrModel";
import MfrProxy                         from "../../multiFreeRoom/model/MfrProxy";
import FloatText                        from "../../tools/helpers/FloatText";
import Helpers                          from "../../tools/helpers/Helpers";
import Types                            from "../../tools/helpers/Types";
import Lang                             from "../../tools/lang/Lang";
import TwnsLangTextType                 from "../../tools/lang/LangTextType";
import TwnsNotifyType                   from "../../tools/notify/NotifyType";
import ProtoTypes                       from "../../tools/proto/ProtoTypes";
import TwnsUiButton                     from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
import TwnsUiTab                        from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer            from "../../tools/ui/UiTabItemRenderer";
import UserModel                        from "../../user/model/UserModel";
import MfrJoinModel                     from "../model/MfrJoinModel";
import TwnsMfrMainMenuPanel             from "./MfrMainMenuPanel";
import TwnsMfrRoomAdvancedSettingsPage  from "./MfrRoomAdvancedSettingsPage";
import TwnsMfrRoomInfoPanel             from "./MfrRoomInfoPanel";
import TwnsMfrRoomPlayerInfoPage        from "./MfrRoomPlayerInfoPage";

namespace TwnsMfrJoinRoomListPanel {
    import OpenDataForMfrRoomAdvancedSettingsPage   = TwnsMfrRoomAdvancedSettingsPage.OpenDataForMfrRoomAdvancedSettingsPage;
    import MfrRoomAdvancedSettingsPage              = TwnsMfrRoomAdvancedSettingsPage.MfrRoomAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonMapInfoPage             = TwnsCommonMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForMfrRoomPlayerInfoPage         = TwnsMfrRoomPlayerInfoPage.OpenDataForMfrRoomPlayerInfoPage;
    import MfrRoomPlayerInfoPage                    = TwnsMfrRoomPlayerInfoPage.MfrRoomPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class MfrJoinRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrJoinRoomListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonMapInfoPage | OpenDataForMfrRoomAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForMfrRoomPlayerInfoPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : TwnsUiLabel.UiLabel;
        private readonly _labelFreeMode         : TwnsUiLabel.UiLabel;
        private readonly _labelJoinRoom         : TwnsUiLabel.UiLabel;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnNextStep           : TwnsUiButton.UiButton;

        private readonly _groupRoomList         : eui.Group;
        private readonly _listRoom              : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading          : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;

        public static show(): void {
            if (!MfrJoinRoomListPanel._instance) {
                MfrJoinRoomListPanel._instance = new MfrJoinRoomListPanel();
            }
            MfrJoinRoomListPanel._instance.open(undefined);
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
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listRoom.setItemRenderer(RoomRenderer);

            this._showOpenAnimation();

            this._hasReceivedData = false;
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
            const data = e.data as ProtoTypes.NetMessage.MsgMfrJoinRoom.IS;
            if (data.userId === UserModel.getSelfUserId()) {
                this.close();
                TwnsMfrRoomInfoPanel.MfrRoomInfoPanel.show({ roomId: data.roomId });
            }
        }

        private _onNotifyMsgMfrDeletePlayer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrExitRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === MfrJoinModel.getTargetRoomId()) {
                this._updateCommonMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsMfrMainMenuPanel.MfrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const roomInfo = await MfrModel.getRoomInfo(MfrJoinModel.getTargetRoomId());
            if (roomInfo) {
                const settingsForMfw    = roomInfo.settingsForMfw;
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
                        warName             : settingsForMfw.warName,
                        mapId               : undefined,
                        password            : settingsForMfw.warPassword,
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
                    pageClass   : TwnsCommonMapInfoPage.CommonMapInfoPage,
                    pageData    : await this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : MfrRoomPlayerInfoPage,
                    pageData    : { roomId: null } as OpenDataForMfrRoomPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : TwnsCommonWarBasicSettingsPage.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : MfrRoomAdvancedSettingsPage,
                    pageData    : { roomId: null } as OpenDataForMfrRoomAdvancedSettingsPage,
                },
            ]);
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
                labelLoading.visible    = false;
                labelNoRoom.visible     = !dataArray.length;
                listRoom.bindData(dataArray);

                const roomId = MfrJoinModel.getTargetRoomId();
                if (dataArray.every(v => v.roomId != roomId)) {
                    MfrJoinModel.setTargetRoomId(dataArray.length ? dataArray[0].roomId : null);
                }
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

                const tab = this._tabSettings;
                tab.updatePageData(1, { roomId } as OpenDataForMfrRoomPlayerInfoPage);
                tab.updatePageData(3, { roomId } as OpenDataForMfrRoomAdvancedSettingsPage);
                this._updateCommonMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
            }
        }

        private async _updateCommonMapInfoPage(): Promise<void> {
            this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
        }

        private async _updateCommonWarBasicSettingsPage(): Promise<void> {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarBasicSettingsPage());
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

        private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonMapInfoPage> {
            const warData = (await MfrModel.getRoomInfo(MfrJoinModel.getTargetRoomId()))?.settingsForMfw.initialWarData;
            return warData == null
                ? {}
                : { warInfo: { warData } };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await MfrModel.createDataForCommonWarBasicSettingsPage(MfrJoinModel.getTargetRoomId(), false);
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
        private _labelName: TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }

    type DataForRoomRenderer = {
        roomId  : number;
    };
    class RoomRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _btnChoose     : TwnsUiButton.UiButton;
        private readonly _btnNext       : TwnsUiButton.UiButton;
        private readonly _labelName     : TwnsUiLabel.UiLabel;
        private readonly _imgPassword   : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MfrJoinTargetRoomIdChanged, callback: this._onNotifyMfrJoinTargetRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomInfo = await MfrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMfw        = roomInfo.settingsForMfw;
            this._imgPassword.visible   = !!settingsForMfw.warPassword;
            this._labelName.text        = settingsForMfw.warName || `--`;
        }

        private _onNotifyMfrJoinTargetRoomIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            MfrJoinModel.setTargetRoomId(this.data.roomId);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            const roomInfo = await MfrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMfw    = roomInfo.settingsForMfw;
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
                    warName             : settingsForMfw.warName,
                    mapId               : undefined,
                    password            : settingsForMfw.warPassword,
                    callbackOnSucceed   : callback,
                });
            }
        }

        private _updateState(): void {
            this.currentState = this.data.roomId === MfrJoinModel.getTargetRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsMfrJoinRoomListPanel;
