
import { UiImage }                                                              from "../../../gameui/UiImage";
import { UiListItemRenderer }                                                   from "../../../gameui/UiListItemRenderer";
import { UiPanel }                                                              from "../../../gameui/UiPanel";
import { UiButton }                                                             from "../../../gameui/UiButton";
import { UiLabel }                                                              from "../../../gameui/UiLabel";
import { UiScrollList }                                                         from "../../../gameui/UiScrollList";
import { UiTab }                                                                from "../../../gameui/UiTab";
import { UiTabItemRenderer }                                                    from "../../../gameui/UiTabItemRenderer";
import { CommonConfirmPanel }                                                   from "../../common/view/CommonConfirmPanel";
import { MrrMyRoomListPanel }                                                   from "./MrrMyRoomListPanel";
import { MrrRoomBanCoPanel }                                                    from "./MrrRoomBanCoPanel";
import { MrrRoomChooseCoPanel }                                                 from "./MrrRoomChooseCoPanel";
import { OpenDataForMrrRoomBasicSettingsPage, MrrRoomBasicSettingsPage }        from "./MrrRoomBasicSettingsPage";
import { OpenDataForMrrRoomMapInfoPage, MrrRoomMapInfoPage }                    from "./MrrRoomMapInfoPage";
import { OpenDataForMrrRoomPlayerInfoPage, MrrRoomPlayerInfoPage }              from "./MrrRoomPlayerInfoPage";
import { OpenDataForMrrRoomAdvancedSettingsPage, MrrRoomAdvancedSettingsPage }  from "./MrrRoomAdvancedSettingsPage";
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
import * as TimeModel                                                           from "../../time/model/TimeModel";
import * as UserModel                                                           from "../../user/model/UserModel";
import * as WarMapModel                                                         from "../../warMap/model/WarMapModel";
import * as MrrModel                                                            from "../model/MrrModel";
import * as MrrProxy                                                            from "../model/MrrProxy";
import NetMessage                                                               = ProtoTypes.NetMessage;

