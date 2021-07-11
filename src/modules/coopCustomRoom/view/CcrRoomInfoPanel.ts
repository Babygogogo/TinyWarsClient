
import { UiImage }                                                              from "../../../gameui/UiImage";
import { UiListItemRenderer }                                                   from "../../../gameui/UiListItemRenderer";
import { UiPanel }                                                              from "../../../gameui/UiPanel";
import { UiButton }                                                             from "../../../gameui/UiButton";
import { UiLabel }                                                              from "../../../gameui/UiLabel";
import { UiScrollList }                                                         from "../../../gameui/UiScrollList";
import { UiTab }                                                                from "../../../gameui/UiTab";
import { UiTabItemRenderer }                                                    from "../../../gameui/UiTabItemRenderer";
import { ChatPanel }                                                            from "../../chat/view/ChatPanel";
import { CommonConfirmPanel }                                                   from "../../common/view/CommonConfirmPanel";
import { CcrRoomMapInfoPage, OpenDataForCcrRoomMapInfoPage }                    from "./CcrRoomMapInfoPage";
import { OpenDataForCcrRoomPlayerInfoPage, CcrRoomPlayerInfoPage }              from "./CcrRoomPlayerInfoPage";
import { CcrMyRoomListPanel }                                                   from "./CcrMyRoomListPanel";
import { OpenDataForCcrRoomAdvancedSettingsPage, CcrRoomAdvancedSettingsPage }  from "./CcrRoomAdvancedSettingsPage";
import { OpenDataForCcrRoomBasicSettingsPage, CcrRoomBasicSettingsPage }        from "./CcrRoomBasicSettingsPage";
import { CcrRoomChooseCoPanel }                                                 from "./CcrRoomChooseCoPanel";
import * as CommonConstants                                                     from "../../../utility/CommonConstants";
import * as ConfigManager                                                       from "../../../utility/ConfigManager";
import * as FloatText                                                           from "../../../utility/FloatText";
import * as Helpers                                                             from "../../../utility/Helpers";
import * as Lang                                                                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                                                              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                                                          from "../../../utility/ProtoTypes";
import * as Types                                                               from "../../../utility/Types";
import * as BwHelpers                                                           from "../../baseWar/model/BwHelpers";
import * as BwWarRuleHelper                                                     from "../../baseWar/model/BwWarRuleHelper";
import * as CcrModel                                                            from "../../coopCustomRoom/model/CcrModel";
import * as UserModel                                                           from "../../user/model/UserModel";
import * as WarMapModel                                                         from "../../warMap/model/WarMapModel";
import * as CcrProxy                                                            from "../model/CcrProxy";
import NetMessage                                                               = ProtoTypes.NetMessage;

