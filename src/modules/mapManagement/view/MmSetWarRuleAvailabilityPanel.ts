
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import WarMapProxy              from "../../warMap/model/WarMapProxy";
// import TwnsMmWarRulePanel       from "./MmWarRulePanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapManagement {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;

    export type OpenDataForMmSetWarRuleAvailabilityPanel = {
        mapId   : number;
        ruleId  : number;
    };
    export class MmSetWarRuleAvailabilityPanel extends TwnsUiPanel.UiPanel<OpenDataForMmSetWarRuleAvailabilityPanel> {
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

        private readonly _groupMrw!     : eui.Group;
        private readonly _labelMrw!     : TwnsUiLabel.UiLabel;
        private readonly _imgMrw!       : TwnsUiImage.UiImage;

        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupCcw,       callback: this._onTouchedGroupCcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupSrw,       callback: this._onTouchedGroupSrw },
                { ui: this._groupMrw,       callback: this._onTouchedGroupMrw },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
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

        private async _onTouchedBtnConfirm(): Promise<void> {
            const openData          = this._getOpenData();
            const mapId             = openData.mapId;
            const ruleId            = openData.ruleId;
            const mapRawData        = Helpers.getExisted(await WarMap.WarMapModel.getRawData(mapId));
            const templateWarRule   = Helpers.getExisted(Helpers.deepClone(mapRawData.templateWarRuleArray?.find(v => v.ruleId === ruleId)));
            const availability      : CommonProto.WarRule.IRuleAvailability = {
                canMcw  : this._imgMcw.visible,
                canCcw  : this._imgCcw.visible,
                canScw  : this._imgScw.visible,
                canSrw  : this._imgSrw.visible,
                canMrw  : this._imgMrw.visible,
            };
            templateWarRule.ruleAvailability    = availability;
            const errorCode                     = WarHelpers.WarRuleHelpers.getErrorCodeForTemplateWarRule({
                templateWarRule,
                playersCountUnneutral   : Helpers.getExisted(mapRawData.playersCountUnneutral),
                gameConfig              : await Config.ConfigManager.getLatestGameConfig(),
                allWarEventIdArray      : Helpers.getNonNullElements(mapRawData.warEventFullData?.eventArray?.map(v => v.eventId) ?? []),
            });
            if (errorCode) {
                FloatText.show(Lang.getErrorText(errorCode));
                return;
            }

            Twns.WarMap.WarMapProxy.reqMmSetWarRuleAvailability({
                mapId,
                ruleId,
                availability,
            });
            this.close();
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
        private _onTouchedGroupMrw(): void {
            this._imgMrw.visible = !this._imgMrw.visible;
        }

        private async _updateImages(): Promise<void> {
            const openData          = this._getOpenData();
            const availability      = (await WarMap.WarMapModel.getRawData(openData.mapId))?.templateWarRuleArray?.find(v => v.ruleId === openData.ruleId)?.ruleAvailability ?? {};
            this._imgMcw.visible    = !!availability.canMcw;
            this._imgCcw.visible    = !!availability.canCcw;
            this._imgScw.visible    = !!availability.canScw;
            this._imgSrw.visible    = !!availability.canSrw;
            this._imgMrw.visible    = !!availability.canMrw;
        }

        private _updateComponentsForLanguage(): void {
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._labelMcw.text     = Lang.getText(LangTextType.B0200);
            this._labelCcw.text     = Lang.getText(LangTextType.B0619);
            this._labelMrw.text     = Lang.getText(LangTextType.B0404);
            this._labelScw.text     = Lang.getText(LangTextType.B0409);
            this._labelSrw.text     = Lang.getText(LangTextType.B0614);
        }
    }
}

// export default TwnsMmSetWarRuleAvailabilityPanel;
