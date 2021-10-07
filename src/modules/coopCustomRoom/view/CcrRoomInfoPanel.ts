
import TwnsChatPanel                        from "../../chat/view/ChatPanel";
import TwnsCommonChooseCoPanel              from "../../common/view/CommonChooseCoPanel";
import TwnsCommonConfirmPanel               from "../../common/view/CommonConfirmPanel";
import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
import CcrModel                             from "../../coopCustomRoom/model/CcrModel";
import CommonConstants                      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers                 from "../../tools/helpers/CompatibilityHelpers";
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
import WarMapModel                          from "../../warMap/model/WarMapModel";
import CcrProxy                             from "../model/CcrProxy";
import TwnsCcrMyRoomListPanel               from "./CcrMyRoomListPanel";

namespace TwnsCcrRoomInfoPanel {
    import CommonConfirmPanel                       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import CcrMyRoomListPanel                       = TwnsCcrMyRoomListPanel.CcrMyRoomListPanel;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import NetMessage                               = ProtoTypes.NetMessage;

    type OpenDataForCcrRoomInfoPanel = {
        roomId  : number;
    };
    export class CcrRoomInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForCcrRoomInfoPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CcrRoomInfoPanel;

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

        public static show(openData: OpenDataForCcrRoomInfoPanel): void {
            if (!CcrRoomInfoPanel._instance) {
                CcrRoomInfoPanel._instance = new CcrRoomInfoPanel();
            }
            CcrRoomInfoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (CcrRoomInfoPanel._instance) {
                await CcrRoomInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/coopCustomRoom/CcrRoomInfoPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
                { ui: this._btnStartGame,   callback: this._onTouchedBtnStartGame },
                { ui: this._btnDeleteRoom,  callback: this._onTouchedBtnDeleteRoom },
                { ui: this._btnChat,        callback: this._onTouchedBtnChat },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgCcrGetRoomInfo,           callback: this._onNotifyMsgCcrGetRoomInfo },
                { type: NotifyType.MsgCcrSetSelfSettings,       callback: this._onNotifyMsgCcrSetSelfSettings },
                { type: NotifyType.MsgCcrSetReady,              callback: this._onNotifyMsgCcrSetReady },
                { type: NotifyType.MsgCcrExitRoom,              callback: this._onNotifyMsgCcrExitRoom },
                { type: NotifyType.MsgCcrDeleteRoomByServer,    callback: this._onNotifyMsgCcrDeleteRoomByServer },
                { type: NotifyType.MsgCcrStartWar,              callback: this._onNotifyMsgCcrStartWar },
                { type: NotifyType.MsgCcrDeletePlayer,          callback: this._onNotifyMsgCcrDeletePlayer },
                { type: NotifyType.MsgCcrGetOwnerPlayerIndex,   callback: this._onNotifyMsgCcrGetOwnerPlayerIndex },
                { type: NotifyType.MsgCcrJoinRoom,              callback: this._onNotifyMsgCcrJoinRoom },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);
            this._sclReady.setItemRenderer(ReadyRenderer);

            this._showOpenAnimation();

