
// import CommonModel              from "../../common/model/CommonModel";
// import CommonProxy              from "../../common/model/CommonProxy";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import TwnsUserPanel            from "../../user/view/UserPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsSpmRankPage {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;

    export type OpenData = {
        mapId   : number;
    };
    export class SpmRankPage extends TwnsUiTabPage.UiTabPage<OpenData> {
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
            const mapId         = this._getOpenData().mapId;
            const mapRawData    = await WarMapModel.getRawData(mapId);
            const dataArray     : DataForRuleRenderer[] = [];
            for (const rule of mapRawData?.warRuleArray?.filter(v => v.ruleAvailability?.canSrw) ?? []) {
                dataArray.push({
                    mapId,
                    ruleId  : Helpers.getExisted(rule.ruleId),
                });
            }
            this._listRule.bindData(dataArray.sort((v1, v2) => v1.ruleId - v2.ruleId));
        }
    }

    type DataForRuleRenderer = {
        mapId   : number;
        ruleId  : number;
    };
    class RuleRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRuleRenderer> {
        private readonly _labelStdTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelStdNoData!   : TwnsUiLabel.UiLabel;
        private readonly _labelStdNickname! : TwnsUiLabel.UiLabel;
        private readonly _labelStdScore!    : TwnsUiLabel.UiLabel;
        private readonly _listStd!          : TwnsUiScrollList.UiScrollList<DataForUserRenderer>;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ]);

            this._listStd.setItemRenderer(UserRenderer);
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
            this._labelStdNoData.text   = Lang.getText(LangTextType.B0278);
            this._labelStdNickname.text = Lang.getText(LangTextType.B0175);
            this._labelStdScore.text    = Lang.getText(LangTextType.B0579);
        }

        private async _updateComponentsForStd(): Promise<void> {
            const data      = this._getData();
            const ruleId    = data.ruleId;
            const dataArray : DataForUserRenderer[] = [];
            for (const rankData of (await SpmModel.getRankData(data.mapId)).find(v => v.ruleId === ruleId)?.infoArray ?? []) {
                dataArray.push({
                    rank    : 0,
                    userId  : Helpers.getExisted(rankData.userId),
                    score   : Helpers.getExisted(rankData.score),
                    isLast  : false,
                });
            }

            const length = dataArray.length;
            if (length) {
                dataArray.sort((v1, v2) => v2.score - v1.score);
                for (let i = 0; i < length; ++i) {
                    dataArray[i].rank = i + 1;
                }
                dataArray[length - 1].isLast = true;
            }

            this._labelStdTitle.text        = `#${ruleId}`;
            this._labelStdNoData.visible    = !length;
            this._listStd.bindData(dataArray);
        }
    }

    type DataForUserRenderer = {
        rank    : number;
        userId  : number;
        score   : number;
        isLast  : boolean;
    };
    class UserRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _imgBottomLine!    : TwnsUiImage.UiImage;
        private readonly _labelIndex!       : TwnsUiLabel.UiLabel;
        private readonly _labelNickname!    : TwnsUiLabel.UiLabel;
        private readonly _labelScore!       : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgBg, callback: this._onTouchedImgBg },
            ]);
            this._imgBg.touchEnabled = true;
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(): void {
            const data = this.data;
            if (data) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.UserPanel, { userId: data.userId });
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
            this._labelIndex.text       = `${rank}${Helpers.getSuffixForRank(rank)}`;
            this._labelScore.text       = `${data.score}`;
            this._imgBg.alpha           = rank % 2 == 1 ? 0.2 : 0.5;
            this._imgBottomLine.visible = data.isLast;

            const userInfo = Helpers.getExisted(await UserModel.getUserPublicInfo(data.userId));
            labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsSpmRankPage;