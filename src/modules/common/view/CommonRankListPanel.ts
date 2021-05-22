
namespace TinyWars.Common {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;
    import Types        = Utility.Types;

    export class CommonRankListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonRankListPanel;

        private readonly _imgMask           : GameUi.UiImage;
        private readonly _group             : eui.Group;
        private readonly _labelTitle        : TinyWars.GameUi.UiLabel;

        private readonly _labelStdTitle     : GameUi.UiLabel;
        private readonly _labelStdNoData    : GameUi.UiLabel;
        private readonly _labelStdNickname  : GameUi.UiLabel;
        private readonly _labelStdScore     : GameUi.UiLabel;
        private readonly _listStd           : GameUi.UiScrollList<DataForUserRenderer>;

        private readonly _labelFogTitle     : GameUi.UiLabel;
        private readonly _labelFogNoData    : GameUi.UiLabel;
        private readonly _labelFogNickname  : GameUi.UiLabel;
        private readonly _labelFogScore     : GameUi.UiLabel;
        private readonly _listFog           : GameUi.UiScrollList<DataForUserRenderer>;

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
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
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
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgCommonGetRankList(e: egret.Event): void {
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
            this._labelTitle.text       = Lang.getText(Lang.Type.B0436);
            this._labelStdTitle.text    = Lang.getText(Lang.Type.B0548);
            this._labelStdNoData.text   = Lang.getText(Lang.Type.B0278);
            this._labelStdNickname.text = Lang.getText(Lang.Type.B0175);
            this._labelStdScore.text    = Lang.getText(Lang.Type.B0579);
            this._labelFogTitle.text    = Lang.getText(Lang.Type.B0549);
            this._labelFogNoData.text   = Lang.getText(Lang.Type.B0278);
            this._labelFogNickname.text = Lang.getText(Lang.Type.B0175);
            this._labelFogScore.text    = Lang.getText(Lang.Type.B0579);
        }

        private _updateComponentsForStd(): void {
            const playersCount  = 2;
            const warType       = Types.WarType.MrwStd;
            const dataList      : DataForUserRenderer[] = [];
            for (const data of CommonModel.getRankList() || []) {
                if ((data.playersCountUnneutral === playersCount) && (data.warType === warType)) {
                    dataList.push({
                        rank    : dataList.length + 1,
                        userId  : data.userId,
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
                    dataList.push({
                        rank    : dataList.length + 1,
                        userId  : data.userId,
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
    }

    class UserRenderer extends GameUi.UiListItemRenderer<DataForUserRenderer> {
        private _group          : eui.Group;
        private _imgBg          : GameUi.UiImage;
        private _labelIndex     : GameUi.UiLabel;
        private _labelNickname  : GameUi.UiLabel;
        private _labelScore     : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._imgBg, callback: this._onTouchedImgBg },
            ]);
            this._imgBg.touchEnabled = true;
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            const data = this.data;
            if (data) {
                User.UserPanel.show({ userId: data.userId });
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
            labelNickname.text      = Lang.getText(Lang.Type.B0029);
            labelScore.text         = undefined;
            this._labelIndex.text   = `${rank}${Helpers.getSuffixForRank(rank)}`;
            this._imgBg.alpha       = rank % 2 == 1 ? 0.2 : 0.5;

            const userInfo = await User.UserModel.getUserPublicInfo(data.userId);
            const rankInfo = userInfo.userRankScore.dataList.find(v => {
                return (v.playersCountUnneutral === data.playersCount) && (v.warType === data.warType);
            });
            labelNickname.text  = userInfo.nickname;
            labelScore.text     = `${rankInfo.currentScore}`;
        }
    }
}
