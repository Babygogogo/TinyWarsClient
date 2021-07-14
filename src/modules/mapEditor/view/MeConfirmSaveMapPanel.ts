
import TwnsUiImage                      from "../../tools/ui/UiImage";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import CommonConfirmPanel = TwnsCommonConfirmPanel.CommonConfirmPanel;import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import Types                        from "../../tools/helpers/Types";
import MeModel                      from "../model/MeModel";
import MeProxy                      from "../model/MeProxy";
import * as MeUtility                   from "../model/MeUtility";

export class MeConfirmSaveMapPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MeConfirmSaveMapPanel;

    private _labelTitle             : TwnsUiLabel.UiLabel;
    private _labelContent           : TwnsUiLabel.UiLabel;
    private _labelReviewDescTitle   : TwnsUiLabel.UiLabel;
    private _labelReviewDesc        : TwnsUiLabel.UiLabel;
    private _groupNeedReview        : eui.Group;
    private _imgNeedReview          : TwnsUiImage.UiImage;
    private _labelNeedReview        : TwnsUiLabel.UiLabel;
    private _btnCancel              : TwnsUiButton.UiButton;
    private _btnConfirm             : TwnsUiButton.UiButton;

    private _slotIndex  : number;
    private _mapRawData : ProtoTypes.Map.IMapRawData;
    private _needReview : boolean;

    public static show(): void {
        if (!MeConfirmSaveMapPanel._instance) {
            MeConfirmSaveMapPanel._instance = new MeConfirmSaveMapPanel();
        }
        MeConfirmSaveMapPanel._instance.open(undefined);
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

        const war                           = MeModel.getWar();
        const mapRawData                    = war.serializeForMap();
        const errorCode                     = await MeUtility.getErrorCodeForMapRawData(mapRawData);
        this._mapRawData                    = mapRawData;
        this._slotIndex                     = war.getMapSlotIndex();
        this._groupNeedReview.visible       = !errorCode;
        this._labelReviewDescTitle.visible  = !!errorCode;
        this._labelReviewDesc.text          = errorCode ? Lang.getErrorText(errorCode) : undefined;
    }

    private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        this.close();
    }

    private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
        const needReview = this._needReview;
        if ((!needReview) || (!MeModel.checkHasReviewingMap())) {
            MeProxy.reqMeSubmitMap(this._slotIndex, this._mapRawData, needReview);
            this.close();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0084),
                callback: () => {
                    MeProxy.reqMeSubmitMap(this._slotIndex, this._mapRawData, needReview);
                    this.close();
                },
            });
        }
    }

    private _onTouchedGroupNeedReview(e: egret.TouchEvent): void {
        this._needReview = !this._needReview;
        this._updateImgNeedReview();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
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
