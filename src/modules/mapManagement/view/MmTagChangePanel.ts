
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import WarMapModel          from "../../warMap/model/WarMapModel";
import WarMapProxy          from "../../warMap/model/WarMapProxy";
import TwnsMmWarRulePanel   from "./MmWarRulePanel";

namespace TwnsMmTagChangePanel {
    import MmWarRulePanel   = TwnsMmWarRulePanel.MmWarRulePanel;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    type OpenDataForMmTagChangePanel = {
        mapId   : number;
    };
    export class MmTagChangePanel extends TwnsUiPanel.UiPanel<OpenDataForMmTagChangePanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MmTagChangePanel;

        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnWarRule!   : TwnsUiButton.UiButton;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        private readonly _groupFog!     : eui.Group;
        private readonly _labelFog!     : TwnsUiLabel.UiLabel;
        private readonly _imgFog!       : TwnsUiImage.UiImage;

        public static show(openData: OpenDataForMmTagChangePanel): void {
            if (!MmTagChangePanel._instance) {
                MmTagChangePanel._instance = new MmTagChangePanel();
            }
            MmTagChangePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MmTagChangePanel._instance) {
                await MmTagChangePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmTagChangePanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnWarRule,     callback: this._onTouchedBtnWarRule },
                { ui: this._groupFog,       callback: this._onTouchedGroupMcw },
            ]);

            this._updateComponentsForLanguage();

            const briefData         = Helpers.getExisted(await WarMapModel.getBriefData(this._getOpenData().mapId));
            this._imgFog.visible    = !!(briefData.mapTag || {}).fog;
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            WarMapProxy.reqMmSetMapTag(this._getOpenData().mapId, {
                fog : this._imgFog.visible ? true : null,
            });
            this.close();
        }

        private async _onTouchedBtnWarRule(): Promise<void> {
            MmWarRulePanel.show(Helpers.getExisted(await WarMapModel.getRawData(this._getOpenData().mapId)));
            this.close();
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedGroupMcw(): void {
            this._imgFog.visible = !this._imgFog.visible;
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0444);
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._btnWarRule.label  = Lang.getText(LangTextType.B0314);
            this._labelFog.text     = Lang.getText(LangTextType.B0438);
        }
    }
}

export default TwnsMmTagChangePanel;
