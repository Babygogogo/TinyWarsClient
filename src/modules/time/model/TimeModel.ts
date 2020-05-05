
namespace TinyWars.Time.TimeModel {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import LocalStorage = Utility.LocalStorage;
    import NetManager   = Network.Manager;

    const TILE_ANIMATION_INTERVAL_MS = 350;
    const UNIT_ANIMATION_INTERVAL_MS = 120;
    const GRID_ANIMATION_INTERVAL_MS = 100;
    const HEARTBEAT_INTERVAL_MS      = 10 * 1000;

    let _isHeartbeatAnswered: boolean;
    let _heartbeatCounter   : number;
    let _heartbeatIntervalId: number;
    let _serverTimestamp    : number;

    let _intervalIdForTileAnimation : number;
    let _tileAnimationTickCount     = 0;
    let _unitAnimationTickCount     = 0;
    let _gridAnimationTickCount     = 0;

    export function init(): void {
        Notify.addEventListeners([
            { type: Notify.Type.NetworkConnected,    callback: _onNotifyNetworkConnected,    thisObject: TimeModel },
            { type: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, thisObject: TimeModel },
            { type: Notify.Type.SHeartbeat,          callback: _onSHeartbeat,                thisObject: TimeModel },
        ]);

        egret.setInterval(() => {
            (_serverTimestamp) && (++_serverTimestamp);
            Notify.dispatch(Notify.Type.TimeTick);
        }, TimeModel, 1000);

        if (LocalStorage.getShowTileAnimation()) {
            startTileAnimationTick();
        }

        egret.setInterval(() => {
            ++_gridAnimationTickCount;
            Notify.dispatch(Notify.Type.GridAnimationTick);
        }, TimeModel, GRID_ANIMATION_INTERVAL_MS);

        egret.setInterval(() => {
            ++_unitAnimationTickCount;
            Common.CommonModel.tickUnitImageSources(_unitAnimationTickCount);
            Notify.dispatch(Notify.Type.UnitAnimationTick);
        }, TimeModel, UNIT_ANIMATION_INTERVAL_MS);
    }

    export function getServerTimestamp(): number {
        return _serverTimestamp;
    }

    export function startTileAnimationTick(): void {
        stopTileAnimationTick();

        _intervalIdForTileAnimation = egret.setInterval(() => {
            ++_tileAnimationTickCount;
            Common.CommonModel.tickTileImageSources(_tileAnimationTickCount);
            Notify.dispatch(Notify.Type.TileAnimationTick);
        }, TimeModel, TILE_ANIMATION_INTERVAL_MS);
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

    export function getUnitAnimationTickCount(): number {
        return _unitAnimationTickCount;
    }

    export function getGridAnimationTickCount(): number {
        return _gridAnimationTickCount;
    }

    function _onNotifyNetworkConnected(e: egret.Event): void {
        (_heartbeatIntervalId != null) && (egret.clearInterval(_heartbeatIntervalId));
        _heartbeatIntervalId = egret.setInterval(heartbeat, TimeModel, HEARTBEAT_INTERVAL_MS);

        _isHeartbeatAnswered = true;
        _heartbeatCounter    = 0;
        heartbeat();
    }

    function _onNotifyNetworkDisconnected(e: egret.Event): void {
        (_heartbeatIntervalId != null) && (egret.clearInterval(_heartbeatIntervalId));
    }

    function _onSHeartbeat(e: egret.Event): void {
        const data = e.data as Utility.ProtoTypes.IS_Heartbeat;
        if (data.counter === _heartbeatCounter) {
            _isHeartbeatAnswered = true;
            ++_heartbeatCounter;

            if ((!_serverTimestamp) || (Math.abs(data.timestamp - _serverTimestamp) > 3)) {
                _serverTimestamp = data.timestamp;
            }
        }
    }

    function heartbeat(): void {
        if (!_isHeartbeatAnswered) {
            if (!NetManager.checkCanAutoReconnect()) {
                Utility.FloatText.show(Lang.getText(Lang.Type.A0013));
            } else {
                Utility.FloatText.show(Lang.getText(Lang.Type.A0008));
                NetManager.init();
            }
        }
        TimeProxy.reqHeartbeat(_heartbeatCounter);
    }
}
