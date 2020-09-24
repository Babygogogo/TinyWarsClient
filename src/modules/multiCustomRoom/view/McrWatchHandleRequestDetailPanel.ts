
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;

    export class McrWatchHandleRequestDetailPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McrWatchHandleRequestDetailPanel;

        private _labelMenuTitle         : GameUi.UiLabel;
        private _labelYes               : GameUi.UiLabel;
        private _labelNo                : GameUi.UiLabel;
        private _labelIsOpponent        : GameUi.UiLabel;
        private _labelIsWatchingOthers  : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList;
        private _btnConfirm             : GameUi.UiButton;
        private _btnCancel              : GameUi.UiButton;

        private _openData           : ProtoTypes.MultiCustomWar.IMcwWatchInfo;
        private _dataForListPlayer  : DataForRequesterRenderer[];

        public static show(warInfo: ProtoTypes.MultiCustomWar.IMcwWatchInfo): void {
            if (!McrWatchHandleRequestDetailPanel._instance) {
                McrWatchHandleRequestDetailPanel._instance = new McrWatchHandleRequestDetailPanel();
            }
            McrWatchHandleRequestDetailPanel._instance._openData = warInfo;
            McrWatchHandleRequestDetailPanel._instance.open();
        }
        public static hide(): void {
            if (McrWatchHandleRequestDetailPanel._instance) {
                McrWatchHandleRequestDetailPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/multiCustomRoom/McrWatchHandleRequestDetailPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
            this._listPlayer.setItemRenderer(RequesterRenderer);
        }

        protected _onOpened(): void {
            this._dataForListPlayer = this._generateDataForListPlayer();
            this._updateView();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
            this._dataForListPlayer = null;
        }

        public setRequesterSelected(index: number, selected: boolean): void {
            const dataList  = this._dataForListPlayer;
            const data      = dataList[index];
            data.isAccept   = selected;
            this._listPlayer.updateSingleData(index, data);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const acceptUserIds : number[] = [];
            const declineUserIds: number[] = [];
            for (const data of this._dataForListPlayer) {
                if (data.isAccept) {
                    acceptUserIds.push(data.userId);
                } else {
                    declineUserIds.push(data.userId);
                }
            }
            McrProxy.reqWatchHandleRequest(this._openData.warInfo.warId, acceptUserIds, declineUserIds);
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
            this._labelMenuTitle.text           = Lang.getText(Lang.Type.B0208);
            this._labelYes.text                 = Lang.getText(Lang.Type.B0214);
            this._labelNo.text                  = Lang.getText(Lang.Type.B0215);
            this._labelIsOpponent.text          = Lang.getText(Lang.Type.B0217);
            this._labelIsWatchingOthers.text    = Lang.getText(Lang.Type.B0218);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
        }

        private _generateDataForListPlayer(): DataForRequesterRenderer[] {
            const openData          = this._openData;
            const warInfo           = openData.warInfo;
            const playerInfoList    = warInfo.playerInfoList;
            const dataList          : DataForRequesterRenderer[] = [];
            for (const info of this._openData.requesterInfos) {
                const userId = info.userId;
                dataList.push({
                    panel           : this,
                    userId,
                    isWatchingOthers: !!info.isRequestingOthers || !!info.isWatchingOthers,
                    isOpponent      : playerInfoList.some(v => v.userId === userId),
                    isAccept        : false,
                });
            }

            return dataList;
        }
    }

    type DataForRequesterRenderer = {
        panel           : McrWatchHandleRequestDetailPanel;
        userId          : number;
        isWatchingOthers: boolean;
        isOpponent      : boolean;
        isAccept        : boolean;
    }

    class RequesterRenderer extends eui.ItemRenderer {
        private _labelName              : GameUi.UiLabel;
        private _labelIsOpponent        : GameUi.UiLabel;
        private _labelIsWatchingOthers  : GameUi.UiLabel;
        private _imgAccept              : GameUi.UiImage;
        private _imgDecline             : GameUi.UiImage;

        protected dataChanged(): void {
            super.dataChanged();

            const data                          = this.data as DataForRequesterRenderer;
            this._labelIsOpponent.text          = data.isOpponent ? Lang.getText(Lang.Type.B0012) : "";
            this._labelIsWatchingOthers.text    = data.isWatchingOthers ? Lang.getText(Lang.Type.B0012) : "";
            this._imgAccept.visible             = data.isAccept;
            this._imgDecline.visible            = !data.isAccept;
            User.UserModel.getUserNickname(data.userId).then(name => this._labelName.text = name);
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            if ((this._imgAccept.visible) || (this._imgDecline.visible)) {
                const data = this.data as DataForRequesterRenderer;
                data.panel.setRequesterSelected(e.itemIndex, !data.isAccept);
            }
        }
    }
}
