
import { UiListItemRenderer }                                                   from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                                                              from "../../../utility/ui/UiPanel";
import { UiButton }                                                             from "../../../utility/ui/UiButton";
import { UiLabel }                                                              from "../../../utility/ui/UiLabel";
import { UiScrollList }                                                         from "../../../utility/ui/UiScrollList";
import { UiTab }                                                                from "../../../utility/ui/UiTab";
import { UiTabItemRenderer }                                                    from "../../../utility/ui/UiTabItemRenderer";
import { CcrRoomInfoPanel }                                                     from "./CcrRoomInfoPanel";
import { TwnsLobbyBottomPanel }                                                     from "../../lobby/view/LobbyBottomPanel";
import { TwnsLobbyTopPanel }                                                        from "../../lobby/view/LobbyTopPanel";
import { CcrMainMenuPanel }                                                     from "./CcrMainMenuPanel";
import { OpenDataForCcrRoomAdvancedSettingsPage, CcrRoomAdvancedSettingsPage }  from "./CcrRoomAdvancedSettingsPage";
import { OpenDataForCcrRoomBasicSettingsPage, CcrRoomBasicSettingsPage }        from "./CcrRoomBasicSettingsPage";
import { OpenDataForCcrRoomMapInfoPage, CcrRoomMapInfoPage }                    from "./CcrRoomMapInfoPage";
import { OpenDataForCcrRoomPlayerInfoPage, CcrRoomPlayerInfoPage }              from "./CcrRoomPlayerInfoPage";
import { Helpers }                                                              from "../../../utility/Helpers";
import { Lang }                                                                 from "../../../utility/lang/Lang";
import { TwnsLangTextType }                                                     from "../../../utility/lang/LangTextType";
import { CcrJoinModel }                                                         from "../model/CcrJoinModel";
import { TwnsNotifyType }                                                       from "../../../utility/notify/NotifyType";
import { Types }                                                                from "../../../utility/Types";
import { CcrModel }                                                             from "../../coopCustomRoom/model/CcrModel";
import { WarMapModel }                                                          from "../../warMap/model/WarMapModel";
import { CcrProxy }                                                             from "../model/CcrProxy";
import LangTextType                                                             = TwnsLangTextType.LangTextType;
import NotifyType                                                               = TwnsNotifyType.NotifyType;

