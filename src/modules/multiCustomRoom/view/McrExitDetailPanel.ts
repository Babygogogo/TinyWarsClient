
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Helpers      = Utility.Helpers;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import HelpPanel    = Common.HelpPanel;

    export class McrExitDetailPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrExitDetailPanel;

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
                content: Lang.getRichText(Lang.RichType.R002),
            });
        }
        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R003),
            });
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            McrExitDetailPanel.hide();
        }
        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            McrProxy.reqExitCustomOnlineWar(this._openData.id);
            McrExitDetailPanel.hide();
        }

        private async _updateView(): Promise<void> {
            const info = this._openData;
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
            const warInfo = this._openData;
            const mapInfo = await WarMap.WarMapModel.getMapDynamicInfoAsync(warInfo as Types.MapIndexKey);
            if (!mapInfo) {
                return [];
            } else {
                const data: DataForPlayerRenderer[] = [
                    {
                        playerIndex : 1,
                        nickname    : warInfo.p1UserNickname,
                        teamIndex   : warInfo.p1TeamIndex,
                        coId        : warInfo.p1CoId,
                    },
                    {
                        playerIndex : 2,
                        nickname    : warInfo.p2UserNickname,
                        teamIndex   : warInfo.p2TeamIndex,
                        coId        : warInfo.p2CoId,
                    },
                ];

                if (mapInfo.playersCount >= 3) {
                    data.push({
                        playerIndex : 3,
                        nickname    : warInfo.p3UserNickname,
                        teamIndex   : warInfo.p3TeamIndex,
                        coId        : warInfo.p3CoId,
                    });
                }
                if (mapInfo.playersCount >= 4) {
                    data.push({
                        playerIndex : 4,
                        nickname    : warInfo.p4UserNickname,
                        teamIndex   : warInfo.p4TeamIndex,
                        coId        : warInfo.p4CoId,
                    });
                }

                return data;
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
        nickname    : string | null;
        teamIndex   : number | null;
        coId        : number | null;
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
            this._labelNickname.text    = data.nickname || "????";
            this._labelTeam.text        = data.teamIndex != null ? Helpers.getTeamText(data.teamIndex) : "??";
            this._labelCoName.text      = data.coId == null
                ? (data.nickname == null ? "????" : `(${Lang.getText(Lang.Type.B0001)}CO)`)
                : ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), data.coId).name;
        }
    }
}
