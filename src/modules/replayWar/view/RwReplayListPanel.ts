
import { UiListItemRenderer }                                           from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                                                      from "../../../utility/ui/UiPanel";
import { UiButton }                                                     from "../../../utility/ui/UiButton";
import { UiLabel }                                                      from "../../../utility/ui/UiLabel";
import { UiScrollList }                                                 from "../../../utility/ui/UiScrollList";
import { UiTab }                                                        from "../../../utility/ui/UiTab";
import { UiTabItemRenderer }                                            from "../../../utility/ui/UiTabItemRenderer";
import { McrMainMenuPanel }                                             from "../../multiCustomRoom/view/McrMainMenuPanel";
import { CommonBlockPanel }                                             from "../../common/view/CommonBlockPanel";
import { OpenDataForRwReplayWarInfoPage, RwReplayWarInfoPage }          from "./RwReplayWarInfoPage";
import { RwSearchReplayPanel }                                          from "./RwSearchReplayPanel";
import { TwnsLobbyBottomPanel }                                             from "../../lobby/view/LobbyBottomPanel";
import { TwnsLobbyTopPanel }                                                from "../../lobby/view/LobbyTopPanel";
import { OpenDataForRwReplayMapInfoPage, RwReplayMapInfoPage }          from "./RwReplayMapInfoPage";
import { OpenDataForRwReplayPlayerInfoPage, RwReplayPlayerInfoPage }    from "./RwReplayPlayerInfoPage";
import { FlowManager }                                                  from "../../../utility/FlowManager";
import { Helpers }                                                      from "../../../utility/Helpers";
import { Lang }                                                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                                                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                                                        from "../../../utility/Types";
import { WarMapModel }                                                  from "../../warMap/model/WarMapModel";
import { RwModel }                                                      from "../model/RwModel";
import { RwProxy }                                                      from "../model/RwProxy";

