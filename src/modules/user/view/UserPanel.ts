
import TwnsUiScrollList         from "../../../utility/ui/UiScrollList";
import TwnsUiImage              from "../../../utility/ui/UiImage";
import TwnsUiPanel              from "../../../utility/ui/UiPanel";
import TwnsUiButton              from "../../../utility/ui/UiButton";
import TwnsUiLabel              from "../../../utility/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../../utility/ui/UiListItemRenderer";
import { ChatPanel }            from "../../chat/view/ChatPanel";
import { CommonConstants }      from "../../../utility/CommonConstants";
import { ConfigManager }        from "../../../utility/ConfigManager";
import { Helpers }              from "../../../utility/Helpers";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                from "../../../utility/Types";
import { UserModel }            from "../../user/model/UserModel";
import { UserProxy }            from "../../user/model/UserProxy";
import WarType                  = Types.WarType;

type OpenDataForUserPanel = {
    userId  : number;
};
export class UserPanel extends TwnsUiPanel.UiPanel<OpenDataForUserPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: UserPanel;

    // @ts-ignore
    private readonly _imgMask           : TwnsUiImage.UiImage;
    // @ts-ignore
    private readonly _group             : eui.Group;
    // @ts-ignore
    private readonly _labelTitle        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _btnClose          : TwnsUiButton.UiButton;

    // @ts-ignore
    private readonly _groupButtons      : TwnsUiButton.UiButton;
    // @ts-ignore
    private readonly _btnChat           : TwnsUiButton.UiButton;
    // @ts-ignore
    private readonly _imgLogo           : TwnsUiImage.UiImage;

    // @ts-ignore
    private readonly _labelStdRankScoreTitle    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelStdRankScore         : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelStdRankRankTitle     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelStdRankRank          : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelStdRankRankSuffix    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogRankScoreTitle    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogRankScore         : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogRankRankTitle     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogRankRank          : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogRankRankSuffix    : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _labelRegisterTimeTitle    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelRegisterTime1        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelRegisterTime2        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelLastLoginTimeTitle   : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelLastLoginTime1       : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelLastLoginTime2       : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelOnlineTimeTitle      : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelOnlineTime           : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelLoginCountTitle      : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelLoginCount           : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelUserId               : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelUserIdTitle          : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelDiscordId            : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _labelHistoryStd           : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryStdWin        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryStdLose       : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryStdDraw       : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryStdRatio      : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryFog           : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryFogWin        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryFogLose       : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryFogDraw       : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHistoryFogRatio      : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _sclHistoryStd             : TwnsUiScrollList.UiScrollList<DataForHistoryRenderer>;
    // @ts-ignore
    private readonly _sclHistoryFog             : TwnsUiScrollList.UiScrollList<DataForHistoryRenderer>;

    public static show(openData: OpenDataForUserPanel): void {
        if (!UserPanel._instance) {
            UserPanel._instance = new UserPanel();
        }
        UserPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (UserPanel._instance) {
            await UserPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/user/UserPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserGetPublicInfo,   callback: this._onMsgUserGetPublicInfo },
            { type: NotifyType.MsgUserSetNickname,     callback: this._onMsgUserSetNickname },
            { type: NotifyType.MsgUserSetDiscordId,    callback: this._onMsgUserSetDiscordId },
        ]);
        this._setUiListenerArray([
            { ui: this._btnChat,            callback: this._onTouchedBtnChat },
            { ui: this._btnClose,           callback: this.close },
        ]);
        this._sclHistoryStd.setItemRenderer(HistoryRenderer);
        this._sclHistoryFog.setItemRenderer(HistoryRenderer);

        this._showOpenAnimation();

        UserProxy.reqUserGetPublicInfo(this._getOpenData().userId);

        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserGetPublicInfo(): void {
        this._updateView();
    }
    private _onMsgUserSetNickname(): void {
        const userId = this._getOpenData().userId;
        if (userId === UserModel.getSelfUserId()) {
            UserProxy.reqUserGetPublicInfo(userId);
        }
    }
    private _onMsgUserSetDiscordId(): void {
        const userId = this._getOpenData().userId;
        if (userId === UserModel.getSelfUserId()) {
            UserProxy.reqUserGetPublicInfo(userId);
        }
    }
    private _onTouchedBtnChat(): void {
        const userId = this._getOpenData().userId;
        this.close();
        ChatPanel.show({ toUserId: userId });
    }

    private _showOpenAnimation(): void {
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
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>((resolve) => {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
                callback    : resolve,
            });
        });
    }

    private async _updateView(): Promise<void> {
        const userId    = this._getOpenData().userId;
        const info      = userId != null ? await UserModel.getUserPublicInfo(userId) : undefined;
        if (info) {
            const registerTime          = info.registerTime;
            const labelRegisterTime1    = this._labelRegisterTime1;
            const labelRegisterTime2    = this._labelRegisterTime2;
            if (registerTime == null) {
                labelRegisterTime1.text     = CommonConstants.ErrorTextForUndefined;
                labelRegisterTime2.text     = CommonConstants.ErrorTextForUndefined;
            } else {
                labelRegisterTime1.text     = Helpers.getTimestampShortText(registerTime, { hour: false, minute: false, second: false });
                labelRegisterTime2.text     = Helpers.getTimestampShortText(registerTime, { year: false, month: false, date: false });
            }

            const loginTime             = info.lastLoginTime;
            const labelLastLoginTime1   = this._labelLastLoginTime1;
            const labelLastLoginTime2   = this._labelLastLoginTime2;
            if (loginTime == null) {
                labelLastLoginTime1.text    = CommonConstants.ErrorTextForUndefined;
                labelLastLoginTime2.text    = CommonConstants.ErrorTextForUndefined;
            } else {
                labelLastLoginTime1.text    = Helpers.getTimestampShortText(loginTime, { hour: false, minute: false, second: false });
                labelLastLoginTime2.text    = Helpers.getTimestampShortText(loginTime, { year: false, month: false, date: false });
            }

            this._labelLoginCount.text      = `${info.loginCount}`;
            this._labelUserId.text          = `${userId}`;
            this._labelDiscordId.text       = info.discordId || "--";
        }

        this._updateComponentsForLanguage();
        this._updateLabelOnlineTime();
        this._updateGroupButtons();
    }

    private async _updateGroupButtons(): Promise<void> {
        const group = this._groupButtons;
        group.removeChildren();

        if (this._getOpenData().userId !== UserModel.getSelfUserId()) {
            group.addChild(this._btnChat);
        } else {
            group.addChild(this._imgLogo);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelStdRankScoreTitle.text   = Lang.getText(LangTextType.B0198);
        this._labelStdRankRankTitle.text    = Lang.getText(LangTextType.B0546);
        this._labelFogRankScoreTitle.text   = Lang.getText(LangTextType.B0199);
        this._labelFogRankRankTitle.text    = Lang.getText(LangTextType.B0547);
        this._labelUserIdTitle.text         = Lang.getText(LangTextType.B0640);
        this._labelRegisterTimeTitle.text   = Lang.getText(LangTextType.B0194);
        this._labelLastLoginTimeTitle.text  = Lang.getText(LangTextType.B0195);
        this._labelOnlineTimeTitle.text     = Lang.getText(LangTextType.B0196);
        this._labelLoginCountTitle.text     = Lang.getText(LangTextType.B0197);
        this._labelHistoryStd.text          = Lang.getText(LangTextType.B0548);
        this._labelHistoryStdWin.text       = Lang.getText(LangTextType.B0550);
        this._labelHistoryStdLose.text      = Lang.getText(LangTextType.B0551);
        this._labelHistoryStdDraw.text      = Lang.getText(LangTextType.B0552);
        this._labelHistoryStdRatio.text     = Lang.getText(LangTextType.B0553);
        this._labelHistoryFog.text          = Lang.getText(LangTextType.B0549);
        this._labelHistoryFogWin.text       = Lang.getText(LangTextType.B0550);
        this._labelHistoryFogLose.text      = Lang.getText(LangTextType.B0551);
        this._labelHistoryFogDraw.text      = Lang.getText(LangTextType.B0552);
        this._labelHistoryFogRatio.text     = Lang.getText(LangTextType.B0553);

        this._updateLabelTitle();
        this._updateComponentsForStdRank();
        this._updateComponentsForFogRank();
        this._updateSclHistoryStd();
        this._updateSclHistoryFog();
        this._updateBtnChat();
    }

    private async _updateLabelTitle(): Promise<void> {
        const nickname          = await UserModel.getUserNickname(this._getOpenData().userId);
        this._labelTitle.text   = Lang.getFormattedText(LangTextType.F0009, nickname);
    }
    private async _updateComponentsForStdRank(): Promise<void> {
        const data                      = await UserModel.getUserMrwRankScoreInfo(this._getOpenData().userId, WarType.MrwStd, 2);
        const rawScore                  = data ? data.currentScore : null;
        const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
        const rankName                  = `(${ConfigManager.getRankName(ConfigManager.getLatestFormalVersion(), score)})`;
        this._labelStdRankScore.text    = `${score} ${rankName}`;

        const rank                          = data ? data.currentRank : null;
        this._labelStdRankRank.text         = rank == null ? `--` : `${rank}`;
        this._labelStdRankRankSuffix.text   = Helpers.getSuffixForRank(rank) || ``;
    }
    private async _updateComponentsForFogRank(): Promise<void> {
        const data                      = await UserModel.getUserMrwRankScoreInfo(this._getOpenData().userId, WarType.MrwFog, 2);
        const rawScore                  = data ? data.currentScore : null;
        const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
        const rankName                  = `(${ConfigManager.getRankName(ConfigManager.getLatestFormalVersion(), score)})`;
        this._labelFogRankScore.text    = `${score} ${rankName}`;

        const rank                          = data ? data.currentRank : null;
        this._labelFogRankRank.text         = rank == null ? `--` : `${rank}`;
        this._labelFogRankRankSuffix.text   = Helpers.getSuffixForRank(rank) || ``;
    }
    private _updateSclHistoryStd(): void {
        const userId    = this._getOpenData().userId;
        let index       = 0;
        const dataList  : DataForHistoryRenderer[] = [{
            index       : index++,
            userId,
            warType     : WarType.MrwStd,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= CommonConstants.WarMaxPlayerIndex; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarType.McwStd,
                playersCount,
            });
        }
        dataList[dataList.length - 1].showBottom = true;
        this._sclHistoryStd.bindData(dataList);
    }
    private _updateSclHistoryFog(): void {
        const userId    = this._getOpenData().userId;
        let index       = 0;
        const dataList  : DataForHistoryRenderer[] = [{
            index       : index++,
            userId,
            warType     : WarType.MrwFog,
            playersCount: 2,
        }];
        for (let playersCount = 2; playersCount <= CommonConstants.WarMaxPlayerIndex; ++playersCount) {
            dataList.push({
                index       : index++,
                userId,
                warType     : WarType.McwFog,
                playersCount,
            });
        }
        dataList[dataList.length - 1].showBottom = true;
        this._sclHistoryFog.bindData(dataList);
    }
    private async _updateLabelOnlineTime(): Promise<void> {
        const info                  = await UserModel.getUserPublicInfo(this._getOpenData().userId);
        const onlineTime            = info ? info.onlineTime : null;
        this._labelOnlineTime.text  = onlineTime == null ? CommonConstants.ErrorTextForUndefined : Helpers.getTimeDurationText2(onlineTime);
    }
    private _updateBtnChat(): void {
        this._btnChat.label = Lang.getText(LangTextType.B0383);
    }
}

