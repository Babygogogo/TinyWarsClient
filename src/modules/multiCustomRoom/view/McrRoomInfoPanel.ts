
import TwnsUiImage                                                              from "../../tools/ui/UiImage";
import TwnsUiListItemRenderer                                                   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                                                              from "../../tools/ui/UiPanel";
import TwnsUiButton                                                              from "../../tools/ui/UiButton";
import TwnsUiLabel                                                              from "../../tools/ui/UiLabel";
import TwnsUiScrollList                                                         from "../../tools/ui/UiScrollList";
import TwnsUiTab                                                                from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer                                                    from "../../tools/ui/UiTabItemRenderer";
import ChatPanel = TwnsChatPanel.ChatPanel;import TwnsChatPanel                                                            from "../../chat/view/ChatPanel";
import CommonConfirmPanel = TwnsCommonConfirmPanel.CommonConfirmPanel;import TwnsCommonConfirmPanel                                                   from "../../common/view/CommonConfirmPanel";
import { McrMyRoomListPanel }                                                   from "./McrMyRoomListPanel";
import { McrRoomChooseCoPanel }                                                 from "./McrRoomChooseCoPanel";
import { OpenDataForMcrRoomAdvancedSettingsPage, McrRoomAdvancedSettingsPage }  from "./McrRoomAdvancedSettingsPage";
import { OpenDataForMcrRoomBasicSettingsPage, McrRoomBasicSettingsPage }        from "./McrRoomBasicSettingsPage";
import { OpenDataForMcrRoomMapInfoPage, McrRoomMapInfoPage }                    from "./McrRoomMapInfoPage";
import { OpenDataForMcrRoomPlayerInfoPage, McrRoomPlayerInfoPage }              from "./McrRoomPlayerInfoPage";
import CommonConstants                                                      from "../../tools/helpers/CommonConstants";
import ConfigManager                                                        from "../../tools/helpers/ConfigManager";
import FloatText                                                            from "../../tools/helpers/FloatText";
import Helpers                                                              from "../../tools/helpers/Helpers";
import Lang                                                                 from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                                                               from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import ProtoTypes                                                           from "../../tools/proto/ProtoTypes";
import Types                                                                from "../../tools/helpers/Types";
import WarCommonHelpers                                                     from "../../tools/warHelpers/WarCommonHelpers";
import WarRuleHelpers                                                      from "../../tools/warHelpers/WarRuleHelpers";
import McrModel                                                             from "../../multiCustomRoom/model/McrModel";
import McrProxy                                                             from "../../multiCustomRoom/model/McrProxy";
import UserModel                                                            from "../../user/model/UserModel";
import WarMapModel                                                          from "../../warMap/model/WarMapModel";
import NetMessage                                                               = ProtoTypes.NetMessage;

