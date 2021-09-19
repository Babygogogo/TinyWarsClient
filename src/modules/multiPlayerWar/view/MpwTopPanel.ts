
import ChatModel                from "../../chat/model/ChatModel";
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
import MpwProxy                 from "../../multiPlayerWar/model/MpwProxy";
import TwnsMpwWar               from "../../multiPlayerWar/model/MpwWar";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import SoundManager             from "../../tools/helpers/SoundManager";
import Timer                    from "../../tools/helpers/Timer";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import NotifyData               from "../../tools/notify/NotifyData";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import UserModel                from "../../user/model/UserModel";
import UserProxy                from "../../user/model/UserProxy";
import TwnsUserPanel            from "../../user/view/UserPanel";
import TwnsUserSettingsPanel    from "../../user/view/UserSettingsPanel";
import TwnsMpwWarMenuPanel      from "./MpwWarMenuPanel";

namespace TwnsMpwTopPanel {
    import UserPanel            = TwnsUserPanel.UserPanel;
    import CommonCoListPanel    = TwnsCommonCoListPanel.CommonCoListPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    // eslint-disable-next-line no-shadow
    enum PanelSkinState {
        Normal,
        Expanded,
    }

    type OpenData = {
        war     : TwnsMpwWar.MpwWar;
    };
    export class MpwTopPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MpwTopPanel;

        private readonly _listPlayer!           : TwnsUiScrollList.UiScrollList<DataForListPlayer>;
        private readonly _groupTimer!           : eui.Group;
        private readonly _labelTimer!           : TwnsUiLabel.UiLabel;
        private readonly _btnChat!              : TwnsUiButton.UiButton;
        private readonly _btnSettings!          : TwnsUiButton.UiButton;

        private readonly _groupCo!              : eui.Group;
        private readonly _imgSkin!              : TwnsUiImage.UiImage;
        private readonly _imgCo!                : TwnsUiImage.UiImage;

        private readonly _groupPlayer!          : eui.Group;
        private readonly _labelPlayer!          : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerState!     : TwnsUiLabel.UiLabel;

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelCurrEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelPowerEnergy!     : TwnsUiLabel.UiLabel;
        private readonly _labelZoneEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelFund!            : TwnsUiLabel.UiLabel;
        private readonly _labelAddFund!         : TwnsUiLabel.UiLabel;
        private readonly _btnExpand!            : TwnsUiButton.UiButton;
        private readonly _btnNarrow!            : TwnsUiButton.UiButton;

