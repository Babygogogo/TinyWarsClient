
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiTextInput }                  from "../../../utility/ui/UiTextInput";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { RwProxy }                      from "../model/RwProxy";

export class RwSearchReplayPanel extends TwnsUiPanel.UiPanel<void> {
    protected _IS_EXCLUSIVE = false;
    protected _LAYER_TYPE   = Types.LayerType.Hud2;

    private static _instance: RwSearchReplayPanel;

    private readonly _imgMask                   : TwnsUiImage.UiImage;

    private readonly _group                     : eui.Group;
    private readonly _btnReset                  : TwnsUiButton.UiButton;
    private readonly _btnSearch                 : TwnsUiButton.UiButton;
    private readonly _labelName                 : TwnsUiLabel.UiLabel;
    private readonly _labelDesc                 : TwnsUiLabel.UiLabel;

    private readonly _labelReplayIdTitle        : TwnsUiLabel.UiLabel;
    private readonly _inputReplayId             : TwnsUiTextInput.UiTextInput;

    private readonly _labelMapNameTitle         : TwnsUiLabel.UiLabel;
    private readonly _inputMapName              : TwnsUiTextInput.UiTextInput;

    private readonly _labelUserNicknameTitle    : TwnsUiLabel.UiLabel;
    private readonly _inputUserNickname         : TwnsUiTextInput.UiTextInput;

    private readonly _labelCoNameTitle          : TwnsUiLabel.UiLabel;
    private readonly _inputCoName               : TwnsUiTextInput.UiTextInput;

    private readonly _labelMinGlobalRatingTitle : TwnsUiLabel.UiLabel;
    private readonly _inputMinGlobalRating      : TwnsUiTextInput.UiTextInput;

    private readonly _labelMinMyRatingTitle     : TwnsUiLabel.UiLabel;
    private readonly _inputMinMyRating          : TwnsUiTextInput.UiTextInput;

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
