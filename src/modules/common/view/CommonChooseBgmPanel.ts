
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
namespace Twns.Common {
    import NotifyType               = Notify.NotifyType;
    import LangTextType             = Lang.LangTextType;

    export type OpenDataForCommonChooseBgmPanel = {
        currentBgmCode  : number;
        gameConfig      : Config.GameConfig;
        callback        : (bgmCode: number) => void;
    };
    export class CommonChooseBgmPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseBgmPanel> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _listBgm!          : TwnsUiScrollList.UiScrollList<DataForBgmRenderer>;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,                    callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listBgm.setItemRenderer(BgmRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const list      = this._listBgm;
            const bgmCode   = this._getOpenData().currentBgmCode;
            list.bindData(this._createDataForListBgm());
            list.setSelectedIndex(list.getFirstIndex(v => v.bgmCode === bgmCode) ?? -1);
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0541);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
        }

        private _createDataForListBgm(): DataForBgmRenderer[] {
            const openData      = this._getOpenData();
            const callback      = Helpers.getExisted(openData.callback);
            const dataArray     : DataForBgmRenderer[] = [];
            const gameConfig    = openData.gameConfig;
            for (const bgmCode of gameConfig.getAllBgmCodeArray()) {
                dataArray.push({
                    callback,
                    bgmCode,
                    gameConfig,
                    panel   : this,
                });
            }
            return dataArray;
        }
    }

    type DataForBgmRenderer = {
        bgmCode     : number;
        gameConfig  : Config.GameConfig;
        callback    : (bgmCode: number) => void;
        panel       : CommonChooseBgmPanel;
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
            data.panel.close();
            data.callback(data.bgmCode);
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
            const langTextType      = data.gameConfig.getBgmSfxCfg(data.bgmCode)?.lang;
            this._labelName.text    = langTextType != null ? Lang.getText(langTextType) : CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChooseBgmPanel;
