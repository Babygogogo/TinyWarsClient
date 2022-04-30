
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
namespace Twns.Common {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import WarType      = Types.WarType;

    const WarTypeFullArray = [
        WarType.MrwStd,
        WarType.MrwFog,
        WarType.McwStd,
        WarType.McwFog,
        WarType.CcwStd,
        WarType.CcwFog,
        WarType.ScwStd,
        WarType.ScwFog,
        WarType.SrwStd,
        WarType.SrwFog,
    ];

    export type OpenDataForCommonMapWarStatisticsPanel = {
        mapId   : number;
    };
    export class CommonMapWarStatisticsPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonMapWarStatisticsPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;
        private readonly _btnRule!              : TwnsUiButton.UiButton;
        private readonly _labelRule!            : TwnsUiLabel.UiLabel;
        private readonly _btnWarType!           : TwnsUiButton.UiButton;
        private readonly _labelWarType!         : TwnsUiLabel.UiLabel;
        private readonly _labelTurnIndexTitle!  : TwnsUiLabel.UiLabel;
        private readonly _labelStatisticsTitle! : TwnsUiLabel.UiLabel;
        private readonly _listStatistics!       : TwnsUiScrollList.UiScrollList<DataForStatistics>;
        private readonly _labelNoData!          : TwnsUiLabel.UiLabel;

