
// import FloatText                    from "../../tools/helpers/FloatText";
// import FlowManager                  from "../../tools/helpers/FlowManager";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsMmAvailabilityListPanel  from "./MmAvailabilityListPanel";
// import TwnsMmReviewListPanel        from "./MmReviewListPanel";
// import TwnsMmTagListPanel           from "./MmTagListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapManagement {
    import LangTextType             = Twns.Lang.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;

    export type OpenDataForMmMainMenuPanel = void;
    export class MmMainMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForMmMainMenuPanel> {
        private readonly _labelMenuTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _listCommand!      : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMmReloadAllMaps, callback: this._onMsgMmReloadAllMaps },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
            this._listCommand.bindData(await this._createDataForListCommand());
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            Twns.FlowManager.gotoLobby();
        }
        private _onMsgUserLogout(): void {
            this.close();
        }
        private _onMsgMmReloadAllMaps(): void {
            FloatText.show(Lang.getText(LangTextType.A0075));
        }
        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            this._labelMenuTitle.text   = Lang.getText(LangTextType.B0192);
            this._btnBack.label         = Lang.getText(LangTextType.B0146);
            this._listCommand.bindData(await this._createDataForListCommand());
        }

        private async _createDataForListCommand(): Promise<DataForCommandRenderer[]> {
            const dataList: DataForCommandRenderer[] = [
                {
                    name    : Lang.getText(LangTextType.B0295),
                    callback: (): void => {
                        this.close();
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmReviewListPanel, void 0);
                    },
                },
                {
                    name    : Lang.getText(LangTextType.B0193),
                    callback: (): void => {
                        this.close();
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmAvailabilityListPanel, {});
                    },
                },
                {
                    name    : Lang.getText(LangTextType.B0444),
                    callback: (): void => {
                        this.close();
                        Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmTagListPanel, null);
                    },
                },
            ];

            return dataList;
        }
    }

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    };
    class CommandRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
        private readonly _labelCommand! : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data = this._getData();
            this._labelCommand.text = data.name;
        }

        public onItemTapEvent(): void {
            this._getData().callback();
        }
    }
}

// export default TwnsMmMainMenuPanel;
