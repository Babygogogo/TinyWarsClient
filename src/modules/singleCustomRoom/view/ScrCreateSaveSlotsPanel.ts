
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }                 from "../../../utility/ui/UiScrollList";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { BwHelpers }                    from "../../baseWar/model/BwHelpers";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";
import { SpmModel }                     from "../../singlePlayerMode/model/SpmModel";
import { ScrCreateModel }                     from "../model/ScrCreateModel";

export class ScrCreateSaveSlotsPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: ScrCreateSaveSlotsPanel;

    private _group          : eui.Group;
    private _labelPanelTitle: TwnsUiLabel.UiLabel;
    private _srlSaveSlot    : TwnsUiScrollList.UiScrollList<DataForSlotRenderer>;
    private _listSaveSlot   : eui.List;
    private _btnCancel      : TwnsUiButton.UiButton;

    private _dataForList: DataForSlotRenderer[];

    public static show(): void {
        if (!ScrCreateSaveSlotsPanel._instance) {
            ScrCreateSaveSlotsPanel._instance = new ScrCreateSaveSlotsPanel();
        }
        ScrCreateSaveSlotsPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (ScrCreateSaveSlotsPanel._instance) {
            await ScrCreateSaveSlotsPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = `resource/skins/singleCustomRoom/ScrCreateSaveSlotsPanel.exml`;
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
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
        this._listSaveSlot.selectedIndex = ScrCreateModel.getSaveSlotIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelPanelTitle.text  = Lang.getText(LangTextType.B0259);
        this._btnCancel.label       = Lang.getText(LangTextType.B0154);
    }

    private _createDataForList(): DataForSlotRenderer[] {
        const dataList  : DataForSlotRenderer[] = [];
        const slotDict  = SpmModel.getSlotDict();
        for (let slotIndex = 0; slotIndex < CommonConstants.SpwSaveSlotMaxCount; ++slotIndex) {
            dataList.push({
                slotIndex,
                slotInfo    : slotDict.get(slotIndex),
            });
        }

        return dataList;
    }
}

type DataForSlotRenderer = {
    slotIndex   : number;
    slotInfo    : Types.SpmWarSaveSlotData | null;
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
        ScrCreateModel.setSaveSlotIndex(this.data.slotIndex);
        ScrCreateSaveSlotsPanel.hide();
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
