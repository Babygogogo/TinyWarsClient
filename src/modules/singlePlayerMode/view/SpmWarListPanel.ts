
// import TwnsCommonWarAdvancedSettingsPage    from "../../common/view/CommonWarAdvancedSettingsPage";
// import TwnsCommonWarBasicSettingsPage       from "../../common/view/CommonWarBasicSettingsPage";
// import TwnsCommonWarMapInfoPage             from "../../common/view/CommonWarMapInfoPage";
// import TwnsCommonWarPlayerInfoPage          from "../../common/view/CommonWarPlayerInfoPage";
// import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
// import CommonConstants                      from "../../tools/helpers/CommonConstants";
// import FlowManager                          from "../../tools/helpers/FlowManager";
// import Helpers                              from "../../tools/helpers/Helpers";
// import Types                                from "../../tools/helpers/Types";
// import Lang                                 from "../../tools/lang/Lang";
// import TwnsLangTextType                     from "../../tools/lang/LangTextType";
// import Twns.Notify                       from "../../tools/notify/NotifyType";
// import TwnsUiButton                         from "../../tools/ui/UiButton";
// import TwnsUiLabel                          from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                          from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
// import TwnsUiTab                            from "../../tools/ui/UiTab";
// import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
// import WarCommonHelpers                     from "../../tools/warHelpers/WarCommonHelpers";
// import WarRuleHelpers                       from "../../tools/warHelpers/WarRuleHelpers";
// import WarMapModel                          from "../../warMap/model/WarMapModel";
// import SpmModel                             from "../model/SpmModel";
// import TwnsSpmMainMenuPanel                 from "./SpmMainMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerMode {
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = Twns.Notify.NotifyType;
    import OpenDataForCommonWarMapInfoPage          = Twns.Common.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = Twns.Common.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = Common.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = Common.OpenDataForCommonWarBasicSettingsPage;
    import WarBasicSettingsType                     = Twns.Types.WarBasicSettingsType;

    export type OpenDataForSpmWarListPanel = void;
    export class SpmWarListPanel extends TwnsUiPanel.UiPanel<OpenDataForSpmWarListPanel> {
        private readonly _groupTab!             : eui.Group;
        private readonly _tabSettings!          : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForCommonWarMapInfoPage | OpenDataForCommonWarPlayerInfoPage | OpenDataForCommonWarAdvancedSettingsPage | OpenDataForCommonWarBasicSettingsPage>;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelSinglePlayer!    : TwnsUiLabel.UiLabel;
        private readonly _labelContinue!        : TwnsUiLabel.UiLabel;
        private readonly _labelChooseWar!       : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupWarList!         : eui.Group;
        private readonly _listWar!              : TwnsUiScrollList.UiScrollList<DataForWarRenderer>;
        private readonly _labelNoWar!           : TwnsUiLabel.UiLabel;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private _isTabInitialized = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.SpmPreviewingWarSaveSlotChanged,     callback: this._onNotifySpmPreviewingWarSaveSlotChanged },
                { type: NotifyType.MsgSpmGetWarSaveSlotIndexArray,      callback: this._onNotifyMsgSpmGetWarSaveSlotIndexArray },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listWar.setItemRenderer(WarRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._isTabInitialized = false;
            await this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySpmPreviewingWarSaveSlotChanged(): void {
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onNotifyMsgSpmGetWarSaveSlotIndexArray(): void {
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.SpmMainMenuPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyTopPanel, void 0);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const slotData = await SinglePlayerMode.SpmModel.getSlotFullData(SinglePlayerMode.SpmModel.getPreviewingSlotIndex());
            if (slotData != null) {
                Twns.FlowManager.gotoSinglePlayerWar({
                    slotIndex       : slotData.slotIndex,
                    warData         : slotData.warData,
                    slotExtraData   : slotData.extraData,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _initTabSettings(): Promise<void> {
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
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(LangTextType.A0040);
            this._labelSinglePlayer.text    = Lang.getText(LangTextType.B0138);
            this._labelContinue.text        = Lang.getText(LangTextType.B0024);
            this._labelChooseWar.text       = Lang.getText(LangTextType.B0589);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelNoWar.text           = Lang.getText(LangTextType.B0210);
            this._btnNextStep.label         = Lang.getText(LangTextType.B0024);
        }

        private async _updateGroupWarList(): Promise<void> {
            const labelLoading  = this._labelLoading;
            const labelNoWar    = this._labelNoWar;
            const listWar       = this._listWar;
            labelLoading.visible    = true;
            labelNoWar.visible     = false;
            listWar.clear();

            const dataArray         = await this._createDataForListWar();
            const slotIndex         = SinglePlayerMode.SpmModel.getPreviewingSlotIndex();
            labelLoading.visible    = false;
            labelNoWar.visible      = !dataArray.length;
            listWar.bindData(dataArray);
            listWar.setSelectedIndex(dataArray.findIndex(v => v.slotIndex === slotIndex));
        }

        private _updateComponentsForPreviewingWarInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const slotIndex     = SinglePlayerMode.SpmModel.getPreviewingSlotIndex();
            if (slotIndex == null) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                this._updateCommonWarMapInfoPage();
                this._updateCommonWarPlayerInfoPage();
                this._updateCommonWarBasicSettingsPage();
                this._updateCommonWarAdvancedSettingsPage();
            }
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

        private async _createDataForListWar(): Promise<DataForWarRenderer[]> {
            const emptySlotIndexArray   = await SinglePlayerMode.SpmModel.getEmptySlotIndexArray();
            const dataArray             : DataForWarRenderer[] = [];
            for (let slotIndex = 0; slotIndex < CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
                if (emptySlotIndexArray.indexOf(slotIndex) < 0) {
                    dataArray.push({
                        slotIndex,
                    });
                }
            }

            return dataArray;
        }

        private async _createDataForCommonWarMapInfoPage(): Promise<OpenDataForCommonWarMapInfoPage> {
            const slotIndex = SinglePlayerMode.SpmModel.getPreviewingSlotIndex();
            const warData   = slotIndex == null ? null : (await SinglePlayerMode.SpmModel.getSlotFullData(slotIndex))?.warData;
            if (warData == null) {
                return null;
            }

            const mapId = WarHelpers.WarCommonHelpers.getMapId(warData);
            if (mapId != null) {
                return {
                    gameConfig  : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(warData.settingsForCommon?.configVersion)),
                    mapInfo     : { mapId },
                };
            }

            const initialWarData = warData.settingsForSfw?.initialWarData;
            if (initialWarData) {
                return {
                    gameConfig  : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(initialWarData.settingsForCommon?.configVersion)),
                    warInfo     : {
                        warData : initialWarData,
                        players : warData.playerManager?.players,
                    }
                };
            } else {
                return null;
            }
        }

        private async _createDataForCommonWarPlayerInfoPage(): Promise<OpenDataForCommonWarPlayerInfoPage> {
            const slotIndex = SinglePlayerMode.SpmModel.getPreviewingSlotIndex();
            const slotData  = slotIndex == null ? null : await SinglePlayerMode.SpmModel.getSlotFullData(slotIndex);
            const warData   = slotData?.warData;
            if (warData == null) {
                return null;
            }

            const settingsForCommon = Twns.Helpers.getExisted(warData.settingsForCommon);
            const instanceWarRule   = Twns.Helpers.getExisted(settingsForCommon.instanceWarRule);
            const playerInfoArray   : Twns.Common.PlayerInfo[] = [];
            for (const playerInfo of Twns.Helpers.getExisted(warData.playerManager?.players)) {
                const playerIndex   = Twns.Helpers.getExisted(playerInfo.playerIndex);
                const userId        = playerInfo.userId ?? null;
                playerInfoArray.push({
                    playerIndex,
                    teamIndex           : WarHelpers.WarRuleHelpers.getTeamIndex(instanceWarRule, playerIndex),
                    isAi                : userId == null,
                    userId,
                    coId                : Twns.Helpers.getExisted(playerInfo.coId),
                    unitAndTileSkinId   : Twns.Helpers.getExisted(playerInfo.unitAndTileSkinId),
                    isReady             : null,
                    isInTurn            : null,
                    isDefeat            : playerInfo.aliveState === Twns.Types.PlayerAliveState.Dead,
                    restTimeToBoot      : playerInfo.restTimeToBoot ?? null,
                });
            }

            return {
                gameConfig              : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion)),
                playersCountUnneutral   : WarHelpers.WarRuleHelpers.getPlayersCountUnneutral(instanceWarRule),
                roomOwnerPlayerIndex    : null,
                callbackOnDeletePlayer  : null,
                callbackOnExitRoom      : null,
                playerInfoArray,
                enterTurnTime           : null,
            };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const slotIndex = SinglePlayerMode.SpmModel.getPreviewingSlotIndex();
            const slotData  = slotIndex == null ? null : await SinglePlayerMode.SpmModel.getSlotFullData(slotIndex);
            const warData   = slotData?.warData;
            if (warData == null) {
                return { dataArrayForListSettings: [] };
            }

            const settingsForCommon = Twns.Helpers.getExisted(warData.settingsForCommon);
            const instanceWarRule   = Twns.Helpers.getExisted(settingsForCommon.instanceWarRule);
            const gameConfig        = Twns.Helpers.getExisted(await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion)));
            const warEventFullData  = instanceWarRule.warEventFullData ?? null;
            const mapId             = WarHelpers.WarCommonHelpers.getMapId(warData);
            return { dataArrayForListSettings: [
                {
                    settingsType    : WarBasicSettingsType.MapId,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue    : mapId,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.SpmSaveSlotIndex,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue    : slotIndex,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.SpmSaveSlotComment,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue    : slotData?.extraData?.slotComment ?? null,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue    : null,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    currentValue    : null,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    instanceWarRule,
                    warEventFullData,
                    gameConfig,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarEvent,
                    currentValue    : null,
                    instanceWarRule,
                    warEventFullData,
                    gameConfig,
                    callbackOnModify: null,
                },
            ] };
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            const slotIndex = SinglePlayerMode.SpmModel.getPreviewingSlotIndex();
            const slotData  = slotIndex == null ? null : await SinglePlayerMode.SpmModel.getSlotFullData(slotIndex);
            const warData   = slotData?.warData;
            if (warData == null) {
                return null;
            }

            const settingsForCommon = Twns.Helpers.getExisted(warData.settingsForCommon);
            return {
                gameConfig      : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion)),
                instanceWarRule : Twns.Helpers.getExisted(settingsForCommon.instanceWarRule),
                warType         : WarHelpers.WarCommonHelpers.getWarType(warData),
            };
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
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

    type DataForWarRenderer = {
        slotIndex: number;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private readonly _labelType!        : TwnsUiLabel.UiLabel;
        private readonly _labelTimestamp!   : TwnsUiLabel.UiLabel;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setShortSfxCode(Twns.Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const slotIndex         = this._getData().slotIndex;
            const slotData          = await SinglePlayerMode.SpmModel.getSlotFullData(slotIndex);
            const labelType         = this._labelType;
            const labelName         = this._labelName;
            const labelTimestamp    = this._labelTimestamp;

            if (!slotData) {
                labelType.text      = ``;
                labelName.text      = ``;
                labelTimestamp.text = ``;

            } else {
                const warData   = slotData.warData;
                labelType.text  = `#${slotIndex} ${Lang.getWarTypeName(WarHelpers.WarCommonHelpers.getWarType(warData))}`;

                const slotExtraData = slotData.extraData;
                const slotComment   = slotExtraData.slotComment;
                if (slotComment) {
                    labelName.text = slotComment;
                } else {
                    const mapId     = WarHelpers.WarCommonHelpers.getMapId(warData);
                    labelName.text  = mapId == null
                        ? `(${Lang.getText(LangTextType.B0321)})`
                        : (await WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId) || CommonConstants.ErrorTextForUndefined);
                }

                const timestamp     = slotExtraData.timestamp;
                labelTimestamp.text = timestamp == null ? `` : Twns.Helpers.getTimestampShortText(timestamp);
            }
        }

        public onItemTapEvent(): void {
            SinglePlayerMode.SpmModel.setPreviewingSlotIndex(this._getData().slotIndex);
        }
    }
}

// export default TwnsSpmWarListPanel;
