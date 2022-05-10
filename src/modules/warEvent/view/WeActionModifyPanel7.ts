
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import LangTextType             = Lang.LangTextType;
    import BwWar                    = BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel7 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel7 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel7> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _groupUseCoBgm!    : eui.Group;
        private readonly _imgUseCoBgm!      : TwnsUiImage.UiImage;
        private readonly _labelUseCoBgm!    : TwnsUiLabel.UiLabel;
        private readonly _labelBgmTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelBgm!         : TwnsUiLabel.UiLabel;
        private readonly _listBgm!          : TwnsUiScrollList.UiScrollList<DataForBgmRenderer>;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._groupUseCoBgm,                      callback: this._onTouchedGroupUseCoBgm },
                { ui: this._btnType,                            callback: this._onTouchedBtnType },
                { ui: this._btnBack,                            callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listBgm.setItemRenderer(BgmRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            SoundManager.playBgm(Types.BgmCode.MapEditor01);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(): void {
            this._updateGroupUseCoBgm();
            this._updateLabelBgm();
        }

        private _onTouchedGroupUseCoBgm(): void {
            const action        = Helpers.getExisted(this._getOpenData().action.WeaPlayBgm);
            action.useCoBgm     = !action.useCoBgm;
            action.bgmCode      = Types.BgmCode.None;

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            PanelHelpers.open(PanelHelpers.PanelDict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateGroupUseCoBgm();

            const list      = this._listBgm;
            const bgmCode   = this._getOpenData().action.WeaPlayBgm?.bgmCode ?? Types.BgmCode.None;
            list.bindData(this._createDataForListBgm());
            list.setSelectedIndex(list.getFirstIndex(v => v.bgmCode === bgmCode) ?? -1);
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label         = Lang.getText(LangTextType.B0516);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
            this._labelUseCoBgm.text    = Lang.getText(LangTextType.A0262);
            this._labelBgmTitle.text    = `${Lang.getText(LangTextType.B0751)}: `;

            this._updateLabelBgm();
        }

        private _updateLabelBgm(): void {
            const data          = this._getOpenData();
            this._labelBgm.text = data.war.getGameConfig().getBgmCfg(data.action.WeaPlayBgm?.bgmCode ?? Types.BgmCode.None)?.bgmName ?? CommonConstants.ErrorTextForUndefined;
        }

        private _updateGroupUseCoBgm(): void {
            this._imgUseCoBgm.visible = !!this._getOpenData().action.WeaPlayBgm?.useCoBgm;
        }

        private _createDataForListBgm(): DataForBgmRenderer[] {
            const openData      = this._getOpenData();
            const gameConfig    = openData.war.getGameConfig();
            const actionData    = Helpers.getExisted(openData.action.WeaPlayBgm);
            const dataArray     : DataForBgmRenderer[] = [];
            for (const bgmCode of openData.war.getGameConfig().getAllBgmCodeArray()) {
                dataArray.push({ actionData, bgmCode, gameConfig });
            }
            return dataArray;
        }
    }

    type DataForBgmRenderer = {
        bgmCode     : Types.BgmCode;
        gameConfig  : Config.GameConfig;
        actionData  : CommonProto.WarEvent.IWeaPlayBgm;
    };
    class BgmRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForBgmRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _imgBg!        : TwnsUiImage.UiImage;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _groupSelect!  : eui.Group;
        private readonly _imgSelect!    : TwnsUiImage.UiImage;
        private readonly _labelSelect!  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupSelect,                    callback: this._onTouchedGroupSelect },
            ]);

            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            SoundManager.playBgm(this._getData().bgmCode);
        }

        private _onTouchedGroupSelect(): void {
            const data = this._getData();
            data.actionData.bgmCode     = data.bgmCode;
            data.actionData.useCoBgm    = false;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelSelect.text = Lang.getText(LangTextType.B0258);
            this._updateLabelName();
        }

        private _updateLabelName(): void {
            const data              = this._getData();
            this._labelName.text    = data.gameConfig.getBgmCfg(data.bgmCode)?.bgmName ?? CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsWeActionModifyPanel7;
