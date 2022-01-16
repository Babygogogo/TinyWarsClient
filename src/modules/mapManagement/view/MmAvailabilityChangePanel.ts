
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
namespace TwnsMmAvailabilityChangePanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenData = {
        mapId   : number;
    };
    export class MmAvailabilityChangePanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupMcw!     : eui.Group;
        private readonly _labelMcw!     : TwnsUiLabel.UiLabel;
        private readonly _imgMcw!       : TwnsUiImage.UiImage;

        private readonly _groupCcw!     : eui.Group;
        private readonly _labelCcw!     : TwnsUiLabel.UiLabel;
        private readonly _imgCcw!       : TwnsUiImage.UiImage;

        private readonly _groupScw!     : eui.Group;
        private readonly _labelScw!     : TwnsUiLabel.UiLabel;
        private readonly _imgScw!       : TwnsUiImage.UiImage;

        private readonly _groupSrw!     : eui.Group;
        private readonly _labelSrw!     : TwnsUiLabel.UiLabel;
        private readonly _imgSrw!       : TwnsUiImage.UiImage;

        private readonly _groupMrwStd!  : eui.Group;
        private readonly _labelMrwStd!  : TwnsUiLabel.UiLabel;
        private readonly _imgMrwStd!    : TwnsUiImage.UiImage;

        private readonly _groupMrwFog!  : eui.Group;
        private readonly _labelMrwFog!  : TwnsUiLabel.UiLabel;
        private readonly _imgMrwFog!    : TwnsUiImage.UiImage;

        private readonly _btnDelete!    : TwnsUiButton.UiButton;
        private readonly _btnWarRule!   : TwnsUiButton.UiButton;
        private readonly _btnRename!    : TwnsUiButton.UiButton;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._btnWarRule,     callback: this._onTouchedBtnWarRule },
                { ui: this._btnRename,      callback: this._onTouchedBtnRename },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupCcw,       callback: this._onTouchedGroupCcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupSrw,       callback: this._onTouchedGroupSrw },
                { ui: this._groupMrwStd,    callback: this._onTouchedGroupMrwStd },
                { ui: this._groupMrwFog,    callback: this._onTouchedGroupMrwFog },
            ]);
            this._setIsTouchMaskEnabled();

            this._btnDelete.setTextColor(0xFF0000);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._updateImages();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            WarMapProxy.reqMmSetMapAvailability(this._getOpenData().mapId, {
                canMcw      : this._imgMcw.visible,
                canCcw      : this._imgCcw.visible,
                canScw      : this._imgScw.visible,
                canSrw      : this._imgSrw.visible,
                canMrwStd   : this._imgMrwStd.visible,
                canMrwFog   : this._imgMrwFog.visible,
            });
            this.close();
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
                throw Helpers.newError(`MmAvailabilityChangePanel._onTouchedBtnWarRule() empty mapRawData.`);
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

        private _onTouchedGroupMcw(): void {
            this._imgMcw.visible = !this._imgMcw.visible;
        }
        private _onTouchedGroupCcw(): void {
            this._imgCcw.visible = !this._imgCcw.visible;
        }
        private _onTouchedGroupScw(): void {
            this._imgScw.visible = !this._imgScw.visible;
        }
        private _onTouchedGroupSrw(): void {
            this._imgSrw.visible = !this._imgSrw.visible;
        }
        private _onTouchedGroupMrwStd(): void {
            this._imgMrwStd.visible = !this._imgMrwStd.visible;
        }
        private _onTouchedGroupMrwFog(): void {
            this._imgMrwFog.visible = !this._imgMrwFog.visible;
        }

        private async _updateImages(): Promise<void> {
            const briefData     = await WarMapModel.getBriefData(this._getOpenData().mapId);
            const extraData     = briefData ? briefData.mapExtraData : null;
            const complexInfo   = extraData ? extraData.mapComplexInfo : null;
            const availability  = complexInfo ? complexInfo.mapAvailability : null;
            if (availability == null) {
                throw Helpers.newError(`MmAvailabilityChangePanel._updateImages() empty availability.`);
            }

            this._imgMcw.visible        = !!availability.canMcw;
            this._imgCcw.visible        = !!availability.canCcw;
            this._imgScw.visible        = !!availability.canScw;
            this._imgSrw.visible        = !!availability.canSrw;
            this._imgMrwStd.visible     = !!availability.canMrwStd;
            this._imgMrwFog.visible     = !!availability.canMrwFog;
        }

        private _updateComponentsForLanguage(): void {
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._btnDelete.label   = Lang.getText(LangTextType.B0270);
            this._btnWarRule.label  = Lang.getText(LangTextType.B0314);
            this._btnRename.label   = Lang.getText(LangTextType.B0708);
            this._labelMcw.text     = Lang.getText(LangTextType.B0200);
            this._labelCcw.text     = Lang.getText(LangTextType.B0619);
            this._labelMrwStd.text  = Lang.getText(LangTextType.B0404);
            this._labelMrwFog.text  = Lang.getText(LangTextType.B0408);
            this._labelScw.text     = Lang.getText(LangTextType.B0409);
            this._labelSrw.text     = Lang.getText(LangTextType.B0614);
        }
    }
}

// export default TwnsMmAvailabilityChangePanel;
