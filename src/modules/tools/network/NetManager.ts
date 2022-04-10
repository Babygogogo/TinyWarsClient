
// import Logger               from "../helpers/Logger";
// import Notify               from "../notify/Notify";
// import TwnsNotifyType       from "../notify/NotifyType";
// import TwnsLangTextType     from "../lang/LangTextType";
// import TwnsNetMessageCodes  from "./NetMessageCodes";
// import FloatText            from "../helpers/FloatText";
// import Lang                 from "../lang/Lang";
// import ProtoTypes           from "../proto/ProtoTypes";
// import ProtoManager         from "../proto/ProtoManager";
// import Helpers              from "../helpers/Helpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NetManager {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    ////////////////////////////////////////////////////////////////////////////////
    // Constants.
    ////////////////////////////////////////////////////////////////////////////////
    const USE_SIGNALR   = false;
    const PROTOCOL      = window.location.protocol.indexOf("http:") === 0 ? "ws" : "wss";
    const HOST_NAME     = window.location.hostname;
    // const FULL_URL      = `${PROTOCOL}://${HOST_NAME}:${window.GAME_SERVER_PORT}`;
    const FULL_URL  = `wss://www.tinywars.online:${4001}`;

    ////////////////////////////////////////////////////////////////////////////////
    // Type definitions.
    ////////////////////////////////////////////////////////////////////////////////
    export type MsgListener = {
        msgCode     : NetMessageCodes;
        callback    : (e: egret.Event) => void;
        thisObject? : any;
    };

    class NetMessageDispatcher extends egret.EventDispatcher {
        public dispatchWithContainer(container: CommonProto.NetMessage.IMessageContainer): void {
            const messageName   = Helpers.getMessageName(container);
            const message       = container[messageName];
            const messageData   = Helpers.getExisted(message ? message.s : null, ClientErrorCode.NetManager_NetMessageDispatcher_DispatchWithContainer_00);
            if (container.MsgMpwCommonHandleBoot) {
                // Don't show the error text.
            } else {
                const errorCode = (messageData as any).errorCode;
                if (errorCode) {
                    FloatText.show(Lang.getErrorText(errorCode));
                }
            }
            this.dispatchEventWith(messageName, false, messageData);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Local variables.
    ////////////////////////////////////////////////////////////////////////////////
    let _webSocketConnection    : egret.WebSocket | null = null;
    // let _signalRConnection      : signalR.HubConnection | null = null;
    let _canAutoReconnect       = true;

    const dispatcher = new NetMessageDispatcher();

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export function init(): void {
        resetConnection();
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    export function addListeners(listeners: MsgListener[], thisObject?: any): void {
        for (const one of listeners) {
            dispatcher.addEventListener(NetMessageCodes[one.msgCode], one.callback, one.thisObject || thisObject);
        }
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    export function removeListeners(listeners: MsgListener[], thisObject?: any): void {
        for (const one of listeners) {
            dispatcher.removeEventListener(NetMessageCodes[one.msgCode], one.callback, one.thisObject || thisObject);
        }
    }

    export function send(container: CommonProto.NetMessage.IMessageContainer): void {
        if (USE_SIGNALR) {
            // const connection = _signalRConnection;
            // if ((!connection) || (connection.state !== signalR.HubConnectionState.Connected)) {
            //     FloatText.show(Lang.getText(LangTextType.A0014));
            // } else {
            //     const messageName = Helpers.getMessageName(container);
            //     const encodedData = ProtoManager.encodeAsMessageContainer(container);
            //     Logger.log("%cNetManager send: ", "background:#97FF4F;", messageName, ", length: ", encodedData.byteLength, "\n", container[messageName]);
            //     connection.send("C", encodedData);
            // }

        } else {
            const connection = _webSocketConnection;
            if ((!connection) || (!connection.connected)) {
                FloatText.show(Lang.getText(LangTextType.A0014));
            } else {
                const messageName = Helpers.getMessageName(container);
                const encodedData = ProtoManager.encodeAsMessageContainer(container);
                Logger.log("%cNetManager send: ", "background:#97FF4F;", messageName, ", length: ", encodedData.byteLength, "\n", container[messageName]);
                connection.writeBytes(new egret.ByteArray(encodedData));
                connection.flush();
            }
        }
    }

    export function checkCanAutoReconnect(): boolean {
        return _canAutoReconnect;
    }
    function setCanAutoReconnect(can: boolean): void {
        _canAutoReconnect = can;
    }

    function resetConnection(): void {
        destroyConnection();
        initConnection();
    }
    function initConnection(): void {
        if (USE_SIGNALR) {
            // if (_signalRConnection == null) {
            //     const connection = new signalR.HubConnectionBuilder()
            //         .withUrl(`${FULL_URL}/hub`, {
            //             skipNegotiation : true,
            //             transport       : signalR.HttpTransportType.WebSockets,
            //         })
            //         .withHubProtocol(new signalR.protocols.msgpack.MessagePackHubProtocol())
            //         .build();
            //     connection.onclose(() => onSignalRConnectionClosed(connection));
            //     connection.on("S", (data) => onSignalRData(connection, data));

            //     setCanAutoReconnect(true);
            //     connection.start().then(
            //         () => onSignalRConnectionOpened(connection),
            //         () => onSignalRConnectionClosed(connection),
            //     );

            //     _signalRConnection = connection;
            // }

        } else {
            if (_webSocketConnection == null) {
                const connection    = new egret.WebSocket();
                connection.type     = egret.WebSocket.TYPE_BINARY;
                connection.addEventListener(egret.Event.CONNECT,               onWebSocketConnectionOpened,   null);
                connection.addEventListener(egret.Event.CLOSE,                 onWebSocketConnectionClosed,   null);
                connection.addEventListener(egret.ProgressEvent.SOCKET_DATA,   onWebSocketData,               null);

                setCanAutoReconnect(true);
                connection.connectByUrl(FULL_URL);

                _webSocketConnection = connection;
            }
        }
    }
    function destroyConnection(): void {
        if (_webSocketConnection) {
            _webSocketConnection.removeEventListener(egret.Event.CONNECT,                onWebSocketConnectionOpened,   null);
            _webSocketConnection.removeEventListener(egret.Event.CLOSE,                  onWebSocketConnectionClosed,   null);
            _webSocketConnection.removeEventListener(egret.ProgressEvent.SOCKET_DATA,    onWebSocketData,               null);
            _webSocketConnection.close();

            _webSocketConnection = null;
        }
        // if (_signalRConnection) {
        //     _signalRConnection.off("S");
        //     _signalRConnection.stop();

        //     _signalRConnection = null;
        // }
    }

    function onWebSocketConnectionOpened(): void {
        FloatText.show(Lang.getText(LangTextType.A0007));

        Notify.dispatch(NotifyType.NetworkConnected);
    }
    function onWebSocketConnectionClosed(): void {
        Notify.dispatch(NotifyType.NetworkDisconnected);
        if (!checkCanAutoReconnect()) {
            // FloatText.show(Lang.getText(Lang.Type.A0013));
        } else {
            FloatText.show(Lang.getText(LangTextType.A0008));

            Helpers.getExisted(_webSocketConnection, ClientErrorCode.NetManager_OnSocketClose_00).connectByUrl(FULL_URL);
        }
    }
    function onWebSocketData(): void {
        if (_webSocketConnection == null) {
            throw Helpers.newError(`NetManager.onSocketData() empty _socket.`, ClientErrorCode.NetManager_OnSocketData_00);
        }

        const data = new egret.ByteArray();
        _webSocketConnection.readBytes(data);

        const container     = ProtoManager.decodeAsMessageContainer(data.rawBuffer);
        const messageName   = Helpers.getMessageName(container);
        Logger.log("%cNetManager receive: ", "background:#FFD777", messageName, ", length: ", data.length, "\n", container[messageName]);

        if (container.MsgCommonServerDisconnect) {
            setCanAutoReconnect(false);
        }

        dispatcher.dispatchWithContainer(container);
    }

    // function onSignalRConnectionOpened(connection: signalR.HubConnection): void {
    //     if (connection === _signalRConnection) {
    //         FloatText.show(Lang.getText(LangTextType.A0007));

    //         Notify.dispatch(NotifyType.NetworkConnected);
    //     } else {
    //         connection.off("S");
    //         connection.stop();
    //     }
    // }
    // function onSignalRConnectionClosed(connection: signalR.HubConnection): void {
    //     if (connection === _signalRConnection) {
    //         Notify.dispatch(NotifyType.NetworkDisconnected);
    //         if (!checkCanAutoReconnect()) {
    //             // FloatText.show(Lang.getText(Lang.Type.A0013));
    //         } else {
    //             FloatText.show(Lang.getText(LangTextType.A0008));

    //             connection.start().then(
    //                 () => onSignalRConnectionOpened(connection),
    //                 () => onSignalRConnectionClosed(connection),
    //             );
    //         }
    //     }
    // }
    // function onSignalRData(connection: signalR.HubConnection, data: Uint8Array): void {
    //     if (connection === _signalRConnection) {
    //         const container     = ProtoManager.decodeAsMessageContainer(data);
    //         const messageName   = Helpers.getMessageName(container);
    //         Logger.log("%cNetManager receive: ", "background:#FFD777", messageName, ", length: ", data.length, "\n", container[messageName]);

    //         if (container.MsgCommonServerDisconnect) {
    //             setCanAutoReconnect(false);
    //         }

    //         dispatcher.dispatchWithContainer(container);
    //     }
    // }
}

// export default NetManager;
