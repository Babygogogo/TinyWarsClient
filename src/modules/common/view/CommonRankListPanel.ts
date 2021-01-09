
namespace TinyWars.Common {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;

    export class CommonRankListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonRankListPanel;

        private _group          : eui.Group;
        private _labelTitle     : TinyWars.GameUi.UiLabel;
        private _btnClose       : TinyWars.GameUi.UiButton;

        private _labelStd       : TinyWars.GameUi.UiLabel;
        private _labelStdNoData : TinyWars.GameUi.UiLabel;
        private _listStd        : TinyWars.GameUi.UiScrollList;

        private _labelFog       : TinyWars.GameUi.UiLabel;
        private _labelFogNoData : TinyWars.GameUi.UiLabel;
        private _listFog        : TinyWars.GameUi.UiScrollList;

        public static show(): void {
            if (!CommonRankListPanel._instance) {
                CommonRankListPanel._instance = new CommonRankListPanel();
            }
            CommonRankListPanel._instance.open();
        }
        public static hide(): void {
            if (CommonRankListPanel._instance) {
                CommonRankListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/common/CommonRankListPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgCommonGetRankList,   callback: this._onMsgCommonGetRankList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose, callback: this.close },
            ]);
            this._listStd.setItemRenderer(UserRenderer);
            this._listFog.setItemRenderer(UserRenderer);
        }
        protected _onOpened(): void {
            CommonProxy.reqGetRankList();

            this._updateView();
            this._updateComponentsForLanguage();
        }
        protected _onClosed(): void {
            this._listStd.clear();
            this._listFog.clear();
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
            this._labelStd.text         = Lang.getText(Lang.Type.B0437);
            this._labelFog.text         = Lang.getText(Lang.Type.B0438);
            this._labelStdNoData.text   = Lang.getText(Lang.Type.B0278);
            this._labelFogNoData.text   = Lang.getText(Lang.Type.B0278);
            this._btnClose.label        = Lang.getText(Lang.Type.B0146);
        }

        private _updateComponentsForStd(): void {
            const playersCount  = 2;
            const warType       = Types.WarType.RmwStd;
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
            const warType       = Types.WarType.RmwFog;
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
    }

    type DataForUserRenderer = {
        rank        : number;
        userId      : number;
        playersCount: number;
        warType     : Types.WarType;
    }

    class UserRenderer extends GameUi.UiListItemRenderer {
        private _group      : eui.Group;
        private _imgBg      : GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            CommonRankListPanel.hide();
            User.UserPanel.show((this.data as DataForUserRenderer).userId);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            const data  = this.data as DataForUserRenderer;
            const label = this._labelName;
            label.text  = Lang.getText(Lang.Type.B0029);

            const userInfo = await User.UserModel.getUserPublicInfo(data.userId);
            const rankInfo = userInfo.userRankScore.dataList.find(v => {
                return (v.playersCountUnneutral === data.playersCount) && (v.warType === data.warType);
            });
            label.text = `No.${data.rank}  ${rankInfo.currentScore}\n${userInfo.nickname}`;
        }
    }
}
