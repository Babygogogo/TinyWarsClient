
import Helpers                      from "../../tools/helpers/Helpers";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";

namespace TwnsBwExecutedActionManager {
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;

    export class BwExecutedActionManager {
        private _isNeedReplay?      : boolean;
        private _executedActions?   : IWarActionContainer[];

        public init(isNeedExecutedAction: boolean, executedActions: IWarActionContainer[]): void {
            this._setIsNeedReplay(isNeedExecutedAction);
            if (isNeedExecutedAction) {
                this._setAllExecutedActions(executedActions);
            } else {
                this._setAllExecutedActions(new Array(executedActions.length).fill({}));
            }
        }

        private _setIsNeedReplay(isNeedReplay: boolean): void {
            this._isNeedReplay = isNeedReplay;
        }
        private _getIsNeedReplay(): boolean {
            return Helpers.getDefined(this._isNeedReplay);
        }

        public getExecutedActionsCount(): number {
            return this.getAllExecutedActions().length;
        }

        private _setAllExecutedActions(actions: IWarActionContainer[]): void {
            this._executedActions = actions;
        }
        public getAllExecutedActions(): IWarActionContainer[] {
            return Helpers.getDefined(this._executedActions);
        }

        public generateEmptyExecutedActions(): IWarActionContainer[] {
            return (new Array<IWarActionContainer>(this.getExecutedActionsCount())).fill({});
        }
        public getExecutedAction(actionId: number): IWarActionContainer {
            return this.getAllExecutedActions()[actionId];
        }
        public addExecutedAction(rawAction: IWarActionContainer): void {
            if (rawAction.actionId !== this.getExecutedActionsCount()) {
                throw new Error(`Invalid actionId: ${rawAction.actionId}`);
            }

            const executedActions = this.getAllExecutedActions();
            if (this._getIsNeedReplay()) {
                executedActions.push(Helpers.deepClone(rawAction));
            } else {
                executedActions.push(executedActions[executedActions.length - 1] || {});
            }
        }
    }
}

export default TwnsBwExecutedActionManager;
