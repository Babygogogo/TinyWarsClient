
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.CoopCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;
    import WarMapModel  = WarMap.WarMapModel;

    type OpenDataForCcrJoinPasswordPanel = {
        roomInfo: ProtoTypes.CoopCustomRoom.ICcrRoomInfo;
    };
    export class CcrJoinPasswordPanel extends GameUi.UiPanel<OpenDataForCcrJoinPasswordPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CcrJoinPasswordPanel;

        private readonly _labelTitle            : GameUi.UiLabel;
        private readonly _labelRoomTitle        : GameUi.UiLabel;
        private readonly _labelPasswordTitle    : GameUi.UiLabel;
        private readonly _labelWarName          : GameUi.UiLabel;
        private readonly _inputWarPassword      : GameUi.UiTextInput;
        private readonly _btnCancel             : GameUi.UiButton;
        private readonly _btnConfirm            : GameUi.UiButton;

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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
                FloatText.show(Lang.getText(Lang.Type.A0017));
            } else {
                this.close();

                const joinData = CcrModel.Join.getFastJoinData(roomInfo);
                if (joinData) {
                    CcrProxy.reqCcrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0145));
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

            this._labelTitle.text           = Lang.getText(Lang.Type.B0449);
            this._labelRoomTitle.text       = `${Lang.getText(Lang.Type.B0405)}:`;
            this._labelPasswordTitle.text   = `${Lang.getText(Lang.Type.B0171)}:`;
            this._btnCancel.label           = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label          = Lang.getText(Lang.Type.B0026);
        }
    }
}
