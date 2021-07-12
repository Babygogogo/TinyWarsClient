
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiScrollList }                 from "../../../utility/ui/UiScrollList";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { MpwProxy }                     from "../../multiPlayerWar/model/MpwProxy";
import { UserModel }                    from "../../user/model/UserModel";

type OpenDataForMcrWatchHandleRequestDetailPanel = {
    watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
};
export class McrWatchHandleRequestDetailPanel extends UiPanel<OpenDataForMcrWatchHandleRequestDetailPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: McrWatchHandleRequestDetailPanel;

    private _labelMenuTitle         : UiLabel;
    private _labelYes               : UiLabel;
    private _labelNo                : UiLabel;
    private _labelIsOpponent        : UiLabel;
    private _labelIsWatchingOthers  : UiLabel;
    private _listPlayer             : UiScrollList<DataForRequesterRenderer>;
    private _btnConfirm             : UiButton;
    private _btnCancel              : UiButton;

    private _dataForListPlayer  : DataForRequesterRenderer[];

    public static show(openData: OpenDataForMcrWatchHandleRequestDetailPanel): void {
        if (!McrWatchHandleRequestDetailPanel._instance) {
            McrWatchHandleRequestDetailPanel._instance = new McrWatchHandleRequestDetailPanel();
        }
        McrWatchHandleRequestDetailPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (McrWatchHandleRequestDetailPanel._instance) {
            await McrWatchHandleRequestDetailPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/multiCustomRoom/McrWatchHandleRequestDetailPanel.exml";
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
        MpwProxy.reqWatchHandleRequest(this._getOpenData().watchInfo.warInfo.warId, acceptUserIds, declineUserIds);
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
    panel           : McrWatchHandleRequestDetailPanel;
    userId          : number;
    isWatchingOthers: boolean;
    isOpponent      : boolean;
    isAccept        : boolean;
};
class RequesterRenderer extends UiListItemRenderer<DataForRequesterRenderer> {
    private _labelName              : UiLabel;
    private _labelIsOpponent        : UiLabel;
    private _labelIsWatchingOthers  : UiLabel;
    private _imgAccept              : UiImage;
    private _imgDecline             : UiImage;

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
