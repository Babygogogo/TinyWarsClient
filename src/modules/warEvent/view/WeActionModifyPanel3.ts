
import TwnsBwWar                    from "../../baseWar/model/BwWar";
import TwnsBwDialoguePanel          from "../../baseWar/view/BwDialoguePanel";
import TwnsCommonChooseCoPanel      from "../../common/view/CommonChooseCoPanel";
import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
import TwnsCommonInputPanel from "../../common/view/CommonInputPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import FloatText                    from "../../tools/helpers/FloatText";
import Helpers                      from "../../tools/helpers/Helpers";
import Logger                       from "../../tools/helpers/Logger";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiImage                  from "../../tools/ui/UiImage";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import WarEventHelper               from "../model/WarEventHelper";
import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

namespace TwnsWeActionModifyPanel3 {
    import CommonConfirmPanel       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import WeActionTypeListPanel    = TwnsWeActionTypeListPanel.WeActionTypeListPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import ColorValue               = Types.ColorValue;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = TwnsBwWar.BwWar;

    type OpenDataForWeActionModifyPanel3 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel3 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel3> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionModifyPanel3;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnType               : TwnsUiButton.UiButton;
        private readonly _btnPlay               : TwnsUiButton.UiButton;
        private readonly _btnAddDialogue        : TwnsUiButton.UiButton;
        private readonly _btnClear              : TwnsUiButton.UiButton;
        private readonly _labelTitle            : TwnsUiLabel.UiLabel;
        private readonly _labelDialoguesCount   : TwnsUiLabel.UiLabel;
        private readonly _listDialogue          : TwnsUiScrollList.UiScrollList<DataForDialogueRenderer>;

        public static show(openData: OpenDataForWeActionModifyPanel3): void {
            if (!WeActionModifyPanel3._instance) {
                WeActionModifyPanel3._instance = new WeActionModifyPanel3();
            }
            WeActionModifyPanel3._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WeActionModifyPanel3._instance) {
                await WeActionModifyPanel3._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeActionModifyPanel3.exml";
        }

