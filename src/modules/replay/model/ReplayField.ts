
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import SerializedMcField    = Types.SerializedMcwField;

    export class ReplayField {
        private _unitMap            : ReplayUnitMap;
        private _tileMap            : ReplayTileMap;
        private _fogMap             : ReplayFogMap;
        private _cursor             : ReplayCursor;
        private _actionPlanner      : ReplayActionPlanner;
        private _gridVisionEffect   : ReplayGridVisionEffect;
        private _view               : ReplayFieldView;

        public constructor() {
        }

        public async init(data: SerializedMcField, configVersion: number, mapIndexKey: Types.MapIndexKey): Promise<ReplayField> {
            this._setFogMap(await (this.getFogMap() || new ReplayFogMap()).init(data.fogMap, mapIndexKey));
            this._setTileMap(await (this.getTileMap() || new ReplayTileMap()).init(configVersion, mapIndexKey, data.tileMap));
            this._setUnitMap(await (this.getUnitMap() || new ReplayUnitMap()).init(configVersion, mapIndexKey, data.unitMap));
            this._setCursor(await (this.getCursor() || new ReplayCursor()).init(mapIndexKey));
            this._setActionPlanner(await (this.getActionPlanner() || new ReplayActionPlanner()).init(mapIndexKey));
            this._setGridVisionEffect(await (this.getGridVisionEffect() || new ReplayGridVisionEffect()).init());

            this._view = this._view || new ReplayFieldView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: ReplayWar): void {
            this.getTileMap().startRunning(war);
            this.getUnitMap().startRunning(war);
            this.getFogMap().startRunning(war);
            this.getCursor().startRunning(war);
            this.getActionPlanner().startRunning(war);
            this.getGridVisionEffect().startRunning(war);
        }
        public startRunningView(): void {
            this.getView().startRunning();
            this.getTileMap().startRunningView();
            this.getUnitMap().startRunningView();
            this.getCursor().startRunningView();
            this.getActionPlanner().startRunningView();
            this.getGridVisionEffect().startRunningView();
        }
        public stopRunning(): void {
            this.getTileMap().stopRunning();
            this.getUnitMap().stopRunning();
            this.getCursor().stopRunning();
            this.getActionPlanner().stopRunning();
            this.getGridVisionEffect().stopRunning();
        }

        public serialize(): Types.SerializedMcwField {
            return {
                fogMap  : this.getFogMap().serialize(),
                unitMap : this.getUnitMap().serialize(),
                tileMap : this.getTileMap().serialize(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): ReplayFieldView {
            return this._view;
        }

        private _setFogMap(map: ReplayFogMap): void {
            this._fogMap = map;
        }
        public getFogMap(): ReplayFogMap {
            return this._fogMap;
        }

        private _setTileMap(map: ReplayTileMap): void {
            this._tileMap = map;
        }
        public getTileMap(): ReplayTileMap {
            return this._tileMap;
        }

        private _setUnitMap(map: ReplayUnitMap): void {
            this._unitMap = map;
        }
        public getUnitMap(): ReplayUnitMap {
            return this._unitMap;
        }

        private _setCursor(cursor: ReplayCursor): void {
            this._cursor = cursor;
        }
        public getCursor(): ReplayCursor {
            return this._cursor;
        }

        private _setActionPlanner(actionPlanner: ReplayActionPlanner): void {
            this._actionPlanner = actionPlanner;
        }
        public getActionPlanner(): ReplayActionPlanner {
            return this._actionPlanner;
        }

        private _setGridVisionEffect(gridVisionEffect: ReplayGridVisionEffect): void {
            this._gridVisionEffect = gridVisionEffect;
        }
        public getGridVisionEffect(): ReplayGridVisionEffect {
            return this._gridVisionEffect;
        }
    }
}

