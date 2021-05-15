
namespace TinyWars.SinglePlayerMode {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import CommonConstants  = Utility.CommonConstants;
    import BwHelpers        = BaseWar.BwHelpers;
    import WarMapModel      = WarMap.WarMapModel;

    export class SpmWarListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: SpmWarListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : GameUi.UiTab<DataForTabItemRenderer, OpenDataForSpmWarMapInfoPage | OpenDataForSpmWarPlayerInfoPage | OpenDataForSpmWarAdvancedSettingsPage | OpenDataForSpmWarBasicSettingsPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelSinglePlayer     : GameUi.UiLabel;
        private readonly _labelContinue         : GameUi.UiLabel;
        private readonly _labelChooseWar        : GameUi.UiLabel;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnNextStep           : GameUi.UiButton;

        private readonly _groupWarList          : eui.Group;
        private readonly _listWar               : GameUi.UiScrollList<DataForWarRenderer>;
        private readonly _labelNoWar            : GameUi.UiLabel;
        private readonly _labelLoading          : GameUi.UiLabel;

        public static show(): void {
            if (!SpmWarListPanel._instance) {
                SpmWarListPanel._instance = new SpmWarListPanel();
            }
            SpmWarListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (SpmWarListPanel._instance) {
                await SpmWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerMode/SpmWarListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SpmPreviewingWarSaveSlotChanged,    callback: this._onNotifySpmPreviewingWarSaveSlotChanged },
                { type: Notify.Type.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listWar.setItemRenderer(WarRenderer);

            this._showOpenAnimation();

            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySpmPreviewingWarSaveSlotChanged(e: egret.Event): void {
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            SpmMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private _onTouchedBtnNextStep(e: egret.TouchEvent): void {
            const slotData = SpmModel.SaveSlot.getSlotDict().get(SpmModel.SaveSlot.getPreviewingSlotIndex());
            if (slotData != null) {
                Utility.FlowManager.gotoSingleCustomWar({
                    slotIndex       : slotData.slotIndex,
                    warData         : slotData.warData,
                    slotExtraData   : slotData.extraData,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _initTabSettings(): void {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0298) },
                    pageClass   : SpmWarMapInfoPage,
                    pageData    : { slotIndex: null } as OpenDataForSpmWarMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                    pageClass   : SpmWarPlayerInfoPage,
                    pageData    : { slotIndex: null } as OpenDataForSpmWarPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : SpmWarBasicSettingsPage,
                    pageData    : { slotIndex: null } as OpenDataForSpmWarBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : SpmWarAdvancedSettingsPage,
                    pageData    : { slotIndex: null } as OpenDataForSpmWarAdvancedSettingsPage,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(Lang.Type.A0040);
            this._labelSinglePlayer.text    = Lang.getText(Lang.Type.B0138);
            this._labelContinue.text        = Lang.getText(Lang.Type.B0024);
            this._labelChooseWar.text       = Lang.getText(Lang.Type.B0589);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._btnNextStep.label         = Lang.getText(Lang.Type.B0024);
        }

        private _updateGroupWarList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoWar    = this._labelNoWar;
            const listWar       = this._listWar;
            if (!SpmModel.SaveSlot.getHasReceivedSlotArray()) {
                labelLoading.visible    = true;
                labelNoWar.visible     = false;
                listWar.clear();

            } else {
                const dataArray         = this._createDataForListWar();
                labelLoading.visible    = false;
                labelNoWar.visible      = !dataArray.length;
                listWar.bindData(dataArray);

                const slotIndex = SpmModel.SaveSlot.getPreviewingSlotIndex();
                if (dataArray.every(v => v.slotIndex != slotIndex)) {
                    SpmModel.SaveSlot.setPreviewingSlotIndex(dataArray.length ? dataArray[0].slotIndex : null);
                }
            }
        }

        private _updateComponentsForPreviewingWarInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const slotIndex     = SpmModel.SaveSlot.getPreviewingSlotIndex();
            if ((!SpmModel.SaveSlot.getHasReceivedSlotArray()) || (slotIndex == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                const tab = this._tabSettings;
                tab.updatePageData(0, { slotIndex } as OpenDataForSpmWarMapInfoPage);
                tab.updatePageData(1, { slotIndex } as OpenDataForSpmWarPlayerInfoPage);
                tab.updatePageData(2, { slotIndex } as OpenDataForSpmWarBasicSettingsPage);
                tab.updatePageData(3, { slotIndex } as OpenDataForSpmWarAdvancedSettingsPage);
            }
        }

        private _createDataForListWar(): DataForWarRenderer[] {
            const dataArray: DataForWarRenderer[] = [];
            for (const [slotIndex] of SpmModel.SaveSlot.getSlotDict()) {
                dataArray.push({
                    slotIndex,
                });
            }

            return dataArray;
        }

        private _showOpenAnimation(): void {
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
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                    callback    : resolve,
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
            });
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    }
    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            this._labelName.text = this.data.name;
        }
    }

    type DataForWarRenderer = {
        slotIndex: number;
    }
    class WarRenderer extends GameUi.UiListItemRenderer<DataForWarRenderer> {
        private readonly _btnChoose     : GameUi.UiButton;
        private readonly _btnNext       : GameUi.UiButton;
        private readonly _labelType     : GameUi.UiLabel;
        private readonly _labelName     : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.SpmPreviewingWarSaveSlotChanged,  callback: this._onNotifySpmPreviewingWarSaveSlotChanged },
            ]);
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            this._updateState();

            const slotData  = SpmModel.SaveSlot.getSlotDict().get(this.data.slotIndex);
            const labelType = this._labelType;
            const labelName = this._labelName;
            if (!slotData) {
                labelType.text  = null;
                labelName.text  = null;
            } else {
                const warData   = slotData.warData;
                labelType.text  = Lang.getWarTypeName(BwHelpers.getWarType(warData));

                const slotComment = slotData.extraData.slotComment;
                if (slotComment) {
                    labelName.text = slotComment;
                } else {
                    const mapId     = BwHelpers.getMapId(warData);
                    labelName.text  = mapId == null
                        ? `(${Lang.getText(Lang.Type.B0321)})`
                        : await WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId);
                }
            }
        }

        private _onNotifySpmPreviewingWarSaveSlotChanged(e: egret.Event): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            SpmModel.SaveSlot.setPreviewingSlotIndex(this.data.slotIndex);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const slotIndex = this.data.slotIndex;
            const slotData  = SpmModel.SaveSlot.getSlotDict().get(slotIndex);
            if (slotData != null) {
                Utility.FlowManager.gotoSingleCustomWar({
                    slotIndex,
                    warData         : slotData.warData,
                    slotExtraData   : slotData.extraData,
                });
            }
        }

        private _updateState(): void {
            this.currentState = this.data.slotIndex === SpmModel.SaveSlot.getPreviewingSlotIndex() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}
