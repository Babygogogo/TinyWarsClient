
namespace TinyWars.Network {
    import Logger       = Utility.Logger;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import ProtoManager = Utility.ProtoManager;
    import Helpers      = Utility.Helpers;

    export namespace Manager {
        ////////////////////////////////////////////////////////////////////////////////
        // Constants.
        ////////////////////////////////////////////////////////////////////////////////
        const PROTOCOL  = window.location.protocol.indexOf("http:") === 0 ? "ws" : "wss";
        const HOST_NAME = window.location.hostname;
        const PORT      = 3000;
        const FULL_URL  = `${PROTOCOL}://${HOST_NAME}:${PORT}`;

        ////////////////////////////////////////////////////////////////////////////////
        // Type definitions.
        ////////////////////////////////////////////////////////////////////////////////
        type ReceivedData = any;
        export type MsgListener = {
            msgCode   : Codes;
            callback     : (e: egret.Event) => void;
            thisObject  ?: any;
        }

        class NetMessageDispatcherCls extends egret.EventDispatcher {
            public dispatchWithContainer(container: ProtoTypes.IMessageContainer): void {
                const name      = Helpers.getMessageName(container);
                const action    = container[name];
                if (action.errorCode) {
                    FloatText.show(Utility.Lang.getNetErrorText(action.errorCode));
                }
                this.dispatchEventWith(name, false, action);
            }

            public addListener(code: Codes, callback: Function, thisObject: any): void {
                this.addEventListener(Codes[code], callback, thisObject);
            }

            public removeListener(code: Codes, callback: Function, thisObject: any): void {
                this.removeEventListener(Codes[code], callback, thisObject);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Local variables.
        ////////////////////////////////////////////////////////////////////////////////
        let _socket             : egret.WebSocket;
        let _canAutoReconnect   = true;

        const dispatcher : NetMessageDispatcherCls = new NetMessageDispatcherCls();

        ////////////////////////////////////////////////////////////////////////////////
        // Exports.
        ////////////////////////////////////////////////////////////////////////////////
        export function init(): void {
            _resetSocket();
        }

        export function addListeners(listeners: MsgListener[], thisObject?: any): void {
            for (const one of listeners) {
                dispatcher.addEventListener(Codes[one.msgCode], one.callback, one.thisObject || thisObject);
            }
        }

        export function removeListeners(listeners: MsgListener[], thisObject?: any): void {
            for (const one of listeners) {
                dispatcher.removeEventListener(Codes[one.msgCode], one.callback, one.thisObject || thisObject);
            }
        }

        export function send(container: ProtoTypes.IMessageContainer): void {
            if ((!_socket) || (!_socket.connected)) {
                FloatText.show(Lang.getText(Lang.Type.A0014));
            } else {
                const name          = Helpers.getMessageName(container);
                const encodedData   = ProtoManager.encodeAsMessageContainer(container);
                Logger.log("%cNetManager send: ", "background:#97FF4F;", name, ", length: ", encodedData.byteLength, "\n", container[name]);
                _socket.writeBytes(new egret.ByteArray(encodedData));
                _socket.flush();
            }
        }

        export function checkCanAutoReconnect(): boolean {
            return _canAutoReconnect;
        }
        function setCanAutoReconnect(can: boolean): void {
            _canAutoReconnect = can;
        }

        function _resetSocket(): void {
            if (_socket) {
                _socket.close();
            }

            _socket         = new egret.WebSocket();
            _socket.type    = egret.WebSocket.TYPE_BINARY;

            _socket.addEventListener(egret.Event.CONNECT, (e) => {
                FloatText.show(Lang.getText(Lang.Type.A0007));
                Notify.dispatch(Notify.Type.NetworkConnected);
            }, Manager);

            _socket.addEventListener(egret.Event.CLOSE, e => {
                Notify.dispatch(Notify.Type.NetworkDisconnected);
                if (!checkCanAutoReconnect()) {
                    // FloatText.show(Lang.getText(Lang.Type.A0013));
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0008));
                    _socket.connectByUrl(FULL_URL);
                }
            }, Manager);

            _socket.addEventListener(egret.ProgressEvent.SOCKET_DATA, e => {
                const data      = new egret.ByteArray();
                _socket.readBytes(data);
                const container = ProtoManager.decodeAsMessageContainer(data.rawBuffer);
                const name      = Helpers.getMessageName(container);
                Logger.log("%cNetManager receive: ", "background:#FFD777", name, ", length: ", data.length, "\n", container[name]);

                if (container.S_ServerDisconnect) {
                    setCanAutoReconnect(false);
                }

                dispatcher.dispatchWithContainer(container);
            }, Manager);

            setCanAutoReconnect(true);
            _socket.connectByUrl(FULL_URL);
        }
    }
}
