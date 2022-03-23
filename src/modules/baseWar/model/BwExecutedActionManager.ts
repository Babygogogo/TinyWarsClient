
// import Helpers                      from "../../tools/helpers/Helpers";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import ClientErrorCode              = TwnsClientErrorCode.ClientErrorCode;
    import IWarActionContainer          = ProtoTypes.WarAction.IWarActionContainer;
    import ISerialExecutedActionManager = ProtoTypes.WarSerialization.ISerialExecutedActionManager;

    export class BwExecutedActionManager {
        private _isNeedExecutedActions? : boolean;
        private _executedActionArray?   : IWarActionContainer[];
        private _executedActionsCount   = 0;

        public init({ isNeedExecutedActions, data }: {
            isNeedExecutedActions: boolean;
            data                : Types.Undefinable<ISerialExecutedActionManager>;
        }): void {
            this._setIsNeedExecutedActions(isNeedExecutedActions);

            const executedActionArray = data?.executedActionArray ?? [];
            this._setAllExecutedActionArray(executedActionArray);
            this._setExecutedActionsCount(data?.executedActionsCount ?? executedActionArray.length);
        }

        public serialize(): ISerialExecutedActionManager {
            return {
                executedActionArray         : this.getAllExecutedActionArray(),
                executedActionsCount        : this.getExecutedActionsCount(),
            };
        }
        public serializeForSrwValidation(): ISerialExecutedActionManager {
            return {
                executedActionArray         : this.getAllExecutedActionArray(),
                executedActionsCount        : null,
            };
        }

        private _setIsNeedExecutedActions(isNeedReplay: boolean): void {
            this._isNeedExecutedActions = isNeedReplay;
        }
        private _getIsNeedExecutedActions(): boolean {
            return Helpers.getExisted(this._isNeedExecutedActions);
        }

        private _setExecutedActionsCount(count: number): void {
            this._executedActionsCount = count;
        }
        public getExecutedActionsCount(): number {
            return this._executedActionsCount;
        }

        private _setAllExecutedActionArray(actions: IWarActionContainer[]): void {
            this._executedActionArray = actions;
        }
        public getAllExecutedActionArray(): IWarActionContainer[] {
            return Helpers.getExisted(this._executedActionArray);
        }

        public getExecutedAction(actionId: number): IWarActionContainer {
            return this.getAllExecutedActionArray()[actionId];
        }
        public addExecutedAction(rawAction: IWarActionContainer): void {
            const executedActionsCount = this.getExecutedActionsCount();
            if (rawAction.actionId !== executedActionsCount) {
                throw Helpers.newError(`Invalid actionId: ${rawAction.actionId}`, ClientErrorCode.BwExecutedActionManager_AddExecutedAction_00);
            }

            this._setExecutedActionsCount(executedActionsCount + 1);

            if (this._getIsNeedExecutedActions()) {
                this.getAllExecutedActionArray().push(Helpers.deepClone(rawAction));
            }
        }
    }
}

// export default TwnsBwExecutedActionManager;
