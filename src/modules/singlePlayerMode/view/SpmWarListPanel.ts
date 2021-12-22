
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
// import TwnsNotifyType                       from "../../tools/notify/NotifyType";
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
namespace TwnsSpmWarListPanel {
    import LangTextType                             = TwnsLangTextType.LangTextType;
    import NotifyType                               = TwnsNotifyType.NotifyType;
    import OpenDataForCommonWarMapInfoPage          = TwnsCommonWarMapInfoPage.OpenDataForCommonMapInfoPage;
    import OpenDataForCommonWarPlayerInfoPage       = TwnsCommonWarPlayerInfoPage.OpenDataForCommonWarPlayerInfoPage;
    import OpenDataForCommonWarAdvancedSettingsPage = TwnsCommonWarAdvancedSettingsPage.OpenDataForCommonWarAdvancedSettingsPage;
    import OpenDataForCommonWarBasicSettingsPage    = TwnsCommonWarBasicSettingsPage.OpenDataForCommonWarBasicSettingsPage;
    import WarBasicSettingsType                     = Types.WarBasicSettingsType;

    export type OpenData = void;
    export class SpmWarListPanel extends TwnsUiPanel.UiPanel<OpenData> {
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
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.SpmPreviewingWarSaveSlotChanged,    callback: this._onNotifySpmPreviewingWarSaveSlotChanged },
                { type: NotifyType.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
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

        private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(): void {
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmMainMenuPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }

        private _onTouchedBtnNextStep(): void {
            const slotData = SpmModel.getSlotDict().get(SpmModel.getPreviewingSlotIndex());
            if (slotData != null) {
                FlowManager.gotoSinglePlayerWar({
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
                    pageClass   : TwnsCommonWarMapInfoPage.CommonWarMapInfoPage,
                    pageData    : this._createDataForCommonWarMapInfoPage(),
                },
                {
                    tabItemData : { name: Lang.getText(LangTextType.B0224) },
                    pageClass   : TwnsCommonWarPlayerInfoPage.CommonWarPlayerInfoPage,
                    pageData    : this._createDataForCommonWarPlayerInfoPage(),
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

        private _updateGroupWarList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoWar    = this._labelNoWar;
            const listWar       = this._listWar;
            if (!SpmModel.getHasReceivedSlotArray()) {
                labelLoading.visible    = true;
                labelNoWar.visible     = false;
                listWar.clear();

            } else {
                const dataArray         = this._createDataForListWar();
                const slotIndex         = SpmModel.getPreviewingSlotIndex();
                labelLoading.visible    = false;
                labelNoWar.visible      = !dataArray.length;
                listWar.bindData(dataArray);
                listWar.setSelectedIndex(dataArray.findIndex(v => v.slotIndex === slotIndex));
            }
        }

        private _updateComponentsForPreviewingWarInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const slotIndex     = SpmModel.getPreviewingSlotIndex();
            if ((!SpmModel.getHasReceivedSlotArray()) || (slotIndex == null)) {
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

        private _updateCommonWarMapInfoPage(): void {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(0, this._createDataForCommonWarMapInfoPage());
            }
        }

        private _updateCommonWarPlayerInfoPage(): void {
            if (this._isTabInitialized) {
                this._tabSettings.updatePageData(1, this._createDataForCommonWarPlayerInfoPage());
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

        private _createDataForListWar(): DataForWarRenderer[] {
            const dataArray: DataForWarRenderer[] = [];
            for (const [slotIndex] of SpmModel.getSlotDict()) {
                dataArray.push({
                    slotIndex,
                });
            }

            return dataArray;
        }

        private _createDataForCommonWarMapInfoPage(): OpenDataForCommonWarMapInfoPage {
            const slotIndex = SpmModel.getPreviewingSlotIndex();
            const warData   = slotIndex == null ? null : SpmModel.getSlotDict().get(slotIndex)?.warData;
            if (warData == null) {
                return {};
            }

            const mapId = WarCommonHelpers.getMapId(warData);
            if (mapId != null) {
                return { mapInfo: { mapId } };
            }

            const initialWarData = warData.settingsForSfw?.initialWarData;
            if (initialWarData) {
                return { warInfo: {
                    warData : initialWarData,
                    players : warData.playerManager?.players,
                } };
            } else {
                return {};
            }
        }

        private _createDataForCommonWarPlayerInfoPage(): OpenDataForCommonWarPlayerInfoPage {
            const slotIndex = SpmModel.getPreviewingSlotIndex();
            const slotData  = slotIndex == null ? null : SpmModel.getSlotDict().get(slotIndex);
            const warData   = slotData?.warData;
            if (warData == null) {
                return null;
            }

            const settingsForCommon = Helpers.getExisted(warData.settingsForCommon);
            const warRule           = Helpers.getExisted(settingsForCommon.warRule);
            const playerInfoArray   : TwnsCommonWarPlayerInfoPage.PlayerInfo[] = [];
            for (const playerInfo of Helpers.getExisted(warData.playerManager?.players)) {
                const playerIndex   = Helpers.getExisted(playerInfo.playerIndex);
                const userId        = playerInfo.userId ?? null;
                playerInfoArray.push({
                    playerIndex,
                    teamIndex           : WarRuleHelpers.getTeamIndex(warRule, playerIndex),
                    isAi                : userId == null,
                    userId,
                    coId                : Helpers.getExisted(playerInfo.coId),
                    unitAndTileSkinId   : Helpers.getExisted(playerInfo.unitAndTileSkinId),
                    isReady             : null,
                    isInTurn            : null,
                    isDefeat            : playerInfo.aliveState === Types.PlayerAliveState.Dead,
                });
            }

            return {
                configVersion           : Helpers.getExisted(settingsForCommon.configVersion),
                playersCountUnneutral   : WarRuleHelpers.getPlayersCountUnneutral(warRule),
                roomOwnerPlayerIndex    : null,
                callbackOnDeletePlayer  : null,
                callbackOnExitRoom      : null,
                playerInfoArray,
            };
        }

        private async _createDataForCommonWarBasicSettingsPage(): Promise<OpenDataForCommonWarBasicSettingsPage> {
            const slotIndex = SpmModel.getPreviewingSlotIndex();
            const slotData  = slotIndex == null ? null : SpmModel.getSlotDict().get(slotIndex);
            const warData   = slotData?.warData;
            if (warData == null) {
                return { dataArrayForListSettings: [] };
            }

            const warRule   = Helpers.getExisted(warData.settingsForCommon?.warRule);
            const mapId     = WarCommonHelpers.getMapId(warData);
            return { dataArrayForListSettings: [
                {
                    settingsType    : WarBasicSettingsType.MapName,
                    warRule,
                    currentValue    : mapId == null ? Lang.getText(LangTextType.B0321) : await WarMapModel.getMapNameInCurrentLanguage(mapId),
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.SpmSaveSlotIndex,
                    warRule,
                    currentValue    : slotIndex,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.SpmSaveSlotComment,
                    warRule,
                    currentValue    : slotData?.extraData?.slotComment ?? null,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.WarRuleTitle,
                    warRule,
                    currentValue    : null,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.HasFog,
                    warRule,
                    currentValue    : null,
                    callbackOnModify: null,
                },
                {
                    settingsType    : WarBasicSettingsType.Weather,
                    currentValue    : null,
                    warRule,
                    callbackOnModify: null,
                },
            ] };
        }

        private async _createDataForCommonWarAdvancedSettingsPage(): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
            const slotIndex = SpmModel.getPreviewingSlotIndex();
            const slotData  = slotIndex == null ? null : SpmModel.getSlotDict().get(slotIndex);
            const warData   = slotData?.warData;
            if (warData == null) {
                return null;
            }

            const settingsForCommon = Helpers.getExisted(warData.settingsForCommon);
            return {
                configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
                warRule         : Helpers.getExisted(settingsForCommon.warRule),
                warType         : WarCommonHelpers.getWarType(warData),
            };
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
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
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
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

    type DataForWarRenderer = {
        slotIndex: number;
    };
    class WarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForWarRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected async _onDataChanged(): Promise<void> {
            const slotIndex = this._getData().slotIndex;
            const slotData  = SpmModel.getSlotDict().get(slotIndex);
            const labelType = this._labelType;
            const labelName = this._labelName;
            if (!slotData) {
                labelType.text  = ``;
                labelName.text  = ``;
            } else {
                const warData   = slotData.warData;
                labelType.text  = `${slotIndex}. ${Lang.getWarTypeName(WarCommonHelpers.getWarType(warData))}`;

                const slotComment = slotData.extraData.slotComment;
                if (slotComment) {
                    labelName.text = slotComment;
                } else {
                    const mapId     = WarCommonHelpers.getMapId(warData);
                    labelName.text  = mapId == null
                        ? `(${Lang.getText(LangTextType.B0321)})`
                        : (await WarMapModel.getMapNameInCurrentLanguage(mapId) || CommonConstants.ErrorTextForUndefined);
                }
            }
        }

        private _onTouchTapBtnChoose(): void {
            SpmModel.setPreviewingSlotIndex(this._getData().slotIndex);
        }
    }
}

// export default TwnsSpmWarListPanel;
