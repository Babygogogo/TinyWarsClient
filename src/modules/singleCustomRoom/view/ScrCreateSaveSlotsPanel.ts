
import { UiImage }                      from "../../../gameui/UiImage";
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import { Types }                        from "../../../utility/Types";
import * as BwHelpers                   from "../../baseWar/model/BwHelpers";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as SpmModel                    from "../../singlePlayerMode/model/SpmModel";
import * as ScrModel                    from "../model/ScrModel";

export class ScrCreateSaveSlotsPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: ScrCreateSaveSlotsPanel;

    private _group          : eui.Group;
    private _labelPanelTitle: UiLabel;
    private _srlSaveSlot    : UiScrollList<DataForSlotRenderer>;
    private _listSaveSlot   : eui.List;
    private _btnCancel      : UiButton;

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
        this._listSaveSlot.selectedIndex = ScrModel.Create.getSaveSlotIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelPanelTitle.text  = Lang.getText(LangTextType.B0259);
        this._btnCancel.label       = Lang.getText(LangTextType.B0154);
    }

    private _createDataForList(): DataForSlotRenderer[] {
        const dataList  : DataForSlotRenderer[] = [];
        const slotDict  = SpmModel.SaveSlot.getSlotDict();
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
class SlotRenderer extends UiListItemRenderer<DataForSlotRenderer> {
    private _group          : eui.Group;
    private _imgBg          : UiImage;
    private _labelSlotIndex : UiLabel;
    private _labelType      : UiLabel;
    private _labelMapName   : UiLabel;
    private _labelChoose    : UiLabel;

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
        ScrModel.Create.setSaveSlotIndex(this.data.slotIndex);
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
