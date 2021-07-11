
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { McrCreateMapListPanel }        from "./McrCreateMapListPanel";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import { Types }                        from "../../../utility/Types";

export class McrCreateSearchMapPanel extends UiPanel<void> {
    protected _IS_EXCLUSIVE = false;
    protected _LAYER_TYPE   = Types.LayerType.Hud2;

    private static _instance: McrCreateSearchMapPanel;

    private readonly _imgMask                   : UiImage;

    private readonly _group                     : eui.Group;
    private readonly _btnClose                  : UiButton;
    private readonly _btnReset                  : UiButton;
    private readonly _btnSearch                 : UiButton;
    private readonly _labelName                 : UiLabel;
    private readonly _labelMapNameTitle         : UiLabel;
    private readonly _labelDesignerTitle        : UiLabel;
    private readonly _labelPlayersCountTitle    : UiLabel;
    private readonly _labelPlayedTimesTitle     : UiLabel;
    private readonly _labelMinRatingTitle       : UiLabel;
    private readonly _labelDesc                 : UiLabel;
    private readonly _inputMapName              : UiTextInput;
    private readonly _inputDesigner             : UiTextInput;
    private readonly _inputPlayersCount         : UiTextInput;
    private readonly _inputPlayedTimes          : UiTextInput;
    private readonly _inputMinRating            : UiTextInput;

    private readonly _labelTagFogTitle          : UiLabel;
    private readonly _labelTagFog               : UiLabel;
    private readonly _btnTagFog                 : UiButton;

    private _mapTag         : ProtoTypes.Map.IDataForMapTag = {};

    public static show(): void {
        if (!McrCreateSearchMapPanel._instance) {
            McrCreateSearchMapPanel._instance = new McrCreateSearchMapPanel();
        }
        McrCreateSearchMapPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (McrCreateSearchMapPanel._instance) {
            await McrCreateSearchMapPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/multiCustomRoom/McrCreateSearchMapPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.close },
            { ui: this._btnReset,   callback: this._onTouchedBtnReset },
            { ui: this._btnSearch,  callback: this._onTouchedBtnSearch },
            { ui: this._btnTagFog,  callback: this._onTouchedBtnTagFog },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._showOpenAnimation();
        this._updateComponentsForLanguage();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onTouchedBtnReset(): void {
        McrCreateMapListPanel.getInstance().setMapFilters({});
        this.close();
    }

    private _onTouchedBtnSearch(): void {
        const minRatingText = this._inputMinRating.text;
        const minRating     = minRatingText ? Number(minRatingText) : null;
        McrCreateMapListPanel.getInstance().setMapFilters({
            mapName     : this._inputMapName.text || null,
            mapDesigner : this._inputDesigner.text || null,
            playersCount: Number(this._inputPlayersCount.text) || null,
            playedTimes : Number(this._inputPlayedTimes.text) || null,
            minRating   : (minRating == null || isNaN(minRating)) ? null : minRating,
            mapTag      : this._mapTag,
        });

        this.close();
    }

    private _onTouchedBtnTagFog(): void {
        const mapTag = this._mapTag;
        const hasFog = mapTag.fog;
        if (hasFog == true) {
            mapTag.fog = false;
        } else if (hasFog == false) {
            mapTag.fog = null;
        } else {
            mapTag.fog = true;
        }
        this._updateLabelTagFog();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelName.text                = Lang.getText(LangTextType.B0447);
        this._labelMapNameTitle.text        = Lang.getText(LangTextType.B0225);
        this._labelDesignerTitle.text       = Lang.getText(LangTextType.B0251);
        this._labelPlayersCountTitle.text   = Lang.getText(LangTextType.B0229);
        this._labelPlayedTimesTitle.text    = Lang.getText(LangTextType.B0568);
        this._labelMinRatingTitle.text      = Lang.getText(LangTextType.B0569);
        this._labelTagFogTitle.text         = Lang.getText(LangTextType.B0570);
        this._labelDesc.text                = Lang.getText(LangTextType.A0063);
        this._btnReset.label                = Lang.getText(LangTextType.B0567);
        this._btnSearch.label               = Lang.getText(LangTextType.B0228);
        this._updateLabelTagFog();
    }

    private _updateLabelTagFog(): void {
        const hasFog    = this._mapTag.fog;
        const label     = this._labelTagFog;
        if (hasFog == true) {
            label.text = Lang.getText(LangTextType.B0012);
        } else if (hasFog == false) {
            label.text = Lang.getText(LangTextType.B0013);
        } else {
            label.text = undefined;
        }
    }

    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._imgMask,
            beginProps  : { alpha: 0 },
            endProps    : { alpha: 1 },
        });
        Helpers.resetTween({
            obj         : this._group,
            beginProps  : { alpha: 0, verticalCenter: 40 },
            endProps    : { alpha: 1, verticalCenter: 0 },
        });
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>(resolve => {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
                callback    : resolve,
            });
        });
    }
}
