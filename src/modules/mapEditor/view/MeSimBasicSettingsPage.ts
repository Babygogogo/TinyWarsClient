
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MapEditor {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export class MeSimBasicSettingsPage extends GameUi.UiTabPage<void> {
        private _btnMapNameTitle            : GameUi.UiButton;
        private _labelMapName               : GameUi.UiLabel;
        private _btnBuildings               : GameUi.UiButton;

        private _btnModifyWarRule           : GameUi.UiButton;
        private _labelWarRule               : GameUi.UiLabel;

        private _btnModifyHasFog            : GameUi.UiButton;
        private _imgHasFog                  : GameUi.UiImage;
        private _btnHelpHasFog              : GameUi.UiButton;

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeSimBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModifyWarRule,           callback: this._onTouchedBtnModifyWarRule },
                { ui: this._btnModifyHasFog,            callback: this._onTouchedBtnModifyHasFog, },
                { ui: this._btnHelpHasFog,              callback: this._onTouchedBtnHelpHasFog, },
                { ui: this._btnBuildings,               callback: this._onTouchedBtnBuildings },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
            MeModel.Sim.tickPresetWarRuleId();
            this._updateComponentsForWarRule();
        }

        private _onTouchedBtnModifyHasFog(): void {
            const callback = () => {
                MeModel.Sim.setHasFog(!MeModel.Sim.getHasFog());
                this._updateImgHasFog();
                this._updateLabelWarRule();
            };
            if (MeModel.Sim.getPresetWarRuleId() == null) {
                callback();
            } else {
                Common.CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0129),
                    callback: () => {
                        MeModel.Sim.setPresetWarRuleId(null);
                        callback();
                    },
                });
            }
        }

        private _onTouchedBtnHelpHasFog(): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getText(Lang.Type.R0002),
            });
        }

        private async _onTouchedBtnBuildings(): Promise<void> {
            const mapRawData = MeModel.Sim.getMapRawData();
            WarMap.WarMapBuildingListPanel.show({
                configVersion           : MeModel.Sim.getWarData().settingsForCommon.configVersion,
                tileDataArray           : mapRawData.tileDataArray,
                playersCountUnneutral   : mapRawData.playersCountUnneutral,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnMapNameTitle.label         = Lang.getText(Lang.Type.B0225);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
        }

        private _updateComponentsForWarRule(): void {
            this._updateLabelWarRule();
            this._updateImgHasFog();
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = Lang.getLanguageText({ textArray: MeModel.Sim.getMapRawData().mapNameArray });
        }

        private async _updateLabelWarRule(): Promise<void> {
            const label             = this._labelWarRule;
            const settingsForCommon = MeModel.Sim.getWarData().settingsForCommon;
            label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
            label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFF0000 : 0x00FF00;
        }

        private _updateImgHasFog(): void {
            this._imgHasFog.visible = MeModel.Sim.getHasFog();
        }
    }
}
