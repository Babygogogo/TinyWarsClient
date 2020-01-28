
namespace TinyWars.MapEditor {
    import ConfirmPanel     = Common.ConfirmPanel;
    import BwHelpers        = BaseWar.BwHelpers;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class MeTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeTopPanel;

        private _labelPlayer        : GameUi.UiLabel;
        private _labelFund          : GameUi.UiLabel;
        private _labelCo            : GameUi.UiLabel;
        private _labelCurrEnergy    : GameUi.UiLabel;
        private _labelPowerEnergy   : GameUi.UiLabel;
        private _labelZoneEnergy    : GameUi.UiLabel;
        private _btnUnitList        : GameUi.UiButton;
        private _btnFindBuilding    : GameUi.UiButton;
        private _btnEndTurn         : GameUi.UiButton;
        private _btnCancel          : GameUi.UiButton;
        private _btnMenu            : GameUi.UiButton;

        private _war    : MeWar;

        public static show(): void {
            if (!MeTopPanel._instance) {
                MeTopPanel._instance = new MeTopPanel();
            }
            MeTopPanel._instance.open();
        }

        public static hide(): void {
            if (MeTopPanel._instance) {
                MeTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/mapEditor/MeTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.BwTurnPhaseCodeChanged,         callback: this._onNotifyBwTurnPhaseCodeChanged },
                { type: Notify.Type.BwPlayerFundChanged,            callback: this._onNotifyBwPlayerFundChanged },
                { type: Notify.Type.BwPlayerIndexInTurnChanged,     callback: this._onNotifyBwPlayerIndexInTurnChanged },
                { type: Notify.Type.BwCoEnergyChanged,              callback: this._onNotifyBwCoEnergyChanged },
                { type: Notify.Type.BwCoUsingSkillTypeChanged,      callback: this._onNotifyBwCoUsingSkillChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnFindBuilding,    callback: this._onTouchedBtnFindBuilding, },
                { ui: this._btnEndTurn,         callback: this._onTouchedBtnEndTurn, },
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ];
        }

        protected _onOpened(): void {
            this._war = MeManager.getWar();
            this._updateView();
        }

        protected _onClosed(): void {
            delete this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwTurnPhaseCodeChanged(e: egret.Event): void {
            this._updateBtnEndTurn();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
        }
        private _onNotifyBwPlayerFundChanged(e: egret.Event): void {
            this._updateLabelFund();
        }
        private _onNotifyBwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyBwCoEnergyChanged(e: egret.Event): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwCoUsingSkillChanged(e: egret.Event): void {
            this._updateLabelCoAndEnergy();
        }
        private _onNotifyBwActionPlannerStateChanged(e: egret.Event): void {
            this._updateBtnEndTurn();
            this._updateBtnCancel();
        }

        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
        }
        private _onTouchedBtnFindBuilding(e: egret.TouchEvent): void {
        }
        private _onTouchedBtnEndTurn(e: egret.TouchEvent): void {
        }
        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelCoAndEnergy();
            this._updateBtnEndTurn();
            this._updateBtnFindUnit();
            this._updateBtnFindBuilding();
            this._updateBtnCancel();
            this._updateBtnMenu();
        }

        private _updateLabelPlayer(): void {
        }

        private _updateLabelFund(): void {
        }

        private _updateLabelCoAndEnergy(): void {
        }

        private _updateBtnEndTurn(): void {
        }

        private _updateBtnFindUnit(): void {
        }

        private _updateBtnFindBuilding(): void {
        }

        private _updateBtnCancel(): void {
        }

        private _updateBtnMenu(): void {
            this._btnMenu.label = Lang.getText(Lang.Type.B0155);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Util functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
    }
}
