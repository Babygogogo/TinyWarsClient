
// import TwnsClientErrorCode      from "../../tools/helpers/ClientErrorCode";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsBwFieldView          from "../view/BwFieldView";
// import TwnsBwActionPlanner      from "./BwActionPlanner";
// import TwnsBwCursor             from "./BwCursor";
// import TwnsBwFogMap             from "./BwFogMap";
// import TwnsBwGridVisualEffect   from "./BwGridVisualEffect";
// import TwnsBwTileMap            from "./BwTileMap";
// import TwnsBwUnitMap            from "./BwUnitMap";
// import TwnsBwWar                from "./BwWar";

namespace TwnsBwField {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import ISerialField         = ProtoTypes.WarSerialization.ISerialField;
    import BwUnitMap            = TwnsBwUnitMap.BwUnitMap;
    import BwWar                = Twns.BaseWar.BwWar;
    import BwCursor             = TwnsBwCursor.BwCursor;
    import BwFogMap             = TwnsBwFogMap.BwFogMap;
    import BwGridVisualEffect   = TwnsBwGridVisualEffect.BwGridVisualEffect;
    import BwFieldView          = TwnsBwFieldView.BwFieldView;

    export abstract class BwField {
        private readonly _cursor            = new BwCursor();
        private readonly _gridVisualEffect  = new BwGridVisualEffect();
        private readonly _view              = new BwFieldView();

        public abstract getFogMap(): BwFogMap;
        public abstract getTileMap(): TwnsBwTileMap.BwTileMap;
        public abstract getUnitMap(): BwUnitMap;
        public abstract getActionPlanner(): TwnsBwActionPlanner.BwActionPlanner;

        public init({ data, configVersion, playersCountUnneutral }: {
            data                    : Types.Undefinable<ISerialField>;
            configVersion           : string;
            playersCountUnneutral   : number;
        }): void {
            if (data == null) {
                throw Helpers.newError(`Empty data.`, ClientErrorCode.BwField_Init_00);
            }

            const mapSize = WarCommonHelpers.getMapSize(data.tileMap);
            if (!WarCommonHelpers.checkIsValidMapSize(mapSize)) {
                throw Helpers.newError(`Invalid mapSize.`, ClientErrorCode.BwField_Init_01);
            }

            this.getFogMap().init({
                data                : data.fogMap,
                mapSize,
                playersCountUnneutral
            });

            const tileMap = this.getTileMap();
            tileMap.init({
                data                : data.tileMap,
                configVersion,
                mapSize,
                playersCountUnneutral
            });

            const unitMap = this.getUnitMap();
            unitMap.init({
                data                : data.unitMap,
                configVersion,
                mapSize,
                playersCountUnneutral
            });

            const { width, height } = mapSize;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const gridIndex = { x, y };
                    const tile      = tileMap.getTile(gridIndex);
                    if ((tile.getMaxHp() != null) && (unitMap.getUnitOnMap(gridIndex))) {
                        throw Helpers.newError(`There is a unit on an attackable tile.`, ClientErrorCode.BwField_Init_02);
                    }
                }
            }

            this.getActionPlanner().init(mapSize);
            this.getCursor().init(mapSize);
            this.getGridVisualEffect().init();
            this.getView().init(this);
        }
        public fastInit({ data, configVersion, playersCountUnneutral }: {
            data                    : ISerialField;
            configVersion           : string;
            playersCountUnneutral   : number;
        }): void {
            const mapSize = WarCommonHelpers.getMapSize(data.tileMap);
            this.getFogMap().fastInit({
                data                : data.fogMap,
                mapSize,
                playersCountUnneutral
            });
            this.getTileMap().fastInit({
                data                : data.tileMap,
                configVersion,
                mapSize,
                playersCountUnneutral,
            });
            this.getUnitMap().fastInit({
                data                : data.unitMap,
                configVersion,
                mapSize,
                playersCountUnneutral,
            });

            this.getCursor().fastInit();
            this.getActionPlanner().fastInit();
            this.getGridVisualEffect().fastInit();
            this.getView().fastInit(this);
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
        public serializeForCreateSfw(): ISerialField {
            return {
                fogMap  : this.getFogMap().serializeForCreateSfw(),
                unitMap : this.getUnitMap().serializeForCreateSfw(),
                tileMap : this.getTileMap().serializeForCreateSfw(),
            };
        }
        public serializeForCreateMfr(): ISerialField {
            return {
                fogMap  : this.getFogMap().serializeForCreateMfr(),
                unitMap : this.getUnitMap().serializeForCreateMfr(),
                tileMap : this.getTileMap().serializeForCreateMfr(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BwFieldView {
            return this._view;
        }

        public getCursor(): BwCursor {
            return this._cursor;
        }

        public getGridVisualEffect(): BwGridVisualEffect {
            return this._gridVisualEffect;
        }
    }
}

// export default TwnsBwField;
