
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiButton              from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiTextInput          from "../../tools/ui/UiTextInput";
import FloatText            from "../../tools/helpers/FloatText";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import Types                from "../../tools/helpers/Types";
import { MfrJoinModel }         from "../model/MfrJoinModel";
import MfrProxy             from "../../multiFreeRoom/model/MfrProxy";
import LangTextType             = TwnsLangTextType.LangTextType;
import NotifyType               = TwnsNotifyType.NotifyType;

type OpenDataForMfrJoinPasswordPanel = {
    roomInfo: ProtoTypes.MultiFreeRoom.IMfrRoomInfo;
};
export class MfrJoinPasswordPanel extends TwnsUiPanel.UiPanel<OpenDataForMfrJoinPasswordPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MfrJoinPasswordPanel;

    private _labelTitle         : TwnsUiLabel.UiLabel;
    private _labelRoomTitle     : TwnsUiLabel.UiLabel;
    private _labelPasswordTitle : TwnsUiLabel.UiLabel;
    private _labelWarName       : TwnsUiLabel.UiLabel;
    private _inputWarPassword   : TwnsUiTextInput.UiTextInput;
    private _btnCancel          : TwnsUiButton.UiButton;
    private _btnConfirm         : TwnsUiButton.UiButton;

    public static show(openData: OpenDataForMfrJoinPasswordPanel): void {
        if (!MfrJoinPasswordPanel._instance) {
            MfrJoinPasswordPanel._instance = new MfrJoinPasswordPanel();
        }
        MfrJoinPasswordPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (MfrJoinPasswordPanel._instance) {
            await MfrJoinPasswordPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/multiFreeRoom/MfrJoinPasswordPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
            { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
        this._inputWarPassword.text = "";
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        this.close();
    }

    private async _onTouchedBtnConfirm(e: egret.TouchEvent): Promise<void> {
        const roomInfo = this._getOpenData().roomInfo;
        if (this._inputWarPassword.text !== roomInfo.settingsForMfw.warPassword) {
            FloatText.show(Lang.getText(LangTextType.A0017));
        } else {
            this.close();

            const joinData = MfrJoinModel.getFastJoinData(roomInfo);
            if (joinData) {
                MfrProxy.reqMfrJoinRoom(joinData);
            } else {
                FloatText.show(Lang.getText(LangTextType.A0145));
                MfrProxy.reqMfrGetJoinableRoomInfoList();
            }
        }
    }

    private _updateComponentsForLanguage(): void {
        const info                      = this._getOpenData().roomInfo;
        this._labelWarName.text         = info.settingsForMfw.warName || Lang.getText(LangTextType.B0555);
        this._labelTitle.text           = Lang.getText(LangTextType.B0449);
        this._labelRoomTitle.text       = `${Lang.getText(LangTextType.B0405)}:`;
        this._labelPasswordTitle.text   = `${Lang.getText(LangTextType.B0171)}:`;
        this._btnCancel.label           = Lang.getText(LangTextType.B0154);
        this._btnConfirm.label          = Lang.getText(LangTextType.B0026);
    }
}
