
import TwnsUiImage                          from "../../tools/ui/UiImage";
import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import TwnsUiButton                          from "../../tools/ui/UiButton";
import TwnsUiLabel                          from "../../tools/ui/UiLabel";
import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
import TwnsUiTab                            from "../../tools/ui/UiTab";
import TwnsUiTabItemRenderer                from "../../tools/ui/UiTabItemRenderer";
import { MfrMainMenuPanel }                 from "./MfrMainMenuPanel";
import { MfrCreateAdvancedSettingsPage }    from "./MfrCreateAdvancedSettingsPage";
import { MfrCreateBasicSettingsPage }       from "./MfrCreateBasicSettingsPage";
import { MfrCreateMapInfoPage }             from "./MfrCreateMapInfoPage";
import { MfrCreatePlayerInfoPage }          from "./MfrCreatePlayerInfoPage";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import CommonConstants                  from "../../tools/helpers/CommonConstants";
import FloatText                        from "../../tools/helpers/FloatText";
import { FlowManager }                      from "../../tools/helpers/FlowManager";
import Helpers                          from "../../tools/helpers/Helpers";
import Lang                             from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import Types                            from "../../tools/helpers/Types";
import BwHelpers                        from "../../baseWar/model/BwHelpers";
import BwWarRuleHelpers                  from "../../baseWar/model/BwWarRuleHelpers";
import { MfrCreateModel }                   from "../model/MfrCreateModel";
import MfrProxy                         from "../../multiFreeRoom/model/MfrProxy";
import LangTextType         = TwnsLangTextType.LangTextType;
import NotifyType       = TwnsNotifyType.NotifyType;

const CONFIRM_INTERVAL_MS = 5000;

