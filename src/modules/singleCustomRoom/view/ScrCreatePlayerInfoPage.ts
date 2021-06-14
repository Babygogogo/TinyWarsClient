
namespace TinyWars.SingleCustomRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = Utility.CommonConstants;
    import BwHelpers        = BaseWar.BwHelpers;

    export class ScrCreatePlayerInfoPage extends GameUi.UiTabPage<void> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreatePlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForPlayerInfo();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
        }
        private async _updateComponentsForPlayerInfo(): Promise<void> {
            const mapRawData    = await ScrModel.Create.getMapRawData();
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(mapRawData.playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
            const dataList: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataList.push({
                    playerIndex,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        playerIndex     : number;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo               : eui.Group;
        private readonly _imgSkin               : GameUi.UiImage;
        private readonly _imgCoInfo             : GameUi.UiImage;
        private readonly _imgCoHead             : GameUi.UiImage;
        private readonly _labelCo               : GameUi.UiLabel;
        private readonly _labelPlayerType       : GameUi.UiLabel;

        private readonly _labelPlayerIndex      : GameUi.UiLabel;
        private readonly _labelTeamIndex        : GameUi.UiLabel;

        private readonly _btnChangeCo           : GameUi.UiButton;
        private readonly _btnChangeController   : GameUi.UiButton;
        private readonly _btnChangeSkinId       : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,                callback: this._onTouchedGroupCo },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
                { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
                { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.ScrCreatePlayerInfoChanged,     callback: this._onNotifyScrCreatePlayerInfoChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
            const playerData    = this._getPlayerData();
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                Common.CommonCoInfoPanel.show({
                    configVersion   : ScrModel.Create.getConfigVersion(),
                    coId,
                });
            }
        }

        private async _onTouchedBtnChangeController(e: egret.TouchEvent): Promise<void> {
            ScrModel.Create.tickUserId(this.data.playerIndex);
        }

        private async _onTouchedBtnChangeSkinId(e: egret.TouchEvent): Promise<void> {
            ScrModel.Create.tickUnitAndTileSkinId(this.data.playerIndex);
        }

        private async _onTouchedBtnChangeCo(e: egret.TouchEvent): Promise<void> {
            ScrCreateChooseCoPanel.show({ playerIndex: this.data.playerIndex });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyScrCreatePlayerInfoChanged(e: egret.Event): void {
            const eventData = e.data as Notify.Data.ScrCreatePlayerInfoChanged;
            if (eventData.playerIndex === this.data.playerIndex) {
                this._updateComponentsForSettings();
            }
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
        }

        private _updateComponentsForLanguage(): void {
            this._btnChangeCo.label         = Lang.getText(Lang.Type.B0230);
            this._btnChangeController.label = Lang.getText(Lang.Type.B0608);
            this._btnChangeSkinId.label     = Lang.getText(Lang.Type.B0609);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const roomInfo  = ScrModel.Create.getData();
            if (!roomInfo) {
                return;
            }

            const playerIndex           = this.data.playerIndex;
            const settingsForCommon     = roomInfo.settingsForCommon;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(BwHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

            const playerData            = this._getPlayerData();
            this._imgSkin.source        = getSourceForImgSkin(playerData ? playerData.unitAndTileSkinId : null);
            this._labelPlayerType.text  = playerData.userId == null
                ? Lang.getText(Lang.Type.B0607)
                : Lang.getText(Lang.Type.B0031);

            const coId                  = playerData ? playerData.coId : null;
            const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
        }

        private _getPlayerData(): ProtoTypes.Structure.IDataForPlayerInRoom {
            return ScrModel.Create.getPlayerInfo(this.data.playerIndex);
        }
    }

    function getSourceForImgSkin(skinId: number): string {
        switch (skinId) {
            case 1  : return `commonRectangle0002`;
            case 2  : return `commonRectangle0003`;
            case 3  : return `commonRectangle0004`;
            case 4  : return `commonRectangle0005`;
            default : return `commonRectangle0006`;
        }
    }
}
