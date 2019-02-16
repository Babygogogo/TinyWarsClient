
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export class McwFieldView extends egret.DisplayObjectContainer {
        private _field          : McwField;
        private _tileMapView    : any;
        private _unitMapView    : any;

        public init(field: McwField): void {
            this._field = field;
        }

        public startRunning(): void {
        }
    }
}
