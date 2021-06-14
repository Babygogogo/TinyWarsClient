
namespace TinyWars.MultiCustomRoom {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import BwHelpers        = BaseWar.BwHelpers;

    const CONFIRM_INTERVAL_MS = 5000;

    export class McrCreateSettingsPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateSettingsPanel;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : GameUi.UiLabel;
        private readonly _labelCreateRoom       : GameUi.UiLabel;
        private readonly _labelChooseMap        : GameUi.UiLabel;
        private readonly _labelRoomSettings     : GameUi.UiLabel;

        private readonly _groupSettings         : eui.Group;
        private readonly _groupChooseCo         : eui.Group;
        private readonly _labelChooseCo         : GameUi.UiLabel;
        private readonly _btnChooseCo           : GameUi.UiButton;

        private readonly _groupChoosePlayerIndex: eui.Group;
        private readonly _labelChoosePlayerIndex: GameUi.UiLabel;
        private readonly _sclPlayerIndex        : GameUi.UiScrollList<DataForPlayerIndexRenderer>;

        private readonly _groupChooseSkinId     : eui.Group;
        private readonly _labelChooseSkinId     : GameUi.UiLabel;
        private readonly _sclSkinId             : GameUi.UiScrollList<DataForSkinIdRenderer>;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : GameUi.UiTab<DataForTabItemRenderer, void>;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnConfirm            : GameUi.UiButton;

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
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.McrCreateSelfCoIdChanged,   callback: this._onNotifyMcrCreateSelfCoIdChanged },
                { type: Notify.Type.MsgMcrCreateRoom,           callback: this._onNotifyMsgMcrCreateRoom },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._sclPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._sclSkinId.setItemRenderer(SkinIdRenderer);

            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : McrCreateBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : McrCreateAdvancedSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0298) },
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
            const data = McrModel.Create.getData();
            McrProxy.reqCreateRoom(data);

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }
        private _onTouchedBtnChooseCo(e: egret.TouchEvent): void {
            McrCreateChooseCoPanel.show({ coId: McrModel.Create.getSelfCoId() });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMcrCreateSelfCoIdChanged(e: egret.Event): void {
            this._updateBtnChooseCo();
        }
        private _onNotifyMsgMcrCreateRoom(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0015));
            Utility.FlowManager.gotoLobby();
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
            this._labelCreateRoom.text          = Lang.getText(Lang.Type.B0000);
            this._labelMultiPlayer.text         = Lang.getText(Lang.Type.B0137);
            this._labelChooseMap.text           = Lang.getText(Lang.Type.B0227);
            this._labelRoomSettings.text        = Lang.getText(Lang.Type.B0571);
            this._labelChooseCo.text            = Lang.getText(Lang.Type.B0145);
            this._labelChoosePlayerIndex.text   = Lang.getText(Lang.Type.B0572);
            this._labelChooseSkinId.text        = Lang.getText(Lang.Type.B0573);
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
        }

        private _updateBtnChooseCo(): void {
            const cfg               = ConfigManager.getCoBasicCfg(McrModel.Create.getData().settingsForCommon.configVersion, McrModel.Create.getSelfCoId());
            this._btnChooseCo.label = cfg.name;
        }

        private async _initSclPlayerIndex(): Promise<void> {
            const playersCountUnneutral = (await McrModel.Create.getMapRawData()).playersCountUnneutral;
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
    }
    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }

    type DataForPlayerIndexRenderer = {
        playerIndex: number;
    }
    class PlayerIndexRenderer extends GameUi.UiListItemRenderer<DataForPlayerIndexRenderer> {
        private readonly _labelName : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.McrCreateTeamIndexChanged,          callback: this._onNotifyMcrCreateTeamIndexChanged },
                { type: Notify.Type.McrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMcrCreateSelfPlayerIndexChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateLabelName();
            this._updateState();
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data = this.data;
            if (data) {
                const creator       = McrModel.Create;
                const playerIndex   = data.playerIndex;
                creator.setSelfPlayerIndex(playerIndex);

                const availableCoIdArray = BwWarRuleHelper.getAvailableCoIdArrayForPlayer(creator.getWarRule(), playerIndex, ConfigManager.getLatestFormalVersion());
                if (availableCoIdArray.indexOf(creator.getSelfCoId()) < 0) {
                    creator.setSelfCoId(BwWarRuleHelper.getRandomCoIdWithCoIdList(availableCoIdArray));
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
                this._labelName.text    = `P${playerIndex} (${Lang.getPlayerTeamName(BwWarRuleHelper.getTeamIndex(McrModel.Create.getWarRule(), playerIndex))})`;
            }
        }
        private _updateState(): void {
            const data          = this.data;
            this.currentState   = ((data) && (data.playerIndex === McrModel.Create.getSelfPlayerIndex())) ? `down` : `up`;
        }
    }

    type DataForSkinIdRenderer = {
        skinId: number;
    }
    class SkinIdRenderer extends GameUi.UiListItemRenderer<DataForSkinIdRenderer> {
        private readonly _imgColor  : GameUi.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.McrCreateSelfSkinIdChanged, callback: this._onNotifyMcrCreateSelfSkinIdChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data = this.data;
            if (data) {
                McrModel.Create.setSelfUnitAndTileSkinId(data.skinId);
            }
        }
        private _onNotifyMcrCreateSelfSkinIdChanged(e: egret.Event): void {
            this._updateImgColor();
        }

        private _updateImgColor(): void {
            const data = this.data;
            if (data) {
                const skinId            = data.skinId;
                this._imgColor.source   = BwHelpers.getImageSourceForSkinId(skinId, McrModel.Create.getSelfUnitAndTileSkinId() === skinId);
            }
        }
    }
}
