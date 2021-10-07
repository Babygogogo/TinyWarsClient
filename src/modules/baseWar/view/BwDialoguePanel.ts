
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import SoundManager             from "../../tools/helpers/SoundManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";

namespace TwnsBwDialoguePanel {
    import LangTextType = TwnsLangTextType.LangTextType;

    type OpenData = {
        actionData      : ProtoTypes.WarEvent.IWeaDialogue;
        callbackOnClose : () => void;
    };

    export class BwDialoguePanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwDialoguePanel;

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

        public static show(openData: OpenData): void {
            if (!BwDialoguePanel._instance) {
                BwDialoguePanel._instance = new BwDialoguePanel();
            }
            BwDialoguePanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (BwDialoguePanel._instance) {
                await BwDialoguePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/baseWar/BwDialoguePanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnSkip,        callback: this._onTouchedBtnSkip },
                { ui: this._imgTouchMask,   callback: this._onTouchedImgTouchMask },
            ]);
            this._setNotifyListenerArray([
                { type: TwnsNotifyType.NotifyType.LanguageChanged,  callback: this._onNotifyLanguageChanged },
            ]);
            this._imgTouchMask.touchEnabled = true;

            this._showOpenAnimation();

            this._dialogueIndex = 0;
            this._updateComponentsForLanguage();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._getOpenData().callbackOnClose();
        }

        private _onTouchedBtnSkip(): void {
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0226),
                callback: () => this.close(),
            });
        }
        private _onTouchedImgTouchMask(): void {
            this._checkAndShowNextDialogue();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnSkip.label = Lang.getText(LangTextType.B0665);

            this._updateComponentsForDialogue();
        }

        private _updateComponentsForDialogue(): void {
            const index                                 = this._dialogueIndex;
            const dataArray                             = Helpers.getExisted(this._getOpenData().actionData.dataArray);
            const { dataForCoDialogue, dataForAside }   = dataArray[index];
            const groupName1                            = this._groupName1;
            const groupName2                            = this._groupName2;
            const labelName1                            = this._labelName1;
            const labelName2                            = this._labelName2;
            const labelContent                          = this._labelContent;
            const imgCo1                                = this._imgCo1;
            const imgCo2                                = this._imgCo2;

            if (index === 0) {
                groupName1.visible  = false;
                groupName2.visible  = false;
                imgCo1.source       = ``;
                imgCo2.source       = ``;

                if (dataForCoDialogue) {
                    const nextData = dataArray[index + 1]?.dataForCoDialogue;
                    if (nextData) {
                        const nextSide = nextData.side;
                        if (nextSide !== dataForCoDialogue.side) {
                            const coImageSource = ConfigManager.getCoBustImageSource(Helpers.getExisted(nextData.coId));
                            if (nextSide === Types.WarEventActionDialogueSide.Left) {
                                imgCo1.source = coImageSource;
                            } else if (nextSide === Types.WarEventActionDialogueSide.Right) {
                                imgCo2.source = coImageSource;
                            }
                        }
                    }
                }
            }

            if (dataForCoDialogue) {
                const { side, nameArray }   = dataForCoDialogue;
                const coId                  = Helpers.getExisted(dataForCoDialogue.coId);
                const coImageSource         = ConfigManager.getCoBustImageSource(coId);
                const customName            = Lang.getLanguageText({ textArray: nameArray });
                const coName                = customName != null ? customName : ConfigManager.getCoNameAndTierText(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), coId);

                if (side === Types.WarEventActionDialogueSide.Left) {
                    groupName1.visible  = true;
                    groupName2.visible  = false;
                    labelName1.text     = coName;
                    imgCo1.source       = coImageSource;
                    Helpers.changeColor(imgCo1, Types.ColorType.Origin);
                    Helpers.changeColor(imgCo2, Types.ColorType.Dark);
                } else if (side === Types.WarEventActionDialogueSide.Right) {
                    groupName1.visible  = false;
                    groupName2.visible  = true;
                    labelName2.text     = coName;
                    imgCo2.source       = coImageSource;
                    Helpers.changeColor(imgCo1, Types.ColorType.Dark);
                    Helpers.changeColor(imgCo2, Types.ColorType.Origin);
                } else {
                    throw Helpers.newError(`BwDialoguePanel._updateComponentsForDialogue() invalid side.`);
                }

                labelContent.setRichText(Helpers.getExisted(Lang.getLanguageText({
                    textArray   : dataForCoDialogue.textArray,
                })).replace(/\\n/g, "\n"));

            } else if (dataForAside) {
                groupName1.visible  = false;
                groupName2.visible  = false;
                Helpers.changeColor(imgCo1, Types.ColorType.Dark);
                Helpers.changeColor(imgCo2, Types.ColorType.Dark);

                labelContent.setRichText(Helpers.getExisted(Lang.getLanguageText({
                    textArray   : dataForAside.textArray,
                })).replace(/\\n/g, "\n"));
            }
        }

        private _checkAndShowNextDialogue(): void {
            if (Helpers.getExisted(this._getOpenData().actionData.dataArray)[this._dialogueIndex + 1]) {
                ++this._dialogueIndex;
                this._updateComponentsForDialogue();
            } else {
                this.close();
            }
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
            });
        }
    }
}

export default TwnsBwDialoguePanel;
