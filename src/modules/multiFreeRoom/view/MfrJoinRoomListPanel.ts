
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
// import Twns.Notify                       from "../../tools/notify/NotifyType";
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
namespace Twns.MultiFreeRoom {
    import OpenDataForCommonWarAdvancedSettingsPage = Twns.Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = Twns.Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = Twns.Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = Twns.Common.OpenDataForCommonWarPlayerInfoPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = Twns.Notify.NotifyType;

    export type OpenDataForMfrJoinRoomListPanel = {
        filter  : Twns.Types.MfrRoomFilter | null;
    };
    export class MfrJoinRoomListPanel extends TwnsUiPanel.UiPanel<OpenDataForMfrJoinRoomListPanel> {
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

        private _isTabInitialized   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
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
            this._isTabInitialized  = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupRoomList();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setAndReviseSelectedRoomId(newRoomId: number, needScroll: boolean): void {
            const listRoom  = this._listRoom;
            const index     = Twns.Helpers.getExisted(listRoom.getRandomIndex(v => v.roomId === newRoomId));
            listRoom.setSelectedIndex(index);
            this._updateComponentsForTargetRoomInfo();

            if (needScroll) {
                listRoom.scrollVerticalToIndex(index);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMfrJoinRoom(e: egret.Event): void {
            const data      = e.data as CommonProto.NetMessage.MsgMfrJoinRoom.IS;
            const roomId    = Twns.Helpers.getExisted(data.roomId);
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MfrRoomInfoPanel, { roomId });
            FloatText.show(Lang.getFormattedText(LangTextType.F0069, roomId));
        }

        private _onNotifyMsgMfrGetRoomStaticInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrGetRoomStaticInfo.IS;
            if (data.roomId === this._listRoom.getSelectedData()?.roomId) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onNotifyMsgMfrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrGetRoomPlayerInfo.IS;
            if (data.roomId === this._listRoom.getSelectedData()?.roomId) {
                this._updateComponentsForTargetRoomInfo();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MfrMainMenuPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyTopPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const roomId = this._listRoom.getSelectedData()?.roomId;
            if (roomId == null) {
                return;
            }

            const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
                MfrModel.getRoomStaticInfo(roomId),
                MfrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo != null) && (roomPlayerInfo != null)) {
                const settingsForMfw    = Twns.Helpers.getExisted(roomStaticInfo.settingsForMfw);
                const callback          = () => {
                    const joinData = MfrJoinModel.getFastJoinData(roomStaticInfo, roomPlayerInfo);
                    if (joinData) {
                        MfrProxy.reqMfrJoinRoom(joinData);
                    } else {
                        FloatText.show(Lang.getText(LangTextType.A0145));
                    }
                };

                const warPassword = settingsForMfw.warPassword;
                if (!warPassword) {
                    callback();
                } else {
                    Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonJoinRoomPasswordPanel, {
                        mapId               : null,
                        warName             : settingsForMfw.warName ?? null,
                        password            : warPassword,
                        callbackOnSucceed   : callback,
                    });
                }
            }
        }

        private _onTouchedBtnSearch(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MfrSearchRoomPanel, void 0);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initTabSettings(): Promise<void> {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : Twns.Common.CommonWarMapInfoPage,
                    pageData    : await this._createDataForCommonWarMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : Twns.Common.CommonWarPlayerInfoPage,
                    pageData    : await this._createDataForCommonWarPlayerInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : Twns.Common.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : Twns.Common.CommonWarAdvancedSettingsPage,
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

        private async _updateGroupRoomList(): Promise<void> {
            const labelLoading      = this._labelLoading;
            const labelNoRoom       = this._labelNoRoom;
            const listRoom          = this._listRoom;
            const dataArray         = await this._createDataForListRoom();
            labelLoading.visible    = false;
            labelNoRoom.visible     = !dataArray.length;
            listRoom.bindData(dataArray);

            this.setAndReviseSelectedRoomId(dataArray[0]?.roomId, true);
        }

        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = this._listRoom.getSelectedData()?.roomId;
            if (roomId == null) {
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

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const roomId    = this._listRoom.getSelectedData()?.roomId ?? null;
            const warData   = roomId == null
                ? null
                : (await MfrModel.getRoomStaticInfo(roomId))?.settingsForMfw?.initialWarData;
            return warData == null
                ? null
                : {
                    gameConfig  : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(warData.settingsForCommon?.configVersion)),
                    warInfo     : { warData, players: null
                } };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return await MfrModel.createDataForCommonWarPlayerInfoPage(this._listRoom.getSelectedData()?.roomId ?? null);
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return await MfrModel.createDataForCommonWarBasicSettingsPage(this._listRoom.getSelectedData()?.roomId ?? null, false);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return await MfrModel.createDataForCommonWarAdvancedSettingsPage(this._listRoom.getSelectedData()?.roomId ?? null);
        }

        private async _createDataForListRoom(): Promise<DataForRoomRenderer[]> {
            const dataArray: DataForRoomRenderer[] = [];
            for (const roomId of await MfrModel.getUnjoinedRoomIdSet(this._getOpenData().filter)) {
                dataArray.push({
                    roomId,
                    panel   : this,
                });
            }

            return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnSearch,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupRoomList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnSearch,
                beginProps  : { alpha: 1, y: 80 },
                endProps    : { alpha: 0, y: 40 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupRoomList,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
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
        panel   : MfrJoinRoomListPanel;
    };
    class RoomRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgPassword!  : TwnsUiLabel.UiLabel;

        protected async _onDataChanged(): Promise<void> {
            const roomId    = this._getData().roomId;
            const roomInfo  = await MfrModel.getRoomStaticInfo(roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMfw        = Twns.Helpers.getExisted(roomInfo.settingsForMfw);
            this._imgPassword.visible   = !!settingsForMfw.warPassword;
            this._labelName.text        = settingsForMfw.warName || `#${roomId}`;
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedRoomId(data.roomId, false);
        }
    }
}

// export default TwnsMfrJoinRoomListPanel;
