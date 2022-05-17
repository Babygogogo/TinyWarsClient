
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
namespace Twns.SingleRankRoom {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;

    export type OpenDataForSrrCreateQuickSettingsPanel = void;
    export class SrrCreateQuickSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForSrrCreateQuickSettingsPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _labelWarRuleTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelWarRule!         : TwnsUiLabel.UiLabel;
        private readonly _btnModifyWarRule!     : TwnsUiButton.UiButton;
        private readonly _labelSaveSlotTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelSaveSlot!        : TwnsUiLabel.UiLabel;
        private readonly _btnModifySaveSlot!    : TwnsUiButton.UiButton;

        private readonly _labelHighScoreTitle!  : TwnsUiLabel.UiLabel;
        private readonly _labelHighScore!       : TwnsUiLabel.UiLabel;

        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnModifyWarRule,   callback: this._onTouchedBtnModifyWarRule },
                { ui: this._btnModifySaveSlot,  callback: this._onTouchedBtnModifySaveSlot },
                { ui: this._btnClose,           callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listPlayer.setItemRenderer(PlayerRenderer);
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

        private async _onTouchedBtnModifyWarRule(): Promise<void> {
            await SrrCreateModel.tickTemplateWarRuleId();
            this._updateView();
        }

        private _onTouchedBtnModifySaveSlot(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.SpmCreateSaveSlotsPanel, {
                currentSlotIndex    : SingleRankRoom.SrrCreateModel.getSaveSlotIndex(),
                callback            : slotIndex => {
                    SingleRankRoom.SrrCreateModel.setSaveSlotIndex(slotIndex);
                    this._updateLabelSaveSlot();
                },
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateBtnModifyWarRule();
            this._updateLabelWarRule();
            this._updateLabelHighScore();
            this._updateLabelSaveSlot();
            this._updateListPlayer();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(LangTextType.B0908);
            this._labelWarRuleTitle.text    = Lang.getText(LangTextType.B0909);
            this._labelSaveSlotTitle.text   = Lang.getText(LangTextType.B0606);
            this._labelHighScoreTitle.text  = Lang.getText(LangTextType.B0907);
        }

        private async _updateBtnModifyWarRule(): Promise<void> {
            this._btnModifyWarRule.visible = ((await SrrCreateModel.getMapRawData()).templateWarRuleArray?.filter(v => v.ruleAvailability?.canSrw).length ?? 0) > 1;
        }
        private async _updateLabelWarRule(): Promise<void> {
            const templateWarRuleId = SrrCreateModel.getInstanceWarRule().templateWarRuleId;
            const templateWarRule   = (await SrrCreateModel.getMapRawData()).templateWarRuleArray?.find(v => v.ruleId === templateWarRuleId);
            this._labelWarRule.text = templateWarRule
                ? `#${templateWarRuleId} (${Lang.getLanguageText({ textArray: templateWarRule.ruleNameArray }) ?? CommonConstants.ErrorTextForUndefined})`
                : CommonConstants.ErrorTextForUndefined;
        }
        private async _updateLabelHighScore(): Promise<void> {
            const ruleId    = SrrCreateModel.getInstanceWarRule().templateWarRuleId;
            const label     = this._labelHighScore;
            if (ruleId == null) {
                label.text = `--`;
                return;
            }

            const mapId         = SrrCreateModel.getMapId();
            const configVersion = await Config.ConfigManager.getLatestConfigVersion();
            const score         = User.UserModel.getSelfInfo()?.userComplexInfo?.userWarStatistics?.spwArray?.find(v => (v.configVersion === configVersion) && (v.mapId === mapId) && (v.ruleId === ruleId))?.highScore;
            if (score == null) {
                label.text = `--`;
            } else {
                const rankIndex = await SinglePlayerMode.SpmModel.getRankIndex(mapId, ruleId, score);
                label.text      = ((rankIndex != null) && (rankIndex > 0))
                    ? `${score} (${rankIndex}${Helpers.getSuffixForRank(rankIndex)})`
                    : `${score} (--)`;
            }
        }
        private _updateLabelSaveSlot(): void {
            this._labelSaveSlot.text = `${SrrCreateModel.getSaveSlotIndex()}`;
        }
        private async _updateListPlayer(): Promise<void> {
            const mapRawData    = await SingleRankRoom.SrrCreateModel.getMapRawData();
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(Helpers.getExisted(mapRawData.playersCountUnneutral)));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
            const dataList: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataList.push({
                    playerIndex,
                });
            }

            return dataList;
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

    type DataForPlayerRenderer = {
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
        private readonly _btnChangeSkinId!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,                callback: this._onTouchedGroupCo },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
                { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.SrrCreatePlayerInfoChanged,     callback: this._onNotifySrrCreatePlayerInfoChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();

            this._btnChangeCo.visible = SingleRankRoom.SrrCreateModel.getPlayerRule(this._getData().playerIndex).fixedCoIdInSrw == null;
        }

        private async _onTouchedGroupCo(): Promise<void> {
            const playerData    = this._getPlayerData();
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonCoInfoPanel, {
                    gameConfig      : SingleRankRoom.SrrCreateModel.getGameConfig(),
                    coId,
                });
            }
        }

        private async _onTouchedBtnChangeSkinId(): Promise<void> {
            SingleRankRoom.SrrCreateModel.tickUnitAndTileSkinId(this._getData().playerIndex);
        }

        private async _onTouchedBtnChangeCo(): Promise<void> {
            const roomInfo  = SingleRankRoom.SrrCreateModel.getData();
            if (!roomInfo) {
                return;
            }

            const playerIndex   = this._getData().playerIndex;
            const currentCoId   = SingleRankRoom.SrrCreateModel.getCoId(playerIndex);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                gameConfig          : SingleRankRoom.SrrCreateModel.getGameConfig(),
                currentCoId,
                availableCoIdArray  : WarHelpers.WarRuleHelpers.getAvailableCoIdArrayForPlayer({
                    baseWarRule         : SingleRankRoom.SrrCreateModel.getInstanceWarRule(),
                    playerIndex,
                    gameConfig      : await Config.ConfigManager.getGameConfig(Helpers.getExisted(roomInfo.settingsForCommon?.configVersion)),
                }),
                callbackOnConfirm   : (newCoId) => {
                    if (newCoId !== currentCoId) {
                        SingleRankRoom.SrrCreateModel.setCoId(playerIndex, newCoId);
                    }
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySrrCreatePlayerInfoChanged(e: egret.Event): void {
            const eventData = e.data as Notify.NotifyData.SrrCreatePlayerInfoChanged;
            if (eventData.playerIndex === this._getData().playerIndex) {
                this._updateComponentsForSettings();
            }
        }

        private _updateComponentsForLanguage(): void {
            this._btnChangeCo.label         = Lang.getText(LangTextType.B0230);
            this._btnChangeSkinId.label     = Lang.getText(LangTextType.B0609);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const roomInfo  = SingleRankRoom.SrrCreateModel.getData();
            if (!roomInfo) {
                return;
            }

            const playerIndex           = this._getData().playerIndex;
            const settingsForCommon     = Helpers.getExisted(roomInfo.settingsForCommon);
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(WarHelpers.WarRuleHelpers.getTeamIndex(Helpers.getExisted(settingsForCommon.instanceWarRule), playerIndex)) || CommonConstants.ErrorTextForUndefined;

            const playerData            = this._getPlayerData();
            this._imgSkin.source        = WarHelpers.WarCommonHelpers.getImageSourceForCoHeadFrame(Helpers.getExisted(playerData.unitAndTileSkinId));
            this._labelPlayerType.text  = playerData.userId == null
                ? Lang.getText(LangTextType.B0607)
                : Lang.getText(LangTextType.B0031);

            const coId                  = Helpers.getExisted(playerData.coId);
            const gameConfig            = await Config.ConfigManager.getGameConfig(Helpers.getExisted(settingsForCommon.configVersion));
            const coCfg                 = gameConfig.getCoBasicCfg(coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = gameConfig.getCoHeadImageSource(coId) ?? CommonConstants.ErrorTextForUndefined;
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
        }

        private _getPlayerData(): CommonProto.Structure.IDataForPlayerInRoom {
            return SingleRankRoom.SrrCreateModel.getPlayerInfo(this._getData().playerIndex);
        }
    }
}

// export default TwnsSpmMyHighScorePanel;
