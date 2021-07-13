
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiTextInput }                  from "../../../utility/ui/UiTextInput";
import { FloatText }                    from "../../../utility/FloatText";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { McrProxy }                     from "../../multiCustomRoom/model/McrProxy";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";
import { McrJoinModel }                 from "../model/McrJoinModel";
import LangTextType         = TwnsLangTextType.LangTextType;
import NotifyType       = TwnsNotifyType.NotifyType;

type OpenData = {
    roomInfo: ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
};
export class McrJoinPasswordPanel extends TwnsUiPanel.UiPanel<OpenData> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McrJoinPasswordPanel;

    private readonly _imgMask               : TwnsUiImage.UiImage;
    private readonly _group                 : eui.Group;
    private readonly _labelTitle            : TwnsUiLabel.UiLabel;
    private readonly _labelRoomTitle        : TwnsUiLabel.UiLabel;
    private readonly _labelPasswordTitle    : TwnsUiLabel.UiLabel;
    private readonly _labelWarName          : TwnsUiLabel.UiLabel;
    private readonly _inputWarPassword      : TwnsUiTextInput.UiTextInput;
    private readonly _btnCancel             : TwnsUiButton.UiButton;
    private readonly _btnConfirm            : TwnsUiButton.UiButton;

    public static show(openData: OpenData): void {
        if (!McrJoinPasswordPanel._instance) {
            McrJoinPasswordPanel._instance = new McrJoinPasswordPanel();
        }
        McrJoinPasswordPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (McrJoinPasswordPanel._instance) {
            await McrJoinPasswordPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/multiCustomRoom/McrJoinPasswordPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
            { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._showOpenAnimation();
        this._updateComponentsForLanguage();
        this._inputWarPassword.text = "";
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnCancel(): void {
        this.close();
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const roomInfo = this._getOpenData().roomInfo;
        if (this._inputWarPassword.text !== roomInfo.settingsForMcw.warPassword) {
            FloatText.show(Lang.getText(LangTextType.A0017));
        } else {
            this.close();

            const joinData = McrJoinModel.getFastJoinData(roomInfo);
            if (joinData) {
                McrProxy.reqMcrJoinRoom(joinData);
            } else {
                FloatText.show(Lang.getText(LangTextType.A0145));
                McrProxy.reqMcrGetJoinableRoomInfoList();
            }
        }
    }

    private _updateComponentsForLanguage(): void {
        const info          = this._getOpenData().roomInfo;
        const warName       = info.settingsForMcw.warName;
        const labelWarName  = this._labelWarName;
        if (warName) {
            labelWarName.text = warName;
        } else {
            labelWarName.text = "";
            WarMapModel.getMapNameInCurrentLanguage(info.settingsForMcw.mapId).then(v => labelWarName.text = v);
        }

        this._labelTitle.text           = Lang.getText(LangTextType.B0449);
        this._labelRoomTitle.text       = `${Lang.getText(LangTextType.B0405)}:`;
        this._labelPasswordTitle.text   = `${Lang.getText(LangTextType.B0171)}:`;
        this._btnCancel.label           = Lang.getText(LangTextType.B0154);
        this._btnConfirm.label          = Lang.getText(LangTextType.B0026);
    }

    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._imgMask,
            beginProps  : { alpha: 0 },
            endProps    : { alpha: 1 },
        });
        Helpers.resetTween({
            obj         : this._group,
            beginProps  : { alpha: 0, verticalCenter: -40 },
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
                endProps    : { alpha: 0, verticalCenter: -40 },
                callback    : resolve,
            });
        });
    }
}
