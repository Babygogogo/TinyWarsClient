
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
    import LangTextType = TwnsLangTextType.LangTextType;

    export type OpenDataForBwDialoguePanel = {
        gameConfig      : Twns.Config.GameConfig;
        actionData      : CommonProto.WarEvent.IWeaDialogue;
        callbackOnClose : () => void;
    };
    export class BwDialoguePanel extends TwnsUiPanel.UiPanel<OpenDataForBwDialoguePanel> {
        private readonly _group!        : eui.Group;
        private readonly _imgBg!        : TwnsUiImage.UiImage;
        private readonly _imgCo1!       : TwnsUiImage.UiImage;
        private readonly _imgCo2!       : TwnsUiImage.UiImage;
        private readonly _groupName1!   : eui.Group;
        private readonly _labelName1!   : TwnsUiLabel.UiLabel;
        private readonly _groupName2!   : eui.Group;
        private readonly _labelName2!   : TwnsUiLabel.UiLabel;
        private readonly _imgTouchMask! : TwnsUiImage.UiImage;
        private readonly _btnSkip!      : TwnsUiButton.UiButton;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;

        private _dialogueIndex  = 0;

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
        protected async _updateOnOpenDataChanged(oldOpenData: OpenDataForBwDialoguePanel | null): Promise<void> {
            if (oldOpenData) {
                oldOpenData.callbackOnClose();
            }

            this._imgBg.source          = Twns.Config.ConfigManager.getDialogueBackgroundImage(this._getOpenData().actionData.backgroundId ?? 0);
            this._groupName1.visible    = false;
            this._groupName2.visible    = false;
            this._imgCo1.source         = ``;
            this._imgCo2.source         = ``;
            this._dialogueIndex         = -1;
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
            // const index                                 = this._dialogueIndex;
            // const dataArray                             = Helpers.getExisted(this._getOpenData().actionData.dataArray);
            // const { dataForCoDialogue, dataForAside }   = dataArray[index];
            // const groupName1                            = this._groupName1;
            // const groupName2                            = this._groupName2;
            // const labelName1                            = this._labelName1;
            // const labelName2                            = this._labelName2;
            // const labelContent                          = this._labelContent;
            // const imgCo1                                = this._imgCo1;
            // const imgCo2                                = this._imgCo2;

            // if (index === 0) {
            //     groupName1.visible  = false;
            //     groupName2.visible  = false;
            //     imgCo1.source       = ``;
            //     imgCo2.source       = ``;

            //     if (dataForCoDialogue) {
            //         const nextData = dataArray[index + 1]?.dataForCoDialogue;
            //         if (nextData) {
            //             const nextSide = nextData.side;
            //             if (nextSide !== dataForCoDialogue.side) {
            //                 const coImageSource = ConfigManager.getCoBustImageSource(Helpers.getExisted(nextData.coId));
            //                 if (nextSide === Types.WarEventActionDialogueSide.Left) {
            //                     imgCo1.source = coImageSource;
            //                 } else if (nextSide === Types.WarEventActionDialogueSide.Right) {
            //                     imgCo2.source = coImageSource;
            //                 }
            //             }
            //         }
            //     }
            // }

            // if (dataForCoDialogue) {
            //     const { side, nameArray }   = dataForCoDialogue;
            //     const coId                  = Helpers.getExisted(dataForCoDialogue.coId);
            //     const coImageSource         = ConfigManager.getCoBustImageSource(coId);
            //     const customName            = Lang.getLanguageText({ textArray: nameArray });
            //     const coName                = customName != null ? customName : ConfigManager.getCoNameAndTierText(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), coId);

            //     if (side === Types.WarEventActionDialogueSide.Left) {
            //         groupName1.visible  = true;
            //         groupName2.visible  = false;
            //         labelName1.text     = coName;
            //         imgCo1.source       = coImageSource;
            //         Helpers.changeColor(imgCo1, Types.ColorType.Origin);
            //         Helpers.changeColor(imgCo2, Types.ColorType.Dark);
            //     } else if (side === Types.WarEventActionDialogueSide.Right) {
            //         groupName1.visible  = false;
            //         groupName2.visible  = true;
            //         labelName2.text     = coName;
            //         imgCo2.source       = coImageSource;
            //         Helpers.changeColor(imgCo1, Types.ColorType.Dark);
            //         Helpers.changeColor(imgCo2, Types.ColorType.Origin);
            //     } else {
            //         throw Helpers.newError(`BwDialoguePanel._updateComponentsForDialogue() invalid side.`);
            //     }

            //     labelContent.setRichText(Helpers.getExisted(Lang.getLanguageText({
            //         textArray   : dataForCoDialogue.textArray,
            //     })).replace(/\\n/g, "\n"));

            // } else if (dataForAside) {
            //     groupName1.visible  = false;
            //     groupName2.visible  = false;
            //     Helpers.changeColor(imgCo1, Types.ColorType.Dark);
            //     Helpers.changeColor(imgCo2, Types.ColorType.Dark);

            //     labelContent.setRichText(Helpers.getExisted(Lang.getLanguageText({
            //         textArray   : dataForAside.textArray,
            //     })).replace(/\\n/g, "\n"));
            // }
        }

        private _tickDialogue(): void {
            ++this._dialogueIndex;

            const groupName1                            = this._groupName1;
            const groupName2                            = this._groupName2;
            const labelName1                            = this._labelName1;
            const labelName2                            = this._labelName2;
            const labelContent                          = this._labelContent;
            const imgCo1                                = this._imgCo1;
            const imgCo2                                = this._imgCo2;
            const openData                              = this._getOpenData();
            const { dataForCoDialogue, dataForAside }   = Twns.Helpers.getExisted(openData.actionData.dataArray)[this._dialogueIndex];

            if (dataForCoDialogue) {
                const { side, nameArray }   = dataForCoDialogue;
                const coId                  = Twns.Helpers.getExisted(dataForCoDialogue.coId);
                const gameConfig            = openData.gameConfig;
                const coImageSource         = gameConfig.getCoBustImageSource(coId) ?? CommonConstants.ErrorTextForUndefined;
                const coName                = Lang.getLanguageText({ textArray: nameArray }) ?? gameConfig.getCoNameAndTierText(coId) ?? CommonConstants.ErrorTextForUndefined;

                if (side === Twns.Types.WarEventActionDialogueSide.Left) {
                    groupName1.visible  = true;
                    groupName2.visible  = false;
                    labelName1.text     = coName;
                    imgCo1.source       = coImageSource;
                    Twns.Helpers.changeColor(imgCo1, Twns.Types.ColorType.Origin);
                    Twns.Helpers.changeColor(imgCo2, Twns.Types.ColorType.Dark);

                } else if (side === Twns.Types.WarEventActionDialogueSide.Right) {
                    groupName1.visible  = false;
                    groupName2.visible  = true;
                    labelName2.text     = coName;
                    imgCo2.source       = coImageSource;
                    Twns.Helpers.changeColor(imgCo1, Twns.Types.ColorType.Dark);
                    Twns.Helpers.changeColor(imgCo2, Twns.Types.ColorType.Origin);

                } else {
                    throw Twns.Helpers.newError(`BwDialoguePanel._updateComponentsForDialogue() invalid side.`);
                }

                labelContent.setRichText(Twns.Helpers.getExisted(Lang.getLanguageText({
                    textArray   : dataForCoDialogue.textArray,
                })).replace(/\\n/g, "\n"));

            } else if (dataForAside) {
                groupName1.visible  = false;
                groupName2.visible  = false;
                imgCo1.source       = ``;
                imgCo2.source       = ``;

                labelContent.setRichText(Twns.Helpers.getExisted(Lang.getLanguageText({
                    textArray   : dataForAside.textArray,
                })).replace(/\\n/g, "\n"));
            }
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            await Twns.Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsBwDialoguePanel;
