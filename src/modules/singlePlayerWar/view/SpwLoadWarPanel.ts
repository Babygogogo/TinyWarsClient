
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiScrollList }                 from "../../../utility/ui/UiScrollList";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { FlowManager }                  from "../../../utility/FlowManager";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { BwHelpers }                    from "../../baseWar/model/BwHelpers";
import { SpmModel }                     from "../../singlePlayerMode/model/SpmModel";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";
import { SpwModel }                     from "../model/SpwModel";

export class SpwLoadWarPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: SpwLoadWarPanel;

    private _group          : eui.Group;
    private _labelPanelTitle: UiLabel;
    private _srlSaveSlot    : UiScrollList<DataForSlotRenderer>;
    private _listSaveSlot   : eui.List;
    private _btnHelp        : UiButton;
    private _btnCancel      : UiButton;

    private _dataForList: DataForSlotRenderer[];

    public static show(): void {
        if (!SpwLoadWarPanel._instance) {
            SpwLoadWarPanel._instance = new SpwLoadWarPanel();
        }

        SpwLoadWarPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (SpwLoadWarPanel._instance) {
            await SpwLoadWarPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = `resource/skins/singlePlayerWar/SpwLoadWarPanel.exml`;
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
        this._listSaveSlot.selectedIndex = SpwModel.getWar().getSaveSlotIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelPanelTitle.text  = Lang.getText(LangTextType.B0259);
        this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        this._btnHelp.label         = Lang.getText(LangTextType.B0143);
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
class SlotRenderer extends UiListItemRenderer<DataForSlotRenderer> {
    private _group          : eui.Group;
    private _imgBg          : UiImage;
    private _labelSlotIndex : UiLabel;
    private _labelType      : UiLabel;
    private _labelMapName   : UiLabel;
    private _labelChoose    : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._imgBg, callback: this._onTouchedImgBg, },
        ]);

        this._imgBg.touchEnabled    = true;
        this._labelChoose.text      = Lang.getText(LangTextType.B0258);
    }

    protected _onDataChanged(): void {
        this._updateView();
    }

    private _onTouchedImgBg(e: egret.TouchEvent): void {
        const data      = this.data;
        const slotInfo  = data.slotInfo;
        if (slotInfo) {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0072),
                callback: () => {
                    FlowManager.gotoSinglePlayerWar({
                        slotIndex       : slotInfo.slotIndex,
                        warData         : slotInfo.warData,
                        slotExtraData   : slotInfo.extraData,
                    });
                },
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
