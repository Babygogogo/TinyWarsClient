
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import MeModel                  from "../model/MeModel";
// import MeProxy                  from "../model/MeProxy";
// import MeUtility                from "../model/MeUtility";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;

    export type OpenDataForMeConfirmSaveMapPanel = {
        war : MeWar;
    };
    export class MeConfirmSaveMapPanel extends TwnsUiPanel.UiPanel<OpenDataForMeConfirmSaveMapPanel> {
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _labelContent!         : TwnsUiLabel.UiLabel;
        private readonly _labelReviewDescTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelReviewDesc!      : TwnsUiLabel.UiLabel;

        private readonly _btnDelete!            : TwnsUiButton.UiButton;
        private readonly _btnSave!              : TwnsUiButton.UiButton;
        private readonly _btnSaveAndSubmit!     : TwnsUiButton.UiButton;
        private readonly _btnSimulation!        : TwnsUiButton.UiButton;
        private readonly _btnFreeMode!          : TwnsUiButton.UiButton;

        private _mapRawData         : CommonProto.Map.IMapRawData | null = null;
        private _mapErrorCode       = ClientErrorCode.NoError;
        private _canSubmitForReview = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,           callback: this.close, },
                { ui: this._btnDelete,          callback: this._onTouchedBtnDelete },
                { ui: this._btnSave,            callback: this._onTouchedBtnSave, },
                { ui: this._btnSaveAndSubmit,   callback: this._onTouchedBtnSaveAndSubmit },
                { ui: this._btnSimulation,      callback: this._onTouchedBtnSimulation },
                { ui: this._btnFreeMode,        callback: this._onTouchedBtnFreeMode },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            const btnSave               = this._btnSave;
            const btnSaveAndSubmit      = this._btnSaveAndSubmit;
            const btnSimulation         = this._btnSimulation;
            const btnFreeMode           = this._btnFreeMode;
            const labelReviewDescTitle  = this._labelReviewDescTitle;
            const labelReviewDesc       = this._labelReviewDesc;
            const mapRawData            = this._getOpenData().war.serializeForMap();
            const criticalErrorCode     = await MapEditor.MeHelpers.getCriticalErrorCodeForMapRawData(mapRawData);
            if (criticalErrorCode) {
                this._canSubmitForReview        = false;
                this._mapErrorCode              = criticalErrorCode;
                this._mapRawData                = null;
                btnSave.visible                 = false;
                btnSaveAndSubmit.visible        = false;
                btnSimulation.visible           = false;
                btnFreeMode.visible             = false;
                labelReviewDescTitle.visible    = true;
                labelReviewDesc.text            = Lang.getErrorText(criticalErrorCode);

            } else {
                const errorCode             = await MapEditor.MeHelpers.getErrorCodeForMapRawData(mapRawData);
                this._mapErrorCode          = errorCode;
                this._mapRawData            = mapRawData;
                btnSave.visible             = true;
                btnSaveAndSubmit.visible    = true;
                btnSimulation.visible       = true;
                btnFreeMode.visible         = true;

                if (mapRawData.templateWarRuleArray?.some(v => !checkIsValidAvailability(v.ruleAvailability))) {
                    this._canSubmitForReview        = false;
                    labelReviewDescTitle.visible    = true;
                    labelReviewDesc.text            = Lang.getText(LangTextType.A0298);

                } else {
                    this._canSubmitForReview        = !errorCode;
                    labelReviewDescTitle.visible    = !!errorCode;
                    labelReviewDesc.text            = errorCode ? Lang.getErrorText(errorCode) : Lang.getText(LangTextType.A0285);
                }
            }
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnDelete(): void {
            const slotIndex = this._getOpenData().war.getMapSlotIndex();
            if (MeModel.getReviewingMapSlotIndex() === slotIndex) {
                FloatText.show(Lang.getText(LangTextType.A0315));
                return;
            }

            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0314),
                callback: () => {
                    MeProxy.reqMeDeleteSlot(slotIndex);
                },
            });
        }

        private _onTouchedBtnSave(): void {
            const slotIndex             = Helpers.getExisted(MapEditor.MeModel.getWar()).getMapSlotIndex();
            const mapRawData            = Helpers.getExisted(this._mapRawData);
            const reviewingSlotIndex    = MapEditor.MeModel.getReviewingMapSlotIndex();
            if (reviewingSlotIndex === slotIndex) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0245),
                    callback: () => {
                        MapEditor.MeProxy.reqMeSubmitMap(slotIndex, mapRawData, false);
                        this.close();
                    },
                });
            } else {
                if (reviewingSlotIndex == null) {
                    MapEditor.MeProxy.reqMeSubmitMap(slotIndex, mapRawData, false);
                    this.close();
                } else {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                        content : Lang.getText(LangTextType.A0084),
                        callback: () => {
                            MapEditor.MeProxy.reqMeSubmitMap(slotIndex, mapRawData, false);
                            this.close();
                        },
                    });
                }
            }
        }

        private _onTouchedBtnSaveAndSubmit(): void {
            if (!this._canSubmitForReview) {
                FloatText.show(Lang.getText(LangTextType.A0316));
                return;
            }

            const slotIndex             = Helpers.getExisted(MapEditor.MeModel.getWar()).getMapSlotIndex();
            const mapRawData            = Helpers.getExisted(this._mapRawData);
            const reviewingSlotIndex    = MapEditor.MeModel.getReviewingMapSlotIndex();
            if (reviewingSlotIndex === slotIndex) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0245),
                    callback: () => {
                        MapEditor.MeProxy.reqMeSubmitMap(slotIndex, mapRawData, true);
                        this.close();
                    },
                });
            } else {
                if (reviewingSlotIndex == null) {
                    MapEditor.MeProxy.reqMeSubmitMap(slotIndex, mapRawData, true);
                    this.close();
                } else {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                        content : Lang.getText(LangTextType.A0084),
                        callback: () => {
                            MapEditor.MeProxy.reqMeSubmitMap(slotIndex, mapRawData, true);
                            this.close();
                        },
                    });
                }
            }
        }

        private _onTouchedBtnSimulation(): void {
            const war       = this._getOpenData().war;
            const errorCode = this._mapErrorCode;
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
                return;
            }

            const cb = () => {
                MapEditor.MeSimModel.resetData(Helpers.getExisted(this._mapRawData), war.serializeForCreateSfw());
                PanelHelpers.open(PanelHelpers.PanelDict.MeSimSettingsPanel, void 0);
                this.close();
            };

            if (!war.getIsMapModified()) {
                cb();
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content     : Lang.getText(LangTextType.A0317),
                    callback    : () => {
                        cb();
                    },
                });
            }
        }

        private _onTouchedBtnFreeMode(): void {
            const war       = this._getOpenData().war;
            const errorCode = this._mapErrorCode;
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
                return;
            }

            const cb = () => {
                MapEditor.MeMfwModel.resetData(Helpers.getExisted(this._mapRawData), war.serializeForCreateMfr());
                PanelHelpers.open(PanelHelpers.PanelDict.MeMfwSettingsPanel, void 0);
                this.close();
            };

            if (!war.getIsMapModified()) {
                cb();
            } else {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content         : Lang.getText(LangTextType.A0317),
                    callback        : () => {
                        cb();
                    },
                });
            }

        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnDelete.label           = Lang.getText(LangTextType.B0220);
            this._btnSave.label             = Lang.getText(LangTextType.B0844);
            this._btnSaveAndSubmit.label    = Lang.getText(LangTextType.B0921);
            this._btnSimulation.label       = Lang.getText(LangTextType.B0325);
            this._btnFreeMode.label         = Lang.getText(LangTextType.B0557);
            this._labelTitle.text           = Lang.getText(LangTextType.B0088);
            this._labelReviewDescTitle.text = Lang.getText(LangTextType.A0083);
            this._labelContent.text         = Lang.getText(LangTextType.A0082);
        }
    }

    function checkIsValidAvailability(ruleAvailability: Types.Undefinable<CommonProto.WarRule.IRuleAvailability>): boolean {
        if (ruleAvailability == null) {
            return false;
        }

        return !!((ruleAvailability.canCcw)
            || (ruleAvailability.canMcw)
            || (ruleAvailability.canMrw)
            || (ruleAvailability.canScw)
            || (ruleAvailability.canSrw));
    }
}

// export default TwnsMeConfirmSaveMapPanel;
