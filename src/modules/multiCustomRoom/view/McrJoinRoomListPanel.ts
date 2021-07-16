
import TwnsLobbyBottomPanel             from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                from "../../lobby/view/LobbyTopPanel";
import McrModel                         from "../../multiCustomRoom/model/McrModel";
import McrProxy                         from "../../multiCustomRoom/model/McrProxy";
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
import WarMapModel                      from "../../warMap/model/WarMapModel";
import McrJoinModel                     from "../model/McrJoinModel";
import TwnsMcrJoinPasswordPanel         from "./McrJoinPasswordPanel";
import TwnsMcrMainMenuPanel             from "./McrMainMenuPanel";
import TwnsMcrRoomAdvancedSettingsPage  from "./McrRoomAdvancedSettingsPage";
import TwnsMcrRoomBasicSettingsPage     from "./McrRoomBasicSettingsPage";
import TwnsMcrRoomInfoPanel             from "./McrRoomInfoPanel";
import TwnsMcrRoomMapInfoPage           from "./McrRoomMapInfoPage";
import TwnsMcrRoomPlayerInfoPage        from "./McrRoomPlayerInfoPage";

namespace TwnsMcrJoinRoomListPanel {
    import McrJoinPasswordPanel                     = TwnsMcrJoinPasswordPanel.McrJoinPasswordPanel;
    import McrRoomInfoPanel                         = TwnsMcrRoomInfoPanel.McrRoomInfoPanel;
    import OpenDataForMcrRoomMapInfoPage            = TwnsMcrRoomMapInfoPage.OpenDataForMcrRoomMapInfoPage;
    import McrRoomMapInfoPage                       = TwnsMcrRoomMapInfoPage.McrRoomMapInfoPage;
    import OpenDataForMcrRoomPlayerInfoPage         = TwnsMcrRoomPlayerInfoPage.OpenDataForMcrRoomPlayerInfoPage;
    import McrRoomPlayerInfoPage                    = TwnsMcrRoomPlayerInfoPage.McrRoomPlayerInfoPage;
    import OpenDataForMcrRoomAdvancedSettingsPage   = TwnsMcrRoomAdvancedSettingsPage.OpenDataForMcrRoomAdvancedSettingsPage;
    import McrRoomAdvancedSettingsPage              = TwnsMcrRoomAdvancedSettingsPage.McrRoomAdvancedSettingsPage;
    import OpenDataForMcrRoomBasicSettingsPage      = TwnsMcrRoomBasicSettingsPage.OpenDataForMcrRoomBasicSettingsPage;
    import McrRoomBasicSettingsPage                 = TwnsMcrRoomBasicSettingsPage.McrRoomBasicSettingsPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class McrJoinRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinRoomListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForMcrRoomMapInfoPage | OpenDataForMcrRoomPlayerInfoPage | OpenDataForMcrRoomAdvancedSettingsPage | OpenDataForMcrRoomBasicSettingsPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : TwnsUiLabel.UiLabel;
        private readonly _labelJoinRoom         : TwnsUiLabel.UiLabel;
        private readonly _labelChooseRoom       : TwnsUiLabel.UiLabel;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnNextStep           : TwnsUiButton.UiButton;

        private readonly _groupRoomList         : eui.Group;
        private readonly _listRoom              : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading          : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;

        public static show(): void {
            if (!McrJoinRoomListPanel._instance) {
                McrJoinRoomListPanel._instance = new McrJoinRoomListPanel();
            }
            McrJoinRoomListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McrJoinRoomListPanel._instance) {
                await McrJoinRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinRoomListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.McrJoinTargetRoomIdChanged,     callback: this._onNotifyMcrJoinTargetRoomIdChanged },
                { type: NotifyType.MsgMcrGetJoinableRoomInfoList,  callback: this._onMsgMcrGetJoinableRoomInfoList },
                { type: NotifyType.MsgMcrCreateRoom,               callback: this._onNotifyMsgCreateRoom },
                { type: NotifyType.MsgMcrDeleteRoomByServer,       callback: this._onNotifyMsgMcrDeleteRoomByServer },
                { type: NotifyType.MsgMcrJoinRoom,                 callback: this._onNotifyMsgMcrJoinRoom },
                { type: NotifyType.MsgMcrDeletePlayer,             callback: this._onNotifyMsgMcrDeletePlayer },
                { type: NotifyType.MsgMcrExitRoom,                 callback: this._onNotifyMsgMcrExitRoom },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listRoom.setItemRenderer(RoomRenderer);

