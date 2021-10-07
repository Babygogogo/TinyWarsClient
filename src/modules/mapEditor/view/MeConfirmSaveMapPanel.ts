
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import MeModel                  from "../model/MeModel";
import MeProxy                  from "../model/MeProxy";
import MeUtility                from "../model/MeUtility";

namespace TwnsMeConfirmSaveMapPanel {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export class MeConfirmSaveMapPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MeConfirmSaveMapPanel;

        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelContent!         : TwnsUiLabel.UiLabel;
        private readonly _labelReviewDescTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelReviewDesc!      : TwnsUiLabel.UiLabel;
        private readonly _groupNeedReview!      : eui.Group;
        private readonly _imgNeedReview!        : TwnsUiImage.UiImage;
        private readonly _labelNeedReview!      : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!            : TwnsUiButton.UiButton;
        private readonly _btnConfirm!           : TwnsUiButton.UiButton;

        private _mapRawData : ProtoTypes.Map.IMapRawData | null = null;
        private _needReview = false;

        public static show(): void {
            if (!MeConfirmSaveMapPanel._instance) {
                MeConfirmSaveMapPanel._instance = new MeConfirmSaveMapPanel();
            }
            MeConfirmSaveMapPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (MeConfirmSaveMapPanel._instance) {
                await MeConfirmSaveMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeConfirmSaveMapPanel.exml";
            this._setIsTouchMaskEnabled();
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
                { ui: this._groupNeedReview,    callback: this._onTouchedGroupNeedReview },
            ]);

            this._updateComponentsForLanguage();
            this._needReview = false;
            this._updateImgNeedReview();

            const mapRawData                    = Helpers.getExisted(MeModel.getWar()).serializeForMap();
            const errorCode                     = await MeUtility.getErrorCodeForMapRawData(mapRawData);
            this._mapRawData                    = mapRawData;
            this._groupNeedReview.visible       = !errorCode;
            this._labelReviewDescTitle.visible  = !!errorCode;
            this._labelReviewDesc.text          = errorCode ? Lang.getErrorText(errorCode) : ``;
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            const needReview    = this._needReview;
            const slotIndex     = Helpers.getExisted(MeModel.getWar()).getMapSlotIndex();
            const mapRawData    = Helpers.getExisted(this._mapRawData);
            if ((!needReview) || (!MeModel.checkHasReviewingMap())) {
                MeProxy.reqMeSubmitMap(slotIndex, mapRawData, needReview);
                this.close();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0084),
                    callback: () => {
                        MeProxy.reqMeSubmitMap(slotIndex, mapRawData, needReview);
                        this.close();
                    },
                });
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
            this._labelReviewDesc.text      = Lang.getText(LangTextType.A0083);
            this._labelNeedReview.text      = Lang.getText(LangTextType.B0289);
            this._labelContent.setRichText(Lang.getText(LangTextType.A0082));
        }

        private _updateImgNeedReview(): void {
            this._imgNeedReview.visible = this._needReview;
        }
    }
}

export default TwnsMeConfirmSaveMapPanel;
