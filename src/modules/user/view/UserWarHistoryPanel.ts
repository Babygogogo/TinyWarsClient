
// import CommonModel              from "../../common/model/CommonModel";
// import CommonProxy              from "../../common/model/CommonProxy";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import TwnsUserPanel            from "../../user/view/UserPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;

    // eslint-disable-next-line no-shadow
    export const enum UserWarHistoryType {
        RankStd,
        RankFow,
        Unranked,
    }

    export type OpenDataForUserWarHistoryPanel = {
        userId      : number;
        historyType : UserWarHistoryType;
    };
    export class UserWarHistoryPanel extends TwnsUiPanel.UiPanel<OpenDataForUserWarHistoryPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _btnRankStd!       :TwnsUiButton.UiButton;
        private readonly _btnRankFow!       :TwnsUiButton.UiButton;
        private readonly _btnUnranked!      :TwnsUiButton.UiButton;

        private readonly _labelMapName!     : TwnsUiLabel.UiLabel;
        private readonly _labelTimestamp!   : TwnsUiLabel.UiLabel;
        private readonly _labelRankScore!   : TwnsUiLabel.UiLabel;
        private readonly _labelWarType!     : TwnsUiLabel.UiLabel;
        private readonly _labelNoData!      : TwnsUiLabel.UiLabel;

        private readonly _scrRanked!        : eui.Scroller;
        private readonly _listRanked!       : TwnsUiScrollList.UiScrollList<DataForRankedRenderer>;
        private readonly _scrUnranked!      : eui.Scroller;
        private readonly _listUnranked!     : TwnsUiScrollList.UiScrollList<DataForUnrankedRenderer>;

        private _historyType = UserWarHistoryType.RankStd;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserGetPublicInfo,   callback: this._onMsgUserGetPublicInfo },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
                { ui: this._btnRankFow,     callback: this._onTouchedBtnRankFow },
                { ui: this._btnRankStd,     callback: this._onTouchedBtnRankStd },
                { ui: this._btnUnranked,    callback: this._onTouchedBtnUnranked },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listRanked.setItemRenderer(RankedRenderer);
            this._listUnranked.setItemRenderer(UnrankedRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._historyType = this._getOpenData().historyType;
            this._updateView();
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

        private _onMsgUserGetPublicInfo(): void {
            this._updateView();
        }

        private _onTouchedBtnRankFow(): void {
            this._historyType = UserWarHistoryType.RankFow;
            this._updateComponentsForHistory();
        }

        private _onTouchedBtnRankStd(): void {
            this._historyType = UserWarHistoryType.RankStd;
            this._updateComponentsForHistory();
        }

        private _onTouchedBtnUnranked(): void {
            this._historyType = UserWarHistoryType.Unranked;
            this._updateComponentsForHistory();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForHistory();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0201);
            this._labelMapName.text     = Lang.getText(LangTextType.B0225);
            this._labelTimestamp.text   = Lang.getText(LangTextType.B0601);
            this._labelRankScore.text   = Lang.getText(LangTextType.B0060);
            this._labelWarType.text     = Lang.getText(LangTextType.B0599);
            this._labelNoData.text      = Lang.getText(LangTextType.B0278);
        }

        private async _updateComponentsForHistory(): Promise<void> {
            const historyType       = this._historyType;
            const scrRanked         = this._scrRanked;
            const scrUnranked       = this._scrUnranked;
            const listRanked        = this._listRanked;
            const listUnranked      = this._listUnranked;
            const labelNoData       = this._labelNoData;
            const labelWarType      = this._labelWarType;
            const labelRankScore    = this._labelRankScore;

            if (historyType === UserWarHistoryType.RankFow) {
                scrRanked.visible       = true;
                scrUnranked.visible     = false;
                labelWarType.visible    = false;
                labelRankScore.visible  = true;
                listUnranked.clear();

                const dataArray     = await this._createDataForHistoryRankedFow();
                labelNoData.visible = !dataArray.length;
                listRanked.bindData(dataArray);

            } else if (historyType === UserWarHistoryType.RankStd) {
                scrRanked.visible       = true;
                scrUnranked.visible     = false;
                labelWarType.visible    = false;
                labelRankScore.visible  = true;
                listUnranked.clear();

                const dataArray     = await this._createDataForHistoryRankedStd();
                labelNoData.visible = !dataArray.length;
                listRanked.bindData(dataArray);

            } else {
                scrRanked.visible       = false;
                scrUnranked.visible     = true;
                labelWarType.visible    = true;
                labelRankScore.visible  = false;
                listRanked.clear();

                const dataArray     = await this._createDataForHistoryUnranked();
                labelNoData.visible = !dataArray.length;
                listUnranked.bindData(dataArray);
            }
        }

        private async _createDataForHistoryRankedStd(): Promise<DataForRankedRenderer[]> {
            const dataArray: DataForRankedRenderer[] = [];
            for (const data of (await User.UserModel.getUserPublicInfo(this._getOpenData().userId))?.userWarHistory?.mpwRankedStdHistoryArray ?? []) {
                dataArray.push({
                    index       : dataArray.length + 1,
                    mapId       : data.mapId ?? null,
                    timestamp   : Helpers.getExisted(data.endTimestamp),
                    newScore    : Helpers.getExisted(data.newScore),
                    deltaScore  : Helpers.getExisted(data.deltaScore),
                });
            }

            return dataArray;
        }
        private async _createDataForHistoryRankedFow(): Promise<DataForRankedRenderer[]> {
            const dataArray: DataForRankedRenderer[] = [];
            for (const data of (await User.UserModel.getUserPublicInfo(this._getOpenData().userId))?.userWarHistory?.mpwRankedFowHistoryArray ?? []) {
                dataArray.push({
                    index       : dataArray.length + 1,
                    mapId       : data.mapId ?? null,
                    timestamp   : Helpers.getExisted(data.endTimestamp),
                    newScore    : Helpers.getExisted(data.newScore),
                    deltaScore  : Helpers.getExisted(data.deltaScore),
                });
            }

            return dataArray;
        }
        private async _createDataForHistoryUnranked(): Promise<DataForUnrankedRenderer[]> {
            const dataArray: DataForUnrankedRenderer[] = [];
            for (const data of (await User.UserModel.getUserPublicInfo(this._getOpenData().userId))?.userWarHistory?.mpwUnrankedHistoryArray ?? []) {
                dataArray.push({
                    index       : dataArray.length + 1,
                    mapId       : data.mapId ?? null,
                    timestamp   : Helpers.getExisted(data.endTimestamp),
                    warType     : Helpers.getExisted(data.warType),
                });
            }

            return dataArray;
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

    type DataForUnrankedRenderer = {
        index       : number;
        mapId       : number | null;
        timestamp   : number;
        warType     : Types.WarType;
    };
    class UnrankedRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnrankedRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelMapName!     : TwnsUiLabel.UiLabel;
        private readonly _labelTimestamp!   : TwnsUiLabel.UiLabel;
        private readonly _labelWarType!     : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const data                  = this._getData();
            const mapId                 = data.mapId;
            this._imgBg.alpha           = data.index % 2 == 1 ? 0.2 : 0.5;
            this._labelWarType.text     = Lang.getWarTypeName(data.warType) ?? CommonConstants.ErrorTextForUndefined;
            this._labelTimestamp.text   = getTextForTimestamp(data.timestamp);
            this._labelMapName.text     = mapId == null ? `--` : (await WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId) ?? CommonConstants.ErrorTextForUndefined);
        }
    }

    type DataForRankedRenderer = {
        index       : number;
        mapId       : number | null;
        timestamp   : number;
        newScore    : number;
        deltaScore  : number;
    };
    class RankedRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRankedRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelMapName!     : TwnsUiLabel.UiLabel;
        private readonly _labelTimestamp!   : TwnsUiLabel.UiLabel;
        private readonly _labelScore!       : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const data                  = this._getData();
            const mapId                 = data.mapId;
            const deltaScore            = data.deltaScore;
            this._imgBg.alpha           = data.index % 2 == 1 ? 0.2 : 0.5;
            this._labelScore.text       = `${data.newScore}(${deltaScore >= 0 ? `+` : ``}${deltaScore})`;
            this._labelTimestamp.text   = getTextForTimestamp(data.timestamp);
            this._labelMapName.text     = mapId == null ? `--` : (await WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId) ?? CommonConstants.ErrorTextForUndefined);
        }
    }

    function getTextForTimestamp(timestamp: number): string {
        const text1 = Helpers.getTimestampShortText(timestamp, { hour: false, minute: false, second: false });
        const text2 = Helpers.getTimestampShortText(timestamp, { year: false, month: false, date: false });
        return `${text1} ${text2}`;
    }
}

// export default TwnsUserWarHistoryPanel;
