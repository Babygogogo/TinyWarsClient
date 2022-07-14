
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import LangTextType = Twns.Lang.LangTextType;

    export type OpenDataForBwSimpleDialoguePanel = {
        gameConfig      : Twns.Config.GameConfig;
        actionData      : CommonProto.WarEvent.IWeaSimpleDialogue;
        callbackOnClose : () => void;
    };
    export class BwSimpleDialoguePanel extends TwnsUiPanel.UiPanel<OpenDataForBwSimpleDialoguePanel> {
        private readonly _group!            : eui.Group;
        private readonly _btnSkip!          : TwnsUiButton.UiButton;
        private readonly _imgTouchMask!     : TwnsUiImage.UiImage;

        private readonly _groupDialogue1!   : eui.Group;
        private readonly _groupCo1!         : eui.Group;
        private readonly _imgCo1!           : TwnsUiImage.UiImage;
        private readonly _labelName1!       : TwnsUiLabel.UiLabel;
        private readonly _labelContent1!    : TwnsUiLabel.UiLabel;

        private readonly _groupDialogue2!   : eui.Group;
        private readonly _groupCo2!         : eui.Group;
        private readonly _imgCo2!           : TwnsUiImage.UiImage;
        private readonly _labelName2!       : TwnsUiLabel.UiLabel;
        private readonly _labelContent2!    : TwnsUiLabel.UiLabel;

        private _dialogueIndex  = -1;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnSkip,        callback: this._onTouchedBtnSkip },
                { ui: this._imgTouchMask,   callback: this._onTouchedImgTouchMask },
            ]);
            this._setNotifyListenerArray([
                { type: Twns.Notify.NotifyType.LanguageChanged,  callback: this._onNotifyLanguageChanged },
            ]);
            this._imgTouchMask.touchEnabled = true;
        }
        protected async _updateOnOpenDataChanged(oldOpenData: OpenDataForBwSimpleDialoguePanel | null): Promise<void> {
            this._updateComponentsForLanguage();

            if (oldOpenData) {
                oldOpenData.callbackOnClose();
            }

            this._dialogueIndex             = -1;
            this._groupDialogue1.visible    = false;
            this._groupDialogue2.visible    = false;
            this._tickDialogue();
        }
        protected _onClosing(): void {
            this._getOpenData().callbackOnClose();
        }

        private _onTouchedBtnSkip(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0226),
                callback: () => this.close(),
            });
        }
        private _onTouchedImgTouchMask(): void {
            if (Twns.Helpers.getExisted(this._getOpenData().actionData.dataArray)[this._dialogueIndex + 1]) {
                this._tickDialogue();
            } else {
                this.close();
            }
            Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnSkip.label = Lang.getText(LangTextType.B0665);

            this._updateComponentsForDialogue();
        }

        private _updateComponentsForDialogue(): void {
            // const index             = this._dialogueIndex;
            // const dataArray         = Helpers.getExisted(this._getOpenData().actionData.dataArray);
            // const dataForCoDialogue = dataArray[index].dataForCoDialogue;
            // const labelName1        = this._labelName1;
            // const labelName2        = this._labelName2;
            // const labelContent1     = this._labelContent1;
            // const labelContent2     = this._labelContent2;
            // const imgCo1            = this._imgCo1;
            // const imgCo2            = this._imgCo2;
            // const configVersion     = Helpers.getExisted(ConfigManager.getLatestConfigVersion());

            // if (index === 0) {
            //     labelName1.text     = ``;
            //     labelName2.text     = ``;
            //     imgCo1.source       = ``;
            //     imgCo2.source       = ``;
            //     labelContent1.text  = ``;
            //     labelContent2.text  = ``;

            //     // if (dataForCoDialogue) {
            //     //     const nextData = dataArray[index + 1]?.dataForCoDialogue;
            //     //     if (nextData) {
            //     //         const nextSide = nextData.side;
            //     //         if (nextSide !== dataForCoDialogue.side) {
            //     //             const coId          = Helpers.getExisted(nextData.coId);
            //     //             const coImageSource = ConfigManager.getCoHeadImageSource(Helpers.getExisted(coId));
            //     //             const coName        = Lang.getLanguageText({ textArray: dataForCoDialogue.nameArray }) ?? ConfigManager.getCoNameAndTierText(configVersion, coId);
            //     //             if (nextSide === Types.WarEventActionSimpleDialogueSide.Bottom) {
            //     //                 imgCo1.source   = coImageSource;
            //     //                 labelName1.text = coName;
            //     //             } else if (nextSide === Types.WarEventActionSimpleDialogueSide.Top) {
            //     //                 imgCo2.source   = coImageSource;
            //     //                 labelName2.text = coName;
            //     //             }
            //     //         }
            //     //     }
            //     // }
            // }

            // const groupCo1 = this._groupCo1;
            // const groupCo2 = this._groupCo2;
            // if (dataForCoDialogue) {
            //     const { side, nameArray }   = dataForCoDialogue;
            //     const coId                  = Helpers.getExisted(dataForCoDialogue.coId);
            //     const coImageSource         = ConfigManager.getCoHeadImageSource(coId);
            //     const customName            = Lang.getLanguageText({ textArray: nameArray });
            //     const coName                = customName != null ? customName : ConfigManager.getCoNameAndTierText(configVersion, coId);

            //     if (side === Types.WarEventActionSimpleDialogueSide.Bottom) {
            //         labelName1.text     = coName;
            //         imgCo1.source       = coImageSource;
            //         Helpers.changeColor(groupCo1, Types.ColorType.Origin);
            //         Helpers.changeColor(groupCo2, Types.ColorType.Dark);
            //         labelContent1.setRichText(Helpers.getExisted(Lang.getLanguageText({
            //             textArray   : dataForCoDialogue.textArray,
            //         })).replace(/\\n/g, "\n"));

            //     } else if (side === Types.WarEventActionSimpleDialogueSide.Top) {
            //         labelName2.text     = coName;
            //         imgCo2.source       = coImageSource;
            //         Helpers.changeColor(groupCo1, Types.ColorType.Dark);
            //         Helpers.changeColor(groupCo2, Types.ColorType.Origin);
            //         labelContent2.setRichText(Helpers.getExisted(Lang.getLanguageText({
            //             textArray   : dataForCoDialogue.textArray,
            //         })).replace(/\\n/g, "\n"));

            //     } else {
            //         throw Helpers.newError(`BwSimpleDialoguePanel._updateComponentsForDialogue() invalid side.`);
            //     }

            // } else {
            //     throw Helpers.newError(`BwSimpleDialoguePanel._updateComponentsForDialogue() invalid data.`);
            // }
        }

        private _tickDialogue(): void {
            ++this._dialogueIndex;

            const openData              = this._getOpenData();
            const gameConfig            = openData.gameConfig;
            const dataForCoDialogue     = Twns.Helpers.getExisted(Twns.Helpers.getExisted(openData.actionData.dataArray)[this._dialogueIndex].dataForCoDialogue);
            const groupCo1              = this._groupCo1;
            const groupCo2              = this._groupCo2;
            const coId                  = Twns.Helpers.getExisted(dataForCoDialogue.coId);
            const coImageSource         = gameConfig.getCoHeadImageSource(coId) ?? Twns.CommonConstants.ErrorTextForUndefined;
            const coName                = Lang.getLanguageText({ textArray: dataForCoDialogue.nameArray }) ?? gameConfig.getCoNameAndTierText(coId) ?? Twns.CommonConstants.ErrorTextForUndefined;
            const side                  = dataForCoDialogue.side;

            if (side === Twns.Types.WarEventActionSimpleDialogueSide.Bottom) {
                this._groupDialogue1.visible    = true;
                this._labelName1.text           = coName;
                this._imgCo1.source             = coImageSource;
                this._labelContent1.setRichText(Twns.Helpers.getExisted(Lang.getLanguageText({
                    textArray   : dataForCoDialogue.textArray,
                })).replace(/\\n/g, "\n"));
                Twns.Helpers.changeColor(groupCo1, Twns.Types.ColorType.Origin);
                Twns.Helpers.changeColor(groupCo2, Twns.Types.ColorType.Dark);

            } else if (side === Twns.Types.WarEventActionSimpleDialogueSide.Top) {
                this._groupDialogue2.visible    = true;
                this._labelName2.text           = coName;
                this._imgCo2.source             = coImageSource;
                this._labelContent2.setRichText(Twns.Helpers.getExisted(Lang.getLanguageText({
                    textArray   : dataForCoDialogue.textArray,
                })).replace(/\\n/g, "\n"));
                Twns.Helpers.changeColor(groupCo1, Twns.Types.ColorType.Dark);
                Twns.Helpers.changeColor(groupCo2, Twns.Types.ColorType.Origin);

            } else {
                throw Twns.Helpers.newError(`BwSimpleDialoguePanel._tickDialogue() invalid side.`);
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsBwSimpleDialoguePanel;
