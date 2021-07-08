
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.CoopCustomWar {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import WarMapModel      = WarMap.WarMapModel;
    import MpwModel         = MultiPlayerWar.MpwModel;
    import MpwProxy         = MultiPlayerWar.MpwProxy;

    export class CcwMyWarListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CcwMyWarListPanel;

        // @ts-ignore
        private readonly _groupTab              : eui.Group;
        // @ts-ignore
        private readonly _tabSettings           : GameUi.UiTab<DataForTabItemRenderer, OpenDataForCcwWarMapInfoPage | OpenDataForCcwWarPlayerInfoPage | OpenDataForCcwWarAdvancedSettingsPage | OpenDataForCcwWarBasicSettingsPage>;

        // @ts-ignore
        private readonly _groupNavigator        : eui.Group;
        // @ts-ignore
        private readonly _labelMultiPlayer      : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelMyWar            : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelChooseWar        : GameUi.UiLabel;

        // @ts-ignore
        private readonly _btnBack               : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnNextStep           : GameUi.UiButton;

        // @ts-ignore
        private readonly _groupWarList          : eui.Group;
        // @ts-ignore
        private readonly _listWar               : GameUi.UiScrollList<DataForWarRenderer>;
        // @ts-ignore
        private readonly _labelNoWar            : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelLoading          : GameUi.UiLabel;

        private _hasReceivedData    = false;

        public static show(): void {
            if (!CcwMyWarListPanel._instance) {
                CcwMyWarListPanel._instance = new CcwMyWarListPanel();
            }
            CcwMyWarListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (CcwMyWarListPanel._instance) {
                await CcwMyWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/coopCustomWar/CcwMyWarListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.CcwPreviewingWarIdChanged,      callback: this._onNotifyCcwPreviewingWarIdChanged },
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
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyCcwPreviewingWarIdChanged(): void {
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onNotifyMsgMpwCommonGetMyWarInfoList(): void {
            this._hasReceivedData = true;
            this._updateGroupWarList();
            this._updateComponentsForPreviewingWarInfo();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            CoopCustomRoom.CcrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private _onTouchedBtnNextStep(): void {
            const warId = MpwModel.getCcwPreviewingWarId();
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
                    pageClass   : CcwWarMapInfoPage,
                    pageData    : { warId: null } as OpenDataForCcwWarMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                    pageClass   : CcwWarPlayerInfoPage,
                    pageData    : { warId: null } as OpenDataForCcwWarPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : CcwWarBasicSettingsPage,
                    pageData    : { warId: null } as OpenDataForCcwWarBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : CcwWarAdvancedSettingsPage,
                    pageData    : { warId: null } as OpenDataForCcwWarAdvancedSettingsPage,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(Lang.Type.A0040);
            this._labelMultiPlayer.text     = Lang.getText(Lang.Type.B0646);
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

                const warId = MpwModel.getCcwPreviewingWarId();
                if (dataArray.every(v => v.warId != warId)) {
                    MpwModel.setCcwPreviewingWarId(dataArray.length ? dataArray[0].warId : undefined);
                }
            }
        }

        private _updateComponentsForPreviewingWarInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const warId         = MpwModel.getCcwPreviewingWarId();
            if ((!this._hasReceivedData) || (warId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;
                btnNextStep.setRedVisible(MpwModel.checkIsRedForMyWar(MpwModel.getMyWarInfo(warId)));

                const tab = this._tabSettings;
                tab.updatePageData(0, { warId } as OpenDataForCcwWarMapInfoPage);
                tab.updatePageData(1, { warId } as OpenDataForCcwWarPlayerInfoPage);
                tab.updatePageData(2, { warId } as OpenDataForCcwWarBasicSettingsPage);
                tab.updatePageData(3, { warId } as OpenDataForCcwWarAdvancedSettingsPage);
            }
        }

        private _createDataForListWar(): DataForWarRenderer[] {
            const dataArray: DataForWarRenderer[] = [];
            for (const warInfo of MpwModel.getMyCcwWarInfoArray()) {
                const warId = warInfo.warId;
                if (warId == null) {
                    Logger.error(`CcwMyWarListPanel._createDataForListWar() empty warId.`);
                    continue;
                }
                dataArray.push({
                    warId,
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
    };
    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        // @ts-ignore
        private _labelName: GameUi.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }

    type DataForWarRenderer = {
        warId: number;
    };
    class WarRenderer extends GameUi.UiListItemRenderer<DataForWarRenderer> {
        // @ts-ignore
        private readonly _btnChoose     : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnNext       : GameUi.UiButton;
        // @ts-ignore
        private readonly _labelName     : GameUi.UiLabel;
        // @ts-ignore
        private readonly _imgRed        : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.CcwPreviewingWarIdChanged,  callback: this._onNotifyCcwPreviewingWarIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const warId     = this.data.warId;
            const warInfo   = MpwModel.getMyWarInfo(warId);
            const imgRed    = this._imgRed;
            const labelName = this._labelName;
            if (!warInfo) {
                imgRed.visible  = false;
                labelName.text  = ``;
            } else {
                imgRed.visible = MpwModel.checkIsRedForMyWar(warInfo);

                const settingsForCcw = warInfo.settingsForCcw;
                if (settingsForCcw == null) {
                    Logger.error(`CcwMyWarListPanel.WarRenderer._onDataChanged() empty settingsForCcw.`);
                    labelName.text = ``;
                } else {
                    const warName = settingsForCcw.warName;
                    if (warName) {
                        labelName.text = warName;
                    } else {
                        const mapId = settingsForCcw.mapId;
                        if (mapId == null) {
                            Logger.error(`CcwMyWarListPanel.WarRenderer._onDataChanged() empty mapId.`);
                            labelName.text = ``;
                        } else {
                            const mapName = await WarMapModel.getMapNameInCurrentLanguage(mapId);
                            if (mapName == null) {
                                Logger.error(`CcwMyWarListPanel.WarRenderer._onDataChanged() empty mapName.`);
                                labelName.text = ``;
                            } else {
                                labelName.text = mapName;
                            }
                        }
                    }
                }
            }
        }

        private _onNotifyCcwPreviewingWarIdChanged(): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(): void {
            MpwModel.setCcwPreviewingWarId(this.data.warId);
        }

        private _onTouchTapBtnNext(): void {
            MpwProxy.reqMpwCommonContinueWar(this.data.warId);
        }

        private _updateState(): void {
            this.currentState = this.data.warId === MpwModel.getCcwPreviewingWarId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}
