
// import TwnsChatPanel                        from "../../chat/view/ChatPanel";
// import TwnsCommonConfirmPanel               from "../../common/view/CommonConfirmPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import MfrModel                             from "../../multiFreeRoom/model/MfrModel";
// import MfrProxy                             from "../../multiFreeRoom/model/MfrProxy";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import ConfigManager                        from "../../tools/helpers/ConfigManager";
// import FloatText                            from "../../tools/helpers/FloatText";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/NotifyType";
// import ProtoTypes                           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiImage                          from "../../tools/ui/UiImage";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarCommonHelpers                     from "../../tools/warHelpers/WarCommonHelpers";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                            from "../../user/model/UserModel";
// import TwnsMfrMyRoomListPanel               from "./MfrMyRoomListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiFreeRoom {
    import OpenDataForCommonWarMapInfoPage          = Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = Common.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import LangTextType                             = Lang.LangTextType;
    import NotifyType                               = Notify.NotifyType;
    import NetMessage                               = CommonProto.NetMessage;

    export type OpenDataForMfrRoomInfoPanel = {
        roomId  : number;
    };
    export class MfrRoomInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForMfrRoomInfoPanel> {
        private readonly _groupTab!                 : eui.Group;
        private readonly _tabSettings!              : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarPlayerInfoPage>;

        private readonly _groupNavigator!           : eui.Group;
        private readonly _labelMultiPlayer!         : TwnsUiLabel.UiLabel;
        private readonly _labelMyRoom!              : TwnsUiLabel.UiLabel;
        private readonly _labelRoomInfo!            : TwnsUiLabel.UiLabel;

        private readonly _groupSettings!            : eui.Group;
        private readonly _groupChooseCo!            : eui.Group;
        private readonly _labelChooseCo!            : TwnsUiLabel.UiLabel;
        private readonly _btnChooseCo!              : TwnsUiButton.UiButton;

        private readonly _groupChoosePlayerIndex!   : eui.Group;
        private readonly _labelChoosePlayerIndex!   : TwnsUiLabel.UiLabel;
        private readonly _sclPlayerIndex!           : TwnsUiScrollList.UiScrollList<DataForPlayerIndexRenderer>;

        private readonly _groupChooseSkinId!        : eui.Group;
        private readonly _labelChooseSkinId!        : TwnsUiLabel.UiLabel;
        private readonly _sclSkinId!                : TwnsUiScrollList.UiScrollList<DataForSkinIdRenderer>;

        private readonly _groupChooseReady!         : eui.Group;
        private readonly _labelChooseReady!         : TwnsUiLabel.UiLabel;
        private readonly _sclReady!                 : TwnsUiScrollList.UiScrollList<DataForReadyRenderer>;

        private readonly _groupButton!              : eui.Group;
        private readonly _btnStartGame!             : TwnsUiButton.UiButton;
        private readonly _btnDeleteRoom!            : TwnsUiButton.UiButton;
        private readonly _btnChat!                  : TwnsUiButton.UiButton;

        private readonly _btnBack!                  : TwnsUiButton.UiButton;

        private _isTabInitialized = false;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
                { ui: this._btnStartGame,   callback: this._onTouchedBtnStartGame },
                { ui: this._btnDeleteRoom,  callback: this._onTouchedBtnDeleteRoom },
                { ui: this._btnChat,        callback: this._onTouchedBtnChat },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,     callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
                { type: NotifyType.MsgMfrGetRoomStaticInfo,     callback: this._onNotifyMsgMfrGetRoomStaticInfo },
                { type: NotifyType.MsgMfrExitRoom,              callback: this._onNotifyMsgMfrExitRoom },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);
            this._sclReady.setItemRenderer(ReadyRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._isTabInitialized = false;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : Common.CommonWarMapInfoPage,
                    pageData    : await this._createDataForCommonMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : Common.CommonWarPlayerInfoPage,
                    pageData    : await this._createDataForCommonWarPlayerInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0002) },
                    pageClass   : Common.CommonWarBasicSettingsPage,
                    pageData    : await this._createDataForCommonWarBasicSettingsPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0003) },
                    pageClass   : Common.CommonWarAdvancedSettingsPage,
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
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            PanelHelpers.open(PanelHelpers.PanelDict.MfrMyRoomListPanel, void 0);
        }

        private async _onTouchedBtnChooseCo(): Promise<void> {
            const roomId                            = this._getOpenData().roomId;
            const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
                MfrModel.getRoomStaticInfo(roomId),
                MfrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
                return;
            }

            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomPlayerInfo.playerDataList?.find(v => v.userId === selfUserId);
            if (selfPlayerData != null) {
                if (selfPlayerData.isReady) {
                    FloatText.show(Lang.getText(LangTextType.A0128));
                } else {
                    const settingsForCommon = Helpers.getExisted(roomStaticInfo.settingsForMfw?.initialWarData?.settingsForCommon);
                    const playerIndex       = Helpers.getExisted(selfPlayerData.playerIndex);
                    const gameConfig        = await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion));
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                        gameConfig,
                        currentCoId         : selfPlayerData.coId ?? null,
                        availableCoIdArray  : WarHelpers.WarRuleHelpers.getAvailableCoIdArrayWithBaseWarRule({
                            baseWarRule         : Helpers.getExisted(settingsForCommon.instanceWarRule),
                            playerIndex,
                            gameConfig,
                        }),
                        callbackOnConfirm   : (newCoId) => {
                            if (newCoId !== selfPlayerData.coId) {
                                MfrProxy.reqMfrSetSelfSettings({
                                    roomId,
                                    playerIndex,
                                    coId                : newCoId,
                                });
                            }
                        },
                    });
                }
            }
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
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0149),
                    callback: () => {
                        MfrProxy.reqMfrDeleteRoom(roomId);
                    },
                });
            }
        }

        private _onTouchedBtnChat(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.ChatPanel, {
                toMfrRoomId: this._getOpenData().roomId,
            });
        }

        private async _onTouchedBtnExitRoom(): Promise<void> {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0126),
                callback: () => {
                    MfrProxy.reqMfrExitRoom(this._getOpenData().roomId);
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMfrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrGetRoomPlayerInfo.IS;
            if (data.roomId !== this._getOpenData().roomId) {
                return;
            }

            const selfUserId = Helpers.getExisted(User.UserModel.getSelfUserId());
            if (!data.roomPlayerInfo?.playerDataList?.some(v => v.userId === selfUserId)) {
                this.close();
                PanelHelpers.open(PanelHelpers.PanelDict.MfrMyRoomListPanel, void 0);
            } else {
                this._updateGroupButton();
                this._updateBtnChooseCo();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMfrGetRoomStaticInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrGetRoomStaticInfo.IS;
            if (data.roomId !== this._getOpenData().roomId) {
                return;
            }

            if (data.roomStaticInfo == null) {
                FloatText.show(Lang.getText(LangTextType.A0019));
                this.close();
                PanelHelpers.open(PanelHelpers.PanelDict.MfrMyRoomListPanel, void 0);
            } else {
                this._updateCommonWarMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private async _onNotifyMsgMfrExitRoom(e: egret.Event): Promise<void> {
            const data      = e.data as NetMessage.MsgMfrExitRoom.IS;
            const roomId    = data.roomId;
            if (roomId === this._getOpenData().roomId) {
                const exitRoomType = data.exitType;
                if (exitRoomType === Types.ExitRoomType.DeletedByRoomOwner) {
                    FloatText.show(Lang.getText(LangTextType.A0127));
                } else if (exitRoomType === Types.ExitRoomType.SelfExit) {
                    FloatText.show(Lang.getText(LangTextType.A0016));
                }

                this.close();
                PanelHelpers.open(PanelHelpers.PanelDict.MfrMyRoomListPanel, void 0);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initSclPlayerIndex(): Promise<void> {
            const roomId                = this._getOpenData().roomId;
            const playersCountUnneutral = Helpers.getExisted((await MfrModel.getRoomStaticInfo(roomId))?.settingsForMfw?.initialWarData?.playerManager?.players).length - 1;
            const dataArray             : DataForPlayerIndexRenderer[] = [];
            for (let playerIndex = CommonConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
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
            const roomId                            = this._getOpenData().roomId;
            const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
                MfrModel.getRoomStaticInfo(roomId),
                MfrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
                return;
            }

            const userId            = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomPlayerInfo.playerDataList?.find(v => v.userId === userId);
            if (selfPlayerData) {
                const gameConfig        = (await Config.ConfigManager.getGameConfig(Helpers.getExisted(roomStaticInfo.settingsForMfw?.initialWarData?.settingsForCommon?.configVersion)));
                this._btnChooseCo.label = gameConfig.getCoBasicCfg(Helpers.getExisted(selfPlayerData.coId))?.name ?? CommonConstants.ErrorTextForUndefined;
            }
        }

        private async _updateGroupButton(): Promise<void> {
            const roomId            = this._getOpenData().roomId;
            const roomInfo          = Helpers.getExisted(await MfrModel.getRoomPlayerInfo(roomId));
            const ownerInfo         = roomInfo.playerDataList?.find(v => v.playerIndex === roomInfo.ownerPlayerIndex);
            const isSelfOwner       = (!!ownerInfo) && (ownerInfo.userId === User.UserModel.getSelfUserId());
            const btnStartGame      = this._btnStartGame;
            btnStartGame.setRedVisible(await MfrModel.checkCanStartGame(roomId));

            const groupButton = this._groupButton;
            groupButton.removeChildren();
            groupButton.addChild(this._btnChat);
            (isSelfOwner) && (groupButton.addChild(this._btnDeleteRoom));
            (isSelfOwner) && (groupButton.addChild(btnStartGame));
        }

        private async _updateCommonWarMapInfoPage(): Promise<void> {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
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

        private async _createDataForCommonMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const roomStaticInfo    = await MfrModel.getRoomStaticInfo(this._getOpenData().roomId);
            const warData           = roomStaticInfo?.settingsForMfw?.initialWarData;
            return warData == null
                ? null
                : {
                    gameConfig  : await Config.ConfigManager.getGameConfig(Helpers.getExisted(warData.settingsForCommon?.configVersion)),
                    hasFog      : warData.settingsForCommon?.instanceWarRule?.ruleForGlobalParams?.hasFogByDefault ?? null,
                    warInfo     : { warData, players: null },
                };
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return MfrModel.createDataForCommonWarPlayerInfoPage(this._getOpenData().roomId);
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
        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
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

    type DataForPlayerIndexRenderer = {
        roomId      : number;
        playerIndex : number;
    };
    class PlayerIndexRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,     callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
                { type: NotifyType.MsgMfrSetSelfSettings,       callback: this._onNotifyMsgMfrSetSelfSettings },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public async onItemTapEvent(): Promise<void> {
            const data                              = this._getData();
            const roomId                            = data.roomId;
            const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
                MfrModel.getRoomStaticInfo(roomId),
                MfrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
                return;
            }

            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = Helpers.getExisted(roomPlayerInfo.playerDataList);
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
                const settingsForCommon     = Helpers.getExisted(roomStaticInfo.settingsForMfw?.initialWarData?.settingsForCommon);
                const currCoId              = Helpers.getExisted(selfPlayerData.coId);
                const availableCoIdArray    = WarHelpers.WarRuleHelpers.getAvailableCoIdArrayWithBaseWarRule({
                    baseWarRule         : Helpers.getExisted(settingsForCommon.instanceWarRule),
                    playerIndex     : newPlayerIndex,
                    gameConfig      : await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion)),
                });
                MfrProxy.reqMfrSetSelfSettings({
                    roomId,
                    playerIndex : newPlayerIndex,
                    coId        : availableCoIdArray.indexOf(currCoId) >= 0 ? currCoId : WarHelpers.WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray),
                });
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMfrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrGetRoomPlayerInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }
        private _onNotifyMsgMfrSetSelfSettings(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrSetSelfSettings.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }

        private async _updateLabelName(): Promise<void> {
            const data      = this._getData();
            const roomInfo  = await MfrModel.getRoomStaticInfo(data.roomId);
            if (roomInfo == null) {
                return;
            }

            const playerIndex       = data.playerIndex;
            const teamIndex         = Helpers.getExisted(WarHelpers.WarRuleHelpers.getTeamIndex(Helpers.getExisted(roomInfo.settingsForMfw?.initialWarData?.settingsForCommon?.instanceWarRule), playerIndex));
            this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(teamIndex)})`;
        }
        private async _updateState(): Promise<void> {
            const data              = this._getData();
            const roomPlayerInfo    = await MfrModel.getRoomPlayerInfo(data.roomId);
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomPlayerInfo ? roomPlayerInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            this.currentState       = ((selfPlayerData) && (data.playerIndex === selfPlayerData.playerIndex)) ? `down` : `up`;
        }
    }

    type DataForSkinIdRenderer = {
        roomId  : number;
        skinId  : number;
    };
    class SkinIdRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkinIdRenderer> {
        private readonly _imgColor! : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,     callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
                { type: NotifyType.MsgMfrSetSelfSettings,       callback: this._onNotifyMsgMfrSetSelfSettings },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        private _onNotifyMsgMfrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrGetRoomPlayerInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateImgColor();
            }
        }
        private _onNotifyMsgMfrSetSelfSettings(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrSetSelfSettings.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateImgColor();
            }
        }

        private async _updateImgColor(): Promise<void> {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                const roomPlayerInfo    = data ? await MfrModel.getRoomPlayerInfo(data.roomId) : null;
                const selfUserId        = User.UserModel.getSelfUserId();
                const playerDataList    = roomPlayerInfo ? roomPlayerInfo.playerDataList : null;
                const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
                this._imgColor.source   = WarHelpers.WarCommonHelpers.getImageSourceForSkinId(skinId, (!!selfPlayerData) && (selfPlayerData.unitAndTileSkinId === skinId));
            }
        }
    }

    type DataForReadyRenderer = {
        roomId      : number;
        isReady     : boolean;
    };
    class ReadyRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForReadyRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgRed!       : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMfrGetRoomPlayerInfo,     callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
                { type: NotifyType.MsgMfrSetReady,              callback: this._onNotifyMsgMfrSetReady },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateStateAndImgRed();
        }

        public async onItemTapEvent(): Promise<void> {
            const data              = this._getData();
            const isReady           = data.isReady;
            const roomId            = data.roomId;
            const roomPlayerInfo    = await MfrModel.getRoomPlayerInfo(roomId);
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomPlayerInfo ? roomPlayerInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
                MfrProxy.reqMfrSetReady(roomId, isReady);
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMfrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrGetRoomPlayerInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateStateAndImgRed();
            }
        }
        private _onNotifyMsgMfrSetReady(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMfrSetReady.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateStateAndImgRed();
            }
        }

        private _updateLabelName(): void {
            const data = this._getData();
            this._labelName.text = Lang.getText(data.isReady ? LangTextType.B0012 : LangTextType.B0013);
        }
        private async _updateStateAndImgRed(): Promise<void> {
            const data              = this._getData();
            const roomPlayerInfo    = await MfrModel.getRoomPlayerInfo(data.roomId);
            const isReady           = data.isReady;
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomPlayerInfo ? roomPlayerInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            const isSelected        = (!!selfPlayerData) && (isReady === selfPlayerData.isReady);
            this.currentState       = isSelected ? `down` : `up`;
            this._imgRed.visible    = (isReady) && (!isSelected);
        }
    }
}

// export default TwnsMfrRoomInfoPanel;
