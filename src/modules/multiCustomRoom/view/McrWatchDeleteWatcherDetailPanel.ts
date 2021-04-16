
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;
    import Types        = Utility.Types;

    type OpenDataForMcrWatchDeleteWatcherDetailPanel = {
        watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    }
    export class McrWatchDeleteWatcherDetailPanel extends GameUi.UiPanel<OpenDataForMcrWatchDeleteWatcherDetailPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McrWatchDeleteWatcherDetailPanel;

        private _labelMenuTitle         : GameUi.UiLabel;
        private _labelDelete            : GameUi.UiLabel;
        private _labelKeep              : GameUi.UiLabel;
        private _labelIsOpponent        : GameUi.UiLabel;
        private _labelIsWatchingOthers  : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList<DataForRequesterRenderer, RequesterRenderer>;
        private _btnConfirm             : GameUi.UiButton;
        private _btnCancel              : GameUi.UiButton;

        private _dataForListPlayer  : DataForRequesterRenderer[];

        public static show(openData: OpenDataForMcrWatchDeleteWatcherDetailPanel): void {
            if (!McrWatchDeleteWatcherDetailPanel._instance) {
                McrWatchDeleteWatcherDetailPanel._instance = new McrWatchDeleteWatcherDetailPanel();
            }
            McrWatchDeleteWatcherDetailPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (McrWatchDeleteWatcherDetailPanel._instance) {
                await McrWatchDeleteWatcherDetailPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiCustomRoom/McrWatchDeleteWatcherDetailPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._listPlayer.setItemRenderer(RequesterRenderer);

            this._dataForListPlayer = this._generateDataForListPlayer();
            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            this._listPlayer.clear();
            this._dataForListPlayer = null;
        }

        public setRequesterSelected(index: number, selected: boolean): void {
            const dataList  = this._dataForListPlayer;
            const data      = dataList[index];
            data.isDelete   = selected;
            this._listPlayer.updateSingleData(index, data);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const deleteUserIds : number[] = [];
            for (const data of this._dataForListPlayer) {
                if (data.isDelete) {
                    deleteUserIds.push(data.userId);
                }
            }
            if (deleteUserIds.length) {
                MultiPlayerWar.MpwProxy.reqWatchDeleteWatcher(this._getOpenData().watchInfo.warInfo.warId, deleteUserIds);
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
            this._labelMenuTitle.text           = Lang.getText(Lang.Type.B0219);
            this._labelDelete.text              = Lang.getText(Lang.Type.B0220);
            this._labelKeep.text                = Lang.getText(Lang.Type.B0221);
            this._labelIsOpponent.text          = Lang.getText(Lang.Type.B0217);
            this._labelIsWatchingOthers.text    = Lang.getText(Lang.Type.B0218);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
        }

        private _generateDataForListPlayer(): DataForRequesterRenderer[] {
            const openData          = this._getOpenData().watchInfo;
            const warInfo           = openData.warInfo;
            const playerInfoList    = warInfo.playerInfoList;
            const dataList          : DataForRequesterRenderer[] = [];
            for (const info of openData.requesterInfos) {
                const userId = info.userId;
                dataList.push({
                    panel           : this,
                    userId,
                    isWatchingOthers: !!info.isRequestingOthers || !!info.isWatchingOthers,
                    isOpponent      : playerInfoList.some(v => v.userId === userId),
                    isDelete        : false,
                });
            }

            return dataList;
        }
    }

    type DataForRequesterRenderer = {
        panel           : McrWatchDeleteWatcherDetailPanel;
        userId          : number;
        isWatchingOthers: boolean;
        isOpponent      : boolean;
        isDelete        : boolean;
    }

    class RequesterRenderer extends GameUi.UiListItemRenderer<DataForRequesterRenderer> {
        private _labelName              : GameUi.UiLabel;
        private _labelIsOpponent        : GameUi.UiLabel;
        private _labelIsWatchingOthers  : GameUi.UiLabel;
        private _imgDelete              : GameUi.UiImage;
        private _imgKeep                : GameUi.UiImage;

        protected dataChanged(): void {
            super.dataChanged();

            const data                          = this.data;
            this._labelIsOpponent.text          = data.isOpponent ? Lang.getText(Lang.Type.B0012) : "";
            this._labelIsWatchingOthers.text    = data.isWatchingOthers ? Lang.getText(Lang.Type.B0012) : "";
            this._imgDelete.visible             = data.isDelete;
            this._imgKeep.visible               = !data.isDelete;
            User.UserModel.getUserNickname(data.userId).then(name => this._labelName.text = name);
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            if ((this._imgDelete.visible) || (this._imgKeep.visible)) {
                const data = this.data;
                data.panel.setRequesterSelected(e.itemIndex, !data.isDelete);
            }
        }
    }
}
