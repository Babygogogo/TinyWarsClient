
namespace Network {
    export namespace Manager {
        ////////////////////////////////////////////////////////////////////////////////
        // Constants.
        ////////////////////////////////////////////////////////////////////////////////
        const SERVER_ADDRESS = "localhost:3000";
        const PROTO_FILENAME = "resource/config/NetMessageProto.json";

        ////////////////////////////////////////////////////////////////////////////////
        // Type definitions.
        ////////////////////////////////////////////////////////////////////////////////
        type ReceivedData = any;
        type NetMsgData = {
            [key: string]: NetMsgData | number | string;
        };
        type NetMessage = {
            msgCode: number;
            [key: string]: NetMsgData | number | string;
        }
        type MsgHandler = {
            msgCode : number;
            callback: (msg: NetMessage) => void;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Local variables.
        ////////////////////////////////////////////////////////////////////////////////
        const Logger = Utility.Logger; // for convenience

        let   socket     : SocketIOClient.Socket;
        let   protoRoot  : protobuf.Root;
        const msgHandlers: MsgHandler[] = [];

        ////////////////////////////////////////////////////////////////////////////////
        // Functions.
        ////////////////////////////////////////////////////////////////////////////////
        export function init(): void {
            protobuf.load(PROTO_FILENAME, (err, root) => {
                if ((err) || (!root)) {
                    throw err || "no root";
                } else {
                    protoRoot = root;
                }
            });

            reset();
        }

        export function reset(): void {
            if (socket) {
                socket.removeAllListeners();
                socket.disconnect();
            }
            socket = io(SERVER_ADDRESS);

            for (const handler of msgHandlers) {
                registerMsgHandler(handler);
            }
        }

        export function addMsgHandlers(handlers: MsgHandler[]): void {
            for (const handler of handlers) {
                registerMsgHandler(handler);
                msgHandlers.push(handler);
            }
        }

        export function send(msg: NetMessage): void {
            const msgName = Codes[msg.msgCode];
            if (!msgName) {
                Logger.error("NetManager.send() failed to find the msgName with code: ", msg.msgCode);
            } else {
                Logger.log("NetManager send: ", msgName, msg);
                socket.emit(msgName, encode(msgName, msg));
            }
        }

        function registerMsgHandler(handler: MsgHandler): void {
            const msgName = Codes[handler.msgCode];
            if (!msgName) {
                Logger.error("NetManager.registerMsgHandler() failed to find the msgName with code: ", handler.msgCode);
            } else {
                socket.on(
                    msgName,
                    (data: ReceivedData) => {
                        const msg = decode(msgName, data);
                        Logger.log("NetManager receive: ", msgName, msg);
                        handler.callback(msg);
                    }
                );
            }
        }

        function encode(msgName: string, msg: NetMessage): Uint8Array {
            const t = protoRoot.lookupType(msgName);
            if (!t) {
                Logger.error("NetCenter.encode() failed to find the type: ", msgName);
            } else {
                const err = t.verify(msg);
                if (err) {
                    Logger.error("NetCenter.encode() failed to verify the message: ", err);
                } else {
                    return t.encode(t.create(msg)).finish();
                }
            }
        }

        function decode(msgName: string, encodedData: ReceivedData): NetMessage {
            const t = protoRoot.lookupType(msgName);
            if (!t) {
                Logger.error("NetCenter.decode() failed to find the type: ", msgName);
            } else {
                return t.decode(getDataForDecode(encodedData)) as any as NetMessage;
            }
        }

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
    }
}
