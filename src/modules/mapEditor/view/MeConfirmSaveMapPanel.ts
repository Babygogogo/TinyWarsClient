
namespace TinyWars.MapEditor {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;
    import Types    = Utility.Types;

    export class MeConfirmSaveMapPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MeConfirmSaveMapPanel;

        private _labelTitle         : GameUi.UiLabel;
        private _labelContent       : GameUi.UiLabel;
        private _labelReviewDesc    : GameUi.UiLabel;
        private _groupNeedReview    : eui.Group;
        private _imgNeedReview      : GameUi.UiImage;
        private _labelNeedReview    : GameUi.UiLabel;
        private _btnCancel          : GameUi.UiButton;
        private _btnConfirm         : GameUi.UiButton;

        private _slotIndex  : number;
        private _mapRawData : Types.MapRawData;
        private _needReview : boolean;

        public static show(): void {
            if (!MeConfirmSaveMapPanel._instance) {
                MeConfirmSaveMapPanel._instance = new MeConfirmSaveMapPanel();
            }
            MeConfirmSaveMapPanel._instance.open();
        }

        public static hide(): void {
            if (MeConfirmSaveMapPanel._instance) {
                MeConfirmSaveMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeConfirmSaveMapPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
                { ui: this._groupNeedReview,    callback: this._onTouchedGroupNeedReview },
            ];
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();
            this._needReview            = false;
            this._imgNeedReview.visible = false;

            const war = MeManager.getWar();
            war.getUnitMap().reviseAllUnitIds();

            const mapRawData                = war.getField().serialize();
            const isValidMap                = MeUtility.checkIsValidMap(mapRawData, User.UserModel.getSelfUserId());
            this._mapRawData                = mapRawData;
            this._slotIndex                 = war.getSlotIndex();
            this._labelReviewDesc.visible   = !isValidMap;
            this._groupNeedReview.visible   = isValidMap;
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            MeProxy.reqSaveMap(this._slotIndex, this._mapRawData, this._needReview);
            this.close();
        }

        private _onTouchedGroupNeedReview(e: egret.TouchEvent): void {
            if (this._needReview) {
                this._needReview            = false;
                this._imgNeedReview.visible = false;
            } else {
                if (!MeModel.checkHasReviewingMap()) {
                    this._needReview            = true;
                    this._imgNeedReview.visible = true;
                } else {
                    Common.ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0084),
                        callback: () => {
                            this._needReview            = true;
                            this._imgNeedReview.visible = true;
                        },
                    });
                }
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text       = Lang.getText(Lang.Type.B0088);
            this._labelReviewDesc.text  = Lang.getText(Lang.Type.A0083);
            this._labelNeedReview.text  = Lang.getText(Lang.Type.B0289);
            this._labelContent.setRichText(Lang.getText(Lang.Type.A0082));
        }
    }
}
