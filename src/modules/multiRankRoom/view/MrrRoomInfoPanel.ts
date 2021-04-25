
namespace TinyWars.MultiRankRoom {
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

    type OpenDataForMrrRoomInfoPanel = {
        roomId  : number;
    }
    export class MrrRoomInfoPanel extends GameUi.UiPanel<OpenDataForMrrRoomInfoPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrRoomInfoPanel;

        private readonly _groupTab          : eui.Group;
        private readonly _tabSettings       : TinyWars.GameUi.UiTab<DataForTabItemRenderer, OpenDataForMrrRoomMapInfoPage | OpenDataForMrrRoomPlayerInfoPage | OpenDataForMrrRoomBasicSettingsPage | OpenDataForMrrRoomAdvancedSettingsPage>;

        private readonly _groupNavigator    : eui.Group;
        private readonly _labelRankMatch    : GameUi.UiLabel;
        private readonly _labelMyRoom       : GameUi.UiLabel;
        private readonly _labelRoomInfo     : GameUi.UiLabel;

        private readonly _groupBanCo            : eui.Group;
        private readonly _btnBanCo              : GameUi.UiButton;
        private readonly _btnBannedCo           : GameUi.UiButton;
        private readonly _labelBanCo            : GameUi.UiLabel;

        private readonly _groupSettings         : eui.Group;
        private readonly _groupChooseCo         : eui.Group;
        private readonly _labelChooseCo         : GameUi.UiLabel;
        private readonly _btnChooseCo           : GameUi.UiButton;

        private readonly _groupChoosePlayerIndex: eui.Group;
        private readonly _labelChoosePlayerIndex: GameUi.UiLabel;
        private readonly _sclPlayerIndex        : GameUi.UiScrollList<DataForPlayerIndexRenderer>;

        private readonly _groupChooseSkinId     : eui.Group;
        private readonly _labelChooseSkinId     : GameUi.UiLabel;
        private readonly _sclSkinId             : GameUi.UiScrollList<DataForSkinIdRenderer>;

        private readonly _groupChooseReady      : eui.Group;
        private readonly _labelChooseReady      : GameUi.UiLabel;
        private readonly _sclReady              : GameUi.UiScrollList<DataForReadyRenderer>;

        private readonly _groupState            : eui.Group;
        private readonly _labelState            : GameUi.UiLabel;

        private readonly _btnBack               : TinyWars.GameUi.UiButton;

