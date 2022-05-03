
// import TwnsCommonChooseCoPanel      from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonCoInfoPanel        from "../../common/view/CommonCoInfoPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import ConfigManager                from "../../tools/helpers/ConfigManager";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import NotifyData                   from "../../tools/notify/NotifyData";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage                from "../../tools/ui/UiTabPage";
// import WarRuleHelpers               from "../../tools/warHelpers/WarRuleHelpers";
// import ScrCreateModel               from "../model/ScrCreateModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleCustomRoom {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;
    import GameConfig               = Config.GameConfig;

    export class ScrCreatePlayerInfoPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _groupInfo!    : eui.Group;
        private readonly _listPlayer!   : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreatePlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForPlayerInfo();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
        }
        private async _updateComponentsForPlayerInfo(): Promise<void> {
            const mapRawData    = await Twns.SingleCustomRoom.ScrCreateModel.getMapRawData();
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(Twns.Helpers.getExisted(mapRawData.playersCountUnneutral)));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
            const dataList      : DataForPlayerRenderer[] = [];
            const gameConfig    = Twns.SingleCustomRoom.ScrCreateModel.getGameConfig();
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataList.push({
                    gameConfig,
                    playerIndex,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        gameConfig      : GameConfig;
        playerIndex     : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo!              : eui.Group;
        private readonly _imgSkin!              : TwnsUiImage.UiImage;
        private readonly _imgCoInfo!            : TwnsUiImage.UiImage;
        private readonly _imgCoHead!            : TwnsUiImage.UiImage;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerType!      : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex!     : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex!       : TwnsUiLabel.UiLabel;

        private readonly _btnChangeCo!          : TwnsUiButton.UiButton;
        private readonly _btnChangeController!  : TwnsUiButton.UiButton;
        private readonly _btnChangeSkinId!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,                callback: this._onTouchedGroupCo },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
                { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
                { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.ScrCreatePlayerInfoChanged,     callback: this._onNotifyScrCreatePlayerInfoChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupCo(): void {
            const playerData    = this._getPlayerData();
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonCoInfoPanel, {
                    gameConfig  : Twns.SingleCustomRoom.ScrCreateModel.getGameConfig(),
                    coId,
                });
            }
        }

        private async _onTouchedBtnChangeController(): Promise<void> {
            Twns.SingleCustomRoom.ScrCreateModel.tickUserId(this._getData().playerIndex);
        }

        private async _onTouchedBtnChangeSkinId(): Promise<void> {
            Twns.SingleCustomRoom.ScrCreateModel.tickUnitAndTileSkinId(this._getData().playerIndex);
        }

        private async _onTouchedBtnChangeCo(): Promise<void> {
            const roomInfo  = Twns.SingleCustomRoom.ScrCreateModel.getData();
            if (!roomInfo) {
                return;
            }

            const data          = this._getData();
            const playerIndex   = data.playerIndex;
            const currentCoId   = Twns.SingleCustomRoom.ScrCreateModel.getCoId(playerIndex);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseCoPanel, {
                gameConfig          : data.gameConfig,
                currentCoId,
                availableCoIdArray  : WarHelpers.WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                    baseWarRule         : Twns.SingleCustomRoom.ScrCreateModel.getInstanceWarRule(),
                    playerIndex,
                    gameConfig      : await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(roomInfo.settingsForCommon?.configVersion)),
                }),
                callbackOnConfirm   : (newCoId) => {
                    if (newCoId !== currentCoId) {
                        Twns.SingleCustomRoom.ScrCreateModel.setCoId(playerIndex, newCoId);
                    }
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyScrCreatePlayerInfoChanged(e: egret.Event): void {
            const eventData = e.data as Notify.NotifyData.ScrCreatePlayerInfoChanged;
            if (eventData.playerIndex === this._getData().playerIndex) {
                this._updateComponentsForSettings();
            }
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
        }

        private _updateComponentsForLanguage(): void {
            this._btnChangeCo.label         = Lang.getText(LangTextType.B0230);
            this._btnChangeController.label = Lang.getText(LangTextType.B0608);
            this._btnChangeSkinId.label     = Lang.getText(LangTextType.B0609);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const roomInfo  = Twns.SingleCustomRoom.ScrCreateModel.getData();
            if (!roomInfo) {
                return;
            }

            const playerIndex           = this._getData().playerIndex;
            const settingsForCommon     = Twns.Helpers.getExisted(roomInfo.settingsForCommon);
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(WarHelpers.WarRuleHelpers.getTeamIndex(Twns.Helpers.getExisted(settingsForCommon.instanceWarRule), playerIndex)) || CommonConstants.ErrorTextForUndefined;

            const playerData            = this._getPlayerData();
            this._imgSkin.source        = WarHelpers.WarCommonHelpers.getImageSourceForCoHeadFrame(Twns.Helpers.getExisted(playerData.unitAndTileSkinId));
            this._labelPlayerType.text  = playerData.userId == null
                ? Lang.getText(LangTextType.B0607)
                : Lang.getText(LangTextType.B0031);

            const coId                  = Twns.Helpers.getExisted(playerData.coId);
            const gameConfig            = await Config.ConfigManager.getGameConfig(Twns.Helpers.getExisted(settingsForCommon.configVersion));
            const coCfg                 = gameConfig.getCoBasicCfg(coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = gameConfig.getCoHeadImageSource(coId) ?? CommonConstants.ErrorTextForUndefined;
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
        }

        private _getPlayerData(): CommonProto.Structure.IDataForPlayerInRoom {
            return Twns.SingleCustomRoom.ScrCreateModel.getPlayerInfo(this._getData().playerIndex);
        }
    }
}

// export default TwnsScrCreatePlayerInfoPage;
