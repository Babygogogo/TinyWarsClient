
namespace Network {
    export namespace Manager {
        import Logger = Utility.Logger;
        import Notify = Utility.Notify;

        ////////////////////////////////////////////////////////////////////////////////
        // Constants.
        ////////////////////////////////////////////////////////////////////////////////
        const SERVER_ADDRESS = "localhost:3000";
        const PROTO_FILENAME = "resource/config/NetMessageProto.json";

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
            public dispatchWithContainer(container: Proto.Container): void {
                const name   = Codes[container.actionCode];
                const action = container[name];
                Logger.log("NetManager receive: ", name, action);
                if (action.errorCode) {
                    Utility.FloatText.show(Utility.Lang.getNetErrorText(action.errorCode));
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
        let   socket        : SocketIOClient.Socket;
        let   protoRoot     : protobuf.Root;
        let   containerClass: typeof Proto.Container;
        const dispatcher    : NetMessageDispatcherCls = new NetMessageDispatcherCls();
        const msgHandlers   : MsgListener[] = [];

        ////////////////////////////////////////////////////////////////////////////////
        // Helpers.
        ////////////////////////////////////////////////////////////////////////////////
        function getDataForDecode(encodedData: ReceivedData): Uint8Array | protobuf.Reader {
            if (encodedData instanceof ArrayBuffer) {
                return new Uint8Array(encodedData);
            } else {
                // TODO: fix the type
                return Object.keys(encodedData).map(function(k) {
                    return encodedData[k];
                }) as any as Uint8Array;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Exports.
        ////////////////////////////////////////////////////////////////////////////////
        export function init(): void {
            protobuf.load(PROTO_FILENAME, (err, root) => {
                if ((err) || (!root)) {
                    throw err || "no root";
                } else {
                    protoRoot      = root;
                    containerClass = root.lookupType("Container") as any;
                }
            });

            resetSocket();
        }

        export function resetSocket(): void {
            if (socket) {
                socket.removeAllListeners();
                socket.disconnect();
            }
            socket = io(SERVER_ADDRESS);
            socket.on("connect", () => {
                Notify.dispatch(Notify.Type.NetworkConnected);
            });
            socket.on("disconnect", () => {
                Notify.dispatch(Notify.Type.NetworkDisconnected);
            });
            socket.on("message", (data: ReceivedData) => {
                dispatcher.dispatchWithContainer(containerClass.decode(getDataForDecode(data)));
            });
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
                socket.emit(
                    "message",
                    containerClass.encode({
                        actionCode: code,
                        [name]    : action,
                    }).finish()
                );
            }
        }
    }
}
