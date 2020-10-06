
namespace TinyWars.MapEditor {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import InvalidationType = Types.CustomMapInvalidationType;

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
        private _mapRawData : ProtoTypes.Map.IMapRawData;
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
            this._needReview = false;
            this._updateImgNeedReview();

            const war = MeManager.getWar();
            (war.getUnitMap() as MeUnitMap).reviseAllUnitIds();

            const mapRawData                = war.serializeForMap();
            const invalidationType          = MeUtility.getMapInvalidationType(mapRawData);
            this._mapRawData                = mapRawData;
            this._slotIndex                 = war.getMapSlotIndex();
            this._groupNeedReview.visible   = invalidationType === InvalidationType.Valid;
            this._labelReviewDesc.text      = getMapInvalidationDesc(invalidationType);
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
                Common.CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0084),
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
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text       = Lang.getText(Lang.Type.B0088);
            this._labelReviewDesc.text  = Lang.getText(Lang.Type.A0083);
            this._labelNeedReview.text  = Lang.getText(Lang.Type.B0289);
            this._labelContent.setRichText(Lang.getText(Lang.Type.A0082));
        }

        private _updateImgNeedReview(): void {
            this._imgNeedReview.visible = this._needReview;
        }
    }

    function getMapInvalidationDesc(type: InvalidationType): string {
        switch (type) {
            case InvalidationType.InvalidMapDesigner    : return Lang.getText(Lang.Type.A0118);
            case InvalidationType.InvalidMapName        : return Lang.getText(Lang.Type.A0119);
            case InvalidationType.InvalidMapNameEnglish : return Lang.getText(Lang.Type.A0120);
            case InvalidationType.InvalidPlayersCount   : return Lang.getText(Lang.Type.A0121);
            case InvalidationType.InvalidTiles          : return Lang.getText(Lang.Type.A0122);
            case InvalidationType.InvalidUnits          : return Lang.getText(Lang.Type.A0123);
            case InvalidationType.InvalidWarRuleList    : return Lang.getText(Lang.Type.A0124);
            default: return "";
        }
    }
}
