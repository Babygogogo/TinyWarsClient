
// import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
// import TwnsCommonHelpPanel          from "../../common/view/CommonHelpPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiTabPage                from "../../tools/ui/UiTabPage";
// import TwnsWarMapBuildingListPanel  from "../../warMap/view/WarMapBuildingListPanel";
// import MeMfwModel                   from "../model/MeMfwModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import LangTextType             = TwnsLangTextType.LangTextType;

    export class MeMfwBasicSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _btnMapNameTitle!      : TwnsUiButton.UiButton;
        private readonly _labelMapName!         : TwnsUiLabel.UiLabel;
        private readonly _btnBuildings!         : TwnsUiButton.UiButton;

        private readonly _btnModifyWarRule!     : TwnsUiButton.UiButton;
        private readonly _labelWarRule!         : TwnsUiLabel.UiLabel;

        private readonly _btnModifyHasFog!      : TwnsUiButton.UiButton;
        private readonly _imgHasFog!            : TwnsUiImage.UiImage;
        private readonly _btnHelpHasFog!        : TwnsUiButton.UiButton;

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

        private async _onTouchedBtnModifyWarRule(): Promise<void> {
            await MapEditor.MeMfwModel.tickTemplateWarRuleId();
            this._updateComponentsForWarRule();
        }

        private _onTouchedBtnModifyHasFog(): void {
            const callback = () => {
                MapEditor.MeMfwModel.setHasFog(!MapEditor.MeMfwModel.getHasFog());
                this._updateImgHasFog();
                this._updateLabelWarRule();
            };
            if (MapEditor.MeMfwModel.getTemplateWarRuleId() == null) {
                callback();
            } else {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0129),
                    callback: () => {
                        MapEditor.MeMfwModel.setCustomWarRuleId();
                        callback();
                    },
                });
            }
        }

        private _onTouchedBtnHelpHasFog(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonHelpPanel, {
                title  : Lang.getText(LangTextType.B0020),
                content: Lang.getText(LangTextType.R0002),
            });
        }

        private async _onTouchedBtnBuildings(): Promise<void> {
            const mapRawData = MapEditor.MeMfwModel.getMapRawData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WarMapBuildingListPanel, {
                gameConfig              : await Config.ConfigManager.getGameConfig(Helpers.getExisted(MapEditor.MeMfwModel.getWarData().settingsForCommon?.configVersion)),
                tileDataArray           : Helpers.getExisted(mapRawData.tileDataArray),
                playersCountUnneutral   : Helpers.getExisted(mapRawData.playersCountUnneutral),
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
            this._labelMapName.text = Lang.getLanguageText({ textArray: MapEditor.MeMfwModel.getMapRawData().mapNameArray }) ?? CommonConstants.ErrorTextForUndefined;
        }

        private async _updateLabelWarRule(): Promise<void> {
            const labelWarRule      = this._labelWarRule;
            const instanceWarRule   = Helpers.getExisted(MapEditor.MeMfwModel.getWarData().settingsForCommon?.instanceWarRule);
            const templateWarRuleId = instanceWarRule.templateWarRuleId;
            if (templateWarRuleId == null) {
                labelWarRule.text       = Lang.getText(LangTextType.B0321);
                labelWarRule.textColor  = 0xFFFF00;
            } else {
                labelWarRule.text       = `(#${templateWarRuleId}) ${Lang.getLanguageText({ textArray: instanceWarRule.ruleNameArray }) ?? CommonConstants.ErrorTextForUndefined}`;
                labelWarRule.textColor  = 0xFFFFFF;
            }
        }

        private _updateImgHasFog(): void {
            this._imgHasFog.visible = MapEditor.MeMfwModel.getHasFog();
        }
    }
}

// export default TwnsMeMfwBasicSettingsPage;
