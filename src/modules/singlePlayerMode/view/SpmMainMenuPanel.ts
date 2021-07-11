
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { LobbyBottomPanel }             from "../../lobby/view/LobbyBottomPanel";
import { LobbyTopPanel }                from "../../lobby/view/LobbyTopPanel";
import { SpmWarListPanel }              from "./SpmWarListPanel";
import { ScrCreateMapListPanel }        from "../../singleCustomRoom/view/ScrCreateMapListPanel";
import { MrrMainMenuPanel }             from "../../multiRankRoom/view/MrrMainMenuPanel";
import { McrMainMenuPanel }             from "../../multiCustomRoom/view/McrMainMenuPanel";
import * as FloatText                   from "../../../utility/FloatText";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import { Types }                        from "../../../utility/Types";
import Tween                            = egret.Tween;

export class SpmMainMenuPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: SpmMainMenuPanel;

    private readonly _groupLeft         : eui.Group;
    private readonly _btnCampaign       : UiButton;
    private readonly _btnCreateCustomWar: UiButton;
    private readonly _btnContinueWar    : UiButton;

    private readonly _group             : eui.Group;
    private readonly _btnMultiPlayer    : UiButton;
    private readonly _btnRanking        : UiButton;
    private readonly _btnSinglePlayer   : UiButton;

    public static show(): void {
        if (!SpmMainMenuPanel._instance) {
            SpmMainMenuPanel._instance = new SpmMainMenuPanel();
        }
        SpmMainMenuPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (SpmMainMenuPanel._instance) {
            await SpmMainMenuPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/singlePlayerMode/SpmMainMenuPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
            { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            { ui: this._btnCampaign,        callback: this._onTouchedBtnCampaign },
            { ui: this._btnCreateCustomWar, callback: this._onTouchedBtnCreateCustomWar },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
        ]);

        this._showOpenAnimation();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onMsgUserLogout(e: egret.Event): void {
        this.close();
    }

    private _onTouchedBtnMultiPlayer(e: egret.TouchEvent): void {
        this.close();
        McrMainMenuPanel.show();
    }
    private _onTouchedBtnRanking(e: egret.TouchEvent): void {
        this.close();
        MrrMainMenuPanel.show();
    }
    private _onTouchedBtnCampaign(e: egret.TouchEvent): void {
        FloatText.show(Lang.getText(LangTextType.A0053));
    }
    private _onTouchedBtnCreateCustomWar(e: egret.TouchEvent): void {
        this.close();
        LobbyTopPanel.hide();
        LobbyBottomPanel.hide();
        ScrCreateMapListPanel.show();
    }
    private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
        this.close();
        LobbyTopPanel.hide();
        LobbyBottomPanel.hide();
        SpmWarListPanel.show();
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
            obj         : this._btnCampaign,
            beginProps  : { alpha: 0, left: -40 },
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnCreateCustomWar,
            beginProps  : { alpha: 0, left: -40 },
            waitTime    : 100,
            endProps    : { alpha: 1, left: 0 },
        });
        Helpers.resetTween({
            obj         : this._btnContinueWar,
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
                .to({ alpha: 0, right: 20 }, 200);

            const groupLeft = this._groupLeft;
            Tween.removeTweens(groupLeft);
            Tween.get(groupLeft)
                .set({ alpha: 1, left: 0 })
                .to({ alpha: 0, left: -40 }, 200)
                .call(resolve);
        });
    }
}
