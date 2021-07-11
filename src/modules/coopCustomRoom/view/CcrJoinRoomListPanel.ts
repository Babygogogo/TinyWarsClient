
import { UiListItemRenderer }                                                   from "../../../gameui/UiListItemRenderer";
import { UiPanel }                                                              from "../../../gameui/UiPanel";
import { UiButton }                                                             from "../../../gameui/UiButton";
import { UiLabel }                                                              from "../../../gameui/UiLabel";
import { UiScrollList }                                                         from "../../../gameui/UiScrollList";
import { UiTab }                                                                from "../../../gameui/UiTab";
import { UiTabItemRenderer }                                                    from "../../../gameui/UiTabItemRenderer";
import { CcrJoinPasswordPanel }                                                 from "./CcrJoinPasswordPanel";
import { CcrMainMenuPanel }                                                     from "./CcrMainMenuPanel";
import { CcrRoomInfoPanel }                                                     from "./CcrRoomInfoPanel";
import { LobbyTopPanel }                                                        from "../../lobby/view/LobbyTopPanel";
import { LobbyBottomPanel }                                                     from "../../lobby/view/LobbyBottomPanel";
import { OpenDataForCcrRoomAdvancedSettingsPage, CcrRoomAdvancedSettingsPage }  from "./CcrRoomAdvancedSettingsPage";
import { OpenDataForCcrRoomBasicSettingsPage, CcrRoomBasicSettingsPage }        from "./CcrRoomBasicSettingsPage";
import { OpenDataForCcrRoomMapInfoPage, CcrRoomMapInfoPage }                    from "./CcrRoomMapInfoPage";
import { OpenDataForCcrRoomPlayerInfoPage, CcrRoomPlayerInfoPage }              from "./CcrRoomPlayerInfoPage";
import * as FloatText                                                           from "../../../utility/FloatText";
import * as Helpers                                                             from "../../../utility/Helpers";
import * as Lang                                                                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                                                               from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                                                          from "../../../utility/ProtoTypes";
import { Types }                                                                from "../../../utility/Types";
import * as CcrModel                                                            from "../../coopCustomRoom/model/CcrModel";
import * as UserModel                                                           from "../../user/model/UserModel";
import * as WarMapModel                                                         from "../../warMap/model/WarMapModel";
import * as CcrProxy                                                            from "../model/CcrProxy";

