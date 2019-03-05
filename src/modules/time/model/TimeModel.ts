
namespace TinyWars.Time.TimeModel {
    import Notify = Utility.Notify;
    import Lang   = Utility.Lang;

    const TILE_ANIMATION_INTERVAL = 160;        // 0.16s
    const UNIT_ANIMATION_INTERVAL = 250;        // 0.25s
    const HEARTBEAT_INTERVAL      = 60 * 1000;  // 1min

    let _isHeartbeatAnswered: boolean;
    let _heartbeatCounter   : number;
    let _heartbeatIntervalId: number;
    let _serverTimestamp    : number;

    let _tileAnimationTickCount : number = 0;
    let _unitAnimationTickCount : number = 0;

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

        // egret.setInterval(() => {
        //     ++tileAnimationTickCount;
        //     Notify.dispatch(Notify.Type.TileAnimationTick);
        // }, TimeModel, TILE_ANIMATION_INTERVAL);

        egret.setInterval(() => {
            ++_unitAnimationTickCount;
            Notify.dispatch(Notify.Type.UnitAnimationTick);
        }, TimeModel, UNIT_ANIMATION_INTERVAL);
    }

    export function getServerTimestamp(): number {
        return _serverTimestamp;
    }

    export function getTileAnimationTickCount(): number {
        return _tileAnimationTickCount;
    }

    export function getUnitAnimationTickCount(): number {
        return _unitAnimationTickCount;
    }

    function _onNotifyNetworkConnected(e: egret.Event): void {
        (_heartbeatIntervalId != null) && (egret.clearInterval(_heartbeatIntervalId));
        _heartbeatIntervalId = egret.setInterval(heartbeat, TimeModel, HEARTBEAT_INTERVAL);

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
            Utility.FloatText.show(Lang.getText(Lang.Type.A0009));
        }
        TimeProxy.reqHeartbeat(_heartbeatCounter);
    }
}
