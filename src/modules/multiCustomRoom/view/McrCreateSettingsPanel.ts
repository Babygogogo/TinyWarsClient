
import { UiImage }                          from "../../../utility/ui/UiImage";
import { UiListItemRenderer }               from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                          from "../../../utility/ui/UiPanel";
import { UiButton }                         from "../../../utility/ui/UiButton";
import { UiLabel }                          from "../../../utility/ui/UiLabel";
import { UiScrollList }                     from "../../../utility/ui/UiScrollList";
import { UiTab }                            from "../../../utility/ui/UiTab";
import { UiTabItemRenderer }                from "../../../utility/ui/UiTabItemRenderer";
import { McrCreateAdvancedSettingsPage }    from "./McrCreateAdvancedSettingsPage";
import { McrCreateBasicSettingsPage }       from "./McrCreateBasicSettingsPage";
import { McrCreateMapListPanel }            from "./McrCreateMapListPanel";
import { McrCreateMapInfoPage }             from "./McrCreateMapInfoPage";
import { McrCreateChooseCoPanel }           from "./McrCreateChooseCoPanel";
import { CommonConstants }                  from "../../../utility/CommonConstants";
import { ConfigManager }                    from "../../../utility/ConfigManager";
import { FloatText }                        from "../../../utility/FloatText";
import { FlowManager }                      from "../../../utility/FlowManager";
import { Helpers }                          from "../../../utility/Helpers";
import { Lang }                             from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import { Types }                            from "../../../utility/Types";
import { BwHelpers }                        from "../../baseWar/model/BwHelpers";
import { BwWarRuleHelpers }                  from "../../baseWar/model/BwWarRuleHelpers";
import { McrCreateModel }                   from "../model/McrCreateModel";
import { McrProxy }                         from "../../multiCustomRoom/model/McrProxy";
import LangTextType         = TwnsLangTextType.LangTextType;
import NotifyType       = TwnsNotifyType.NotifyType;

const CONFIRM_INTERVAL_MS = 5000;

export class McrCreateSettingsPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McrCreateSettingsPanel;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelMultiPlayer      : UiLabel;
    private readonly _labelCreateRoom       : UiLabel;
    private readonly _labelChooseMap        : UiLabel;
    private readonly _labelRoomSettings     : UiLabel;

    private readonly _groupSettings         : eui.Group;
    private readonly _groupChooseCo         : eui.Group;
    private readonly _labelChooseCo         : UiLabel;
    private readonly _btnChooseCo           : UiButton;

    private readonly _groupChoosePlayerIndex: eui.Group;
    private readonly _labelChoosePlayerIndex: UiLabel;
    private readonly _sclPlayerIndex        : UiScrollList<DataForPlayerIndexRenderer>;

    private readonly _groupChooseSkinId     : eui.Group;
    private readonly _labelChooseSkinId     : UiLabel;
    private readonly _sclSkinId             : UiScrollList<DataForSkinIdRenderer>;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, void>;

    private readonly _btnBack               : UiButton;
    private readonly _btnConfirm            : UiButton;

    private _timeoutIdForBtnConfirm: number;

    public static show(): void {
        if (!McrCreateSettingsPanel._instance) {
            McrCreateSettingsPanel._instance = new McrCreateSettingsPanel();
        }
        McrCreateSettingsPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (McrCreateSettingsPanel._instance) {
            await McrCreateSettingsPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrCreateSettingsPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnChooseCo,    callback: this._onTouchedBtnChooseCo },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.McrCreateSelfCoIdChanged,   callback: this._onNotifyMcrCreateSelfCoIdChanged },
            { type: NotifyType.MsgMcrCreateRoom,           callback: this._onNotifyMsgMcrCreateRoom },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
        this._sclSkinId.setItemRenderer(SkinIdRenderer);

        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : McrCreateBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : McrCreateAdvancedSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : McrCreateMapInfoPage,
            },
        ]);

        this._showOpenAnimation();

        this._updateComponentsForLanguage();
        this._initSclPlayerIndex();
        this._initSclSkinId();
        this._updateBtnChooseCo();
        this._btnConfirm.enabled = true;
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
        this._clearTimeoutForBtnConfirm();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(e: egret.TouchEvent): void {
        this.close();
        McrCreateMapListPanel.show();
    }
    private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
        const data = McrCreateModel.getData();
        McrProxy.reqCreateRoom(data);

        this._btnConfirm.enabled = false;
        this._resetTimeoutForBtnConfirm();
    }
    private _onTouchedBtnChooseCo(e: egret.TouchEvent): void {
        McrCreateChooseCoPanel.show({ coId: McrCreateModel.getSelfCoId() });
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMcrCreateSelfCoIdChanged(e: egret.Event): void {
        this._updateBtnChooseCo();
    }
    private _onNotifyMsgMcrCreateRoom(e: egret.Event): void {
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
        this._labelCreateRoom.text          = Lang.getText(LangTextType.B0000);
        this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0137);
        this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
        this._labelRoomSettings.text        = Lang.getText(LangTextType.B0571);
        this._labelChooseCo.text            = Lang.getText(LangTextType.B0145);
        this._labelChoosePlayerIndex.text   = Lang.getText(LangTextType.B0572);
        this._labelChooseSkinId.text        = Lang.getText(LangTextType.B0573);
        this._btnBack.label                 = Lang.getText(LangTextType.B0146);
        this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
    }

    private _updateBtnChooseCo(): void {
        const cfg               = ConfigManager.getCoBasicCfg(McrCreateModel.getData().settingsForCommon.configVersion, McrCreateModel.getSelfCoId());
        this._btnChooseCo.label = cfg.name;
    }

    private async _initSclPlayerIndex(): Promise<void> {
        const playersCountUnneutral = (await McrCreateModel.getMapRawData()).playersCountUnneutral;
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
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private _labelName: UiLabel;

    protected _onDataChanged(): void {
        this._labelName.text = this.data.name;
    }
}