export class CcrJoinRoomListPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CcrJoinRoomListPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForCcrRoomMapInfoPage | OpenDataForCcrRoomPlayerInfoPage | OpenDataForCcrRoomAdvancedSettingsPage | OpenDataForCcrRoomBasicSettingsPage>;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelMultiPlayer      : UiLabel;
    private readonly _labelJoinRoom         : UiLabel;
    private readonly _labelChooseRoom       : UiLabel;

    private readonly _btnBack               : UiButton;
    private readonly _btnNextStep           : UiButton;

    private readonly _groupRoomList         : eui.Group;
    private readonly _listRoom              : UiScrollList<DataForRoomRenderer>;
    private readonly _labelNoRoom           : UiLabel;
    private readonly _labelLoading          : UiLabel;

    private _hasReceivedData    = false;

    public static show(): void {
        if (!CcrJoinRoomListPanel._instance) {
            CcrJoinRoomListPanel._instance = new CcrJoinRoomListPanel();
        }
        CcrJoinRoomListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (CcrJoinRoomListPanel._instance) {
            await CcrJoinRoomListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrJoinRoomListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.CcrJoinTargetRoomIdChanged,     callback: this._onNotifyCcrJoinTargetRoomIdChanged },
            { type: NotifyType.MsgCcrGetJoinableRoomInfoList,  callback: this._onMsgCcrGetJoinableRoomInfoList },
            { type: NotifyType.MsgCcrCreateRoom,               callback: this._onNotifyMsgCreateRoom },
            { type: NotifyType.MsgCcrDeleteRoomByServer,       callback: this._onNotifyMsgCcrDeleteRoomByServer },
            { type: NotifyType.MsgCcrJoinRoom,                 callback: this._onNotifyMsgCcrJoinRoom },
            { type: NotifyType.MsgCcrDeletePlayer,             callback: this._onNotifyMsgCcrDeletePlayer },
            { type: NotifyType.MsgCcrExitRoom,                 callback: this._onNotifyMsgCcrExitRoom },
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
        this._updateComponentsForTargetRoomInfo();

        CcrProxy.reqCcrGetJoinableRoomInfoList();
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

    private _onNotifyCcrJoinTargetRoomIdChanged(): void {
        this._updateComponentsForTargetRoomInfo();
    }

    private async _onMsgCcrGetJoinableRoomInfoList(): Promise<void> {
        this._hasReceivedData = true;
        this._updateGroupRoomList();
        this._updateComponentsForTargetRoomInfo();
    }

    private _onNotifyMsgCreateRoom(): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrDeleteRoomByServer(): void {
        this._updateGroupRoomList();
    }

    private _onNotifyMsgCcrJoinRoom(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrJoinRoom.IS;
        if (data.userId === UserModel.getSelfUserId()) {
            this.close();
            CcrRoomInfoPanel.show({ roomId: data.roomId });
        }
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
        LobbyTopPanel.show();
        LobbyBottomPanel.show();
    }

    private async _onTouchedBtnNextStep(): Promise<void> {
        const roomInfo = await CcrModel.getRoomInfo(CcrModel.Join.getTargetRoomId());
        if (roomInfo) {
            if (roomInfo.settingsForCcw.warPassword) {
                CcrJoinPasswordPanel.show({ roomInfo });
            } else {
                const joinData = CcrModel.Join.getFastJoinData(roomInfo);
                if (joinData) {
                    CcrProxy.reqCcrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(LangTextType.A0145));
                    CcrProxy.reqCcrGetJoinableRoomInfoList();
                }
            }
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
        this._labelJoinRoom.text        = Lang.getText(LangTextType.B0580);
        this._labelChooseRoom.text      = Lang.getText(LangTextType.B0581);
        this._btnBack.label             = Lang.getText(LangTextType.B0146);
        this._labelNoRoom.text          = Lang.getText(LangTextType.B0582);
        this._btnNextStep.label         = Lang.getText(LangTextType.B0583);
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

            const roomId = CcrModel.Join.getTargetRoomId();
            if (dataArray.every(v => v.roomId != roomId)) {
                CcrModel.Join.setTargetRoomId(dataArray.length ? dataArray[0].roomId : null);
            }
        }
    }

    private async _updateComponentsForTargetRoomInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const btnNextStep   = this._btnNextStep;
        const roomId        = CcrModel.Join.getTargetRoomId();
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
        for (const roomId of CcrModel.getUnjoinedRoomIdSet()) {
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
    roomId  : number;
};
class RoomRenderer extends UiListItemRenderer<DataForRoomRenderer> {
    private readonly _btnChoose     : UiButton;
    private readonly _btnNext       : UiButton;
    private readonly _labelName     : UiLabel;
    private readonly _imgPassword   : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.CcrJoinTargetRoomIdChanged, callback: this._onNotifyCcrJoinTargetRoomIdChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        const roomInfo = await CcrModel.getRoomInfo(this.data.roomId);
        if (roomInfo == null) {
            return;
        }

        const settingsForCcw        = roomInfo.settingsForCcw;
        this._imgPassword.visible   = !!settingsForCcw.warPassword;

        const warName = settingsForCcw.warName;
        if (warName) {
            this._labelName.text = warName;
        } else {
            WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForCcw.mapId).then(v => this._labelName.text = v);
        }
    }

    private _onNotifyCcrJoinTargetRoomIdChanged(): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(): void {
        CcrModel.Join.setTargetRoomId(this.data.roomId);
    }

    private async _onTouchTapBtnNext(): Promise<void> {
        const roomInfo = await CcrModel.getRoomInfo(this.data.roomId);
        if (roomInfo == null) {
            return;
        }

        if (roomInfo.settingsForCcw.warPassword) {
            CcrJoinPasswordPanel.show({ roomInfo });
        } else {
            const joinData = CcrModel.Join.getFastJoinData(roomInfo);
            if (joinData) {
                CcrProxy.reqCcrJoinRoom(joinData);
            } else {
                FloatText.show(Lang.getText(LangTextType.A0145));
                CcrProxy.reqCcrGetJoinableRoomInfoList();
            }
        }
    }

    private _updateState(): void {
        this.currentState = this.data.roomId === CcrModel.Join.getTargetRoomId() ? Types.UiState.Down : Types.UiState.Up;
    }
}
