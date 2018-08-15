
namespace Network {
    export namespace Manager {
        import Logger       = Utility.Logger;
        import Notify       = Utility.Notify;
        import FloatText    = Utility.FloatText;
        import Lang         = Utility.Lang;
        import ProtoTypes   = Utility.ProtoTypes;
        import ProtoManager = Utility.ProtoManager;

        ////////////////////////////////////////////////////////////////////////////////
        // Constants.
        ////////////////////////////////////////////////////////////////////////////////
        const SERVER_ADDRESS = window.location.hostname + ":3000";

        ////////////////////////////////////////////////////////////////////////////////
        // Type definitions.
        ////////////////////////////////////////////////////////////////////////////////
        type ReceivedData = any;
        type Action       = Utility.Types.Action;
        type MsgListener = {
            actionCode: Codes;
            callback  : (e: egret.Event) => void;
            thisObject: any;
        }

        class NetMessageDispatcherCls extends egret.EventDispatcher {
            public dispatchWithContainer(container: ProtoTypes.IContainer): void {
                const name   = Codes[container.actionCode];
                const action = container[name];
                Logger.log("NetManager receive: ", name, action);
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
        let   socket          : SocketIOClient.Socket;
        let   reinitIntervalId: number;

        const dispatcher : NetMessageDispatcherCls = new NetMessageDispatcherCls();
        const msgHandlers: MsgListener[] = [];

        ////////////////////////////////////////////////////////////////////////////////
        // Exports.
        ////////////////////////////////////////////////////////////////////////////////
        export function init(): void {
            _resetSocket();
            reinitIntervalId = egret.setInterval(() => {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S08) + "init_failed");
                _resetSocket();
            }, Manager, 10000);
        }

        export function addListeners(...listeners: MsgListener[]): void {
            for (const one of listeners) {
                dispatcher.addEventListener(Codes[one.actionCode], one.callback, one.thisObject);
            }
        }

        export function removeListeners(...listeners: MsgListener[]): void {
            for (const one of listeners) {
                dispatcher.removeEventListener(Codes[one.actionCode], one.callback, one.thisObject);
            }
        }

        export function send(action: Action): void {
            const code = action.actionCode;
            const name = Codes[code];

            if (!name) {
                Logger.error("NetManager.send() failed to find the msgName with code: ", code);
            } else {
                Logger.log("NetManager send: ", name, action);
                socket.send(ProtoManager.encodeAsContainer(action));
            }
        }

        function _resetSocket(): void {
            if (socket) {
                socket.removeAllListeners();
                socket.disconnect();
            }
            socket = io(SERVER_ADDRESS);

            socket.on("connect", () => {
                egret.clearInterval(reinitIntervalId);
                reinitIntervalId = undefined;

                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S07));
                Notify.dispatch(Notify.Type.NetworkConnected);
            });

            socket.on("connect_error", () => {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S08) + "connect_error");
            });

            socket.on("error", () => {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S08) + "error");
            });

            socket.on("disconnect", (reason: string) => {
                FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S08) + "disconnect: " + reason);
                Notify.dispatch(Notify.Type.NetworkDisconnected);

                if (reason === 'io server disconnect') {
                    socket.connect();
                }
            });

            socket.on("message", (data: ReceivedData) => {
                dispatcher.dispatchWithContainer(ProtoManager.decodeAsContainer(data));
            });
        }
    }
}
