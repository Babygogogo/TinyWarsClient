
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { CommonAlertPanel }             from "../../common/view/CommonAlertPanel";
import { CcwMyWarListPanel }            from "../../coopCustomWar/view/CcwMyWarListPanel";
import { LobbyBottomPanel }             from "../../lobby/view/LobbyBottomPanel";
import { LobbyTopPanel }                from "../../lobby/view/LobbyTopPanel";
import { MrrMainMenuPanel }             from "../../multiRankRoom/view/MrrMainMenuPanel";
import { SpmMainMenuPanel }             from "../../singlePlayerMode/view/SpmMainMenuPanel";
import { CcrMyRoomListPanel }           from "./CcrMyRoomListPanel";
import { McrMainMenuPanel }             from "../../multiCustomRoom/view/McrMainMenuPanel";
import { MfrMainMenuPanel }             from "../../multiFreeRoom/view/MfrMainMenuPanel";
import { CcrCreateMapListPanel }        from "./CcrCreateMapListPanel";
import { CcrJoinRoomListPanel }         from "./CcrJoinRoomListPanel";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types                       from "../../../utility/Types";
import * as CcrModel                    from "../../coopCustomRoom/model/CcrModel";
import * as McrModel                    from "../../multiCustomRoom/model/McrModel";
import * as MfrModel                    from "../../multiFreeRoom/model/MfrModel";
import * as MpwModel                    from "../../multiPlayerWar/model/MpwModel";
import Tween                            = egret.Tween;

export class CcrMainMenuPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CcrMainMenuPanel;

    // @ts-ignore
    private readonly _group             : eui.Group;
    // @ts-ignore
    private readonly _btnMultiPlayer    : UiButton;
    // @ts-ignore
    private readonly _btnRanking        : UiButton;
    // @ts-ignore
    private readonly _btnSinglePlayer   : UiButton;

    // @ts-ignore
    private readonly _groupLeft         : eui.Group;
    // @ts-ignore
    private readonly _btnCreateRoom     : UiButton;
    // @ts-ignore
    private readonly _btnJoinRoom       : UiButton;
    // @ts-ignore
    private readonly _btnMyRoom         : UiButton;
    // @ts-ignore
    private readonly _btnContinueWar    : UiButton;
    // @ts-ignore
    private readonly _btnHelp           : UiButton;
    // @ts-ignore
    private readonly _btnNormalMode     : UiButton;
    // @ts-ignore
    private readonly _btnFreeMode       : UiButton;

    public static show(): void {
        if (!CcrMainMenuPanel._instance) {
            CcrMainMenuPanel._instance = new CcrMainMenuPanel();
        }
        CcrMainMenuPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (CcrMainMenuPanel._instance) {
            await CcrMainMenuPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrMainMenuPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnCreateRoom,      callback: this._onTouchedBtnCreateRoom },
            { ui: this._btnJoinRoom,        callback: this._onTouchedBtnJoinRoom },
            { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnNormalMode,      callback: this._onTouchedBtnNormalMode },
            { ui: this._btnFreeMode,        callback: this._onTouchedBtnFreeMode },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
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
    private _onTouchedBtnRanking(): void {
        this.close();
        MrrMainMenuPanel.show();
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.close();
        SpmMainMenuPanel.show();
    }
    private _onTouchedBtnCreateRoom(): void {
        this.close();
        LobbyTopPanel.hide();
        LobbyBottomPanel.hide();
        CcrCreateMapListPanel.show({});
    }
    private _onTouchedBtnJoinRoom(): void {
        this.close();
        LobbyTopPanel.hide();
        LobbyBottomPanel.hide();
        CcrJoinRoomListPanel.show();
    }
    private _onTouchedBtnMyRoom(): void {
        this.close();
        LobbyTopPanel.hide();
        LobbyBottomPanel.hide();
        CcrMyRoomListPanel.show();
    }
    private _onTouchedBtnContinueWar(): void {
        this.close();
        LobbyTopPanel.hide();
        LobbyBottomPanel.hide();
        CcwMyWarListPanel.show();
    }
    private _onTouchedBtnHelp(): void {
        CommonAlertPanel.show({
            title   : Lang.getText(LangTextType.B0143),
            content : Lang.getText(LangTextType.R0008),
        });
    }
    private _onTouchedBtnNormalMode(): void {
        this.close();
        McrMainMenuPanel.show();
    }
    private _onTouchedBtnFreeMode(): void {
        this.close();
        MfrMainMenuPanel.show();
    }

    private _onMsgUserLogout(): void {
        this.close();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
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
            obj         : this._btnCreateRoom,
            beginProps  : { alpha: 0, left: -40 },
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnJoinRoom,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 200 / 6 * 1,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnMyRoom,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 200 / 6 * 2,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnContinueWar,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 200 / 6 * 3,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnHelp,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 200 / 6 * 4,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnNormalMode,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 200 / 6 * 5,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnFreeMode,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 200,
            endProps    : { alpha: 1, left: 0 },
        });
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>((resolve) => {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, right: 60 },
                endProps    : { alpha: 0, right: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupLeft,
                beginProps  : { alpha: 1, left: 0 },
                endProps    : { alpha: 0, left: -40 },
                callback    : resolve,
            });
        });
    }

    private async _updateView(): Promise<void> {
        this._btnMyRoom.setRedVisible(await CcrModel.checkIsRed());
        this._btnContinueWar.setRedVisible(MpwModel.checkIsRedForMyCcwWars());
        this._btnNormalMode.setRedVisible(MpwModel.checkIsRedForMyMcwWars() || await McrModel.checkIsRed());
        this._btnFreeMode.setRedVisible(MpwModel.checkIsRedForMyMfwWars() || await MfrModel.checkIsRed());
    }
}
