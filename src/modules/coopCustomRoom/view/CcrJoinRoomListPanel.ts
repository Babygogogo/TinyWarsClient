
import TwnsCommonJoinRoomPasswordPanel      from "../../common/view/CommonJoinRoomPasswordPanel";
import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import CcrModel                             from "../../coopCustomRoom/model/CcrModel";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
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
import WarMapModel                          from "../../warMap/model/WarMapModel";
import CcrJoinModel                         from "../model/CcrJoinModel";
import CcrProxy                             from "../model/CcrProxy";
import TwnsCcrMainMenuPanel                 from "./CcrMainMenuPanel";
import TwnsCcrRoomInfoPanel                 from "./CcrRoomInfoPanel";
import TwnsCcrRoomPlayerInfoPage            from "./CcrRoomPlayerInfoPage";

namespace TwnsCcrJoinRoomListPanel {
    import CcrRoomInfoPanel                         = TwnsCcrRoomInfoPanel.CcrRoomInfoPanel;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCcrRoomPlayerInfoPage         = TwnsCcrRoomPlayerInfoPage.OpenDataForCcrRoomPlayerInfoPage;
    import CcrRoomPlayerInfoPage                    = TwnsCcrRoomPlayerInfoPage.CcrRoomPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;

    export class CcrJoinRoomListPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CcrJoinRoomListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCcrRoomPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

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
        private _isTabInitialized   = false;

        public static show(): void {
            if (!CcrJoinRoomListPanel._instance) {
                CcrJoinRoomListPanel._instance = new CcrJoinRoomListPanel();
            }
            CcrJoinRoomListPanel._instance.open(undefined);
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
            const data = e.data as ProtoTypes.NetMessage.MsgCcrJoinRoom.IS;
            if (data.userId === UserModel.getSelfUserId()) {
                this.close();
                CcrRoomInfoPanel.show({ roomId: data.roomId });
            }
        }

        private _onNotifyMsgCcrDeletePlayer(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgCcrExitRoom(): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
            if (data.roomId === CcrJoinModel.getTargetRoomId()) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsCcrMainMenuPanel.CcrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const roomInfo = await CcrModel.getRoomInfo(CcrJoinModel.getTargetRoomId());
            if (roomInfo) {
                const settingsForCcw    = roomInfo.settingsForCcw;
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
                        warName             : settingsForCcw.warName,
                        mapId               : settingsForCcw.mapId,
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
                    pageData    : await this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : CcrRoomPlayerInfoPage,
                    pageData    : { roomId: null } as OpenDataForCcrRoomPlayerInfoPage,
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

                const tab = this._tabSettings;
                tab.updatePageData(1, { roomId } as OpenDataForCcrRoomPlayerInfoPage);
                this._updateCommonMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private async _updateCommonMapInfoPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
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

        private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const mapId = (await CcrModel.getRoomInfo(CcrJoinModel.getTargetRoomId()))?.settingsForCcw?.mapId;
            return mapId == null
                ? {}
                : { mapInfo: { mapId } };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await CcrModel.createDataForCommonWarBasicSettingsPage(CcrJoinModel.getTargetRoomId(), false);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return await CcrModel.createDataForCommonWarAdvancedSettingsPage(CcrJoinModel.getTargetRoomId());
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
                { type: NotifyType.CcrJoinTargetRoomIdChanged, callback: this._onNotifyCcrJoinTargetRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomInfo = await CcrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForCcw        = roomInfo.settingsForCcw;
            this._imgPassword.visible   = !!settingsForCcw.warPassword;

            const warName = settingsForCcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForCcw.mapId).then(v => this._labelName.text = v);
            }
        }

        private _onNotifyCcrJoinTargetRoomIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            CcrJoinModel.setTargetRoomId(this.data.roomId);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            const roomInfo = await CcrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForCcw    = roomInfo.settingsForCcw;
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
                    warName             : settingsForCcw.warName,
                    mapId               : settingsForCcw.mapId,
                    password            : settingsForCcw.warPassword,
                    callbackOnSucceed   : callback,
                });
            }
        }

        private _updateState(): void {
            this.currentState = this.data.roomId === CcrJoinModel.getTargetRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}

export default TwnsCcrJoinRoomListPanel;
