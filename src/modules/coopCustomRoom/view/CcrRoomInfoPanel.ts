
// import TwnsChatPanel                        from "../../chat/view/ChatPanel";
// import TwnsCommonChooseCoPanel              from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonConfirmPanel               from "../../common/view/CommonConfirmPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import CcrModel                             from "../../coopCustomRoom/model/CcrModel";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import ConfigManager                        from "../../tools/helpers/ConfigManager";
// import FloatText                            from "../../tools/helpers/FloatText";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import Twns.Notify                       from "../../tools/notify/NotifyType";
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
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import CcrProxy                             from "../model/CcrProxy";
// import TwnsCcrMyRoomListPanel               from "./CcrMyRoomListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CoopCustomRoom {
    import OpenDataForCommonWarMapInfoPage          = Twns.Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = Twns.Common.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import LangTextType                             = Twns.Lang.LangTextType;
    import NotifyType                               = Twns.Notify.NotifyType;
    import NetMessage                               = CommonProto.NetMessage;

    export type OpenDataForCcrRoomInfoPanel = {
        roomId  : number;
    };
    export class CcrRoomInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForCcrRoomInfoPanel> {
        private readonly _groupTab!                 : eui.Group;
        private readonly _tabSettings!              : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarAdvancedSettingsPage>;

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
                { type: NotifyType.MsgCcrGetRoomStaticInfo,     callback: this._onNotifyMsgCcrGetRoomStaticInfo },
                { type: NotifyType.MsgCcrGetRoomPlayerInfo,     callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
                { type: NotifyType.MsgCcrExitRoom,              callback: this._onNotifyMsgCcrExitRoom },
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
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrMyRoomListPanel, void 0);
        }

        private async _onTouchedBtnChooseCo(): Promise<void> {
            const roomId                            = this._getOpenData().roomId;
            const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
                CcrModel.getRoomStaticInfo(roomId),
                CcrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
                return;
            }

            const selfUserId        = Twns.User.UserModel.getSelfUserId();
            const selfPlayerData    = roomPlayerInfo.playerDataList?.find(v => v.userId === selfUserId);
            if (selfPlayerData != null) {
                if (selfPlayerData.isReady) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0128));
                } else {
                    const playerIndex       = Twns.Helpers.getExisted(selfPlayerData.playerIndex);
                    const currentCoId       = selfPlayerData.coId ?? null;
                    const settingsForCommon = Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon);
                    const gameConfig        = await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion));
                    Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                        gameConfig,
                        currentCoId,
                        availableCoIdArray  : WarHelpers.WarRuleHelpers.getAvailableCoIdArrayWithBaseWarRule({
                            baseWarRule         : Twns.Helpers.getExisted(settingsForCommon.instanceWarRule),
                            playerIndex,
                            gameConfig,
                        }),
                        callbackOnConfirm   : (newCoId) => {
                            if (newCoId !== currentCoId) {
                                CcrProxy.reqCcrSetSelfSettings({
                                    roomId,
                                    playerIndex,
                                    coId                : newCoId,
                                    unitAndTileSkinId   : selfPlayerData.unitAndTileSkinId,
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
                CcrProxy.reqCcrStartWar(roomId);
            }
        }

        private _onTouchedBtnDeleteRoom(): void {
            const roomId = this._getOpenData().roomId;
            if (roomId != null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0149),
                    callback: () => {
                        CcrProxy.reqCcrDeleteRoom(roomId);
                    },
                });
            }
        }

        private _onTouchedBtnChat(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.ChatPanel, {
                toCcrRoomId: this._getOpenData().roomId,
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgCcrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgCcrGetRoomPlayerInfo.IS;
            if (data.roomId !== this._getOpenData().roomId) {
                return;
            }

            const selfUserId = Twns.Helpers.getExisted(Twns.User.UserModel.getSelfUserId());
            if (!data.roomPlayerInfo?.playerDataList?.some(v => v.userId === selfUserId)) {
                this.close();
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrMyRoomListPanel, void 0);
            } else {
                this._updateGroupButton();
                this._updateBtnChooseCo();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgCcrGetRoomStaticInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgCcrGetRoomStaticInfo.IS;
            if (data.roomId !== this._getOpenData().roomId) {
                return;
            }

            if (data.roomStaticInfo == null) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0019));
                this.close();
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrMyRoomListPanel, void 0);
            } else {
                this._updateCommonWarMapInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private async _onNotifyMsgCcrExitRoom(e: egret.Event): Promise<void> {
            const data      = e.data as NetMessage.MsgCcrExitRoom.IS;
            const roomId    = data.roomId;
            if (roomId === this._getOpenData().roomId) {
                const exitRoomType = data.exitType;
                if (exitRoomType === Twns.Types.ExitRoomType.DeletedByRoomOwner) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0127));
                } else if (exitRoomType === Twns.Types.ExitRoomType.SelfExit) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0016));
                }

                this.close();
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CcrMyRoomListPanel, void 0);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initSclPlayerIndex(): Promise<void> {
            const roomId                = this._getOpenData().roomId;
            const playersCountUnneutral = Twns.Helpers.getExisted((await WarMap.WarMapModel.getRawData(Twns.Helpers.getExisted((await CcrModel.getRoomStaticInfo(roomId))?.settingsForCcw?.mapId)))?.playersCountUnneutral);
            const dataArray             : DataForPlayerIndexRenderer[] = [];
            for (let playerIndex = Twns.CommonConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
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
            for (let skinId = Twns.CommonConstants.UnitAndTileMinSkinId; skinId <= Twns.CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
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
            this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0646);
            this._labelMyRoom.text              = Lang.getText(LangTextType.B0410);
            this._labelRoomInfo.text            = Lang.getText(LangTextType.B0398);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._labelChooseCo.text            = Lang.getText(LangTextType.B0145);
            this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
            this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0573);
            this._labelChooseReady.text         = Lang.getText(LangTextType.B0402);
            this._btnStartGame.label            = Lang.getText(LangTextType.B0401);
            this._btnDeleteRoom.label           = Lang.getText(LangTextType.B0400);
            this._btnChat.label                 = Lang.getText(LangTextType.B0383);
        }

        private async _updateBtnChooseCo(): Promise<void> {
            const roomId                            = this._getOpenData().roomId;
            const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
                CcrModel.getRoomStaticInfo(roomId),
                CcrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
                return;
            }

            const userId            = Twns.User.UserModel.getSelfUserId();
            const selfPlayerData    = roomPlayerInfo.playerDataList?.find(v => v.userId === userId);
            if (selfPlayerData) {
                const gameConfig        = await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon?.configVersion));
                this._btnChooseCo.label = gameConfig.getCoBasicCfg(Twns.Helpers.getExisted(selfPlayerData.coId))?.name ?? Twns.CommonConstants.ErrorTextForUndefined;
            }
        }

        private async _updateGroupButton(): Promise<void> {
            const roomId            = this._getOpenData().roomId;
            const roomPlayerInfo    = Twns.Helpers.getExisted(await CcrModel.getRoomPlayerInfo(roomId));
            const ownerInfo         = roomPlayerInfo.playerDataList?.find(v => v.playerIndex === roomPlayerInfo.ownerPlayerIndex);
            const isSelfOwner       = (!!ownerInfo) && (ownerInfo.userId === Twns.User.UserModel.getSelfUserId());
            const btnStartGame      = this._btnStartGame;
            btnStartGame.setRedVisible(await CcrModel.checkCanStartGame(roomId));

            const groupButton = this._groupButton;
            groupButton.removeChildren();
            groupButton.addChild(this._btnChat);
            (isSelfOwner) && (groupButton.addChild(this._btnDeleteRoom));
            (isSelfOwner) && (groupButton.addChild(btnStartGame));
        }

        private async _updateCommonWarMapInfoPage(): Promise<void> {
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
            const roomInfo  = await CcrModel.getRoomStaticInfo(this._getOpenData().roomId);
            const mapId     = roomInfo?.settingsForCcw?.mapId;
            return mapId == null
                ? null
                : {
                    gameConfig  : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(roomInfo?.settingsForCommon?.configVersion)),
                    mapInfo     : { mapId },
                };
        }

        private _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return CcrModel.createDataForCommonWarPlayerInfoPage(this._getOpenData().roomId);
        }

        private _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return CcrModel.createDataForCommonWarBasicSettingsPage(this._getOpenData().roomId, true);
        }

        private _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return CcrModel.createDataForCommonWarAdvancedSettingsPage(this._getOpenData().roomId);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Opening/closing animations.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupSettings,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupButton,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupSettings,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupButton,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
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
                { type: NotifyType.MsgCcrGetRoomStaticInfo,     callback: this._onNotifyMsgCcrGetRoomStaticInfo },
                { type: NotifyType.MsgCcrGetRoomPlayerInfo,     callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public async onItemTapEvent(): Promise<void> {
            const openData                          = this._getData();
            const roomId                            = openData.roomId;
            const [roomStaticInfo, roomPlayerInfo]  = await Promise.all([
                CcrModel.getRoomStaticInfo(roomId),
                CcrModel.getRoomPlayerInfo(roomId),
            ]);
            if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
                return;
            }

            const selfUserId        = Twns.User.UserModel.getSelfUserId();
            const playerDataList    = Twns.Helpers.getExisted(roomPlayerInfo.playerDataList);
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                return;
            }

            if (selfPlayerData.isReady) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0128));
                return;
            }

            const newPlayerIndex    = openData.playerIndex;
            const currPlayerData    = playerDataList.some(v => v.playerIndex === newPlayerIndex);
            if (currPlayerData) {
                if (currPlayerData !== selfPlayerData) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0202));
                }
            } else {
                const settingsForCommon     = Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon);
                const currCoId              = Twns.Helpers.getExisted(selfPlayerData.coId);
                const availableCoIdArray    = WarHelpers.WarRuleHelpers.getAvailableCoIdArrayWithBaseWarRule({
                    baseWarRule     : Twns.Helpers.getExisted(settingsForCommon.instanceWarRule),
                    playerIndex     : newPlayerIndex,
                    gameConfig      : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion)),
                });
                CcrProxy.reqCcrSetSelfSettings({
                    roomId,
                    playerIndex         : newPlayerIndex,
                    unitAndTileSkinId   : selfPlayerData.unitAndTileSkinId,
                    coId                : availableCoIdArray.indexOf(currCoId) >= 0 ? currCoId : WarHelpers.WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray),
                });
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgCcrGetRoomStaticInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgCcrGetRoomStaticInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
            }
        }
        private _onNotifyMsgCcrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgCcrGetRoomPlayerInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateState();
            }
        }

        private async _updateLabelName(): Promise<void> {
            const data              = this._getData();
            const roomStaticInfo    = await CcrModel.getRoomStaticInfo(data.roomId);
            if (roomStaticInfo == null) {
                return;
            }

            const playerIndex       = data.playerIndex;
            const teamIndex         = WarHelpers.WarRuleHelpers.getTeamIndex(Twns.Helpers.getExisted(roomStaticInfo.settingsForCommon?.instanceWarRule), playerIndex);
            this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(teamIndex) || Twns.CommonConstants.ErrorTextForUndefined})`;
        }
        private async _updateState(): Promise<void> {
            const data              = this._getData();
            const roomPlayerInfo    = await CcrModel.getRoomPlayerInfo(data.roomId);
            const selfUserId        = Twns.User.UserModel.getSelfUserId();
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
                { type: NotifyType.MsgCcrGetRoomPlayerInfo, callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        public async onItemTapEvent(): Promise<void> {
            const data              = this._getData();
            const roomId            = data.roomId;
            const roomPlayerInfo    = await CcrModel.getRoomPlayerInfo(roomId);
            if (roomPlayerInfo == null) {
                return;
            }

            const selfUserId        = Twns.User.UserModel.getSelfUserId();
            const playerDataList    = Twns.Helpers.getExisted(roomPlayerInfo.playerDataList);
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                return;
            }

            if (selfPlayerData.isReady) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0128));
                return;
            }

            const newSkinId         = data.skinId;
            const currPlayerData    = playerDataList.some(v => v.unitAndTileSkinId === newSkinId);
            if (currPlayerData) {
                if (currPlayerData !== selfPlayerData) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0203));
                }
            } else {
                CcrProxy.reqCcrSetSelfSettings({
                    roomId,
                    playerIndex         : selfPlayerData.playerIndex,
                    unitAndTileSkinId   : newSkinId,
                    coId                : selfPlayerData.coId,
                });
            }
        }
        private _onNotifyMsgCcrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgCcrGetRoomPlayerInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateImgColor();
            }
        }

        private async _updateImgColor(): Promise<void> {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                const roomPlayerInfo    = data ? await CcrModel.getRoomPlayerInfo(data.roomId) : null;
                const selfUserId        = Twns.User.UserModel.getSelfUserId();
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
                { type: NotifyType.MsgCcrGetRoomPlayerInfo,     callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
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
            const roomInfo          = await CcrModel.getRoomPlayerInfo(roomId);
            const selfUserId        = Twns.User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
                CcrProxy.reqCcrSetReady(roomId, isReady);
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgCcrGetRoomPlayerInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgCcrGetRoomPlayerInfo.IS;
            if (data.roomId === this._getData().roomId) {
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
            const data              = this._getData();
            const roomInfo          = await CcrModel.getRoomPlayerInfo(data.roomId);
            const isReady           = data.isReady;
            const selfUserId        = Twns.User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            const isSelected        = (!!selfPlayerData) && (isReady === selfPlayerData.isReady);
            this.currentState       = isSelected ? `down` : `up`;
            this._imgRed.visible    = (isReady) && (!isSelected);
        }
    }
}

// export default TwnsCcrRoomInfoPanel;
