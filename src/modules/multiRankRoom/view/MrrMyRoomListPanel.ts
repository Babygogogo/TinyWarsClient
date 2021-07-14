
import TwnsUiListItemRenderer                                                   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                                                              from "../../tools/ui/UiPanel";
import TwnsUiButton                                                              from "../../tools/ui/UiButton";
import TwnsUiLabel                                                              from "../../tools/ui/UiLabel";
import TwnsUiScrollList                                                         from "../../tools/ui/UiScrollList";
import TwnsUiTab                                                                from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer                                                    from "../../tools/ui/UiTabItemRenderer";
import TwnsLobbyBottomPanel                                                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                                                        from "../../lobby/view/LobbyTopPanel";
import { MrrMainMenuPanel }                                                     from "./MrrMainMenuPanel";
import { MrrRoomInfoPanel }                                                     from "./MrrRoomInfoPanel";
import { OpenDataForMrrRoomAdvancedSettingsPage, MrrRoomAdvancedSettingsPage }  from "./MrrRoomAdvancedSettingsPage";
import { OpenDataForMrrRoomBasicSettingsPage, MrrRoomBasicSettingsPage }        from "./MrrRoomBasicSettingsPage";
import { OpenDataForMrrRoomMapInfoPage, MrrRoomMapInfoPage }                    from "./MrrRoomMapInfoPage";
import { OpenDataForMrrRoomPlayerInfoPage, MrrRoomPlayerInfoPage }              from "./MrrRoomPlayerInfoPage";
import Helpers                                                              from "../../tools/helpers/Helpers";
import Lang                                                                 from "../../tools/lang/Lang";
import TwnsLangTextType                                                     from "../../tools/lang/LangTextType";
import TwnsNotifyType                                                       from "../../tools/notify/NotifyType";
import Types                                                                from "../../tools/helpers/Types";
import WarMapModel                                                          from "../../warMap/model/WarMapModel";
import { MrrModel }                                                             from "../model/MrrModel";
import MrrProxy                                                             from "../model/MrrProxy";
import { MrrSelfSettingsModel }                                                 from "../model/MrrSelfSettingsModel";
import LangTextType                                                             = TwnsLangTextType.LangTextType;
import NotifyType                                                               = TwnsNotifyType.NotifyType;

