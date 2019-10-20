
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;
    import Types        = Utility.Types;

    export class McrWatchMakeRequestDetailPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McrWatchMakeRequestDetailPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _labelYes       : GameUi.UiLabel;
        private _labelNo        : GameUi.UiLabel;
        private _listPlayer     : GameUi.UiScrollList;
        private _btnConfirm     : GameUi.UiButton;
        private _btnCancel      : GameUi.UiButton;

        private _openData           : ProtoTypes.IMcwWatchInfo;
        private _dataForListPlayer  : DataForPlayerRenderer[];

        public static show(warInfo: ProtoTypes.IMcwWatchInfo): void {
            if (!McrWatchMakeRequestDetailPanel._instance) {
                McrWatchMakeRequestDetailPanel._instance = new McrWatchMakeRequestDetailPanel();
            }
            McrWatchMakeRequestDetailPanel._instance._openData = warInfo;
            McrWatchMakeRequestDetailPanel._instance.open();
        }
        public static hide(): void {
            if (McrWatchMakeRequestDetailPanel._instance) {
                McrWatchMakeRequestDetailPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/multiCustomRoom/McrWatchMakeRequestDetailPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected _onOpened(): void {
            this._dataForListPlayer = this._generateDataForListPlayer();
            this._updateView();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
            this._dataForListPlayer = null;
        }

        public setPlayerSelected(playerIndex: number, selected: boolean): void {
            const dataList      = this._dataForListPlayer;
            const index         = dataList.findIndex(value => value.playerIndex === playerIndex);
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
                    userIds.push(data.userId);
                }
            }
            if (userIds.length > 0) {
                McrProxy.reqWatchMakeRequest(this._openData.mcwDetail.id, userIds);
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
            const openData          = this._openData;
            const warDetail         = openData.mcwDetail;
            const ongoingDstUserIds = openData.ongoingDstUserIds || [];
            const requestDstUserIds = openData.requestDstUserIds || [];
            const dataList          : DataForPlayerRenderer[] = [];

            dataList.push({
                panel           : this,
                configVersion   : warDetail.configVersion,
                playerIndex     : 1,
                teamIndex       : warDetail.p1TeamIndex,
                nickname        : warDetail.p1UserNickname,
                coId            : warDetail.p1CoId,
                isAlive         : warDetail.p1IsAlive,
                userId          : warDetail.p1UserId,
                isRequested     : requestDstUserIds.indexOf(warDetail.p1UserId) >= 0,
                isWatching      : ongoingDstUserIds.indexOf(warDetail.p1UserId) >= 0,
                isRequesting    : false,
            }, {
                panel           : this,
                configVersion   : warDetail.configVersion,
                playerIndex     : 2,
                teamIndex       : warDetail.p2TeamIndex,
                nickname        : warDetail.p2UserNickname,
                coId            : warDetail.p2CoId,
                isAlive         : warDetail.p2IsAlive,
                userId          : warDetail.p2UserId,
                isRequested     : requestDstUserIds.indexOf(warDetail.p2UserId) >= 0,
                isWatching      : ongoingDstUserIds.indexOf(warDetail.p2UserId) >= 0,
                isRequesting    : false,
            });
            if (warDetail.p3UserId != null) {
                dataList.push({
                    panel           : this,
                    configVersion   : warDetail.configVersion,
                    playerIndex     : 3,
                    teamIndex       : warDetail.p3TeamIndex,
                    nickname        : warDetail.p3UserNickname,
                    coId            : warDetail.p3CoId,
                    isAlive         : warDetail.p3IsAlive,
                    userId          : warDetail.p3UserId,
                    isRequested     : requestDstUserIds.indexOf(warDetail.p3UserId) >= 0,
                    isWatching      : ongoingDstUserIds.indexOf(warDetail.p3UserId) >= 0,
                    isRequesting    : false,
                });
            }
            if (warDetail.p4UserId != null) {
                dataList.push({
                    panel           : this,
                    configVersion   : warDetail.configVersion,
                    playerIndex     : 4,
                    teamIndex       : warDetail.p4TeamIndex,
                    nickname        : warDetail.p4UserNickname,
                    coId            : warDetail.p4CoId,
                    isAlive         : warDetail.p4IsAlive,
                    userId          : warDetail.p4UserId,
                    isRequested     : requestDstUserIds.indexOf(warDetail.p4UserId) >= 0,
                    isWatching      : ongoingDstUserIds.indexOf(warDetail.p4UserId) >= 0,
                    isRequesting    : false,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        panel           : McrWatchMakeRequestDetailPanel;
        configVersion   : string;
        playerIndex     : number;
        teamIndex       : number;
        nickname        : string;
        coId            : number | null;
        isAlive         : boolean;
        userId          : number;
        isRequested     : boolean;
        isWatching      : boolean;
        isRequesting    : boolean;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelIndex     : GameUi.UiLabel;
        private _labelTeam      : GameUi.UiLabel;
        private _labelName      : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _imgAccept      : GameUi.UiImage;
        private _imgDecline     : GameUi.UiImage;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const coConfig          = data.coId == null ? null : ConfigManager.getCoBasicCfg(data.configVersion, data.coId);
            this._labelIndex.text   = Lang.getPlayerForceName(data.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(data.teamIndex);
            this._labelName.text    = data.nickname + (coConfig ? `(${coConfig.name}(T${coConfig.tier}))` : `(${Lang.getText(Lang.Type.B0211)} CO)`);
            if (!data.isAlive) {
                this._imgAccept.visible     = false;
                this._imgDecline.visible    = false;
                this._labelState.visible    = true;
                this._labelState.text       = `(${Lang.getText(Lang.Type.B0056)})`;
            } else {
                if (data.userId === User.UserModel.getSelfUserId()) {
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
                const data = this.data as DataForPlayerRenderer;
                data.panel.setPlayerSelected(data.playerIndex, !data.isRequesting);
            }
        }
    }
}
