
namespace TinyWars.MultiRankWar {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import WarMapModel      = WarMap.WarMapModel;
    import MpwModel         = MultiPlayerWar.MpwModel;
    import MpwProxy         = MultiPlayerWar.MpwProxy;

    export class MrwMyWarListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrwMyWarListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : GameUi.UiTab<DataForTabItemRenderer, OpenDataForMrwWarAdvancedSettingsPage | OpenDataForMrwWarBasicSettingsPage | OpenDataForMrwWarMapInfoPage | OpenDataForMrwWarPlayerInfoPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : GameUi.UiLabel;
        private readonly _labelMyWar            : GameUi.UiLabel;
        private readonly _labelChooseWar        : GameUi.UiLabel;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnNextStep           : GameUi.UiButton;

        private readonly _groupWarList          : eui.Group;
        private readonly _listWar               : GameUi.UiScrollList<DataForWarRenderer, WarRenderer>;
        private readonly _labelNoWar            : GameUi.UiLabel;
        private readonly _labelLoading          : GameUi.UiLabel;

        private _hasReceivedData    = false;

        public static show(): void {
            if (!MrwMyWarListPanel._instance) {
                MrwMyWarListPanel._instance = new MrwMyWarListPanel();
            }
            MrwMyWarListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MrwMyWarListPanel._instance) {
                await MrwMyWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankWar/MrwMyWarListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MrwPreviewingWarIdChanged,      callback: this._onNotifyMrwPreviewingWarIdChanged },
                { type: Notify.Type.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listWar.setItemRenderer(WarRenderer);

            this._showOpenAnimation();

            this._hasReceivedData = false;
            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();

            MpwProxy.reqMpwCommonGetMyWarInfoList();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._tabSettings.clear();
            this._listWar.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMrwPreviewingWarIdChanged(e: egret.Event): void {
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
            this._hasReceivedData = true;
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MultiRankRoom.MrrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private _onTouchedBtnNextStep(e: egret.TouchEvent): void {
            const warId = MpwModel.getMrwPreviewingWarId();
            if (warId != null) {
                MpwProxy.reqMpwCommonContinueWar(warId);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _initTabSettings(): void {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0298) },
                    pageClass   : MrwWarMapInfoPage,
                    pageData    : { warId: null } as OpenDataForMrwWarMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                    pageClass   : MrwWarPlayerInfoPage,
                    pageData    : { warId: null } as OpenDataForMrwWarPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : MrwWarBasicSettingsPage,
                    pageData    : { warId: null } as OpenDataForMrwWarBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : MrwWarAdvancedSettingsPage,
                    pageData    : { warId: null } as OpenDataForMrwWarAdvancedSettingsPage,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(Lang.Type.A0040);
            this._labelMultiPlayer.text     = Lang.getText(Lang.Type.B0137);
            this._labelMyWar.text           = Lang.getText(Lang.Type.B0588);
            this._labelChooseWar.text       = Lang.getText(Lang.Type.B0589);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._btnNextStep.label         = Lang.getText(Lang.Type.B0024);
        }

        private _updateGroupWarList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoWar    = this._labelNoWar;
            const listWar       = this._listWar;
            if (!this._hasReceivedData) {
                labelLoading.visible    = true;
                labelNoWar.visible     = false;
                listWar.clear();

            } else {
                const dataArray         = this._createDataForListWar();
                labelLoading.visible    = false;
                labelNoWar.visible      = !dataArray.length;
                listWar.bindData(dataArray);

                const warId = MpwModel.getMrwPreviewingWarId();
                if (dataArray.every(v => v.warId != warId)) {
                    MpwModel.setMrwPreviewingWarId(dataArray.length ? dataArray[0].warId : null);
                }
            }
        }

        private _updateComponentsForPreviewingWarInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const warId         = MpwModel.getMrwPreviewingWarId();
            if ((!this._hasReceivedData) || (warId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;
                btnNextStep.setRedVisible(MpwModel.checkIsRedForMyWar(MpwModel.getMyWarInfo(warId)));

                const tab = this._tabSettings;
                tab.updatePageData(0, { warId } as OpenDataForMrwWarMapInfoPage);
                tab.updatePageData(1, { warId } as OpenDataForMrwWarPlayerInfoPage);
                tab.updatePageData(2, { warId } as OpenDataForMrwWarBasicSettingsPage);
                tab.updatePageData(3, { warId } as OpenDataForMrwWarAdvancedSettingsPage);
            }
        }

        private _createDataForListWar(): DataForWarRenderer[] {
            const dataArray: DataForWarRenderer[] = [];
            for (const warInfo of MpwModel.getMyMrwWarInfoArray()) {
                dataArray.push({
                    warId: warInfo.warId,
                });
            }

            return dataArray.sort((v1, v2) => v1.warId - v2.warId);
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
        warId: number;
    }
    class WarRenderer extends GameUi.UiListItemRenderer<DataForWarRenderer> {
        private readonly _btnChoose     : GameUi.UiButton;
        private readonly _btnNext       : GameUi.UiButton;
        private readonly _labelName     : GameUi.UiLabel;
        private readonly _imgRed        : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.MrwPreviewingWarIdChanged,  callback: this._onNotifyMrwPreviewingWarIdChanged },
            ]);
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            this._updateState();

            const warId     = this.data.warId;
            const warInfo   = MpwModel.getMyWarInfo(warId);
            const imgRed    = this._imgRed;
            const labelName = this._labelName;
            if (!warInfo) {
                imgRed.visible  = false;
                labelName.text  = null;
            } else {
                const settingsForMrw    = warInfo.settingsForMrw;
                imgRed.visible          = MpwModel.checkIsRedForMyWar(warInfo);
                labelName.text          = await WarMapModel.getMapNameInCurrentLanguage(settingsForMrw.mapId);
            }
        }

        private _onNotifyMrwPreviewingWarIdChanged(e: egret.Event): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            MpwModel.setMrwPreviewingWarId(this.data.warId);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            MpwProxy.reqMpwCommonContinueWar(this.data.warId);
        }

        private _updateState(): void {
            this.currentState = this.data.warId === MpwModel.getMrwPreviewingWarId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}