export class MrrMyRoomListPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MrrMyRoomListPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, OpenDataForMrrRoomMapInfoPage | OpenDataForMrrRoomPlayerInfoPage | OpenDataForMrrRoomAdvancedSettingsPage | OpenDataForMrrRoomBasicSettingsPage>;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelRankMatch        : TwnsUiLabel.UiLabel;
    private readonly _labelMyRoom           : TwnsUiLabel.UiLabel;

    private readonly _btnBack               : TwnsUiButton.UiButton;
    private readonly _btnNextStep           : TwnsUiButton.UiButton;

    private readonly _groupRoomList         : eui.Group;
    private readonly _listRoom              : TwnsUiScrollList.UiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom           : TwnsUiLabel.UiLabel;
    private readonly _labelLoading          : TwnsUiLabel.UiLabel;

    private _hasReceivedData    = false;

    public static show(): void {
        if (!MrrMyRoomListPanel._instance) {
            MrrMyRoomListPanel._instance = new MrrMyRoomListPanel();
        }
        MrrMyRoomListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MrrMyRoomListPanel._instance) {
            await MrrMyRoomListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/multiRankRoom/MrrMyRoomListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MrrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMrrJoinedPreviewingRoomIdChanged },
            { type: NotifyType.MsgMrrGetMyRoomPublicInfoList,      callback: this._onNotifyMsgMrrGetMyRoomPublicInfoList },
            { type: NotifyType.MsgMrrDeleteRoomByServer,           callback: this._onNotifyMsgMrrDeleteRoomByServer },
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

        MrrProxy.reqMrrGetMyRoomPublicInfoList();
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

    private _onNotifyMrrJoinedPreviewingRoomIdChanged(e: egret.Event): void {
        this._updateComponentsForPreviewingRoomInfo();
    }

    private _onNotifyMsgMrrGetMyRoomPublicInfoList(e: egret.Event): void {
        this._hasReceivedData = true;
        this._updateGroupRoomList();
        this._updateComponentsForPreviewingRoomInfo();
    }

    private _onNotifyMsgMrrDeleteRoomByServer(e: egret.Event): void {
        this._updateGroupRoomList();
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
        MrrMainMenuPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
    }

    private async _onTouchedBtnNextStep(e: egret.TouchEvent): Promise<void> {
        const roomId = MrrModel.getPreviewingRoomId();
        if (roomId != null) {
            this.close();
            await MrrSelfSettingsModel.resetData(roomId);
            MrrRoomInfoPanel.show({
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
                pageClass   : MrrRoomMapInfoPage,
                pageData    : { roomId: null } as OpenDataForMrrRoomMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : MrrRoomPlayerInfoPage,
                pageData    : { roomId: null } as OpenDataForMrrRoomPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : MrrRoomBasicSettingsPage,
                pageData    : { roomId: null } as OpenDataForMrrRoomBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : MrrRoomAdvancedSettingsPage,
                pageData    : { roomId: null } as OpenDataForMrrRoomAdvancedSettingsPage,
            },
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text         = Lang.getText(LangTextType.A0040);
        this._labelRankMatch.text       = Lang.getText(LangTextType.B0404);
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

            const roomId = MrrModel.getPreviewingRoomId();
            if (dataArray.every(v => v.roomId != roomId)) {
                MrrModel.setPreviewingRoomId(dataArray.length ? dataArray[0].roomId : null);
            }
        }
    }

    private _updateComponentsForPreviewingRoomInfo(): void {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const roomId        = MrrModel.getPreviewingRoomId();
        if ((!this._hasReceivedData) || (roomId == null)) {
            groupTab.visible    = false;
            btnNextStep.visible = false;
        } else {
            groupTab.visible    = true;
            btnNextStep.visible = true;

            const tab = this._tabSettings;
            tab.updatePageData(0, { roomId } as OpenDataForMrrRoomMapInfoPage);
            tab.updatePageData(1, { roomId } as OpenDataForMrrRoomPlayerInfoPage);
            tab.updatePageData(2, { roomId } as OpenDataForMrrRoomBasicSettingsPage);
            tab.updatePageData(3, { roomId } as OpenDataForMrrRoomAdvancedSettingsPage);
        }
    }

    private _createDataForListRoom(): DataForRoomRenderer[] {
        const dataArray: DataForRoomRenderer[] = [];
        for (const roomId of MrrModel.getMyRoomIdArray()) {
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
class TabItemRenderer extends TwnsUiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private _labelName: TwnsUiLabel.UiLabel;

    protected _onDataChanged(): void {
        this._labelName.text = this.data.name;
    }
}

type DataForRoomRenderer = {
    roomId: number;
};
class RoomRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRoomRenderer> {
    private readonly _btnChoose     : TwnsUiButton.UiButton;
    private readonly _btnNext       : TwnsUiButton.UiButton;
    private readonly _labelName     : TwnsUiLabel.UiLabel;
    private readonly _imgRed        : TwnsUiLabel.UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.MrrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMrrJoinedPreviewingRoomIdChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        const roomId            = this.data.roomId;
        this._imgRed.visible    = await MrrModel.checkIsRedForRoom(roomId);

        const roomInfo          = await MrrModel.getRoomInfo(roomId);
        this._labelName.text    = roomInfo ? await WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMrw.mapId) : null;
    }

    private _onNotifyMrrJoinedPreviewingRoomIdChanged(e: egret.Event): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        MrrModel.setPreviewingRoomId(this.data.roomId);
    }

    private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
        const roomId = this.data.roomId;
        if (roomId != null) {
            MrrMyRoomListPanel.hide();
            await MrrSelfSettingsModel.resetData(roomId);
            MrrRoomInfoPanel.show({
                roomId,
            });
        }
    }

    private _updateState(): void {
        this.currentState = this.data.roomId === MrrModel.getPreviewingRoomId() ? Types.UiState.Down : Types.UiState.Up;
    }
}