            this._showOpenAnimation();

            this._hasReceivedData = false;
            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();

            McrProxy.reqMcrGetJoinableRoomInfoList();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMcrJoinTargetRoomIdChanged(): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private async _onMsgMcrGetJoinableRoomInfoList(e: egret.Event): Promise<void> {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();
        }

        private _onNotifyMsgCreateRoom(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrDeleteRoomByServer(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrJoinRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrJoinRoom.IS;
            if (data.userId === UserModel.getSelfUserId()) {
                this.close();
                McrRoomInfoPanel.show({ roomId: data.roomId });
            }
        }

        private _onNotifyMsgMcrDeletePlayer(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrExitRoom(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            TwnsMcrMainMenuPanel.McrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(e: egret.TouchEvent): Promise<void> {
            const roomInfo = await McrModel.getRoomInfo(McrJoinModel.getTargetRoomId());
            if (roomInfo) {
                if (roomInfo.settingsForMcw.warPassword) {
                    McrJoinPasswordPanel.show({ roomInfo });
                } else {
                    const joinData = McrJoinModel.getFastJoinData(roomInfo);
                    if (joinData) {
                        McrProxy.reqMcrJoinRoom(joinData);
                    } else {
                        FloatText.show(Lang.getText(LangTextType.A0145));
                        McrProxy.reqMcrGetJoinableRoomInfoList();
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _initTabSettings(): void {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : McrRoomMapInfoPage,
                    pageData    : { roomId: null } as OpenDataForMcrRoomMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : McrRoomPlayerInfoPage,
                    pageData    : { roomId: null } as OpenDataForMcrRoomPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : McrRoomBasicSettingsPage,
                    pageData    : { roomId: null } as OpenDataForMcrRoomBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : McrRoomAdvancedSettingsPage,
                    pageData    : { roomId: null } as OpenDataForMcrRoomAdvancedSettingsPage,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(LangTextType.A0040);
            this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0137);
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

                const roomId = McrJoinModel.getTargetRoomId();
                if (dataArray.every(v => v.roomId != roomId)) {
                    McrJoinModel.setTargetRoomId(dataArray.length ? dataArray[0].roomId : null);
                }
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

                const tab = this._tabSettings;
                tab.updatePageData(0, { roomId } as OpenDataForMcrRoomMapInfoPage);
                tab.updatePageData(1, { roomId } as OpenDataForMcrRoomPlayerInfoPage);
                tab.updatePageData(2, { roomId } as OpenDataForMcrRoomBasicSettingsPage);
                tab.updatePageData(3, { roomId } as OpenDataForMcrRoomAdvancedSettingsPage);
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
                { type: NotifyType.McrJoinTargetRoomIdChanged, callback: this._onNotifyMcrJoinTargetRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomInfo = await McrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMcw        = roomInfo.settingsForMcw;
            this._imgPassword.visible   = !!settingsForMcw.warPassword;

            const warName = settingsForMcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMcw.mapId).then(v => this._labelName.text = v);
            }
        }

        private _onNotifyMcrJoinTargetRoomIdChanged(e: egret.Event): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            McrJoinModel.setTargetRoomId(this.data.roomId);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            const roomInfo = await McrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

            if (roomInfo.settingsForMcw.warPassword) {
                McrJoinPasswordPanel.show({ roomInfo });
            } else {
                const joinData = McrJoinModel.getFastJoinData(roomInfo);
                if (joinData) {
                    McrProxy.reqMcrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0145));
                    McrProxy.reqMcrGetJoinableRoomInfoList();
                }
            }
        }

        private _updateState(): void {
            this.currentState = this.data.roomId === McrJoinModel.getTargetRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsMcrJoinRoomListPanel;
