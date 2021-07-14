
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsBwWar                        from "../../baseWar/model/BwWar";
import { WeActionTypeListPanel }        from "./WeActionTypeListPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import Types                        from "../../tools/helpers/Types";
import PlayerAliveState                 = Types.PlayerAliveState;
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventAction                  = ProtoTypes.WarEvent.IWarEventAction;
import LangTextType         = TwnsLangTextType.LangTextType;
import BwWar            = TwnsBwWar.BwWar;

type OpenDataForWeActionModifyPanel2 = {
    war         : BwWar;
    fullData    : IWarEventFullData;
    action      : IWarEventAction;
};
export class WeActionModifyPanel2 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel2> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeActionModifyPanel2;

    private _labelTitle             : TwnsUiLabel.UiLabel;
    private _btnType                : TwnsUiButton.UiButton;
    private _btnBack                : TwnsUiButton.UiButton;
    private _labelPlayerIndexTitle  : TwnsUiLabel.UiLabel;
    private _labelPlayerIndex       : TwnsUiLabel.UiLabel;
    private _btnSwitchPlayerIndex   : TwnsUiButton.UiButton;
    private _labelPlayerStateTitle  : TwnsUiLabel.UiLabel;
    private _labelPlayerState       : TwnsUiLabel.UiLabel;
    private _btnSwitchPlayerState   : TwnsUiButton.UiButton;
    private _labelTips              : TwnsUiLabel.UiLabel;

    public static show(openData: OpenDataForWeActionModifyPanel2): void {
        if (!WeActionModifyPanel2._instance) {
            WeActionModifyPanel2._instance = new WeActionModifyPanel2();
        }
        WeActionModifyPanel2._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (WeActionModifyPanel2._instance) {
            await WeActionModifyPanel2._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/warEvent/WeActionModifyPanel2.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnSwitchPlayerIndex,   callback: this._onTouchedBtnSwitchPlayerIndex },
            { ui: this._btnSwitchPlayerState,   callback: this._onTouchedBtnSwitchPlayerState },
            { ui: this._btnType,                callback: this._onTouchedBtnType },
            { ui: this._btnBack,                callback: this.close },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
        ]);

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyWarEventFullDataChanged(e: egret.Event): void {
        this._updateLabelPlayerIndex();
        this._updateLabelPlayerState();
        this._updateLabelTips();
    }

    private _onTouchedBtnSwitchPlayerIndex(e: egret.TouchEvent): void {
        const action        = this._getOpenData().action.WeaSetPlayerAliveState;
        action.playerIndex  = ((action.playerIndex || 0) % CommonConstants.WarMaxPlayerIndex) + 1;

        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }

    private _onTouchedBtnSwitchPlayerState(e: egret.TouchEvent): void {
        const action    = this._getOpenData().action.WeaSetPlayerAliveState;
        const state     = action.playerAliveState;
        if (state === PlayerAliveState.Alive) {
            action.playerAliveState = PlayerAliveState.Dying;
        } else if (state === PlayerAliveState.Dying) {
            action.playerAliveState = PlayerAliveState.Dead;
        } else {
            action.playerAliveState = PlayerAliveState.Alive;
        }

        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }

    private _onTouchedBtnType(e: egret.TouchEvent): void {
        const openData = this._getOpenData();
        WeActionTypeListPanel.show({
            war         : openData.war,
            fullData    : openData.fullData,
            action      : openData.action,
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelPlayerIndex();
        this._updateLabelPlayerState();
        this._updateLabelTips();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text               = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData.actionId}`;
        this._btnType.label                 = Lang.getText(LangTextType.B0516);
        this._btnSwitchPlayerIndex.label    = Lang.getText(LangTextType.B0520);
        this._btnSwitchPlayerState.label    = Lang.getText(LangTextType.B0520);
        this._btnBack.label                 = Lang.getText(LangTextType.B0146);
        this._labelPlayerIndexTitle.text    = Lang.getText(LangTextType.B0521);
        this._labelPlayerStateTitle.text    = Lang.getText(LangTextType.B0523);

        this._updateLabelPlayerState();
        this._updateLabelTips();
    }

    private _updateLabelPlayerIndex(): void {
        this._labelPlayerIndex.text = `P${this._getOpenData().action.WeaSetPlayerAliveState.playerIndex || `??`}`;
    }

    private _updateLabelPlayerState(): void {
        this._labelPlayerState.text = Lang.getPlayerAliveStateName(this._getOpenData().action.WeaSetPlayerAliveState.playerAliveState);
    }

    private _updateLabelTips(): void {
        this._labelTips.text = getTipsForPlayerAliveState(this._getOpenData().action.WeaSetPlayerAliveState.playerAliveState);
    }
}

function getTipsForPlayerAliveState(playerAliveState: PlayerAliveState): string {
    switch (playerAliveState) {
        case PlayerAliveState.Alive : return Lang.getText(LangTextType.A0214);
        case PlayerAliveState.Dying : return Lang.getText(LangTextType.A0215);
        case PlayerAliveState.Dead  : return Lang.getText(LangTextType.A0216);
        default                     : return undefined;
    }
}