        private _templateWarRuleId  = 0;
        private _warType            = WarType.MrwStd;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                   callback: this.close },
                { ui: this._btnRule,                    callback: this._onTouchedBtnRule },
                { ui: this._btnWarType,                 callback: this._onTouchedBtnWarType },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listStatistics.setItemRenderer(StatisticsRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const mapId     = this._getOpenData().mapId;
            this._templateWarRuleId    = (await getNextRuleId(mapId, -1)) ?? Helpers.getExisted(Helpers.getExisted((await WarMap.WarMapModel.getRawData(mapId))?.templateWarRuleArray)[0].ruleId);
            this._warType   = (await getNextWarType(WarType.Undefined, mapId, this._templateWarRuleId)) ?? WarType.MrwStd;
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

        private async _onTouchedBtnRule(): Promise<void> {
            const mapId         = this._getOpenData().mapId;
            const nextRuleId    = await getNextRuleId(mapId, this._templateWarRuleId);
            if (nextRuleId == null) {
                FloatText.show(Lang.getText(LangTextType.A0302));
                return;
            }

            const nextWarType = await getNextWarType(WarType.Undefined, mapId, nextRuleId);
            if (nextWarType == null) {
                FloatText.show(Lang.getText(LangTextType.A0302));
                return;
            }

            this._templateWarRuleId    = nextRuleId;
            this._warType   = nextWarType;
            this._updateView();
        }

        private async _onTouchedBtnWarType(): Promise<void> {
            const nextWarType = await getNextWarType(this._warType, this._getOpenData().mapId, this._templateWarRuleId);
            if (nextWarType == null) {
                FloatText.show(Lang.getText(LangTextType.A0302));
                return;
            }

            this._warType = nextWarType;
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateComponentsForListStatistics();
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelTitle();
            this._updateLabelRule();
            this._updateLabelWarType();

            this._btnRule.label             = Lang.getText(LangTextType.B0318);
            this._btnWarType.label          = Lang.getText(LangTextType.B0599);
            this._labelTurnIndexTitle.text  = `${Lang.getText(LangTextType.B0091)}(${Lang.getText(LangTextType.B0877)})`;
            this._labelStatisticsTitle.text = `${Lang.getText(LangTextType.B0876)} (${Lang.getText(LangTextType.B0550)} / ${Lang.getText(LangTextType.B0551)} / ${Lang.getText(LangTextType.B0552)})`;
            this._labelNoData.text          = Lang.getText(LangTextType.B0278);
        }

        private async _updateLabelTitle(): Promise<void> {
            const mapId             = this._getOpenData().mapId;
            const mapName           = await WarMap.WarMapModel.getMapNameInCurrentLanguage(this._getOpenData().mapId);
            this._labelTitle.text   = `${Lang.getText(LangTextType.B0876)} #${mapId} ${mapName}`;
        }

        private async _updateLabelRule(): Promise<void> {
            const templateWarRuleId = this._templateWarRuleId;
            const templateWarRule   = (await WarMap.WarMapModel.getRawData(this._getOpenData().mapId))?.templateWarRuleArray?.find(v => v.ruleId === templateWarRuleId);
            const ruleName          = templateWarRule ? Lang.getLanguageText({ textArray: templateWarRule.ruleNameArray }) ?? CommonConstants.ErrorTextForUndefined : CommonConstants.ErrorTextForUndefined;
            this._labelRule.text    = `#${templateWarRuleId} ${ruleName}`;
        }

        private _updateLabelWarType(): void {
            this._labelWarType.text = Lang.getWarTypeName(this._warType) ?? CommonConstants.ErrorTextForUndefined;
        }

        private async _updateComponentsForListStatistics(): Promise<void> {
            const statisticsForRuleArray    = (await WarMap.WarMapModel.getBriefData(this._getOpenData().mapId))?.mapExtraData?.mapWarStatistics?.statisticsForRuleArray;
            const statisticsForTurnArray    = statisticsForRuleArray?.find(v => v.ruleId === this._templateWarRuleId && v.warType === this._warType)?.statisticsForTurnArray;
            const labelNoData               = this._labelNoData;
            const listStatistics            = this._listStatistics;
            if (!statisticsForTurnArray?.length) {
                labelNoData.visible = true;
                listStatistics.clear();
                return;
            }

            const dataArray             : DataForStatistics[] = [];
            const fullStatisticsArray   : number[] = [];
            let totalGames              = 0;
            for (const info of statisticsForTurnArray) {
                const turnGames         = Helpers.getExisted(info.totalGames);
                const statisticsArray   = Helpers.getExisted(info.gameResultArray);
                dataArray.push({
                    index           : 0,
                    isLast          : false,
                    turnIndex       : Helpers.getExisted(info.turnIndex),
                    totalGames      : 0,
                    turnGames,
                    statisticsArray,
                });

                totalGames += turnGames;
                for (let i = 0; i < statisticsArray.length; ++i) {
                    fullStatisticsArray[i] = (fullStatisticsArray[i] ?? 0) + statisticsArray[i];
                }
            }
            dataArray.sort((v1, v2) => Helpers.getExisted(v1.turnIndex) - Helpers.getExisted(v2.turnIndex));

            let index = 0;
            for (const data of dataArray) {
                data.totalGames = totalGames;
                data.index      = index++;
            }
            dataArray.push({
                index           : index++,
                isLast          : true,
                turnIndex       : null,
                totalGames,
                turnGames       : totalGames,
                statisticsArray : fullStatisticsArray,
            });

            labelNoData.visible = false;
            listStatistics.bindData(dataArray);
            listStatistics.scrollVerticalTo(0);
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

    type DataForStatistics = {
        index           : number;
        isLast          : boolean;
        turnIndex       : number | null;
        totalGames      : number;
        turnGames       : number;
        statisticsArray : number[];
    };
    class StatisticsRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForStatistics> {
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelTurnIndex!   : TwnsUiLabel.UiLabel;
        private readonly _imgBottomLine!    : TwnsUiImage.UiImage;
        private readonly _groupPlayers!     : eui.Group;

        private readonly _groupP1!          : eui.Group;
        private readonly _labelWin1!        : TwnsUiLabel.UiLabel;
        private readonly _labelLose1!       : TwnsUiLabel.UiLabel;
        private readonly _labelDraw1!       : TwnsUiLabel.UiLabel;

        private readonly _groupP2!          : eui.Group;
        private readonly _labelWin2!        : TwnsUiLabel.UiLabel;
        private readonly _labelLose2!       : TwnsUiLabel.UiLabel;
        private readonly _labelDraw2!       : TwnsUiLabel.UiLabel;

        private readonly _groupP3!          : eui.Group;
        private readonly _labelWin3!        : TwnsUiLabel.UiLabel;
        private readonly _labelLose3!       : TwnsUiLabel.UiLabel;
        private readonly _labelDraw3!       : TwnsUiLabel.UiLabel;

        private readonly _groupP4!          : eui.Group;
        private readonly _labelWin4!        : TwnsUiLabel.UiLabel;
        private readonly _labelLose4!       : TwnsUiLabel.UiLabel;
        private readonly _labelDraw4!       : TwnsUiLabel.UiLabel;

        private readonly _groupP5!          : eui.Group;
        private readonly _labelWin5!        : TwnsUiLabel.UiLabel;
        private readonly _labelLose5!       : TwnsUiLabel.UiLabel;
        private readonly _labelDraw5!       : TwnsUiLabel.UiLabel;

        private readonly _groupsForPlayers  : eui.Group[] = [];
        private readonly _labelsForStatics  : TwnsUiLabel.UiLabel[][] = [];

        protected _onOpened(): void {
            this._groupsForPlayers.push(this._groupP1, this._groupP2, this._groupP3, this._groupP4, this._groupP5);
            this._labelsForStatics.push(
                [ this._labelWin1,  this._labelLose1,   this._labelDraw1, ],
                [ this._labelWin2,  this._labelLose2,   this._labelDraw2, ],
                [ this._labelWin3,  this._labelLose3,   this._labelDraw3, ],
                [ this._labelWin4,  this._labelLose4,   this._labelDraw4, ],
                [ this._labelWin5,  this._labelLose5,   this._labelDraw5, ],
            );
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const data                  = this._getData();
            const turnGames             = data.turnGames;
            const totalGames            = data.totalGames;
            const turnIndex             = data.turnIndex;
            this._imgBg.alpha           = data.index % 2 == 1 ? 0.2 : 0.5;
            this._imgBottomLine.visible = data.isLast;
            this._labelTurnIndex.text   = `${turnIndex ?? `--`}(${turnGames}, ${Math.round(turnGames * 100 / totalGames)}%)`;

            const statisticsArray = data.statisticsArray;
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                const index     = playerIndex - 1;
                const group     = this._groupsForPlayers[index];
                const labels    = this._labelsForStatics[index];
                const wins      = statisticsArray[index * 2];
                if (wins == null) {
                    (group.parent) && (group.parent.removeChild(group));
                } else {
                    this._groupPlayers.addChild(group);

                    const loses = statisticsArray[index * 2 + 1];
                    const draws = turnGames - wins - loses;
                    labels[0].text = `${wins}(${Math.round(wins * 100 / turnGames)}%)`;
                    labels[1].text = `${loses}(${Math.round(loses * 100 / turnGames)}%)`;
                    labels[2].text = `${draws}(${Math.round(draws * 100 / turnGames)}%)`;
                }
            }
        }
    }

    async function getNextRuleId(mapId: number, ruleId: number): Promise<number | null> {
        for (const newRuleId of await getRuleIdArray(mapId, ruleId)) {
            if ((await getNextWarType(WarType.Undefined, mapId, newRuleId)) != null) {
                return newRuleId;
            }
        }

        return null;
    }

    async function getRuleIdArray(mapId: number, ruleId: number): Promise<number[]> {
        const ruleIdFullArray   = (await WarMap.WarMapModel.getRawData(mapId))?.templateWarRuleArray?.map(v => Helpers.getExisted(v.ruleId)).sort((v1, v2) => v1 - v2) ?? [];
        const ruleIdArray       : number[] = [];
        const index             = ruleIdFullArray.indexOf(ruleId);
        for (let i = index + 1; i < ruleIdFullArray.length; ++i) {
            ruleIdArray.push(ruleIdFullArray[i]);
        }
        for (let i = 0; i < index; ++i) {
            ruleIdArray.push(ruleIdFullArray[i]);
        }
        return ruleIdArray;
    }

    async function getNextWarType(warType: WarType, mapId: number, ruleId: number): Promise<WarType | null> {
        const statisticsForRuleArray = (await WarMap.WarMapModel.getBriefData(mapId))?.mapExtraData?.mapWarStatistics?.statisticsForRuleArray;
        for (const newWarType of getWarTypeArray(warType)) {
            if (statisticsForRuleArray?.find(v => (v.ruleId === ruleId) && (v.warType === newWarType))?.statisticsForTurnArray?.length) {
                return newWarType;
            }
        }

        return null;
    }

    function getWarTypeArray(warType: WarType): WarType[] {
        const warTypeArray  : WarType[] = [];
        const index         = WarTypeFullArray.indexOf(warType);
        for (let i = index + 1; i < WarTypeFullArray.length; ++i) {
            warTypeArray.push(WarTypeFullArray[i]);
        }
        for (let i = 0; i < index; ++i) {
            warTypeArray.push(WarTypeFullArray[i]);
        }
        return warTypeArray;
    }
}

// export default TwnsCommonMapWarStatisticsPanel;