export class RwReplayListPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: RwReplayListPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForRwReplayMapInfoPage | OpenDataForRwReplayPlayerInfoPage | OpenDataForRwReplayWarInfoPage>;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelReplay           : UiLabel;
    private readonly _labelChooseReplay     : UiLabel;

    private readonly _btnBack               : UiButton;
    private readonly _btnNextStep           : UiButton;
    private readonly _btnSearch             : UiButton;

    private readonly _groupReplayList       : eui.Group;
    private readonly _listReplay            : UiScrollList<DataForReplayRenderer>;
    private readonly _labelNoReplay         : UiLabel;
    private readonly _labelLoading          : UiLabel;

    private _hasReceivedData    = false;

    public static show(): void {
        if (!RwReplayListPanel._instance) {
            RwReplayListPanel._instance = new RwReplayListPanel();
        }
        RwReplayListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (RwReplayListPanel._instance) {
            await RwReplayListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/replayWar/RwReplayListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.RwPreviewingReplayIdChanged,    callback: this._onNotifyRwPreviewingReplayIdChanged },
            { type: NotifyType.MsgReplayGetInfoList,           callback: this._onNotifyMsgReplayGetInfoList },
            { type: NotifyType.MsgReplayGetData,               callback: this._onNotifyMsgReplayGetData },
            { type: NotifyType.MsgReplayGetDataFailed,         callback: this._onNotifyMsgReplayGetDataFailed },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
            { ui: this._btnSearch,      callback: this._onTouchedBtnSearch },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listReplay.setItemRenderer(ReplayRenderer);

        this._showOpenAnimation();

        this._hasReceivedData = false;
        this._initTabSettings();
        this._updateComponentsForLanguage();
        this._updateGroupReplayList();
        this._updateComponentsForPreviewingReplayInfo();

        RwProxy.reqReplayInfos(null);
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

    private _onNotifyRwPreviewingReplayIdChanged(e: egret.Event): void {
        this._updateComponentsForPreviewingReplayInfo();
    }

    private _onNotifyMsgReplayGetInfoList(e: egret.Event): void {
        this._hasReceivedData = true;
        this._updateGroupReplayList();
        this._updateComponentsForPreviewingReplayInfo();
    }

    private _onNotifyMsgReplayGetData(e: egret.Event): void {
        const data = RwModel.getReplayData();
        FlowManager.gotoReplayWar(data.encodedWar, data.replayId);
    }

    private _onNotifyMsgReplayGetDataFailed(e: egret.Event): void {
        CommonBlockPanel.hide();
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
        McrMainMenuPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
    }
    private _onTouchedBtnSearch(e: egret.TouchEvent): void {
        RwSearchReplayPanel.show();
    }
    private _onTouchedBtnNextStep(e: egret.TouchEvent): void {
        const replayId = RwModel.getPreviewingReplayId();
        if (replayId != null) {
            CommonBlockPanel.show({
                title   : Lang.getText(LangTextType.B0088),
                content : Lang.getText(LangTextType.A0040),
            });
            RwProxy.reqReplayGetData(replayId);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _initTabSettings(): void {
        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : RwReplayMapInfoPage,
                pageData    : { replayId: null } as OpenDataForRwReplayMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : RwReplayPlayerInfoPage,
                pageData    : { replayId: null } as OpenDataForRwReplayPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : RwReplayWarInfoPage,
                pageData    : { replayId: null } as OpenDataForRwReplayWarInfoPage,
            },
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text         = Lang.getText(LangTextType.A0040);
        this._labelReplay.text          = Lang.getText(LangTextType.B0092);
        this._labelChooseReplay.text    = Lang.getText(LangTextType.B0598);
        this._btnBack.label             = Lang.getText(LangTextType.B0146);
        this._labelNoReplay.text        = Lang.getText(LangTextType.B0241);
        this._btnNextStep.label         = Lang.getText(LangTextType.B0024);
        this._btnSearch.label           = Lang.getText(LangTextType.B0228);
    }

    private _updateGroupReplayList(): void {
        const labelLoading  = this._labelLoading;
        const labelNoReplay = this._labelNoReplay;
        const listReplay    = this._listReplay;
        if (!this._hasReceivedData) {
            labelLoading.visible    = true;
            labelNoReplay.visible   = false;
            listReplay.clear();

        } else {
            const dataArray         = this._createDataForListReplay();
            labelLoading.visible    = false;
            labelNoReplay.visible   = !dataArray.length;
            listReplay.bindData(dataArray);

            const replayId = RwModel.getPreviewingReplayId();
            if (dataArray.every(v => v.replayId != replayId)) {
                RwModel.setPreviewingReplayId(dataArray.length ? dataArray[0].replayId : null);
            }
        }
    }

    private _updateComponentsForPreviewingReplayInfo(): void {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const replayId      = RwModel.getPreviewingReplayId();
        if ((!this._hasReceivedData) || (replayId == null)) {
            groupTab.visible    = false;
            btnNextStep.visible = false;
        } else {
            groupTab.visible    = true;
            btnNextStep.visible = true;

            const tab = this._tabSettings;
            tab.updatePageData(0, { replayId } as OpenDataForRwReplayMapInfoPage);
            tab.updatePageData(1, { replayId } as OpenDataForRwReplayPlayerInfoPage);
            tab.updatePageData(2, { replayId } as OpenDataForRwReplayWarInfoPage);
        }
    }

    private _createDataForListReplay(): DataForReplayRenderer[] {
        const dataArray: DataForReplayRenderer[] = [];
        for (const replayInfo of RwModel.getReplayInfoList() || []) {
            dataArray.push({
                replayId: replayInfo.replayBriefInfo.replayId,
            });
        }

        return dataArray.sort((v1, v2) => v2.replayId - v1.replayId);
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
            obj         : this._btnSearch,
            beginProps  : { alpha: 0, y: 40 },
            endProps    : { alpha: 1, y: 80 },
        });
        Helpers.resetTween({
            obj         : this._groupReplayList,
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
                obj         : this._btnSearch,
                beginProps  : { alpha: 1, y: 80 },
                endProps    : { alpha: 0, y: 40 },
            });
            Helpers.resetTween({
                obj         : this._groupReplayList,
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

type DataForReplayRenderer = {
    replayId: number;
};
class ReplayRenderer extends UiListItemRenderer<DataForReplayRenderer> {
    private readonly _btnChoose     : UiButton;
    private readonly _btnNext       : UiButton;
    private readonly _labelType     : UiLabel;
    private readonly _labelId       : UiLabel;
    private readonly _labelName     : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.RwPreviewingReplayIdChanged,  callback: this._onNotifyRwPreviewingReplayIdChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        const replayInfo        = RwModel.getReplayInfo(this.data.replayId);
        const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
        const labelId           = this._labelId;
        const labelType         = this._labelType;
        const labelName         = this._labelName;
        if (replayBriefInfo == null) {
            labelId.text    = null;
            labelType.text  = null;
            labelName.text  = null;
        } else {
            labelId.text    = `ID: ${replayBriefInfo.replayId}`;
            labelType.text  = Lang.getWarTypeName(replayBriefInfo.warType);
            labelName.text  = await WarMapModel.getMapNameInCurrentLanguage(replayBriefInfo.mapId);
        }
    }

    private _onNotifyRwPreviewingReplayIdChanged(e: egret.Event): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        RwModel.setPreviewingReplayId(this.data.replayId);
    }

    private _onTouchTapBtnNext(e: egret.TouchEvent): void {
        CommonBlockPanel.show({
            title   : Lang.getText(LangTextType.B0088),
            content : Lang.getText(LangTextType.A0040),
        });
        RwProxy.reqReplayGetData(this.data.replayId);
    }

    private _updateState(): void {
        this.currentState = this.data.replayId === RwModel.getPreviewingReplayId() ? Types.UiState.Down : Types.UiState.Up;
    }
}
