
// import Helpers              from "../../tools/helpers/Helpers";
// import SoundManager         from "../../tools/helpers/SoundManager";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import NotifyData           from "../../tools/notify/NotifyData";
// import Notify       from "../../tools/notify/NotifyType";
// import TwnsBwCursorView     from "../view/BwCursorView";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType       = Notify.NotifyType;

    export class BwCursor {
        private _gridX              = 0;
        private _gridY              = 0;
        private _previousGridIndex  : Types.GridIndex | null = null;
        private _mapSize?           : Types.MapSize;
        private _isMovableByTouches = true;
        private readonly _view      = new BaseWar.BwCursorView();

        private _war?               : BaseWar.BwWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: NotifyType.BwCursorTapped,              callback: this._onNotifyBwCursorTapped },
            { type: NotifyType.BwCursorDragged,             callback: this._onNotifyBwCursorDragged },
            { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwActionPlannerStateChanged },
        ];

        public init(mapSize: Types.MapSize): void {
            this._setMapSize(Helpers.deepClone(mapSize));
            this.setGridIndex({ x: 0, y: 0 });

            this.getView().init(this);
        }
        public fastInit(): void {
            this.getView().fastInit(this);
        }

        public startRunning(war: BaseWar.BwWar): void {
            this._war = war;

            Notify.addEventListeners(this._notifyListeners, this, false, 10);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);

            this.getView().stopRunningView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwCursorTapped(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as Notify.NotifyData.BwCursorTapped;
                this.setGridIndex(data.tappedOn);
                this.updateView();
            }
        }
        private _onNotifyBwCursorDragged(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as Notify.NotifyData.BwCursorDragged;
                this.setGridIndex(data.draggedTo);
                this.updateView();
                SoundManager.playShortSfx(Types.ShortSfxCode.CursorMove01);
            }
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            this.updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWar(): BaseWar.BwWar {
            return Helpers.getExisted(this._war);
        }

        public getView(): BaseWar.BwCursorView {
            return this._view;
        }
        public updateView(): void {
            this.getView().updateView();
        }

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return Helpers.getExisted(this._mapSize);
        }

        public setIsVisible(visible: boolean): void {
            this.getView().visible = visible;
        }
        public getIsVisible(): boolean {
            return this.getView().visible;
        }

        public getGridX(): number {
            return this._gridX;
        }
        public getGridY(): number {
            return this._gridY;
        }
        public setGridIndex(gridIndex: Types.GridIndex): void {
            this._setPreviousGridIndex(this.getGridIndex());

            this._gridX = gridIndex.x;
            this._gridY = gridIndex.y;
            Notify.dispatch(NotifyType.BwCursorGridIndexChanged, this);
        }
        public getGridIndex(): Types.GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }

        private _setPreviousGridIndex(gridIndex: Types.GridIndex): void {
            this._previousGridIndex = gridIndex;
        }
        public getPreviousGridIndex(): Types.GridIndex | null {
            return this._previousGridIndex;
        }

        public setIsMovableByTouches(isMovable: boolean): void {
            this._isMovableByTouches = isMovable;
        }
        public getIsMovableByTouches(): boolean {
            return this._isMovableByTouches;
        }
    }
}

// export default TwnsBwCursor;
