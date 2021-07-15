
import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
import TwnsCommonHelpPanel          from "../../common/view/CommonHelpPanel";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiImage                  from "../../tools/ui/UiImage";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiTabPage                from "../../tools/ui/UiTabPage";
import TwnsWarMapBuildingListPanel  from "../../warMap/view/WarMapBuildingListPanel";
import MeMfwModel                   from "../model/MeMfwModel";

namespace TwnsMeMfwBasicSettingsPage {
    import CommonConfirmPanel       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import CommonHelpPanel          = TwnsCommonHelpPanel.CommonHelpPanel;
    import WarMapBuildingListPanel  = TwnsWarMapBuildingListPanel.WarMapBuildingListPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import LangTextType             = TwnsLangTextType.LangTextType;

    export class MeMfwBasicSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
        private _btnMapNameTitle            : TwnsUiButton.UiButton;
        private _labelMapName               : TwnsUiLabel.UiLabel;
        private _btnBuildings               : TwnsUiButton.UiButton;

        private _btnModifyWarRule           : TwnsUiButton.UiButton;
        private _labelWarRule               : TwnsUiLabel.UiLabel;

        private _btnModifyHasFog            : TwnsUiButton.UiButton;
        private _imgHasFog                  : TwnsUiImage.UiImage;
        private _btnHelpHasFog              : TwnsUiButton.UiButton;

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeMfwBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModifyWarRule,           callback: this._onTouchedBtnModifyWarRule },
                { ui: this._btnModifyHasFog,            callback: this._onTouchedBtnModifyHasFog, },
                { ui: this._btnHelpHasFog,              callback: this._onTouchedBtnHelpHasFog, },
                { ui: this._btnBuildings,               callback: this._onTouchedBtnBuildings },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._btnModifyHasFog.setTextColor(0x00FF00);
            this._btnModifyWarRule.setTextColor(0x00FF00);

            this._updateComponentsForLanguage();
            this._updateComponentsForWarRule();
            this._updateLabelMapName();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModifyWarRule(): void {
            MeMfwModel.tickPresetWarRuleId();
            this._updateComponentsForWarRule();
        }

        private _onTouchedBtnModifyHasFog(): void {
            const callback = () => {
                MeMfwModel.setHasFog(!MeMfwModel.getHasFog());
                this._updateImgHasFog();
                this._updateLabelWarRule();
            };
            if (MeMfwModel.getPresetWarRuleId() == null) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0129),
                    callback: () => {
                        MeMfwModel.setPresetWarRuleId(null);
                        callback();
                    },
                });
            }
        }

        private _onTouchedBtnHelpHasFog(): void {
            CommonHelpPanel.show({
                title  : Lang.getText(LangTextType.B0020),
                content: Lang.getText(LangTextType.R0002),
            });
        }

        private async _onTouchedBtnBuildings(): Promise<void> {
            const mapRawData = MeMfwModel.getMapRawData();
            WarMapBuildingListPanel.show({
                configVersion           : MeMfwModel.getWarData().settingsForCommon.configVersion,
                tileDataArray           : mapRawData.tileDataArray,
                playersCountUnneutral   : mapRawData.playersCountUnneutral,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnMapNameTitle.label         = Lang.getText(LangTextType.B0225);
            this._btnModifyHasFog.label         = Lang.getText(LangTextType.B0020);
            this._btnModifyWarRule.label        = Lang.getText(LangTextType.B0318);
            this._btnBuildings.label            = Lang.getText(LangTextType.B0333);
        }

        private _updateComponentsForWarRule(): void {
            this._updateLabelWarRule();
            this._updateImgHasFog();
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = Lang.getLanguageText({ textArray: MeMfwModel.getMapRawData().mapNameArray });
        }

        private async _updateLabelWarRule(): Promise<void> {
            const label             = this._labelWarRule;
            const settingsForCommon = MeMfwModel.getWarData().settingsForCommon;
            label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
            label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFF0000 : 0x00FF00;
        }

        private _updateImgHasFog(): void {
            this._imgHasFog.visible = MeMfwModel.getHasFog();
        }
    }
}

export default TwnsMeMfwBasicSettingsPage;
