
namespace TinyWars.SingleCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import WarMapModel      = WarMap.WarMapModel;
    import HelpPanel        = Common.HelpPanel;

    export class ScrCreateBasicSettingsPage extends GameUi.UiTabPage {
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelMapName           : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;

        private _labelFogTitle  : GameUi.UiLabel;
        private _btnPrevFog     : GameUi.UiButton;
        private _btnNextFog     : GameUi.UiButton;
        private _labelFog       : GameUi.UiLabel;
        private _btnHelpFog     : GameUi.UiButton;

        private _labelSaveSlotTitle : GameUi.UiLabel;
        private _labelSaveSlot      : GameUi.UiLabel;
        private _btnChangeSaveSlot  : GameUi.UiButton;

        private _labelPlayerListTitle   : GameUi.UiLabel;
        private _labelPlayerListTips    : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList;

        private _mapExtraData: ProtoTypes.IMapExtraData;

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreateBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnChangeSaveSlot,  callback: this._onTouchedBtnChangeSaveSlot, },
                { ui: this._btnPrevFog,         callback: this._onTouchedBtnPrevFog, },
                { ui: this._btnNextFog,         callback: this._onTouchedBtnNextFog, },
                { ui: this._btnHelpFog,         callback: this._onTouchedBtnHelpFog, },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.ScrCreateWarSaveSlotChanged,        callback: this._onNotifyScrCreateWarSaveSlotChanged },
                { type: Notify.Type.ScrCreateWarPlayerInfoListChanged,  callback: this._onNotifyScrCreateWarPlayerInfoListChanged },
            ];

            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected async _onOpened(): Promise<void> {
            this._mapExtraData = await ScrModel.getCreateWarMapExtraData();

            this._updateComponentsForLanguage();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateLabelSaveSlot();
            this._updateLabelFog();
            this._updateListPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyScrCreateWarSaveSlotChanged(e: egret.Event): void {
            this._updateLabelSaveSlot();
        }

        private _onNotifyScrCreateWarPlayerInfoListChanged(e: egret.Event): void {
            this._updateListPlayer();
        }

        private _onTouchedBtnChangeSaveSlot(e: egret.TouchEvent): void {
            ScrCreateSaveSlotsPanel.show();
        }

        private _onTouchedBtnPrevFog(e: egret.TouchEvent): void {
            ScrModel.setCreateWarPrevHasFog();
            this._updateLabelFog();
        }

        private _onTouchedBtnNextFog(e: egret.TouchEvent): void {
            ScrModel.setCreateWarNextHasFog();
            this._updateLabelFog();
        }

        private _onTouchedBtnHelpFog(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text        = `${Lang.getText(Lang.Type.B0225)}: `;
            this._labelPlayersCountTitle.text   = `${Lang.getText(Lang.Type.B0229)}: `;
            this._labelFogTitle.text            = `${Lang.getText(Lang.Type.B0020)}: `;
            this._labelSaveSlotTitle.text       = `${Lang.getText(Lang.Type.B0255)}: `;
            this._labelPlayerListTitle.text     = `${Lang.getText(Lang.Type.B0232)}: `;
            this._labelPlayerListTips.text      = `(${Lang.getText(Lang.Type.A0068)})`;
            this._btnChangeSaveSlot.label       = `${Lang.getText(Lang.Type.B0230)}`;
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInLanguage(this._mapExtraData.mapFileName).then(v => this._labelMapName.text = v);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapExtraData.playersCount;
        }

        private _updateLabelSaveSlot(): void {
            this._labelSaveSlot.text = "" + ScrModel.getCreateWarSaveSlotIndex();
        }

        private _updateLabelFog(): void {
            this._labelFog.text = Lang.getText(ScrModel.getCreateWarHasFog() ? Lang.Type.B0012 : Lang.Type.B0013);
        }

        private _updateListPlayer(): void {
            this._listPlayer.bindData(ScrModel.getCreateWarData().playerInfoList);
        }
    }

    type DataForPlayerRenderer = ProtoTypes.ICreateWarPlayerInfo;

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelPlayerIndex   : GameUi.UiLabel;
        private _labelTeamIndex     : GameUi.UiLabel;
        private _labelName          : GameUi.UiLabel;
        private _labelCoName        : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._labelTeamIndex.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedLabelTeamIndex, this);
            this._labelName.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedLabelName, this);
            this._labelCoName.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedLabelCoName, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForPlayerRenderer;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(data.playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(data.teamIndex);
            this._labelName.text        = data.userId ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256);
            this._updateLabelCoName();
        }

        private _onTouchedLabelTeamIndex(e: egret.TouchEvent): void {
            const data = this.data as DataForPlayerRenderer;
            ScrModel.tickCreateWarTeamIndex(data.playerIndex - 1);
        }

        private _onTouchedLabelName(e: egret.TouchEvent): void {
            const data = this.data as DataForPlayerRenderer;
            ScrModel.tickCreateWarUserId(data.playerIndex - 1);
        }

        private _onTouchedLabelCoName(e: egret.TouchEvent): void {
            const data = this.data as DataForPlayerRenderer;
            ScrCreateSettingsPanel.hide();
            ScrCreateCoListPanel.show({
                dataIndex   : data.playerIndex - 1,
                coId        : data.coId,
            });
        }

        private _updateLabelCoName(): void {
            const coId = (this.data as DataForPlayerRenderer).coId;
            if (coId == null) {
                this._labelCoName.text = `(${Lang.getText(Lang.Type.B0001)} CO)`;
            } else {
                const cfg               = ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), coId);
                this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
            }
        }
    }
}
