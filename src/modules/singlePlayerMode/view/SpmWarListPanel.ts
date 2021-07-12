
import { UiListItemRenderer }                                                   from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                                                              from "../../../utility/ui/UiPanel";
import { UiButton }                                                             from "../../../utility/ui/UiButton";
import { UiLabel }                                                              from "../../../utility/ui/UiLabel";
import { UiScrollList }                                                         from "../../../utility/ui/UiScrollList";
import { UiTab }                                                                from "../../../utility/ui/UiTab";
import { UiTabItemRenderer }                                                    from "../../../utility/ui/UiTabItemRenderer";
import { FlowManager }                                                          from "../../../utility/FlowManager";
import { Helpers }                                                              from "../../../utility/Helpers";
import { Lang }                                                                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                                                               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                                                                from "../../../utility/Types";
import { BwHelpers }                                                            from "../../baseWar/model/BwHelpers";
import { WarMapModel }                                                          from "../../warMap/model/WarMapModel";
import { SpmModel }                                                             from "../model/SpmModel";
import { OpenDataForSpmWarMapInfoPage, SpmWarMapInfoPage }                      from "./SpmWarMapInfoPage";
import { OpenDataForSpmWarPlayerInfoPage, SpmWarPlayerInfoPage }                from "./SpmWarPlayerInfoPage";
import { TwnsLobbyBottomPanel }                                                     from "../../lobby/view/LobbyBottomPanel";
import { TwnsLobbyTopPanel }                                                        from "../../lobby/view/LobbyTopPanel";
import { SpmMainMenuPanel }                                                     from "./SpmMainMenuPanel";
import { OpenDataForSpmWarAdvancedSettingsPage, SpmWarAdvancedSettingsPage }    from "./SpmWarAdvancedSettingsPage";
import { OpenDataForSpmWarBasicSettingsPage, SpmWarBasicSettingsPage }          from "./SpmWarBasicSettingsPage";

export class SpmWarListPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: SpmWarListPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForSpmWarMapInfoPage | OpenDataForSpmWarPlayerInfoPage | OpenDataForSpmWarAdvancedSettingsPage | OpenDataForSpmWarBasicSettingsPage>;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelSinglePlayer     : UiLabel;
    private readonly _labelContinue         : UiLabel;
    private readonly _labelChooseWar        : UiLabel;

    private readonly _btnBack               : UiButton;
    private readonly _btnNextStep           : UiButton;

    private readonly _groupWarList          : eui.Group;
    private readonly _listWar               : UiScrollList<DataForWarRenderer>;
    private readonly _labelNoWar            : UiLabel;
    private readonly _labelLoading          : UiLabel;

    public static show(): void {
        if (!SpmWarListPanel._instance) {
            SpmWarListPanel._instance = new SpmWarListPanel();
        }
        SpmWarListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (SpmWarListPanel._instance) {
            await SpmWarListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/singlePlayerMode/SpmWarListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.SpmPreviewingWarSaveSlotChanged,    callback: this._onNotifySpmPreviewingWarSaveSlotChanged },
            { type: NotifyType.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listWar.setItemRenderer(WarRenderer);

        this._showOpenAnimation();

        this._initTabSettings();
        this._updateComponentsForLanguage();
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifySpmPreviewingWarSaveSlotChanged(e: egret.Event): void {
        this._updateComponentsForPreviewingWarInfo();
    }

    private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
        SpmMainMenuPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
    }

    private _onTouchedBtnNextStep(e: egret.TouchEvent): void {
        const slotData = SpmModel.getSlotDict().get(SpmModel.getPreviewingSlotIndex());
        if (slotData != null) {
            FlowManager.gotoSinglePlayerWar({
                slotIndex       : slotData.slotIndex,
                warData         : slotData.warData,
                slotExtraData   : slotData.extraData,
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _initTabSettings(): void {
        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : SpmWarMapInfoPage,
                pageData    : { slotIndex: null } as OpenDataForSpmWarMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : SpmWarPlayerInfoPage,
                pageData    : { slotIndex: null } as OpenDataForSpmWarPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : SpmWarBasicSettingsPage,
                pageData    : { slotIndex: null } as OpenDataForSpmWarBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : SpmWarAdvancedSettingsPage,
                pageData    : { slotIndex: null } as OpenDataForSpmWarAdvancedSettingsPage,
            },
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text         = Lang.getText(LangTextType.A0040);
        this._labelSinglePlayer.text    = Lang.getText(LangTextType.B0138);
        this._labelContinue.text        = Lang.getText(LangTextType.B0024);
        this._labelChooseWar.text       = Lang.getText(LangTextType.B0589);
        this._btnBack.label             = Lang.getText(LangTextType.B0146);
        this._labelNoWar.text           = Lang.getText(LangTextType.B0210);
        this._btnNextStep.label         = Lang.getText(LangTextType.B0024);
    }

    private _updateGroupWarList(): void {
        const labelLoading  = this._labelLoading;
        const labelNoWar    = this._labelNoWar;
        const listWar       = this._listWar;
        if (!SpmModel.getHasReceivedSlotArray()) {
            labelLoading.visible    = true;
            labelNoWar.visible     = false;
            listWar.clear();

        } else {
            const dataArray         = this._createDataForListWar();
            labelLoading.visible    = false;
            labelNoWar.visible      = !dataArray.length;
            listWar.bindData(dataArray);

            const slotIndex = SpmModel.getPreviewingSlotIndex();
            if (dataArray.every(v => v.slotIndex != slotIndex)) {
                SpmModel.setPreviewingSlotIndex(dataArray.length ? dataArray[0].slotIndex : null);
            }
        }
    }

    private _updateComponentsForPreviewingWarInfo(): void {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const slotIndex     = SpmModel.getPreviewingSlotIndex();
        if ((!SpmModel.getHasReceivedSlotArray()) || (slotIndex == null)) {
            groupTab.visible    = false;
            btnNextStep.visible = false;
        } else {
            groupTab.visible    = true;
            btnNextStep.visible = true;

            const tab = this._tabSettings;
            tab.updatePageData(0, { slotIndex } as OpenDataForSpmWarMapInfoPage);
            tab.updatePageData(1, { slotIndex } as OpenDataForSpmWarPlayerInfoPage);
            tab.updatePageData(2, { slotIndex } as OpenDataForSpmWarBasicSettingsPage);
            tab.updatePageData(3, { slotIndex } as OpenDataForSpmWarAdvancedSettingsPage);
        }
    }

    private _createDataForListWar(): DataForWarRenderer[] {
        const dataArray: DataForWarRenderer[] = [];
        for (const [slotIndex] of SpmModel.getSlotDict()) {
            dataArray.push({
                slotIndex,
            });
        }

        return dataArray;
    }

    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._btnBack,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupNavigator,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupWarList,
            beginProps  : { alpha: 0, left: -20 },
            endProps    : { alpha: 1, left: 20 },
        });
        Helpers.resetTween({
            obj         : this._btnNextStep,
            beginProps  : { alpha: 0, left: -20 },
            endProps    : { alpha: 1, left: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupTab,
            beginProps  : { alpha: 0, },
            endProps    : { alpha: 1, },
        });
    }
    private async _showCloseAnimation(): Promise<void> {
        return new Promise<void>(resolve => {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
                callback    : resolve,
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupWarList,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });
        });
    }
}

