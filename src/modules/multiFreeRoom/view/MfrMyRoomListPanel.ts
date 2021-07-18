
import TwnsCommonMapInfoPage            from "../../common/view/CommonMapInfoPage";
import TwnsLobbyBottomPanel             from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                from "../../lobby/view/LobbyTopPanel";
import MfrModel                         from "../../multiFreeRoom/model/MfrModel";
import MfrProxy                         from "../../multiFreeRoom/model/MfrProxy";
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
import MfrJoinModel                     from "../model/MfrJoinModel";
import TwnsMfrMainMenuPanel             from "./MfrMainMenuPanel";
import TwnsMfrRoomAdvancedSettingsPage  from "./MfrRoomAdvancedSettingsPage";
import TwnsMfrRoomBasicSettingsPage     from "./MfrRoomBasicSettingsPage";
import TwnsMfrRoomInfoPanel             from "./MfrRoomInfoPanel";
import TwnsMfrRoomPlayerInfoPage        from "./MfrRoomPlayerInfoPage";

namespace TwnsMfrMyRoomListPanel {
    import OpenDataForCommonMapInfoPage             = TwnsCommonMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForMfrRoomPlayerInfoPage         = TwnsMfrRoomPlayerInfoPage.OpenDataForMfrRoomPlayerInfoPage;
    import MfrRoomPlayerInfoPage                    = TwnsMfrRoomPlayerInfoPage.MfrRoomPlayerInfoPage;
    import OpenDataForMfrRoomBasicSettingsPage      = TwnsMfrRoomBasicSettingsPage.OpenDataForMfrRoomBasicSettingsPage;
    import MfrRoomBasicSettingsPage                 = TwnsMfrRoomBasicSettingsPage.MfrRoomBasicSettingsPage;
    import OpenDataForMfrRoomAdvancedSettingsPage   = TwnsMfrRoomAdvancedSettingsPage.OpenDataForMfrRoomAdvancedSettingsPage;
    import MfrRoomAdvancedSettingsPage              = TwnsMfrRoomAdvancedSettingsPage.MfrRoomAdvancedSettingsPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class MfrMyRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrMyRoomListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonMapInfoPage | OpenDataForMfrRoomPlayerInfoPage | OpenDataForMfrRoomAdvancedSettingsPage | OpenDataForMfrRoomBasicSettingsPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : TwnsUiLabel.UiLabel;
        private readonly _labelFreeMode         : TwnsUiLabel.UiLabel;
        private readonly _labelMyRoom           : TwnsUiLabel.UiLabel;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnNextStep           : TwnsUiButton.UiButton;

        private readonly _groupRoomList         : eui.Group;
        private readonly _listRoom              : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading          : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;

        public static show(): void {
            if (!MfrMyRoomListPanel._instance) {
                MfrMyRoomListPanel._instance = new MfrMyRoomListPanel();
            }
            MfrMyRoomListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MfrMyRoomListPanel._instance) {
                await MfrMyRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrMyRoomListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MfrJoinedPreviewingRoomIdChanged,    callback: this._onNotifyMfrJoinedPreviewingRoomIdChanged },
                { type: NotifyType.MsgMfrGetJoinedRoomInfoList,         callback: this._onNotifyMsgMfrGetJoinedRoomInfoList },
                { type: NotifyType.MsgMfrCreateRoom,                    callback: this._onNotifyMsgCreateRoom },
                { type: NotifyType.MsgMfrDeleteRoomByServer,            callback: this._onNotifyMsgMfrDeleteRoomByServer },
                { type: NotifyType.MsgMfrJoinRoom,                      callback: this._onNotifyMsgMfrJoinRoom },
                { type: NotifyType.MsgMfrDeletePlayer,                  callback: this._onNotifyMsgMfrDeletePlayer },
                { type: NotifyType.MsgMfrExitRoom,                      callback: this._onNotifyMsgMfrExitRoom },
                { type: NotifyType.MsgMfrGetRoomInfo,                   callback: this._onNotifyMsgMfrGetRoomInfo },
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
            this._updateComponentsForPreviewingRoomInfo();

            MfrProxy.reqMfrGetJoinedRoomInfoList();
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

        private _onNotifyMfrJoinedPreviewingRoomIdChanged(): void {
            this._updateComponentsForPreviewingRoomInfo();
        }

        private _onNotifyMsgMfrGetJoinedRoomInfoList(): void {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForPreviewingRoomInfo();
        }

        private _onNotifyMsgCreateRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrDeleteRoomByServer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrJoinRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrDeletePlayer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrExitRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === MfrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonMapInfoPage();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsMfrMainMenuPanel.MfrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private _onTouchedBtnNextStep(): void {
            const roomId = MfrJoinModel.getJoinedPreviewingRoomId();
            if (roomId != null) {
                this.close();
                TwnsMfrRoomInfoPanel.MfrRoomInfoPanel.show({
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
                    pageClass   : MfrRoomBasicSettingsPage,
                    pageData    : { roomId: null } as OpenDataForMfrRoomBasicSettingsPage,
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

                const roomId = MfrJoinModel.getJoinedPreviewingRoomId();
                if (dataArray.every(v => v.roomId != roomId)) {
                    MfrJoinModel.setJoinedPreviewingRoomId(dataArray.length ? dataArray[0].roomId : null);
                }
            }
        }

        private _updateComponentsForPreviewingRoomInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = MfrJoinModel.getJoinedPreviewingRoomId();
            if ((!this._hasReceivedData) || (roomId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                const tab = this._tabSettings;
                tab.updatePageData(1, { roomId } as OpenDataForMfrRoomPlayerInfoPage);
                tab.updatePageData(2, { roomId } as OpenDataForMfrRoomBasicSettingsPage);
                tab.updatePageData(3, { roomId } as OpenDataForMfrRoomAdvancedSettingsPage);
                this._updateCommonMapInfoPage();
            }
        }

        private async _updateCommonMapInfoPage(): Promise<void> {
            this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
        }

        private _createDataForListRoom(): DataForRoomRenderer[] {
            const dataArray: DataForRoomRenderer[] = [];
            for (const roomId of MfrModel.getJoinedRoomIdSet()) {
                dataArray.push({
                    roomId,
                });
            }

            return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
        }

        private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonMapInfoPage> {
            const warData = (await MfrModel.getRoomInfo(MfrJoinModel.getJoinedPreviewingRoomId()))?.settingsForMfw.initialWarData;
            return warData == null
                ? {}
                : { warInfo: { warData } };
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
        roomId: number;
    };
    class RoomRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _btnChoose     : TwnsUiButton.UiButton;
        private readonly _btnNext       : TwnsUiButton.UiButton;
        private readonly _labelName     : TwnsUiLabel.UiLabel;
        private readonly _imgRed        : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.MfrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMfrJoinedPreviewingRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomId            = this.data.roomId;
            const roomInfo          = await MfrModel.getRoomInfo(roomId);
            this._imgRed.visible    = await MfrModel.checkIsRedForRoom(roomId);
            this._labelName.text    = roomInfo ? roomInfo.settingsForMfw.warName || `--` : `--`;
        }

        private _onNotifyMfrJoinedPreviewingRoomIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            MfrJoinModel.setJoinedPreviewingRoomId(this.data.roomId);
        }

        private _onTouchTapBtnNext(): void {
            MfrMyRoomListPanel.hide();
            TwnsMfrRoomInfoPanel.MfrRoomInfoPanel.show({
                roomId  : this.data.roomId,
            });
        }

        private _updateState(): void {
            this.currentState = this.data.roomId === MfrJoinModel.getJoinedPreviewingRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsMfrMyRoomListPanel;
