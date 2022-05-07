
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsBwDialoguePanel          from "../../baseWar/view/BwDialoguePanel";
// import TwnsCommonChooseCoPanel      from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
// import TwnsCommonInputPanel         from "../../common/view/CommonInputPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import FloatText                    from "../../tools/helpers/FloatText";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Twns.Notify.NotifyType;
    import ColorValue               = Twns.Types.ColorValue;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import LangTextType             = Twns.Lang.LangTextType;
    import BwWar                    = BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel6 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel6 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel6> {
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnType!              : TwnsUiButton.UiButton;
        private readonly _btnPlay!              : TwnsUiButton.UiButton;
        private readonly _btnAddDialogue!       : TwnsUiButton.UiButton;
        private readonly _btnClear!             : TwnsUiButton.UiButton;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelDialoguesCount!  : TwnsUiLabel.UiLabel;
        private readonly _listDialogue!         : TwnsUiScrollList.UiScrollList<DataForDialogueRenderer>;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnAddDialogue,     callback: this._onTouchedBtnAddDialogue },
                { ui: this._btnClear,           callback: this._onTouchedBtnClear },
                { ui: this._btnType,            callback: this._onTouchedBtnType },
                { ui: this._btnPlay,            callback: this._onTouchedBtnPlay },
                { ui: this._btnBack,            callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listDialogue.setItemRenderer(DialogueRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._getAction().dataArray ??= [];
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(): void {
            this._updateComponentsForDialogues();
        }

        private _onTouchedBtnAddDialogue(): void {
            const dialogueArray = Twns.Helpers.getExisted(this._getAction().dataArray);
            if (dialogueArray.length > Twns.CommonConstants.WarEventActionDialogueMaxCount) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0228));
            } else {
                dialogueArray.push(WarHelpers.WarEventHelpers.getDefaultSimpleCoDialogueData(this._getOpenData().war.getGameConfig()));
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnClear(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0190),
                callback: () => {
                    Twns.Helpers.getExisted(this._getAction().dataArray).length = 0;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            });
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onTouchedBtnPlay(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const dialogueAction    = Twns.Helpers.getExisted(action.WeaSimpleDialogue);
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForAction(openData.fullData, action, openData.war);
            if (errorTip) {
                Twns.FloatText.show(errorTip);
                return;
            }

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwSimpleDialoguePanel, {
                gameConfig      : openData.war.getGameConfig(),
                actionData      : dialogueAction,
                callbackOnClose : () => {
                    // nothing to do
                },
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForDialogues();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._btnPlay.label         = Lang.getText(LangTextType.B0667);
            this._btnAddDialogue.label  = Lang.getText(LangTextType.B0666);
            this._btnClear.label        = Lang.getText(LangTextType.B0391);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
        }

        private _updateComponentsForDialogues(): void {
            const openData  = this._getOpenData();
            const action    = openData.action;
            const war       = openData.war;
            const dataArray : DataForDialogueRenderer[] = [];
            for (const dataForAddUnit of action.WeaSimpleDialogue?.dataArray || []) {
                dataArray.push({
                    war,
                    action,
                    dataForDialogue: dataForAddUnit,
                });
            }

            this._listDialogue.bindData(dataArray);

            const label     = this._labelDialoguesCount;
            const maxCount  = Twns.CommonConstants.WarEventActionDialogueMaxCount;
            const currCount = dataArray.length;
            label.text      = `${Lang.getText(LangTextType.B0675)}: ${currCount} / ${maxCount}`;
            label.textColor = ((currCount <= maxCount) && (currCount > 0)) ? ColorValue.White : ColorValue.Red;
        }

        private _getAction(): CommonProto.WarEvent.IWeaSimpleDialogue {
            return Twns.Helpers.getExisted(this._getOpenData().action.WeaSimpleDialogue);
        }
    }

    type DataForDialogueRenderer = {
        war             : BwWar;
        action          : IWarEventAction;
        dataForDialogue : CommonProto.WarEvent.WeaSimpleDialogue.IDataForDialogue;
    };
    class DialogueRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
        private readonly _labelError!           : TwnsUiLabel.UiLabel;
        private readonly _btnInsert!            : TwnsUiButton.UiButton;
        private readonly _btnUp!                : TwnsUiButton.UiButton;
        private readonly _btnDelete!            : TwnsUiButton.UiButton;
        private readonly _labelDialogueType!    : TwnsUiLabel.UiLabel;
        private readonly _groupCoDialogue!      : eui.Group;
        private readonly _groupBottomSide!        : eui.Group;
        private readonly _imgBottomSide!        : TwnsUiImage.UiImage;
        private readonly _labelBottomSide!      : TwnsUiLabel.UiLabel;
        private readonly _btnCo!                : TwnsUiButton.UiButton;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;
        private readonly _btnChineseName!       : TwnsUiButton.UiButton;
        private readonly _labelChineseName!     : TwnsUiLabel.UiLabel;
        private readonly _btnEnglishName!       : TwnsUiButton.UiButton;
        private readonly _labelEnglishName!     : TwnsUiLabel.UiLabel;
        private readonly _btnChinese!           : TwnsUiButton.UiButton;
        private readonly _btnDeleteChinese!     : TwnsUiButton.UiButton;
        private readonly _labelChinese!         : TwnsUiLabel.UiLabel;
        private readonly _btnEnglish!           : TwnsUiButton.UiButton;
        private readonly _btnDeleteEnglish!     : TwnsUiButton.UiButton;
        private readonly _labelEnglish!         : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnInsert,          callback: this._onTouchedBtnInsert },
                { ui: this._btnUp,              callback: this._onTouchedBtnUp },
                { ui: this._btnDelete,          callback: this._onTouchedBtnDelete },
                { ui: this._groupBottomSide,    callback: this._onTouchedGroupBottomSide },
                { ui: this._btnCo,              callback: this._onTouchedBtnCo },
                { ui: this._btnChineseName,     callback: this._onTouchedBtnChineseName },
                { ui: this._btnEnglishName,     callback: this._onTouchedBtnEnglishName },
                { ui: this._btnChinese,         callback: this._onTouchedBtnChinese },
                { ui: this._btnDeleteChinese,   callback: this._onTouchedBtnDeleteChinese },
                { ui: this._btnEnglish,         callback: this._onTouchedBtnEnglish },
                { ui: this._btnDeleteEnglish,   callback: this._onTouchedBtnDeleteEnglish },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // callbacks
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnInsert(): void {
            const data          = this._getData();
            const dialogueArray = Twns.Helpers.getExisted(data.action.WeaSimpleDialogue?.dataArray);
            if (dialogueArray.length > Twns.CommonConstants.WarEventActionDialogueMaxCount) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0228));
            } else {
                dialogueArray.splice(dialogueArray.indexOf(data.dataForDialogue), 0, WarHelpers.WarEventHelpers.getDefaultSimpleCoDialogueData(data.war.getGameConfig()));
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnUp(): void {
            const data          = this._getData();
            const dialogueArray = Twns.Helpers.getExisted(data.action.WeaSimpleDialogue?.dataArray);
            const index         = dialogueArray.indexOf(data.dataForDialogue);
            if (index > 0) {
                [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnDelete(): void {
            const data = this.data;
            if (data) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0029),
                    callback: () => {
                        Twns.Helpers.deleteElementFromArray(Twns.Helpers.getExisted(data.action.WeaSimpleDialogue?.dataArray), data.dataForDialogue);
                        Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    },
                });
            }
        }

        private _onTouchedGroupBottomSide(): void {
            const data = this._getData().dataForDialogue.dataForCoDialogue;
            if (data) {
                data.side = data.side === Twns.Types.WarEventActionSimpleDialogueSide.Bottom
                    ? Twns.Types.WarEventActionSimpleDialogueSide.Top
                    : Twns.Types.WarEventActionSimpleDialogueSide.Bottom;
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnCo(): void {
            const data              = this._getData();
            const dataForCoDialogue = data.dataForDialogue.dataForCoDialogue;
            if (dataForCoDialogue) {
                const gameConfig    = data.war.getGameConfig();
                const currentCoId   = dataForCoDialogue.coId ?? null;
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                    gameConfig,
                    availableCoIdArray  : gameConfig.getCoIdArrayForDialogue(),
                    currentCoId,
                    callbackOnConfirm   : coId => {
                        if (coId !== currentCoId) {
                            dataForCoDialogue.coId = coId;
                            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                        }
                    },
                });
            }
        }

        private _onTouchedBtnChineseName(): void {
            const dataForDialogue       = Twns.Helpers.getExisted(this._getData().dataForDialogue.dataForCoDialogue);
            dataForDialogue.nameArray   = dataForDialogue.nameArray || [];
            const textArray             = dataForDialogue.nameArray;
            const textData              = textArray.find(v => v.languageType === Twns.Types.LanguageType.Chinese);
            const currentText           = textData?.text;

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : Twns.CommonConstants.WarEventActionDialogueNameMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, Twns.CommonConstants.WarEventActionDialogueNameMaxLength),
                canBeEmpty      : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Twns.Helpers.deleteElementFromArray(textArray, textData);
                        if (!textArray.length) {
                            delete dataForDialogue.nameArray;
                        }
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Twns.Types.LanguageType.Chinese,
                                text,
                            });
                        }
                    }
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnEnglishName(): void {
            const dataForDialogue       = Twns.Helpers.getExisted(this._getData().dataForDialogue.dataForCoDialogue);
            dataForDialogue.nameArray   = dataForDialogue.nameArray || [];
            const textArray             = dataForDialogue.nameArray;
            const textData              = textArray.find(v => v.languageType === Twns.Types.LanguageType.English);
            const currentText           = textData?.text;

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0456),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : Twns.CommonConstants.WarEventActionDialogueNameMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, Twns.CommonConstants.WarEventActionDialogueNameMaxLength),
                canBeEmpty      : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Twns.Helpers.deleteElementFromArray(textArray, textData);
                        if (!textArray.length) {
                            delete dataForDialogue.nameArray;
                        }
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Twns.Types.LanguageType.English,
                                text,
                            });
                        }
                    }
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnChinese(): void {
            const dataForDialogue   = this._getData().dataForDialogue;
            const textArray         = Twns.Helpers.getExisted(dataForDialogue.dataForCoDialogue?.textArray);
            const textData          = textArray.find(v => v.languageType === Twns.Types.LanguageType.Chinese);
            const currentText       = textData?.text;

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : Twns.CommonConstants.WarEventActionDialogueTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, Twns.CommonConstants.WarEventActionDialogueTextMaxLength),
                canBeEmpty      : true,
                isMultiLine     : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Twns.Helpers.deleteElementFromArray(textArray, textData);
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Twns.Types.LanguageType.Chinese,
                                text,
                            });
                        }
                    }
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnDeleteChinese(): void {
            const dataForDialogue   = this._getData().dataForDialogue;
            const textArray         = Twns.Helpers.getExisted(dataForDialogue.dataForCoDialogue?.textArray);
            const textData          = textArray.find(v => v.languageType === Twns.Types.LanguageType.Chinese);
            if (textData?.text != null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content     : Lang.getText(LangTextType.A0225),
                    callback    : () => {
                        textData.text = null;
                        Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    }
                });
            }
        }

        private _onTouchedBtnEnglish(): void {
            const dataForDialogue   = this._getData().dataForDialogue;
            const textArray         = Twns.Helpers.getExisted(dataForDialogue.dataForCoDialogue?.textArray);
            const textData          = textArray.find(v => v.languageType === Twns.Types.LanguageType.English);
            const currentText       = textData?.text;

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0456),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : Twns.CommonConstants.WarEventActionDialogueTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, Twns.CommonConstants.WarEventActionDialogueTextMaxLength),
                canBeEmpty      : true,
                isMultiLine     : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Twns.Helpers.deleteElementFromArray(textArray, textData);
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Twns.Types.LanguageType.English,
                                text,
                            });
                        }
                    }
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnDeleteEnglish(): void {
            const dataForDialogue   = this._getData().dataForDialogue;
            const textArray         = Twns.Helpers.getExisted(dataForDialogue.dataForCoDialogue?.textArray);
            const textData          = textArray.find(v => v.languageType === Twns.Types.LanguageType.English);
            if (textData?.text != null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content     : Lang.getText(LangTextType.A0225),
                    callback    : () => {
                        textData.text = null;
                        Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    }
                });
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // view functions
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const data              = this._getData();
            const dataForDialogue   = data.dataForDialogue;
            const dataForCoDialogue = dataForDialogue.dataForCoDialogue;
            const groupCoDialogue   = this._groupCoDialogue;
            if (dataForCoDialogue == null) {
                groupCoDialogue.visible = false;
            } else {
                groupCoDialogue.visible     = true;
                this._imgBottomSide.visible = dataForCoDialogue.side === Twns.Types.WarEventActionSimpleDialogueSide.Bottom;
                this._labelCo.text          = data.war.getGameConfig().getCoNameAndTierText(Twns.Helpers.getExisted(dataForCoDialogue.coId)) ?? Twns.CommonConstants.ErrorTextForUndefined;
            }

            {
                const nameArray = dataForCoDialogue?.nameArray;
                this._labelChineseName.text = Lang.getLanguageText({
                    textArray: nameArray,
                    useAlternate: false,
                    languageType: Twns.Types.LanguageType.Chinese,
                }) || "";
                this._labelEnglishName.text = Lang.getLanguageText({
                    textArray: nameArray,
                    useAlternate: false,
                    languageType: Twns.Types.LanguageType.English,
                }) || "";
            }

            {
                const textArray = dataForCoDialogue ? dataForCoDialogue.textArray : null;
                this._labelChinese.text = Lang.getLanguageText({
                    textArray,
                    useAlternate: false,
                    languageType: Twns.Types.LanguageType.Chinese,
                }) || "";
                this._labelEnglish.text = Lang.getLanguageText({
                    textArray,
                    useAlternate: false,
                    languageType: Twns.Types.LanguageType.English,
                }) || "";
            }
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelError();
            this._updateLabelDialogueType();

            this._btnInsert.label           = Lang.getText(LangTextType.B0682);
            this._btnUp.label               = Lang.getText(LangTextType.B0463);
            this._btnDelete.label           = Lang.getText(LangTextType.B0220);
            this._labelBottomSide.text      = Lang.getText(LangTextType.B0729);
            this._btnCo.label               = Lang.getText(LangTextType.B0425);
            this._btnChineseName.label      = Lang.getText(LangTextType.B0683);
            this._btnEnglishName.label      = Lang.getText(LangTextType.B0684);
            this._btnChinese.label          = Lang.getText(LangTextType.B0455);
            this._btnDeleteChinese.label    = Lang.getText(LangTextType.B0220);
            this._btnEnglish.label          = Lang.getText(LangTextType.B0456);
            this._btnDeleteEnglish.label    = Lang.getText(LangTextType.B0220);
        }

        private _updateLabelError(): void {
            const data      = this._getData();
            const errorTips = WarHelpers.WarEventHelpers.getErrorTipForWeaSimpleDialogueData(data.dataForDialogue, data.war.getGameConfig());
            const label     = this._labelError;
            if (errorTips) {
                label.textColor = ColorValue.Red;
                label.text      = errorTips;
            } else {
                label.textColor = ColorValue.White;
                label.text      = Lang.getText(LangTextType.B0493);
            }
        }

        private _updateLabelDialogueType(): void {
            const data  = this._getData().dataForDialogue;
            const label = this._labelDialogueType;
            if (data.dataForCoDialogue) {
                label.text = `${Lang.getText(LangTextType.B0669)}: ${Lang.getText(LangTextType.B0671)}`;
            } else {
                label.text = `${Lang.getText(LangTextType.B0669)}: ${Lang.getText(LangTextType.B0672)}`;
            }
        }
    }
}

// export default TwnsWeActionModifyPanel6;