type DataForTabItemRenderer = {
    name: string;
};
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private _labelName: UiLabel;

    protected _onDataChanged(): void {
        this._labelName.text = this.data.name;
    }
}

type DataForWarRenderer = {
    slotIndex: number;
};
class WarRenderer extends UiListItemRenderer<DataForWarRenderer> {
    private readonly _btnChoose     : UiButton;
    private readonly _btnNext       : UiButton;
    private readonly _labelType     : UiLabel;
    private readonly _labelName     : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.SpmPreviewingWarSaveSlotChanged,  callback: this._onNotifySpmPreviewingWarSaveSlotChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        const slotIndex = this.data.slotIndex;
        const slotData  = SpmModel.getSlotDict().get(slotIndex);
        const labelType = this._labelType;
        const labelName = this._labelName;
        if (!slotData) {
            labelType.text  = null;
            labelName.text  = null;
        } else {
            const warData   = slotData.warData;
            labelType.text  = `${slotIndex}. ${Lang.getWarTypeName(BwHelpers.getWarType(warData))}`;

            const slotComment = slotData.extraData.slotComment;
            if (slotComment) {
                labelName.text = slotComment;
            } else {
                const mapId     = BwHelpers.getMapId(warData);
                labelName.text  = mapId == null
                    ? `(${Lang.getText(LangTextType.B0321)})`
                    : await WarMapModel.getMapNameInCurrentLanguage(mapId);
            }
        }
    }

    private _onNotifySpmPreviewingWarSaveSlotChanged(e: egret.Event): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        SpmModel.setPreviewingSlotIndex(this.data.slotIndex);
    }

    private _onTouchTapBtnNext(e: egret.TouchEvent): void {
        const slotIndex = this.data.slotIndex;
        const slotData  = SpmModel.getSlotDict().get(slotIndex);
        if (slotData != null) {
            FlowManager.gotoSinglePlayerWar({
                slotIndex,
                warData         : slotData.warData,
                slotExtraData   : slotData.extraData,
            });
        }
    }

    private _updateState(): void {
        this.currentState = this.data.slotIndex === SpmModel.getPreviewingSlotIndex() ? Types.UiState.Down : Types.UiState.Up;
    }
}