type OpenDataForCcrRoomInfoPanel = {
    roomId  : number;
};
export class CcrRoomInfoPanel extends UiPanel<OpenDataForCcrRoomInfoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CcrRoomInfoPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForCcrRoomMapInfoPage | OpenDataForCcrRoomPlayerInfoPage | OpenDataForCcrRoomBasicSettingsPage | OpenDataForCcrRoomAdvancedSettingsPage>;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelMultiPlayer      : UiLabel;
    private readonly _labelMyRoom           : UiLabel;
    private readonly _labelRoomInfo         : UiLabel;

    private readonly _groupSettings         : eui.Group;
    private readonly _groupChooseCo         : eui.Group;
    private readonly _labelChooseCo         : UiLabel;
    private readonly _btnChooseCo           : UiButton;

    private readonly _groupChoosePlayerIndex: eui.Group;
    private readonly _labelChoosePlayerIndex: UiLabel;
    private readonly _sclPlayerIndex        : UiScrollList<DataForPlayerIndexRenderer>;

    private readonly _groupChooseSkinId     : eui.Group;
    private readonly _labelChooseSkinId     : UiLabel;
    private readonly _sclSkinId             : UiScrollList<DataForSkinIdRenderer>;

    private readonly _groupChooseReady      : eui.Group;
    private readonly _labelChooseReady      : UiLabel;
    private readonly _sclReady              : UiScrollList<DataForReadyRenderer>;

    private readonly _groupButton           : eui.Group;
    private readonly _btnStartGame          : UiButton;
    private readonly _btnDeleteRoom         : UiButton;
    private readonly _btnChat               : UiButton;

    private readonly _btnBack               : UiButton;

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
            { type: NotifyType.MsgCcrGetRoomInfo,          callback: this._onMsgCcrGetRoomInfo },
            { type: NotifyType.MsgCcrSetSelfSettings,      callback: this._onMsgCcrSetSelfSettings },
            { type: NotifyType.MsgCcrSetReady,             callback: this._onMsgCcrSetReady },
            { type: NotifyType.MsgCcrExitRoom,             callback: this._onMsgCcrExitRoom },
            { type: NotifyType.MsgCcrDeleteRoomByServer,   callback: this._onMsgCcrDeleteRoomByServer },
            { type: NotifyType.MsgCcrStartWar,             callback: this._onMsgCcrStartWar },
            { type: NotifyType.MsgCcrDeletePlayer,         callback: this._onMsgCcrDeletePlayer },
            { type: NotifyType.MsgCcrGetOwnerPlayerIndex,  callback: this._onMsgCcrGetOwnerPlayerIndex },
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
                pageClass   : CcrRoomMapInfoPage,
                pageData    : {
                    roomId
                } as OpenDataForCcrRoomMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : CcrRoomPlayerInfoPage,
                pageData    : {
                    roomId,
                } as OpenDataForCcrRoomPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : CcrRoomBasicSettingsPage,
                pageData    : {
                    roomId
                } as OpenDataForCcrRoomBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : CcrRoomAdvancedSettingsPage,
                pageData    : {
                    roomId
                } as OpenDataForCcrRoomAdvancedSettingsPage,
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
    private _onTouchedBtnBack(): void {
        this.close();
        CcrMyRoomListPanel.show();
    }

    private async _onTouchedBtnChooseCo(): Promise<void> {
        const roomId            = this._getOpenData().roomId;
        const roomInfo          = await CcrModel.getRoomInfo(roomId);
        const selfUserId        = UserModel.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === selfUserId) : null;
        if (selfPlayerData != null) {
            if (selfPlayerData.isReady) {
                FloatText.show(Lang.getText(LangTextType.A0128));
            } else {
                CcrRoomChooseCoPanel.show({
                    roomId,
                    playerIndex: selfPlayerData.playerIndex,
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
        ChatPanel.show({
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

    private _onMsgCcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetRoomInfo.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
            this._updateBtnChooseCo();
        }
    }

    private _onMsgCcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrSetSelfSettings.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
            this._updateBtnChooseCo();
        }
    }

    private _onMsgCcrSetReady(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrSetReady.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
        }
    }

    private async _onMsgCcrExitRoom(e: egret.Event): Promise<void> {
        const roomId = (e.data as NetMessage.MsgCcrExitRoom.IS).roomId;
        if (roomId === this._getOpenData().roomId) {
            const roomInfo      = await CcrModel.getRoomInfo(roomId);
            const userId        = UserModel.getSelfUserId();
            const playerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
            if (playerData) {
                this._updateGroupButton();
            } else {
                FloatText.show(Lang.getText(LangTextType.A0016));
                this.close();
                CcrMyRoomListPanel.show();
            }
        }
    }

    private _onMsgCcrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrDeleteRoomByServer.IS;
        if (data.roomId === this._getOpenData().roomId) {
            FloatText.show(Lang.getText(LangTextType.A0019));
            this.close();
            CcrMyRoomListPanel.show();
        }
    }

    private _onMsgCcrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrStartWar.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this.close();
            CcrMyRoomListPanel.show();
        }
    }

    private _onMsgCcrDeletePlayer(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrDeletePlayer.IS;
        if ((data.roomId === this._getOpenData().roomId) && (data.targetUserId === UserModel.getSelfUserId())) {
            FloatText.show(Lang.getText(LangTextType.A0127));
            this.close();
            CcrMyRoomListPanel.show();
        }
    }

    private _onMsgCcrGetOwnerPlayerIndex(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrGetOwnerPlayerIndex.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupButton();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initSclPlayerIndex(): Promise<void> {
        const roomId                = this._getOpenData().roomId;
        const roomInfo              = await CcrModel.getRoomInfo(roomId);
        const playersCountUnneutral = roomInfo ? (await WarMapModel.getRawData(roomInfo.settingsForCcw.mapId)).playersCountUnneutral : null;
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
        const roomInfo          = await CcrModel.getRoomInfo(this._getOpenData().roomId);
        const userId            = UserModel.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
        if (selfPlayerData) {
            this._btnChooseCo.label = ConfigManager.getCoBasicCfg(roomInfo.settingsForCommon.configVersion, selfPlayerData.coId).name;
        }
    }

    private async _updateGroupButton(): Promise<void> {
        const roomId            = this._getOpenData().roomId;
        const roomInfo          = await CcrModel.getRoomInfo(roomId);
        const playerDataList    = roomInfo.playerDataList;
        const ownerInfo         = playerDataList.find(v => v.playerIndex === roomInfo.ownerPlayerIndex);
        const isSelfOwner       = (!!ownerInfo) && (ownerInfo.userId === UserModel.getSelfUserId());
        const btnStartGame      = this._btnStartGame;
        btnStartGame.setRedVisible(await CcrModel.checkCanStartGame(roomId));

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
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private _labelName: UiLabel;

    protected _onDataChanged(): void {
        this._labelName.text = this.data.name;
    }
}

type DataForPlayerIndexRenderer = {
    roomId      : number;
    playerIndex : number;
};
class PlayerIndexRenderer extends UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelName : UiLabel;

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

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        const data              = this.data;
        const roomId            = data.roomId;
        const roomInfo          = data ? await CcrModel.getRoomInfo(roomId) : null;
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
            const availableCoIdArray    = BwWarRuleHelper.getAvailableCoIdArrayForPlayer(settingsForCommon.warRule, newPlayerIndex, settingsForCommon.configVersion);
            const currCoId              = selfPlayerData.coId;
            CcrProxy.reqCcrSetSelfSettings({
                roomId,
                playerIndex         : newPlayerIndex,
                unitAndTileSkinId   : selfPlayerData.unitAndTileSkinId,
                coId                : availableCoIdArray.indexOf(currCoId) >= 0 ? currCoId : BwWarRuleHelper.getRandomCoIdWithCoIdList(availableCoIdArray),
            });
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
        if (data.roomId === this.data.roomId) {
            this._updateLabelName();
            this._updateState();
        }
    }
    private _onNotifyMsgCcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrSetSelfSettings.IS;
        if (data.roomId === this.data.roomId) {
            this._updateLabelName();
            this._updateState();
        }
    }

    private async _updateLabelName(): Promise<void> {
        const data = this.data;
        if (data) {
            const playerIndex       = data.playerIndex;
            this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(BwWarRuleHelper.getTeamIndex((await CcrModel.getRoomInfo(data.roomId)).settingsForCommon.warRule, playerIndex))})`;
        }
    }
    private async _updateState(): Promise<void> {
        const data              = this.data;
        const roomInfo          = data ? await CcrModel.getRoomInfo(data.roomId) : null;
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
class SkinIdRenderer extends UiListItemRenderer<DataForSkinIdRenderer> {
    private readonly _imgColor  : UiImage;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.MsgCcrGetRoomInfo,      callback: this._onNotifyMsgCcrGetRoomInfo },
            { type: NotifyType.MsgCcrSetSelfSettings,  callback: this._onNotifyMsgCcrSetSelfSettings },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateImgColor();
    }

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        const data              = this.data;
        const roomId            = data.roomId;
        const roomInfo          = data ? await CcrModel.getRoomInfo(roomId) : null;
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
        if (data.roomId === this.data.roomId) {
            this._updateImgColor();
        }
    }
    private _onNotifyMsgCcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrSetSelfSettings.IS;
        if (data.roomId === this.data.roomId) {
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
            this._imgColor.source   = BwHelpers.getImageSourceForSkinId(skinId, (!!selfPlayerData) && (selfPlayerData.unitAndTileSkinId === skinId));
        }
    }
}

type DataForReadyRenderer = {
    roomId      : number;
    isReady     : boolean;
};
class ReadyRenderer extends UiListItemRenderer<DataForReadyRenderer> {
    private readonly _labelName : UiLabel;
    private readonly _imgRed    : UiImage;

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

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        const data              = this.data;
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
        if (data.roomId === this.data.roomId) {
            this._updateLabelName();
            this._updateStateAndImgRed();
        }
    }
    private _onNotifyMsgCcrSetReady(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrSetReady.IS;
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
