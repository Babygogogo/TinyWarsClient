
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiTabPage        from "../../tools/ui/UiTabPage";
// import WarMapModel          from "../../warMap/model/WarMapModel";
// import RwModel              from "../model/RwModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.ReplayWar {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;

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
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgReplayGetBriefInfo,   callback: this._onNotifyMsgReplayGetBriefInfo },
                { type: NotifyType.MsgReplayGetSelfRating,  callback: this._onNotifyMsgReplayGetSelfRating },
            ]);
            this.left       = 0;
            this.right      = 0;
            this.top        = 0;
            this.bottom     = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForReplayBriefInfo();
            this._updateLabelMyRating();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgReplayGetBriefInfo(e: egret.Event): void {
            const data      = e.data as CommonProto.NetMessage.MsgReplayGetReplayInfo.IS;
            const replayId  = this._getOpenData()?.replayId;
            if ((replayId != null) && (replayId === data.replayId)) {
                this._updateComponentsForReplayBriefInfo();
            }
        }

        private _onNotifyMsgReplayGetSelfRating(e: egret.Event): void {
            const data      = e.data as CommonProto.NetMessage.MsgReplayGetSelfRating.IS;
            const replayId  = this._getOpenData()?.replayId;
            if ((replayId != null) && (replayId === data.replayId)) {
                this._updateLabelMyRating();
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

        private _updateComponentsForReplayBriefInfo(): void {
            this._updateLabelWarType();
            this._updateLabelGlobalRating();
            this._updateLabelMapName();
            this._updateLabelTurnIndex();
            this._updateLabelEndTime();
        }

        private async _updateLabelWarType(): Promise<void> {
            const replayBriefInfo   = await this._getReplayInfo();
            this._labelWarType.text = replayBriefInfo ? Lang.getWarTypeName(Helpers.getExisted(replayBriefInfo.warType)) ?? CommonConstants.ErrorTextForUndefined : `??`;
        }

        private async _updateLabelGlobalRating(): Promise<void> {
            const replayBriefInfo           = await this._getReplayInfo();
            const raters                    = replayBriefInfo ? replayBriefInfo.totalRaters : null;
            this._labelGlobalRating.text    = raters ? (Helpers.getExisted(replayBriefInfo?.totalRating) / raters).toFixed(2) : Lang.getText(LangTextType.B0001);
        }

        private async _updateLabelMyRating(): Promise<void> {
            const replayId              = this._getOpenData()?.replayId;
            const rating                = replayId == null ? null : await Twns.ReplayWar.RwModel.getReplaySelfRating(replayId);
            this._labelMyRating.text    = rating == null ? Lang.getText(LangTextType.B0001) : `${rating}`;
        }

        private async _updateLabelMapName(): Promise<void> {
            const mapId             = (await this._getReplayInfo())?.mapId;
            this._labelMapName.text = mapId == null
                ? `----`
                : (await Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId)) ?? CommonConstants.ErrorTextForUndefined;
        }

        private async _updateLabelTurnIndex(): Promise<void> {
            const replayBriefInfo       = await this._getReplayInfo();
            this._labelTurnIndex.text   = replayBriefInfo
                ? `${replayBriefInfo.turnIndex}, ${replayBriefInfo.executedActionsCount}`
                : `??`;
        }

        private async _updateLabelEndTime(): Promise<void> {
            const replayBriefInfo   = await this._getReplayInfo();
            this._labelEndTime.text = replayBriefInfo
                ? Helpers.getTimestampShortText(Helpers.getExisted(replayBriefInfo.warEndTime))
                : `??`;
        }

        private async _getReplayInfo(): Promise<CommonProto.Replay.IReplayInfo | null> {
            const replayId = this._getOpenData()?.replayId;
            return replayId == null
                ? null
                : await Twns.ReplayWar.RwModel.getReplayInfo(replayId);
        }
    }
}

// export default TwnsRwReplayWarInfoPage;
