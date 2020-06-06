
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Helpers      = Utility.Helpers;
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import WarMapModel  = WarMap.WarMapModel;
    import HelpPanel    = Common.HelpPanel;

    export class McrExitDetailPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrExitDetailPanel;

        private _btnHelpFog                     : GameUi.UiButton;
        private _btnHelpTimeLimit               : GameUi.UiButton;
        private _labelName                      : GameUi.UiLabel;
        private _labelWarPasswordTitle          : GameUi.UiLabel;
        private _labelHasFogTitle               : GameUi.UiLabel;
        private _labelTimeLimitTitle            : GameUi.UiLabel;
        private _labelInitialFundTitle          : GameUi.UiLabel;
        private _labelIncomeModifierTitle       : GameUi.UiLabel;
        private _labelInitialEnergyTitle        : GameUi.UiLabel;
        private _labelEnergyGrowthModifierTitle : GameUi.UiLabel;
        private _labelMoveRangeModifierTitle    : GameUi.UiLabel;
        private _labelAttackPowerModifierTitle  : GameUi.UiLabel;
        private _labelVisionRangeModifierTitle  : GameUi.UiLabel;
        private _labelListPlayerTitle           : GameUi.UiLabel;
        private _labelWarPassword               : GameUi.UiLabel;
        private _labelHasFog                    : GameUi.UiLabel;
        private _labelTimeLimit                 : GameUi.UiLabel;
        private _labelInitialFund               : GameUi.UiLabel;
        private _labelIncomeModifier            : GameUi.UiLabel;
        private _labelInitialEnergy             : GameUi.UiLabel;
        private _labelEnergyGrowthModifier      : GameUi.UiLabel;
        private _labelMoveRangeModifier         : GameUi.UiLabel;
        private _labelAttackPowerModifier       : GameUi.UiLabel;
        private _labelVisionRangeModifier       : GameUi.UiLabel;
        private _listPlayer                     : GameUi.UiScrollList;

        private _btnConfirm: GameUi.UiButton;
        private _btnCancel : GameUi.UiButton;

        private _openData: ProtoTypes.IMcrWaitingInfo;

        public static show(data: ProtoTypes.IMcrWaitingInfo): void {
            if (!McrExitDetailPanel._instance) {
                McrExitDetailPanel._instance = new McrExitDetailPanel();
            }
            McrExitDetailPanel._instance._openData = data;
            McrExitDetailPanel._instance.open();
        }
        public static hide(): void {
            if (McrExitDetailPanel._instance) {
                McrExitDetailPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => McrExitDetailPanel.hide();
            this.skinName = "resource/skins/multiCustomRoom/McrExitDetailPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnHelpFog,       callback: this._onTouchedBtnHelpFog },
                { ui: this._btnHelpTimeLimit, callback: this._onTouchedBtnHelpTimeLimit },
                { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];

            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected _onOpened(): void {
            this._updateView();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
        }

        private _onTouchedBtnHelpFog(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }
        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            McrExitDetailPanel.hide();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            McrProxy.reqExitCustomOnlineWar(this._openData.infoId);
            McrExitDetailPanel.hide();
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        private async _updateView(): Promise<void> {
            this._updateComponentsForLanguage();

            const info                              = this._openData;
            this._labelWarPassword.text             = info.warPassword ? info.warPassword : "----";
            this._labelHasFog.text                  = Lang.getText(info.hasFog ? Lang.Type.B0012 : Lang.Type.B0013);
            this._labelTimeLimit.text               = Helpers.getTimeDurationText(info.timeLimit);
            this._labelInitialFund.text             = `${info.initialFund}`;
            this._labelIncomeModifier.text          = `${info.incomeModifier}%`;
            this._labelInitialEnergy.text           = `${info.initialEnergy}%`;
            this._labelEnergyGrowthModifier.text    = `${info.energyGrowthModifier}%`;
            this._labelMoveRangeModifier.text       = `${info.moveRangeModifier > 0 ? "+" : ""}${info.moveRangeModifier}`;
            this._labelAttackPowerModifier.text     = `${info.attackPowerModifier > 0 ? "+" : ""}${info.attackPowerModifier}%`;
            this._labelVisionRangeModifier.text     = `${info.visionRangeModifier > 0 ? "+" : ""}${info.visionRangeModifier}`;
            this._listPlayer.bindData(await this._getDataForListPlayer());
        }

        private async _getDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
            const waitingInfo   = this._openData;
            const mapExtraData  = await WarMapModel.getExtraData(waitingInfo.mapFileName);
            if (!mapExtraData) {
                return [];
            } else {
                const configVersion     = waitingInfo.configVersion;
                const playerInfoList    = waitingInfo.playerInfoList;
                const info1             = getPlayerInfo(playerInfoList, 1);
                const info2             = getPlayerInfo(playerInfoList, 2);
                const data              : DataForPlayerRenderer[] = [
                    {
                        configVersion,
                        playerIndex     : 1,
                        userId          : info1 ? info1.userId : null,
                        teamIndex       : info1 ? info1.teamIndex : null,
                        coId            : info1 ? info1.coId : null,
                    },
                    {
                        configVersion,
                        playerIndex     : 2,
                        userId          : info2 ? info2.userId : null,
                        teamIndex       : info2 ? info2.teamIndex : null,
                        coId            : info2 ? info2.coId : null,
                    },
                ];

                if (mapExtraData.playersCount >= 3) {
                    const info = getPlayerInfo(playerInfoList, 3);
                    data.push({
                        configVersion,
                        playerIndex     : 3,
                        userId          : info ? info.userId : null,
                        teamIndex       : info ? info.teamIndex : null,
                        coId            : info ? info.coId : null,
                    });
                }
                if (mapExtraData.playersCount >= 4) {
                    const info = getPlayerInfo(playerInfoList, 4);
                    data.push({
                        configVersion,
                        playerIndex     : 4,
                        userId          : info ? info.userId : null,
                        teamIndex       : info ? info.teamIndex : null,
                        coId            : info ? info.coId : null,
                    });
                }

                return data;
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                        = Lang.getText(Lang.Type.B0245);
            this._labelWarPasswordTitle.text            = `${Lang.getText(Lang.Type.B0186)}:`;
            this._labelHasFogTitle.text                 = `${Lang.getText(Lang.Type.B0020)}:`;
            this._labelTimeLimitTitle.text              = `${Lang.getText(Lang.Type.B0188)}:`;
            this._labelInitialFundTitle.text            = `${Lang.getText(Lang.Type.B0178)}:`;
            this._labelIncomeModifierTitle.text         = `${Lang.getText(Lang.Type.B0179)}:`;
            this._labelInitialEnergyTitle.text          = `${Lang.getText(Lang.Type.B0180)}:`;
            this._labelEnergyGrowthModifierTitle.text   = `${Lang.getText(Lang.Type.B0181)}:`;
            this._labelMoveRangeModifierTitle.text      = `${Lang.getText(Lang.Type.B0182)}:`;
            this._labelAttackPowerModifierTitle.text    = `${Lang.getText(Lang.Type.B0183)}:`;
            this._labelVisionRangeModifierTitle.text    = `${Lang.getText(Lang.Type.B0184)}:`;
            this._labelListPlayerTitle.text             = `${Lang.getText(Lang.Type.B0232)}:`;
            this._btnConfirm.label                      = Lang.getText(Lang.Type.B0022);
            this._btnCancel.label                       = Lang.getText(Lang.Type.B0146);
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        userId          : number | null;
        teamIndex       : number | null;
        coId            : number | null;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelNickname  : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;
        private _labelTeam      : GameUi.UiLabel;
        private _labelCoName    : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForPlayerRenderer;
            this._labelIndex.text       = Helpers.getColorTextForPlayerIndex(data.playerIndex);
            this._labelTeam.text        = data.teamIndex != null ? Helpers.getTeamText(data.teamIndex) : "??";
            this._labelCoName.text      = Utility.ConfigManager.getCoNameAndTierText(data.configVersion, data.coId);
            User.UserModel.getUserNickname(data.userId).then(name => this._labelNickname.text = name);
        }
    }

    function getPlayerInfo(playerInfoList: ProtoTypes.IWarPlayerInfo[], playerIndex: number): ProtoTypes.IWarPlayerInfo | null {
        return playerInfoList.find(v => v.playerIndex === playerIndex);
    }
}