type DataForPlayerIndexRenderer = {
    playerIndex: number;
};
class PlayerIndexRenderer extends UiListItemRenderer<DataForPlayerIndexRenderer> {
    private readonly _labelName : UiLabel;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.McrCreateTeamIndexChanged,          callback: this._onNotifyMcrCreateTeamIndexChanged },
            { type: NotifyType.McrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMcrCreateSelfPlayerIndexChanged },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateLabelName();
        this._updateState();
    }

    public onItemTapEvent(e: eui.ItemTapEvent): void {
        const data = this.data;
        if (data) {
            const creator       = McrCreateModel;
            const playerIndex   = data.playerIndex;
            creator.setSelfPlayerIndex(playerIndex);

            const availableCoIdArray = BwWarRuleHelpers.getAvailableCoIdArrayForPlayer(creator.getWarRule(), playerIndex, ConfigManager.getLatestFormalVersion());
            if (availableCoIdArray.indexOf(creator.getSelfCoId()) < 0) {
                creator.setSelfCoId(BwWarRuleHelpers.getRandomCoIdWithCoIdList(availableCoIdArray));
            }
        }
    }
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateLabelName();
    }
    private _onNotifyMcrCreateTeamIndexChanged(e: egret.Event): void {
        this._updateLabelName();
    }
    private _onNotifyMcrCreateSelfPlayerIndexChanged(e: egret.Event): void {
        this._updateState();
    }

    private _updateLabelName(): void {
        const data = this.data;
        if (data) {
            const playerIndex       = data.playerIndex;
            this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(BwWarRuleHelpers.getTeamIndex(McrCreateModel.getWarRule(), playerIndex))})`;
        }
    }
    private _updateState(): void {
        const data          = this.data;
        this.currentState   = ((data) && (data.playerIndex === McrCreateModel.getSelfPlayerIndex())) ? `down` : `up`;
    }
}

type DataForSkinIdRenderer = {
    skinId: number;
};
class SkinIdRenderer extends UiListItemRenderer<DataForSkinIdRenderer> {
    private readonly _imgColor  : UiImage;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.McrCreateSelfSkinIdChanged, callback: this._onNotifyMcrCreateSelfSkinIdChanged },
        ]);
    }

    protected _onDataChanged(): void {
        this._updateImgColor();
    }

    public onItemTapEvent(e: eui.ItemTapEvent): void {
        const data = this.data;
        if (data) {
            McrCreateModel.setSelfUnitAndTileSkinId(data.skinId);
        }
    }
    private _onNotifyMcrCreateSelfSkinIdChanged(e: egret.Event): void {
        this._updateImgColor();
    }

    private _updateImgColor(): void {
        const data = this.data;
        if (data) {
            const skinId            = data.skinId;
            this._imgColor.source   = BwHelpers.getImageSourceForSkinId(skinId, McrCreateModel.getSelfUnitAndTileSkinId() === skinId);
        }
    }
}
