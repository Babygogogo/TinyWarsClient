
// import TwnsBwWar                from "../../baseWar/model/BwWar";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import StageManager             from "../../tools/helpers/StageManager";
// import Types                    from "../../tools/helpers/Types";
// import Notify                   from "../../tools/notify/Notify";
// import NotifyData               from "../../tools/notify/NotifyData";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiZoomableComponent  from "../../tools/ui/UiZoomableComponent";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType   = Twns.Notify.NotifyType;
    import GridIndex    = Twns.Types.GridIndex;
    import Point        = Twns.Types.Point;

    const CENTRAL_PADDING = 120;

    type Padding = {
        left    : number;
        right   : number;
        bottom  : number;
        top     : number;
    };
    // eslint-disable-next-line no-shadow
    const enum PaddingType {
        Default,
        Replay,
        MapEditor,
    }
    const PADDINGS = new Map<PaddingType, Padding>([
        [PaddingType.Default,   { left: 90,     right: 90,  top: 120,   bottom: 20 }],
        [PaddingType.MapEditor, { left: 90,     right: 90,  top: 120,   bottom: 120 }],
        [PaddingType.Replay,    { left: 90,     right: 90,  top: 60,    bottom: 20 }],
    ]);

    export class BwWarView extends eui.Group {
        private _fieldContainer         = new TwnsUiZoomableComponent.UiZoomableComponent();
        private _weatherContainer       = new eui.Group();
        private _labelPersistentText    = new TwnsUiLabel.UiLabel();

        private _isShowingVibration = false;
        private _vibrationMaxOffset = 4;
        private _vibrationTimeoutId : number | null = null;

        private _war? : BwWar;

        private _notifyListeners: Twns.Notify.Listener[] = [
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            { type: NotifyType.BwFieldZoomed,   callback: this._onNotifyBwFieldZoomed },
            { type: NotifyType.BwFieldDragged,  callback: this._onNotifyBwFieldDragged },
        ];
        private _uiListeners: Twns.Types.UiListener[] = [
            { ui: this,     callback: this._onEnterFrame,   eventType: egret.Event.ENTER_FRAME },
        ];

        public constructor() {
            super();

            this.percentWidth   = 100;
            this.percentHeight  = 100;

            const fieldContainer = this._fieldContainer;
            resetContainer(fieldContainer);
            this.addChild(fieldContainer);

            const weatherContainer          = this._weatherContainer;
            weatherContainer.touchChildren  = false;
            weatherContainer.touchEnabled   = false;
            weatherContainer.touchThrough   = true;
            resetContainer(weatherContainer);
            this.addChild(weatherContainer);

            {
                const labelPersistentText               = this._labelPersistentText;
                labelPersistentText.size                = 16;
                labelPersistentText.stroke              = 2;
                labelPersistentText.top                 = 60;
                labelPersistentText.horizontalCenter    = 0;
                labelPersistentText.textAlign           = egret.HorizontalAlign.CENTER;
                this.addChild(labelPersistentText);
            }
        }

        public init(war: BaseWar.BwWar): void {
            const gridSize          = CommonConstants.GridSize;
            const mapSize           = war.getTileMap().getMapSize();
            const fieldContainer    = this._fieldContainer;
            const padding           = getPadding(war);
            this._war               = war;
            fieldContainer.setBoundarySpacings(padding.left, padding.right, padding.top, padding.bottom);
            fieldContainer.removeAllContents();
            fieldContainer.setContentWidth(mapSize.width * gridSize.width);
            fieldContainer.setContentHeight(mapSize.height * gridSize.height);
            fieldContainer.addContent(war.getField().getView());
            fieldContainer.setContentScale(0, true);

            this._weatherContainer.addChild(war.getWeatherManager().getView());
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public fastInit(war: BaseWar.BwWar): void {
            // nothing to do
        }

        public startRunningView(): void {
            Twns.Notify.addEventListeners(this._notifyListeners, this);
            for (const listener of this._uiListeners) {
                listener.ui.addEventListener(Twns.Helpers.getExisted(listener.eventType), listener.callback, this);
            }

            this._fieldContainer.setMouseWheelListenerEnabled(true);

            this.updatePersistentText();
        }
        public stopRunning(): void {
            Twns.Notify.removeEventListeners(this._notifyListeners, this);
            for (const listener of this._uiListeners) {
                listener.ui.removeEventListener(Twns.Helpers.getExisted(listener.eventType), listener.callback, this);
            }

            this._fieldContainer.setMouseWheelListenerEnabled(false);
        }

        public getFieldContainer(): TwnsUiZoomableComponent.UiZoomableComponent {
            return this._fieldContainer;
        }

        public tweenGridToCentralArea(gridIndex: GridIndex): void {
            const stage             = StageManager.getStage();
            const gridSize          = CommonConstants.GridSize;
            const container         = this._fieldContainer;
            const contents          = container.getContents();
            const gridWidth         = gridSize.width;
            const gridHeight        = gridSize.height;
            const stageWidth        = stage.stageWidth;
            const stageHeight       = stage.stageHeight;
            const gridX             = gridIndex.x;
            const gridY             = gridIndex.y;
            const currPoint         = contents.localToGlobal((gridX + 0.5) * gridWidth, (gridY + 0.5) * gridHeight);
            const topLeftPoint      = contents.localToGlobal(gridX * gridWidth, gridY * gridHeight);
            const bottomRightPoint  = contents.localToGlobal((gridX + 1) * gridWidth, (gridY + 1) * gridHeight);
            const currX             = currPoint.x;
            const currY             = currPoint.y;
            // const padding           = this._padding;
            const newX              = Twns.Helpers.getValueInRange({
                minValue    : CENTRAL_PADDING + currX - topLeftPoint.x,
                maxValue    : stageWidth - CENTRAL_PADDING + currX - bottomRightPoint.x,
                rawValue    : currX,
            });
            const newY              = Twns.Helpers.getValueInRange({
                minValue    : CENTRAL_PADDING + currY - topLeftPoint.y,
                maxValue    : stageHeight - CENTRAL_PADDING + currY - bottomRightPoint.y,
                rawValue    : currY,
            });
            const newPoint  = this._getRevisedContentPointForMoveGrid(gridIndex, newX, newY);
            container.tweenContentToPoint(newPoint.x, newPoint.y, false);
        }
        public moveGridToCenter(gridIndex: GridIndex): void {
            const stage = StageManager.getStage();
            this._moveGridToPoint(gridIndex, stage.stageWidth / 2, stage.stageHeight / 2);
        }
        private _moveGridToPoint(gridIndex: GridIndex, x: number, y: number): void {
            const point     = this._getRevisedContentPointForMoveGrid(gridIndex, x, y);
            const container = this._fieldContainer;
            container.setContentX(point.x, false);
            container.setContentY(point.y, false);
        }
        private _getRevisedContentPointForMoveGrid(gridIndex: GridIndex, x: number, y: number): Point {
            const gridSize  = CommonConstants.GridSize;
            const container = this._fieldContainer;
            const contents  = container.getContents();
            const point1    = contents.localToGlobal(
                (gridIndex.x + 0.5) * gridSize.width,
                (gridIndex.y + 0.5) * gridSize.height,
            );
            const point2    = contents.localToGlobal(0, 0);
            return {
                x   : container.getRevisedContentX(- point1.x + point2.x + x),
                y   : container.getRevisedContentY(- point1.y + point2.y + y),
            };
        }

        public showVibration(duration = 450, maxOffset = 5): void {
            this.stopVibration();

            this._isShowingVibration    = true;
            this._vibrationMaxOffset    = maxOffset;
            this._vibrationTimeoutId    = egret.setTimeout(() => {
                this.stopVibration();
            }, this, duration);
        }
        public stopVibration(): void {
            this._isShowingVibration = false;
            resetContainer(this._fieldContainer);

            if (this._vibrationTimeoutId != null) {
                egret.clearTimeout(this._vibrationTimeoutId);
                this._vibrationTimeoutId = null;
            }
        }
        private _checkAndVibrate(): void {
            if (this._isShowingVibration) {
                const maxOffset         = this._vibrationMaxOffset;
                const offsetX           = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
                const offsetY           = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
                const fieldContainer    = this._fieldContainer;
                fieldContainer.top      = offsetY;
                fieldContainer.bottom   = -offsetY;
                fieldContainer.left     = offsetX;
                fieldContainer.right    = -offsetX;
            }
        }

        public updatePersistentText(): void {
            const war   = this._war;
            const label = this._labelPersistentText;
            if (!war?.getIsRunning()) {
                label.text = ``;
                return;
            }

            const warEventManager   = war.getWarEventManager();
            const textArray         : string[] = [];
            for (const actionId of warEventManager.getOngoingPersistentActionIdSet()) {
                const action = warEventManager.getWarEventAction(actionId).WeaPersistentShowText;
                if (action) {
                    textArray.push(Lang.getLanguageText({ textArray: action.textArray }) ?? CommonConstants.ErrorTextForUndefined);
                }
            }
            label.text = textArray.join(`\n`);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this.updatePersistentText();
        }

        private _onNotifyBwFieldZoomed(e: egret.Event): void {
            const data = e.data as Twns.Notify.NotifyData.BwFieldZoomed;
            this._fieldContainer.setZoomByTouches(data.current, data.previous);
        }
        private _onNotifyBwFieldDragged(e: egret.Event): void {
            const data = e.data as Twns.Notify.NotifyData.BwFieldDragged;
            this._fieldContainer.setDragByTouches(data.current, data.previous);
        }

        private _onEnterFrame(): void {
            this._checkAndVibrate();
        }
    }

    function resetContainer(container: eui.UIComponent): void {
        container.left      = 0;
        container.right     = 0;
        container.top       = 0;
        container.bottom    = 0;
    }

    function getPadding(war: BaseWar.BwWar): Padding {
        if (war instanceof ReplayWar.RwWar) {
            return Twns.Helpers.getExisted(PADDINGS.get(PaddingType.Replay));
        } else if (war instanceof MapEditor.MeWar) {
            return Twns.Helpers.getExisted(PADDINGS.get(PaddingType.MapEditor));
        } else {
            return Twns.Helpers.getExisted(PADDINGS.get(PaddingType.Default));
        }
    }
}

// export default TwnsBwWarView;
