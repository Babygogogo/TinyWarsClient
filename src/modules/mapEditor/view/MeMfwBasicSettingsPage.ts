
import { UiImage }                      from "../../../gameui/UiImage";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { WarMapBuildingListPanel }      from "../../warMap/view/WarMapBuildingListPanel";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as MeModel                     from "../model/MeModel";

export class MeMfwBasicSettingsPage extends UiTabPage<void> {
    private _btnMapNameTitle            : UiButton;
    private _labelMapName               : UiLabel;
    private _btnBuildings               : UiButton;

    private _btnModifyWarRule           : UiButton;
    private _labelWarRule               : UiLabel;

    private _btnModifyHasFog            : UiButton;
    private _imgHasFog                  : UiImage;
    private _btnHelpHasFog              : UiButton;

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
        MeModel.Mfw.tickPresetWarRuleId();
        this._updateComponentsForWarRule();
    }

    private _onTouchedBtnModifyHasFog(): void {
        const callback = () => {
            MeModel.Mfw.setHasFog(!MeModel.Mfw.getHasFog());
            this._updateImgHasFog();
            this._updateLabelWarRule();
        };
        if (MeModel.Mfw.getPresetWarRuleId() == null) {
            callback();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0129),
                callback: () => {
                    MeModel.Mfw.setPresetWarRuleId(null);
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
        const mapRawData = MeModel.Mfw.getMapRawData();
        WarMapBuildingListPanel.show({
            configVersion           : MeModel.Mfw.getWarData().settingsForCommon.configVersion,
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
        this._labelMapName.text = Lang.getLanguageText({ textArray: MeModel.Mfw.getMapRawData().mapNameArray });
    }

    private async _updateLabelWarRule(): Promise<void> {
        const label             = this._labelWarRule;
        const settingsForCommon = MeModel.Mfw.getWarData().settingsForCommon;
        label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
        label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFF0000 : 0x00FF00;
    }

    private _updateImgHasFog(): void {
        this._imgHasFog.visible = MeModel.Mfw.getHasFog();
    }
}