type OpenDataForMcrRoomInfoPanel = {
    roomId  : number;
};
export class McrRoomInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrRoomInfoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McrRoomInfoPanel;

    private readonly _groupTab          : eui.Group;
    private readonly _tabSettings       : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForMcrRoomMapInfoPage | OpenDataForMcrRoomPlayerInfoPage | OpenDataForMcrRoomBasicSettingsPage | OpenDataForMcrRoomAdvancedSettingsPage>;

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

    public static show(openData: OpenDataForMcrRoomInfoPanel): void {
        if (!McrRoomInfoPanel._instance) {
            McrRoomInfoPanel._instance = new McrRoomInfoPanel();
        }
        McrRoomInfoPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (McrRoomInfoPanel._instance) {
            await McrRoomInfoPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrRoomInfoPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
            { ui: this._btnStartGame,   callback: this._onTouchedBtnStartGame },
            { ui: this._btnDeleteRoom,  callback: this._onTouchedBtnDeleteRoom },
            { ui: this._btnChat,        callback: this._onTouchedBtnChat },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMcrGetRoomInfo,          callback: this._onMsgMcrGetRoomInfo },
            { type: NotifyType.MsgMcrSetSelfSettings,      callback: this._onMsgMcrSetSelfSettings },
            { type: NotifyType.MsgMcrSetReady,             callback: this._onMsgMcrSetReady },
            { type: NotifyType.MsgMcrExitRoom,             callback: this._onMsgMcrExitRoom },
            { type: NotifyType.MsgMcrDeleteRoomByServer,   callback: this._onMsgMcrDeleteRoomByServer },
            { type: NotifyType.MsgMcrStartWar,             callback: this._onMsgMcrStartWar },
            { type: NotifyType.MsgMcrDeletePlayer,         callback: this._onMsgMcrDeletePlayer },
            { type: NotifyType.MsgMcrGetOwnerPlayerIndex,  callback: this._onMsgMcrGetOwnerPlayerIndex },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
        this._sclSkinId.setItemRenderer(SkinIdRenderer);
        this._sclReady.setItemRenderer(ReadyRenderer);

        this._showOpenAnimation();

        const roomId = this._getOpenData().roomId;
        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : McrRoomMapInfoPage,
                pageData    : {
                    roomId
                } as OpenDataForMcrRoomMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : McrRoomPlayerInfoPage,
                pageData    : {
                    roomId,
                } as OpenDataForMcrRoomPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : McrRoomBasicSettingsPage,
                pageData    : {
                    roomId
                } as OpenDataForMcrRoomBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : McrRoomAdvancedSettingsPage,
                pageData    : {
                    roomId
                } as OpenDataForMcrRoomAdvancedSettingsPage,
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
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(e: egret.TouchEvent): void {
        this.close();
        McrMyRoomListPanel.show();
    }

    private async _onTouchedBtnChooseCo(e: egret.TouchEvent): Promise<void> {
        const roomId            = this._getOpenData().roomId;
        const roomInfo          = await McrModel.getRoomInfo(roomId);
        const selfUserId        = UserModel.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === selfUserId) : null;
        if (selfPlayerData != null) {
            if (selfPlayerData.isReady) {
                FloatText.show(Lang.getText(LangTextType.A0128));
            } else {
                McrRoomChooseCoPanel.show({
                    roomId,
                    playerIndex: selfPlayerData.playerIndex,
                });
            }
        }
    }

    private _onTouchedBtnStartGame(e: egret.TouchEvent): void {
        const roomId = this._getOpenData().roomId;
        if (roomId != null) {
            McrProxy.reqMcrStartWar(roomId);
        }
    }

    private _onTouchedBtnDeleteRoom(e: egret.TouchEvent): void {
        const roomId = this._getOpenData().roomId;
        if (roomId != null) {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0149),
                callback: () => {
                    McrProxy.reqMcrDeleteRoomByPlayer(roomId);
                },
            });
        }
    }

    private _onTouchedBtnChat(e: egret.TouchEvent): void {
        ChatPanel.show({
            toMcrRoomId: this._getOpenData().roomId,
        });
    }

    private async _onTouchedBtnExitRoom(e: egret.TouchEvent): Promise<void> {
        CommonConfirmPanel.show({
            content : Lang.getText(LangTextType.A0126),
            callback: () => {
                McrProxy.reqMcrExitRoom(this._getOpenData().roomId);
            },
        });
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onMsgMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
            this._updateBtnChooseCo();
        }
    }

    private _onMsgMcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrSetSelfSettings.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
            this._updateBtnChooseCo();
        }
    }

    private _onMsgMcrSetReady(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrSetReady.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
        }
    }

    private async _onMsgMcrExitRoom(e: egret.Event): Promise<void> {
        const roomId = (e.data as NetMessage.MsgMcrExitRoom.IS).roomId;
        if (roomId === this._getOpenData().roomId) {
            const roomInfo      = await McrModel.getRoomInfo(roomId);
            const userId        = UserModel.getSelfUserId();
            const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
            if (playerData) {
                this._updateGroupButton();
            } else {
                FloatText.show(Lang.getText(LangTextType.A0016));
                this.close();
                McrMyRoomListPanel.show();
            }
        }
    }

    private _onMsgMcrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrDeleteRoomByServer.IS;
        if (data.roomId === this._getOpenData().roomId) {
            FloatText.show(Lang.getText(LangTextType.A0019));
            this.close();
            McrMyRoomListPanel.show();
        }
    }

    private _onMsgMcrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrStartWar.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this.close();
            McrMyRoomListPanel.show();
        }
    }

    private _onMsgMcrDeletePlayer(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS;
        if ((data.roomId === this._getOpenData().roomId) && (data.targetUserId === UserModel.getSelfUserId())) {
            FloatText.show(Lang.getText(LangTextType.A0127));
            this.close();
            McrMyRoomListPanel.show();
        }
    }

    private _onMsgMcrGetOwnerPlayerIndex(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrGetOwnerPlayerIndex.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initSclPlayerIndex(): Promise<void> {
        const roomId                = this._getOpenData().roomId;
        const roomInfo              = await McrModel.getRoomInfo(roomId);
        const playersCountUnneutral = roomInfo ? (await WarMapModel.getRawData(roomInfo.settingsForMcw.mapId)).playersCountUnneutral : null;
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
        this._labelChooseCo.text            = Lang.getText(LangTextType.B0145);
        this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
        this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0573);
        this._labelChooseReady.text         = Lang.getText(LangTextType.B0402);
        this._btnStartGame.label            = Lang.getText(LangTextType.B0401);
        this._btnDeleteRoom.label           = Lang.getText(LangTextType.B0400);
        this._btnChat.label                 = Lang.getText(LangTextType.B0383);
    }

    private async _updateBtnChooseCo(): Promise<void> {
        const roomInfo          = await McrModel.getRoomInfo(this._getOpenData().roomId);
        const userId            = UserModel.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
        if (selfPlayerData) {
            this._btnChooseCo.label = ConfigManager.getCoBasicCfg(roomInfo.settingsForCommon.configVersion, selfPlayerData.coId).name;
        }
    }

    private async _updateGroupButton(): Promise<void> {
        const roomId            = this._getOpenData().roomId;
        const roomInfo          = await McrModel.getRoomInfo(roomId);
        const playerDataList    = roomInfo.playerDataList;
        const ownerInfo         = playerDataList.find(v => v.playerIndex === roomInfo.ownerPlayerIndex);
        const isSelfOwner       = (!!ownerInfo) && (ownerInfo.userId === UserModel.getSelfUserId());
        const btnStartGame      = this._btnStartGame;
        btnStartGame.setRedVisible(await McrModel.checkCanStartGame(roomId));

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
            { type: NotifyType.MsgMcrGetRoomInfo,      callback: this._onNotifyMsgMcrGetRoomInfo },
            { type: NotifyType.MsgMcrSetSelfSettings,  callback: this._onNotifyMsgMcrSetSelfSettings },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateLabelName();
        this._updateState();
    }

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        const data              = this.data;
        const roomId            = data.roomId;
        const roomInfo          = data ? await McrModel.getRoomInfo(roomId) : null;
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
            const settingsForCommon     = roomInfo.settingsForCommon;
            const availableCoIdArray    = WarRuleHelpers.getAvailableCoIdArrayForPlayer(settingsForCommon.warRule, newPlayerIndex, settingsForCommon.configVersion);
            const currCoId              = selfPlayerData.coId;
            McrProxy.reqMcrSetSelfSettings({
                roomId,
                playerIndex         : newPlayerIndex,
                unitAndTileSkinId   : selfPlayerData.unitAndTileSkinId,
                coId                : availableCoIdArray.indexOf(currCoId) >= 0 ? currCoId : WarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray),
            });
        }
    }
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateLabelName();
    }
    private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
        if (data.roomId === this.data.roomId) {
            this._updateLabelName();
            this._updateState();
        }
    }
    private _onNotifyMsgMcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS;
        if (data.roomId === this.data.roomId) {
            this._updateLabelName();
            this._updateState();
        }
    }

    private async _updateLabelName(): Promise<void> {
        const data = this.data;
        if (data) {
            const playerIndex       = data.playerIndex;
            this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(WarRuleHelpers.getTeamIndex((await McrModel.getRoomInfo(data.roomId)).settingsForCommon.warRule, playerIndex))})`;
        }
    }
    private async _updateState(): Promise<void> {
        const data              = this.data;
        const roomInfo          = data ? await McrModel.getRoomInfo(data.roomId) : null;
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
            { type: NotifyType.MsgMcrGetRoomInfo,      callback: this._onNotifyMsgMcrGetRoomInfo },
            { type: NotifyType.MsgMcrSetSelfSettings,  callback: this._onNotifyMsgMcrSetSelfSettings },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateImgColor();
    }

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        const data              = this.data;
        const roomId            = data.roomId;
        const roomInfo          = data ? await McrModel.getRoomInfo(roomId) : null;
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

        const newSkinId         = data.skinId;
        const currPlayerData    = playerDataList.some(v => v.unitAndTileSkinId === newSkinId);
        if (currPlayerData) {
            if (currPlayerData !== selfPlayerData) {
                FloatText.show(Lang.getText(LangTextType.A0203));
            }
        } else {
            McrProxy.reqMcrSetSelfSettings({
                roomId,
                playerIndex         : selfPlayerData.playerIndex,
                unitAndTileSkinId   : newSkinId,
                coId                : selfPlayerData.coId,
            });
        }
    }
    private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
        if (data.roomId === this.data.roomId) {
            this._updateImgColor();
        }
    }
    private _onNotifyMsgMcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS;
        if (data.roomId === this.data.roomId) {
            this._updateImgColor();
        }
    }

    private async _updateImgColor(): Promise<void> {
        const data = this.data;
        if (data) {
            const skinId            = data.skinId;
            const roomInfo          = data ? await McrModel.getRoomInfo(data.roomId) : null;
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
            { type: NotifyType.MsgMcrGetRoomInfo,  callback: this._onNotifyMsgMcrGetRoomInfo },
            { type: NotifyType.MsgMcrSetReady,     callback: this._onNotifyMsgMcrSetReady },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateLabelName();
        this._updateStateAndImgRed();
    }

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        const data              = this.data;
        const isReady           = data.isReady;
        const roomId            = data.roomId;
        const roomInfo          = await McrModel.getRoomInfo(roomId);
        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
        const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
        if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
            McrProxy.reqMcrSetReady(roomId, isReady);
        }
    }
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateLabelName();
    }
    private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
        if (data.roomId === this.data.roomId) {
            this._updateLabelName();
            this._updateStateAndImgRed();
        }
    }
    private _onNotifyMsgMcrSetReady(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrSetReady.IS;
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
        const roomInfo          = await McrModel.getRoomInfo(data.roomId);
        const isReady           = data.isReady;
        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
        const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
        const isSelected        = (!!selfPlayerData) && (isReady === selfPlayerData.isReady);
        this.currentState       = isSelected ? `down` : `up`;
        this._imgRed.visible    = (isReady) && (!isSelected);
    }
}
