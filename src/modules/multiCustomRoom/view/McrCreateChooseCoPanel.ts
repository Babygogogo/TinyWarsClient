
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;

    type OpenDataForMcrCreateChooseCoPanel = {
        coId    : number | undefined | null;
    }
    export class McrCreateChooseCoPanel extends GameUi.UiPanel<OpenDataForMcrCreateChooseCoPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McrCreateChooseCoPanel;

        private readonly _imgMask       : GameUi.UiImage;
        private readonly _group         : eui.Group;

        private readonly _labelChooseCo : GameUi.UiLabel;
        private readonly _listCo        : GameUi.UiScrollList<DataForCoRenderer>;
        private readonly _btnConfirm    : GameUi.UiButton;
        private readonly _btnCancel     : GameUi.UiButton;
        private readonly _uiCoInfo      : GameUi.UiCoInfo;

        private _dataForListCo          : DataForCoRenderer[] = [];
        private _selectedIndex          : number;

        public static show(openData: OpenDataForMcrCreateChooseCoPanel): void {
            if (!McrCreateChooseCoPanel._instance) {
                McrCreateChooseCoPanel._instance = new McrCreateChooseCoPanel();
            }

            McrCreateChooseCoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (McrCreateChooseCoPanel._instance) {
                await McrCreateChooseCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateChooseCoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchTapBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listCo.setItemRenderer(CoRenderer);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();
            this._initListCo();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListCo;
            if (dataList.length <= 0) {
                this._selectedIndex = undefined;

            } else if (dataList[newIndex]) {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                (dataList[oldIndex])    && (this._listCo.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));
            }

            this._updateComponentsForCoInfo();
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        private _getSelectedCoId(): number | null {
            const data = this._dataForListCo[this.getSelectedIndex()];
            return data ? data.coBasicCfg.coId : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const coId = this._getSelectedCoId();
            if (coId != null) {
                McrModel.Create.setSelfCoId(coId);
                this.close();
            }
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelChooseCo.text    = Lang.getText(Lang.Type.B0145);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);

            this._updateComponentsForCoInfo();
        }

        private _initListCo(): void {
            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this._listCo.scrollVerticalTo(0);

            const coId = this._getOpenData().coId;
            this.setSelectedIndex(this._dataForListCo.findIndex(data => {
                const cfg = data.coBasicCfg;
                return cfg ? cfg.coId === coId : coId == null;
            }));
        }

        private _createDataForListCo(): DataForCoRenderer[] {
            const data              : DataForCoRenderer[] = [];
            const availableCoIdList = McrModel.Create.getAvailableCoIdList(McrModel.Create.getSelfPlayerIndex());

            let index = 0;
            for (const cfg of ConfigManager.getAvailableCoArray(ConfigManager.getLatestFormalVersion())) {
                if (availableCoIdList.indexOf(cfg.coId) >= 0) {
                    data.push({
                        coBasicCfg  : cfg,
                        index,
                        panel       : this,
                    });
                    ++index;
                }
            }
            return data;
        }

        private _updateComponentsForCoInfo(): void {
            const coId = this._getSelectedCoId();
            if (coId == null) {
                return;
            }

            this._uiCoInfo.setCoData({
                configVersion   : ConfigManager.getLatestFormalVersion(),
                coId,
            });
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });

                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: -40 },
                    callback    : resolve,
                });
            });
        }
    }

    type DataForCoRenderer = {
        coBasicCfg  : ProtoTypes.Config.ICoBasicCfg;
        index       : number;
        panel       : McrCreateChooseCoPanel;
    }
    class CoRenderer extends GameUi.UiListItemRenderer<DataForCoRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = data.coBasicCfg.name;
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }
    }
}
