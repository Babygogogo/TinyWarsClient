
// import TwnsCommonChooseCoPanel  from "../../common/view/CommonChooseCoPanel";
// import TwnsCommonCoInfoPanel    from "../../common/view/CommonCoInfoPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import CcrCreateModel           from "../model/CcrCreateModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCcrCreatePlayerInfoPage {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export class CcrCreatePlayerInfoPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _groupInfo!    : eui.Group;
        private readonly _listPlayer!   : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/coopCustomRoom/CcrCreatePlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForPlayerInfo();
        }

        public updateView(): void {
            this._updateComponentsForPlayerInfo();
        }

        private async _updateComponentsForPlayerInfo(): Promise<void> {
            this._listPlayer.bindData(this._createDataForListPlayer(Helpers.getExisted((await CcrCreateModel.getMapRawData()).playersCountUnneutral)));
        }

        private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
            const dataList: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataList.push({
                    playerIndex,
                    page        : this,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        playerIndex     : number;
        page            : CcrCreatePlayerInfoPage;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo!              : eui.Group;
        private readonly _imgSkin!              : TwnsUiImage.UiImage;
        private readonly _imgCoInfo!            : TwnsUiImage.UiImage;
        private readonly _imgCoHead!            : TwnsUiImage.UiImage;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerType!      : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex!     : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex!       : TwnsUiLabel.UiLabel;

        private readonly _btnChangeCo!          : TwnsUiButton.UiButton;
        private readonly _btnChangeController!  : TwnsUiButton.UiButton;
        private readonly _btnChangeSkinId!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,                callback: this._onTouchedGroupCo },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
                { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
                { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(): Promise<void> {
            const playerIndex       = this._getData().playerIndex;
            const settingsForCommon = CcrCreateModel.getSettingsForCommon();
            const coId              = (CcrCreateModel.getSelfPlayerIndex() === playerIndex)
                ? (CcrCreateModel.getSelfCoId())
                : (WarRuleHelpers.getPlayerRule(Helpers.getExisted(settingsForCommon.warRule), playerIndex).fixedCoIdInCcw);

            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonCoInfoPanel, {
                    configVersion   : Helpers.getExisted(settingsForCommon.configVersion),
                    coId,
                });
            }
        }

        private async _onTouchedBtnChangeController(): Promise<void> {
            const data                  = this._getData();
            const playerRuleArray       = Helpers.getExisted(CcrCreateModel.getWarRule().ruleForPlayers?.playerRuleDataArray);
            const humanPlayerIndexSet   = new Set<number>();
            const aiPlayerIndexSet      = new Set<number>();
            for (const playerRule of playerRuleArray) {
                const playerIndex = Helpers.getExisted(playerRule.playerIndex);
                if (playerRule.fixedCoIdInCcw == null) {
                    humanPlayerIndexSet.add(playerIndex);
                } else {
                    aiPlayerIndexSet.add(playerIndex);
                }
            }

            const playerIndex   = data.playerIndex;
            const playerRule    = Helpers.getExisted(playerRuleArray.find(v => v.playerIndex === playerIndex));
            if (playerIndex === CcrCreateModel.getSelfPlayerIndex()) {
                if (humanPlayerIndexSet.size < 2) {
                    FloatText.show(Lang.getText(LangTextType.A0222));
                } else {
                    const callback = () => {
                        for (const p of humanPlayerIndexSet) {
                            if (p !== playerIndex) {
                                CcrCreateModel.setSelfPlayerIndex(p);
                                break;
                            }
                        }
                        playerRule.fixedCoIdInCcw = CommonConstants.CoEmptyId;
                        CcrCreateModel.setAiSkinId(playerIndex, playerIndex);
                        data.page.updateView();
                    };

                    if (CcrCreateModel.getPresetWarRuleId() == null) {
                        callback();
                    } else {
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                            content : Lang.getText(LangTextType.A0129),
                            callback: () => {
                                CcrCreateModel.setCustomWarRuleId();
                                callback();
                            },
                        });
                    }
                }

            } else {
                if (playerRule.fixedCoIdInCcw == null) {
                    CcrCreateModel.setSelfPlayerIndex(playerIndex);
                    data.page.updateView();
                } else {
                    const callback = () => {
                        playerRule.fixedCoIdInCcw = null;
                        CcrCreateModel.deleteAiSkinId(playerIndex);
                        data.page.updateView();
                    };

                    if (CcrCreateModel.getPresetWarRuleId() == null) {
                        callback();
                    } else {
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                            content : Lang.getText(LangTextType.A0129),
                            callback: () => {
                                CcrCreateModel.setCustomWarRuleId();
                                callback();
                            },
                        });
                    }
                }
            }

            data.page.updateView();

        }

        private async _onTouchedBtnChangeSkinId(): Promise<void> {
            CcrCreateModel.tickUnitAndTileSkinId(this._getData().playerIndex);
            this._updateComponentsForSettings();
        }

        private async _onTouchedBtnChangeCo(): Promise<void> {
            const playerIndex   = this._getData().playerIndex;
            const warRule       = CcrCreateModel.getWarRule();
            const playerRule    = WarRuleHelpers.getPlayerRule(warRule, playerIndex);
            const configVersion = Helpers.getExisted(CcrCreateModel.getData().settingsForCommon?.configVersion);
            if (playerIndex === CcrCreateModel.getSelfPlayerIndex()) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                    currentCoId         : CcrCreateModel.getSelfCoId(),
                    availableCoIdArray  : WarRuleHelpers.getAvailableCoIdArrayForPlayer({ warRule, playerIndex, configVersion }),
                    callbackOnConfirm   : (coId) => {
                        if (coId !== CcrCreateModel.getSelfCoId()) {
                            CcrCreateModel.setSelfCoId(coId);
                            this._updateComponentsForSettings();
                        }
                    },
                });
            } else {
                const coId = playerRule.fixedCoIdInCcw;
                if (coId != null) {
                    const callback = () => {
                        const coIdArray: number[] = [];
                        for (const cfg of ConfigManager.getEnabledCoArray(configVersion)) {
                            coIdArray.push(cfg.coId);
                        }

                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                            currentCoId         : coId,
                            availableCoIdArray  : coIdArray,
                            callbackOnConfirm   : (newCoId) => {
                                if (newCoId !== coId) {
                                    CcrCreateModel.setAiCoId(playerIndex, newCoId);
                                    this._updateComponentsForSettings();
                                }
                            },
                        });
                    };

                    if (warRule.ruleId == null) {
                        callback();
                    } else {
                        TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                            content : Lang.getText(LangTextType.A0129),
                            callback: () => {
                                CcrCreateModel.setCustomWarRuleId();
                                callback();
                            },
                        });
                    }
                }
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
        }

        private _updateComponentsForLanguage(): void {
            this._btnChangeCo.label         = Lang.getText(LangTextType.B0230);
            this._btnChangeController.label = Lang.getText(LangTextType.B0608);
            this._btnChangeSkinId.label     = Lang.getText(LangTextType.B0609);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const roomInfo  = CcrCreateModel.getData();
            if (!roomInfo) {
                return;
            }

            const playerIndex           = this._getData().playerIndex;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);

            const settingsForCommon     = Helpers.getExisted(roomInfo.settingsForCommon);
            const playerRule            = WarRuleHelpers.getPlayerRule(Helpers.getExisted(settingsForCommon.warRule), playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(Helpers.getExisted(playerRule.teamIndex)) || CommonConstants.ErrorTextForUndefined;

            const isSelfPlayer      = CcrCreateModel.getSelfPlayerIndex() === playerIndex;
            const isHumanPlayer     = playerRule.fixedCoIdInCcw == null;
            this._imgSkin.source    = WarCommonHelpers.getImageSourceForCoHeadFrame(
                isSelfPlayer
                    ? CcrCreateModel.getSelfUnitAndTileSkinId()
                    : (isHumanPlayer ? null : CcrCreateModel.getAiSkinId(playerIndex))
            );

            this._labelPlayerType.text  = isSelfPlayer
                ? Lang.getText(LangTextType.B0647)
                : (isHumanPlayer
                    ? Lang.getText(LangTextType.B0648)
                    : Lang.getText(LangTextType.B0607));

            const coId                      = isSelfPlayer ? CcrCreateModel.getSelfCoId() : (playerRule.fixedCoIdInCcw ?? null);
            const coCfg                     = coId == null ? null : ConfigManager.getCoBasicCfg(Helpers.getExisted(settingsForCommon.configVersion), coId);
            this._labelCo.text              = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source          = coId == null ? `` : ConfigManager.getCoHeadImageSource(coId);
            this._imgCoInfo.visible         = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
            this._btnChangeCo.visible       = (isSelfPlayer) || (!isHumanPlayer);
            this._btnChangeSkinId.visible   = (isSelfPlayer) || (!isHumanPlayer);
        }
    }
}

// export default TwnsCcrCreatePlayerInfoPage;