        public static show(openData: OpenData): void {
            if (!MpwTopPanel._instance) {
                MpwTopPanel._instance = new MpwTopPanel();
            }
            MpwTopPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MpwTopPanel._instance) {
                await MpwTopPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/multiPlayerWar/MpwTopPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TimeTick,                        callback: this._onNotifyTimeTick },
                { type: NotifyType.BwPlayerFundChanged,             callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwPlayerIndexInTurnChanged,      callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: NotifyType.BwCoEnergyChanged,               callback: this._onNotifyBwCoEnergyChanged },
                { type: NotifyType.BwCoUsingSkillTypeChanged,       callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwTileBeCaptured,                callback: this._onNotifyBwTileBeCaptured },
                { type: NotifyType.MsgChatGetAllReadProgressList,   callback: this._onNotifyMsgChatGetAllReadProgressList },
                { type: NotifyType.MsgChatUpdateReadProgress,       callback: this._onNotifyMsgChatUpdateReadProgress },
                { type: NotifyType.MsgChatGetAllMessages,           callback: this._onNotifyMsgChatGetAllMessages },
                { type: NotifyType.MsgChatAddMessage,               callback: this._onNotifyMsgChatAddMessage },
                { type: NotifyType.MsgUserGetOnlineState,           callback: this._onNotifyMsgUserGetOnlineState },
            ]);
            this._setUiListenerArray([
                { ui: this._groupPlayer,        callback: this._onTouchedGroupPlayer },
                { ui: this._groupCo,            callback: this._onTouchedGroupCo },
                { ui: this._groupInfo,          callback: this._onTouchedGroupInfo },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnSettings,        callback: this._onTouchedBtnSettings, },
                { ui: this._btnExpand,          callback: this._onTouchedBtnExpand },
                { ui: this._btnNarrow,          callback: this._onTouchedBtnNarrow },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._setPanelSkinState(PanelSkinState.Normal);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for notify.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTimeTick(): void {
            this._updateGroupTimer();

            const war = this._getOpenData().war;
            if ((!war.getIsExecutingAction()) && (war.checkIsBoot())) {
                MpwProxy.reqMpwCommonHandleBoot(Helpers.getExisted(war.getWarId()));
            }

            const userId = war.getPlayerInTurn().getUserId();
            if ((userId != null)                        &&
                (userId !== UserModel.getSelfUserId())  &&
                (Timer.getServerTimestamp() % 60 == 0)
            ) {
                UserProxy.reqUserGetOnlineState(userId);
            }
        }
        private _onNotifyBwPlayerFundChanged(): void {
            this._updateLabelFundAndAddFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(): void {
            const war = this._getOpenData().war;
            this._updateView();
            SoundManager.playCoBgmWithWar(war, false);

            const userId = war.getPlayerInTurn().getUserId();
            if ((userId != null) && (userId !== UserModel.getSelfUserId())) {
                UserProxy.reqUserGetOnlineState(userId);
            }
        }
        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelEnergy();
            SoundManager.playCoBgmWithWar(this._getOpenData().war, false);
        }
        private _onNotifyBwTileBeCaptured(): void {
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
        private _onNotifyMsgUserGetOnlineState(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserGetOnlineState.IS;
            if (data.userId === this._getOpenData().war.getPlayerInTurn().getUserId()) {
                this._updateLabelPlayerState();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for touch.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedGroupPlayer(): void {
            const userId = this._getOpenData().war.getPlayerInTurn().getUserId();
            if (userId != null) {
                UserPanel.show({ userId });

                if (userId !== UserModel.getSelfUserId()) {
                    UserProxy.reqUserGetOnlineState(userId);
                }

                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            }
        }

        private _onTouchedGroupCo(): void {
            CommonCoListPanel.show({
                war : this._getOpenData().war,
            });
            TwnsMpwWarMenuPanel.MpwWarMenuPanel.hide();
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedGroupInfo(): void {
            CommonCoListPanel.show({
                war : this._getOpenData().war,
            });
            TwnsMpwWarMenuPanel.MpwWarMenuPanel.hide();
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedBtnChat(): void {
            TwnsMpwWarMenuPanel.MpwWarMenuPanel.hide();
            TwnsChatPanel.ChatPanel.show({});
        }

        private _onTouchedBtnSettings(): void {
            TwnsUserSettingsPanel.UserSettingsPanel.show();
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
            this._updateListPlayer();
            this._updateImgSkinAndCo();
            this._updateLabelPlayerState();
            this._updateLabelPlayer();
            this._updateGroupTimer();
            this._updateLabelFundAndAddFund();
            this._updateLabelEnergy();
            this._updateBtnChat();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
        }

        private _updateListPlayer(): void {
            this._listPlayer.bindData(this._createDataArrayForListPlayer());
        }

        private async _updateLabelPlayerState(): Promise<void> {
            const userId    = this._getOpenData().war.getPlayerInTurn().getUserId();
            const label     = this._labelPlayerState;
            if ((userId == null) || (userId === UserModel.getSelfUserId())) {
                label.text      = Lang.getText(LangTextType.B0676);
                label.textColor = Types.ColorValue.Green;
            } else {
                const userPublicInfo = await UserModel.getUserPublicInfo(userId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                if ((userPublicInfo == null) || (!userPublicInfo.isOnline)) {
                    label.text      = Lang.getText(LangTextType.B0677);
                    label.textColor = Types.ColorValue.Red;
                } else {
                    label.text      = Lang.getText(LangTextType.B0676);
                    label.textColor = (Timer.getServerTimestamp() - Helpers.getExisted(userPublicInfo.lastActivityTime) > 60) ? Types.ColorValue.Yellow : Types.ColorValue.Green;
                }
            }
        }

        private async _updateLabelPlayer(): Promise<void> {
            const player            = this._getOpenData().war.getPlayerInTurn();
            this._labelPlayer.text  = `${await player.getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; })}`;
        }

        private _updateGroupTimer(): void {
            const war       = this._getOpenData().war;
            const group     = this._groupTimer;
            const restTime  = war ? war.getBootRestTime() : null;
            if (restTime == null) {
                group.visible = false;
            } else {
                group.visible = true;

                const label     = this._labelTimer;
                label.text      = Helpers.getTimeDurationText2(restTime);
                label.textColor = restTime >= 30 * 60
                    ? 0xFFFFFF
                    : (restTime >= 5 * 60 ? 0xFFFF00 : 0xFF4400);
            }
        }

        private _updateLabelFundAndAddFund(): void {
            const war           = this._getOpenData().war;
            const playerInTurn  = war.getPlayerInTurn();
            const labelFund     = this._labelFund;
            const labelAddFund  = this._labelAddFund;
            if ((war.getFogMap().checkHasFogCurrently())                                                        &&
                (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(playerInTurn.getTeamIndex()))
            ) {
                labelFund.text      = `????`;
                labelAddFund.text   = `(+??)`;
            } else {
                labelFund.text      = `${playerInTurn.getFund()}`;
                labelAddFund.text   = `(+${war.getTileMap().getTotalIncomeForPlayer(playerInTurn.getPlayerIndex())})`;
            }
        }

        private _updateImgSkinAndCo(): void {
            const player            = this._getOpenData().war.getPlayerInTurn();
            this._imgSkin.source    = WarCommonHelpers.getImageSourceForCoEyeFrame(player.getUnitAndTileSkinId());
            this._imgCo.source      = ConfigManager.getCoEyeImageSource(player.getCoId(), player.getAliveState() !== Types.PlayerAliveState.Dead);
        }

        private _updateLabelEnergy(): void {
            const war = this._getOpenData().war;
            if ((war) && (war.getIsRunning())) {
                const player            = war.getPlayerInTurn();
                const skillType         = player.getCoUsingSkillType();
                const labelCurrEnergy   = this._labelCurrEnergy;
                const currentEnergy     = player.getCoCurrentEnergy();
                if (skillType === Types.CoSkillType.Power) {
                    labelCurrEnergy.text = `${currentEnergy}(P)`;
                } else if (skillType === Types.CoSkillType.SuperPower) {
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
            this._btnChat.setRedVisible(ChatModel.checkHasUnreadMessage());
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
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex < playerIndexInTurn; ++playerIndex) {
                dataArray.push({
                    war,
                    playerIndex,
                });
            }
            return dataArray;
        }
    }

    type DataForListPlayer = {
        war         : TwnsMpwWar.MpwWar
        playerIndex : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForListPlayer> {
        private readonly _imgSkin!          : TwnsUiImage.UiImage;
        private readonly _imgCo!            : TwnsUiImage.UiImage;
        private readonly _imgOnlineState!   : TwnsUiImage.UiImage;
        private readonly _labelEnergy!      : TwnsUiLabel.UiLabel;
        private readonly _labelFund!        : TwnsUiLabel.UiLabel;
        private readonly _labelAddFund!     : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.MsgUserGetOnlineState,       callback: this._onNotifyMsgUserGetOnlineState },
                { type: NotifyType.TimeTick,                    callback: this._onNotifyTimeTick },
                { type: NotifyType.BwPlayerFundChanged,         callback: this._onNotifyBwPlayerFundChanged },
                { type: NotifyType.BwTileBeCaptured,            callback: this._onNotifyBwTileBeCaptured },
                { type: NotifyType.BwCoUsingSkillTypeChanged,   callback: this._onNotifyBwCoUsingSkillChanged },
                { type: NotifyType.BwCoEnergyChanged,           callback: this._onNotifyBwCoEnergyChanged },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const player            = data.war.getPlayer(data.playerIndex);
            this._imgSkin.source    = WarCommonHelpers.getImageSourceForCoEyeFrame(player.getUnitAndTileSkinId());
            this._imgCo.source      = ConfigManager.getCoEyeImageSource(player.getCoId(), player.getAliveState() !== Types.PlayerAliveState.Dead);
            this._updateImgOnlineState();
            this._updateLabelFundAndAddFund();
            this._updateLabelEnergy();
        }

        private _onNotifyMsgUserGetOnlineState(): void {
            this._updateImgOnlineState();
        }

        private _onNotifyTimeTick(): void {
            const data      = this._getData();
            const war       = data.war;
            const userId    = war.getPlayer(data.playerIndex).getUserId();
            if ((userId != null)                        &&
                (userId !== UserModel.getSelfUserId())  &&
                (Timer.getServerTimestamp() % 60 == 0)
            ) {
                UserProxy.reqUserGetOnlineState(userId);
            }
        }

        private _onNotifyBwPlayerFundChanged(e: egret.Event): void {
            const eventData = e.data as NotifyData.BwPlayerFundChanged;
            const data      = this._getData();
            if (eventData === data.war.getPlayer(data.playerIndex)) {
                this._updateLabelFundAndAddFund();
            }
        }

        private _onNotifyBwTileBeCaptured(): void {
            this._updateLabelFundAndAddFund();
        }

        private _onNotifyBwCoUsingSkillChanged(): void {
            this._updateLabelEnergy();
        }

        private _onNotifyBwCoEnergyChanged(): void {
            this._updateLabelEnergy();
        }

        public onItemTapEvent(): void {
            const data      = this._getData();
            const userId    = data.war.getPlayer(data.playerIndex).getUserId();
            if (userId != null) {
                UserPanel.show({ userId });

                if (userId !== UserModel.getSelfUserId()) {
                    UserProxy.reqUserGetOnlineState(userId);
                }
            }
        }

        private async _updateImgOnlineState(): Promise<void> {
            const data      = this._getData();
            const userId    = data.war.getPlayer(data.playerIndex).getUserId();
            const img       = this._imgOnlineState;
            if ((userId == null) || (userId === UserModel.getSelfUserId())) {
                img.source = `uncompressedColorGreen0000`;
            } else {
                const userPublicInfo = await UserModel.getUserPublicInfo(userId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                if ((userPublicInfo == null) || (!userPublicInfo.isOnline)) {
                    img.source = `uncompressedColorRed0000`;
                } else {
                    img.source = (Timer.getServerTimestamp() - Helpers.getExisted(userPublicInfo.lastActivityTime) > 60) ? `uncompressedColorYellow0000` : `uncompressedColorGreen0000`;
                }
            }
        }

        private _updateLabelFundAndAddFund(): void {
            const data          = this._getData();
            const war           = data.war;
            const player        = war.getPlayer(data.playerIndex);
            const labelFund     = this._labelFund;
            const labelAddFund  = this._labelAddFund;
            if ((war.getFogMap().checkHasFogCurrently())                                                &&
                (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(player.getTeamIndex()))
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
            if (skillType === Types.CoSkillType.Power) {
                label.text = `${currentEnergy}(P)`;
            } else if (skillType === Types.CoSkillType.SuperPower) {
                label.text = `${currentEnergy}(SP)`;
            } else {
                label.text = `${player.getCoCurrentEnergy()}`;
            }
        }
    }
}

export default TwnsMpwTopPanel;