            this._isTabInitialized = false;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0298) },
                    pageClass   : TwnsCommonWarMapInfoPage.CommonWarMapInfoPage,
                    pageData    : await this._createDataForCommonWarMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : TwnsCommonWarPlayerInfoPage.CommonWarPlayerInfoPage,
                    pageData    : await this._createDataForCommonWarPlayerInfoPage(),
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
            CcrMyRoomListPanel.show();
        }

        private async _onTouchedBtnChooseCo(): Promise<void> {
            const roomId    = this._getOpenData().roomId;
            const roomInfo  = await CcrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                return;
            }

            const selfUserId        = UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo.playerDataList?.find(v => v.userId === selfUserId);
            if (selfPlayerData != null) {
                if (selfPlayerData.isReady) {
                    FloatText.show(Lang.getText(LangTextType.A0128));
                } else {
                    const playerIndex       = Helpers.getExisted(selfPlayerData.playerIndex);
                    const currentCoId       = selfPlayerData.coId ?? null;
                    const settingsForCommon = Helpers.getExisted(roomInfo.settingsForCommon);
                    TwnsCommonChooseCoPanel.CommonChooseCoPanel.show({
                        currentCoId,
                        availableCoIdArray  : WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                            warRule         : Helpers.getExisted(settingsForCommon.warRule),
                            playerIndex,
                            configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
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
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0149),
                    callback: () => {
                        CcrProxy.reqCcrDeleteRoomByPlayer(roomId);
                    },
                });
            }
        }

        private _onTouchedBtnChat(): void {
            TwnsChatPanel.ChatPanel.show({
                toCcrRoomId: this._getOpenData().roomId,
            });
        }

        private async _onTouchedBtnExitRoom(): Promise<void> {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0126),
                callback: () => {
                    CcrProxy.reqCcrExitRoom(this._getOpenData().roomId);
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgCcrGetRoomInfo.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
                this._updateBtnChooseCo();
                this._updateCommonMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private _onNotifyMsgCcrSetSelfSettings(e: egret.Event): void {
            const data = e.data as NetMessage.MsgCcrSetSelfSettings.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
                this._updateBtnChooseCo();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgCcrSetReady(e: egret.Event): void {
            const data = e.data as NetMessage.MsgCcrSetReady.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private async _onNotifyMsgCcrExitRoom(e: egret.Event): Promise<void> {
            const roomId = (e.data as NetMessage.MsgCcrExitRoom.IS).roomId;
            if (roomId === this._getOpenData().roomId) {
                const selfUserId = UserModel.getSelfUserId();
                if ((await CcrModel.getRoomInfo(roomId))?.playerDataList?.find(v => v.userId === selfUserId)) {
                    this._updateGroupButton();
                    this._updateCommonWarPlayerInfoPage();
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0016));
                    this.close();
                    CcrMyRoomListPanel.show();
                }
            }
        }

        private _onNotifyMsgCcrDeleteRoomByServer(e: egret.Event): void {
            const data = e.data as NetMessage.MsgCcrDeleteRoomByServer.IS;
            if (data.roomId === this._getOpenData().roomId) {
                FloatText.show(Lang.getText(LangTextType.A0019));
                this.close();
                CcrMyRoomListPanel.show();
            }
        }

        private _onNotifyMsgCcrStartWar(e: egret.Event): void {
            const data = e.data as NetMessage.MsgCcrStartWar.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this.close();
                CcrMyRoomListPanel.show();
            }
        }

        private _onNotifyMsgCcrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrDeletePlayer.IS;
            if (data.roomId === this._getOpenData().roomId) {
                if (data.targetUserId !== UserModel.getSelfUserId()) {
                    this._updateGroupButton();
                    this._updateCommonWarPlayerInfoPage();
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0127));
                    this.close();
                    CcrMyRoomListPanel.show();
                }
            }
        }

        private _onNotifyMsgCcrGetOwnerPlayerIndex(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetOwnerPlayerIndex.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupButton();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgCcrJoinRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrJoinRoom.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateCommonWarPlayerInfoPage();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initSclPlayerIndex(): Promise<void> {
            const roomId                = this._getOpenData().roomId;
            const playersCountUnneutral = Helpers.getExisted((await WarMapModel.getRawData(Helpers.getExisted((await CcrModel.getRoomInfo(roomId))?.settingsForCcw?.mapId)))?.playersCountUnneutral);
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
            const roomInfo = await CcrModel.getRoomInfo(this._getOpenData().roomId);
            if (roomInfo) {
                const userId            = UserModel.getSelfUserId();
                const selfPlayerData    = roomInfo.playerDataList?.find(v => v.userId === userId);
                if (selfPlayerData) {
                    this._btnChooseCo.label = ConfigManager.getCoBasicCfg(Helpers.getExisted(roomInfo.settingsForCommon?.configVersion),  Helpers.getExisted(selfPlayerData.coId)).name;
                }
            }
        }

        private async _updateGroupButton(): Promise<void> {
            const roomId            = this._getOpenData().roomId;
            const roomInfo          = Helpers.getExisted(await CcrModel.getRoomInfo(roomId));
            const ownerInfo         = roomInfo.playerDataList?.find(v => v.playerIndex === roomInfo.ownerPlayerIndex);
            const isSelfOwner       = (!!ownerInfo) && (ownerInfo.userId === UserModel.getSelfUserId());
            const btnStartGame      = this._btnStartGame;
            btnStartGame.setRedVisible(await CcrModel.checkCanStartGame(roomId));

            const groupButton = this._groupButton;
            groupButton.removeChildren();
            groupButton.addChild(this._btnChat);
            (isSelfOwner) && (groupButton.addChild(this._btnDeleteRoom));
            (isSelfOwner) && (groupButton.addChild(btnStartGame));
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
            const mapId = (await CcrModel.getRoomInfo(this._getOpenData().roomId))?.settingsForCcw?.mapId;
            return mapId == null
                ? {}
                : { mapInfo: { mapId } };
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
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgCcrGetRoomInfo,      callback: this._onNotifyMsgCcrGetRoomInfo },
                { type: NotifyType.MsgCcrSetSelfSettings,  callback: this._onNotifyMsgCcrSetSelfSettings },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public async onItemTapEvent(): Promise<void> {
            const data      = this._getData();
            const roomId    = data.roomId;
            const roomInfo  = await CcrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                return;
            }

            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = Helpers.getExisted(roomInfo.playerDataList);
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
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
                const settingsForCommon     = Helpers.getExisted(roomInfo.settingsForCommon);
                const currCoId              = Helpers.getExisted(selfPlayerData.coId);
                const availableCoIdArray    = WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                    warRule         : Helpers.getExisted(settingsForCommon.warRule),
                    playerIndex     : newPlayerIndex,
                    configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
                });
                CcrProxy.reqCcrSetSelfSettings({
                    roomId,
                    playerIndex         : newPlayerIndex,
                    unitAndTileSkinId   : selfPlayerData.unitAndTileSkinId,
                    coId                : availableCoIdArray.indexOf(currCoId) >= 0 ? currCoId : WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray),
                });
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }
        private _onNotifyMsgCcrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrSetSelfSettings.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }

        private async _updateLabelName(): Promise<void> {
            const data              = this._getData();
            const playerIndex       = data.playerIndex;
            const teamIndex         = WarRuleHelpers.getTeamIndex(Helpers.getExisted((await CcrModel.getRoomInfo(data.roomId))?.settingsForCommon?.warRule), playerIndex);
            this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(teamIndex) || CommonConstants.ErrorTextForUndefined})`;
        }
        private async _updateState(): Promise<void> {
            const data              = this._getData();
            const roomInfo          = await CcrModel.getRoomInfo(data.roomId);
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
        private readonly _imgColor! : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgCcrGetRoomInfo,      callback: this._onNotifyMsgCcrGetRoomInfo },
                { type: NotifyType.MsgCcrSetSelfSettings,  callback: this._onNotifyMsgCcrSetSelfSettings },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        public async onItemTapEvent(): Promise<void> {
            const data      = this._getData();
            const roomId    = data.roomId;
            const roomInfo  = await CcrModel.getRoomInfo(roomId);
            if (roomInfo == null) {
                return;
            }

            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = Helpers.getExisted(roomInfo.playerDataList);
            const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                return;
            }

            if (selfPlayerData.isReady) {
                FloatText.show(Lang.getText(LangTextType.A0128));
                return;
            }

            const newSkinId         = data.skinId;
            const currPlayerData    = playerDataList.some(v => v.unitAndTileSkinId === newSkinId);
            if (currPlayerData) {
                if (currPlayerData !== selfPlayerData) {
                    FloatText.show(Lang.getText(LangTextType.A0203));
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
        private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateImgColor();
            }
        }
        private _onNotifyMsgCcrSetSelfSettings(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrSetSelfSettings.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateImgColor();
            }
        }

        private async _updateImgColor(): Promise<void> {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                const roomInfo          = data ? await CcrModel.getRoomInfo(data.roomId) : null;
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
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _imgRed!       : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgCcrGetRoomInfo,  callback: this._onNotifyMsgCcrGetRoomInfo },
                { type: NotifyType.MsgCcrSetReady,     callback: this._onNotifyMsgCcrSetReady },
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
            const roomInfo          = await CcrModel.getRoomInfo(roomId);
            const selfUserId        = UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
                CcrProxy.reqCcrSetReady(roomId, isReady);
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateStateAndImgRed();
            }
        }
        private _onNotifyMsgCcrSetReady(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrSetReady.IS;
            if (data.roomId === this._getData().roomId) {
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
            const data              = this._getData();
            const roomInfo          = await CcrModel.getRoomInfo(data.roomId);
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

export default TwnsCcrRoomInfoPanel;
