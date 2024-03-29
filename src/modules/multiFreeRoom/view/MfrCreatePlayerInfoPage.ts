
// import TwnsCommonCoInfoPanel    from "../../common/view/CommonCoInfoPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import UserModel                from "../../user/model/UserModel";
// import MfrCreateModel           from "../model/MfrCreateModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiFreeRoom {
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;

    export class MfrCreatePlayerInfoPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _groupInfo!    : eui.Group;
        private readonly _listPlayer!   : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrCreatePlayerInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForRoomInfo();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
        }
        private _updateComponentsForRoomInfo(): void {
            const dataArray         : DataForPlayerRenderer[] = [];
            const maxPlayerIndex    = Helpers.getExisted(MultiFreeRoom.MfrCreateModel.getInitialWarData().playerManager?.players).length - 1;
            for (let playerIndex = CommonConstants.PlayerIndex.First; playerIndex <= maxPlayerIndex; ++playerIndex) {
                dataArray.push({
                    playerIndex,
                });
            }
            this._listPlayer.bindData(dataArray);
        }
    }

    type DataForPlayerRenderer = {
        playerIndex     : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo!              : eui.Group;
        private readonly _imgSkin!              : TwnsUiImage.UiImage;
        private readonly _imgCoHead!            : TwnsUiImage.UiImage;
        private readonly _imgCoInfo!            : TwnsUiImage.UiImage;
        private readonly _labelNickname!        : TwnsUiLabel.UiLabel;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex!     : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex!       : TwnsUiLabel.UiLabel;
        private readonly _labelRankStdTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelRankStd!         : TwnsUiLabel.UiLabel;
        private readonly _labelRankFogTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelRankFog!         : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MfrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(): Promise<void> {
            const playerIndex       = this._getData().playerIndex;
            const initialWarData    = MultiFreeRoom.MfrCreateModel.getInitialWarData();
            const coId              = initialWarData.playerManager?.players?.find(v => v.playerIndex === playerIndex)?.coId;
            if ((coId != null) && (coId !== CommonConstants.CoId.Empty)) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonCoInfoPanel, {
                    gameConfig   : await Config.ConfigManager.getGameConfig(Helpers.getExisted(initialWarData.settingsForCommon?.configVersion)),
                    coId,
                });
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
            this._updateComponentsForSettings();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
        }

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(LangTextType.B0546);
            this._labelRankFogTitle.text    = Lang.getText(LangTextType.B0547);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const playerIndex           = this._getData().playerIndex;
            const initialWarData        = MultiFreeRoom.MfrCreateModel.getInitialWarData();
            const settingsForCommon     = Helpers.getExisted(initialWarData.settingsForCommon);
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(WarHelpers.WarRuleHelpers.getTeamIndex(Helpers.getExisted(settingsForCommon.instanceWarRule), playerIndex)) || CommonConstants.ErrorTextForUndefined;

            const playerData            = Helpers.getExisted(initialWarData.playerManager?.players?.find(v => v.playerIndex === playerIndex));
            this._imgSkin.source        = WarHelpers.WarCommonHelpers.getImageSourceForCoHeadFrame(playerData.unitAndTileSkinId);

            const coId                  = Helpers.getExisted(playerData.coId);
            const gameConfig            = await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion));
            const coCfg                 = gameConfig.getCoBasicCfg(coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = gameConfig.getCoHeadImageSource(coId) ?? CommonConstants.ErrorTextForUndefined;
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoId.Empty) && (!!coCfg);

            const selfUserId            = Helpers.getExisted(User.UserModel.getSelfUserId());
            const userInfo              = MultiFreeRoom.MfrCreateModel.getSelfPlayerIndex() === playerIndex ? await User.UserModel.getUserPublicInfo(selfUserId) : null;
            const labelNickname         = this._labelNickname;
            const labelRankStd          = this._labelRankStd;
            const labelRankFog          = this._labelRankFog;
            if (userInfo == null) {
                labelNickname.text  = playerData.userId == null ? Lang.getText(LangTextType.B0607) : `??`;
                labelRankStd.text   = `??`;
                labelRankFog.text   = `??`;
            } else {
                labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;

                const rankScoreArray    = userInfo.userMrwRankInfoArray;
                const stdRankInfo       = rankScoreArray?.find(v => v.warType === Types.WarType.MrwStd);
                const fogRankInfo       = rankScoreArray?.find(v => v.warType === Types.WarType.MrwFog);
                const stdRankIndex      = await Leaderboard.LeaderboardModel.getMrwRankIndex(Types.WarType.MrwStd, selfUserId);
                const fogRankIndex      = await Leaderboard.LeaderboardModel.getMrwRankIndex(Types.WarType.MrwFog, selfUserId);
                labelRankStd.text       = stdRankInfo
                    ? `${stdRankInfo?.currentScore ?? CommonConstants.RankInitialScore} (${stdRankIndex == null ? `--` : `${stdRankIndex}${Helpers.getSuffixForRankIndex(stdRankIndex)}`})`
                    : `??`;
                labelRankFog.text       = fogRankInfo
                    ? `${fogRankInfo?.currentScore ?? CommonConstants.RankInitialScore} (${fogRankIndex == null ? `--` : `${fogRankIndex}${Helpers.getSuffixForRankIndex(fogRankIndex)}`})`
                    : `??`;
            }
        }
    }
}

// export default TwnsMfrCreatePlayerInfoPage;