        protected _onOpened(): void {
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
            this._listDialogue.setItemRenderer(DialogueRenderer);

            this._updateView();
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
            const dialogueArray = this._getOpenData().action.WeaDialogue.dataArray;
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
                    openData.action.WeaDialogue.dataArray.length = 0;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            });
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            WeActionTypeListPanel.show({
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onTouchedBtnPlay(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const dialogueAction    = action.WeaDialogue;
            if (dialogueAction == null) {
                Logger.error(`WeActionModifyPanel3._onTouchedBtnPlay() dialogueAction == null.`);
                FloatText.show(Lang.getText(LangTextType.A0299));
                return;
            }

            const errorTip = WarEventHelper.getErrorTipForAction(openData.fullData, action, openData.war);
            if (errorTip) {
                FloatText.show(errorTip);
                return;
            }

            TwnsBwDialoguePanel.BwDialoguePanel.show({
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
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData.actionId}`;
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
            for (const dataForAddUnit of action.WeaDialogue.dataArray || []) {
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
        private readonly _labelError        : TwnsUiLabel.UiLabel;
        private readonly _btnChangeType     : TwnsUiButton.UiButton;
        private readonly _btnDelete         : TwnsUiButton.UiButton;
        private readonly _labelDialogueType : TwnsUiLabel.UiLabel;
        private readonly _groupCoDialogue   : eui.Group;
        private readonly _groupLeftSide     : eui.Group;
        private readonly _imgLeftSide       : TwnsUiImage.UiImage;
        private readonly _labelLeftSide     : TwnsUiLabel.UiLabel;
        private readonly _btnCo             : TwnsUiButton.UiButton;
        private readonly _labelCo           : TwnsUiLabel.UiLabel;
        private readonly _btnChinese        : TwnsUiButton.UiButton;
        private readonly _labelChinese      : TwnsUiLabel.UiLabel;
        private readonly _btnEnglish        : TwnsUiButton.UiButton;
        private readonly _labelEnglish      : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChangeType,  callback: this._onTouchedBtnChangeType },
                { ui: this._btnDelete,      callback: this._onTouchedBtnDelete },
                { ui: this._groupLeftSide,  callback: this._onTouchedGroupLeftSide },
                { ui: this._btnCo,          callback: this._onTouchedBtnCo },
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
            const dataForDialogue = this.data.dataForDialogue;

            {
                const dataForAside = dataForDialogue.dataForAside;
                if (dataForAside) {
                    delete dataForDialogue.dataForAside;
                    dataForDialogue.dataForCoDialogue = {
                        coId        : ConfigManager.getCoIdArrayForDialogue(ConfigManager.getLatestFormalVersion())[0],
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

            Logger.error(`WeActionModifyPanel3.DialogueRenderer._onTouchedBtnChangeType() invalid dataForDialogue.`);
        }

        private _onTouchedBtnDelete(): void {
            const data = this.data;
            if (data) {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0029),
                    callback: () => {
                        Helpers.deleteElementFromArray(data.action.WeaDialogue.dataArray, data.dataForDialogue);
                        Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    },
                });
            }
        }

        private _onTouchedGroupLeftSide(): void {
            const data = this.data.dataForDialogue.dataForCoDialogue;
            if (data) {
                data.side = data.side === Types.WarEventActionDialogueSide.Left
                    ? Types.WarEventActionDialogueSide.Right
                    : Types.WarEventActionDialogueSide.Left;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnCo(): void {
            const dataForCoDialogue = this.data.dataForDialogue.dataForCoDialogue;
            if (dataForCoDialogue) {
                const currentCoId = dataForCoDialogue.coId;
                TwnsCommonChooseCoPanel.CommonChooseCoPanel.show({
                    availableCoIdArray  : ConfigManager.getCoIdArrayForDialogue(ConfigManager.getLatestFormalVersion()),
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

        private _onTouchedBtnChinese(): void {
            const dataForDialogue   = this.data.dataForDialogue;
            const textArray         = dataForDialogue.dataForAside?.textArray || dataForDialogue.dataForCoDialogue?.textArray;
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.Chinese);
            const currentText       = textData?.text;

            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionDialogueTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionDialogueTextMaxLength),
                canBeEmpty      : true,
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
            const dataForDialogue   = this.data.dataForDialogue;
            const textArray         = dataForDialogue.dataForAside?.textArray || dataForDialogue.dataForCoDialogue?.textArray;
            const textData          = textArray.find(v => v.languageType === Types.LanguageType.English);
            const currentText       = textData?.text;

            TwnsCommonInputPanel.CommonInputPanel.show({
                title           : Lang.getText(LangTextType.B0455),
                currentValue    : currentText || ``,
                charRestrict    : null,
                maxChars        : CommonConstants.WarEventActionDialogueTextMaxLength,
                tips            : Lang.getFormattedText(LangTextType.F0020, CommonConstants.WarEventActionDialogueTextMaxLength),
                canBeEmpty      : true,
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

            const dataForDialogue   = this.data.dataForDialogue;
            const dataForCoDialogue = dataForDialogue.dataForCoDialogue;
            const groupCoDialogue   = this._groupCoDialogue;
            if (dataForCoDialogue == null) {
                groupCoDialogue.visible = false;
            } else {
                groupCoDialogue.visible     = true;
                this._imgLeftSide.visible   = dataForCoDialogue.side === Types.WarEventActionDialogueSide.Left;
                this._labelCo.text          = ConfigManager.getCoNameAndTierText(ConfigManager.getLatestFormalVersion(), dataForCoDialogue.coId);
            }

            const labelChinese  = this._labelChinese;
            const labelEnglish  = this._labelEnglish;
            const textArray     = dataForCoDialogue ? dataForCoDialogue.textArray : dataForDialogue.dataForAside.textArray;
            labelChinese.text = Lang.getLanguageText({
                textArray,
                useAlternate: false,
                languageType: Types.LanguageType.Chinese,
            }) || "";
            labelEnglish.text = Lang.getLanguageText({
                textArray,
                useAlternate: false,
                languageType: Types.LanguageType.English,
            }) || "";
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelError();
            this._updateLabelDialogueType();

            this._btnChangeType.label   = Lang.getText(LangTextType.B0668);
            this._btnDelete.label       = Lang.getText(LangTextType.B0220);
            this._labelLeftSide.text    = Lang.getText(LangTextType.B0673);
            this._btnCo.label           = Lang.getText(LangTextType.B0425);
            this._btnChinese.label      = Lang.getText(LangTextType.B0455);
            this._btnEnglish.label      = Lang.getText(LangTextType.B0456);
        }

        private _updateLabelError(): void {
            const data      = this.data.dataForDialogue;
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
            const data  = this.data.dataForDialogue;
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

export default TwnsWeActionModifyPanel3;
