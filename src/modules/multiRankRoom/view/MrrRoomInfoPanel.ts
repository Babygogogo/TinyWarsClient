
// import TwnsCommonBanCoPanel                 from "../../common/view/CommonBanCoPanel";
// import TwnsCommonChooseCoPanel              from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonConfirmPanel               from "../../common/view/CommonConfirmPanel";
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import ConfigManager                        from "../../tools/helpers/ConfigManager";
// import FloatText                            from "../../tools/helpers/FloatText";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Timer                                from "../../tools/helpers/Timer";
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
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import MrrModel                             from "../model/MrrModel";
// import MrrProxy                             from "../model/MrrProxy";
// import MrrSelfSettingsModel                 from "../model/MrrSelfSettingsModel";
// import TwnsMrrMyRoomListPanel               from "./MrrMyRoomListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiRankRoom {
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import OpenDataForCommonWarMapInfoPage          = Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = Common.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import LangTextType                             = Lang.LangTextType;
    import NotifyType                               = Notify.NotifyType;
    import NetMessage                               = CommonProto.NetMessage;

    export type OpenDataForMrrRoomInfoPanel = {
        roomId  : number;
    };
    export class MrrRoomInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForMrrRoomInfoPanel> {
        private readonly _groupTab!                 : eui.Group;
        private readonly _tabSettings!              : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarBasicSettingsPage | OpenDataForCommonWarAdvancedSettingsPage>;

        private readonly _groupNavigator!           : eui.Group;
        private readonly _labelRankMatch!           : TwnsUiLabel.UiLabel;
        private readonly _labelMyRoom!              : TwnsUiLabel.UiLabel;
        private readonly _labelRoomInfo!            : TwnsUiLabel.UiLabel;

        private readonly _groupBanCo!               : eui.Group;
        private readonly _btnBanCo!                 : TwnsUiButton.UiButton;
        private readonly _btnBannedCo!              : TwnsUiButton.UiButton;
        private readonly _labelBanCo!               : TwnsUiLabel.UiLabel;

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

        private readonly _groupState!               : eui.Group;
        private readonly _labelCountdownTitle!      : TwnsUiLabel.UiLabel;
        private readonly _labelCountdown!           : TwnsUiLabel.UiLabel;
        private readonly _labelState!               : TwnsUiLabel.UiLabel;

        private readonly _btnBack!                  : TwnsUiButton.UiButton;

        private _isTabInitialized = false;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnBanCo,       callback: this._onTouchedBtnBanCo },
                { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TimeTick,                            callback: this._onNotifyTimeTick },
                { type: NotifyType.MrrSelfSettingsCoIdChanged,          callback: this._onNotifyMrrSelfSettingsCoIdChanged },
                { type: NotifyType.MsgMrrGetRoomPublicInfo,             callback: this._onNotifyMsgMrrGetRoomPublicInfo },
                { type: NotifyType.MsgMrrSetSelfSettings,               callback: this._onNotifyMsgMrrSetSelfSettings },
                { type: NotifyType.MsgMrrSetBannedCoCategoryIdArray,    callback: this._onNotifyMsgMrrSetBannedCoCategoryIdArray },
                { type: NotifyType.MsgMrrDeleteRoomByServer,            callback: this._onNotifyMsgMrrDeleteRoomByServer },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);
            this._sclReady.setItemRenderer(ReadyRenderer);
            this._btnBanCo.setRedVisible(true);

            MultiRankRoom.MrrProxy.reqMrrGetRoomPublicInfo(this._getOpenData().roomId);
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
            this._updateGroupBanCo();
            this._updateGroupSettings();
            this._updateGroupState();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            PanelHelpers.open(PanelHelpers.PanelDict.MrrMyRoomListPanel, void 0);
        }

        private async _onTouchedBtnBanCo(): Promise<void> {
            const roomId            = this._getOpenData().roomId;
            const roomInfo          = await MultiRankRoom.MrrModel.getRoomInfo(roomId);
            const userId            = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo ? roomInfo.playerDataList?.find(v => v.userId === userId) : null;
            if (selfPlayerData) {
                const gameConfig = await Config.ConfigManager.getGameConfig(Helpers.getExisted(roomInfo?.settingsForCommon?.configVersion));
                PanelHelpers.open(PanelHelpers.PanelDict.CommonBanCoCategoryIdPanel, {
                    gameConfig,
                    playerIndex             : null,
                    maxBanCount             : gameConfig.getSystemCfg().maxBanCount,
                    bannedCoCategoryIdArray : [],
                    selfCoId                : null,
                    callbackOnConfirm       : bannedCoCategoryIdSet => {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            content : Lang.getText(bannedCoCategoryIdSet.size > 0 ? LangTextType.A0138 : LangTextType.A0139),
                            callback: () => {
                                MultiRankRoom.MrrProxy.reqMrrSetBannedCoCategoryIdArray(roomId, [...bannedCoCategoryIdSet]);
                                PanelHelpers.close(PanelHelpers.PanelDict.CommonBanCoCategoryIdPanel);
                            },
                        });
                    },
                });
            }
        }

        private async _onTouchedBtnChooseCo(): Promise<void> {
            const roomId            = this._getOpenData().roomId;
            const roomInfo          = await MultiRankRoom.MrrModel.getRoomInfo(roomId);
            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo ? roomInfo.playerDataList?.find(v => v.userId === selfUserId) : null;
            if (selfPlayerData != null) {
                if (selfPlayerData.isReady) {
                    FloatText.show(Lang.getText(LangTextType.A0207));
                } else {
                    const currentCoId = MultiRankRoom.MrrSelfSettingsModel.getCoId();
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                        gameConfig          : await Config.ConfigManager.getGameConfig(Helpers.getExisted(roomInfo?.settingsForCommon?.configVersion)),
                        currentCoId,
                        availableCoIdArray  : Helpers.getExisted(MultiRankRoom.MrrSelfSettingsModel.getAvailableCoIdArray()),
                        callbackOnConfirm   : (newCoId) => {
                            if (newCoId !== currentCoId) {
                                MultiRankRoom.MrrSelfSettingsModel.setCoId(newCoId);
                            }
                        },
                    });
                }
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyTimeTick(): void {
            this._updateLabelCountdown();
        }

        private _onNotifyMrrSelfSettingsCoIdChanged(): void {
            this._updateBtnChooseCo();
        }

        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupBanCo();
                this._updateGroupSettings();
                this._updateGroupState();
                this._updateCommonMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
        }

        private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrSetSelfSettings.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupSettings();
                this._updateGroupState();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMrrSetBannedCoCategoryIdArray(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrSetBannedCoCategoryIdArray.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateGroupBanCo();
                this._updateGroupSettings();
                this._updateGroupState();
                this._updateCommonWarPlayerInfoPage();
            }
        }

        private _onNotifyMsgMrrDeleteRoomByServer(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrDeleteRoomByServer.IS;
            if (data.roomId === this._getOpenData().roomId) {
                FloatText.show(Lang.getText(LangTextType.A0019));
                this.close();
                PanelHelpers.open(PanelHelpers.PanelDict.MrrMyRoomListPanel, void 0);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initSclPlayerIndex(): Promise<void> {
            const roomId                = this._getOpenData().roomId;
            const roomInfo              = Helpers.getExisted(await MultiRankRoom.MrrModel.getRoomInfo(roomId));
            const playersCountUnneutral = Helpers.getExisted((await WarMap.WarMapModel.getRawData(Helpers.getExisted(roomInfo.settingsForMrw?.mapId)))?.playersCountUnneutral);
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
            const roomInfo  = await MultiRankRoom.MrrModel.getRoomInfo(this._getOpenData().roomId);
            const group     = this._groupBanCo;
            if ((!roomInfo) || (roomInfo.timeForStartSetSelfSettings != null)) {
                group.visible = false;
            } else {
                group.visible = true;

                const userId        = User.UserModel.getSelfUserId();
                const playerData    = Helpers.getExisted(roomInfo.playerDataList?.find(v => v.userId === userId));
                const playerIndex   = playerData.playerIndex;
                const banCoData     = roomInfo.settingsForMrw?.dataArrayForBanCo?.find(v => v.srcPlayerIndex === playerIndex);
                const btnBanCo      = this._btnBanCo;
                const btnBannedCo   = this._btnBannedCo;
                const labelBanCo    = this._labelBanCo;
                if (banCoData == null) {
                    btnBanCo.visible    = true;
                    btnBannedCo.visible = false;
                    labelBanCo.text     = ``;
                } else {
                    const coCategoryIdArray = banCoData.bannedCoCategoryIdArray || [];
                    const gameConfig        = await Config.ConfigManager.getGameConfig(Helpers.getExisted(roomInfo.settingsForCommon?.configVersion));
                    btnBanCo.visible        = false;
                    btnBannedCo.visible     = true;
                    labelBanCo.text         = coCategoryIdArray.length
                        ? coCategoryIdArray.map(v => gameConfig.getCoCategoryCfg(v)?.name).join(`\n`)
                        : Lang.getText(LangTextType.B0001);
                }
            }
        }

        private async _updateGroupSettings(): Promise<void> {
            const roomInfo  = await MultiRankRoom.MrrModel.getRoomInfo(this._getOpenData().roomId);
            const group     = this._groupSettings;
            if ((!roomInfo) || (roomInfo.timeForStartSetSelfSettings == null)) {
                group.visible = false;
            } else {
                group.visible = true;

                this._updateBtnChooseCo();
            }
        }

        private async _updateBtnChooseCo(): Promise<void> {
            const roomInfo          = await MultiRankRoom.MrrModel.getRoomInfo(this._getOpenData().roomId);
            this._btnChooseCo.label = roomInfo
                ? (await Config.ConfigManager.getGameConfig(Helpers.getExisted(roomInfo.settingsForCommon?.configVersion))).getCoBasicCfg(Helpers.getExisted(MultiRankRoom.MrrSelfSettingsModel.getCoId()))?.name ?? CommonConstants.ErrorTextForUndefined
                : ``;
        }

        private _updateGroupState(): void {
            this._updateLabelCountdown();
            this._updateLabelState();
        }
        private async _updateLabelCountdown(): Promise<void> {
            const roomInfo              = await MultiRankRoom.MrrModel.getRoomInfo(this._getOpenData().roomId);
            const labelCountdownTitle   = this._labelCountdownTitle;
            const labelCountdown        = this._labelCountdown;
            if (!roomInfo) {
                labelCountdownTitle.text    = ``;
                labelCountdown.text         = ``;
                return;
            }

            const timeForStartSetSelfSettings   = roomInfo.timeForStartSetSelfSettings;
            const currentTime                   = Timer.getServerTimestamp();
            if (timeForStartSetSelfSettings != null) {
                labelCountdownTitle.text    = Lang.getText(LangTextType.B0593);
                labelCountdown.text         = Helpers.getTimeDurationText2(Math.max(0, timeForStartSetSelfSettings + CommonConstants.RankRoomPhaseTime - currentTime));
            } else {
                labelCountdownTitle.text    = Lang.getText(LangTextType.B0592);
                labelCountdown.text         = Helpers.getTimeDurationText2(Math.max(0, Helpers.getExisted(roomInfo.timeForCreateRoom) + CommonConstants.RankRoomPhaseTime - currentTime));
            }
        }
        private async _updateLabelState(): Promise<void> {
            const roomInfo      = await MultiRankRoom.MrrModel.getRoomInfo(this._getOpenData().roomId);
            const labelState    = this._labelState;
            if (!roomInfo) {
                labelState.text = ``;
                return;
            }

            const userId        = User.UserModel.getSelfUserId();
            const playerData    = Helpers.getExisted(roomInfo.playerDataList?.find(v => v.userId === userId));
            const playerIndex   = playerData.playerIndex;
            if (roomInfo.timeForStartSetSelfSettings == null) {
                labelState.text = roomInfo.settingsForMrw?.dataArrayForBanCo?.some(v => v.srcPlayerIndex === playerIndex)
                    ? Lang.getText(LangTextType.A0133)
                    : Lang.getText(LangTextType.A0210);
            } else {
                labelState.text = playerData.isReady
                    ? Lang.getText(LangTextType.A0134)
                    : Lang.getText(LangTextType.A0211);
            }
        }

        private async _updateCommonMapInfoPage(): Promise<void> {
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
            const roomInfo  = await MultiRankRoom.MrrModel.getRoomInfo(this._getOpenData().roomId);
            const mapId     = roomInfo?.settingsForMrw?.mapId;
            return mapId == null
                ? null
                : {
                    gameConfig  : await Config.ConfigManager.getGameConfig(Helpers.getExisted(roomInfo?.settingsForCommon?.configVersion)),
                    hasFog      : roomInfo?.settingsForCommon?.instanceWarRule?.ruleForGlobalParams?.hasFogByDefault ?? null,
                    mapInfo     : { mapId },
                };
        }

        private _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            return MultiRankRoom.MrrModel.createDataForCommonWarPlayerInfoPage(this._getOpenData().roomId);
        }

        private _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            return MultiRankRoom.MrrModel.createDataForCommonWarBasicSettingsPage(this._getOpenData().roomId);
        }

        private _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            return MultiRankRoom.MrrModel.createDataForCommonWarAdvancedSettingsPage(this._getOpenData().roomId);
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
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
                { type: NotifyType.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public async onItemTapEvent(): Promise<void> {
            FloatText.show(Lang.getText(LangTextType.A0209));
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMrrGetRoomPublicInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }
        private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMrrSetSelfSettings.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateLabelName();
                this._updateState();
            }
        }

        private async _updateLabelName(): Promise<void> {
            const data = this.data;
            if (data) {
                const playerIndex       = data.playerIndex;
                this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(WarHelpers.WarRuleHelpers.getTeamIndex(Helpers.getExisted((await MultiRankRoom.MrrModel.getRoomInfo(data.roomId))?.settingsForCommon?.instanceWarRule), playerIndex))})`;
            }
        }
        private async _updateState(): Promise<void> {
            const data              = this._getData();
            const roomInfo          = data ? await MultiRankRoom.MrrModel.getRoomInfo(data.roomId) : null;
            const selfUserId        = User.UserModel.getSelfUserId();
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
                { type: NotifyType.MrrSelfSettingsSkinIdChanged,   callback: this._onNotifyMrrSelfSettingsSkinIdChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        public async onItemTapEvent(): Promise<void> {
            const data              = this._getData();
            const roomInfo          = data ? await MultiRankRoom.MrrModel.getRoomInfo(data.roomId) : null;
            const selfUserId        = User.UserModel.getSelfUserId();
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
            const currPlayerData    = playerDataList?.some(v => (v.isReady) && (v.unitAndTileSkinId === newSkinId));
            if ((currPlayerData) && (currPlayerData !== selfPlayerData)) {
                FloatText.show(Lang.getText(LangTextType.A0203));
            } else {
                MultiRankRoom.MrrSelfSettingsModel.setUnitAndTileSkinId(newSkinId);
            }
        }
        private _onNotifyMrrSelfSettingsSkinIdChanged(): void {
            this._updateImgColor();
        }

        private _updateImgColor(): void {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                this._imgColor.source   = WarHelpers.WarCommonHelpers.getImageSourceForSkinId(skinId, MultiRankRoom.MrrSelfSettingsModel.getUnitAndTileSkinId() === skinId);
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
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
                { type: NotifyType.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
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
            const roomInfo          = await MultiRankRoom.MrrModel.getRoomInfo(roomId);
            const selfUserId        = User.UserModel.getSelfUserId();
            const playerDataList    = roomInfo ? roomInfo.playerDataList : null;
            const selfPlayerData    = playerDataList ? playerDataList.find(v => v.userId === selfUserId) : null;
            if ((selfPlayerData) && (selfPlayerData.isReady !== isReady)) {
                if (!isReady) {
                    FloatText.show(Lang.getText(LangTextType.A0205));
                } else {
                    const coId      = Helpers.getExisted(MultiRankRoom.MrrSelfSettingsModel.getCoId());
                    const callback  = () => {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            content : Lang.getText(LangTextType.A0206),
                            callback: () => {
                                MultiRankRoom.MrrProxy.reqMrrSetSelfSettings(roomId, coId, Helpers.getExisted(MultiRankRoom.MrrSelfSettingsModel.getUnitAndTileSkinId()));
                            },
                        });
                    };
                    if ((coId == CommonConstants.CoId.Empty)                                                             &&
                        ((MultiRankRoom.MrrSelfSettingsModel.getAvailableCoIdArray() || []).some(v => v !== CommonConstants.CoId.Empty))
                    ) {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            content : Lang.getText(LangTextType.A0208),
                            callback,
                        });
                    } else {
                        callback();
                    }
                }
            }
        }
        private _onNotifyLanguageChanged(): void {
            this._updateLabelName();
        }
        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMrrGetRoomPublicInfo.IS;
            if (data.roomId === this._getData().roomId) {
                this._updateStateAndImgRed();
            }
        }
        private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMrrSetSelfSettings.IS;
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
            const roomInfo          = await MultiRankRoom.MrrModel.getRoomInfo(data.roomId);
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

// export default TwnsMrrRoomInfoPanel;
