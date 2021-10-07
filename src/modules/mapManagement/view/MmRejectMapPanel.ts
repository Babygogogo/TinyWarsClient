
import TwnsMeWar            from "../../mapEditor/model/MeWar";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
import WarMapProxy          from "../../warMap/model/WarMapProxy";

namespace TwnsMmRejectMapPanel {
    import MeWar        = TwnsMeWar.MeWar;
    import LangTextType = TwnsLangTextType.LangTextType;

    type OpenData = {
        war: MeWar;
    };
    export class MmRejectMapPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmRejectMapPanel;

        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelTips!    : TwnsUiLabel.UiLabel;
        private readonly _inputReason!  : TwnsUiTextInput.UiTextInput;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        public static show(openData: OpenData): void {
            if (!MmRejectMapPanel._instance) {
                MmRejectMapPanel._instance = new MmRejectMapPanel();
            }
            MmRejectMapPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MmRejectMapPanel._instance) {
                await MmRejectMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmRejectMapPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
            ]);

            this._inputReason.maxChars  = CommonConstants.MapReviewCommentMaxLength;
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._labelTitle.text       = Lang.getText(LangTextType.B0297);
            this._labelTips.text        = Lang.getText(LangTextType.A0094);
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            const war = this._getOpenData().war;
            WarMapProxy.reqMmReviewMap({
                designerUserId  : war.getMapDesignerUserId(),
                slotIndex       : war.getMapSlotIndex(),
                modifiedTime    : war.getMapModifiedTime(),
                isAccept        : false,
                reviewComment   : this._inputReason.text,
                availability    : {
                    canMcw      : false,
                    canCcw      : false,
                    canMrwStd   : false,
                    canMrwFog   : false,
                    canScw      : false,
                    canSrw      : false,
                },
            });
            this.close();
        }
    }
}

export default TwnsMmRejectMapPanel;
