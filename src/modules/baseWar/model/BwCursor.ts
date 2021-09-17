
import Helpers              from "../../tools/helpers/Helpers";
import SoundManager         from "../../tools/helpers/SoundManager";
import Types                from "../../tools/helpers/Types";
import Notify               from "../../tools/notify/Notify";
import NotifyData           from "../../tools/notify/NotifyData";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import TwnsBwCursorView     from "../view/BwCursorView";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwCursor {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import BwWar            = TwnsBwWar.BwWar;
    import BwCursorView     = TwnsBwCursorView.BwCursorView;

    export class BwCursor {
        private _gridX              = 0;
        private _gridY              = 0;
        private _previousGridIndex  : Types.GridIndex | null = null;
        private _mapSize?           : Types.MapSize;
        private _isMovableByTouches = true;
        private readonly _view      = new BwCursorView();

        private _war?               : BwWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: NotifyType.BwCursorTapped,                 callback: this._onNotifyBwCursorTapped },
            { type: NotifyType.BwCursorDragged,                callback: this._onNotifyBwCursorDragged },
            { type: NotifyType.BwActionPlannerStateSet,    callback: this._onNotifyBwActionPlannerStateChanged },
        ];

        public init(mapSize: Types.MapSize): void {
            this._setMapSize(Helpers.deepClone(mapSize));
            this.setGridIndex({ x: 0, y: 0 });

            this.getView().init(this);
        }
        public fastInit(): void {
            this.getView().fastInit(this);
        }

        public startRunning(war: BwWar): void {
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
                const data = e.data as NotifyData.BwCursorTapped;
                this.setGridIndex(data.tappedOn);
                this.updateView();
            }
        }
        private _onNotifyBwCursorDragged(e: egret.Event): void {
            if (this.getIsMovableByTouches()) {
                const data = e.data as NotifyData.BwCursorDragged;
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
        public getWar(): BwWar {
            return Helpers.getExisted(this._war);
        }

        public getView(): BwCursorView {
            return this._view;
        }
        public updateView(): void {
            this.getView().updateView();
        }

        public setVisibleForConForNormal(visible: boolean): void {
            this.getView().setVisibleForConForNormal(visible);
        }
        public setVisibleForConForTarget(visible: boolean): void {
            this.getView().setVisibleForConForTarget(visible);
        }
        public setVisibleForConForSiloArea(visible: boolean): void {
            this.getView().setVisibleForConForSiloArea(visible);
        }

        private _setMapSize(size: Types.MapSize): void {
            this._mapSize = size;
        }
        public getMapSize(): Types.MapSize {
            return Helpers.getExisted(this._mapSize);
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
            Notify.dispatch(NotifyType.BwCursorGridIndexChanged);
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

export default TwnsBwCursor;
