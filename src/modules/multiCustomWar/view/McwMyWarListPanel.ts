
import { UiListItemRenderer }                                                   from "../../../gameui/UiListItemRenderer";
import { UiPanel }                                                              from "../../../gameui/UiPanel";
import { UiButton }                                                             from "../../../gameui/UiButton";
import { UiLabel }                                                              from "../../../gameui/UiLabel";
import { UiScrollList }                                                         from "../../../gameui/UiScrollList";
import { UiTab }                                                                from "../../../gameui/UiTab";
import { UiTabItemRenderer }                                                    from "../../../gameui/UiTabItemRenderer";
import { LobbyBottomPanel }                                                     from "../../lobby/view/LobbyBottomPanel";
import { LobbyTopPanel }                                                        from "../../lobby/view/LobbyTopPanel";
import { McrMainMenuPanel }                                                     from "../../multiCustomRoom/view/McrMainMenuPanel";
import { McwWarMapInfoPage, OpenDataForMcwWarMapInfoPage }                      from "./McwWarMapInfoPage";
import { McwWarPlayerInfoPage, OpenDataForMcwWarPlayerInfoPage }                from "./McwWarPlayerInfoPage";
import { McwWarAdvancedSettingsPage, OpenDataForMcwWarAdvancedSettingsPage }    from "./McwWarAdvancedSettingsPage";
import { McwWarBasicSettingsPage, OpenDataForMcwWarBasicSettingsPage }          from "./McwWarBasicSettingsPage";
import * as Helpers                                                             from "../../../utility/Helpers";
import * as Lang                                                                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Logger                                                              from "../../../utility/Logger";
import * as Notify                                                              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types                                                               from "../../../utility/Types";
import * as MpwModel                                                            from "../../multiPlayerWar/model/MpwModel";
import * as MpwProxy                                                            from "../../multiPlayerWar/model/MpwProxy";
import * as WarMapModel                                                         from "../../warMap/model/WarMapModel";

