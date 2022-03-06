
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import WarMapProxy              from "../../warMap/model/WarMapProxy";
// import TwnsMmWarRulePanel       from "./MmWarRulePanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMmCommandPanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenData = {
        mapId   : number;
    };
    export class MmCommandPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnDelete!    : TwnsUiButton.UiButton;
        private readonly _btnWarRule!   : TwnsUiButton.UiButton;
        private readonly _btnRename!    : TwnsUiButton.UiButton;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnWarRule,     callback: this._onTouchedBtnWarRule },
                { ui: this._btnRename,      callback: this._onTouchedBtnRename },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._btnDelete.setTextColor(0xFF0000);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnDelete(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0080),
                callback: () => {
                    WarMapProxy.reqMmSetMapEnabled(this._getOpenData().mapId, false);
                    this.close();
                },
            });
        }

        private async _onTouchedBtnWarRule(): Promise<void> {
            const mapRawData = await WarMapModel.getRawData(this._getOpenData().mapId);
            if (mapRawData == null) {
                throw Helpers.newError(`MmCommandPanel._onTouchedBtnWarRule() empty mapRawData.`);
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.MmWarRulePanel, {
                mapRawData,
            });
            this.close();
        }

        private _onTouchedBtnRename(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MmMapRenamePanel, { mapId: this._getOpenData().mapId });
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private async _updateComponentsForLanguage(): Promise<void> {
            const mapId             = this._getOpenData().mapId;
            this._labelTitle.text   = `#${mapId} ${await WarMapModel.getMapNameInCurrentLanguage(mapId)}`;
            this._btnDelete.label   = Lang.getText(LangTextType.B0270);
            this._btnWarRule.label  = Lang.getText(LangTextType.B0314);
            this._btnRename.label   = Lang.getText(LangTextType.B0708);
        }
    }
}

// export default TwnsMmCommandPanel;
