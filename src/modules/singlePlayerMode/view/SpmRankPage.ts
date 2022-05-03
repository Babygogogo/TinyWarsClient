
// import CommonModel              from "../../common/model/CommonModel";
// import CommonProxy              from "../../common/model/CommonProxy";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import TwnsUserPanel            from "../../user/view/UserPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerMode {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = Twns.Notify.NotifyType;

    export type OpenDataForSpmRankPage = {
        mapId   : number | null;
    };
    export class SpmRankPage extends TwnsUiTabPage.UiTabPage<OpenDataForSpmRankPage> {
        private readonly _listRule! : TwnsUiScrollList.UiScrollList<DataForRuleRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerMode/SpmRankPage.exml";
        }

        protected _onOpened(): void {
            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listRule.setItemRenderer(RuleRenderer);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateListRule();
        }

        private async _updateListRule(): Promise<void> {
            const mapId     = this._getOpenData().mapId;
            const listRule  = this._listRule;
            if (mapId == null) {
                listRule.clear();
                return;
            }

            const mapRawData    = await Twns.WarMap.WarMapModel.getRawData(mapId);
            const dataArray     : DataForRuleRenderer[] = [];
            for (const templateWarRule of mapRawData?.templateWarRuleArray?.filter(v => v.ruleAvailability?.canSrw) ?? []) {
                dataArray.push({
                    mapId,
                    ruleId  : Twns.Helpers.getExisted(templateWarRule.ruleId),
                });
            }
            listRule.bindData(dataArray.sort((v1, v2) => v1.ruleId - v2.ruleId));
        }
    }

    type DataForRuleRenderer = {
        mapId   : number;
        ruleId  : number;
    };
    class RuleRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRuleRenderer> {
        private readonly _labelMyScoreTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelMyScore!         : TwnsUiLabel.UiLabel;

        private readonly _labelStdTitle!        : TwnsUiLabel.UiLabel;
        private readonly _labelStdNoData!       : TwnsUiLabel.UiLabel;
        private readonly _labelStdNickname!     : TwnsUiLabel.UiLabel;
        private readonly _labelStdScore!        : TwnsUiLabel.UiLabel;
        private readonly _listStd!              : TwnsUiScrollList.UiScrollList<DataForUserRenderer>;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ]);

            this._listStd.setItemRenderer(UserRenderer);
            this._setShortSfxCode(Twns.Types.ShortSfxCode.None);
        }
        protected async _onDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForStd();
        }

        private _updateComponentsForLanguage(): void {
            this._labelMyScoreTitle.text    = `${Lang.getText(LangTextType.B0822)}:`;
            this._labelStdNoData.text       = Lang.getText(LangTextType.B0278);
            this._labelStdNickname.text     = Lang.getText(LangTextType.B0175);
            this._labelStdScore.text        = Lang.getText(LangTextType.B0579);
        }

        private async _updateComponentsForStd(): Promise<void> {
            const data          = this._getData();
            const ruleId        = data.ruleId;
            const mapId         = data.mapId;
            const configVersion = Twns.Helpers.getExisted(Twns.Config.ConfigManager.getLatestConfigVersion());
            const selfInfo      = Twns.User.UserModel.getSelfInfo()?.userComplexInfo;
            const selfScore     = selfInfo?.userWarStatistics?.spwArray?.find(v => (v.mapId === mapId) && (v.configVersion === configVersion) && (v.ruleId === ruleId))?.highScore ?? Number.MIN_SAFE_INTEGER;
            const selfPrivilege = selfInfo?.userPrivilege;
            const hasPrivilege  = selfPrivilege?.isAdmin ?? selfPrivilege?.isMapCommittee ?? false;
            const dataArray     : DataForUserRenderer[] = [];

            for (const rankData of (await Twns.SinglePlayerMode.SpmModel.getRankData(mapId))?.find(v => v.ruleId === ruleId)?.infoArray ?? []) {
                const score = Twns.Helpers.getExisted(rankData.score);
                dataArray.push({
                    index       : 0,
                    rankId      : Twns.Helpers.getExisted(rankData.rankId),
                    rank        : 0,
                    userId      : Twns.Helpers.getExisted(rankData.userId),
                    score,
                    canReplay   : (hasPrivilege) || (selfScore >= score),
                    isLast      : false,
                });
            }

            const length = dataArray.length;
            if (length) {
                dataArray.sort((v1, v2) => v2.score - v1.score);

                dataArray[0].rank   = 1;
                dataArray[0].index  = 1;
                for (let i = 1; i < length; ++i) {
                    const currentData   = dataArray[i];
                    const previousData  = dataArray[i - 1];
                    currentData.rank    = currentData.score === previousData.score ? previousData.rank : i + 1;
                    currentData.index   = i + 1;
                }

                dataArray[length - 1].isLast = true;
            }

            this._labelStdTitle.text        = `#${ruleId}`;
            this._labelStdNoData.visible    = !length;
            this._listStd.bindData(dataArray);

            const myScore       = Twns.User.UserModel.getSelfInfo()?.userComplexInfo?.userWarStatistics?.spwArray?.find(v => (v.mapId === mapId) && (v.configVersion === configVersion) && (v.ruleId === ruleId))?.highScore;
            const labelMyScore  = this._labelMyScore;
            if (myScore == null) {
                labelMyScore.text = `--`;
            } else {
                const rank          = dataArray.find(v => v.score === myScore)?.rank;
                labelMyScore.text   = rank == null ? `${myScore} (--)` : `${myScore} (${rank}${Twns.Helpers.getSuffixForRank(rank)})`;
            }
        }
    }

    type DataForUserRenderer = {
        index       : number;
        rankId      : number;
        rank        : number;
        userId      : number;
        score       : number;
        canReplay   : boolean;
        isLast      : boolean;
    };
    class UserRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _imgBottomLine!    : TwnsUiImage.UiImage;
        private readonly _labelIndex!       : TwnsUiLabel.UiLabel;
        private readonly _labelNickname!    : TwnsUiLabel.UiLabel;

        private readonly _groupScore!       : eui.Group;
        private readonly _labelScore!       : TwnsUiLabel.UiLabel;
        private readonly _imgReplay!        : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgBg,          callback: this._onTouchedImgBg },
                { ui: this._groupScore,     callback: this._onTouchedGroupScore },
            ]);
            this._imgBg.touchEnabled = true;
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(): void {
            const data = this.data;
            if (data) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserPanel, { userId: data.userId });
            }
        }
        private async _onTouchedGroupScore(): Promise<void> {
            const data = this._getData();
            if (!data.canReplay) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserPanel, { userId: data.userId });
            } else {
                const replayData = await Twns.SinglePlayerMode.SpmModel.getReplayData(data.rankId);
                (replayData) && (Twns.FlowManager.gotoReplayWar(replayData, -1));
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const data                  = this._getData();
            const rank                  = data.rank;
            const labelNickname         = this._labelNickname;
            labelNickname.text          = Lang.getText(LangTextType.B0029);
            this._labelIndex.text       = `${rank}${Twns.Helpers.getSuffixForRank(rank)}`;
            this._labelScore.text       = `${data.score}`;
            this._imgBg.alpha           = data.index % 2 == 1 ? 0.2 : 0.5;
            this._imgBottomLine.visible = data.isLast;
            this._imgReplay.visible     = data.canReplay;

            const userInfo = Twns.Helpers.getExisted(await Twns.User.UserModel.getUserPublicInfo(data.userId));
            labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;

        }
    }
}

// export default TwnsSpmRankPage;
