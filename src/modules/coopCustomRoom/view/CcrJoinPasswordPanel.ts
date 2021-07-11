
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import * as FloatText                   from "../../../utility/FloatText";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as CcrModel                    from "../../coopCustomRoom/model/CcrModel";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as CcrProxy                    from "../model/CcrProxy";

type OpenDataForCcrJoinPasswordPanel = {
    roomInfo: ProtoTypes.CoopCustomRoom.ICcrRoomInfo;
};
export class CcrJoinPasswordPanel extends UiPanel<OpenDataForCcrJoinPasswordPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CcrJoinPasswordPanel;

    private readonly _labelTitle            : UiLabel;
    private readonly _labelRoomTitle        : UiLabel;
    private readonly _labelPasswordTitle    : UiLabel;
    private readonly _labelWarName          : UiLabel;
    private readonly _inputWarPassword      : UiTextInput;
    private readonly _btnCancel             : UiButton;
    private readonly _btnConfirm            : UiButton;

    public static show(openData: OpenDataForCcrJoinPasswordPanel): void {
        if (!CcrJoinPasswordPanel._instance) {
            CcrJoinPasswordPanel._instance = new CcrJoinPasswordPanel();
        }
        CcrJoinPasswordPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (CcrJoinPasswordPanel._instance) {
            await CcrJoinPasswordPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/coopCustomRoom/CcrJoinPasswordPanel.exml";
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

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnCancel(): void {
        this.close();
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const roomInfo = this._getOpenData().roomInfo;
        if (this._inputWarPassword.text !== roomInfo.settingsForCcw.warPassword) {
            FloatText.show(Lang.getText(LangTextType.A0017));
        } else {
            this.close();

            const joinData = CcrModel.Join.getFastJoinData(roomInfo);
            if (joinData) {
                CcrProxy.reqCcrJoinRoom(joinData);
            } else {
                FloatText.show(Lang.getText(LangTextType.A0145));
                CcrProxy.reqCcrGetJoinableRoomInfoList();
            }
        }
    }

    private _updateComponentsForLanguage(): void {
        const info          = this._getOpenData().roomInfo;
        const warName       = info.settingsForCcw.warName;
        const labelWarName  = this._labelWarName;
        if (warName) {
            labelWarName.text = warName;
        } else {
            labelWarName.text = "";
            WarMapModel.getMapNameInCurrentLanguage(info.settingsForCcw.mapId).then(v => labelWarName.text = v);
        }

        this._labelTitle.text           = Lang.getText(LangTextType.B0449);
        this._labelRoomTitle.text       = `${Lang.getText(LangTextType.B0405)}:`;
        this._labelPasswordTitle.text   = `${Lang.getText(LangTextType.B0171)}:`;
        this._btnCancel.label           = Lang.getText(LangTextType.B0154);
        this._btnConfirm.label          = Lang.getText(LangTextType.B0026);
    }
}
