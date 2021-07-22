
import TwnsChatPanel                        from "../../chat/view/ChatPanel";
import TwnsCommonConfirmPanel               from "../../common/view/CommonConfirmPanel";
import TwnsCommonMapInfoPage                from "../../common/view/CommonMapInfoPage";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import MfrModel                             from "../../multiFreeRoom/model/MfrModel";
import MfrProxy                             from "../../multiFreeRoom/model/MfrProxy";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import ConfigManager                        from "../../tools/helpers/ConfigManager";
import FloatText                            from "../../tools/helpers/FloatText";
import Helpers                              from "../../tools/helpers/Helpers";
import Types                                from "../../tools/helpers/Types";
import Lang                                 from "../../tools/lang/Lang";
import TwnsLangTextType                     from "../../tools/lang/LangTextType";
import TwnsNotifyType                       from "../../tools/notify/NotifyType";
import ProtoTypes                           from "../../tools/proto/ProtoTypes";
import TwnsUiButton                         from "../../tools/ui/UiButton";
import TwnsUiImage                          from "../../tools/ui/UiImage";
import TwnsUiLabel                          from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
import TwnsUiTab                            from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
import WarCommonHelpers                     from "../../tools/warHelpers/WarCommonHelpers";
import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
import UserModel                            from "../../user/model/UserModel";
import TwnsMfrMyRoomListPanel               from "./MfrMyRoomListPanel";
import TwnsMfrRoomPlayerInfoPage            from "./MfrRoomPlayerInfoPage";

namespace TwnsMfrRoomInfoPanel {
    import CommonConfirmPanel                       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import MfrMyRoomListPanel                       = TwnsMfrMyRoomListPanel.MfrMyRoomListPanel;
    import OpenDataForCommonMapInfoPage             = TwnsCommonMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForMfrRoomPlayerInfoPage         = TwnsMfrRoomPlayerInfoPage.OpenDataForMfrRoomPlayerInfoPage;
    import MfrRoomPlayerInfoPage                    = TwnsMfrRoomPlayerInfoPage.MfrRoomPlayerInfoPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import NetMessage                               = ProtoTypes.NetMessage;

    type OpenDataForMfrRoomInfoPanel = {
        roomId  : number;
    };
    export class MfrRoomInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForMfrRoomInfoPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrRoomInfoPanel;

        private readonly _groupTab          : eui.Group;
        private readonly _tabSettings       : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonMapInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForMfrRoomPlayerInfoPage>;

        private readonly _groupNavigator    : eui.Group;
        private readonly _labelMultiPlayer  : TwnsUiLabel.UiLabel;
        private readonly _labelMyRoom       : TwnsUiLabel.UiLabel;
        private readonly _labelRoomInfo     : TwnsUiLabel.UiLabel;

        private readonly _groupSettings         : eui.Group;
        private readonly _groupChooseCo         : eui.Group;
        private readonly _labelChooseCo         : TwnsUiLabel.UiLabel;
        private readonly _btnChooseCo           : TwnsUiButton.UiButton;

        private readonly _groupChoosePlayerIndex: eui.Group;
        private readonly _labelChoosePlayerIndex: TwnsUiLabel.UiLabel;
        private readonly _sclPlayerIndex        : TwnsUiScrollList.UiScrollList<DataForPlayerIndexRenderer>;

        private readonly _groupChooseSkinId     : eui.Group;
        private readonly _labelChooseSkinId     : TwnsUiLabel.UiLabel;
        private readonly _sclSkinId             : TwnsUiScrollList.UiScrollList<DataForSkinIdRenderer>;

        private readonly _groupChooseReady      : eui.Group;
        private readonly _labelChooseReady      : TwnsUiLabel.UiLabel;
        private readonly _sclReady              : TwnsUiScrollList.UiScrollList<DataForReadyRenderer>;

        private readonly _groupButton       : eui.Group;
        private readonly _btnStartGame      : TwnsUiButton.UiButton;
        private readonly _btnDeleteRoom     : TwnsUiButton.UiButton;
        private readonly _btnChat           : TwnsUiButton.UiButton;

        private readonly _btnBack           : TwnsUiButton.UiButton;

        private _isTabInitialized = false;

