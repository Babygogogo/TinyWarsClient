
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.CoopCustomRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import FloatText        = Utility.FloatText;
    import Logger           = Utility.Logger;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import CreateModel      = CcrModel.Create;

    export class CcrCreatePlayerInfoPage extends GameUi.UiTabPage<void> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer>;

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
            const mapRawData    = await CreateModel.getMapRawData();
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(mapRawData.playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
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
    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo               : eui.Group;
        private readonly _imgSkin               : GameUi.UiImage;
        private readonly _imgCoInfo             : GameUi.UiImage;
        private readonly _imgCoHead             : GameUi.UiImage;
        private readonly _labelCo               : GameUi.UiLabel;
        private readonly _labelPlayerType       : GameUi.UiLabel;

        private readonly _labelPlayerIndex      : GameUi.UiLabel;
        private readonly _labelTeamIndex        : GameUi.UiLabel;

        private readonly _btnChangeCo           : GameUi.UiButton;
        private readonly _btnChangeController   : GameUi.UiButton;
        private readonly _btnChangeSkinId       : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,                callback: this._onTouchedGroupCo },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
                { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
                { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(): Promise<void> {
            const playerIndex       = this.data.playerIndex;
            const settingsForCommon = CreateModel.getData().settingsForCommon;
            const playerRule        = (settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
            const coId              = (CreateModel.getSelfPlayerIndex() === playerIndex) ? (CreateModel.getSelfCoId()) : (playerRule.fixedCoIdInCcw);
            Common.CommonCoInfoPanel.show({
                configVersion   : settingsForCommon.configVersion,
                coId,
            });
        }

        private async _onTouchedBtnChangeController(): Promise<void> {
            const data                  = this.data;
            const playerRuleArray       = CreateModel.getWarRule().ruleForPlayers.playerRuleDataArray || [];
            const humanPlayerIndexSet   = new Set<number>();
            const aiPlayerIndexSet      = new Set<number>();
            for (const playerRule of playerRuleArray) {
                const playerIndex = playerRule.playerIndex;
                if (playerRule.fixedCoIdInCcw == null) {
                    humanPlayerIndexSet.add(playerIndex);
                } else {
                    aiPlayerIndexSet.add(playerIndex);
                }
            }

            const playerIndex   = data.playerIndex;
            const playerRule    = playerRuleArray.find(v => v.playerIndex === playerIndex);
            if (playerRule == null) {
                Logger.error(`CcrCreatePlayerInfoPage.PlayerRenderer._onTouchedBtnChangeController() empty playerRule.`);
                return;
            }

            if (playerIndex === CreateModel.getSelfPlayerIndex()) {
                if (humanPlayerIndexSet.size < 2) {
                    FloatText.show(Lang.getText(Lang.Type.A0222));
                } else {
                    const callback = () => {
                        for (const p of humanPlayerIndexSet) {
                            if (p !== playerIndex) {
                                CreateModel.setSelfPlayerIndex(p);
                                break;
                            }
                        }
                        playerRule.fixedCoIdInCcw = CommonConstants.CoEmptyId;
                        CreateModel.setAiSkinId(playerIndex, playerIndex);
                        data.page.updateView();
                    };

                    if (CreateModel.getPresetWarRuleId() == null) {
                        callback();
                    } else {
                        Common.CommonConfirmPanel.show({
                            content : Lang.getText(Lang.Type.A0129),
                            callback: () => {
                                CreateModel.setCustomWarRuleId();
                                callback();
                            },
                        });
                    }
                }

            } else {
                if (playerRule.fixedCoIdInCcw == null) {
                    CreateModel.setSelfPlayerIndex(playerIndex);
                    data.page.updateView();
                } else {
                    const callback = () => {
                        playerRule.fixedCoIdInCcw = null;
                        CreateModel.deleteAiSkinId(playerIndex);
                        data.page.updateView();
                    };

                    if (CreateModel.getPresetWarRuleId() == null) {
                        callback();
                    } else {
                        Common.CommonConfirmPanel.show({
                            content : Lang.getText(Lang.Type.A0129),
                            callback: () => {
                                CreateModel.setCustomWarRuleId();
                                callback();
                            },
                        });
                    }
                }
            }

            data.page.updateView();

        }

        private async _onTouchedBtnChangeSkinId(): Promise<void> {
            CreateModel.tickUnitAndTileSkinId(this.data.playerIndex);
            this._updateComponentsForSettings();
        }

        private async _onTouchedBtnChangeCo(): Promise<void> {
            const playerIndex   = this.data.playerIndex;
            const warRule       = CreateModel.getWarRule();
            const playerRule    = (warRule.ruleForPlayers.playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
            if (playerRule == null) {
                Logger.error(`CcrCreatePlayerInfoPage.PlayerRenderer._onTouchedBtnChangeCo() empty playerRule.`);
                return;
            }

            const configVersion = CreateModel.getData().settingsForCommon.configVersion;
            if (playerIndex === CreateModel.getSelfPlayerIndex()) {
                Common.CommonChooseCoPanel.show({
                    currentCoId         : CreateModel.getSelfCoId(),
                    availableCoIdArray  : BwWarRuleHelper.getAvailableCoIdArrayForPlayer(warRule, playerIndex, configVersion),
                    callbackOnConfirm   : (coId) => {
                        if (coId !== CreateModel.getSelfCoId()) {
                            CreateModel.setSelfCoId(coId);
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

                        Common.CommonChooseCoPanel.show({
                            currentCoId         : coId,
                            availableCoIdArray  : coIdArray,
                            callbackOnConfirm   : (newCoId) => {
                                if (newCoId !== coId) {
                                    CreateModel.setAiCoId(playerIndex, newCoId);
                                    this._updateComponentsForSettings();
                                }
                            },
                        });
                    };

                    if (warRule.ruleId == null) {
                        callback();
                    } else {
                        Common.CommonConfirmPanel.show({
                            content : Lang.getText(Lang.Type.A0129),
                            callback: () => {
                                CreateModel.setCustomWarRuleId();
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
            this._btnChangeCo.label         = Lang.getText(Lang.Type.B0230);
            this._btnChangeController.label = Lang.getText(Lang.Type.B0608);
            this._btnChangeSkinId.label     = Lang.getText(Lang.Type.B0609);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const roomInfo  = CreateModel.getData();
            if (!roomInfo) {
                return;
            }

            const playerIndex           = this.data.playerIndex;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);

            const settingsForCommon     = roomInfo.settingsForCommon;
            const playerRule            = (settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
            if (playerRule == null) {
                Logger.error(`CcrCreatePlayerInfoPage.PlayerRenderer._updateComponentsForSettings() empty playerRule.`);
                return;
            }

            this._labelTeamIndex.text   = Lang.getPlayerTeamName(playerRule.teamIndex);

            const isSelfPlayer      = CreateModel.getSelfPlayerIndex() === playerIndex;
            const isHumanPlayer     = playerRule.fixedCoIdInCcw == null;
            this._imgSkin.source    = getSourceForImgSkin(
                isSelfPlayer
                    ? CreateModel.getSelfUnitAndTileSkinId()
                    : (isHumanPlayer ? null : CreateModel.getAiSkinId(playerIndex))
            );

            this._labelPlayerType.text  = isSelfPlayer
                ? Lang.getText(Lang.Type.B0647)
                : (isHumanPlayer
                    ? Lang.getText(Lang.Type.B0648)
                    : Lang.getText(Lang.Type.B0607));

            const coId                      = isSelfPlayer ? CreateModel.getSelfCoId() : playerRule.fixedCoIdInCcw;
            const coCfg                     = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
            this._labelCo.text              = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source          = ConfigManager.getCoHeadImageSource(coId);
            this._imgCoInfo.visible         = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
            this._btnChangeCo.visible       = (isSelfPlayer) || (!isHumanPlayer);
            this._btnChangeSkinId.visible   = (isSelfPlayer) || (!isHumanPlayer);
        }
    }

    function getSourceForImgSkin(skinId: number): string {
        switch (skinId) {
            case 1  : return `commonRectangle0002`;
            case 2  : return `commonRectangle0003`;
            case 3  : return `commonRectangle0004`;
            case 4  : return `commonRectangle0005`;
            default : return `commonRectangle0006`;
        }
    }
}
