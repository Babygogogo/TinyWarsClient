
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiTabPage        from "../../tools/ui/UiTabPage";
// import WarMapModel          from "../../warMap/model/WarMapModel";
// import RwModel              from "../model/RwModel";

namespace TwnsRwReplayWarInfoPage {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenDataForRwReplayWarInfoPage = {
        replayId: number;
    } | null;
    export class RwReplayWarInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForRwReplayWarInfoPage> {
        private readonly _labelMapNameTitle!            : TwnsUiLabel.UiLabel;
        private readonly _labelMapName!                 : TwnsUiLabel.UiLabel;

        private readonly _labelWarTypeTitle!            : TwnsUiLabel.UiLabel;
        private readonly _labelWarType!                 : TwnsUiLabel.UiLabel;

        private readonly _labelGlobalRatingTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelGlobalRating!            : TwnsUiLabel.UiLabel;

        private readonly _labelMyRatingTitle!           : TwnsUiLabel.UiLabel;
        private readonly _labelMyRating!                : TwnsUiLabel.UiLabel;

        private readonly _labelTurnIndexTitle!          : TwnsUiLabel.UiLabel;
        private readonly _labelTurnIndex!               : TwnsUiLabel.UiLabel;

        private readonly _labelEndTimeTitle!            : TwnsUiLabel.UiLabel;
        private readonly _labelEndTime!                 : TwnsUiLabel.UiLabel;

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
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgReplayGetInfoList(e: egret.Event): void {
            const data      = e.data as ProtoTypes.NetMessage.MsgReplayGetInfoList.IS;
            const replayId  = this._getOpenData()?.replayId;
            if ((replayId != null) && ((data.infos || []).find(v => Helpers.getExisted(v.replayBriefInfo).replayId === replayId))) {
                this._updateComponentsForReplayInfo();
            }
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
            this._labelWarType.text = replayInfo ? Lang.getWarTypeName(Helpers.getExisted(replayInfo.replayBriefInfo?.warType)) ?? CommonConstants.ErrorTextForUndefined : `??`;
        }

        private async _updateLabelGlobalRating(): Promise<void> {
            const replayInfo                = this._getReplayInfo();
            const replayBriefInfo           = replayInfo ? replayInfo.replayBriefInfo : null;
            const raters                    = replayBriefInfo ? replayBriefInfo.totalRaters : null;
            this._labelGlobalRating.text    = raters ? (Helpers.getExisted(replayBriefInfo?.totalRating) / raters).toFixed(2) : Lang.getText(LangTextType.B0001);
        }

        private async _updateLabelMyRating(): Promise<void> {
            const replayInfo            = this._getReplayInfo();
            const rating                = replayInfo ? replayInfo.myRating : null;
            this._labelMyRating.text    = rating == null ? Lang.getText(LangTextType.B0001) : `${rating}`;
        }

        private async _updateLabelMapName(): Promise<void> {
            const replayInfo        = this._getReplayInfo();
            this._labelMapName.text = replayInfo
                ? (await WarMapModel.getMapNameInCurrentLanguage(Helpers.getExisted(replayInfo.replayBriefInfo?.mapId)) ?? CommonConstants.ErrorTextForUndefined)
                : CommonConstants.ErrorTextForUndefined;
        }

        private async _updateLabelTurnIndex(): Promise<void> {
            const replayInfo            = this._getReplayInfo();
            const replayBriefInfo       = replayInfo?.replayBriefInfo;
            this._labelTurnIndex.text   = replayBriefInfo
                ? `${replayBriefInfo.turnIndex}, ${replayBriefInfo.executedActionsCount}`
                : `??`;
        }

        private async _updateLabelEndTime(): Promise<void> {
            const replayInfo        = this._getReplayInfo();
            const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
            this._labelEndTime.text = replayBriefInfo
                ? Helpers.getTimestampShortText(Helpers.getExisted(replayBriefInfo.warEndTime))
                : `??`;
        }

        private _getReplayInfo(): ProtoTypes.Replay.IReplayInfo | null {
            const replayId = this._getOpenData()?.replayId;
            return replayId == null
                ? null
                : (RwModel.getReplayInfo(replayId) ?? null);
        }
    }
}

// export default TwnsRwReplayWarInfoPage;
