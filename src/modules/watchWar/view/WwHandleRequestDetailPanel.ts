
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import UserModel                from "../../user/model/UserModel";
import WwProxy                  from "../model/WwProxy";

namespace TwnsWwHandleRequestDetailPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    type OpenDataForMcrWatchHandleRequestDetailPanel = {
        watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    };
    export class WwHandleRequestDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrWatchHandleRequestDetailPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WwHandleRequestDetailPanel;

        private _labelMenuTitle         : TwnsUiLabel.UiLabel;
        private _labelYes               : TwnsUiLabel.UiLabel;
        private _labelNo                : TwnsUiLabel.UiLabel;
        private _labelIsOpponent        : TwnsUiLabel.UiLabel;
        private _labelIsWatchingOthers  : TwnsUiLabel.UiLabel;
        private _listPlayer             : TwnsUiScrollList.UiScrollList<DataForRequesterRenderer>;
        private _btnConfirm             : TwnsUiButton.UiButton;
        private _btnCancel              : TwnsUiButton.UiButton;

        private _dataForListPlayer  : DataForRequesterRenderer[];

        public static show(openData: OpenDataForMcrWatchHandleRequestDetailPanel): void {
            if (!WwHandleRequestDetailPanel._instance) {
                WwHandleRequestDetailPanel._instance = new WwHandleRequestDetailPanel();
            }
            WwHandleRequestDetailPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WwHandleRequestDetailPanel._instance) {
                await WwHandleRequestDetailPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/watchWar/WwHandleRequestDetailPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            const acceptUserIds : number[] = [];
            const declineUserIds: number[] = [];
            for (const data of this._dataForListPlayer) {
                if (data.isAccept) {
                    acceptUserIds.push(data.userId);
                } else {
                    declineUserIds.push(data.userId);
                }
            }
            WwProxy.reqWatchHandleRequest(this._getOpenData().watchInfo.warInfo.warId, acceptUserIds, declineUserIds);
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
            this._labelMenuTitle.text           = Lang.getText(LangTextType.B0208);
            this._labelYes.text                 = Lang.getText(LangTextType.B0214);
            this._labelNo.text                  = Lang.getText(LangTextType.B0215);
            this._labelIsOpponent.text          = Lang.getText(LangTextType.B0217);
            this._labelIsWatchingOthers.text    = Lang.getText(LangTextType.B0218);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
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
                    isAccept        : false,
                });
            }

            return dataList;
        }
    }

    type DataForRequesterRenderer = {
        panel           : WwHandleRequestDetailPanel;
        userId          : number;
        isWatchingOthers: boolean;
        isOpponent      : boolean;
        isAccept        : boolean;
    };
    class RequesterRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRequesterRenderer> {
        private _labelName              : TwnsUiLabel.UiLabel;
        private _labelIsOpponent        : TwnsUiLabel.UiLabel;
        private _labelIsWatchingOthers  : TwnsUiLabel.UiLabel;
        private _imgAccept              : TwnsUiImage.UiImage;
        private _imgDecline             : TwnsUiImage.UiImage;

        protected _onDataChanged(): void {
            const data                          = this.data;
            this._labelIsOpponent.text          = data.isOpponent ? Lang.getText(LangTextType.B0012) : "";
            this._labelIsWatchingOthers.text    = data.isWatchingOthers ? Lang.getText(LangTextType.B0012) : "";
            this._imgAccept.visible             = data.isAccept;
            this._imgDecline.visible            = !data.isAccept;
            UserModel.getUserNickname(data.userId).then(name => this._labelName.text = name);
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            if ((this._imgAccept.visible) || (this._imgDecline.visible)) {
                const data = this.data;
                data.panel.setRequesterSelected(e.itemIndex, !data.isAccept);
            }
        }
    }
}

export default TwnsWwHandleRequestDetailPanel;
