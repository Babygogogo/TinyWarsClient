
namespace TinyWars.BaseWar {
    import ClientErrorCode  = Utility.ClientErrorCode;
    import ProtoTypes       = Utility.ProtoTypes;
    import ISerialField     = ProtoTypes.WarSerialization.ISerialField;

    export abstract class BwField {
        private readonly _fogMap            = new (this._getFogMapClass())();
        private readonly _tileMap           = new (this._getTileMapClass())();
        private readonly _unitMap           = new (this._getUnitMapClass())();
        private readonly _cursor            = new BwCursor();
        private readonly _actionPlanner     = new (this._getActionPlannerClass())();
        private readonly _gridVisualEffect  = new BwGridVisualEffect();
        private readonly _view              = new BwFieldView();

        protected abstract _getFogMapClass(): new () => BwFogMap;
        protected abstract _getTileMapClass(): new () => BwTileMap;
        protected _getUnitMapClass(): new () => BwUnitMap {
            return BwUnitMap;
        }
        protected abstract _getActionPlannerClass(): new () => BwActionPlanner;

        public init({ data, configVersion, playersCountUnneutral }: {
            data                    : ISerialField;
            configVersion           : string;
            playersCountUnneutral   : number;
        }): ClientErrorCode {
            if (data == null) {
                return ClientErrorCode.BwFieldInit00;
            }

            const mapSize = BwHelpers.getMapSize(data.tileMap);
            if (!BwHelpers.checkIsValidMapSize(mapSize)) {
                return ClientErrorCode.BwFieldInit01;
            }

            const fogMapError = this.getFogMap().init({
                data                : data.fogMap,
                mapSize,
                playersCountUnneutral
            });
            if (fogMapError) {
                return fogMapError;
            }

            const tileMap       = this.getTileMap();
            const tileMapError  = tileMap.init({
                data                : data.tileMap,
                configVersion,
                mapSize,
                playersCountUnneutral
            });
            if (tileMapError) {
                return tileMapError;
            }

            const unitMap       = this.getUnitMap();
            const unitMapError  = unitMap.init({
                data                : data.unitMap,
                configVersion,
                mapSize,
                playersCountUnneutral
            });
            if (unitMapError) {
                return unitMapError;
            }

            const { width, height } = mapSize;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const gridIndex = { x, y };
                    const tile      = tileMap.getTile(gridIndex);
                    if (tile == null) {
                        return ClientErrorCode.BwFieldInit02;
                    }

                    if ((tile.getMaxHp() != null) && (unitMap.getUnitOnMap(gridIndex))) {
                        return ClientErrorCode.BwFieldInit03;
                    }
                }
            }

            const actionPlannerError = this.getActionPlanner().init(mapSize);
            if (actionPlannerError) {
                return actionPlannerError;
            }

            const cursorError = this.getCursor().init(mapSize);
            if (cursorError) {
                return cursorError;
            }

            const gridVisualEffectError = this.getGridVisualEffect().init();
            if (gridVisualEffectError) {
                return gridVisualEffectError;
            }

            this.getView().init(this);

            return ClientErrorCode.NoError;
        }
        public fastInit({ data, configVersion, playersCountUnneutral }: {
            data                    : ISerialField;
            configVersion           : string;
            playersCountUnneutral   : number;
        }): ClientErrorCode {
            const mapSize       = BwHelpers.getMapSize(data.tileMap);
            const fogMapError   = this.getFogMap().fastInit({
                data                : data.fogMap,
                mapSize,
                playersCountUnneutral
            });
            if (fogMapError) {
                return fogMapError;
            }

            const tileMapError = this.getTileMap().fastInit({
                data                : data.tileMap,
                configVersion,
                mapSize,
                playersCountUnneutral,
            });
            if (tileMapError) {
                return tileMapError;
            }

            const unitMapError = this.getUnitMap().fastInit({
                data                : data.unitMap,
                configVersion,
                mapSize,
                playersCountUnneutral,
            });
            if (unitMapError) {
                return unitMapError;
            }

            const cursorError = this.getCursor().fastInit(mapSize);
            if (cursorError) {
                return cursorError;
            }

            const actionPlannerError = this.getActionPlanner().fastInit(mapSize);
            if (actionPlannerError) {
                return actionPlannerError;
            }

            const gridVisualEffectError = this.getGridVisualEffect().fastInit();
            if (gridVisualEffectError) {
                return gridVisualEffectError;
            }

            this.getView().fastInit(this);

            return ClientErrorCode.NoError;
        }

        public startRunning(war: BwWar): void {
            this.getTileMap().startRunning(war);
            this.getUnitMap().startRunning(war);
            this.getFogMap().startRunning(war);
            this.getCursor().startRunning(war);
            this.getActionPlanner().startRunning(war);
            this.getGridVisualEffect().startRunning(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.getTileMap().startRunningView();
            this.getUnitMap().startRunningView();
            this.getCursor().startRunningView();
            this.getActionPlanner().startRunningView();
            this.getGridVisualEffect().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
            this.getTileMap().stopRunning();
            this.getUnitMap().stopRunning();
            this.getCursor().stopRunning();
            this.getActionPlanner().stopRunning();
            this.getGridVisualEffect().stopRunning();
        }

        public serialize(): ISerialField {
            return {
                fogMap  : this.getFogMap().serialize(),
                unitMap : this.getUnitMap().serialize(),
                tileMap : this.getTileMap().serialize(),
            };
        }
        public serializeForSimulation(): ISerialField {
            return {
                fogMap  : this.getFogMap().serializeForSimulation(),
                unitMap : this.getUnitMap().serializeForSimulation(),
                tileMap : this.getTileMap().serializeForSimulation(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BwFieldView {
            return this._view;
        }

        public getFogMap(): BwFogMap {
            return this._fogMap;
        }

        public getTileMap(): BwTileMap {
            return this._tileMap;
        }

        public getUnitMap(): BwUnitMap {
            return this._unitMap;
        }

        public getCursor(): BwCursor {
            return this._cursor;
        }

        public getActionPlanner(): BwActionPlanner {
            return this._actionPlanner;
        }

        public getGridVisualEffect(): BwGridVisualEffect {
            return this._gridVisualEffect;
        }
    }
}