export class McwMyWarListPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McwMyWarListPanel;

    // @ts-ignore
    private readonly _groupTab              : eui.Group;
    // @ts-ignore
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForMcwWarMapInfoPage | OpenDataForMcwWarPlayerInfoPage | OpenDataForMcwWarAdvancedSettingsPage | OpenDataForMcwWarBasicSettingsPage>;

    // @ts-ignore
    private readonly _groupNavigator        : eui.Group;
    // @ts-ignore
    private readonly _labelMultiPlayer      : UiLabel;
    // @ts-ignore
    private readonly _labelMyWar            : UiLabel;
    // @ts-ignore
    private readonly _labelChooseWar        : UiLabel;

    // @ts-ignore
    private readonly _btnBack               : UiButton;
    // @ts-ignore
    private readonly _btnNextStep           : UiButton;

    // @ts-ignore
    private readonly _groupWarList          : eui.Group;
    // @ts-ignore
    private readonly _listWar               : UiScrollList<DataForWarRenderer>;
    // @ts-ignore
    private readonly _labelNoWar            : UiLabel;
    // @ts-ignore
    private readonly _labelLoading          : UiLabel;

    private _hasReceivedData    = false;

    public static show(): void {
        if (!McwMyWarListPanel._instance) {
            McwMyWarListPanel._instance = new McwMyWarListPanel();
        }
        McwMyWarListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (McwMyWarListPanel._instance) {
            await McwMyWarListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomWar/McwMyWarListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.McwPreviewingWarIdChanged,      callback: this._onNotifyMcwPreviewingWarIdChanged },
            { type: NotifyType.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listWar.setItemRenderer(WarRenderer);

        this._showOpenAnimation();

        this._hasReceivedData = false;
        this._initTabSettings();
        this._updateComponentsForLanguage();
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();

        MpwProxy.reqMpwCommonGetMyWarInfoList();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMcwPreviewingWarIdChanged(): void {
        this._updateComponentsForPreviewingWarInfo();
    }

    private _onNotifyMsgMpwCommonGetMyWarInfoList(): void {
        this._hasReceivedData = true;
        this._updateGroupWarList();
        this._updateComponentsForPreviewingWarInfo();
    }

    private _onTouchTapBtnBack(): void {
        this.close();
        McrMainMenuPanel.show();
        LobbyTopPanel.show();
        LobbyBottomPanel.show();
    }

    private _onTouchedBtnNextStep(): void {
        const warId = MpwModel.getMcwPreviewingWarId();
        if (warId != null) {
            MpwProxy.reqMpwCommonContinueWar(warId);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _initTabSettings(): void {
        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : McwWarMapInfoPage,
                pageData    : { warId: null } as OpenDataForMcwWarMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : McwWarPlayerInfoPage,
                pageData    : { warId: null } as OpenDataForMcwWarPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : McwWarBasicSettingsPage,
                pageData    : { warId: null } as OpenDataForMcwWarBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : McwWarAdvancedSettingsPage,
                pageData    : { warId: null } as OpenDataForMcwWarAdvancedSettingsPage,
            },
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text         = Lang.getText(LangTextType.A0040);
        this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0137);
        this._labelMyWar.text           = Lang.getText(LangTextType.B0588);
        this._labelChooseWar.text       = Lang.getText(LangTextType.B0589);
        this._btnBack.label             = Lang.getText(LangTextType.B0146);
        this._labelNoWar.text           = Lang.getText(LangTextType.B0210);
        this._btnNextStep.label         = Lang.getText(LangTextType.B0024);
    }

    private _updateGroupWarList(): void {
        const labelLoading  = this._labelLoading;
        const labelNoWar    = this._labelNoWar;
        const listWar       = this._listWar;
        if (!this._hasReceivedData) {
            labelLoading.visible    = true;
            labelNoWar.visible     = false;
            listWar.clear();

        } else {
            const dataArray         = this._createDataForListWar();
            labelLoading.visible    = false;
            labelNoWar.visible      = !dataArray.length;
            listWar.bindData(dataArray);

            const warId = MpwModel.getMcwPreviewingWarId();
            if (dataArray.every(v => v.warId != warId)) {
                MpwModel.setMcwPreviewingWarId(dataArray.length ? dataArray[0].warId : undefined);
            }
        }
    }

    private _updateComponentsForPreviewingWarInfo(): void {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const warId         = MpwModel.getMcwPreviewingWarId();
        if ((!this._hasReceivedData) || (warId == null)) {
            groupTab.visible    = false;
            btnNextStep.visible = false;
        } else {
            groupTab.visible    = true;
            btnNextStep.visible = true;
            btnNextStep.setRedVisible(MpwModel.checkIsRedForMyWar(MpwModel.getMyWarInfo(warId)));

            const tab = this._tabSettings;
            tab.updatePageData(0, { warId } as OpenDataForMcwWarMapInfoPage);
            tab.updatePageData(1, { warId } as OpenDataForMcwWarPlayerInfoPage);
            tab.updatePageData(2, { warId } as OpenDataForMcwWarBasicSettingsPage);
            tab.updatePageData(3, { warId } as OpenDataForMcwWarAdvancedSettingsPage);
        }
    }

    private _createDataForListWar(): DataForWarRenderer[] {
        const dataArray: DataForWarRenderer[] = [];
        for (const warInfo of MpwModel.getMyMcwWarInfoArray()) {
            const warId = warInfo.warId;
            if (warId == null) {
                Logger.error(`McwMyWarListPanel._createDataForListWar() empty warId.`);
                continue;
            }
            dataArray.push({
                warId,
            });
        }

        return dataArray.sort((v1, v2) => v1.warId - v2.warId);
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
    // @ts-ignore
    private _labelName: UiLabel;

    protected _onDataChanged(): void {
        this._labelName.text = this.data.name;
    }
}

type DataForWarRenderer = {
    warId: number;
};
class WarRenderer extends UiListItemRenderer<DataForWarRenderer> {
    // @ts-ignore
    private readonly _btnChoose     : UiButton;
    // @ts-ignore
    private readonly _btnNext       : UiButton;
    // @ts-ignore
    private readonly _labelName     : UiLabel;
    // @ts-ignore
    private readonly _imgRed        : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.McwPreviewingWarIdChanged,  callback: this._onNotifyMcwPreviewingWarIdChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        const warId     = this.data.warId;
        const warInfo   = MpwModel.getMyWarInfo(warId);
        const imgRed    = this._imgRed;
        const labelName = this._labelName;
        if (!warInfo) {
            imgRed.visible  = false;
            labelName.text  = ``;
        } else {
            imgRed.visible = MpwModel.checkIsRedForMyWar(warInfo);

            const settingsForMcw = warInfo.settingsForMcw;
            if (settingsForMcw == null) {
                Logger.error(`McwMyWarListPanel.WarRenderer._onDataChanged() empty settingsForMcw.`);
                labelName.text = ``;
            } else {
                const warName = settingsForMcw.warName;
                if (warName) {
                    labelName.text = warName;
                } else {
                    const mapId = settingsForMcw.mapId;
                    if (mapId == null) {
                        Logger.error(`McwMyWarListPanel.WarRenderer._onDataChanged() empty mapId.`);
                        labelName.text = ``;
                    } else {
                        const mapName = await WarMapModel.getMapNameInCurrentLanguage(mapId);
                        if (mapName == null) {
                            Logger.error(`McwMyWarListPanel.WarRenderer._onDataChanged() empty mapName.`);
                            labelName.text = ``;
                        } else {
                            labelName.text = mapName;
                        }
                    }
                }
            }
        }
    }

    private _onNotifyMcwPreviewingWarIdChanged(): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(): void {
        MpwModel.setMcwPreviewingWarId(this.data.warId);
    }

    private _onTouchTapBtnNext(): void {
        MpwProxy.reqMpwCommonContinueWar(this.data.warId);
    }

    private _updateState(): void {
        this.currentState = this.data.warId === MpwModel.getMcwPreviewingWarId() ? Types.UiState.Down : Types.UiState.Up;
    }
}
