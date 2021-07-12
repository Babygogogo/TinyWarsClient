
import { TwnsUiImage }              from "../../../utility/ui/UiImage";
import { TwnsUiListItemRenderer }   from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }              from "../../../utility/ui/UiPanel";
import { TwnsUiButton }              from "../../../utility/ui/UiButton";
import { TwnsUiLabel }              from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }         from "../../../utility/ui/UiScrollList";
import { CommonConfirmPanel }   from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }      from "../../common/view/CommonHelpPanel";
import { CommonInputPanel }     from "../../common/view/CommonInputPanel";
import { CommonConstants }      from "../../../utility/CommonConstants";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { Types }                from "../../../utility/Types";
import { BwHelpers }            from "../../baseWar/model/BwHelpers";
import { SpmModel }             from "../../singlePlayerMode/model/SpmModel";
import { WarMapModel }          from "../../warMap/model/WarMapModel";
import { SpmProxy }             from "../../singlePlayerMode/model/SpmProxy";
import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;

export type OpenDataForSpmCreateSfwSaveSlotsPanel = ISerialWar;

export class SpmCreateSfwSaveSlotsPanel extends TwnsUiPanel.UiPanel<OpenDataForSpmCreateSfwSaveSlotsPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: SpmCreateSfwSaveSlotsPanel;

    private _group          : eui.Group;
    private _labelPanelTitle: TwnsUiLabel.UiLabel;
    private _srlSaveSlot    : TwnsUiScrollList.UiScrollList<DataForSlotRenderer>;
    private _listSaveSlot   : eui.List;
    private _btnHelp        : TwnsUiButton.UiButton;
    private _btnCancel      : TwnsUiButton.UiButton;

    private _dataForList: DataForSlotRenderer[];

    public static show(openData: OpenDataForSpmCreateSfwSaveSlotsPanel): void {
        if (!SpmCreateSfwSaveSlotsPanel._instance) {
            SpmCreateSfwSaveSlotsPanel._instance = new SpmCreateSfwSaveSlotsPanel();
        }

        SpmCreateSfwSaveSlotsPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (SpmCreateSfwSaveSlotsPanel._instance) {
            await SpmCreateSfwSaveSlotsPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = `resource/skins/singlePlayerMode/SpmCreateSfwSaveSlotsPanel.exml`;
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._srlSaveSlot.setItemRenderer(SlotRenderer);

        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        this._dataForList = null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        this.close();
    }

    private _onTouchedBtnHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title   : Lang.getText(LangTextType.B0325),
            content : Lang.getText(LangTextType.R0006),
        });
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._dataForList = this._createDataForList();
        this._srlSaveSlot.bindData(this._dataForList);
        this._listSaveSlot.selectedIndex = SpmModel.getAvailableIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelPanelTitle.text  = Lang.getText(LangTextType.B0259);
        this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        this._btnHelp.label         = Lang.getText(LangTextType.B0143);
    }

    private _createDataForList(): DataForSlotRenderer[] {
        const dataList  : DataForSlotRenderer[] = [];
        const warData   = this._getOpenData();
        const slotDict  = SpmModel.getSlotDict();
        for (let slotIndex = 0; slotIndex < CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
            dataList.push({
                slotIndex,
                slotInfo    : slotDict.get(slotIndex),
                warData,
            });
        }

        return dataList;
    }
}

type DataForSlotRenderer = {
    slotIndex   : number;
    slotInfo    : Types.SpmWarSaveSlotData | null;
    warData     : ISerialWar;
};
class SlotRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSlotRenderer> {
    private _group          : eui.Group;
    private _imgBg          : TwnsUiImage.UiImage;
    private _labelSlotIndex : TwnsUiLabel.UiLabel;
    private _labelType      : TwnsUiLabel.UiLabel;
    private _labelMapName   : TwnsUiLabel.UiLabel;
    private _labelChoose    : TwnsUiLabel.UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._imgBg,  callback: this._onTouchedImgBg },
        ]);

        this._imgBg.touchEnabled    = true;
        this._labelChoose.text      = Lang.getText(LangTextType.B0258);
    }

    protected _onDataChanged(): void {
        this._updateView();
    }

    private _onTouchedImgBg(e: egret.TouchEvent): void {
        const data      = this.data;
        const callback  = () => {
            CommonInputPanel.show({
                title       : Lang.getText(LangTextType.B0088),
                maxChars    : CommonConstants.SpmSaveSlotCommentMaxLength,
                currentValue: ``,
                tips        : Lang.getText(LangTextType.A0144),
                charRestrict: null,
                callback    : (panel) => {
                    SpmProxy.reqSpmCreateSfw({
                        slotIndex       : data.slotIndex,
                        slotExtraData   : { slotComment: panel.getInputText() },
                        warData         : data.warData,
                    });
                    SpmCreateSfwSaveSlotsPanel.hide();
                }
            });
        };
        if (!data.slotInfo) {
            callback();
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0070),
                callback,
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const data                  = this.data;
        this._labelSlotIndex.text   = "" + data.slotIndex;

        const slotInfo      = data.slotInfo;
        const labelType     = this._labelType;
        const labelMapName  = this._labelMapName;
        if (slotInfo == null) {
            labelType.text      = `----`;
            labelMapName.text   = `----`;
        } else {
            const warData   = slotInfo.warData;
            labelType.text  = Lang.getWarTypeName(BwHelpers.getWarType(warData));

            const slotComment = slotInfo.extraData.slotComment;
            if (slotComment) {
                labelMapName.text = slotComment;
            } else {
                const mapId         = BwHelpers.getMapId(warData);
                labelMapName.text   = mapId == null
                    ? `(${Lang.getText(LangTextType.B0321)})`
                    : await WarMapModel.getMapNameInCurrentLanguage(mapId);
            }
        }
    }
}
