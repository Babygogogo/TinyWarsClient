
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;

    export type OpenDataForUserSetCoBgmSettingsPanel = void;
    export class UserSetCoBgmSettingsPanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetCoBgmSettingsPanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _group!        : eui.Group;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _sclCo!        : TwnsUiScrollList.UiScrollList<DataForCoRenderer>;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._updateComponentsForLanguage();

            this._sclCo.setItemRenderer(CoRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateListCo();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text = Lang.getText(LangTextType.B0992);
        }
        private async _updateListCo(): Promise<void> {
            const dataArray     : DataForCoRenderer[] = [];
            const gameConfig    = await Config.ConfigManager.getLatestGameConfig();
            for (const coCategoryId of gameConfig.getEnabledCoCategoryIdArray()) {
                dataArray.push({
                    coCategoryId,
                    gameConfig,
                });
            }

            const listCo = this._sclCo;
            listCo.bindData(dataArray);
            listCo.viewport.scrollV = 0;
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
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
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForCoRenderer = {
        coCategoryId    : number;
        gameConfig      : Config.GameConfig;
    };
    class CoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCoRenderer> {
        private readonly _labelCoName!      : TwnsUiLabel.UiLabel;
        private readonly _btnReset!         : TwnsUiButton.UiButton;
        private readonly _btnPassive!       : TwnsUiButton.UiButton;
        private readonly _labelPassive!     : TwnsUiLabel.UiLabel;
        private readonly _btnPower!         : TwnsUiButton.UiButton;
        private readonly _labelPower!       : TwnsUiLabel.UiLabel;
        private readonly _btnSuperPower!    : TwnsUiButton.UiButton;
        private readonly _labelSuperPower!  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetCoBgmSettings, callback: this._onNotifyMsgUserSetCoBgmSettings },
            ]);
            this._setUiListenerArray([
                { ui: this._btnReset,       callback: this._onTouchedBtnReset },
                { ui: this._btnPassive,     callback: this._onTouchedBtnPassive },
                { ui: this._btnPower,       callback: this._onTouchedBtnPower },
                { ui: this._btnSuperPower,  callback: this._onTouchedBtnSuperPower },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }
        private _onNotifyMsgUserSetCoBgmSettings(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgUserSetCoBgmSettings.IS;
            if (data.coCategoryId === this._getData().coCategoryId) {
                this._updateView();
            }
        }

        private _onTouchedBtnReset(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content     : Lang.getText(LangTextType.A0225),
                callback    : () => {
                    const data = this._getData();
                    User.UserProxy.reqUserSetCoBgmSettings(data.coCategoryId, null);
                },
            });
        }
        private _onTouchedBtnPassive(): void {
            const data                  = this._getData();
            const gameConfig            = data.gameConfig;
            const coCategoryId          = data.coCategoryId;
            const coCategoryCfg         = Helpers.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
            const bgmCodeArray          = Helpers.getExisted(User.UserModel.getSelfSettings()?.coBgmSettings?.find(v => v.coCategoryId === coCategoryId)?.bgmCodeArray ?? coCategoryCfg.bgmCodeArray);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseBgmPanel, {
                gameConfig,
                currentBgmCode  : bgmCodeArray[0],
                callback        : bgmCode => {
                    UserProxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCode, bgmCodeArray[1], bgmCodeArray[2]]);
                },
            });
        }
        private _onTouchedBtnPower(): void {
            const data                  = this._getData();
            const gameConfig            = data.gameConfig;
            const coCategoryId          = data.coCategoryId;
            const coCategoryCfg         = Helpers.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
            const bgmCodeArray          = Helpers.getExisted(User.UserModel.getSelfSettings()?.coBgmSettings?.find(v => v.coCategoryId === coCategoryId)?.bgmCodeArray ?? coCategoryCfg.bgmCodeArray);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseBgmPanel, {
                gameConfig,
                currentBgmCode  : bgmCodeArray[1],
                callback        : bgmCode => {
                    UserProxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCode, bgmCodeArray[2]]);
                },
            });
        }
        private _onTouchedBtnSuperPower(): void {
            const data                  = this._getData();
            const gameConfig            = data.gameConfig;
            const coCategoryId          = data.coCategoryId;
            const coCategoryCfg         = Helpers.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
            const bgmCodeArray          = Helpers.getExisted(User.UserModel.getSelfSettings()?.coBgmSettings?.find(v => v.coCategoryId === coCategoryId)?.bgmCodeArray ?? coCategoryCfg.bgmCodeArray);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseBgmPanel, {
                gameConfig,
                currentBgmCode  : bgmCodeArray[2],
                callback        : bgmCode => {
                    UserProxy.reqUserSetCoBgmSettings(coCategoryId, [bgmCodeArray[0], bgmCodeArray[1], bgmCode]);
                },
            });
        }

        private _updateView(): void {
            this._btnReset.label        = Lang.getText(LangTextType.B0567);
            this._btnPassive.label      = Lang.getCoSkillTypeName(Types.CoSkillType.Passive) ?? CommonConstants.ErrorTextForUndefined;
            this._btnPower.label        = Lang.getCoSkillTypeName(Types.CoSkillType.Power) ?? CommonConstants.ErrorTextForUndefined;
            this._btnSuperPower.label   = Lang.getCoSkillTypeName(Types.CoSkillType.SuperPower) ?? CommonConstants.ErrorTextForUndefined;

            const data                  = this._getData();
            const gameConfig            = data.gameConfig;
            const coCategoryId          = data.coCategoryId;
            const coCategoryCfg         = Helpers.getExisted(gameConfig.getCoCategoryCfg(coCategoryId));
            const bgmCodeArray          = Helpers.getExisted(User.UserModel.getSelfSettings()?.coBgmSettings?.find(v => v.coCategoryId === coCategoryId)?.bgmCodeArray ?? coCategoryCfg.bgmCodeArray);
            this._labelCoName.text      = coCategoryCfg.name;
            this._labelPassive.text     = Lang.getText(Helpers.getExisted(gameConfig.getBgmSfxCfg(bgmCodeArray[0])?.lang));
            this._labelPower.text       = Lang.getText(Helpers.getExisted(gameConfig.getBgmSfxCfg(bgmCodeArray[1])?.lang));
            this._labelSuperPower.text  = Lang.getText(Helpers.getExisted(gameConfig.getBgmSfxCfg(bgmCodeArray[2])?.lang));
        }
    }
}

// export default TwnsUserSetCoBgmSettingsPanel;
