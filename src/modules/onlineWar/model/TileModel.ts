
namespace OnlineWar {
    import Types          = Utility.Types;
    import SerializedTile = Types.SerializedTile;

    export class TileModel {
        private _template: Types.TemplateTile;

        private _gridX        : number;
        private _gridY        : number;
        private _baseViewId   : number;
        private _objectViewId : number;
        private _baseModelId  : number;
        private _objectModelId: number;


        public constructor(data?: SerializedTile) {
            if (data) {
                this.init(data);
            }
        }

        public init(data: SerializedTile): void {
            this._gridX        = data.gridX;
            this._gridY        = data.gridY;
            this._baseViewId   = data.baseViewId;
            this._objectViewId = data.baseViewId;
            this._baseModelId  =
        }

        public serialize(): SerializedTile {

        }
    }
}
