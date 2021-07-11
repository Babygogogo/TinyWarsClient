
import * as Types       from "./Types";
import { BwPlayer }     from "../modules/baseWar/model/BwPlayer";
import { NotifyType }   from "./NotifyType";
import GridIndex        = Types.GridIndex;
import TouchPoints      = Types.TouchPoints;

////////////////////////////////////////////////////////////////////////////////
// Notify datas.
////////////////////////////////////////////////////////////////////////////////
export namespace Data {
    export type ConfigLoaded                = number;
    export type McwPlayerIndexInTurnChanged = number;
    export type McwPlayerFundChanged        = BwPlayer;
    export type McwPlayerEnergyChanged      = BwPlayer;
    export type BwCursorTapped              = { current: GridIndex, tappedOn: GridIndex };
    export type BwCursorDragged             = { current: GridIndex, draggedTo: GridIndex };
    export type BwFieldZoomed               = { previous: TouchPoints, current: TouchPoints };
    export type BwFieldDragged              = { previous: Types.Point, current: Types.Point };
    export type MeUnitChanged               = { gridIndex: GridIndex };
    export type MeTileChanged               = { gridIndex: GridIndex };
    export type ScrCreatePlayerInfoChanged  = { playerIndex: number };
}

////////////////////////////////////////////////////////////////////////////////
// Dispatcher functions.
////////////////////////////////////////////////////////////////////////////////
const _DISPATCHER = new egret.EventDispatcher();

export type Listener = {
    type        : NotifyType,
    callback    : (e: egret.Event) => void,
    thisObject? : any,
    useCapture? : boolean,
    priority?   : number;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function dispatch(t: NotifyType, data?: any): void {
    _DISPATCHER.dispatchEventWith(getTypeName(t), false, data);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addEventListener(type: NotifyType, callback: (e: egret.Event) => void, thisObject?: any, useCapture?: boolean, priority?: number): void {
    _DISPATCHER.addEventListener(getTypeName(type), callback, thisObject, useCapture, priority);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addEventListeners(listeners: Listener[], thisObject?: any, useCapture?: boolean, priority?: number): void {
    for (const l of listeners) {
        addEventListener(
            l.type,
            l.callback,
            l.thisObject != null ? l.thisObject : thisObject,
            l.useCapture != null ? l.useCapture : useCapture,
            l.priority   != null ? l.priority   : priority
        );
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function removeEventListener(type: NotifyType, callback: (e: egret.Event) => void, thisObject?: any, useCapture?: boolean): void {
    _DISPATCHER.removeEventListener(getTypeName(type), callback, thisObject, useCapture);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function removeEventListeners(listeners: Listener[], thisObject?: any, useCapture?: boolean): void {
    for (const l of listeners) {
        removeEventListener(
            l.type,
            l.callback,
            l.thisObject != null ? l.thisObject : thisObject,
            l.useCapture != null ? l.useCapture : useCapture
        );
    }
}

function getTypeName(t: NotifyType): string {
    return "Notify" + t;
}
