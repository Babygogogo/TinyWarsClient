
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as RwModel                     from "../model/RwModel";

export type OpenDataForRwReplayWarInfoPage = {
    replayId: number | null;
};
export class RwReplayWarInfoPage extends UiTabPage<OpenDataForRwReplayWarInfoPage> {
    private readonly _labelMapNameTitle             : UiLabel;
    private readonly _labelMapName                  : UiLabel;

    private readonly _labelWarTypeTitle             : UiLabel;
    private readonly _labelWarType                  : UiLabel;

    private readonly _labelGlobalRatingTitle        : UiLabel;
    private readonly _labelGlobalRating             : UiLabel;

    private readonly _labelMyRatingTitle            : UiLabel;
    private readonly _labelMyRating                 : UiLabel;

    private readonly _labelTurnIndexTitle           : UiLabel;
    private readonly _labelTurnIndex                : UiLabel;

    private readonly _labelEndTimeTitle             : UiLabel;
    private readonly _labelEndTime                  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/replayWar/RwReplayWarInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgReplayGetInfoList,   callback: this._onNotifyMsgReplayGetInfoList },
        ]);
        this.left       = 0;
        this.right      = 0;
        this.top        = 0;
        this.bottom     = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForReplayInfo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgReplayGetInfoList(e: egret.Event): void {
        const data      = e.data as ProtoTypes.NetMessage.MsgReplayGetInfoList.IS;
        const replayId  = this._getOpenData().replayId;
        if ((replayId != null) && ((data.infos || []).find(v => v.replayBriefInfo.replayId === replayId))) {
            this._updateComponentsForReplayInfo();
        }
    }

    private _onTouchedBtnTimerTypeHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0574),
            content: Lang.getText(LangTextType.R0003),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text            = Lang.getText(LangTextType.B0225);
        this._labelWarTypeTitle.text            = Lang.getText(LangTextType.B0599);
        this._labelGlobalRatingTitle.text       = Lang.getText(LangTextType.B0364);
        this._labelMyRatingTitle.text           = Lang.getText(LangTextType.B0363);
        this._labelTurnIndexTitle.text          = Lang.getText(LangTextType.B0600);
        this._labelEndTimeTitle.text            = Lang.getText(LangTextType.B0601);
    }

    private _updateComponentsForReplayInfo(): void {
        this._updateLabelWarType();
        this._updateLabelGlobalRating();
        this._updateLabelMyRating();
        this._updateLabelMapName();
        this._updateLabelTurnIndex();
        this._updateLabelEndTime();
    }

    private async _updateLabelWarType(): Promise<void> {
        const replayInfo        = this._getReplayInfo();
        this._labelWarType.text = replayInfo ? Lang.getWarTypeName(replayInfo.replayBriefInfo.warType) : `??`;
    }

    private async _updateLabelGlobalRating(): Promise<void> {
        const replayInfo                = this._getReplayInfo();
        const replayBriefInfo           = replayInfo ? replayInfo.replayBriefInfo : null;
        const raters                    = replayBriefInfo ? replayBriefInfo.totalRaters : null;
        this._labelGlobalRating.text    = raters ? (replayBriefInfo.totalRating / raters).toFixed(2) : Lang.getText(LangTextType.B0001);
    }

    private async _updateLabelMyRating(): Promise<void> {
        const replayInfo            = this._getReplayInfo();
        const rating                = replayInfo ? replayInfo.myRating : null;
        this._labelMyRating.text    = rating == null ? Lang.getText(LangTextType.B0001) : `${rating}`;
    }

    private async _updateLabelMapName(): Promise<void> {
        const replayInfo        = this._getReplayInfo();
        this._labelMapName.text = replayInfo ? await WarMapModel.getMapNameInCurrentLanguage(replayInfo.replayBriefInfo.mapId) : undefined;
    }

    private async _updateLabelTurnIndex(): Promise<void> {
        const replayInfo            = this._getReplayInfo();
        const replayBriefInfo       = replayInfo ? replayInfo.replayBriefInfo : undefined;
        this._labelTurnIndex.text   = replayBriefInfo
            ? `${replayBriefInfo.turnIndex}, ${replayBriefInfo.executedActionsCount}`
            : `??`;
    }

    private async _updateLabelEndTime(): Promise<void> {
        const replayInfo        = this._getReplayInfo();
        const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
        this._labelEndTime.text = replayBriefInfo
            ? Helpers.getTimestampShortText(replayBriefInfo.warEndTime)
            : `??`;
    }

    private _getReplayInfo(): ProtoTypes.Replay.IReplayInfo {
        return RwModel.getReplayInfo(this._getOpenData().replayId);
    }
}
