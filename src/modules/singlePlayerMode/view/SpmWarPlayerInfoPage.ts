
namespace TinyWars.SinglePlayerMode {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = Utility.CommonConstants;
    import BwHelpers        = BaseWar.BwHelpers;

    export type OpenDataForSpmWarPlayerInfoPage = {
        slotIndex   : number;
    }
    export class SpmWarPlayerInfoPage extends GameUi.UiTabPage<OpenDataForSpmWarPlayerInfoPage> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerMode/SpmWarPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
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
        private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
            this._updateComponentsForPlayerInfo();
        }

        private _updateComponentsForLanguage(): void {
        }
        private _updateComponentsForPlayerInfo(): void {
            this._listPlayer.bindData(this._createDataForListPlayer());
        }

        private _createDataForListPlayer(): DataForPlayerRenderer[] {
            const slotIndex             = this._getOpenData().slotIndex;
            const slotData              = SpmModel.SaveSlot.getSlotDict().get(slotIndex);
            const playersCountUnneutral = slotData ? slotData.warData.playerManager.players.length - 1 : null;
            const dataList              : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataList.push({
                    slotIndex,
                    playerIndex,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        slotIndex   : number;
        playerIndex : number;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo               : eui.Group;
        private readonly _imgSkin               : GameUi.UiImage;
        private readonly _imgCoInfo             : GameUi.UiImage;
        private readonly _labelCo               : GameUi.UiLabel;
        private readonly _labelPlayerType       : GameUi.UiLabel;

        private readonly _labelPlayerIndex      : GameUi.UiLabel;
        private readonly _labelTeamIndex        : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
            const playerData    = this._getPlayerData();
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                Common.CommonCoInfoPanel.show({
                    configVersion   : SpmModel.SaveSlot.getSlotDict().get(this.data.slotIndex).warData.settingsForCommon.configVersion,
                    coId,
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateComponentsForSettings();
        }

        private _updateComponentsForLanguage(): void {
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const data      = this.data;
            const slotData  = SpmModel.SaveSlot.getSlotDict().get(data.slotIndex);
            if (!slotData) {
                return;
            }

            const playerIndex           = this.data.playerIndex;
            const settingsForCommon     = slotData.warData.settingsForCommon;
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
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
        }

        private _getPlayerData(): ProtoTypes.WarSerialization.ISerialPlayer {
            const data      = this.data;
            const slotData  = SpmModel.SaveSlot.getSlotDict().get(data.slotIndex);
            return slotData ? slotData.warData.playerManager.players.find(v => v.playerIndex === data.playerIndex) : null
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
