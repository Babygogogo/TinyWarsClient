
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
namespace Twns.SinglePlayerMode {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;

    export type OpenDataForSpmMyWarRoomRecordPanel = void;
    export class SpmMyWarRoomRecordPanel extends TwnsUiPanel.UiPanel<OpenDataForSpmMyWarRoomRecordPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _labelMapName!     : TwnsUiLabel.UiLabel;
        private readonly _labelRuleName!    : TwnsUiLabel.UiLabel;
        private readonly _labelMyScore!     : TwnsUiLabel.UiLabel;
        private readonly _labelMyTurnIndex! : TwnsUiLabel.UiLabel;
        private readonly _labelMyRank!      : TwnsUiLabel.UiLabel;
        private readonly _listHighScore!    : TwnsUiScrollList.UiScrollList<DataForHighScoreRenderer>;
        private readonly _labelNoData!      : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listHighScore.setItemRenderer(HighScoreRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateComponentsForHighScore();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0906);
            this._labelMapName.text     = Lang.getText(LangTextType.B0225);
            this._labelRuleName.text    = Lang.getText(LangTextType.B0318);
            this._labelMyScore.text     = Lang.getText(LangTextType.B0579);
            this._labelMyTurnIndex.text = Lang.getText(LangTextType.B0091);
            this._labelMyRank.text      = Lang.getText(LangTextType.B0904);
            this._labelNoData.text      = Lang.getText(LangTextType.B0278);
        }

        private async _updateComponentsForHighScore(): Promise<void> {
            const configVersion     = await Config.ConfigManager.getLatestConfigVersion();
            const spwArray          = User.UserModel.getSelfInfo()?.userComplexInfo?.userWarStatistics?.spwArray ?? [];
            const mapRawDataArray   = await Promise.all(spwArray.map(v => WarMap.WarMapModel.getRawData(Helpers.getExisted(v.mapId))));
            const dataArray         : DataForHighScoreRenderer[] = [];
            for (const info of spwArray) {
                if (info.configVersion !== configVersion) {
                    continue;
                }

                const mapId     = Helpers.getExisted(info.mapId);
                const ruleId    = Helpers.getExisted(info.ruleId);
                if (!mapRawDataArray.find(v => v?.mapId === mapId)?.templateWarRuleArray?.find(v => v.ruleId === ruleId)?.ruleAvailability?.canSrw) {
                    continue;
                }

                dataArray.push({
                    index   : 0,
                    mapId,
                    ruleId,
                    score   : Helpers.getExisted(info.highScore),
                });
            }
            dataArray.sort((v1, v2) => {
                const mapId1 = v1.mapId;
                const mapId2 = v2.mapId;
                if (mapId1 !== mapId2) {
                    return mapId1 - mapId2;
                } else {
                    return v1.ruleId - v2.ruleId;
                }
            });
            for (let i = 0; i < dataArray.length; ++i) {
                dataArray[i].index = i + 1;
            }

            this._labelNoData.visible = !dataArray.length;
            this._listHighScore.bindData(dataArray);
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

    type DataForHighScoreRenderer = {
        index       : number;
        mapId       : number;
        ruleId      : number;
        score       : number;
    };
    class HighScoreRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForHighScoreRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelMapName!     : TwnsUiLabel.UiLabel;
        private readonly _labelRuleName!    : TwnsUiLabel.UiLabel;
        private readonly _labelMyScore!     : TwnsUiLabel.UiLabel;
        private readonly _labelMyTurnIndex! : TwnsUiLabel.UiLabel;
        private readonly _labelMyRank!      : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateLabelMapNameAndRuleName();
            this._updateLabelMyRank();
            this._updateLabelMyTurnIndex();

            const data              = this._getData();
            this._labelMyScore.text = `${data.score}`;
            this._imgBg.alpha       = data.index % 2 == 1 ? 0.2 : 0.5;
        }

        private async _updateLabelMapNameAndRuleName(): Promise<void> {
            const labelMapName  = this._labelMapName;
            const labelRuleName = this._labelRuleName;
            labelMapName.text   = ``;
            labelRuleName.text  = ``;

            const mapRawData = await WarMap.WarMapModel.getRawData(this._getData().mapId);
            if (mapRawData?.mapId === this._getData().mapId) {  // 由于异步逻辑，所以需要再次比较
                labelMapName.text = Lang.getLanguageText({ textArray: mapRawData.mapNameArray }) ?? CommonConstants.ErrorTextForUndefined;

                const ruleId        = this._getData().ruleId;
                labelRuleName.text  = `#${ruleId}(${Lang.getLanguageText({ textArray: mapRawData.templateWarRuleArray?.find(v => v.ruleId === ruleId)?.ruleNameArray }) ?? CommonConstants.ErrorTextForUndefined})`;
            }
        }

        private async _updateLabelMyTurnIndex(): Promise<void> {
            const label = this._labelMyTurnIndex;
            label.text  = ``;

            const data      = this._getData();
            const userId    = Helpers.getExisted(User.UserModel.getSelfUserId());
            const ruleId    = data.ruleId;
            const rankData  = (await SinglePlayerMode.SpmModel.getRankData(data.mapId))?.find(v => v.ruleId === ruleId)?.infoArray?.find(v => v.userId === userId);
            if (data === this._getData()) {
                label.text = (rankData?.score !== data.score)
                    ? `--`
                    : `${rankData.turnIndex ?? `--`}`;
            }
        }

        private async _updateLabelMyRank(): Promise<void> {
            const labelMyRank   = this._labelMyRank;
            labelMyRank.text    = ``;

            const data  = this._getData();
            const index = await SinglePlayerMode.SpmModel.getRankIndex(data.mapId, data.ruleId, data.score);
            if (data === this._getData()) { // 由于异步逻辑，所以需要再次比较
                labelMyRank.text = (index == null) || (index <= 0)
                    ? `--`
                    : `${index}${Helpers.getSuffixForRankIndex(index)}`;
            }
        }
    }
}

// export default TwnsSpmMyHighScorePanel;
