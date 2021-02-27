
namespace TinyWars.GameUi {
    import ProtoTypes = Utility.ProtoTypes;

    export class UiZoomableMap extends eui.Component {
        private _zoomableComponent  = new UiZoomableComponent();
        private _mapView            = new WarMap.WarMapView();

        public constructor() {
            super();

            const zoom  = this._zoomableComponent;
            zoom.left   = 0;
            zoom.right  = 0;
            zoom.top    = 0;
            zoom.bottom = 0;
            zoom.addContent(this._mapView);
            this.addChild(zoom);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public showMap(map: ProtoTypes.Map.IMapRawData): void {
            const mapView = this._mapView;
            mapView.showMap(map);

            const zoom = this._zoomableComponent;
            zoom.setContentWidth(mapView.width);
            zoom.setContentHeight(mapView.height);
            zoom.setContentScale(0, true);
        }
        public clearMap(): void {
            this._mapView.clear();
        }

        private _onAddedToStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            const zoom = this._zoomableComponent;
            zoom.setMouseWheelListenerEnabled(true);
            zoom.setTouchListenerEnabled(true);
        }
        private _onRemovedFromStage(e: egret.Event): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            const zoom = this._zoomableComponent;
            zoom.setMouseWheelListenerEnabled(false);
            zoom.setTouchListenerEnabled(false);
        }
    }
}
