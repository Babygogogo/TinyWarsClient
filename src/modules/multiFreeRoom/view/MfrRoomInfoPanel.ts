
namespace TinyWars.MultiFreeRoom {
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import CommonConstants      = Utility.CommonConstants;
    import ConfigManager        = Utility.ConfigManager;
    import BwWarRuleHelper      = BaseWar.BwWarRuleHelper;
    import BwHelpers            = BaseWar.BwHelpers;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;
    import NetMessage           = ProtoTypes.NetMessage;

    type OpenDataForMfrRoomInfoPanel = {
        roomId  : number;
    }
    export class MfrRoomInfoPanel extends GameUi.UiPanel<OpenDataForMfrRoomInfoPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrRoomInfoPanel;

        private readonly _groupTab          : eui.Group;
        private readonly _tabSettings       : TinyWars.GameUi.UiTab<DataForTabItemRenderer, OpenDataForMfrRoomMapInfoPage | OpenDataForMfrRoomAdvancedSettingsPage | OpenDataForMfrRoomBasicSettingsPage | OpenDataForMfrRoomPlayerInfoPage>;

        private readonly _groupNavigator    : eui.Group;
        private readonly _labelMultiPlayer  : GameUi.UiLabel;
        private readonly _labelMyRoom       : GameUi.UiLabel;
        private readonly _labelRoomInfo     : GameUi.UiLabel;

        private readonly _groupSettings         : eui.Group;
        private readonly _groupChooseCo         : eui.Group;
        private readonly _labelChooseCo         : GameUi.UiLabel;
        private readonly _btnChooseCo           : GameUi.UiButton;

        private readonly _groupChoosePlayerIndex: eui.Group;
        private readonly _labelChoosePlayerIndex: GameUi.UiLabel;
        private readonly _sclPlayerIndex        : GameUi.UiScrollList<DataForPlayerIndexRenderer, PlayerIndexRenderer>;

        private readonly _groupChooseSkinId     : eui.Group;
        private readonly _labelChooseSkinId     : GameUi.UiLabel;
        private readonly _sclSkinId             : GameUi.UiScrollList<DataForSkinIdRenderer, SkinIdRenderer>;

        private readonly _groupChooseReady      : eui.Group;
        private readonly _labelChooseReady      : GameUi.UiLabel;
        private readonly _sclReady              : GameUi.UiScrollList<DataForReadyRenderer, ReadyRenderer>;

        private readonly _groupButton       : eui.Group;
        private readonly _btnStartGame      : TinyWars.GameUi.UiButton;
        private readonly _btnDeleteRoom     : TinyWars.GameUi.UiButton;
        private readonly _btnChat           : TinyWars.GameUi.UiButton;