type DataForHistoryRenderer = {
    index       : number;
    userId      : number;
    warType     : WarType;
    playersCount: number;
    showBottom? : boolean;
};

class HistoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForHistoryRenderer> {
    // @ts-ignore
    private readonly _imgBg         : TwnsUiImage.UiImage;
    // @ts-ignore
    private readonly _labelType     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelWin      : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelLose     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelDraw     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelRatio    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _imgBottom     : TwnsUiImage.UiImage;

    protected async _onDataChanged(): Promise<void> {
        const data              = this.data;
        this._imgBg.alpha       = data.index % 2 === 0 ? 0.2 : 0.5;
        this._imgBottom.visible = !!data.showBottom;

        const warType       = data.warType;
        const playersCount  = data.playersCount;
        const labelType     = this._labelType;
        if ((warType === WarType.MrwFog) || (warType === WarType.MrwStd)) {
            labelType.text = Lang.getText(LangTextType.B0554);
        } else {
            labelType.text  = `${playersCount}P`;
        }

        const info              = await UserModel.getUserMpwStatisticsData(data.userId, warType, playersCount);
        const winCount          = info ? info.wins || 0 : 0;
        const loseCount         = info ? info.loses || 0 : 0;
        const drawCount         = info ? info.draws || 0 : 0;
        const totalCount        = winCount + loseCount + drawCount;
        this._labelWin.text     = `${winCount}`;
        this._labelLose.text    = `${loseCount}`;
        this._labelDraw.text    = `${drawCount}`;
        this._labelRatio.text   = totalCount ? Helpers.formatString(`%.2f`, winCount / totalCount * 100) : `--`;
    }
}
