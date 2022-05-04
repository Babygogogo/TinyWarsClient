
// import Helpers              from "../../tools/helpers/Helpers";
// import SoundManager         from "../../tools/helpers/SoundManager";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import NotifyData           from "../../tools/notify/NotifyData";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsBwCursorView     from "../view/BwCursorView";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType       = Twns.Notify.NotifyType;

    export class BwCursor {
        private _gridX              = 0;
        private _gridY              = 0;
        private _previousGridIndex  : Twns.Types.GridIndex | null = null;
        private _mapSize?           : Twns.Types.MapSize;
        private _isMovableByTouches = true;
        private readonly _view      = new Twns.BaseWar.BwCursorView();

        private _war?               : Twns.BaseWar.BwWar;

        private _notifyListeners: Twns.Notify.Listener[] = [
            { type: NotifyType.BwCursorTapped,              callback: this._onNotifyBwCursorTapped },
            { type: NotifyType.BwCursorDragged,             callback: this._onNotifyBwCursorDragged },
            { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwActionPlannerStateChanged },
        ];

        public init(mapSize: Twns.Types.MapSize): void {
            this._setMapSize(Twns.Helpers.deepClone(mapSize));
            this.setGridIndex({ x: 0, y: 0 });

            this.getView().init(this);
        }
        public fastInit(): void {
            this.getView().fastInit(this);
        }

        public startRunning(war: Twns.BaseWar.BwWar): void {
            this._war = war;

            Twns.Notify.addEventListeners(this._notifyListeners, this, false, 10);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            Twns.Notify.removeEventListeners(this._notifyListeners, this);

            this.getView().stopRunningView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwCursorTapped(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as Twns.Notify.NotifyData.BwCursorTapped;
                this.setGridIndex(data.tappedOn);
                this.updateView();
            }
        }
        private _onNotifyBwCursorDragged(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as Twns.Notify.NotifyData.BwCursorDragged;
                this.setGridIndex(data.draggedTo);
                this.updateView();
                Twns.SoundManager.playShortSfx(Twns.Types.ShortSfxCode.CursorMove01);
            }
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            this.updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWar(): Twns.BaseWar.BwWar {
            return Twns.Helpers.getExisted(this._war);
        }

        public getView(): Twns.BaseWar.BwCursorView {
            return this._view;
        }
        public updateView(): void {
            this.getView().updateView();
        }

        private _setMapSize(size: Twns.Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Twns.Types.MapSize {
            return Twns.Helpers.getExisted(this._mapSize);
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
        public setGridIndex(gridIndex: Twns.Types.GridIndex): void {
            this._setPreviousGridIndex(this.getGridIndex());

            this._gridX = gridIndex.x;
            this._gridY = gridIndex.y;
            Twns.Notify.dispatch(NotifyType.BwCursorGridIndexChanged, this);
        }
        public getGridIndex(): Twns.Types.GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }

        private _setPreviousGridIndex(gridIndex: Twns.Types.GridIndex): void {
            this._previousGridIndex = gridIndex;
        }
        public getPreviousGridIndex(): Twns.Types.GridIndex | null {
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
