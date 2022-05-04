
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiCoInfo             from "../../tools/ui/UiCoInfo";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType     = Lang.LangTextType;
    import NotifyType       = Notify.NotifyType;

    export type OpenDataForCommonChooseSingleCoPanel = {
        gameConfig          : Config.GameConfig;
        currentCoId         : number | null;
        availableCoIdArray  : number[];
        callbackOnConfirm   : (coId: number) => void;
    };
    export class CommonChooseSingleCoPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseSingleCoPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;

        private readonly _labelChooseCo!    : TwnsUiLabel.UiLabel;
        private readonly _listCo!           : TwnsUiScrollList.UiScrollList<DataForCoRenderer>;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _uiCoInfo!         : TwnsUiCoInfo.UiCoInfo;

        private _dataForListCo          : DataForCoRenderer[] = [];
        private _selectedIndex          : number | null = null;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchTapBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCo.setItemRenderer(CoRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._initListCo();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setAndReviseSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListCo;
            if (dataList.length <= 0) {
                this._selectedIndex = null;

            } else if (dataList[newIndex]) {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                if ((oldIndex != null) && (dataList[oldIndex])) {
                    this._listCo.updateSingleData(oldIndex, dataList[oldIndex]);
                }
                (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));
            }

            this._updateComponentsForCoInfo();
        }
        public getSelectedIndex(): number | null {
            return this._selectedIndex;
        }

        private _getSelectedCoId(): number | null {
            const selectedIndex = this.getSelectedIndex();
            const data          = selectedIndex == null ? null : this._dataForListCo[selectedIndex];
            return data ? data.coBasicCfg.coId ?? null : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnConfirm(): void {
            const coId = this._getSelectedCoId();
            if (coId != null) {
                this._getOpenData().callbackOnConfirm(coId);

                this.close();
            }
        }

        private _onTouchTapBtnBack(): void {
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelChooseCo.text    = Lang.getText(LangTextType.B0145);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);

            this._updateComponentsForCoInfo();
        }

        private _initListCo(): void {
            this._dataForListCo = this._createDataForListCo();
            this._listCo.bindData(this._dataForListCo);
            this._listCo.scrollVerticalTo(0);

            const coId = this._getOpenData().currentCoId;
            this.setAndReviseSelectedIndex(this._dataForListCo.findIndex(data => {
                const cfg = data.coBasicCfg;
                return cfg ? cfg.coId === coId : coId == null;
            }));
        }

        private _createDataForListCo(): DataForCoRenderer[] {
            const gameConfig    = this._getOpenData().gameConfig;
            const dataArray     : DataForCoRenderer[] = [];
            let index           = 0;
            for (const coId of this._getOpenData().availableCoIdArray) {
                dataArray.push({
                    coBasicCfg  : Helpers.getExisted(gameConfig.getCoBasicCfg(coId)),
                    index,
                    panel       : this,
                });
                ++index;
            }

            return dataArray;
        }

        private _updateComponentsForCoInfo(): void {
            const coId = this._getSelectedCoId();
            if (coId == null) {
                return;
            }

            this._uiCoInfo.setCoData({
                gameConfig   : this._getOpenData().gameConfig,
                coId,
            });
        }

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForCoRenderer = {
        coBasicCfg  : CommonProto.Config.ICoBasicCfg;
        index       : number;
        panel       : CommonChooseSingleCoPanel;
    };
    class CoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCoRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this._getData();
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = data.coBasicCfg.name ?? CommonConstants.ErrorTextForUndefined;
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedIndex(data.index);
        }
    }
}

// export default TwnsCommonChooseCoPanel;
