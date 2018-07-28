
namespace OnlineWar {
    import Types          = Utility.Types;
    import IdConverter    = Utility.IdConverter;
    import Notify         = Utility.Notify;
    import Helpers        = Utility.Helpers;
    import SerializedTile = Types.SerializedTile;
    import InstantialTile = Types.InstantialTile;

    export class TileModel {
        private _template     : Readonly<Types.TemplateTile>;
        private _isInitialized: boolean;

        private _gridX              : number;
        private _gridY              : number;
        private _baseViewId         : number;
        private _objectViewId       : number;
        private _baseType           : Types.TileBaseType;
        private _objectType         : Types.TileObjectType;
        private _playerIndex        : number;
        private _currentHp          : number;
        private _currentBuildPoint  : number;
        private _currentCapturePoint: number;

        public constructor(data?: SerializedTile) {
            if (data) {
                this.init(data);
            }
        }

        public init(data: SerializedTile): void {
            const t             = IdConverter.getTileObjectTypeAndPlayerIndex(data.objectViewId);
            this._isInitialized = true;
            this._gridX         = data.gridX;
            this._gridY         = data.gridY;
            this._baseViewId    = data.baseViewId;
            this._objectViewId  = data.baseViewId;
            this._baseType      = IdConverter.getTileBaseType(data.baseViewId);
            this._objectType    = t.tileObjectType;
            this._playerIndex   = t.playerIndex;
            this._template      = Config.getTemplateTile(this._baseType, this._objectType);
            this._loadInstantialData(data.instantialData);
        }

        public serialize(): SerializedTile {
            egret.assert(this._isInitialized, "TileModel.serialize() the tile hasn't been initialized!");
            return {
                gridX         : this._gridX,
                gridY         : this._gridY,
                baseViewId    : this._baseViewId,
                objectViewId  : this._objectViewId,
                instantialData: this._createInstantialData(),
            };
        }

        private _createInstantialData(): InstantialTile | undefined {
            const template = this._template;
            const data: InstantialTile = {};

            if (this._currentHp !== template.maxHp) {
                data.currentHp = this._currentHp;
            }
            if (this._currentBuildPoint !== template.maxBuildPoint) {
                data.currentBuildPoint = this._currentBuildPoint;
            }
            if (this._currentCapturePoint !== template.maxCapturePoint) {
                data.currentCapturePoint = this._currentCapturePoint;
            }

            return Helpers.checkIsEmptyObject(data) ? undefined : data;
        }

        private _loadInstantialData(d: InstantialTile | undefined) {
            const t = this._template;
            this._currentHp           = (d) && (d.currentHp           != null) ? d.currentHp           : t.maxHp;
            this._currentBuildPoint   = (d) && (d.currentBuildPoint   != null) ? d.currentBuildPoint   : t.maxBuildPoint;
            this._currentCapturePoint = (d) && (d.currentCapturePoint != null) ? d.currentCapturePoint : t.maxCapturePoint;
        }
    }
}
