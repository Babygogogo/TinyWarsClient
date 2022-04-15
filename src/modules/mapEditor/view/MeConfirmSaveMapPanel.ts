
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import MeModel                  from "../model/MeModel";
// import MeProxy                  from "../model/MeProxy";
// import MeUtility                from "../model/MeUtility";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeConfirmSaveMapPanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenData = void;
    export class MeConfirmSaveMapPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelContent!         : TwnsUiLabel.UiLabel;
        private readonly _labelReviewDescTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelReviewDesc!      : TwnsUiLabel.UiLabel;
        private readonly _groupNeedReview!      : eui.Group;
        private readonly _imgNeedReview!        : TwnsUiImage.UiImage;
        private readonly _labelNeedReview!      : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        private _mapRawData : CommonProto.Map.IMapRawData | null = null;
        private _needReview = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
                { ui: this._groupNeedReview,    callback: this._onTouchedGroupNeedReview },
            ]);
            this._setIsTouchMaskEnabled();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._needReview = false;
            this._updateImgNeedReview();

            const btnConfirm            = this._btnConfirm;
            const groupNeedReview       = this._groupNeedReview;
            const labelReviewDescTitle  = this._labelReviewDescTitle;
            const labelReviewDesc       = this._labelReviewDesc;
            const mapRawData            = Helpers.getExisted(MeModel.getWar()).serializeForMap();
            if (ProtoManager.encodeAsMapRawData(mapRawData).byteLength > CommonConstants.MapMaxFileSize) {
                btnConfirm.visible              = false;
                groupNeedReview.visible         = false;
                labelReviewDescTitle.visible    = false;
                labelReviewDesc.text            = Lang.getText(LangTextType.A0261);
                return;
            }

            const severeErrorCode = await MeUtility.getSevereErrorCodeForMapRawData(mapRawData);
            if (severeErrorCode) {
                btnConfirm.visible              = false;
                groupNeedReview.visible         = false;
                labelReviewDescTitle.visible    = true;
                labelReviewDesc.text            = Lang.getErrorText(severeErrorCode);
                return;
            }

            if (mapRawData.warRuleArray?.some(v => !checkIsValidAvailability(v.ruleAvailability))) {
                this._mapRawData                = mapRawData;
                btnConfirm.visible              = true;
                groupNeedReview.visible         = false;
                labelReviewDescTitle.visible    = true;
                labelReviewDesc.text            = Lang.getText(LangTextType.A0298);
                return;
            }

            const errorCode                 = await MeUtility.getErrorCodeForMapRawData(mapRawData);
            this._mapRawData                = mapRawData;
            btnConfirm.visible              = true;
            groupNeedReview.visible         = !errorCode;
            labelReviewDescTitle.visible    = !!errorCode;
            labelReviewDesc.text            = errorCode ? Lang.getErrorText(errorCode) : Lang.getText(LangTextType.A0285);
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            const needReview            = this._needReview;
            const slotIndex             = Helpers.getExisted(MeModel.getWar()).getMapSlotIndex();
            const mapRawData            = Helpers.getExisted(this._mapRawData);
            const reviewingSlotIndex    = MeModel.getReviewingMapSlotIndex();
            if (reviewingSlotIndex === slotIndex) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0245),
                    callback: () => {
                        MeProxy.reqMeSubmitMap(slotIndex, mapRawData, needReview);
                        this.close();
                    },
                });
            } else {
                if ((needReview) && (reviewingSlotIndex != null)) {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                        content : Lang.getText(LangTextType.A0084),
                        callback: () => {
                            MeProxy.reqMeSubmitMap(slotIndex, mapRawData, needReview);
                            this.close();
                        },
                    });
                } else {
                    MeProxy.reqMeSubmitMap(slotIndex, mapRawData, needReview);
                    this.close();
                }
            }
        }

        private _onTouchedGroupNeedReview(): void {
            this._needReview = !this._needReview;
            this._updateImgNeedReview();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label          = Lang.getText(LangTextType.B0026);
            this._btnCancel.label           = Lang.getText(LangTextType.B0154);
            this._labelTitle.text           = Lang.getText(LangTextType.B0088);
            this._labelReviewDescTitle.text = Lang.getText(LangTextType.A0083);
            this._labelNeedReview.text      = Lang.getText(LangTextType.B0289);
            this._labelContent.text         = Lang.getText(LangTextType.A0082);
        }

        private _updateImgNeedReview(): void {
            this._imgNeedReview.visible = this._needReview;
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
