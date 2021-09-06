
import CompatibilityHelpers         from "../../tools/helpers/CompatibilityHelpers";
import FloatText                    from "../../tools/helpers/FloatText";
import FlowManager                  from "../../tools/helpers/FlowManager";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import TwnsMmAvailabilityListPanel  from "./MmAvailabilityListPanel";
import TwnsMmReviewListPanel        from "./MmReviewListPanel";
import TwnsMmTagListPanel           from "./MmTagListPanel";

namespace TwnsMmMainMenuPanel {
    import MmReviewListPanel        = TwnsMmReviewListPanel.MmReviewListPanel;
    import MmAvailabilityListPanel  = TwnsMmAvailabilityListPanel.MmAvailabilityListPanel;
    import MmTagListPanel           = TwnsMmTagListPanel.MmTagListPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;

    export class MmMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmMainMenuPanel;

        private readonly _labelMenuTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _listCommand!      : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;

        public static show(): void {
            if (!MmMainMenuPanel._instance) {
                MmMainMenuPanel._instance = new MmMainMenuPanel();
            }
            MmMainMenuPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (MmMainMenuPanel._instance) {
                await MmMainMenuPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/mapManagement/MmMainMenuPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMmReloadAllMaps, callback: this._onMsgMmReloadAllMaps },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            this._updateView();
            this._listCommand.bindData(await this._createDataForListCommand().catch(err => { CompatibilityHelpers.showError(err); throw err; }));
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(): void {
            this.close();
            FlowManager.gotoLobby();
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
            this._listCommand.bindData(await this._createDataForListCommand().catch(err => { CompatibilityHelpers.showError(err); throw err; }));
        }

        private async _createDataForListCommand(): Promise<DataForCommandRenderer[]> {
            const dataList: DataForCommandRenderer[] = [
                {
                    name    : Lang.getText(LangTextType.B0295),
                    callback: (): void => {
                        this.close();
                        MmReviewListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(LangTextType.B0193),
                    callback: (): void => {
                        this.close();
                        MmAvailabilityListPanel.show({});
                    },
                },
                {
                    name    : Lang.getText(LangTextType.B0444),
                    callback: (): void => {
                        this.close();
                        MmTagListPanel.show(null);
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

export default TwnsMmMainMenuPanel;
