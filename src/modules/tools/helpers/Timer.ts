
// import CommonModel      from "../../common/model/CommonModel";
// import CommonProxy      from "../../common/model/CommonProxy";
// import Lang             from "../lang/Lang";
// import TwnsLangTextType from "../lang/LangTextType";
// import NetManager       from "../network/NetManager";
// import Notify           from "../notify/Notify";
// import Notify   from "../notify/NotifyType";
// import ProtoTypes       from "../proto/ProtoTypes";
// import FloatText        from "./FloatText";
// import Helpers          from "./Helpers";
// import LocalStorage     from "./LocalStorage";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Timer {
    import NotifyType       = Notify.NotifyType;
    import LangTextType     = Twns.Lang.LangTextType;

    const TILE_ANIMATION_INTERVAL_MS        = 200;
    const UNIT_ANIMATION_INTERVAL_MS        = 120;
    const UNIT_STATE_INDICATOR_INTERVAL_MS  = 720;
    const GRID_ANIMATION_INTERVAL_MS        = 100;
    const HEARTBEAT_INTERVAL_MS             = 10 * 1000;

    let _isHeartbeatAnswered            : boolean;
    let _heartbeatCounter               : number;
    let _heartbeatIntervalId            : number;
    let _serverTimestamp                : number;

    let _intervalIdForTileAnimation     : number | null;
    let _tileAnimationTickCount         = 0;
    let _intervalIdForUnitAnimation     : number | null;
    let _unitAnimationTickCount         = 0;
    let _unitStateIndicatorTickCount    = 0;
    let _gridAnimationTickCount         = 0;

    export function init(): void {
        Notify.addEventListeners([
            { type: NotifyType.NetworkConnected,       callback: _onNotifyNetworkConnected, },
            { type: NotifyType.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
            { type: NotifyType.MsgCommonHeartbeat,     callback: _onMsgCommonHeartbeat, },
        ]);

        egret.setInterval(() => {
            (_serverTimestamp) && (++_serverTimestamp);
            Notify.dispatch(NotifyType.TimeTick);
        }, null, 1000);

        if (LocalStorage.getShowTileAnimation()) {
            startTileAnimationTick();
        }
        if (LocalStorage.getShowUnitAnimation()) {
            startUnitAnimationTick();
        }

        egret.setInterval(() => {
            ++_gridAnimationTickCount;
            Notify.dispatch(NotifyType.GridAnimationTick);
        }, null, GRID_ANIMATION_INTERVAL_MS);

        egret.setInterval(() => {
            ++_unitStateIndicatorTickCount;
            Notify.dispatch(NotifyType.UnitStateIndicatorTick);
        }, null, UNIT_STATE_INDICATOR_INTERVAL_MS);
    }

    export function getServerTimestamp(): number {
        return _serverTimestamp;
    }

    export function startTileAnimationTick(): void {
        stopTileAnimationTick();

        _intervalIdForTileAnimation = egret.setInterval(() => {
            ++_tileAnimationTickCount;
            Common.CommonModel.tickTileImageSources();
            Notify.dispatch(NotifyType.TileAnimationTick);
        }, null, TILE_ANIMATION_INTERVAL_MS);
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
            Common.CommonModel.tickUnitImageSources();
            Notify.dispatch(NotifyType.UnitAnimationTick);
        }, null, UNIT_ANIMATION_INTERVAL_MS);
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
    export function getUnitStateIndicatorTickCount(): number {
        return _unitStateIndicatorTickCount;
    }

    export function getGridAnimationTickCount(): number {
        return _gridAnimationTickCount;
    }

    function _onNotifyNetworkConnected(): void {
        (_heartbeatIntervalId != null) && (egret.clearInterval(_heartbeatIntervalId));
        _heartbeatIntervalId = egret.setInterval(heartbeat, null, HEARTBEAT_INTERVAL_MS);

        _isHeartbeatAnswered = true;
        _heartbeatCounter    = 0;
        heartbeat();
    }

    function _onNotifyNetworkDisconnected(): void {
        (_heartbeatIntervalId != null) && (egret.clearInterval(_heartbeatIntervalId));
    }

    function _onMsgCommonHeartbeat(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgCommonHeartbeat.IS;
        if (data.counter === _heartbeatCounter) {
            _isHeartbeatAnswered = true;
            ++_heartbeatCounter;

            const timestamp = Helpers.getExisted(data.timestamp);
            if ((!_serverTimestamp) || (Math.abs(timestamp - _serverTimestamp) > 3)) {
                _serverTimestamp = timestamp;
            }
        }
    }

    function heartbeat(): void {
        if (!_isHeartbeatAnswered) {
            if (!Net.NetManager.checkCanAutoReconnect()) {
                FloatText.show(Lang.getText(LangTextType.A0013));
            } else {
                FloatText.show(Lang.getText(LangTextType.A0008));
                Net.NetManager.init();
            }
        }
        Common.CommonProxy.reqCommonHeartbeat(_heartbeatCounter);
    }
}

// export default Timer;
