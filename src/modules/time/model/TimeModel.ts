
import * as CommonModel     from "../../common/model/CommonModel";
import * as CommonProxy     from "../../common/model/CommonProxy";
import * as Notify          from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Lang            from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as FloatText       from "../../../utility/FloatText";
import * as LocalStorage    from "../../../utility/LocalStorage";
import * as ProtoTypes      from "../../../utility/ProtoTypes";
import * as NetManager      from "../../../network/NetManager";

const TILE_ANIMATION_INTERVAL_MS    = 350;
const UNIT_ANIMATION_INTERVAL_MS    = 120;
const GRID_ANIMATION_INTERVAL_MS    = 100;
const HEARTBEAT_INTERVAL_MS         = 10 * 1000;

let _isHeartbeatAnswered        : boolean;
let _heartbeatCounter           : number;
let _heartbeatIntervalId        : number;
let _serverTimestamp            : number;

let _intervalIdForTileAnimation : number;
let _tileAnimationTickCount     = 0;
let _intervalIdForUnitAnimation : number;
let _unitAnimationTickCount     = 0;
let _gridAnimationTickCount     = 0;

export function init(): void {
    Notify.addEventListeners([
        { type: NotifyType.NetworkConnected,       callback: _onNotifyNetworkConnected, },
        { type: NotifyType.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
        { type: NotifyType.MsgCommonHeartbeat,     callback: _onMsgCommonHeartbeat, },
    ]);

    egret.setInterval(() => {
        (_serverTimestamp) && (++_serverTimestamp);
        Notify.dispatch(NotifyType.TimeTick);
    }, undefined, 1000);

    if (LocalStorage.getShowTileAnimation()) {
        startTileAnimationTick();
    }
    if (LocalStorage.getShowUnitAnimation()) {
        startUnitAnimationTick();
    }

    egret.setInterval(() => {
        ++_gridAnimationTickCount;
        Notify.dispatch(NotifyType.GridAnimationTick);
    }, undefined, GRID_ANIMATION_INTERVAL_MS);
}

export function getServerTimestamp(): number {
    return _serverTimestamp;
}

export function startTileAnimationTick(): void {
    stopTileAnimationTick();

    _intervalIdForTileAnimation = egret.setInterval(() => {
        ++_tileAnimationTickCount;
        CommonModel.tickTileImageSources();
        Notify.dispatch(NotifyType.TileAnimationTick);
    }, undefined, TILE_ANIMATION_INTERVAL_MS);
}
export function stopTileAnimationTick(): void {
    if (_intervalIdForTileAnimation != null) {
        egret.clearInterval(_intervalIdForTileAnimation);
        _intervalIdForTileAnimation = null;
    }
}
export function checkIsTileAnimationTicking(): boolean {
    return _intervalIdForTileAnimation != null;
}
export function getTileAnimationTickCount(): number {
    return _tileAnimationTickCount;
}

export function startUnitAnimationTick(): void {
    stopUnitAnimationTick();

    _intervalIdForUnitAnimation = egret.setInterval(() => {
        ++_unitAnimationTickCount;
        CommonModel.tickUnitImageSources();
        Notify.dispatch(NotifyType.UnitAnimationTick);
    }, undefined, UNIT_ANIMATION_INTERVAL_MS);
}
export function stopUnitAnimationTick(): void {
    if (_intervalIdForUnitAnimation != null) {
        egret.clearInterval(_intervalIdForUnitAnimation);
        _intervalIdForUnitAnimation = null;
    }
}
export function checkIsUnitAnimationTicking(): boolean {
    return _intervalIdForUnitAnimation != null;
}
export function getUnitAnimationTickCount(): number {
    return _unitAnimationTickCount;
}

export function getGridAnimationTickCount(): number {
    return _gridAnimationTickCount;
}

function _onNotifyNetworkConnected(): void {
    (_heartbeatIntervalId != null) && (egret.clearInterval(_heartbeatIntervalId));
    _heartbeatIntervalId = egret.setInterval(heartbeat, undefined, HEARTBEAT_INTERVAL_MS);

    _isHeartbeatAnswered = true;
    _heartbeatCounter    = 0;
    heartbeat();
}

function _onNotifyNetworkDisconnected(): void {
    (_heartbeatIntervalId != null) && (egret.clearInterval(_heartbeatIntervalId));
}

function _onMsgCommonHeartbeat(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgCommonHeartbeat.IS;
    if (data.counter === _heartbeatCounter) {
        _isHeartbeatAnswered = true;
        ++_heartbeatCounter;

        const timestamp = data.timestamp;
        if ((!_serverTimestamp) || (Math.abs(timestamp - _serverTimestamp) > 3)) {
            _serverTimestamp = timestamp;
        }
    }
}

function heartbeat(): void {
    if (!_isHeartbeatAnswered) {
        if (!NetManager.checkCanAutoReconnect()) {
            FloatText.show(Lang.getText(LangTextType.A0013));
        } else {
            FloatText.show(Lang.getText(LangTextType.A0008));
            NetManager.init();
        }
    }
    CommonProxy.reqCommonHeartbeat(_heartbeatCounter);
}
