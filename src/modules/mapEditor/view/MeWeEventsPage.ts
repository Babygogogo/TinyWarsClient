
namespace TinyWars.MapEditor {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import ConfigManager    = Utility.ConfigManager;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import IWarEvent        = ProtoTypes.WarEvent.IWarEvent;
    import CommonConstants  = Utility.ConfigManager.COMMON_CONSTANTS;

    export class MeWeEventsPage extends GameUi.UiTabPage {
        private _btnAddEvent    : GameUi.UiButton;
        private _labelNoEvent   : GameUi.UiLabel;
        private _listWarEvent   : GameUi.UiScrollList;

        public constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeWeEventsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnAddEvent,    callback: this._onTouchedBtnAddEvent },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._listWarEvent.setItemRenderer(WarEventRenderer);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnAddEvent(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListWarEventAndLabelNoEvent();
        }

        private _updateComponentsForLanguage(): void {
            this._labelNoEvent.text = Lang.getText(Lang.Type.B0278);
            this._btnAddEvent.label = Lang.getText(Lang.Type.B0320);
        }

        private _updateListWarEventAndLabelNoEvent(): void {
            const dataArray : DataForWarEventRenderer[] = [];
            for (const warEvent of MeManager.getWar().getWarEventManager().getWarEventData().eventList || []) {
                dataArray.push({
                    warEvent,
                });
            }

            this._labelNoEvent.visible = !dataArray.length;
            this._listWarEvent.bindData(dataArray.sort((v1, v2) => v1.warEvent.eventId - v2.warEvent.eventId));
        }
    }

    type DataForWarEventRenderer = {
        warEvent    : IWarEvent;
    }
    class WarEventRenderer extends GameUi.UiListItemRenderer {
        private _labelName  : GameUi.UiLabel;
        private _labelDesc  : GameUi.UiLabel;
        private _btnModify  : GameUi.UiButton;
        private _btnDelete  : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnModify,  callback: this._onTouchedBtnModify },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
        }

        private _onTouchedBtnModify(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            // TODO
            FloatText.show("TODO");
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateLabelName();
            this._updateLabelDesc();
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelName();
            this._updateLabelDesc();
        }

        private _updateLabelName(): void {
            const data = this.data as DataForWarEventRenderer;
            if (data) {
                const warEvent          = data.warEvent;
                this._labelName.text    = `#${warEvent.eventId} ${Lang.getTextInLanguage(warEvent.eventNameList)}`;
            }
        }

        private _updateLabelDesc(): void {
            const data = this.data as DataForWarEventRenderer;
            if (data) {

            }
        }
    }
}
