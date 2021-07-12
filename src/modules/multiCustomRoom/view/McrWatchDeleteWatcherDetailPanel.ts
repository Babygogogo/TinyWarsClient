
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }                 from "../../../utility/ui/UiScrollList";
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

type OpenDataForMcrWatchDeleteWatcherDetailPanel = {
    watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
};
export class McrWatchDeleteWatcherDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrWatchDeleteWatcherDetailPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: McrWatchDeleteWatcherDetailPanel;

    private _labelMenuTitle         : TwnsUiLabel.UiLabel;
    private _labelDelete            : TwnsUiLabel.UiLabel;
    private _labelKeep              : TwnsUiLabel.UiLabel;
    private _labelIsOpponent        : TwnsUiLabel.UiLabel;
    private _labelIsWatchingOthers  : TwnsUiLabel.UiLabel;
    private _listPlayer             : TwnsUiScrollList.UiScrollList<DataForRequesterRenderer>;
    private _btnConfirm             : TwnsUiButton.UiButton;
    private _btnCancel              : TwnsUiButton.UiButton;

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
            MpwProxy.reqWatchDeleteWatcher(this._getOpenData().watchInfo.warInfo.warId, deleteUserIds);
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
        this._labelMenuTitle.text           = Lang.getText(LangTextType.B0219);
        this._labelDelete.text              = Lang.getText(LangTextType.B0220);
        this._labelKeep.text                = Lang.getText(LangTextType.B0221);
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
};
class RequesterRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRequesterRenderer> {
    private _labelName              : TwnsUiLabel.UiLabel;
    private _labelIsOpponent        : TwnsUiLabel.UiLabel;
    private _labelIsWatchingOthers  : TwnsUiLabel.UiLabel;
    private _imgDelete              : TwnsUiImage.UiImage;
    private _imgKeep                : TwnsUiImage.UiImage;

    protected _onDataChanged(): void {
        const data                          = this.data;
        this._labelIsOpponent.text          = data.isOpponent ? Lang.getText(LangTextType.B0012) : "";
        this._labelIsWatchingOthers.text    = data.isWatchingOthers ? Lang.getText(LangTextType.B0012) : "";
        this._imgDelete.visible             = data.isDelete;
        this._imgKeep.visible               = !data.isDelete;
        UserModel.getUserNickname(data.userId).then(name => this._labelName.text = name);
    }

    public onItemTapEvent(e: eui.ItemTapEvent): void {
        if ((this._imgDelete.visible) || (this._imgKeep.visible)) {
            const data = this.data;
            data.panel.setRequesterSelected(e.itemIndex, !data.isDelete);
        }
    }
}
