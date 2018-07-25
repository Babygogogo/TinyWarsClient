
namespace Time {
    export namespace TimeModel {
        import Notify = Utility.Notify;
        import Lang   = Utility.Lang;

        const TILE_ANIMATION_INTERVAL = 400;       // 0.4s
        const UNIT_ANIMATION_INTERVAL = 400;
        const HEARTBEAT_INTERVAL      = 60 * 1000; // 1min

        let isHeartbeatAnswered: boolean;
        let heartbeatCounter   : number;
        let heartbeatIntervalId: number;
        let serverTimestamp    : number;

        let tileAnimationTickCount: number = 0;
        let unitAnimationTickCount: number = 0;

        export function init(): void {
            Notify.addEventListeners([
                { name: Notify.Type.NetworkConnected,    callback: _onNotifyNetworkConnected,    thisObject: TimeModel },
                { name: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, thisObject: TimeModel },
                { name: Notify.Type.SHeartbeat,          callback: _onSHeartbeat,                thisObject: TimeModel },
            ]);

            egret.setInterval(() => {
                (serverTimestamp) && (++serverTimestamp);
                Notify.dispatch(Notify.Type.TimeTick);
            }, TimeModel, 1000);

            egret.setInterval(() => {
                ++tileAnimationTickCount;
                Notify.dispatch(Notify.Type.TileAnimationTick);
            }, TimeModel, TILE_ANIMATION_INTERVAL);

            egret.setInterval(() => {
                ++unitAnimationTickCount;
                Notify.dispatch(Notify.Type.UnitAnimationTick);
            }, TimeModel, UNIT_ANIMATION_INTERVAL);
        }

        export function getServerTimestamp(): number {
            return serverTimestamp;
        }

        export function getTileAnimationTickCount(): number {
            return tileAnimationTickCount;
        }

        export function getUnitAnimationTickCount(): number {
            return unitAnimationTickCount;
        }

        function _onNotifyNetworkConnected(e: egret.Event): void {
            (heartbeatIntervalId != null) && (egret.clearInterval(heartbeatIntervalId));
            heartbeatIntervalId = egret.setInterval(heartbeat, TimeModel, HEARTBEAT_INTERVAL);

            isHeartbeatAnswered = true;
            heartbeatCounter    = 0;
            heartbeat();
        }

        function _onNotifyNetworkDisconnected(e: egret.Event): void {
            (heartbeatIntervalId != null) && (egret.clearInterval(heartbeatIntervalId));
        }

        function _onSHeartbeat(e: egret.Event): void {
            const data = e.data as Network.Proto.IS_Heartbeat;
            if (data.counter === heartbeatCounter) {
                isHeartbeatAnswered = true;
                ++heartbeatCounter;

                if ((!serverTimestamp) || (Math.abs(data.timestamp - serverTimestamp) > 3)) {
                    serverTimestamp = data.timestamp;
                }
            }
        }

        function heartbeat(): void {
            if (!isHeartbeatAnswered) {
                Utility.FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S09));
            }
            TimeProxy.reqHeartbeat(heartbeatCounter);
        }
    }
}