        public static show(openData: OpenDataForMrrRoomInfoPanel): void {
            if (!MrrRoomInfoPanel._instance) {
                MrrRoomInfoPanel._instance = new MrrRoomInfoPanel();
            }
            MrrRoomInfoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (MrrRoomInfoPanel._instance) {
                await MrrRoomInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrRoomInfoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnBanCo,       callback: this._onTouchedBtnBanCo },
                { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
                { type: Notify.Type.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
                { type: Notify.Type.MsgMrrSetBannedCoIdList,    callback: this._onNotifyMsgMrrSetBannedCoIdList },
                { type: Notify.Type.MsgMrrDeleteRoomByServer,   callback: this._onNotifyMsgMrrDeleteRoomByServer },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);
            this._sclReady.setItemRenderer(ReadyRenderer);
            this._btnBanCo.setRedVisible(true);

            this._showOpenAnimation();

            const roomId = this._getOpenData().roomId;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0298) },
                    pageClass   : MrrRoomMapInfoPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMrrRoomMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                    pageClass   : MrrRoomPlayerInfoPage,
                    pageData    : {
                        roomId,
                    } as OpenDataForMrrRoomPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : MrrRoomBasicSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMrrRoomBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : MrrRoomAdvancedSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMrrRoomAdvancedSettingsPage,
                },
            ]);

            this._initSclPlayerIndex();
            this._initSclSkinId();
            this._initSclReady();
            this._updateComponentsForLanguage();
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            MrrMyRoomListPanel.show();
        }

        private async _onTouchedBtnBanCo(e: egret.TouchEvent): Promise<void> {
            const roomInfo          = await MrrModel.getRoomInfo(this._getOpenData().roomId);
            const userId            = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
            if (selfPlayerData) {
                MrrRoomAvailableCoPanel.show({ roomInfo, srcPlayerIndex: selfPlayerData.playerIndex });
            }
        }

        private async _onTouchedBtnChooseCo(e: egret.TouchEvent): Promise<void> {
            const roomId            = this._getOpenData().roomId;
            const roomInfo          = await MrrModel.getRoomInfo(roomId);
            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === selfUserId) : null;
            if (selfPlayerData != null) {
                if (selfPlayerData.isReady) {
                    FloatText.show(Lang.getText(Lang.Type.A0207));
                } else {
                    MrrRoomChooseCoPanel.show({
                        roomInfo,
                        playerIndex: selfPlayerData.playerIndex,
                    });
                }
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupBanCo();
                this._updateGroupSettings();
                this._updateGroupState();
                this._updateBtnChooseCo();
            }
        }

        private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrSetSelfSettings.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupState();
                this._updateBtnChooseCo();
            }
        }

        private _onNotifyMsgMrrSetBannedCoIdList(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrSetBannedCoIdList.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupBanCo();
                this._updateGroupState();
            }
        }

        private _onNotifyMsgMrrDeleteRoomByServer(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrDeleteRoomByServer.IS;
            if (data.roomId === this._getOpenData().roomId) {
                FloatText.show(Lang.getText(Lang.Type.A0019));
                this.close();
                MrrMyRoomListPanel.show();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initSclPlayerIndex(): Promise<void> {
            const roomId                = this._getOpenData().roomId;
            const roomInfo              = await MrrModel.getRoomInfo(roomId);
            const playersCountUnneutral = roomInfo ? (await WarMap.WarMapModel.getRawData(roomInfo.settingsForMrw.mapId)).playersCountUnneutral : null;
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
            this._labelRankMatch.text           = Lang.getText(Lang.Type.B0404);
            this._labelMyRoom.text              = Lang.getText(Lang.Type.B0410);
            this._labelRoomInfo.text            = Lang.getText(Lang.Type.B0398);
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._btnBanCo.label                = Lang.getText(Lang.Type.B0590);
            this._btnBannedCo.label             = Lang.getText(Lang.Type.B0591);
            this._labelChooseCo.text            = Lang.getText(Lang.Type.B0145);
            this._labelChoosePlayerIndex.text   = Lang.getText(Lang.Type.B0572);
            this._labelChooseSkinId.text        = Lang.getText(Lang.Type.B0573);
            this._labelChooseReady.text         = Lang.getText(Lang.Type.B0402);
        }

        private async _updateGroupBanCo(): Promise<void> {
            const roomInfo  = await MrrModel.getRoomInfo(this._getOpenData().roomId);
            const group     = this._groupBanCo;
            if ((!roomInfo) || (roomInfo.timeForStartSetSelfSettings != null)) {
                group.visible = false;
            } else {
                group.visible = true;

                const userId        = User.UserModel.getSelfUserId();
                const playerData    = roomInfo.playerDataList.find(v => v.userId === userId);
                const playerIndex   = playerData.playerIndex;
                const banCoData     = (roomInfo.settingsForMrw.dataArrayForBanCo || []).find(v => v.srcPlayerIndex === playerIndex);
                const btnBanCo      = this._btnBanCo;
                const btnBannedCo   = this._btnBannedCo;
                const labelBanCo    = this._labelBanCo;
                if (banCoData == null) {
                    btnBanCo.visible    = true;
                    btnBannedCo.visible = false;
                    labelBanCo.text     = null;
                } else {
                    const coIdArray     = banCoData.bannedCoIdList || [];
                    btnBanCo.visible    = false;
                    btnBannedCo.visible = true;
                    labelBanCo.text     = coIdArray.length
                        ? coIdArray.map(v => ConfigManager.getCoBasicCfg(roomInfo.settingsForCommon.configVersion, v).name).join(`\n`)
                        : Lang.getText(Lang.Type.B0001);
                }
            }
        }

        private async _updateGroupSettings(): Promise<void> {
            const roomInfo  = await MrrModel.getRoomInfo(this._getOpenData().roomId);
            const group     = this._groupSettings;
            if ((!roomInfo) || (roomInfo.timeForStartSetSelfSettings == null)) {
                group.visible = false;
            } else {
                group.visible = true;

                this._updateBtnChooseCo();
            }
        }

        private async _updateBtnChooseCo(): Promise<void> {
            const roomInfo          = await MrrModel.getRoomInfo(this._getOpenData().roomId);
            const userId            = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
            if (selfPlayerData) {
                this._btnChooseCo.label = ConfigManager.getCoBasicCfg(roomInfo.settingsForCommon.configVersion, selfPlayerData.coId).name;
            }
        }

        private async _updateGroupState(): Promise<void> {
            const roomInfo      = await MrrModel.getRoomInfo(this._getOpenData().roomId);
            const labelState    = this._labelState;
            if (!roomInfo) {
                labelState.text = null;
                return;
            }

            const userId        = User.UserModel.getSelfUserId();
            const playerData    = roomInfo.playerDataList.find(v => v.userId === userId);
            const playerIndex   = playerData.playerIndex;
            if (roomInfo.timeForStartSetSelfSettings == null) {
                labelState.text = ((roomInfo.settingsForMrw.dataArrayForBanCo || []).some(v => v.srcPlayerIndex === playerIndex))
                    ? Lang.getText(Lang.Type.A0133)
                    : Lang.getText(Lang.Type.A0210);
            } else {
                labelState.text = playerData.isReady
                    ? Lang.getText(Lang.Type.A0134)
                    : Lang.getText(Lang.Type.A0211);
            }
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
                obj         : this._groupBanCo,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupSettings,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupState,
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
                    obj         : this._groupBanCo,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupSettings,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupState,
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
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
                { type: Notify.Type.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelName();
            this._updateState();
        }

        public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
            FloatText.show(Lang.getText(Lang.Type.A0209));
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMrrGetRoomPublicInfo.IS;
            if (data.roomId === this.data.roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }
        private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMrrSetSelfSettings.IS;
            if (data.roomId === this.data.roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }

        private async _updateLabelName(): Promise<void> {
            const data = this.data;
            if (data) {
                const playerIndex       = data.playerIndex;
                this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(BwWarRuleHelper.getTeamIndex((await MrrModel.getRoomInfo(data.roomId)).settingsForCommon.warRule, playerIndex))})`;
            }
        }
        private async _updateState(): Promise<void> {
            const data              = this.data;
            const roomInfo          = data ? await MrrModel.getRoomInfo(data.roomId) : null;
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
                { type: Notify.Type.MrrSelfSettingsSkinIdChanged,   callback: this._onNotifyMrrSelfSettingsSkinIdChanged },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateImgColor();
        }

        public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
            const data              = this.data;
            const roomInfo          = data ? await MrrModel.getRoomInfo(data.roomId) : null;
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if (selfPlayerData == null) {
                return;
            }
            if (selfPlayerData.isReady) {
                FloatText.show(Lang.getText(Lang.Type.A0207));
                return;
            }

            const newSkinId         = data.skinId;
            const currPlayerData    = playerDataList.some(v => (v.isReady) && (v.unitAndTileSkinId === newSkinId));
            if ((currPlayerData) && (currPlayerData !== selfPlayerData)) {
                FloatText.show(Lang.getText(Lang.Type.A0203));
            } else {
                MrrModel.SelfSettings.setUnitAndTileSkinId(newSkinId);
            }
        }
        private _onNotifyMrrSelfSettingsSkinIdChanged(e: egret.Event): void {
            this._updateImgColor();
        }

        private _updateImgColor(): void {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                this._imgColor.source   = BwHelpers.getImageSourceForSkinId(skinId, MrrModel.SelfSettings.getUnitAndTileSkinId() === skinId);
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
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
                { type: Notify.Type.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
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
            const roomInfo          = await MrrModel.getRoomInfo(roomId);
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
                if (!isReady) {
                    FloatText.show(Lang.getText(Lang.Type.A0205));
                } else {
                    const coId      = MrrModel.SelfSettings.getCoId();
                    const callback  = () => {
                        CommonConfirmPanel.show({
                            content : Lang.getText(Lang.Type.A0206),
                            callback: () => {
                                MrrProxy.reqMrrSetSelfSettings(roomId, coId, MrrModel.SelfSettings.getUnitAndTileSkinId());
                            },
                        });
                    };
                    if ((coId == CommonConstants.CoEmptyId)                                                             &&
                        ((MrrModel.SelfSettings.getAvailableCoIdArray() || []).some(v => v !== CommonConstants.CoEmptyId))
                    ) {
                        CommonConfirmPanel.show({
                            content : Lang.getText(Lang.Type.A0208),
                            callback,
                        });
                    } else {
                        callback();
                    }
                }
            }
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMrrGetRoomPublicInfo.IS;
            if (data.roomId === this.data.roomId) {
                this._updateStateAndImgRed();
            }
        }
        private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMrrSetSelfSettings.IS;
            if (data.roomId === this.data.roomId) {
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
            const roomInfo          = await MrrModel.getRoomInfo(data.roomId);
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
