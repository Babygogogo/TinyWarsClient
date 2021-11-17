
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
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
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
namespace TwnsWeActionModifyPanel3 {
    import CommonConfirmPanel       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import ColorValue               = Types.ColorValue;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = TwnsBwWar.BwWar;

    export type OpenData = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel3 extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnType!              : TwnsUiButton.UiButton;
        private readonly _btnPlay!              : TwnsUiButton.UiButton;
        private readonly _btnAddDialogue!       : TwnsUiButton.UiButton;
        private readonly _btnClear!             : TwnsUiButton.UiButton;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelDialoguesCount!  : TwnsUiLabel.UiLabel;
        private readonly _btnBackground!        : TwnsUiButton.UiButton;
        private readonly _labelBackground!      : TwnsUiLabel.UiLabel;
        private readonly _listDialogue!         : TwnsUiScrollList.UiScrollList<DataForDialogueRenderer>;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnAddDialogue,     callback: this._onTouchedBtnAddDialogue },
                { ui: this._btnClear,           callback: this._onTouchedBtnClear },
                { ui: this._btnType,            callback: this._onTouchedBtnType },
                { ui: this._btnPlay,            callback: this._onTouchedBtnPlay },
                { ui: this._btnBack,            callback: this.close },
                { ui: this._btnBackground,      callback: this._onTouchedBtnBackground },
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
            this._updateComponentsForBackground();
            this._updateComponentsForDialogues();
        }

        private _onTouchedBtnAddDialogue(): void {
            const dialogueArray = Helpers.getExisted(this._getOpenData().action.WeaDialogue?.dataArray);
            if (dialogueArray.length > CommonConstants.WarEventActionDialogueMaxCount) {
                FloatText.show(Lang.getText(LangTextType.A0228));
            } else {
                dialogueArray.push(WarEventHelper.getDefaultCoDialogueData());
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnClear(): void {
            const openData = this._getOpenData();
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0190),
                callback: () => {
                    Helpers.getExisted(openData.action.WeaDialogue?.dataArray).length = 0;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            });
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onTouchedBtnPlay(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const dialogueAction    = Helpers.getExisted(action.WeaDialogue);
            const errorTip          = WarEventHelper.getErrorTipForAction(openData.fullData, action, openData.war);
            if (errorTip) {
                FloatText.show(errorTip);
                return;
            }

            TwnsPanelManager.open(TwnsPanelConfig.Dict.BwDialoguePanel, {
                actionData      : dialogueAction,
                callbackOnClose : () => {
                    // nothing to do
                },
            });
        }

        private _onTouchedBtnBackground(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeDialogueBackgroundPanel, {
                action: Helpers.getExisted(this._getOpenData().action.WeaDialogue),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForBackground();
            this._updateComponentsForDialogues();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._btnPlay.label         = Lang.getText(LangTextType.B0667);
            this._btnAddDialogue.label  = Lang.getText(LangTextType.B0666);
            this._btnClear.label        = Lang.getText(LangTextType.B0391);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
            this._btnBackground.label   = Lang.getText(LangTextType.B0727);
        }

        private _updateComponentsForBackground(): void {
            this._labelBackground.text = `${this._getOpenData().action.WeaDialogue?.backgroundId}`;
        }

        private _updateComponentsForDialogues(): void {
            const openData  = this._getOpenData();
            const action    = openData.action;
            const war       = openData.war;
            const dataArray : DataForDialogueRenderer[] = [];
            for (const dataForAddUnit of action.WeaDialogue?.dataArray || []) {
                dataArray.push({
                    war,
                    action,
                    dataForDialogue: dataForAddUnit,
                });
            }

            this._listDialogue.bindData(dataArray);

            const label     = this._labelDialoguesCount;
            const maxCount  = CommonConstants.WarEventActionDialogueMaxCount;
            const currCount = dataArray.length;
            label.text      = `${Lang.getText(LangTextType.B0675)}: ${currCount} / ${maxCount}`;
            label.textColor = ((currCount <= maxCount) && (currCount > 0)) ? ColorValue.White : ColorValue.Red;
        }
    }

    type DataForDialogueRenderer = {
        war             : BwWar;
        action          : IWarEventAction;
        dataForDialogue : ProtoTypes.WarEvent.WeaDialogue.IDataForDialogue;
    };
    class DialogueRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForDialogueRenderer> {
        private readonly _labelError!           : TwnsUiLabel.UiLabel;
        private readonly _btnChangeType!        : TwnsUiButton.UiButton;
        private readonly _btnInsert!            : TwnsUiButton.UiButton;
        private readonly _btnUp!                : TwnsUiButton.UiButton;
        private readonly _btnDelete!            : TwnsUiButton.UiButton;
        private readonly _labelDialogueType!    : TwnsUiLabel.UiLabel;
        private readonly _groupCoDialogue!      : eui.Group;
        private readonly _groupLeftSide!        : eui.Group;
        private readonly _imgLeftSide!          : TwnsUiImage.UiImage;
        private readonly _labelLeftSide!        : TwnsUiLabel.UiLabel;
        private readonly _btnCo!                : TwnsUiButton.UiButton;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;
        private readonly _btnChineseName!       : TwnsUiButton.UiButton;
        private readonly _labelChineseName!     : TwnsUiLabel.UiLabel;
        private readonly _btnEnglishName!       : TwnsUiButton.UiButton;
        private readonly _labelEnglishName!     : TwnsUiLabel.UiLabel;
        private readonly _btnChinese!           : TwnsUiButton.UiButton;
        private readonly _labelChinese!         : TwnsUiLabel.UiLabel;
        private readonly _btnEnglish!           : TwnsUiButton.UiButton;
        private readonly _labelEnglish!         : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChangeType,  callback: this._onTouchedBtnChangeType },
                { ui: this._btnInsert,      callback: this._onTouchedBtnInsert },
                { ui: this._btnUp,          callback: this._onTouchedBtnUp },
                { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
                { ui: this._groupLeftSide,  callback: this._onTouchedGroupLeftSide },
                { ui: this._btnCo,          callback: this._onTouchedBtnCo },
                { ui: this._btnChineseName, callback: this._onTouchedBtnChineseName },
                { ui: this._btnEnglishName, callback: this._onTouchedBtnEnglishName },
                { ui: this._btnChinese,     callback: this._onTouchedBtnChinese },
                { ui: this._btnEnglish,     callback: this._onTouchedBtnEnglish },
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
        private _onTouchedBtnChangeType(): void {
            const dataForDialogue = this._getData().dataForDialogue;

            {
                const dataForAside = dataForDialogue.dataForAside;
                if (dataForAside) {
                    delete dataForDialogue.dataForAside;
                    dataForDialogue.dataForCoDialogue = {
                        coId        : ConfigManager.getCoIdArrayForDialogue(Helpers.getExisted(ConfigManager.getLatestConfigVersion()))[0],
                        side        : Types.WarEventActionDialogueSide.Left,
                        textArray   : dataForAside.textArray,
                    };
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    return;
                }
            }

            {
                const dataForCoDialogue = dataForDialogue.dataForCoDialogue;
                if (dataForCoDialogue) {
                    delete dataForDialogue.dataForCoDialogue;
                    dataForDialogue.dataForAside = {
                        textArray: dataForCoDialogue.textArray,
                    };
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    return;
                }
            }

            throw Helpers.newError(`Invalid dataForDialogue.`, ClientErrorCode.WeActionModifyPanel3_OnTouchedBtnChangeType_00);
        }

        private _onTouchedBtnInsert(): void {
            const data          = this._getData();
            const dialogueArray = Helpers.getExisted(data.action.WeaDialogue?.dataArray);
            if (dialogueArray.length > CommonConstants.WarEventActionDialogueMaxCount) {
                FloatText.show(Lang.getText(LangTextType.A0228));
            } else {
                dialogueArray.splice(dialogueArray.indexOf(data.dataForDialogue), 0, WarEventHelper.getDefaultCoDialogueData());
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnUp(): void {
            const data          = this._getData();
            const dialogueArray = Helpers.getExisted(data.action.WeaDialogue?.dataArray);
            const index         = dialogueArray.indexOf(data.dataForDialogue);
            if (index > 0) {
                [dialogueArray[index - 1], dialogueArray[index]] = [dialogueArray[index], dialogueArray[index - 1]];
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnDelete(): void {
            const data = this.data;
            if (data) {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0029),
                    callback: () => {
                        Helpers.deleteElementFromArray(Helpers.getExisted(data.action.WeaDialogue?.dataArray), data.dataForDialogue);
                        Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    },
                });
            }
        }

        private _onTouchedGroupLeftSide(): void {
            const data = this._getData().dataForDialogue.dataForCoDialogue;
            if (data) {
                data.side = data.side === Types.WarEventActionDialogueSide.Left
                    ? Types.WarEventActionDialogueSide.Right
                    : Types.WarEventActionDialogueSide.Left;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnCo(): void {
            const dataForCoDialogue = this._getData().dataForDialogue.dataForCoDialogue;
            if (dataForCoDialogue) {
                const currentCoId = dataForCoDialogue.coId ?? null;
                TwnsCommonChooseCoPanel.CommonChooseCoPanel.show({
                    availableCoIdArray  : ConfigManager.getCoIdArrayForDialogue(Helpers.getExisted(ConfigManager.getLatestConfigVersion())),
                    currentCoId,
                    callbackOnConfirm   : coId => {
                        if (coId !== currentCoId) {
                            dataForCoDialogue.coId = coId;
                            Notify.dispatch(NotifyType.WarEventFullDataChanged);
                        }
                    },
                });
            }
        }

        private _onTouchedBtnChineseName(): void {
            const dataForDialogue       = Helpers.getExisted(this._getData().dataForDialogue.dataForCoDialogue);
            dataForDialogue.nameArray   = dataForDialogue.nameArray || [];
            const textArray             = dataForDialogue.nameArray;
            const textData              = textArray.find(v => v.languageType === Types.LanguageType.Chinese);
            const currentText           = textData?.text;

            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionDialogueNameMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionDialogueNameMaxLength),
                canBeEmpty      : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Helpers.deleteElementFromArray(textArray, textData);
                        if (!textArray.length) {
                            delete dataForDialogue.nameArray;
                        }
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Types.LanguageType.Chinese,
                                text,
                            });
                        }
                    }
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnEnglishName(): void {
            const dataForDialogue       = Helpers.getExisted(this._getData().dataForDialogue.dataForCoDialogue);
            dataForDialogue.nameArray   = dataForDialogue.nameArray || [];
            const textArray             = dataForDialogue.nameArray;
            const textData              = textArray.find(v => v.languageType === Types.LanguageType.English);
            const currentText           = textData?.text;

            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0456),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionDialogueNameMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionDialogueNameMaxLength),
                canBeEmpty      : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Helpers.deleteElementFromArray(textArray, textData);
                        if (!textArray.length) {
                            delete dataForDialogue.nameArray;
                        }
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Types.LanguageType.English,
                                text,
                            });
                        }
                    }
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnChinese(): void {
            const dataForDialogue   = this._getData().dataForDialogue;
            const textArray         = Helpers.getExisted(dataForDialogue.dataForAside?.textArray || dataForDialogue.dataForCoDialogue?.textArray);
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.Chinese);
            const currentText       = textData?.text;

            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionDialogueTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionDialogueTextMaxLength),
                canBeEmpty      : true,
                isMultiLine     : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Helpers.deleteElementFromArray(textArray, textData);
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Types.LanguageType.Chinese,
                                text,
                            });
                        }
                    }
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnEnglish(): void {
            const dataForDialogue   = this._getData().dataForDialogue;
            const textArray         = Helpers.getExisted(dataForDialogue.dataForAside?.textArray || dataForDialogue.dataForCoDialogue?.textArray);
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.English);
            const currentText       = textData?.text;

            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0456),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionDialogueTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionDialogueTextMaxLength),
                canBeEmpty      : true,
                isMultiLine     : true,
                callback        : panel => {
                    const text = (panel.getInputText() || ``).trim();
                    if (text === currentText) {
                        return;
                    }

                    if (!text.length) {
                        Helpers.deleteElementFromArray(textArray, textData);
                    } else {
                        if (textData) {
                            textData.text = text;
                        } else {
                            textArray.push({
                                languageType    : Types.LanguageType.English,
                                text,
                            });
                        }
                    }
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // view functions
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const dataForDialogue   = this._getData().dataForDialogue;
            const dataForCoDialogue = dataForDialogue.dataForCoDialogue;
            const groupCoDialogue   = this._groupCoDialogue;
            if (dataForCoDialogue == null) {
                groupCoDialogue.visible = false;
            } else {
                groupCoDialogue.visible     = true;
                this._imgLeftSide.visible   = dataForCoDialogue.side === Types.WarEventActionDialogueSide.Left;
                this._labelCo.text          = ConfigManager.getCoNameAndTierText(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), Helpers.getExisted(dataForCoDialogue.coId));
            }

            {
                const nameArray = dataForCoDialogue?.nameArray;
                this._labelChineseName.text = Lang.getLanguageText({
                    textArray: nameArray,
                    useAlternate: false,
                    languageType: Types.LanguageType.Chinese,
                }) || "";
                this._labelEnglishName.text = Lang.getLanguageText({
                    textArray: nameArray,
                    useAlternate: false,
                    languageType: Types.LanguageType.English,
                }) || "";
            }

            {
                const textArray = dataForCoDialogue ? dataForCoDialogue.textArray : dataForDialogue.dataForAside?.textArray;
                this._labelChinese.text = Lang.getLanguageText({
                    textArray,
                    useAlternate: false,
                    languageType: Types.LanguageType.Chinese,
                }) || "";
                this._labelEnglish.text = Lang.getLanguageText({
                    textArray,
                    useAlternate: false,
                    languageType: Types.LanguageType.English,
                }) || "";
            }
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelError();
            this._updateLabelDialogueType();

            this._btnChangeType.label   = Lang.getText(LangTextType.B0668);
            this._btnInsert.label       = Lang.getText(LangTextType.B0682);
            this._btnUp.label           = Lang.getText(LangTextType.B0463);
            this._btnDelete.label       = Lang.getText(LangTextType.B0220);
            this._labelLeftSide.text    = Lang.getText(LangTextType.B0673);
            this._btnCo.label           = Lang.getText(LangTextType.B0425);
            this._btnChineseName.label  = Lang.getText(LangTextType.B0683);
            this._btnEnglishName.label  = Lang.getText(LangTextType.B0684);
            this._btnChinese.label      = Lang.getText(LangTextType.B0455);
            this._btnEnglish.label      = Lang.getText(LangTextType.B0456);
        }

        private _updateLabelError(): void {
            const data      = this._getData().dataForDialogue;
            const errorTips = WarEventHelper.getErrorTipForWeaDialogueData(data);
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
            if (data.dataForAside) {
                label.text = `${Lang.getText(LangTextType.B0669)}: ${Lang.getText(LangTextType.B0670)}`;
            } else if (data.dataForCoDialogue) {
                label.text = `${Lang.getText(LangTextType.B0669)}: ${Lang.getText(LangTextType.B0671)}`;
            } else {
                label.text = `${Lang.getText(LangTextType.B0669)}: ${Lang.getText(LangTextType.B0672)}`;
            }
        }
    }
}

// export default TwnsWeActionModifyPanel3;
