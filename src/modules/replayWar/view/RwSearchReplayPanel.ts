
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types                       from "../../../utility/Types";
import * as RwProxy                     from "../model/RwProxy";

export class RwSearchReplayPanel extends UiPanel<void> {
    protected _IS_EXCLUSIVE = false;
    protected _LAYER_TYPE   = Types.LayerType.Hud2;

    private static _instance: RwSearchReplayPanel;

    private readonly _imgMask                   : UiImage;

    private readonly _group                     : eui.Group;
    private readonly _btnReset                  : UiButton;
    private readonly _btnSearch                 : UiButton;
    private readonly _labelName                 : UiLabel;
    private readonly _labelDesc                 : UiLabel;

    private readonly _labelReplayIdTitle        : UiLabel;
    private readonly _inputReplayId             : UiTextInput;

    private readonly _labelMapNameTitle         : UiLabel;
    private readonly _inputMapName              : UiTextInput;

    private readonly _labelUserNicknameTitle    : UiLabel;
    private readonly _inputUserNickname         : UiTextInput;

    private readonly _labelCoNameTitle          : UiLabel;
    private readonly _inputCoName               : UiTextInput;

    private readonly _labelMinGlobalRatingTitle : UiLabel;
    private readonly _inputMinGlobalRating      : UiTextInput;

    private readonly _labelMinMyRatingTitle     : UiLabel;
    private readonly _inputMinMyRating          : UiTextInput;

    public static show(): void {
        if (!RwSearchReplayPanel._instance) {
            RwSearchReplayPanel._instance = new RwSearchReplayPanel();
        }
        RwSearchReplayPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (RwSearchReplayPanel._instance) {
            await RwSearchReplayPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/replayWar/RwSearchReplayPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnReset,               callback: this._onTouchedBtnReset },
            { ui: this._btnSearch,              callback: this._onTouchedBtnSearch },
            { ui: this._inputMinGlobalRating,   callback: this._onFocusOutInputMinGlobalRating, eventType: egret.Event.FOCUS_OUT },
            { ui: this._inputMinMyRating,       callback: this._onFocusOutInputMinMyRating,     eventType: egret.Event.FOCUS_OUT },
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

    private _onTouchedBtnReset(e: egret.TouchEvent): void {
        RwProxy.reqReplayInfos(null);
        this.close();
    }

    private _onTouchedBtnSearch(e: egret.TouchEvent): void {
        RwProxy.reqReplayInfos({
            replayId        : getNumber(this._inputReplayId.text),
            mapName         : this._inputMapName.text || null,
            userNickname    : this._inputUserNickname.text || null,
            minMyRating     : getNumber(this._inputMinMyRating.text),
            minGlobalRating : getNumber(this._inputMinGlobalRating.text),
            coName          : this._inputCoName.text || null,
        });
        this.close();
    }

    private _onFocusOutInputMinGlobalRating(e: egret.Event): void {
        const input     = this._inputMinGlobalRating;
        const maxRating = CommonConstants.ReplayMaxRating;
        if (Number(input.text) > maxRating) {
            input.text = "" + maxRating;
        }
    }

    private _onFocusOutInputMinMyRating(e: egret.Event): void {
        const input     = this._inputMinMyRating;
        const maxRating = CommonConstants.ReplayMaxRating;
        if (Number(input.text) > maxRating) {
            input.text = "" + maxRating;
        }
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelName.text                    = Lang.getText(LangTextType.B0447);
        this._labelReplayIdTitle.text           = Lang.getText(LangTextType.B0235);
        this._labelMapNameTitle.text            = Lang.getText(LangTextType.B0225);
        this._labelUserNicknameTitle.text       = Lang.getText(LangTextType.B0393);
        this._labelCoNameTitle.text             = Lang.getText(LangTextType.B0394);
        this._labelMinMyRatingTitle.text        = Lang.getText(LangTextType.B0363);
        this._labelMinGlobalRatingTitle.text    = Lang.getText(LangTextType.B0364);
        this._labelDesc.text                    = Lang.getText(LangTextType.A0063);
        this._btnReset.label                    = Lang.getText(LangTextType.B0567);
        this._btnSearch.label                   = Lang.getText(LangTextType.B0228);
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

function getNumber(text: string): number | null {
    const num = text ? Number(text) : null;
    return isNaN(num) ? null : num;
}
