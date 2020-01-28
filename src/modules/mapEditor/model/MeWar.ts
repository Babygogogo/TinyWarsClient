
namespace TinyWars.MapEditor {
    import Types = Utility.Types;

    export class MeWar {
        private _slotIndex      : number;
        private _configVersion  : string;
        private _isReview       : boolean;
        private _isRunning      = false;

        private _view           : MeWarView;
        private _field          : MeField;

        public init(data: Types.MapRawData, slotIndex: number, configVersion: string, isReview: boolean): MeWar {
            this._setSlotIndex(slotIndex);
            this._setConfigVersion(configVersion);
            this._setIsReview(isReview);

            this._setField(new MeField().init(data, configVersion));
            this._initView();

            return this;
        }
        protected _initView(): void {
            this._view = this._view || new MeWarView();
            this._view.init(this);
        }

        public getView(): MeWarView {
            return this._view;
        }

        public startRunning(): MeWar {
            this.getField().startRunning(this);

            this._isRunning = true;

            return this;
        }
        public startRunningView(): MeWar {
            this.getView().startRunningView();
            this.getField().startRunningView();

            return this;
        }
        public stopRunning(): MeWar {
            this.getField().stopRunning();
            this.getView().stopRunning();

            this._isRunning = false;

            return this;
        }
        public getIsRunning(): boolean {
            return this._isRunning;
        }

        private _setSlotIndex(warId: number): void {
            this._slotIndex = warId;
        }
        public getSlotIndex(): number {
            return this._slotIndex;
        }

        private _setIsReview(isReview: boolean): void {
            this._isReview = isReview;
        }
        public getIsReview(): boolean {
            return this._isReview;
        }

        private _setConfigVersion(configVersion: string): void {
            this._configVersion = configVersion;
        }
        public getConfigVersion(): string {
            return this._configVersion;
        }

        protected _setField(field: MeField): void {
            this._field = field;
        }
        public getField(): MeField {
            return this._field;
        }

        public getUnitMap(): MeUnitMap {
            return this.getField().getUnitMap();
        }
        public getTileMap(): MeTileMap {
            return this.getField().getTileMap();
        }
        public getGridVisionEffect(): MeGridVisionEffect {
            return this.getField().getGridVisionEffect();
        }
    }
}
