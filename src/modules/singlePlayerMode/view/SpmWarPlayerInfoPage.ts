
import TwnsCommonCoInfoPanel    from "../../common/view/CommonCoInfoPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import SpmModel                 from "../model/SpmModel";

namespace TwnsSpmWarPlayerInfoPage {
    import CommonCoInfoPanel    = TwnsCommonCoInfoPanel.CommonCoInfoPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenDataForSpmWarPlayerInfoPage = {
        slotIndex   : number;
    };
    export class SpmWarPlayerInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForSpmWarPlayerInfoPage> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerMode/SpmWarPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
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
            // nothing to do
        }
        private _updateComponentsForPlayerInfo(): void {
            this._listPlayer.bindData(this._createDataForListPlayer());
        }

        private _createDataForListPlayer(): DataForPlayerRenderer[] {
            const slotIndex             = this._getOpenData().slotIndex;
            const slotData              = SpmModel.getSlotDict().get(slotIndex);
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
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo               : eui.Group;
        private readonly _imgSkin               : TwnsUiImage.UiImage;
        private readonly _imgCoHead             : TwnsUiImage.UiImage;
        private readonly _imgCoInfo             : TwnsUiImage.UiImage;
        private readonly _labelCo               : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerType       : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex      : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex        : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
            const playerData    = this._getPlayerData();
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                CommonCoInfoPanel.show({
                    configVersion   : SpmModel.getSlotDict().get(this.data.slotIndex).warData.settingsForCommon.configVersion,
                    coId,
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const data      = this.data;
            const slotData  = SpmModel.getSlotDict().get(data.slotIndex);
            if (!slotData) {
                return;
            }

            const playerIndex           = this.data.playerIndex;
            const settingsForCommon     = slotData.warData.settingsForCommon;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(WarCommonHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

            const playerData            = this._getPlayerData();
            this._imgSkin.source        = getSourceForImgSkin(playerData ? playerData.unitAndTileSkinId : null);
            this._labelPlayerType.text  = playerData.userId == null
                ? Lang.getText(LangTextType.B0607)
                : Lang.getText(LangTextType.B0031);

            const coId                  = playerData ? playerData.coId : null;
            const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
            this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
        }

        private _getPlayerData(): ProtoTypes.WarSerialization.ISerialPlayer {
            const data      = this.data;
            const slotData  = SpmModel.getSlotDict().get(data.slotIndex);
            return slotData ? slotData.warData.playerManager.players.find(v => v.playerIndex === data.playerIndex) : null;
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

export default TwnsSpmWarPlayerInfoPage;
