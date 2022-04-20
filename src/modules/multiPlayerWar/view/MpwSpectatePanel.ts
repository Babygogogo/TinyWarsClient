
// import TwnsBwUnitListPanel              from "../../baseWar/view/BwUnitListPanel";
// import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
// import MpwModel                         from "../../multiPlayerWar/model/MpwModel";
// import MpwProxy                         from "../../multiPlayerWar/model/MpwProxy";
// import TwnsSpmCreateSfwSaveSlotsPanel   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
// import TwnsTwWar                        from "../../testWar/model/TwWar";
// import FloatText                        from "../../tools/helpers/FloatText";
// import FlowManager                      from "../../tools/helpers/FlowManager";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Notify                           from "../../tools/notify/Notify";
// import TwnsNotifyType                   from "../../tools/notify/NotifyType";
// import ProtoTypes                       from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiImage                      from "../../tools/ui/UiImage";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import UserModel                        from "../../user/model/UserModel";
// import UserProxy                        from "../../user/model/UserProxy";
// import TwnsMpwWar                       from "../model/MpwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar {
    import LangTextType                 = TwnsLangTextType.LangTextType;
    import NotifyType                   = TwnsNotifyType.NotifyType;

    export type OpenDataForMpwSpectatePanel = void;
    export class MpwSpectatePanel extends TwnsUiPanel.UiPanel<OpenDataForMpwSpectatePanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;

        private readonly _labelGameSpectatorTitle!      : TwnsUiLabel.UiLabel;
        private readonly _labelGameSpectator!           : TwnsUiLabel.UiLabel;
        private readonly _labelOwnSpectatorTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelOwnSpectator!            : TwnsUiLabel.UiLabel;
        private readonly _labelIncomingRequestTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelIncomingRequest!         : TwnsUiLabel.UiLabel;
        private readonly _btnMakeRequest!               : TwnsUiButton.UiButton;
        private readonly _btnHandleRequest!             : TwnsUiButton.UiButton;
        private readonly _btnDeleteWatcher!             : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwWatchGetOutgoingInfo,          callback: this._onNotifyMsgMpwWatchGetOutgoingInfo },
                { type: NotifyType.MsgMpwWatchGetIncomingInfo,          callback: this._onNotifyMsgMpwWatchGetIncomingInfo },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                                   callback: this.close },
                { ui: this._btnMakeRequest,                             callback: this._onTouchedBtnMakeRequest },
                { ui: this._btnHandleRequest,                           callback: this._onTouchedBtnHandleRequest },
                { ui: this._btnDeleteWatcher,                           callback: this._onTouchedBtnDeleteWatcher },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): MultiPlayerWar.MpwWar {
            return Helpers.getExisted(MultiPlayerWar.MpwModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for notify.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMpwWatchGetOutgoingInfo(): void {
            this._updateLabelGameSpectator();
        }

        private _onNotifyMsgMpwWatchGetIncomingInfo(): void {
            this._updateBtnHandleRequest();
            this._updateLabelGameSpectator();
            this._updateLabelIncomingRequest();
            this._updateLabelOwnSpectator();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks for ui.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _onTouchedBtnMakeRequest(): Promise<void> {
            const war       = this._getWar();
            const warId     = Helpers.getExisted(war.getWarId());
            const info      = await WatchWar.WwModel.getWatchOutgoingInfo(warId);
            const userIdSet = new Set<number>();
            for (const userId of info?.ongoingDstUserIdArray ?? []) {
                userIdSet.add(userId);
            }
            for (const userId of info?.requestDstUserIdArray ?? []) {
                userIdSet.add(userId);
            }

            const selfUserId = Helpers.getExisted(UserModel.getSelfUserId());
            for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
                const userId = player.getUserId();
                if ((userId != null) && (userId !== selfUserId) && (!userIdSet.has(userId))) {
                    TwnsPanelManager.open(TwnsPanelConfig.Dict.WwMakeRequestDetailPanel, {
                        warId,
                    });
                    return;
                }
            }

            FloatText.show(Lang.getText(LangTextType.A0299));
        }

        private async _onTouchedBtnHandleRequest(): Promise<void> {
            const warId = Helpers.getExisted(this._getWar().getWarId());
            if ((await WatchWar.WwModel.getWatchIncomingInfo(warId))?.requestSrcUserIdArray?.length) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.WwHandleRequestDetailPanel, {
                    warId,
                });
            } else {
                FloatText.show(Lang.getText(LangTextType.A0300));
            }
        }

        private async _onTouchedBtnDeleteWatcher(): Promise<void> {
            const warId = Helpers.getExisted(this._getWar().getWarId());
            if ((await WatchWar.WwModel.getWatchIncomingInfo(warId))?.ongoingSrcUserIdArray?.length) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.WwDeleteWatcherDetailPanel, {
                    warId,
                });
            } else {
                FloatText.show(Lang.getText(LangTextType.A0301));
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateBtnHandleRequest();
            this._updateLabelGameSpectator();
            this._updateLabelOwnSpectator();
            this._updateLabelIncomingRequest();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = Lang.getText(LangTextType.B0872);
            this._labelGameSpectatorTitle.text      = Lang.getText(LangTextType.B0873);
            this._labelOwnSpectatorTitle.text       = Lang.getText(LangTextType.B0874);
            this._labelIncomingRequestTitle.text    = Lang.getText(LangTextType.B0875);
            this._btnDeleteWatcher.label            = Lang.getText(LangTextType.B0219);
            this._btnHandleRequest.label            = Lang.getText(LangTextType.B0208);
            this._btnMakeRequest.label              = Lang.getText(LangTextType.B0207);
        }

        private async _updateBtnHandleRequest(): Promise<void> {
            const info = await WatchWar.WwModel.getWatchIncomingInfo(Helpers.getExisted(this._getWar().getWarId()));
            this._btnHandleRequest.setRedVisible(!!info?.requestSrcUserIdArray?.length);
        }

        private _updateLabelGameSpectator(): void {
            const userIdSet = new Set<number>();
            for (const [, player] of this._getWar().getPlayerManager().getAllPlayersDict()) {
                for (const userId of player.getWatchOngoingSrcUserIds()) {
                    userIdSet.add(userId);
                }
            }
            this._labelGameSpectator.text = `${userIdSet.size}`;
        }

        private _updateLabelOwnSpectator(): void {
            this._labelOwnSpectator.text = `${this._getWar().getPlayerLoggedIn()?.getWatchOngoingSrcUserIds().size ?? 0}`;
        }

        private async _updateLabelIncomingRequest(): Promise<void> {
            const info = await WatchWar.WwModel.getWatchIncomingInfo(Helpers.getExisted(this._getWar().getWarId()));
            this._labelIncomingRequest.text = `${info?.requestSrcUserIdArray?.length ?? 0}`;
        }
    }
}

// export default TwnsMpwSpectatePanel;
