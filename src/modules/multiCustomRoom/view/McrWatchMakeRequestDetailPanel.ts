
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;

    type OpenDataForMcrWatchMakeRequestDetailPanel = {
        watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    }
    export class McrWatchMakeRequestDetailPanel extends GameUi.UiPanel<OpenDataForMcrWatchMakeRequestDetailPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McrWatchMakeRequestDetailPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _labelYes       : GameUi.UiLabel;
        private _labelNo        : GameUi.UiLabel;
        private _listPlayer     : GameUi.UiScrollList<DataForPlayerRenderer>;
        private _btnConfirm     : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;

        private _dataForListPlayer  : DataForPlayerRenderer[];

        public static show(openData: OpenDataForMcrWatchMakeRequestDetailPanel): void {
            if (!McrWatchMakeRequestDetailPanel._instance) {
                McrWatchMakeRequestDetailPanel._instance = new McrWatchMakeRequestDetailPanel();
            }
            McrWatchMakeRequestDetailPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (McrWatchMakeRequestDetailPanel._instance) {
                await McrWatchMakeRequestDetailPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiCustomRoom/McrWatchMakeRequestDetailPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._dataForListPlayer = this._generateDataForListPlayer();
            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            this._dataForListPlayer = null;
        }

        public setPlayerSelected(playerIndex: number, selected: boolean): void {
            const dataList      = this._dataForListPlayer;
            const index         = dataList.findIndex(value => value.playerInfo.playerIndex === playerIndex);
            const data          = dataList[index];
            data.isRequesting   = selected;
            this._listPlayer.updateSingleData(index, data);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const userIds: number[] = [];
            for (const data of this._dataForListPlayer) {
                if (data.isRequesting) {
                    userIds.push(data.playerInfo.userId);
                }
            }
            if (userIds.length > 0) {
                MultiPlayerWar.MpwProxy.reqWatchMakeRequest(this._getOpenData().watchInfo.warInfo.warId, userIds);
            }
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._listPlayer.bindData(this._dataForListPlayer);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0207);
            this._labelYes.text         = Lang.getText(Lang.Type.B0012);
            this._labelNo.text          = Lang.getText(Lang.Type.B0013);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label       = Lang.getText(Lang.Type.B0154);
        }

        private _generateDataForListPlayer(): DataForPlayerRenderer[] {
            const openData          = this._getOpenData().watchInfo;
            const warInfo           = openData.warInfo;
            const configVersion     = warInfo.settingsForCommon.configVersion;
            const ongoingDstUserIds = openData.ongoingDstUserIds || [];
            const requestDstUserIds = openData.requestDstUserIds || [];
            const playerInfoList    = warInfo.playerInfoList;

            const dataList: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playerInfoList.length; ++playerIndex) {
                const playerInfo    = playerInfoList.find(v => v.playerIndex === playerIndex);
                const userId        = playerInfo.userId;
                dataList.push({
                    panel           : this,
                    configVersion,
                    playerInfo,
                    isRequested     : requestDstUserIds.indexOf(userId) >= 0,
                    isWatching      : ongoingDstUserIds.indexOf(userId) >= 0,
                    isRequesting    : false,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        panel           : McrWatchMakeRequestDetailPanel;
        configVersion   : string;
        playerInfo      : ProtoTypes.Structure.IWarPlayerInfo;
        isRequested     : boolean;
        isWatching      : boolean;
        isRequesting    : boolean;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _labelIndex     : GameUi.UiLabel;
        private _labelTeam      : GameUi.UiLabel;
        private _labelName      : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _imgAccept      : GameUi.UiImage;
        private _imgDecline     : GameUi.UiImage;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
            const playerInfo        = data.playerInfo;
            this._labelIndex.text   = Lang.getPlayerForceName(playerInfo.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(playerInfo.teamIndex);
            User.UserModel.getUserNickname(playerInfo.userId).then(name => {
                this._labelName.text = name + ConfigManager.getCoNameAndTierText(data.configVersion, playerInfo.coId);
            });
            if (!playerInfo.isAlive) {
                this._imgAccept.visible     = false;
                this._imgDecline.visible    = false;
                this._labelState.visible    = true;
                this._labelState.text       = `(${Lang.getText(Lang.Type.B0056)})`;
            } else {
                if (playerInfo.userId === User.UserModel.getSelfUserId()) {
                    this._imgAccept.visible     = false;
                    this._imgDecline.visible    = false;
                    this._labelState.visible    = true;
                    this._labelState.text       = `(${Lang.getText(Lang.Type.B0216)})`;
                } else {
                    if (data.isRequested) {
                        this._imgAccept.visible     = false;
                        this._imgDecline.visible    = false;
                        this._labelState.visible    = true;
                        this._labelState.text       = `${Lang.getText(Lang.Type.B0212)}`;
                    } else {
                        if (data.isWatching) {
                            this._imgAccept.visible     = false;
                            this._imgDecline.visible    = false;
                            this._labelState.visible    = true;
                            this._labelState.text       = `${Lang.getText(Lang.Type.B0213)}`;
                        } else {
                            this._imgAccept.visible     = data.isRequesting;
                            this._imgDecline.visible    = !data.isRequesting;
                            this._labelState.visible    = false;
                        }
                    }
                }
            }
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            if ((this._imgAccept.visible) || (this._imgDecline.visible)) {
                const data = this.data;
                data.panel.setPlayerSelected(data.playerInfo.playerIndex, !data.isRequesting);
            }
        }
    }
}
