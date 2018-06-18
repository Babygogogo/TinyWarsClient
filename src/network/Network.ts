
namespace Network {
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
    export type NetMessage = {
        msgCode: number;
        [key: string]: NetMsgData | number | string;
    }
    type MsgHandler = {
        msgName : string;
        callback: (data: NetMessage) => void;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Local variables.
    ////////////////////////////////////////////////////////////////////////////////
    declare const protobuf: any; // protobuf
    let   socket     : SocketIOClient.Socket;
    let   protoRoot  : any; // protobuf.Root
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

    export function send(msgName: string, msg: NetMessage): void {
        socket.emit(msgName, encode(msgName, msg));
    }

    function registerMsgHandler(handler: MsgHandler): void {
        socket.on(
            handler.msgName,
            (data: ReceivedData) => {
                handler.callback(decode(handler.msgName, data));
            }
        );
    }

    function encode(msgName: string, msg: NetMessage): Uint8Array {
        const t = protoRoot.lookupType(msgName);
        if (!t) {
            Utility.Logger.error("NetCenter.encode() failed to find the type: ", msgName);
        } else {
            const err = t.verify(msg);
            if (err) {
                Utility.Logger.error("NetCenter.encode() failed to verify the message: ", err);
            } else {
                return t.encode(t.create(msg)).finish();
            }
        }
    }

    function decode(msgName: string, encodedData: ReceivedData): NetMessage {
        const t = protoRoot.lookupType(msgName);
        if (!t) {
            Utility.Logger.error("NetCenter.decode() failed to find the type: ", msgName);
        } else {
            return t.decode(getDataForDecode(encodedData));
        }
    }

    function getDataForDecode(encodedData: ReceivedData): Uint8Array | any[] {
        if (encodedData instanceof ArrayBuffer) {
            return new Uint8Array(encodedData);
        } else {
            return Object.keys(encodedData).map(function(k) {
                return encodedData[k];
            });
        }
    }
}