        public static show(openData: OpenDataForMfrRoomInfoPanel): void {
            if (!MfrRoomInfoPanel._instance) {
                MfrRoomInfoPanel._instance = new MfrRoomInfoPanel();
            }
            MfrRoomInfoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (MfrRoomInfoPanel._instance) {
                await MfrRoomInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrRoomInfoPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnStartGame,   callback: this._onTouchedBtnStartGame },
                { ui: this._btnDeleteRoom,  callback: this._onTouchedBtnDeleteRoom },
                { ui: this._btnChat,        callback: this._onTouchedBtnChat },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMfrGetRoomInfo,          callback: this._onMsgMfrGetRoomInfo },
                { type: NotifyType.MsgMfrSetSelfSettings,      callback: this._onMsgMfrSetSelfSettings },
                { type: NotifyType.MsgMfrSetReady,             callback: this._onMsgMfrSetReady },
                { type: NotifyType.MsgMfrExitRoom,             callback: this._onMsgMfrExitRoom },
                { type: NotifyType.MsgMfrDeleteRoomByServer,   callback: this._onMsgMfrDeleteRoomByServer },
                { type: NotifyType.MsgMfrStartWar,             callback: this._onMsgMfrStartWar },
                { type: NotifyType.MsgMfrDeletePlayer,         callback: this._onMsgMfrDeletePlayer },
                { type: NotifyType.MsgMfrGetOwnerPlayerIndex,  callback: this._onMsgMfrGetOwnerPlayerIndex },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);
            this._sclReady.setItemRenderer(ReadyRenderer);

            this._showOpenAnimation();

            const roomId            = this._getOpenData().roomId;
            this._isTabInitialized  = false;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonMapInfoPage.CommonMapInfoPage,
                    pageData    : await this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : MfrRoomPlayerInfoPage,
                    pageData    : {
                        roomId,
                    } as OpenDataForMfrRoomPlayerInfoPage,
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

            this._initSclPlayerIndex();
            this._initSclSkinId();
            this._initSclReady();
            this._updateComponentsForLanguage();
            this._updateBtnChooseCo();
            this._updateGroupButton();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            MfrMyRoomListPanel.show();
        }

        private _onTouchedBtnStartGame(): void {
            const roomId = this._getOpenData().roomId;
            if (roomId != null) {
                MfrProxy.reqMfrStartWar(roomId);
            }
        }

        private _onTouchedBtnDeleteRoom(): void {
            const roomId = this._getOpenData().roomId;
            if (roomId != null) {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0149),
                    callback: () => {
                        MfrProxy.reqMfrDeleteRoomByPlayer(roomId);
                    },
                });
            }
        }

        private _onTouchedBtnChat(): void {
            TwnsChatPanel.ChatPanel.show({
                toMfrRoomId: this._getOpenData().roomId,
            });
        }

        private async _onTouchedBtnExitRoom(): Promise<void> {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0126),
                callback: () => {
                    MfrProxy.reqMfrExitRoom(this._getOpenData().roomId);
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
                this._updateBtnChooseCo();
                this._updateCommonMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private _onMsgMfrSetSelfSettings(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrSetSelfSettings.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
                this._updateBtnChooseCo();
            }
        }

        private _onMsgMfrSetReady(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrSetReady.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
            }
        }

        private async _onMsgMfrExitRoom(e: egret.Event): Promise<void> {
            const roomId = (e.data as NetMessage.MsgMfrExitRoom.IS).roomId;
            if (roomId === this._getOpenData().roomId) {
                const roomInfo      = await MfrModel.getRoomInfo(roomId);
                const userId        = UserModel.getSelfUserId();
                const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
                if (playerData) {
                    this._updateGroupButton();
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0016));
                    this.close();
                    MfrMyRoomListPanel.show();
                }
            }
        }

        private _onMsgMfrDeleteRoomByServer(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrDeleteRoomByServer.IS;
            if (data.roomId === this._getOpenData().roomId) {
                FloatText.show(Lang.getText(LangTextType.A0019));
                this.close();
                MfrMyRoomListPanel.show();
            }
        }

        private _onMsgMfrStartWar(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrStartWar.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this.close();
                MfrMyRoomListPanel.show();
            }
        }

        private _onMsgMfrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrDeletePlayer.IS;
            if ((data.roomId === this._getOpenData().roomId) && (data.targetUserId === UserModel.getSelfUserId())) {
                FloatText.show(Lang.getText(LangTextType.A0127));
                this.close();
                MfrMyRoomListPanel.show();
            }
        }

        private _onMsgMfrGetOwnerPlayerIndex(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetOwnerPlayerIndex.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initSclPlayerIndex(): Promise<void> {
            const roomId                = this._getOpenData().roomId;
            const roomInfo              = await MfrModel.getRoomInfo(roomId);
            const playersCountUnneutral = roomInfo ? roomInfo.settingsForMfw.initialWarData.playerManager.players.length - 1 : null;
            const dataArray             : DataForPlayerIndexRenderer[] = [];
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({
                    roomId,
                    playerIndex,
                });
            }
            this._sclPlayerIndex.bindData(dataArray);
        }

        private _initSclSkinId(): void {
            const roomId    = this._getOpenData().roomId;
            const dataArray : DataForSkinIdRenderer[] = [];
            for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
                dataArray.push({
                    roomId,
                    skinId,
                });
            }
            this._sclSkinId.bindData(dataArray);
        }

        private _initSclReady(): void {
            const roomId = this._getOpenData().roomId;
            this._sclReady.bindData([
                {
                    roomId,
                    isReady : true,
                },
                {
                    roomId,
                    isReady : false,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0137);
            this._labelMyRoom.text              = Lang.getText(LangTextType.B0410);
            this._labelRoomInfo.text            = Lang.getText(LangTextType.B0398);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._labelChooseCo.text            = Lang.getText(LangTextType.B0587);
            this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
            this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0586);
            this._labelChooseReady.text         = Lang.getText(LangTextType.B0402);
            this._btnStartGame.label            = Lang.getText(LangTextType.B0401);
            this._btnDeleteRoom.label           = Lang.getText(LangTextType.B0400);
            this._btnChat.label                 = Lang.getText(LangTextType.B0383);
        }

        private async _updateBtnChooseCo(): Promise<void> {
            const roomInfo          = await MfrModel.getRoomInfo(this._getOpenData().roomId);
            const userId            = UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
            if (selfPlayerData) {
                this._btnChooseCo.label = ConfigManager.getCoBasicCfg(roomInfo.settingsForMfw.initialWarData.settingsForCommon.configVersion, selfPlayerData.coId).name;
            }
        }

        private async _updateGroupButton(): Promise<void> {
            const roomId            = this._getOpenData().roomId;
            const roomInfo          = await MfrModel.getRoomInfo(roomId);
            const playerDataList    = roomInfo.playerDataList;
            const ownerInfo         = playerDataList.find(v => v.playerIndex === roomInfo.ownerPlayerIndex);
            const isSelfOwner       = (!!ownerInfo) && (ownerInfo.userId === UserModel.getSelfUserId());
            const btnStartGame      = this._btnStartGame;
            btnStartGame.setRedVisible(await MfrModel.checkCanStartGame(roomId));

            const groupButton = this._groupButton;
            groupButton.removeChildren();
            groupButton.addChild(this._btnChat);
            (isSelfOwner) && (groupButton.addChild(this._btnDeleteRoom));
            (isSelfOwner) && (groupButton.addChild(btnStartGame));
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

        private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonMapInfoPage> {
            const warData = (await MfrModel.getRoomInfo(this._getOpenData().roomId))?.settingsForMfw.initialWarData;
            return warData == null
                ? {}
                : { warInfo: { warData } };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return MfrModel.createDataForCommonWarBasicSettingsPage(this._getOpenData().roomId, true);
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return MfrModel.createDataForCommonWarAdvancedSettingsPage(this._getOpenData().roomId);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Opening/closing animations.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupSettings,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupButton,
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
                    obj         : this._groupNavigator,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupSettings,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupButton,
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

    type DataForPlayerIndexRenderer = {
        roomId      : number;
        playerIndex : number;
    };
    class PlayerIndexRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
        private readonly _labelName : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMfrGetRoomInfo,      callback: this._onNotifyMsgMfrGetRoomInfo },
                { type: NotifyType.MsgMfrSetSelfSettings,  callback: this._onNotifyMsgMfrSetSelfSettings },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public async onItemTapEvent(): Promise<void> {
            const data              = this.data;
            const roomId            = data.roomId;
            const roomInfo          = data ? await MfrModel.getRoomInfo(roomId) : null;
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if (selfPlayerData == null) {
                return;
            }

            if (selfPlayerData.isReady) {
                FloatText.show(Lang.getText(LangTextType.A0128));
                return;
            }

            const newPlayerIndex    = data.playerIndex;
            const currPlayerData    = playerDataList.some(v => v.playerIndex === newPlayerIndex);
            if (currPlayerData) {
                if (currPlayerData !== selfPlayerData) {
                    FloatText.show(Lang.getText(LangTextType.A0202));
                }
            } else {
                MfrProxy.reqMfrSetSelfSettings({
                    roomId,
                    playerIndex : newPlayerIndex,
                });
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === this.data.roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }
        private _onNotifyMsgMfrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrSetSelfSettings.IS;
            if (data.roomId === this.data.roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }

        private async _updateLabelName(): Promise<void> {
            const data = this.data;
            if (data) {
                const playerIndex       = data.playerIndex;
                const roomInfo          = await MfrModel.getRoomInfo(data.roomId);
                const teamIndex         = roomInfo ? WarRuleHelpers.getTeamIndex(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex) : null;
                this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(teamIndex)})`;
            }
        }
        private async _updateState(): Promise<void> {
            const data              = this.data;
            const roomInfo          = data ? await MfrModel.getRoomInfo(data.roomId) : null;
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            this.currentState       = ((selfPlayerData) && (data.playerIndex === selfPlayerData.playerIndex)) ? `down` : `up`;
        }
    }

    type DataForSkinIdRenderer = {
        roomId  : number;
        skinId  : number;
    };
    class SkinIdRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkinIdRenderer> {
        private readonly _imgColor  : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgMfrGetRoomInfo,      callback: this._onNotifyMsgMfrGetRoomInfo },
                { type: NotifyType.MsgMfrSetSelfSettings,  callback: this._onNotifyMsgMfrSetSelfSettings },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === this.data.roomId) {
                this._updateImgColor();
            }
        }
        private _onNotifyMsgMfrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrSetSelfSettings.IS;
            if (data.roomId === this.data.roomId) {
                this._updateImgColor();
            }
        }

        private async _updateImgColor(): Promise<void> {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                const roomInfo          = data ? await MfrModel.getRoomInfo(data.roomId) : null;
                const selfUserId        = UserModel.getSelfUserId();
                const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
                const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
                this._imgColor.source   = WarCommonHelpers.getImageSourceForSkinId(skinId, (!!selfPlayerData) && (selfPlayerData.unitAndTileSkinId === skinId));
            }
        }
    }

    type DataForReadyRenderer = {
        roomId      : number;
        isReady     : boolean;
    };
    class ReadyRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForReadyRenderer> {
        private readonly _labelName : TwnsUiLabel.UiLabel;
        private readonly _imgRed    : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
                { type: NotifyType.MsgMfrSetReady,     callback: this._onNotifyMsgMfrSetReady },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateStateAndImgRed();
        }

        public async onItemTapEvent(): Promise<void> {
            const data              = this.data;
            const isReady           = data.isReady;
            const roomId            = data.roomId;
            const roomInfo          = await MfrModel.getRoomInfo(roomId);
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
                MfrProxy.reqMfrSetReady(roomId, isReady);
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === this.data.roomId) {
                this._updateLabelName();
                this._updateStateAndImgRed();
            }
        }
        private _onNotifyMsgMfrSetReady(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrSetReady.IS;
            if (data.roomId === this.data.roomId) {
                this._updateLabelName();
                this._updateStateAndImgRed();
            }
        }

        private _updateLabelName(): void {
            const data = this.data;
            if (data) {
                this._labelName.text = Lang.getText(data.isReady ? LangTextType.B0012 : LangTextType.B0013);
            }
        }
        private async _updateStateAndImgRed(): Promise<void> {
            const data              = this.data;
            const roomInfo          = await MfrModel.getRoomInfo(data.roomId);
            const isReady           = data.isReady;
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            const isSelected        = (!!selfPlayerData) && (isReady === selfPlayerData.isReady);
            this.currentState       = isSelected ? `down` : `up`;
            this._imgRed.visible    = (isReady) && (!isSelected);
        }
    }
}

export default TwnsMfrRoomInfoPanel;
