
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
    const PROTOCOL  = window.location.protocol.indexOf("http:") === 0 ? "ws" : "wss";
    const HOST_NAME = window.location.hostname;
    const FULL_URL  = `${PROTOCOL}://${HOST_NAME}:${window.GAME_SERVER_PORT}`;
    // const FULL_URL  = `wss://www.tinywars.online:${4002}`;

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

        // public addListener(code: NetMessageCodes, callback: () => void, thisObject: any): void {
        //     this.addEventListener(NetMessageCodes[code], callback, thisObject);
        // }

        // public removeListener(code: NetMessageCodes, callback: () => void, thisObject: any): void {
        //     this.removeEventListener(NetMessageCodes[code], callback, thisObject);
        // }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Local variables.
    ////////////////////////////////////////////////////////////////////////////////
    let _socket             : egret.WebSocket | null = null;
    let _canAutoReconnect   = true;

    const dispatcher = new NetMessageDispatcher();

    ////////////////////////////////////////////////////////////////////////////////
    // Exports.
    ////////////////////////////////////////////////////////////////////////////////
    export function init(): void {
        resetSocket();
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
        if ((!_socket) || (!_socket.connected)) {
            const errorText = Lang.getText(LangTextType.A0014);
            (errorText) && (FloatText.show(errorText));
        } else {
            const messageName = Helpers.getMessageName(container);
            const encodedData = ProtoManager.encodeAsMessageContainer(container);
            Logger.log("%cNetManager send: ", "background:#97FF4F;", messageName, ", length: ", encodedData.byteLength, "\n", container[messageName]);
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

    function resetSocket(): void {
        destroySocket();
        initSocket();
    }
    function initSocket(): void {
        if (!_socket) {
            _socket         = new egret.WebSocket();
            _socket.type    = egret.WebSocket.TYPE_BINARY;
            _socket.addEventListener(egret.Event.CONNECT,               onSocketConnect,    null);
            _socket.addEventListener(egret.Event.CLOSE,                 onSocketClose,      null);
            _socket.addEventListener(egret.ProgressEvent.SOCKET_DATA,   onSocketData,       null);

            setCanAutoReconnect(true);
            _socket.connectByUrl(FULL_URL);
        }
    }
    function destroySocket(): void {
        if (_socket) {
            _socket.removeEventListener(egret.Event.CONNECT,                onSocketConnect,    null);
            _socket.removeEventListener(egret.Event.CLOSE,                  onSocketClose,      null);
            _socket.removeEventListener(egret.ProgressEvent.SOCKET_DATA,    onSocketData,       null);
            _socket.close();

            _socket = null;
        }
    }

    function onSocketConnect(): void {
        const successText = Lang.getText(LangTextType.A0007);
        (successText) && (FloatText.show(successText));

        Notify.dispatch(NotifyType.NetworkConnected);
    }
    function onSocketClose(): void {
        Notify.dispatch(NotifyType.NetworkDisconnected);
        if (!checkCanAutoReconnect()) {
            // FloatText.show(Lang.getText(Lang.Type.A0013));
        } else {
            const tips = Lang.getText(LangTextType.A0008);
            (tips) && (FloatText.show(tips));

            if (_socket == null) {
                throw Helpers.newError(`NetManager.onSocketClose() empty _socket.`, ClientErrorCode.NetManager_OnSocketClose_00);
            }
            _socket.connectByUrl(FULL_URL);
        }
    }
    function onSocketData(): void {
        if (_socket == null) {
            throw Helpers.newError(`NetManager.onSocketData() empty _socket.`, ClientErrorCode.NetManager_OnSocketData_00);
        }

        const data = new egret.ByteArray();
        _socket.readBytes(data);

        const container     = ProtoManager.decodeAsMessageContainer(data.rawBuffer);
        const messageName   = Helpers.getMessageName(container);
        Logger.log("%cNetManager receive: ", "background:#FFD777", messageName, ", length: ", data.length, "\n", container[messageName]);

        if (container.MsgCommonServerDisconnect) {
            setCanAutoReconnect(false);
        }

        dispatcher.dispatchWithContainer(container);
    }
}

// export default NetManager;