export class CcrMyRoomListPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CcrMyRoomListPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForCcrRoomMapInfoPage | OpenDataForCcrRoomPlayerInfoPage | OpenDataForCcrRoomAdvancedSettingsPage | OpenDataForCcrRoomBasicSettingsPage>;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelMultiPlayer      : UiLabel;
    private readonly _labelMyRoom           : UiLabel;

    private readonly _btnBack               : UiButton;
    private readonly _btnNextStep           : UiButton;

    private readonly _groupRoomList         : eui.Group;
    private readonly _listRoom              : UiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom           : UiLabel;
    private readonly _labelLoading          : UiLabel;

    private _hasReceivedData    = false;

    public static show(): void {
        if (!CcrMyRoomListPanel._instance) {
            CcrMyRoomListPanel._instance = new CcrMyRoomListPanel();
        }
        CcrMyRoomListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (CcrMyRoomListPanel._instance) {
            await CcrMyRoomListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrMyRoomListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.CcrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyCcrJoinedPreviewingRoomIdChanged },
            { type: NotifyType.MsgCcrGetJoinedRoomInfoList,        callback: this._onNotifyMsgCcrGetJoinedRoomInfoList },
            { type: NotifyType.MsgCcrCreateRoom,                   callback: this._onNotifyMsgCreateRoom },
            { type: NotifyType.MsgCcrDeleteRoomByServer,           callback: this._onNotifyMsgCcrDeleteRoomByServer },
            { type: NotifyType.MsgCcrJoinRoom,                     callback: this._onNotifyMsgCcrJoinRoom },
            { type: NotifyType.MsgCcrDeletePlayer,                 callback: this._onNotifyMsgCcrDeletePlayer },
            { type: NotifyType.MsgCcrExitRoom,                     callback: this._onNotifyMsgCcrExitRoom },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
            { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listRoom.setItemRenderer(RoomRenderer);

        this._showOpenAnimation();

        this._hasReceivedData = false;
        this._initTabSettings();
        this._updateComponentsForLanguage();
        this._updateGroupRoomList();
        this._updateComponentsForPreviewingRoomInfo();

        CcrProxy.reqCcrGetJoinedRoomInfoList();
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

    private _onNotifyCcrJoinedPreviewingRoomIdChanged(): void {
        this._updateComponentsForPreviewingRoomInfo();
    }

    private _onNotifyMsgCcrGetJoinedRoomInfoList(): void {
        this._hasReceivedData = true;
        this._updateGroupRoomList();
        this._updateComponentsForPreviewingRoomInfo();
    }

    private _onNotifyMsgCreateRoom(): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrDeleteRoomByServer(): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrJoinRoom(): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrDeletePlayer(): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrExitRoom(): void {
        this._updateGroupRoomList();
    }

    private _onTouchTapBtnBack(): void {
        this.close();
        CcrMainMenuPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
    }

    private _onTouchedBtnNextStep(): void {
        const roomId = CcrJoinModel.getJoinedPreviewingRoomId();
        if (roomId != null) {
            this.close();
            CcrRoomInfoPanel.show({
                roomId,
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
                pageClass   : CcrRoomMapInfoPage,
                pageData    : { roomId: null } as OpenDataForCcrRoomMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : CcrRoomPlayerInfoPage,
                pageData    : { roomId: null } as OpenDataForCcrRoomPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : CcrRoomBasicSettingsPage,
                pageData    : { roomId: null } as OpenDataForCcrRoomBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : CcrRoomAdvancedSettingsPage,
                pageData    : { roomId: null } as OpenDataForCcrRoomAdvancedSettingsPage,
            },
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text         = Lang.getText(LangTextType.A0040);
        this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0646);
        this._labelMyRoom.text          = Lang.getText(LangTextType.B0410);
        this._btnBack.label             = Lang.getText(LangTextType.B0146);
        this._labelNoRoom.text          = Lang.getText(LangTextType.B0582);
        this._btnNextStep.label         = Lang.getText(LangTextType.B0398);
    }

    private _updateGroupRoomList(): void {
        const labelLoading  = this._labelLoading;
        const labelNoRoom   = this._labelNoRoom;
        const listRoom      = this._listRoom;
        if (!this._hasReceivedData) {
            labelLoading.visible    = true;
            labelNoRoom.visible     = false;
            listRoom.clear();

        } else {
            const dataArray         = this._createDataForListRoom();
            labelLoading.visible    = false;
            labelNoRoom.visible     = !dataArray.length;
            listRoom.bindData(dataArray);

            const roomId = CcrJoinModel.getJoinedPreviewingRoomId();
            if (dataArray.every(v => v.roomId != roomId)) {
                CcrJoinModel.setJoinedPreviewingRoomId(dataArray.length ? dataArray[0].roomId : null);
            }
        }
    }

    private _updateComponentsForPreviewingRoomInfo(): void {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const roomId        = CcrJoinModel.getJoinedPreviewingRoomId();
        if ((!this._hasReceivedData) || (roomId == null)) {
            groupTab.visible    = false;
            btnNextStep.visible = false;
        } else {
            groupTab.visible    = true;
            btnNextStep.visible = true;

            const tab = this._tabSettings;
            tab.updatePageData(0, { roomId } as OpenDataForCcrRoomMapInfoPage);
            tab.updatePageData(1, { roomId } as OpenDataForCcrRoomPlayerInfoPage);
            tab.updatePageData(2, { roomId } as OpenDataForCcrRoomBasicSettingsPage);
            tab.updatePageData(3, { roomId } as OpenDataForCcrRoomAdvancedSettingsPage);
        }
    }

    private _createDataForListRoom(): DataForRoomRenderer[] {
        const dataArray: DataForRoomRenderer[] = [];
        for (const roomId of CcrModel.getJoinedRoomIdSet()) {
            dataArray.push({
                roomId,
            });
        }

        return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
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
            obj         : this._groupRoomList,
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
                obj         : this._groupRoomList,
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

type DataForRoomRenderer = {
    roomId: number;
};
class RoomRenderer extends UiListItemRenderer<DataForRoomRenderer> {
    private readonly _btnChoose     : UiButton;
    private readonly _btnNext       : UiButton;
    private readonly _labelName     : UiLabel;
    private readonly _imgRed        : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.CcrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyCcrJoinedPreviewingRoomIdChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        const roomId            = this.data.roomId;
        this._imgRed.visible    = await CcrModel.checkIsRedForRoom(roomId);

        const roomInfo  = await CcrModel.getRoomInfo(roomId);
        const warName   = roomInfo.settingsForCcw.warName;
        if (warName) {
            this._labelName.text = warName;
        } else {
            WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForCcw.mapId).then(v => this._labelName.text = v);
        }
    }

    private _onNotifyCcrJoinedPreviewingRoomIdChanged(): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(): void {
        CcrJoinModel.setJoinedPreviewingRoomId(this.data.roomId);
    }

    private _onTouchTapBtnNext(): void {
        CcrMyRoomListPanel.hide();
        CcrRoomInfoPanel.show({
            roomId  : this.data.roomId,
        });
    }

    private _updateState(): void {
        this.currentState = this.data.roomId === CcrJoinModel.getJoinedPreviewingRoomId() ? Types.UiState.Down : Types.UiState.Up;
    }
}
