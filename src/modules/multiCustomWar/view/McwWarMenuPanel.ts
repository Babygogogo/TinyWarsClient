
namespace TinyWars.MultiCustomWar {
    import ConfirmPanel = Common.ConfirmPanel;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import FlowManager  = Utility.FlowManager;

    export class McwWarMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwWarMenuPanel;

        private _group      : eui.Group;
        private _listCommand: GameUi.UiScrollList;
        private _btnClose   : GameUi.UiButton;

        private _war        : McwWar;
        private _unitMap    : McwUnitMap;
        private _turnManager: McwTurnManager;
        private _dataForList: DataForCommandRenderer[];
        private _playerIndex: number;

        public static show(): void {
            if (!McwWarMenuPanel._instance) {
                McwWarMenuPanel._instance = new McwWarMenuPanel();
            }
            McwWarMenuPanel._instance.open();
        }
        public static hide(): void {
            if (McwWarMenuPanel._instance) {
                McwWarMenuPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = McwWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/multiCustomWar/McwWarMenuPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.McwActionPlannerStateChanged,   callback: this._onNotifyMcwPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnClose, callback: this.close },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
        }
        protected _onOpened(): void {
            const war           = McwModel.getWar();
            this._war           = war;
            this._unitMap       = war.getUnitMap();
            this._turnManager   = war.getTurnManager();
            this._playerIndex = this._war.getPlayerIndexLoggedIn();
            this._updateView();

            Notify.dispatch(Notify.Type.McwWarMenuPanelOpened);
        }
        protected _onClosed(): void {
            delete this._war;
            delete this._unitMap;
            delete this._dataForList;
            this._listCommand.clear();

            Notify.dispatch(Notify.Type.McwWarMenuPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._dataForList = this._createDataForList();
            this._listCommand.bindData(this._dataForList);
        }

        private _createDataForList(): DataForCommandRenderer[] {
            const datas = [] as DataForCommandRenderer[];

            const commandGotoLobby = this._createCommandGotoLobby();
            (commandGotoLobby) && (datas.push(commandGotoLobby));

            const commandSurrender = this._createCommandSurrender();
            (commandSurrender) && (datas.push(commandSurrender));

            return datas;
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0054),
                callback: () => {
                    ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0054),
                        content : Lang.getText(Lang.Type.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
            }
        }

        private _createCommandSurrender(): DataForCommandRenderer | undefined {
            const war = this._war;
            if ((war.getPlayerInTurn() !== war.getPlayerLoggedIn())                 ||
                (war.getTurnManager().getPhaseCode() !== Types.TurnPhaseCode.Main)  ||
                (war.getActionPlanner().checkIsStateRequesting())
            ) {
                return undefined;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0055),
                    callback: () => {
                        ConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0055),
                            content : Lang.getText(Lang.Type.A0026),
                            callback: () => war.getActionPlanner().setStateRequestingPlayerBeginTurn(),
                        });
                    },
                }
            }
        }
    }

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    }

    class CommandRenderer extends eui.ItemRenderer {
        private _group      : eui.Group;
        private _labelName  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data = this.data as DataForCommandRenderer;
            this._labelName.text    = data.name;
        }
    }
}
