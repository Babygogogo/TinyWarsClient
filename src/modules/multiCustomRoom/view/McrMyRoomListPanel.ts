
import TwnsCommonMapInfoPage            from "../../common/view/CommonMapInfoPage";
import TwnsCommonWarBasicSettingsPage   from "../../common/view/CommonWarBasicSettingsPage";
import TwnsLobbyBottomPanel             from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                from "../../lobby/view/LobbyTopPanel";
import McrModel                         from "../../multiCustomRoom/model/McrModel";
import McrProxy                         from "../../multiCustomRoom/model/McrProxy";
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
import WarMapModel                      from "../../warMap/model/WarMapModel";
import McrJoinModel                     from "../model/McrJoinModel";
import TwnsMcrMainMenuPanel             from "./McrMainMenuPanel";
import TwnsMcrRoomAdvancedSettingsPage  from "./McrRoomAdvancedSettingsPage";
import TwnsMcrRoomInfoPanel             from "./McrRoomInfoPanel";
import TwnsMcrRoomPlayerInfoPage        from "./McrRoomPlayerInfoPage";

namespace TwnsMcrMyRoomListPanel {
    import OpenDataForMcrRoomAdvancedSettingsPage   = TwnsMcrRoomAdvancedSettingsPage.OpenDataForMcrRoomAdvancedSettingsPage;
    import McrRoomAdvancedSettingsPage              = TwnsMcrRoomAdvancedSettingsPage.McrRoomAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonMapInfoPage             = TwnsCommonMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForMcrRoomPlayerInfoPage         = TwnsMcrRoomPlayerInfoPage.OpenDataForMcrRoomPlayerInfoPage;
    import McrRoomPlayerInfoPage                    = TwnsMcrRoomPlayerInfoPage.McrRoomPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class McrMyRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMyRoomListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonMapInfoPage | OpenDataForMcrRoomPlayerInfoPage | OpenDataForMcrRoomAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : TwnsUiLabel.UiLabel;
        private readonly _labelMyRoom           : TwnsUiLabel.UiLabel;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnNextStep           : TwnsUiButton.UiButton;

        private readonly _groupRoomList         : eui.Group;
        private readonly _listRoom              : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading          : TwnsUiLabel.UiLabel;

        private _hasReceivedData    = false;

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

        protected _onOpened(): void {
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

        private _onNotifyMsgMcrJoinRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrDeletePlayer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrExitRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
            if (data.roomId === McrJoinModel.getJoinedPreviewingRoomId()) {
                this._updateCommonMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
            }
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
                    pageClass   : TwnsCommonMapInfoPage.CommonMapInfoPage,
                    pageData    : await this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : McrRoomPlayerInfoPage,
                    pageData    : { roomId: null } as OpenDataForMcrRoomPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : TwnsCommonWarBasicSettingsPage.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
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

                const tab = this._tabSettings;
                tab.updatePageData(1, { roomId } as OpenDataForMcrRoomPlayerInfoPage);
                tab.updatePageData(3, { roomId } as OpenDataForMcrRoomAdvancedSettingsPage);
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

        private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonMapInfoPage> {
            const mapId = (await McrModel.getRoomInfo(McrJoinModel.getJoinedPreviewingRoomId()))?.settingsForMcw?.mapId;
            return mapId == null
                ? {}
                : { mapInfo : { mapId, }, };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await McrModel.createDataForCommonWarBasicSettingsPage(McrJoinModel.getJoinedPreviewingRoomId(), true);
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
                { type: NotifyType.McrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMcrJoinedPreviewingRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomId            = this.data.roomId;
            this._imgRed.visible    = await McrModel.checkIsRedForRoom(roomId);

            const roomInfo  = await McrModel.getRoomInfo(roomId);
            const warName   = roomInfo.settingsForMcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMcw.mapId).then(v => this._labelName.text = v);
            }
        }

        private _onNotifyMcrJoinedPreviewingRoomIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            McrJoinModel.setJoinedPreviewingRoomId(this.data.roomId);
        }

        private _onTouchTapBtnNext(): void {
            McrMyRoomListPanel.hide();
            TwnsMcrRoomInfoPanel.McrRoomInfoPanel.show({
                roomId  : this.data.roomId,
            });
        }

        private _updateState(): void {
            this.currentState = this.data.roomId === McrJoinModel.getJoinedPreviewingRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsMcrMyRoomListPanel;
