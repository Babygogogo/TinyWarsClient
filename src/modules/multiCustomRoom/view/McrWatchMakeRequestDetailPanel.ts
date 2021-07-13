
import TwnsUiImage                      from "../../../utility/ui/UiImage";
import TwnsUiListItemRenderer           from "../../../utility/ui/UiListItemRenderer";
import TwnsUiPanel                      from "../../../utility/ui/UiPanel";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiScrollList                 from "../../../utility/ui/UiScrollList";
import { ConfigManager }                from "../../../utility/ConfigManager";
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

type OpenDataForMcrWatchMakeRequestDetailPanel = {
    watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
};
export class McrWatchMakeRequestDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrWatchMakeRequestDetailPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: McrWatchMakeRequestDetailPanel;

    private _labelMenuTitle : TwnsUiLabel.UiLabel;
    private _labelYes       : TwnsUiLabel.UiLabel;
    private _labelNo        : TwnsUiLabel.UiLabel;
    private _listPlayer     : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;
    private _btnConfirm     : TwnsUiButton.UiButton;
    private _btnCancel      : TwnsUiButton.UiButton;

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
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            MpwProxy.reqWatchMakeRequest(this._getOpenData().watchInfo.warInfo.warId, userIds);
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
        this._labelMenuTitle.text   = Lang.getText(LangTextType.B0207);
        this._labelYes.text         = Lang.getText(LangTextType.B0012);
        this._labelNo.text          = Lang.getText(LangTextType.B0013);
        this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
        this._btnCancel.label       = Lang.getText(LangTextType.B0154);
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
};
class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private _labelIndex     : TwnsUiLabel.UiLabel;
    private _labelTeam      : TwnsUiLabel.UiLabel;
    private _labelName      : TwnsUiLabel.UiLabel;
    private _labelState     : TwnsUiLabel.UiLabel;
    private _imgAccept      : TwnsUiImage.UiImage;
    private _imgDecline     : TwnsUiImage.UiImage;

    protected _onDataChanged(): void {
        const data              = this.data;
        const playerInfo        = data.playerInfo;
        this._labelIndex.text   = Lang.getPlayerForceName(playerInfo.playerIndex);
        this._labelTeam.text    = Lang.getPlayerTeamName(playerInfo.teamIndex);
        UserModel.getUserNickname(playerInfo.userId).then(name => {
            this._labelName.text = name + ConfigManager.getCoNameAndTierText(data.configVersion, playerInfo.coId);
        });
        if (!playerInfo.isAlive) {
            this._imgAccept.visible     = false;
            this._imgDecline.visible    = false;
            this._labelState.visible    = true;
            this._labelState.text       = `(${Lang.getText(LangTextType.B0056)})`;
        } else {
            if (playerInfo.userId === UserModel.getSelfUserId()) {
                this._imgAccept.visible     = false;
                this._imgDecline.visible    = false;
                this._labelState.visible    = true;
                this._labelState.text       = `(${Lang.getText(LangTextType.B0216)})`;
            } else {
                if (data.isRequested) {
                    this._imgAccept.visible     = false;
                    this._imgDecline.visible    = false;
                    this._labelState.visible    = true;
                    this._labelState.text       = `${Lang.getText(LangTextType.B0212)}`;
                } else {
                    if (data.isWatching) {
                        this._imgAccept.visible     = false;
                        this._imgDecline.visible    = false;
                        this._labelState.visible    = true;
                        this._labelState.text       = `${Lang.getText(LangTextType.B0213)}`;
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
