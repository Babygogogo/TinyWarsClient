
// import TwnsWarMapView           from "../../warMap/view/WarMapView";
// import Types                    from "../helpers/Types";
// import ProtoTypes               from "../proto/ProtoTypes";
// import TwnsUiComponent          from "./UiComponent";
// import TwnsUiZoomableComponent  from "./UiZoomableComponent";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUiZoomableMap {
    export class UiZoomableMap extends TwnsUiComponent.UiComponent {
        private _zoomableComponent  = new TwnsUiZoomableComponent.UiZoomableComponent();
        private _mapView            = new Twns.WarMap.WarMapView();

        public constructor() {
            super();

            const zoom  = this._zoomableComponent;
            zoom.left   = 0;
            zoom.right  = 0;
            zoom.top    = 0;
            zoom.bottom = 0;
            zoom.addContent(this._mapView);
            this.addChild(zoom);

            this.dispatchEventWith(egret.Event.COMPLETE);
        }

        protected _onOpened(): void {
            const zoom = this._zoomableComponent;
            zoom.setMouseWheelListenerEnabled(true);
            zoom.setTouchListenerEnabled(true);
        }
        protected async _onClosed(): Promise<void> {
            const zoom = this._zoomableComponent;
            zoom.setMouseWheelListenerEnabled(false);
            zoom.setTouchListenerEnabled(false);

            this.clearMap();
        }

        public showMapByMapData(map: CommonProto.Map.IMapRawData, config: Twns.Config.GameConfig): void {
            const mapView = this._mapView;
            mapView.showMapByMapData(map, config);

            const zoom = this._zoomableComponent;
            zoom.setContentWidth(mapView.width);
            zoom.setContentHeight(mapView.height);
            zoom.setContentScale(0, true);
        }
        public showMapByWarData(data: CommonProto.WarSerialization.ISerialWar, players: Types.Undefinable<CommonProto.WarSerialization.ISerialPlayer[]>, config: Twns.Config.GameConfig): void {
            const mapView = this._mapView;
            mapView.showMapByWarData(data, config, players);

            const zoom = this._zoomableComponent;
            zoom.setContentWidth(mapView.width);
            zoom.setContentHeight(mapView.height);
            zoom.setContentScale(0, true);
        }

        public clearMap(): void {
            this._mapView.clear();
        }
    }
}

// export default TwnsUiZoomableMap;
