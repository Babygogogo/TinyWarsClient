
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;
    import Helpers      = Utility.Helpers;
    import WarMapModel  = WarMap.WarMapModel;

    type OpenData = {
        roomInfo: ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
    };
    export class McrJoinPasswordPanel extends GameUi.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinPasswordPanel;

        private readonly _imgMask               : GameUi.UiImage;
        private readonly _group                 : eui.Group;
        private readonly _labelTitle            : GameUi.UiLabel;
        private readonly _labelRoomTitle        : GameUi.UiLabel;
        private readonly _labelPasswordTitle    : GameUi.UiLabel;
        private readonly _labelWarName          : GameUi.UiLabel;
        private readonly _inputWarPassword      : GameUi.UiTextInput;
        private readonly _btnCancel             : GameUi.UiButton;
        private readonly _btnConfirm            : GameUi.UiButton;

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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
                FloatText.show(Lang.getText(Lang.Type.A0017));
            } else {
                this.close();

                const joinData = McrModel.Join.getFastJoinData(roomInfo);
                if (joinData) {
                    McrProxy.reqMcrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0145));
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

            this._labelTitle.text           = Lang.getText(Lang.Type.B0449);
            this._labelRoomTitle.text       = `${Lang.getText(Lang.Type.B0405)}:`;
            this._labelPasswordTitle.text   = `${Lang.getText(Lang.Type.B0171)}:`;
            this._btnCancel.label           = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label          = Lang.getText(Lang.Type.B0026);
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
}
