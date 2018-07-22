
namespace OnlineWar {
    import Types          = Utility.Types;
    import IdConverter    = Utility.IdConverter;
    import SerializedTile = Types.SerializedTile;
    import InstantialTile = Types.InstantialTile;

    export class TileModel {
        private _template     : Readonly<Types.TemplateTile>;
        private _isInitialized: boolean;
        private _view         : TileView;

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

            this.updateView();
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

        public setView(view: TileView): void {
            this._view = view;
            this.updateView();
        }

        public updateView(): void {
            if ((this._isInitialized) && (this._view)) {
                // TODO
            }
        }

        private _createInstantialData(): InstantialTile | undefined {
            const t = this._template;
            if ((this._currentHp           == t.maxHp)         &&
                (this._currentBuildPoint   == t.maxBuildPoint) &&
                (this._currentCapturePoint == t.maxCapturePoint)) {
                return undefined;
            } else {
                return {
                    currentHp          : this._currentHp,
                    currentBuildPoint  : this._currentBuildPoint,
                    currentCapturePoint: this._currentCapturePoint,
                }
            }
        }

        private _loadInstantialData(i: InstantialTile | undefined) {
            const t = this._template;
            this._currentHp           = (i) && (i.currentHp         != null)   ? i.currentHp           : t.maxHp;
            this._currentBuildPoint   = (i) && (i.currentBuildPoint != null)   ? i.currentBuildPoint   : t.maxBuildPoint;
            this._currentCapturePoint = (i) && (i.currentCapturePoint != null) ? i.currentCapturePoint : t.maxCapturePoint;
        }
    }
}
