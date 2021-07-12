
import { UiPanel }                  from "../../../utility/ui/UiPanel";
import { UiButton }                 from "../../../utility/ui/UiButton";
import { UiLabel }                  from "../../../utility/ui/UiLabel";
import { UiTextInput }              from "../../../utility/ui/UiTextInput";
import { MmAvailabilityListPanel }  from "./MmAvailabilityListPanel";
import { Lang }                     from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                   from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                    from "../../../utility/Types";

export class MmAvailabilitySearchPanel extends UiPanel<void> {
    protected _IS_EXCLUSIVE = false;
    protected _LAYER_TYPE   = Types.LayerType.Hud2;

    private static _instance: MmAvailabilitySearchPanel;

    private _btnClose               : UiButton;
    private _btnReset               : UiButton;
    private _btnSearch              : UiButton;
    private _labelName              : UiLabel;
    private _labelMapNameTitle      : UiLabel;
    private _labelDesignerTitle     : UiLabel;
    private _labelPlayersCountTitle : UiLabel;
    private _labelPlayedTimesTitle  : UiLabel;
    private _labelMinRatingTitle    : UiLabel;
    private _labelDesc              : UiLabel;
    private _inputMapName           : UiTextInput;
    private _inputDesigner          : UiTextInput;
    private _inputPlayersCount      : UiTextInput;
    private _inputPlayedTimes       : UiTextInput;
    private _inputMinRating         : UiTextInput;

    public static show(): void {
        if (!MmAvailabilitySearchPanel._instance) {
            MmAvailabilitySearchPanel._instance = new MmAvailabilitySearchPanel();
        }
        MmAvailabilitySearchPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MmAvailabilitySearchPanel._instance) {
            await MmAvailabilitySearchPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this.skinName = "resource/skins/mapManagement/MmAvailabilitySearchPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,  callback: this._onTouchedBtnClose },
            { ui: this._btnReset,  callback: this._onTouchedBtnReset },
            { ui: this._btnSearch, callback: this._onTouchedBtnSearch },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
        this._btnReset.enabled  = true;
        this._btnSearch.enabled = true;
    }

    private _onTouchedBtnClose(e: egret.TouchEvent): void {
        this.close();
    }

    private _onTouchedBtnReset(e: egret.TouchEvent): void {
        MmAvailabilityListPanel.getInstance().setMapFilters({});
        this.close();
    }

    private _onTouchedBtnSearch(e: egret.TouchEvent): void {
        MmAvailabilityListPanel.getInstance().setMapFilters({
            mapName     : this._inputMapName.text || null,
            mapDesigner : this._inputDesigner.text || null,
            playersCount: Number(this._inputPlayersCount.text) || null,
            playedTimes : Number(this._inputPlayedTimes.text) || null,
            minRating   : Number(this._inputMinRating.text) || null,
        });

        this.close();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelName.text                = Lang.getText(LangTextType.B0234);
        this._labelMapNameTitle.text        = `${Lang.getText(LangTextType.B0225)}:`;
        this._labelDesignerTitle.text       = `${Lang.getText(LangTextType.B0251)}:`;
        this._labelPlayersCountTitle.text   = `${Lang.getText(LangTextType.B0229)}:`;
        this._labelPlayedTimesTitle.text    = `${Lang.getText(LangTextType.B0252)}:`;
        this._labelMinRatingTitle.text      = `${Lang.getText(LangTextType.B0253)}:`;
        this._labelDesc.text                = Lang.getText(LangTextType.A0063);
        this._btnClose.label                = Lang.getText(LangTextType.B0146);
        this._btnReset.label                = Lang.getText(LangTextType.B0233);
        this._btnSearch.label               = Lang.getText(LangTextType.B0228);
    }
}
