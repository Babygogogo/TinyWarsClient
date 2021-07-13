
import TwnsUiImage              from "../../../utility/ui/UiImage";
import TwnsUiLabel              from "../../../utility/ui/UiLabel";
import TwnsUiButton              from "../../../utility/ui/UiButton";
import TwnsUiPanel              from "../../../utility/ui/UiPanel";
import TwnsUiScrollList         from "../../../utility/ui/UiScrollList";
import TwnsUiListItemRenderer   from "../../../utility/ui/UiListItemRenderer";
import { UserPanel }            from "../../user/view/UserPanel";
import { CommonConstants }      from "../../../utility/CommonConstants";
import { Helpers }              from "../../../utility/Helpers";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Logger }               from "../../../utility/Logger";
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                from "../../../utility/Types";
import { CommonModel }          from "../../common/model/CommonModel";
import { CommonProxy }          from "../../common/model/CommonProxy";
import { UserModel }            from "../../user/model/UserModel";

export class CommonRankListPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: CommonRankListPanel;

    // @ts-ignore
    private readonly _imgMask           : TwnsUiImage.UiImage;
    // @ts-ignore
    private readonly _group             : eui.Group;
    // @ts-ignore
    private readonly _labelTitle        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _btnClose          : TwnsUiButton.UiButton;

    // @ts-ignore
    private readonly _labelStdTitle     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelStdNoData    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelStdNickname  : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelStdScore     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _listStd           : TwnsUiScrollList.UiScrollList<DataForUserRenderer>;

    // @ts-ignore
    private readonly _labelFogTitle     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogNoData    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogNickname  : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelFogScore     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _listFog           : TwnsUiScrollList.UiScrollList<DataForUserRenderer>;

    public static show(): void {
        if (!CommonRankListPanel._instance) {
            CommonRankListPanel._instance = new CommonRankListPanel();
        }
        CommonRankListPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (CommonRankListPanel._instance) {
            await CommonRankListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = `resource/skins/common/CommonRankListPanel.exml`;
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.close },
        ]);
        this._listStd.setItemRenderer(UserRenderer);
        this._listFog.setItemRenderer(UserRenderer);

        this._showOpenAnimation();

        CommonProxy.reqGetRankList();

        this._updateView();
        this._updateComponentsForLanguage();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onMsgCommonGetRankList(): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForStd();
        this._updateComponentsForFog();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = Lang.getText(LangTextType.B0436);
        this._labelStdTitle.text    = Lang.getText(LangTextType.B0548);
        this._labelStdNoData.text   = Lang.getText(LangTextType.B0278);
        this._labelStdNickname.text = Lang.getText(LangTextType.B0175);
        this._labelStdScore.text    = Lang.getText(LangTextType.B0579);
        this._labelFogTitle.text    = Lang.getText(LangTextType.B0549);
        this._labelFogNoData.text   = Lang.getText(LangTextType.B0278);
        this._labelFogNickname.text = Lang.getText(LangTextType.B0175);
        this._labelFogScore.text    = Lang.getText(LangTextType.B0579);
    }

    private _updateComponentsForStd(): void {
        const playersCount  = 2;
        const warType       = Types.WarType.MrwStd;
        const dataList      : DataForUserRenderer[] = [];
        for (const data of CommonModel.getRankList() || []) {
            if ((data.playersCountUnneutral === playersCount) && (data.warType === warType)) {
                const userId = data.userId;
                if (userId == null) {
                    Logger.error(`CommonRankListPanel._updateComponentsForStd() empty userId.`);
                    continue;
                }

                dataList.push({
                    rank    : dataList.length + 1,
                    userId,
                    warType,
                    playersCount,
                });
            }
        }

        this._labelStdNoData.visible = !dataList.length;
        this._listStd.bindData(dataList);
    }

    private _updateComponentsForFog(): void {
        const playersCount  = 2;
        const warType       = Types.WarType.MrwFog;
        const dataList      : DataForUserRenderer[] = [];
        for (const data of CommonModel.getRankList() || []) {
            if ((data.playersCountUnneutral === playersCount) && (data.warType === warType)) {
                const userId = data.userId;
                if (userId == null) {
                    Logger.error(`CommonRankListPanel._updateComponentsForFog() empty userId.`);
                    continue;
                }

                dataList.push({
                    rank    : dataList.length + 1,
                    userId,
                    warType,
                    playersCount,
                });
            }
        }

        this._labelFogNoData.visible = !dataList.length;
        this._listFog.bindData(dataList);
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
        return new Promise<void>(resolve => {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
                callback    : resolve,
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });
        });
    }
}

type DataForUserRenderer = {
    rank        : number;
    userId      : number;
    playersCount: number;
    warType     : Types.WarType;
};

class UserRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUserRenderer> {
    // @ts-ignore
    private _group          : eui.Group;
    // @ts-ignore
    private _imgBg          : TwnsUiImage.UiImage;
    // @ts-ignore
    private _labelIndex     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private _labelNickname  : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private _labelScore     : TwnsUiLabel.UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._imgBg, callback: this._onTouchedImgBg },
        ]);
        this._imgBg.touchEnabled = true;
    }

    protected _onDataChanged(): void {
        this._updateView();
    }

    private _onTouchedImgBg(): void {
        const data = this.data;
        if (data) {
            UserPanel.show({ userId: data.userId });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        const data = this.data;
        if (!data) {
            return;
        }

        const rank              = data.rank;
        const labelNickname     = this._labelNickname;
        const labelScore        = this._labelScore;
        labelNickname.text      = Lang.getText(LangTextType.B0029);
        labelScore.text         = ``;
        this._labelIndex.text   = `${rank}${Helpers.getSuffixForRank(rank)}`;
        this._imgBg.alpha       = rank % 2 == 1 ? 0.2 : 0.5;

        const userInfo = await UserModel.getUserPublicInfo(data.userId);
        if (userInfo == null) {
            Logger.error(`UserRenderer._updateView() empty userInfo.`);
            return;
        }
        labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;

        const rankInfo = (userInfo.userMrwRankInfoArray || []).find(v => {
            return (v.playersCountUnneutral === data.playersCount) && (v.warType === data.warType);
        });
        if (rankInfo == null) {
            Logger.error(`UserRenderer._updateView() empty rankInfo.`);
            labelScore.text = CommonConstants.ErrorTextForUndefined;
        } else {
            labelScore.text = `${rankInfo.currentScore}`;
        }
    }
}
