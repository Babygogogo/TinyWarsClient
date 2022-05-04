
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import ClientErrorCode      = Twns.ClientErrorCode;
    import ISerialField         = CommonProto.WarSerialization.ISerialField;
    import BwGridVisualEffect   = Twns.BaseWar.BwGridVisualEffect;
    import GameConfig           = Config.GameConfig;

    export abstract class BwField {
        private readonly _cursor            = new BwCursor();
        private readonly _gridVisualEffect  = new BwGridVisualEffect();
        private readonly _view              = new BwFieldView();

        public abstract getFogMap(): BwFogMap;
        public abstract getTileMap(): BwTileMap;
        public abstract getUnitMap(): BwUnitMap;
        public abstract getActionPlanner(): BaseWar.BwActionPlanner;

        public init({ data, gameConfig, playersCountUnneutral }: {
            data                    : Twns.Types.Undefinable<ISerialField>;
            gameConfig              : GameConfig;
            playersCountUnneutral   : number;
        }): void {
            if (data == null) {
                throw Twns.Helpers.newError(`Empty data.`, ClientErrorCode.BwField_Init_00);
            }

            const mapSize = WarHelpers.WarCommonHelpers.getMapSize(data.tileMap);
            if (!WarHelpers.WarCommonHelpers.checkIsValidMapSize(mapSize)) {
                throw Twns.Helpers.newError(`Invalid mapSize.`, ClientErrorCode.BwField_Init_01);
            }

            this.getFogMap().init({
                data                : data.fogMap,
                mapSize,
                playersCountUnneutral
            });

            const tileMap = this.getTileMap();
            tileMap.init({
                data                : data.tileMap,
                gameConfig,
                mapSize,
                playersCountUnneutral
            });

            const unitMap = this.getUnitMap();
            unitMap.init({
                data                : data.unitMap,
                gameConfig,
                mapSize,
                playersCountUnneutral
            });

            const { width, height } = mapSize;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const gridIndex = { x, y };
                    const tile      = tileMap.getTile(gridIndex);
                    if ((tile.getMaxHp() != null) && (unitMap.getUnitOnMap(gridIndex))) {
                        throw Twns.Helpers.newError(`There is a unit on an attackable tile.`, ClientErrorCode.BwField_Init_02);
                    }
                }
            }

            this.getActionPlanner().init(mapSize);
            this.getCursor().init(mapSize);
            this.getGridVisualEffect().init();
            this.getView().init(this);
        }
        public fastInit({ data, gameConfig, playersCountUnneutral }: {
            data                    : ISerialField;
            gameConfig              : GameConfig;
            playersCountUnneutral   : number;
        }): void {
            const mapSize = WarHelpers.WarCommonHelpers.getMapSize(data.tileMap);
            this.getFogMap().fastInit({
                data                : data.fogMap,
                mapSize,
                playersCountUnneutral
            });
            this.getTileMap().fastInit({
                data                : data.tileMap,
                gameConfig,
                mapSize,
                playersCountUnneutral,
            });
            this.getUnitMap().fastInit({
                data                : data.unitMap,
                gameConfig,
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
