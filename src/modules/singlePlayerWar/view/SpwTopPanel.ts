
// import ChatModel                from "../../chat/model/ChatModel";
// import TwnsChatPanel            from "../../chat/view/ChatPanel";
// import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import NotifyData               from "../../tools/notify/NotifyData";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsUserPanel            from "../../user/view/UserPanel";
// import TwnsUserSettingsPanel    from "../../user/view/UserSettingsPanel";
// import TwnsSpwWar               from "../model/SpwWar";
// import TwnsSpwWarMenuPanel      from "./SpwWarMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerWar {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import ClientErrorCode      = Twns.ClientErrorCode;

    // eslint-disable-next-line no-shadow
    enum PanelSkinState {
        Normal,
        Expanded,
    }

    export type OpenDataForSpwTopPanel = {
        war     : Twns.SinglePlayerWar.SpwWar;
    };
    export class SpwTopPanel extends TwnsUiPanel.UiPanel<OpenDataForSpwTopPanel> {
        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForListPlayer>;
        private readonly _btnWeather!           : TwnsUiButton.UiButton;
        private readonly _btnSave!              : TwnsUiLabel.UiLabel;
        private readonly _btnLoad!              : TwnsUiLabel.UiLabel;
        private readonly _btnChat!              : TwnsUiButton.UiButton;
        private readonly _btnSettings!          : TwnsUiButton.UiButton;

        private readonly _groupCo!              : eui.Group;
        private readonly _imgSkin!              : TwnsUiImage.UiImage;
        private readonly _imgCo!                : TwnsUiImage.UiImage;

        private readonly _groupPlayer!          : eui.Group;
        private readonly _labelPlayer!          : TwnsUiLabel.UiLabel;
        private readonly _labelTurnIndex!       : TwnsUiLabel.UiLabel;

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelCurrEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelPowerEnergy!     : TwnsUiLabel.UiLabel;
        private readonly _labelZoneEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelFund!            : TwnsUiLabel.UiLabel;
        private readonly _labelAddFund!         : TwnsUiLabel.UiLabel;
        private readonly _btnExpand!            : TwnsUiButton.UiButton;
        private readonly _btnNarrow!            : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwTurnIndexChanged,              callback: this._onNotifyBwTurnIndexChanged },
                { type: NotifyType.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwForceWeatherTypeChanged,       callback: this._onNotifyBwForceWeatherTypeChanged },
                { type: NotifyType.WarActionNormalExecuted,         callback: this._onNotifyWarActionNormalExecuted },
                { type: NotifyType.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
                { type: NotifyType.MsgSpmSaveScw,                   callback: this._onNotifyMsgSpmSaveScw },
                { type: NotifyType.MsgSpmSaveSfw,                   callback: this._onNotifyMsgSpmSaveSfw },
                { type: NotifyType.MsgSpmSaveSrw,                   callback: this._onNotifyMsgSpmSaveSrw },
            ]);
            this._setUiListenerArray([
                { ui: this._btnWeather,         callback: this._onTouchedBtnWeather },
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._groupInfo,          callback: this._onTouchedGroupInfo },
                { ui: this._btnSave,            callback: this._onTouchedBtnSave },
                { ui: this._btnLoad,            callback: this._onTouchedBtnLoad },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnSettings,        callback: this._onTouchedBtnSettings, },
                { ui: this._btnExpand,          callback: this._onTouchedBtnExpand },
                { ui: this._btnNarrow,          callback: this._onTouchedBtnNarrow },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._setPanelSkinState(PanelSkinState.Normal);
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for notify.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwPlayerFundChanged(): void {
            this._updateLabelFundAndAddFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(): void {
            const war = this._getOpenData().war;
            this._updateView();
            Twns.SoundManager.playCoBgmWithWar(war, false);
        }
        private _onNotifyBwTurnIndexChanged(): void {
            this._updateLabelTurnIndex();
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelEnergy();
            Twns.SoundManager.playCoBgmWithWar(this._getOpenData().war, false);
        }
        private _onNotifyBwForceWeatherTypeChanged(): void {
            this._updateBtnWeather();
        }
        private _onNotifyWarActionNormalExecuted(): void {
            this._updateLabelFundAndAddFund();
        }

        private _onNotifyMsgChatGetAllReadProgressList(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatUpdateReadProgress(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatGetAllMessages(): void {
            this._updateBtnChat();
        }
        private _onNotifyMsgChatAddMessage(): void {
            this._updateBtnChat();
        }

        private _onNotifyMsgSpmSaveScw(): void {
            FloatText.show(Lang.getText(LangTextType.A0073));
        }
        private _onNotifyMsgSpmSaveSfw(): void {
            FloatText.show(Lang.getText(LangTextType.A0073));
        }
        private _onNotifyMsgSpmSaveSrw(): void {
            FloatText.show(Lang.getText(LangTextType.A0073));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for touch.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnWeather(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonHelpPanel, {
                title  : Lang.getText(LangTextType.B0705),
                content: this._getOpenData().war.getWeatherManager().getDesc(),
            });
        }

        private _onTouchedGroupPlayer(): void {
            const userId = this._getOpenData().war.getPlayerInTurn().getUserId();
            if (userId != null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserPanel, { userId });
                Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.ButtonNeutral01);
            }
        }

        private _onTouchedGroupCo(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonCoListPanel, {
                war : this._getOpenData().war,
            });
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.SpwWarMenuPanel);
            Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedGroupInfo(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonCoListPanel, {
                war : this._getOpenData().war,
            });
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.SpwWarMenuPanel);
            Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedBtnSave(): void {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const war = this._getOpenData().war;
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0260),
                content : Lang.getText(LangTextType.A0071),
                callback: () => {
                    const warType = war.getWarType();
                    if ((warType === Twns.Types.WarType.ScwFog) || (warType === Twns.Types.WarType.ScwStd)) {
                        Twns.SinglePlayerMode.SpmProxy.reqSpmSaveScw(war);
                    } else if ((warType === Twns.Types.WarType.SfwFog) || (warType === Twns.Types.WarType.SfwStd)) {
                        Twns.SinglePlayerMode.SpmProxy.reqSpmSaveSfw(war);
                    } else if ((warType === Twns.Types.WarType.SrwFog) || (warType === Twns.Types.WarType.SrwStd)) {
                        Twns.SinglePlayerMode.SpmProxy.reqSpmSaveSrw(war);
                    } else {
                        throw Twns.Helpers.newError(`Invalid warType: ${warType}`, ClientErrorCode.SpwWarMenuPanel_OnTOuchedBtnSaveGame_00);
                    }
                },
            });
        }

        private async _onTouchedBtnLoad(): Promise<void> {
            if (!this._checkCanDoAction()) {
                FloatText.show(Lang.getText(LangTextType.A0239));
                return;
            }

            const slotInfo = await Twns.SinglePlayerMode.SpmModel.getSlotFullData(this._getOpenData().war.getSaveSlotIndex());
            if (slotInfo == null) {
                FloatText.show(Lang.getText(LangTextType.A0303));
                return;
            }

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                title   : Lang.getText(LangTextType.B0261),
                content : Lang.getText(LangTextType.A0072),
                callback: () => {
                    Twns.FlowManager.gotoSinglePlayerWar({
                        slotIndex       : slotInfo.slotIndex,
                        warData         : slotInfo.warData,
                        slotExtraData   : slotInfo.extraData,
                    });
                },
            });
        }

        private _onTouchedBtnChat(): void {
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.SpwWarMenuPanel);
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.ChatPanel, {});
        }

        private _onTouchedBtnSettings(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserSettingsPanel, void 0);
        }

        private _onTouchedBtnExpand(): void {
            this._setPanelSkinState(PanelSkinState.Expanded);
        }

        private _onTouchedBtnNarrow(): void {
            this._setPanelSkinState(PanelSkinState.Normal);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateBtnWeather();
            this._updateListPlayer();
            this._updateImgSkinAndCo();
            this._updateLabelPlayer();
            this._updateLabelTurnIndex();
            this._updateLabelFundAndAddFund();
            this._updateLabelEnergy();
            this._updateBtnChat();
        }

        private _updateComponentsForLanguage(): void {
            this._updateBtnWeather();
            this._updateLabelTurnIndex();
        }

        private _updateBtnWeather(): void {
            this._btnWeather.icon = Config.ConfigManager.getWeatherImageSource(this._getOpenData().war.getWeatherManager().getCurrentWeatherType());
        }

        private _updateListPlayer(): void {
            this._listPlayer.bindData(this._createDataArrayForListPlayer());
        }

        private _updateLabelTurnIndex(): void {
            this._labelTurnIndex.text = `${Lang.getText(LangTextType.B0191)} ${this._getOpenData().war.getTurnManager().getTurnIndex()}`;
        }

        private async _updateLabelPlayer(): Promise<void> {
            const player            = this._getOpenData().war.getPlayerInTurn();
            this._labelPlayer.text  = `${await player.getNickname()}`;
        }

        private _updateLabelFundAndAddFund(): void {
            const war           = this._getOpenData().war;
            const playerInTurn  = war.getPlayerInTurn();
            const labelFund     = this._labelFund;
            const labelAddFund  = this._labelAddFund;
            if ((war.getFogMap().checkHasFogCurrently())                                                        &&
                (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(playerInTurn.getTeamIndex()))
            ) {
                labelFund.text      = `????`;
                labelAddFund.text   = `(+??)`;
            } else {
                labelFund.text      = `${playerInTurn.getFund()}`;
                labelAddFund.text   = `(+${war.getTileMap().getTotalIncomeForPlayer(playerInTurn.getPlayerIndex())})`;
            }
        }

        private _updateImgSkinAndCo(): void {
            const war               = this._getOpenData().war;
            const player            = war.getPlayerInTurn();
            this._imgSkin.source    = WarHelpers.WarCommonHelpers.getImageSourceForCoEyeFrame(player.getUnitAndTileSkinId());
            this._imgCo.source      = war.getGameConfig().getCoEyeImageSource(player.getCoId(), player.getAliveState() !== Twns.Types.PlayerAliveState.Dead) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelEnergy(): void {
            const war = this._getOpenData().war;
            if ((war) && (war.getIsRunning())) {
                const player            = war.getPlayerInTurn();
                const skillType         = player.getCoUsingSkillType();
                const labelCurrEnergy   = this._labelCurrEnergy;
                const currentEnergy     = player.getCoCurrentEnergy();
                if (skillType === Twns.Types.CoSkillType.Power) {
                    labelCurrEnergy.text = `${currentEnergy}(P)`;
                } else if (skillType === Twns.Types.CoSkillType.SuperPower) {
                    labelCurrEnergy.text = `${currentEnergy}(SP)`;
                } else {
                    labelCurrEnergy.text = `${player.getCoCurrentEnergy()}`;
                }

                const powerEnergy           = player.getCoPowerEnergy();
                const superPowerEnergy      = player.getCoSuperPowerEnergy();
                this._labelPowerEnergy.text = `P:${powerEnergy == null ? `--` : powerEnergy} / ${superPowerEnergy == null ? `--` : superPowerEnergy}`;

                const zoneEnergyText        = (player.getCoZoneExpansionEnergyList() || []).join(` / `);
                this._labelZoneEnergy.text  = `Z:${zoneEnergyText.length ? zoneEnergyText : `--`}`;
            }
        }

        private _updateBtnChat(): void {
            this._btnChat.setRedVisible(Twns.Chat.ChatModel.checkHasUnreadMessage());
        }

        private _setPanelSkinState(state: PanelSkinState): void {
            this.currentState = state === PanelSkinState.Normal ? `normal` : `expanded`;
            this._listPlayer.scrollVerticalTo(0);
        }

        private _createDataArrayForListPlayer(): DataForListPlayer[] {
            const war                   = this._getOpenData().war;
            const playerIndexInTurn     = war.getPlayerIndexInTurn();
            const playersCountUnneutral = war.getPlayerManager().getTotalPlayersCount(false);
            const dataArray             : DataForListPlayer[] = [];
            for (let playerIndex = playerIndexInTurn + 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({
                    war,
                    playerIndex,
                });
            }
            for (let playerIndex = Twns.CommonConstants.WarFirstPlayerIndex; playerIndex < playerIndexInTurn; ++playerIndex) {
                dataArray.push({
                    war,
                    playerIndex,
                });
            }
            return dataArray;
        }

        private _checkCanDoAction(): boolean {
            const war = this._getOpenData().war;
            return (war.checkIsHumanInTurn())                                           &&
                (war.getTurnManager().getPhaseCode() === Twns.Types.TurnPhaseCode.Main)      &&
                (war.getActionPlanner().getState() === Twns.Types.ActionPlannerState.Idle);
        }
    }

    type DataForListPlayer = {
        war         : Twns.SinglePlayerWar.SpwWar
        playerIndex : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
        private readonly _imgSkin!          : TwnsUiImage.UiImage;
        private readonly _imgCo!            : TwnsUiImage.UiImage;
        private readonly _labelEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelFund!        : TwnsUiLabel.UiLabel;
        private readonly _labelAddFund!     : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.BwPlayerFundChanged,         callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.WarActionNormalExecuted,     callback: this._onNotifyWarActionNormalExecuted },
                { type: NotifyType.BwCoUsingSkillTypeChanged,   callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwCoEnergyChanged,           callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoIdChanged,               callback: this._onNotifyBwCoIdChanged },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const player            = data.war.getPlayer(data.playerIndex);
            this._imgSkin.source    = WarHelpers.WarCommonHelpers.getImageSourceForCoEyeFrame(player.getUnitAndTileSkinId());
            this._updateImgCo();
            this._updateLabelFundAndAddFund();
            this._updateLabelEnergy();
        }

        private _onNotifyBwPlayerFundChanged(e: egret.Event): void {
            const eventData = e.data as Notify.NotifyData.BwPlayerFundChanged;
            const data      = this._getData();
            if (eventData === data.war.getPlayer(data.playerIndex)) {
                this._updateLabelFundAndAddFund();
            }
        }

        private _onNotifyWarActionNormalExecuted(): void {
            this._updateLabelFundAndAddFund();
        }

        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelEnergy();
        }

        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelEnergy();
        }

        private _onNotifyBwCoIdChanged(e: egret.Event): void {
            const eventData = e.data as Notify.NotifyData.BwCoIdChanged;
            const data      = this._getData();
            if (eventData === data.war.getPlayer(data.playerIndex)) {
                this._updateImgCo();
            }
        }

        public onItemTapEvent(): void {
            const data      = this._getData();
            const userId    = data.war.getPlayer(data.playerIndex).getUserId();
            if (userId != null) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserPanel, { userId });
            }
        }

        private _updateImgCo(): void {
            const data          = this._getData();
            const war           = data.war;
            const player        = war.getPlayer(data.playerIndex);
            this._imgCo.source  = war.getGameConfig().getCoEyeImageSource(player.getCoId(), player.getAliveState() !== Twns.Types.PlayerAliveState.Dead) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelFundAndAddFund(): void {
            const data          = this._getData();
            const war           = data.war;
            const player        = war.getPlayer(data.playerIndex);
            const labelFund     = this._labelFund;
            const labelAddFund  = this._labelAddFund;
            if ((war.getFogMap().checkHasFogCurrently())                                                &&
                (!war.getPlayerManager().getWatcherTeamIndexesForSelf().has(player.getTeamIndex()))
            ) {
                labelFund.text      = `????`;
                labelAddFund.text   = `(+??)`;
            } else {
                labelFund.text      = `${player.getFund()}`;
                labelAddFund.text   = `(+${war.getTileMap().getTotalIncomeForPlayer(player.getPlayerIndex())})`;
            }
        }

        private _updateLabelEnergy(): void {
            const data          = this._getData();
            const war           = data.war;
            const player        = war.getPlayer(data.playerIndex);
            const skillType     = player.getCoUsingSkillType();
            const label         = this._labelEnergy;
            const currentEnergy = player.getCoCurrentEnergy();
            if (skillType === Twns.Types.CoSkillType.Power) {
                label.text = `${currentEnergy}(P)`;
            } else if (skillType === Twns.Types.CoSkillType.SuperPower) {
                label.text = `${currentEnergy}(SP)`;
            } else {
                label.text = `${player.getCoCurrentEnergy()}`;
            }
        }
    }
}

// export default TwnsSpwTopPanel;
