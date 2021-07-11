
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiButton }             from "../../../gameui/UiButton";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiTextInput }          from "../../../gameui/UiTextInput";
import * as FloatText           from "../../../utility/FloatText";
import * as Lang                from "../../../utility/Lang";
import * as Notify              from "../../../utility/Notify";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as Types               from "../../../utility/Types";
import * as MfrModel            from "../../multiFreeRoom/model/MfrModel";
import * as MfrProxy            from "../../multiFreeRoom/model/MfrProxy";

type OpenDataForMfrJoinPasswordPanel = {
    roomInfo: ProtoTypes.MultiFreeRoom.IMfrRoomInfo;
};
export class MfrJoinPasswordPanel extends UiPanel<OpenDataForMfrJoinPasswordPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MfrJoinPasswordPanel;

    private _labelTitle         : UiLabel;
    private _labelRoomTitle     : UiLabel;
    private _labelPasswordTitle : UiLabel;
    private _labelWarName       : UiLabel;
    private _inputWarPassword   : UiTextInput;
    private _btnCancel          : UiButton;
    private _btnConfirm         : UiButton;

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
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            FloatText.show(Lang.getText(Lang.Type.A0017));
        } else {
            this.close();

            const joinData = MfrModel.Join.getFastJoinData(roomInfo);
            if (joinData) {
                MfrProxy.reqMfrJoinRoom(joinData);
            } else {
                FloatText.show(Lang.getText(Lang.Type.A0145));
                MfrProxy.reqMfrGetJoinableRoomInfoList();
            }
        }
    }

    private _updateComponentsForLanguage(): void {
        const info                      = this._getOpenData().roomInfo;
        this._labelWarName.text         = info.settingsForMfw.warName || Lang.getText(Lang.Type.B0555);
        this._labelTitle.text           = Lang.getText(Lang.Type.B0449);
        this._labelRoomTitle.text       = `${Lang.getText(Lang.Type.B0405)}:`;
        this._labelPasswordTitle.text   = `${Lang.getText(Lang.Type.B0171)}:`;
        this._btnCancel.label           = Lang.getText(Lang.Type.B0154);
        this._btnConfirm.label          = Lang.getText(Lang.Type.B0026);
    }
}
