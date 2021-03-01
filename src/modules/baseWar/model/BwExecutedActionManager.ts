
namespace TinyWars.BaseWar {
    import Helpers              = Utility.Helpers;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;

    export class BwExecutedActionManager {
        private _isNeedReplay?      : boolean;
        private _executedActions?   : IWarActionContainer[];

        public init(isNeedReplay: boolean, executedActions: IWarActionContainer[]): void {
            this._setIsNeedReplay(isNeedReplay);
            if (isNeedReplay) {
                this._setAllExecutedActions(executedActions);
            } else {
                this._setAllExecutedActions(new Array(executedActions.length).fill({}));
            }
        }

        private _setIsNeedReplay(isNeedReplay: boolean): void {
            this._isNeedReplay = isNeedReplay;
        }
        private _getIsNeedReplay(): boolean | undefined {
            return this._isNeedReplay;
        }

        public getExecutedActionsCount(): number | undefined {
            const actions = this.getAllExecutedActions();
            return actions ? actions.length : undefined;
        }

        private _setAllExecutedActions(actions: IWarActionContainer[]): void {
            this._executedActions = actions;
        }
        public getAllExecutedActions(): IWarActionContainer[] | undefined {
            return this._executedActions;
        }

        public generateEmptyExecutedActions(): IWarActionContainer[] | undefined {
            const count = this.getExecutedActionsCount();
            if (count == null) {
                Logger.error(`BwExecutedActionManager._generateEmptyExecutedActions() empty count.`);
                return undefined;
            }

            return (new Array<IWarActionContainer>(count)).fill({});
        }
        public getExecutedAction(actionId: number): IWarActionContainer | undefined {
            const executedActions = this.getAllExecutedActions();
            if (executedActions == null) {
                Logger.error(`BwExecutedActionManager.getExecutedAction() empty executedActions.`);
                return undefined;
            }

            return executedActions[actionId];
        }
        public addExecutedAction(rawAction: IWarActionContainer): void {
            const executedActions = this.getAllExecutedActions();
            if (executedActions == null) {
                Logger.error(`BwExecutedActionManager.addExecutedAction() empty executedActions.`);
                return undefined;
            }

            const executedActionsCount = this.getExecutedActionsCount();
            if (executedActionsCount == null) {
                Logger.error(`BwExecutedActionManager.addExecutedAction() empty executedActionsCount.`);
                return undefined;
            }
            if (rawAction.actionId !== executedActionsCount) {
                Logger.error(`BwExecutedActionManager.addExecutedAction() invalid rawAction.actionId.`);
                return undefined;
            }

            if (this._getIsNeedReplay()) {
                executedActions.push(Helpers.deepClone(rawAction));
            } else {
                executedActions.push(executedActions[executedActions.length - 1] || {});
            }
        }
    }
}