export class MfrCreateSettingsPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MfrCreateSettingsPanel;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelMultiPlayer      : TwnsUiLabel.UiLabel;
    private readonly _labelFreeMode         : TwnsUiLabel.UiLabel;
    private readonly _labelCreateRoom       : TwnsUiLabel.UiLabel;
    private readonly _labelRoomSettings     : TwnsUiLabel.UiLabel;

    private readonly _groupSettings         : eui.Group;
    private readonly _groupChoosePlayerIndex: eui.Group;
    private readonly _labelChoosePlayerIndex: TwnsUiLabel.UiLabel;
    private readonly _sclPlayerIndex        : TwnsUiScrollList.UiScrollList<DataForPlayerIndexRenderer>;

    private readonly _groupChooseSkinId     : eui.Group;
    private readonly _labelChooseSkinId     : TwnsUiLabel.UiLabel;
    private readonly _sclSkinId             : TwnsUiScrollList.UiScrollList<DataForSkinIdRenderer>;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : TwnsUiTab.UiTab<DataForTabItemRenderer, void>;

    private readonly _btnBack               : TwnsUiButton.UiButton;
    private readonly _btnConfirm            : TwnsUiButton.UiButton;

    private _timeoutIdForBtnConfirm: number;

    public static show(): void {
        if (!MfrCreateSettingsPanel._instance) {
            MfrCreateSettingsPanel._instance = new MfrCreateSettingsPanel();
        }
        MfrCreateSettingsPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MfrCreateSettingsPanel._instance) {
            await MfrCreateSettingsPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/multiFreeRoom/MfrCreateSettingsPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMfrCreateRoom,           callback: this._onNotifyMsgMfrCreateRoom },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
        this._sclSkinId.setItemRenderer(SkinIdRenderer);

        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : MfrCreateBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : MfrCreateAdvancedSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0224) },
                pageClass   : MfrCreatePlayerInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : MfrCreateMapInfoPage,
            },
        ]);

        this._showOpenAnimation();

        this._updateComponentsForLanguage();
        this._initSclPlayerIndex();
        this._initSclSkinId();
        this._btnConfirm.enabled = true;
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
        this._clearTimeoutForBtnConfirm();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(): void {
        this.close();
        MfrMainMenuPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
    }
    private _onTouchedBtnConfirm(): void {
        const data = MfrCreateModel.getData();
        MfrProxy.reqCreateRoom(data);

        this._btnConfirm.enabled = false;
        this._resetTimeoutForBtnConfirm();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMfrCreateRoom(): void {
        FloatText.show(Lang.getText(LangTextType.A0015));
        FlowManager.gotoLobby();
    }

    private _resetTimeoutForBtnConfirm(): void {
        this._clearTimeoutForBtnConfirm();
        this._timeoutIdForBtnConfirm = egret.setTimeout(() => {
            this._btnConfirm.enabled     = true;
            this._timeoutIdForBtnConfirm = undefined;
        }, this, CONFIRM_INTERVAL_MS);
    }

    private _clearTimeoutForBtnConfirm(): void {
        if (this._timeoutIdForBtnConfirm != null) {
            egret.clearTimeout(this._timeoutIdForBtnConfirm);
            this._timeoutIdForBtnConfirm = undefined;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for the view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0137);
        this._labelFreeMode.text            = Lang.getText(LangTextType.B0557);
        this._labelCreateRoom.text          = Lang.getText(LangTextType.B0000);
        this._labelRoomSettings.text        = Lang.getText(LangTextType.B0571);
        this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
        this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0586);
        this._btnBack.label                 = Lang.getText(LangTextType.B0146);
        this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
    }

    private async _initSclPlayerIndex(): Promise<void> {
        const playersCountUnneutral = MfrCreateModel.getInitialWarData().playerManager.players.length - 1;
        const dataArray             : DataForPlayerIndexRenderer[] = [];
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataArray.push({
                playerIndex,
            });
        }
        this._sclPlayerIndex.bindData(dataArray);
    }

    private _initSclSkinId(): void {
        const dataArray: DataForSkinIdRenderer[] = [];
        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
            dataArray.push({
                skinId,
            });
        }
        this._sclSkinId.bindData(dataArray);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._groupNavigator,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._btnBack,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupSettings,
            beginProps  : { alpha: 0, left: -20 },
            endProps    : { alpha: 1, left: 20 },
        });
        Helpers.resetTween({
            obj         : this._btnConfirm,
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
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
                callback    : resolve,
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupSettings,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnConfirm,
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

type DataForPlayerIndexRenderer = {
    playerIndex: number;
};
class PlayerIndexRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelName : TwnsUiLabel.UiLabel;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MfrCreateTeamIndexChanged,          callback: this._onNotifyMfrCreateTeamIndexChanged },
            { type: NotifyType.MfrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateLabelName();
        this._updateState();
    }

    public onItemTapEvent(): void {
        const data = this.data;
        if (data) {
            const creator       = MfrCreateModel;
            const playerIndex   = data.playerIndex;
            const playerData    = creator.getInitialWarData().playerManager.players.find(v => v.playerIndex === playerIndex);
            if ((playerData == null)                                    ||
                (playerData.aliveState === Types.PlayerAliveState.Dead) ||
                (playerData.userId == null)
            ) {
                FloatText.show(Lang.getText(LangTextType.A0204));
            } else {
                creator.setSelfPlayerIndex(playerIndex);
            }
        }
    }
    private _onNotifyLanguageChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyMfrCreateTeamIndexChanged(): void {
        this._updateLabelName();
    }
    private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
        this._updateState();
    }

    private _updateLabelName(): void {
        const data = this.data;
        if (data) {
            const playerIndex       = data.playerIndex;
            this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(BwWarRuleHelpers.getTeamIndex(MfrCreateModel.getWarRule(), playerIndex))})`;
        }
    }
    private _updateState(): void {
        const data          = this.data;
        this.currentState   = ((data) && (data.playerIndex === MfrCreateModel.getSelfPlayerIndex())) ? `down` : `up`;
    }
}

type DataForSkinIdRenderer = {
    skinId: number;
};
class SkinIdRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkinIdRenderer> {
    private readonly _imgColor  : TwnsUiImage.UiImage;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.MfrCreateSelfPlayerIndexChanged, callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateImgColor();
    }

    private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
        this._updateImgColor();
    }

    private _updateImgColor(): void {
        const data = this.data;
        if (data) {
            const skinId            = data.skinId;
            this._imgColor.source   = BwHelpers.getImageSourceForSkinId(skinId, MfrCreateModel.getSelfPlayerData().unitAndTileSkinId === skinId);
        }
    }
}
