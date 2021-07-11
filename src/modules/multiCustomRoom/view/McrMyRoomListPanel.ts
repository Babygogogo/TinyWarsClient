
import { UiListItemRenderer }                                                   from "../../../gameui/UiListItemRenderer";
import { UiPanel }                                                              from "../../../gameui/UiPanel";
import { UiButton }                                                             from "../../../gameui/UiButton";
import { UiLabel }                                                              from "../../../gameui/UiLabel";
import { UiScrollList }                                                         from "../../../gameui/UiScrollList";
import { UiTab }                                                                from "../../../gameui/UiTab";
import { UiTabItemRenderer }                                                    from "../../../gameui/UiTabItemRenderer";
import { LobbyBottomPanel }                                                     from "../../lobby/view/LobbyBottomPanel";
import { LobbyTopPanel }                                                        from "../../lobby/view/LobbyTopPanel";
import { McrMainMenuPanel }                                                     from "./McrMainMenuPanel";
import { OpenDataForMcrRoomAdvancedSettingsPage, McrRoomAdvancedSettingsPage }  from "./McrRoomAdvancedSettingsPage";
import { OpenDataForMcrRoomBasicSettingsPage, McrRoomBasicSettingsPage }        from "./McrRoomBasicSettingsPage";
import { McrRoomInfoPanel }                                                     from "./McrRoomInfoPanel";
import { OpenDataForMcrRoomMapInfoPage, McrRoomMapInfoPage }                    from "./McrRoomMapInfoPage";
import { OpenDataForMcrRoomPlayerInfoPage, McrRoomPlayerInfoPage }              from "./McrRoomPlayerInfoPage";
import * as Helpers                                                             from "../../../utility/Helpers";
import * as Lang                                                                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                                                              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types                                                               from "../../../utility/Types";
import * as McrModel                                                            from "../../multiCustomRoom/model/McrModel";
import * as McrProxy                                                            from "../../multiCustomRoom/model/McrProxy";
import * as WarMapModel                                                         from "../../warMap/model/WarMapModel";

export class McrMyRoomListPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McrMyRoomListPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForMcrRoomMapInfoPage | OpenDataForMcrRoomPlayerInfoPage | OpenDataForMcrRoomAdvancedSettingsPage | OpenDataForMcrRoomBasicSettingsPage>;

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
        if (!McrMyRoomListPanel._instance) {
            McrMyRoomListPanel._instance = new McrMyRoomListPanel();
        }
        McrMyRoomListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (McrMyRoomListPanel._instance) {
            await McrMyRoomListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrMyRoomListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.McrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMcrJoinedPreviewingRoomIdChanged },
            { type: NotifyType.MsgMcrGetJoinedRoomInfoList,        callback: this._onNotifyMsgMcrGetJoinedRoomInfoList },
            { type: NotifyType.MsgMcrCreateRoom,                   callback: this._onNotifyMsgCreateRoom },
            { type: NotifyType.MsgMcrDeleteRoomByServer,           callback: this._onNotifyMsgMcrDeleteRoomByServer },
            { type: NotifyType.MsgMcrJoinRoom,                     callback: this._onNotifyMsgMcrJoinRoom },
            { type: NotifyType.MsgMcrDeletePlayer,                 callback: this._onNotifyMsgMcrDeletePlayer },
            { type: NotifyType.MsgMcrExitRoom,                     callback: this._onNotifyMsgMcrExitRoom },
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

        McrProxy.reqMcrGetJoinedRoomInfoList();
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

    private _onNotifyMcrJoinedPreviewingRoomIdChanged(e: egret.Event): void {
        this._updateComponentsForPreviewingRoomInfo();
    }

    private _onNotifyMsgMcrGetJoinedRoomInfoList(e: egret.Event): void {
        this._hasReceivedData = true;
        this._updateGroupRoomList();
        this._updateComponentsForPreviewingRoomInfo();
    }

    private _onNotifyMsgCreateRoom(e: egret.Event): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMcrDeleteRoomByServer(e: egret.Event): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMcrJoinRoom(e: egret.Event): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMcrDeletePlayer(e: egret.Event): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgMcrExitRoom(e: egret.Event): void {
        this._updateGroupRoomList();
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
        McrMainMenuPanel.show();
        LobbyTopPanel.show();
        LobbyBottomPanel.show();
    }

    private _onTouchedBtnNextStep(e: egret.TouchEvent): void {
        const roomId = McrModel.Joined.getPreviewingRoomId();
        if (roomId != null) {
            this.close();
            McrRoomInfoPanel.show({
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
                pageClass   : McrRoomMapInfoPage,
                pageData    : { roomId: null } as OpenDataForMcrRoomMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : McrRoomPlayerInfoPage,
                pageData    : { roomId: null } as OpenDataForMcrRoomPlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : McrRoomBasicSettingsPage,
                pageData    : { roomId: null } as OpenDataForMcrRoomBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : McrRoomAdvancedSettingsPage,
                pageData    : { roomId: null } as OpenDataForMcrRoomAdvancedSettingsPage,
            },
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text         = Lang.getText(LangTextType.A0040);
        this._labelMultiPlayer.text     = Lang.getText(LangTextType.B0137);
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

            const roomId = McrModel.Joined.getPreviewingRoomId();
            if (dataArray.every(v => v.roomId != roomId)) {
                McrModel.Joined.setPreviewingRoomId(dataArray.length ? dataArray[0].roomId : null);
            }
        }
    }

    private _updateComponentsForPreviewingRoomInfo(): void {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const roomId        = McrModel.Joined.getPreviewingRoomId();
        if ((!this._hasReceivedData) || (roomId == null)) {
            groupTab.visible    = false;
            btnNextStep.visible = false;
        } else {
            groupTab.visible    = true;
            btnNextStep.visible = true;

            const tab = this._tabSettings;
            tab.updatePageData(0, { roomId } as OpenDataForMcrRoomMapInfoPage);
            tab.updatePageData(1, { roomId } as OpenDataForMcrRoomPlayerInfoPage);
            tab.updatePageData(2, { roomId } as OpenDataForMcrRoomBasicSettingsPage);
            tab.updatePageData(3, { roomId } as OpenDataForMcrRoomAdvancedSettingsPage);
        }
    }

    private _createDataForListRoom(): DataForRoomRenderer[] {
        const dataArray: DataForRoomRenderer[] = [];
        for (const roomId of McrModel.getJoinedRoomIdSet()) {
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
            { type: NotifyType.McrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMcrJoinedPreviewingRoomIdChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        const roomId            = this.data.roomId;
        this._imgRed.visible    = await McrModel.checkIsRedForRoom(roomId);

        const roomInfo  = await McrModel.getRoomInfo(roomId);
        const warName   = roomInfo.settingsForMcw.warName;
        if (warName) {
            this._labelName.text = warName;
        } else {
            WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMcw.mapId).then(v => this._labelName.text = v);
        }
    }

    private _onNotifyMcrJoinedPreviewingRoomIdChanged(e: egret.Event): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        McrModel.Joined.setPreviewingRoomId(this.data.roomId);
    }

    private _onTouchTapBtnNext(e: egret.TouchEvent): void {
        McrMyRoomListPanel.hide();
        McrRoomInfoPanel.show({
            roomId  : this.data.roomId,
        });
    }

    private _updateState(): void {
        this.currentState = this.data.roomId === McrModel.Joined.getPreviewingRoomId() ? Types.UiState.Down : Types.UiState.Up;
    }
}
