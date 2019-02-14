
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Types        = Utility.Types;
    import HelpPanel    = Common.HelpPanel;

    export class McrContinueDetailPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrContinueDetailPanel;

        private _btnHelpFog                 : GameUi.UiButton;
        private _btnHelpTimeLimit           : GameUi.UiButton;
        private _labelWarPassword           : GameUi.UiLabel;
        private _labelHasFog                : GameUi.UiLabel;
        private _labelTimeLimit             : GameUi.UiLabel;
        private _labelInitialFund           : GameUi.UiLabel;
        private _labelIncomeModifier        : GameUi.UiLabel;
        private _labelInitialEnergy         : GameUi.UiLabel;
        private _labelEnergyGrowthModifier  : GameUi.UiLabel;
        private _labelMoveRangeModifier     : GameUi.UiLabel;
        private _labelAttackPowerModifier   : GameUi.UiLabel;
        private _labelVisionRangeModifier   : GameUi.UiLabel;
        private _listPlayer                 : GameUi.UiScrollList;

        private _btnConfirm: GameUi.UiButton;
        private _btnCancel : GameUi.UiButton;

        private _openData: ProtoTypes.IMcwOngoingDetail;

        public static show(data: ProtoTypes.IMcwOngoingDetail): void {
            if (!McrContinueDetailPanel._instance) {
                McrContinueDetailPanel._instance = new McrContinueDetailPanel();
            }
            McrContinueDetailPanel._instance._openData = data;
            McrContinueDetailPanel._instance.open();
        }
        public static hide(): void {
            if (McrContinueDetailPanel._instance) {
                McrContinueDetailPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => McrContinueDetailPanel.hide();
            this.skinName = "resource/skins/multiCustomRoom/McrContinueDetailPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnHelpFog,       callback: this._onTouchedBtnHelpFog },
                { ui: this._btnHelpTimeLimit, callback: this._onTouchedBtnHelpTimeLimit },
                { ui: this._btnCancel,        callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm,       callback: this._onTouchedBtnConfirm },
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
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S20),
                content: Lang.getRichText(Lang.RichType.R002),
            });
        }
        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S21),
                content: Lang.getRichText(Lang.RichType.R003),
            });
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            McrContinueDetailPanel.hide();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            McrProxy.reqExitCustomOnlineWar(this._openData.id);
            McrContinueDetailPanel.hide();
        }

        private async _updateView(): Promise<void> {
            const info = this._openData;
            this._labelWarPassword.text             = info.warPassword ? info.warPassword : "----";
            this._labelHasFog.text                  = Lang.getText(Lang.BigType.B01, info.hasFog ? Lang.SubType.S12 : Lang.SubType.S13);
            this._labelTimeLimit.text               = Helpers.getTimeText(info.timeLimit);
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
            const warInfo = this._openData;
            const mapInfo = await WarMap.WarMapModel.getMapDynamicInfoAsync(warInfo as Types.MapIndexKey);
            if (!mapInfo) {
                return [];
            } else {
                const data: DataForPlayerRenderer[] = [
                    {
                        playerIndex: 1,
                        playerName : warInfo.p1UserNickname,
                        teamIndex  : warInfo.p1TeamIndex,
                    },
                    {
                        playerIndex: 2,
                        playerName : warInfo.p2UserNickname,
                        teamIndex  : warInfo.p2TeamIndex,
                    },
                ];

                if (mapInfo.playersCount >= 3) {
                    data.push({
                        playerIndex: 3,
                        playerName : warInfo.p3UserNickname,
                        teamIndex  : warInfo.p3TeamIndex,
                    });
                }
                if (mapInfo.playersCount >= 4) {
                    data.push({
                        playerIndex: 4,
                        playerName : warInfo.p4UserNickname,
                        teamIndex  : warInfo.p4TeamIndex,
                    });
                }
                data[warInfo.playerIndexInTurn - 1].defeatTimestamp = warInfo.enterTurnTime + warInfo.timeLimit;

                return data;
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex     : number;
        playerName      : string;
        teamIndex       : number;
        defeatTimestamp?: number;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;
        private _labelTeam : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForPlayerRenderer;
            if (data.defeatTimestamp != null) {
                const leftTime = data.defeatTimestamp - Time.TimeModel.getServerTimestamp();
                this._labelIndex.text       = Helpers.getColorText(data.playerIndex);
                this._labelIndex.textColor  = 0x00FF00;
                this._labelTeam.text        = Helpers.getTeamText(data.teamIndex);
                this._labelTeam.textColor   = 0x00FF00
                this._labelName.text        = data.playerName + (leftTime > 0
                    ? ` (${Lang.getText(Lang.BigType.B01, Lang.SubType.S27)}:${Helpers.getTimeText(leftTime)})`
                    : ` (${Lang.getText(Lang.BigType.B01, Lang.SubType.S28)})`);
                this._labelName.textColor   = 0x00FF00;
            } else {
                this._labelIndex.text       = Helpers.getColorText(data.playerIndex);
                this._labelIndex.textColor  = 0xFFFFFF;
                this._labelTeam.text        = Helpers.getTeamText(data.teamIndex);
                this._labelTeam.textColor   = 0xFFFFFF;
                this._labelName.text        = data.playerName;
                this._labelName.textColor   = 0xFFFFFF;
            }
        }
    }
}
