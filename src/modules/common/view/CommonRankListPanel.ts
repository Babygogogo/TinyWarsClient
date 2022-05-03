
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
namespace Twns.Common {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = Twns.Notify.NotifyType;

    export type OpenDataForCommonRankListPanel = void;
    export class CommonRankListPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonRankListPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _labelStdTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelStdNoData!   : TwnsUiLabel.UiLabel;
        private readonly _labelStdNickname! : TwnsUiLabel.UiLabel;
        private readonly _labelStdScore!    : TwnsUiLabel.UiLabel;
        private readonly _listStd!          : TwnsUiScrollList.UiScrollList<DataForMrwUserRenderer>;

        private readonly _labelFogTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelFogNoData!   : TwnsUiLabel.UiLabel;
        private readonly _labelFogNickname! : TwnsUiLabel.UiLabel;
        private readonly _labelFogScore!    : TwnsUiLabel.UiLabel;
        private readonly _listFog!          : TwnsUiScrollList.UiScrollList<DataForMrwUserRenderer>;

        private readonly _labelSpmTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelSpmNoData!   : TwnsUiLabel.UiLabel;
        private readonly _labelSpmNickname! : TwnsUiLabel.UiLabel;
        private readonly _labelSpmScore!    : TwnsUiLabel.UiLabel;
        private readonly _listSpm!          : TwnsUiScrollList.UiScrollList<DataForSpmUserRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listStd.setItemRenderer(MrwUserRenderer);
            this._listFog.setItemRenderer(MrwUserRenderer);
            this._listSpm.setItemRenderer(SpmUserRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            Twns.Common.CommonProxy.reqGetRankList();

            this._updateView();
            this._updateComponentsForLanguage();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgCommonGetRankList(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForStd();
            this._updateComponentsForFog();
            this._updateComponentsForSpm();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0436);
            this._labelStdTitle.text    = Lang.getText(LangTextType.B0548);
            this._labelStdNoData.text   = Lang.getText(LangTextType.B0278);
            this._labelStdNickname.text = Lang.getText(LangTextType.B0175);
            this._labelStdScore.text    = Lang.getText(LangTextType.B0579);
            this._labelFogTitle.text    = Lang.getText(LangTextType.B0549);
            this._labelFogNoData.text   = Lang.getText(LangTextType.B0278);
            this._labelFogNickname.text = Lang.getText(LangTextType.B0175);
            this._labelFogScore.text    = Lang.getText(LangTextType.B0579);
            this._labelSpmTitle.text    = Lang.getText(LangTextType.B0818);
            this._labelSpmNoData.text   = Lang.getText(LangTextType.B0278);
            this._labelSpmNickname.text = Lang.getText(LangTextType.B0175);
            this._labelSpmScore.text    = Lang.getText(LangTextType.B0579);
        }

        private _updateComponentsForStd(): void {
            const playersCount  = 2;
            const warType       = Types.WarType.MrwStd;
            const dataList      : DataForMrwUserRenderer[] = [];
            for (const data of Twns.Common.CommonModel.getMrwRankList() || []) {
                if ((data.playersCountUnneutral === playersCount) && (data.warType === warType)) {
                    const userId = data.userId;
                    if (userId == null) {
                        throw Helpers.newError(`CommonRankListPanel._updateComponentsForStd() empty userId.`);
                    }

                    dataList.push({
                        rank    : dataList.length + 1,
                        userId,
                        warType,
                        playersCount,
                    });
                }
            }

            this._labelStdNoData.visible = !dataList.length;
            this._listStd.bindData(dataList);
        }

        private _updateComponentsForFog(): void {
            const playersCount  = 2;
            const warType       = Types.WarType.MrwFog;
            const dataList      : DataForMrwUserRenderer[] = [];
            for (const data of Twns.Common.CommonModel.getMrwRankList() || []) {
                if ((data.playersCountUnneutral === playersCount) && (data.warType === warType)) {
                    const userId = data.userId;
                    if (userId == null) {
                        throw Helpers.newError(`CommonRankListPanel._updateComponentsForFog() empty userId.`);
                    }

                    dataList.push({
                        rank    : dataList.length + 1,
                        userId,
                        warType,
                        playersCount,
                    });
                }
            }

            this._labelFogNoData.visible = !dataList.length;
            this._listFog.bindData(dataList);
        }

        private async _updateComponentsForSpm(): Promise<void> {
            const dataArray: DataForSpmUserRenderer[] = [];
            for (const data of await Twns.Leaderboard.LeaderboardModel.getSpmOverallTopDataArray() ?? []) {
                const length    = dataArray.length;
                const score     = Helpers.getExisted(data.score);
                dataArray.push({
                    index   : length + 1,
                    userId  : Helpers.getExisted(data.userId),
                    score,
                    rank    : length === 0
                        ? 1
                        : (score === dataArray[length - 1].score ? dataArray[length - 1].rank : length + 1),
                });
            }

            this._labelSpmNoData.visible = !dataArray.length;
            this._listSpm.bindData(dataArray);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForMrwUserRenderer = {
        rank        : number;
        userId      : number;
        playersCount: number;
        warType     : Types.WarType;
    };
    class MrwUserRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMrwUserRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
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
            const data = this.data;
            if (!data) {
                return;
            }

            const rank              = data.rank;
            const labelNickname     = this._labelNickname;
            const labelScore        = this._labelScore;
            labelNickname.text      = Lang.getText(LangTextType.B0029);
            labelScore.text         = ``;
            this._labelIndex.text   = `${rank}${Helpers.getSuffixForRank(rank)}`;
            this._imgBg.alpha       = rank % 2 == 1 ? 0.2 : 0.5;

            const userInfo = await Twns.User.UserModel.getUserPublicInfo(data.userId);
            if (userInfo == null) {
                throw Helpers.newError(`UserRenderer._updateView() empty userInfo.`);
            }
            labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;

            const rankInfo = (userInfo.userMrwRankInfoArray || []).find(v => {
                return (v.playersCountUnneutral === data.playersCount) && (v.warType === data.warType);
            });
            if (rankInfo == null) {
                throw Helpers.newError(`UserRenderer._updateView() empty rankInfo.`);
            } else {
                labelScore.text = `${rankInfo.currentScore}`;
            }
        }
    }

    type DataForSpmUserRenderer = {
        index       : number;
        rank        : number;
        userId      : number;
        score       : number;
    };
    class SpmUserRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSpmUserRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
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
            const data              = this._getData();
            const rank              = data.rank;
            const labelNickname     = this._labelNickname;
            const labelScore        = this._labelScore;
            labelNickname.text      = Lang.getText(LangTextType.B0029);
            labelScore.text         = `${Helpers.formatString(`%.2f`, data.score)}`;
            this._labelIndex.text   = `${rank}${Helpers.getSuffixForRank(rank)}`;
            this._imgBg.alpha       = data.index % 2 == 1 ? 0.2 : 0.5;

            const userInfo          = await Twns.User.UserModel.getUserPublicInfo(data.userId);
            labelNickname.text      = userInfo?.nickname || CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonRankListPanel;
