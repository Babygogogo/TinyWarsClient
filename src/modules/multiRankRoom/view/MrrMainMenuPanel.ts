
import TwnsUiPanel                          from "../../../utility/ui/UiPanel";
import TwnsUiButton                          from "../../../utility/ui/UiButton";
import { SpmMainMenuPanel }                 from "../../singlePlayerMode/view/SpmMainMenuPanel";
import { TwnsMrwMyWarListPanel }                from "../../multiRankWar/view/MrwMyWarListPanel";
import { MrrMyRoomListPanel }               from "./MrrMyRoomListPanel";
import { MrrSetMaxConcurrentCountPanel }    from "./MrrSetMaxConcurrentCountPanel";
import { TwnsLobbyBottomPanel }                 from "../../lobby/view/LobbyBottomPanel";
import { TwnsLobbyTopPanel }                    from "../../lobby/view/LobbyTopPanel";
import { MrrPreviewMapListPanel }           from "./MrrPreviewMapListPanel";
import { McrMainMenuPanel }                 from "../../multiCustomRoom/view/McrMainMenuPanel";
import { Helpers }                          from "../../../utility/Helpers";
import { Notify }                           from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                            from "../../../utility/Types";
import { MpwModel }                         from "../../multiPlayerWar/model/MpwModel";
import { MrrModel }                         from "../model/MrrModel";
import Tween                                = egret.Tween;

export class MrrMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MrrMainMenuPanel;

    private readonly _group             : eui.Group;
    private readonly _btnMultiPlayer    : TwnsUiButton.UiButton;
    private readonly _btnRanking        : TwnsUiButton.UiButton;
    private readonly _btnSinglePlayer   : TwnsUiButton.UiButton;

    private readonly _groupLeft         : eui.Group;
    private readonly _btnSetGameNumber  : TwnsUiButton.UiButton;
    private readonly _btnMyRoom         : TwnsUiButton.UiButton;
    private readonly _btnContinueWar    : TwnsUiButton.UiButton;
    private readonly _btnPreviewStdMaps : TwnsUiButton.UiButton;
    private readonly _btnPreviewFogMaps : TwnsUiButton.UiButton;

    public static show(): void {
        if (!MrrMainMenuPanel._instance) {
            MrrMainMenuPanel._instance = new MrrMainMenuPanel();
        }
        MrrMainMenuPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (MrrMainMenuPanel._instance) {
            await MrrMainMenuPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/multiRankRoom/MrrMainMenuPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
            { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnSetGameNumber,   callback: this._onTouchedBtnSetGameNumber },
            { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            { ui: this._btnPreviewStdMaps,  callback: this._onTouchedBtnPreviewStdMaps },
            { ui: this._btnPreviewFogMaps,  callback: this._onTouchedBtnPreviewFogMaps },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.MsgUserLogout,                  callback: this._onMsgUserLogout },
            { type: NotifyType.MsgMrrGetRoomPublicInfo,        callback: this._onMsgMrrGetRoomPublicInfo },
            { type: NotifyType.MsgMrrGetMyRoomPublicInfoList,  callback: this._onMsgMrrGetMyRoomPublicInfoList },
        ]);

        this._showOpenAnimation();

        this._updateView();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnMultiPlayer(e: egret.TouchEvent): void {
        this.close();
        McrMainMenuPanel.show();
    }
    private _onTouchedBtnSinglePlayer(e: egret.TouchEvent): void {
        this.close();
        SpmMainMenuPanel.show();
    }
    private _onTouchedBtnSetGameNumber(e: egret.TouchEvent): void {
        MrrSetMaxConcurrentCountPanel.show();
    }
    private _onTouchedBtnMyRoom(e: egret.TouchEvent): void {
        this.close();
        TwnsLobbyTopPanel.LobbyTopPanel.hide();
        TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
        MrrMyRoomListPanel.show();
    }
    private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
        this.close();
        TwnsLobbyTopPanel.LobbyTopPanel.hide();
        TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
        TwnsMrwMyWarListPanel.MrwMyWarListPanel.show();
    }
    private _onTouchedBtnPreviewStdMaps(e: egret.TouchEvent): void {
        this.close();
        TwnsLobbyTopPanel.LobbyTopPanel.hide();
        TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
        MrrPreviewMapListPanel.show({ hasFog: false });
    }
    private _onTouchedBtnPreviewFogMaps(e: egret.TouchEvent): void {
        this.close();
        TwnsLobbyTopPanel.LobbyTopPanel.hide();
        TwnsLobbyBottomPanel.LobbyBottomPanel.hide();
        MrrPreviewMapListPanel.show({ hasFog: true });
    }

    private _onMsgUserLogout(e: egret.Event): void {
        this.close();
    }
    private _onMsgMrrGetRoomPublicInfo(e: egret.Event): void {
        this._updateComponentsForRed();
    }
    private _onMsgMrrGetMyRoomPublicInfoList(e: egret.Event): void {
        this._updateComponentsForRed();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForRed();
    }

    private async _updateComponentsForRed(): Promise<void> {
        this._btnMyRoom.setRedVisible(await MrrModel.checkIsRed());
        this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyMrwWars());
    }

    private _showOpenAnimation(): void {
        const group = this._group;
        Tween.removeTweens(group);
        group.right = 60;
        group.alpha = 1;

        Helpers.resetTween({
            obj         : this._btnMultiPlayer,
            beginProps  : { alpha: 0, right: -40 },
            endProps    : { alpha: 1, right: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnRanking,
            beginProps  : { alpha: 0, right: -40 },
            waitTime    : 100,
            endProps    : { alpha: 1, right: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnSinglePlayer,
            beginProps  : { alpha: 0, right: -40 },
            waitTime    : 200,
            endProps    : { alpha: 1, right: 0 },
        });

        const groupLeft = this._groupLeft;
        Tween.removeTweens(groupLeft);
        groupLeft.left  = 0;
        groupLeft.alpha = 1;

        Helpers.resetTween({
            obj         : this._btnSetGameNumber,
            beginProps  : { alpha: 0, left: -40 },
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnMyRoom,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 50,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnContinueWar,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 100,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnPreviewStdMaps,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 150,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnPreviewFogMaps,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 200,
            endProps    : { alpha: 1, left: 0 },
        });
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const group = this._group;
            Tween.removeTweens(group);
            Tween.get(group)
                .set({ alpha: 1, right: 60 })
                .to({ alpha: 0, right: 20 }, 200)
                .call(resolve);

            const groupLeft = this._groupLeft;
            Tween.removeTweens(groupLeft);
            Tween.get(groupLeft)
                .set({ alpha: 1, left: 0 })
                .to({ alpha: 0, left: -40 }, 200);
        });
    }
}
