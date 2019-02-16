
namespace TinyWars.MultiCustomWar {
    export class McwWarView extends eui.Group {
        private _fieldContainer = new GameUi.UiZoomableComponent();
        private _war            : McwWar;

        public constructor() {
            super();

            this.top    = 0;
            this.bottom = 0;
            this.left   = 0;
            this.right  = 0;

            this._fieldContainer.top       = 0;
            this._fieldContainer.bottom    = 0;
            this._fieldContainer.left      = 0;
            this._fieldContainer.right     = 0;
            this._fieldContainer.setBoundarySpacings(50, 50, 50, 50);
            this.addChild(this._fieldContainer);
        }

        public startRunning(): void {
        }

        public init(war: McwWar): void {
            this._war = war;

            const gridSize  = ConfigManager.getGridSize();
            const mapSize   = war.getTileMap().getMapSize();
            this._fieldContainer.removeAllContents();
            this._fieldContainer.setContentWidth(mapSize.width * gridSize.width);
            this._fieldContainer.setContentHeight(mapSize.height * gridSize.height);
            this._fieldContainer.addContent(war.getField().getView());
            this._fieldContainer.setContentScale(0, true);
        }
    }
}