        private readonly _btnBack           : TinyWars.GameUi.UiButton;

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

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnStartGame,   callback: this._onTouchedBtnStartGame },
                { ui: this._btnDeleteRoom,  callback: this._onTouchedBtnDeleteRoom },
                { ui: this._btnChat,        callback: this._onTouchedBtnChat },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetRoomInfo,          callback: this._onMsgMfrGetRoomInfo },
                { type: Notify.Type.MsgMfrSetSelfSettings,      callback: this._onMsgMfrSetSelfSettings },
                { type: Notify.Type.MsgMfrSetReady,             callback: this._onMsgMfrSetReady },
                { type: Notify.Type.MsgMfrExitRoom,             callback: this._onMsgMfrExitRoom },
                { type: Notify.Type.MsgMfrDeleteRoomByServer,   callback: this._onMsgMfrDeleteRoomByServer },
                { type: Notify.Type.MsgMfrStartWar,             callback: this._onMsgMfrStartWar },
                { type: Notify.Type.MsgMfrDeletePlayer,         callback: this._onMsgMfrDeletePlayer },
                { type: Notify.Type.MsgMfrGetOwnerPlayerIndex,  callback: this._onMsgMfrGetOwnerPlayerIndex },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);
            this._sclReady.setItemRenderer(ReadyRenderer);

            this._showOpenAnimation();

            const roomId = this._getOpenData().roomId;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0298) },
                    pageClass   : MfrRoomMapInfoPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMfrRoomMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                    pageClass   : MfrRoomPlayerInfoPage,
                    pageData    : {
                        roomId,
                    } as OpenDataForMfrRoomPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : MfrRoomBasicSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMfrRoomBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : MfrRoomAdvancedSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMfrRoomAdvancedSettingsPage,
                },
            ]);

            this._initSclPlayerIndex();
            this._initSclSkinId();
            this._initSclReady();
            this._updateComponentsForLanguage();
            this._updateBtnChooseCo();
            this._updateGroupButton();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._tabSettings.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            MfrMyRoomListPanel.show();
        }

        private _onTouchedBtnStartGame(e: egret.TouchEvent): void {
            const roomId = this._getOpenData().roomId;
            if (roomId != null) {
                MfrProxy.reqMfrStartWar(roomId);
            }
        }

        private _onTouchedBtnDeleteRoom(e: egret.TouchEvent): void {
            const roomId = this._getOpenData().roomId;
            if (roomId != null) {
                CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0149),
                    callback: () => {
                        MfrProxy.reqMfrDeleteRoomByPlayer(roomId);
                    },
                });
            }
        }

        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            Chat.ChatPanel.show({
                toMfrRoomId: this._getOpenData().roomId,
            });
        }

        private async _onTouchedBtnExitRoom(e: egret.TouchEvent): Promise<void> {
            CommonConfirmPanel.show({
                content : Lang.getText(Lang.Type.A0126),
                callback: () => {
                    MfrProxy.reqMfrExitRoom(this._getOpenData().roomId);
                },
            });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgMfrGetRoomInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
                this._updateBtnChooseCo();
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
                const userId        = User.UserModel.getSelfUserId();
                const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
                if (playerData) {
                    this._updateGroupButton();
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0016));
                    this.close();
                    MfrMyRoomListPanel.show();
                }
            }
        }

        private _onMsgMfrDeleteRoomByServer(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrDeleteRoomByServer.IS;
            if (data.roomId === this._getOpenData().roomId) {
                FloatText.show(Lang.getText(Lang.Type.A0019));
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
            if ((data.roomId === this._getOpenData().roomId) && (data.targetUserId === User.UserModel.getSelfUserId())) {
                FloatText.show(Lang.getText(Lang.Type.A0127));
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
            this._labelMultiPlayer.text         = Lang.getText(Lang.Type.B0137);
            this._labelMyRoom.text              = Lang.getText(Lang.Type.B0410);
            this._labelRoomInfo.text            = Lang.getText(Lang.Type.B0398);
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._labelChooseCo.text            = Lang.getText(Lang.Type.B0587);
            this._labelChoosePlayerIndex.text   = Lang.getText(Lang.Type.B0572);
            this._labelChooseSkinId.text        = Lang.getText(Lang.Type.B0586);
            this._labelChooseReady.text         = Lang.getText(Lang.Type.B0402);
            this._btnStartGame.label            = Lang.getText(Lang.Type.B0401);
            this._btnDeleteRoom.label           = Lang.getText(Lang.Type.B0400);
            this._btnChat.label                 = Lang.getText(Lang.Type.B0383);
        }

        private async _updateBtnChooseCo(): Promise<void> {
            const roomInfo          = await MfrModel.getRoomInfo(this._getOpenData().roomId);
            const userId            = User.UserModel.getSelfUserId();
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
            const isSelfOwner       = (!!ownerInfo) && (ownerInfo.userId === User.UserModel.getSelfUserId());
            const btnStartGame      = this._btnStartGame;
            btnStartGame.setRedVisible(await MfrModel.checkCanStartGame(roomId));

            const groupButton = this._groupButton;
            groupButton.removeChildren();
            groupButton.addChild(this._btnChat);
            (isSelfOwner) && (groupButton.addChild(this._btnDeleteRoom));
            (isSelfOwner) && (groupButton.addChild(btnStartGame));
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
    }
    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }

    type DataForPlayerIndexRenderer = {
        roomId      : number;
        playerIndex : number;
    }
    class PlayerIndexRenderer extends GameUi.UiListItemRenderer<DataForPlayerIndexRenderer> {
        private readonly _labelName : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetRoomInfo,      callback: this._onNotifyMsgMfrGetRoomInfo },
                { type: Notify.Type.MsgMfrSetSelfSettings,  callback: this._onNotifyMsgMfrSetSelfSettings },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelName();
            this._updateState();
        }

        public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
            const data              = this.data;
            const roomId            = data.roomId;
            const roomInfo          = data ? await MfrModel.getRoomInfo(roomId) : null;
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if (selfPlayerData == null) {
                return;
            }

            if (selfPlayerData.isReady) {
                FloatText.show(Lang.getText(Lang.Type.A0128));
                return;
            }

            const newPlayerIndex    = data.playerIndex;
            const currPlayerData    = playerDataList.some(v => v.playerIndex === newPlayerIndex);
            if (currPlayerData) {
                if (currPlayerData !== selfPlayerData) {
                    FloatText.show(Lang.getText(Lang.Type.A0202));
                }
            } else {
                MfrProxy.reqMfrSetSelfSettings({
                    roomId,
                    playerIndex : newPlayerIndex,
                });
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
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
                const teamIndex         = roomInfo ? BwWarRuleHelper.getTeamIndex(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex) : null;
                this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(teamIndex)})`;
            }
        }
        private async _updateState(): Promise<void> {
            const data              = this.data;
            const roomInfo          = data ? await MfrModel.getRoomInfo(data.roomId) : null;
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            this.currentState       = ((selfPlayerData) && (data.playerIndex === selfPlayerData.playerIndex)) ? `down` : `up`;
        }
    }

    type DataForSkinIdRenderer = {
        roomId  : number;
        skinId  : number;
    }
    class SkinIdRenderer extends GameUi.UiListItemRenderer<DataForSkinIdRenderer> {
        private readonly _imgColor  : GameUi.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgMfrGetRoomInfo,      callback: this._onNotifyMsgMfrGetRoomInfo },
                { type: Notify.Type.MsgMfrSetSelfSettings,  callback: this._onNotifyMsgMfrSetSelfSettings },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

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
                const selfUserId        = User.UserModel.getSelfUserId();
                const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
                const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
                this._imgColor.source   = BwHelpers.getImageSourceForSkinId(skinId, (!!selfPlayerData) && (selfPlayerData.unitAndTileSkinId === skinId));
            }
        }
    }

    type DataForReadyRenderer = {
        roomId      : number;
        isReady     : boolean;
    }
    class ReadyRenderer extends GameUi.UiListItemRenderer<DataForReadyRenderer> {
        private readonly _labelName : GameUi.UiLabel;
        private readonly _imgRed    : GameUi.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
                { type: Notify.Type.MsgMfrSetReady,     callback: this._onNotifyMsgMfrSetReady },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelName();
            this._updateStateAndImgRed();
        }

        public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
            const data              = this.data;
            const isReady           = data.isReady;
            const roomId            = data.roomId;
            const roomInfo          = await MfrModel.getRoomInfo(roomId);
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
                MfrProxy.reqMfrSetReady(roomId, isReady);
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
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
                this._labelName.text = Lang.getText(data.isReady ? Lang.Type.B0012 : Lang.Type.B0013);
            }
        }
        private async _updateStateAndImgRed(): Promise<void> {
            const data              = this.data;
            const roomInfo          = await MfrModel.getRoomInfo(data.roomId);
            const isReady           = data.isReady;
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            const isSelected        = (!!selfPlayerData) && (isReady === selfPlayerData.isReady);
            this.currentState       = isSelected ? `down` : `up`;
            this._imgRed.visible    = (isReady) && (!isSelected);
        }
    }
}
