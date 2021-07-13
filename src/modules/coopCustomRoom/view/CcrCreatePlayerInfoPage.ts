
import TwnsUiImage                      from "../../../utility/ui/UiImage";
import TwnsUiListItemRenderer           from "../../../utility/ui/UiListItemRenderer";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiScrollList                 from "../../../utility/ui/UiScrollList";
import TwnsUiTabPage                    from "../../../utility/ui/UiTabPage";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonCoInfoPanel }            from "../../common/view/CommonCoInfoPanel";
import { CommonChooseCoPanel }          from "../../common/view/CommonChooseCoPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { FloatText }                    from "../../../utility/FloatText";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Logger }                       from "../../../utility/Logger";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { BwWarRuleHelpers }              from "../../baseWar/model/BwWarRuleHelpers";
import { CcrCreateModel }               from "../model/CcrCreateModel";

export class CcrCreatePlayerInfoPage extends TwnsUiTabPage.UiTabPage<void> {
    private readonly _groupInfo     : eui.Group;
    private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

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
        const mapRawData    = await CcrCreateModel.getMapRawData();
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
class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo               : eui.Group;
    private readonly _imgSkin               : TwnsUiImage.UiImage;
    private readonly _imgCoInfo             : TwnsUiImage.UiImage;
    private readonly _imgCoHead             : TwnsUiImage.UiImage;
    private readonly _labelCo               : TwnsUiLabel.UiLabel;
    private readonly _labelPlayerType       : TwnsUiLabel.UiLabel;

    private readonly _labelPlayerIndex      : TwnsUiLabel.UiLabel;
    private readonly _labelTeamIndex        : TwnsUiLabel.UiLabel;

    private readonly _btnChangeCo           : TwnsUiButton.UiButton;
    private readonly _btnChangeController   : TwnsUiButton.UiButton;
    private readonly _btnChangeSkinId       : TwnsUiButton.UiButton;

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
        const playerIndex       = this.data.playerIndex;
        const settingsForCommon = CcrCreateModel.getData().settingsForCommon;
        const playerRule        = (settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
        const coId              = (CcrCreateModel.getSelfPlayerIndex() === playerIndex) ? (CcrCreateModel.getSelfCoId()) : (playerRule.fixedCoIdInCcw);
        CommonCoInfoPanel.show({
            configVersion   : settingsForCommon.configVersion,
            coId,
        });
    }

    private async _onTouchedBtnChangeController(): Promise<void> {
        const data                  = this.data;
        const playerRuleArray       = CcrCreateModel.getWarRule().ruleForPlayers.playerRuleDataArray || [];
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
                    CommonConfirmPanel.show({
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
                    CommonConfirmPanel.show({
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
        CcrCreateModel.tickUnitAndTileSkinId(this.data.playerIndex);
        this._updateComponentsForSettings();
    }

    private async _onTouchedBtnChangeCo(): Promise<void> {
        const playerIndex   = this.data.playerIndex;
        const warRule       = CcrCreateModel.getWarRule();
        const playerRule    = (warRule.ruleForPlayers.playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
        if (playerRule == null) {
            Logger.error(`CcrCreatePlayerInfoPage.PlayerRenderer._onTouchedBtnChangeCo() empty playerRule.`);
            return;
        }

        const configVersion = CcrCreateModel.getData().settingsForCommon.configVersion;
        if (playerIndex === CcrCreateModel.getSelfPlayerIndex()) {
            CommonChooseCoPanel.show({
                currentCoId         : CcrCreateModel.getSelfCoId(),
                availableCoIdArray  : BwWarRuleHelpers.getAvailableCoIdArrayForPlayer(warRule, playerIndex, configVersion),
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

                    CommonChooseCoPanel.show({
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
                    CommonConfirmPanel.show({
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

        const playerIndex           = this.data.playerIndex;
        this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);

        const settingsForCommon     = roomInfo.settingsForCommon;
        const playerRule            = (settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
        if (playerRule == null) {
            Logger.error(`CcrCreatePlayerInfoPage.PlayerRenderer._updateComponentsForSettings() empty playerRule.`);
            return;
        }

        this._labelTeamIndex.text   = Lang.getPlayerTeamName(playerRule.teamIndex);

        const isSelfPlayer      = CcrCreateModel.getSelfPlayerIndex() === playerIndex;
        const isHumanPlayer     = playerRule.fixedCoIdInCcw == null;
        this._imgSkin.source    = getSourceForImgSkin(
            isSelfPlayer
                ? CcrCreateModel.getSelfUnitAndTileSkinId()
                : (isHumanPlayer ? null : CcrCreateModel.getAiSkinId(playerIndex))
        );

        this._labelPlayerType.text  = isSelfPlayer
            ? Lang.getText(LangTextType.B0647)
            : (isHumanPlayer
                ? Lang.getText(LangTextType.B0648)
                : Lang.getText(LangTextType.B0607));

        const coId                      = isSelfPlayer ? CcrCreateModel.getSelfCoId() : playerRule.fixedCoIdInCcw;
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