type OpenDataForMrrRoomInfoPanel = {
    roomId  : number;
};
export class MrrRoomInfoPanel extends UiPanel<OpenDataForMrrRoomInfoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MrrRoomInfoPanel;

    private readonly _groupTab          : eui.Group;
    private readonly _tabSettings       : UiTab<DataForTabItemRenderer, OpenDataForMrrRoomMapInfoPage | OpenDataForMrrRoomPlayerInfoPage | OpenDataForMrrRoomBasicSettingsPage | OpenDataForMrrRoomAdvancedSettingsPage>;

    private readonly _groupNavigator    : eui.Group;
    private readonly _labelRankMatch    : UiLabel;
    private readonly _labelMyRoom       : UiLabel;
    private readonly _labelRoomInfo     : UiLabel;

    private readonly _groupBanCo            : eui.Group;
    private readonly _btnBanCo              : UiButton;
    private readonly _btnBannedCo           : UiButton;
    private readonly _labelBanCo            : UiLabel;

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

    private readonly _groupState            : eui.Group;
    private readonly _labelCountdownTitle   : UiLabel;
    private readonly _labelCountdown        : UiLabel;
    private readonly _labelState            : UiLabel;

    private readonly _btnBack               : UiButton;

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
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.TimeTick,                   callback: this._onNotifyTimeTick },
            { type: NotifyType.MrrSelfSettingsCoIdChanged, callback: this._onNotifyMrrSelfSettingsCoIdChanged },
            { type: NotifyType.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
            { type: NotifyType.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
            { type: NotifyType.MsgMrrSetBannedCoIdList,    callback: this._onNotifyMsgMrrSetBannedCoIdList },
            { type: NotifyType.MsgMrrDeleteRoomByServer,   callback: this._onNotifyMsgMrrDeleteRoomByServer },
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
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : MrrRoomMapInfoPage,
                pageData    : {
                    roomId
                } as OpenDataForMrrRoomMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : MrrRoomPlayerInfoPage,
                pageData    : {
                    roomId,
                } as OpenDataForMrrRoomPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : MrrRoomBasicSettingsPage,
                pageData    : {
                    roomId
                } as OpenDataForMrrRoomBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
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
        const roomId            = this._getOpenData().roomId;
        const roomInfo          = await MrrModel.getRoomInfo(roomId);
        const userId            = UserModel.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === userId) : null;
        if (selfPlayerData) {
            MrrRoomBanCoPanel.show({ roomId });
        }
    }

    private async _onTouchedBtnChooseCo(e: egret.TouchEvent): Promise<void> {
        const roomId            = this._getOpenData().roomId;
        const roomInfo          = await MrrModel.getRoomInfo(roomId);
        const selfUserId        = UserModel.getSelfUserId();
        const selfPlayerData    = roomInfo ? roomInfo.playerDataList.find(v => v.userId === selfUserId) : null;
        if (selfPlayerData != null) {
            if (selfPlayerData.isReady) {
                FloatText.show(Lang.getText(LangTextType.A0207));
            } else {
                MrrRoomChooseCoPanel.show({
                    coId: MrrModel.SelfSettings.getCoId(),
                });
            }
        }
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyTimeTick(e: egret.Event): void {
        this._updateLabelCountdown();
    }

    private _onNotifyMrrSelfSettingsCoIdChanged(e: egret.Event): void {
        this._updateBtnChooseCo();
    }

    private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
        }
    }

    private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrSetSelfSettings.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupSettings();
            this._updateGroupState();
        }
    }

    private _onNotifyMsgMrrSetBannedCoIdList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrSetBannedCoIdList.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
        }
    }

    private _onNotifyMsgMrrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrDeleteRoomByServer.IS;
        if (data.roomId === this._getOpenData().roomId) {
            FloatText.show(Lang.getText(LangTextType.A0019));
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
        const playersCountUnneutral = roomInfo ? (await WarMapModel.getRawData(roomInfo.settingsForMrw.mapId)).playersCountUnneutral : null;
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
        this._labelRankMatch.text           = Lang.getText(LangTextType.B0404);
        this._labelMyRoom.text              = Lang.getText(LangTextType.B0410);
        this._labelRoomInfo.text            = Lang.getText(LangTextType.B0398);
        this._btnBack.label                 = Lang.getText(LangTextType.B0146);
        this._btnBanCo.label                = Lang.getText(LangTextType.B0590);
        this._btnBannedCo.label             = Lang.getText(LangTextType.B0591);
        this._labelChooseCo.text            = Lang.getText(LangTextType.B0145);
        this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
        this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0573);
        this._labelChooseReady.text         = Lang.getText(LangTextType.B0402);
    }

    private async _updateGroupBanCo(): Promise<void> {
        const roomInfo  = await MrrModel.getRoomInfo(this._getOpenData().roomId);
        const group     = this._groupBanCo;
        if ((!roomInfo) || (roomInfo.timeForStartSetSelfSettings != null)) {
            group.visible = false;
        } else {
            group.visible = true;

            const userId        = UserModel.getSelfUserId();
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
                    : Lang.getText(LangTextType.B0001);
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
        this._btnChooseCo.label = roomInfo
            ? ConfigManager.getCoBasicCfg(roomInfo.settingsForCommon.configVersion, MrrModel.SelfSettings.getCoId()).name
            : null;
    }

    private _updateGroupState(): void {
        this._updateLabelCountdown();
        this._updateLabelState();
    }
    private async _updateLabelCountdown(): Promise<void> {
        const roomInfo              = await MrrModel.getRoomInfo(this._getOpenData().roomId);
        const labelCountdownTitle   = this._labelCountdownTitle;
        const labelCountdown        = this._labelCountdown;
        if (!roomInfo) {
            labelCountdownTitle.text    = null;
            labelCountdown.text         = null;
            return;
        }

        const timeForStartSetSelfSettings   = roomInfo.timeForStartSetSelfSettings;
        const currentTime                   = TimeModel.getServerTimestamp();
        if (timeForStartSetSelfSettings != null) {
            labelCountdownTitle.text    = Lang.getText(LangTextType.B0593);
            labelCountdown.text         = Helpers.getTimeDurationText2(Math.max(0, timeForStartSetSelfSettings + CommonConstants.RankRoomPhaseTime - currentTime));
        } else {
            labelCountdownTitle.text    = Lang.getText(LangTextType.B0592);
            labelCountdown.text         = Helpers.getTimeDurationText2(Math.max(0, roomInfo.timeForCreateRoom + CommonConstants.RankRoomPhaseTime - currentTime));
        }
    }
    private async _updateLabelState(): Promise<void> {
        const roomInfo      = await MrrModel.getRoomInfo(this._getOpenData().roomId);
        const labelState    = this._labelState;
        if (!roomInfo) {
            labelState.text = null;
            return;
        }

        const userId        = UserModel.getSelfUserId();
        const playerData    = roomInfo.playerDataList.find(v => v.userId === userId);
        const playerIndex   = playerData.playerIndex;
        if (roomInfo.timeForStartSetSelfSettings == null) {
            labelState.text = ((roomInfo.settingsForMrw.dataArrayForBanCo || []).some(v => v.srcPlayerIndex === playerIndex))
                ? Lang.getText(LangTextType.A0133)
                : Lang.getText(LangTextType.A0210);
        } else {
            labelState.text = playerData.isReady
                ? Lang.getText(LangTextType.A0134)
                : Lang.getText(LangTextType.A0211);
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
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
            { type: NotifyType.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateLabelName();
        this._updateState();
    }

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        FloatText.show(Lang.getText(LangTextType.A0209));
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
            { type: NotifyType.MrrSelfSettingsSkinIdChanged,   callback: this._onNotifyMrrSelfSettingsSkinIdChanged },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateImgColor();
    }

    public async onItemTapEvent(e: eui.ItemTapEvent): Promise<void> {
        const data              = this.data;
        const roomInfo          = data ? await MrrModel.getRoomInfo(data.roomId) : null;
        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
        const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
        if (selfPlayerData == null) {
            return;
        }
        if (selfPlayerData.isReady) {
            FloatText.show(Lang.getText(LangTextType.A0207));
            return;
        }

        const newSkinId         = data.skinId;
        const currPlayerData    = playerDataList.some(v => (v.isReady) && (v.unitAndTileSkinId === newSkinId));
        if ((currPlayerData) && (currPlayerData !== selfPlayerData)) {
            FloatText.show(Lang.getText(LangTextType.A0203));
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
};
class ReadyRenderer extends UiListItemRenderer<DataForReadyRenderer> {
    private readonly _labelName : UiLabel;
    private readonly _imgRed    : UiImage;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
            { type: NotifyType.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
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
        const roomInfo          = await MrrModel.getRoomInfo(roomId);
        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
        const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
        if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
            if (!isReady) {
                FloatText.show(Lang.getText(LangTextType.A0205));
            } else {
                const coId      = MrrModel.SelfSettings.getCoId();
                const callback  = () => {
                    CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0206),
                        callback: () => {
                            MrrProxy.reqMrrSetSelfSettings(roomId, coId, MrrModel.SelfSettings.getUnitAndTileSkinId());
                        },
                    });
                };
                if ((coId == CommonConstants.CoEmptyId)                                                             &&
                    ((MrrModel.SelfSettings.getAvailableCoIdArray() || []).some(v => v !== CommonConstants.CoEmptyId))
                ) {
                    CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0208),
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
            this._labelName.text = Lang.getText(data.isReady ? LangTextType.B0012 : LangTextType.B0013);
        }
    }
    private async _updateStateAndImgRed(): Promise<void> {
        const data              = this.data;
        const roomInfo          = await MrrModel.getRoomInfo(data.roomId);
        const isReady           = data.isReady;
        const selfUserId        = UserModel.getSelfUserId();
        const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
        const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
        const isSelected        = (!!selfPlayerData) && (isReady === selfPlayerData.isReady);
        this.currentState       = isSelected ? `down` : `up`;
        this._imgRed.visible    = (isReady) && (!isSelected);
    }
}
