
namespace TinyWars.Utility.ProtoManager {
    import IMessageContainer    = ProtoTypes.NetMessage.IMessageContainer;
    import ISerialWar           = ProtoTypes.WarSerialization.ISerialWar;
    import IMapRawData          = ProtoTypes.Map.IMapRawData;

    const PROTO_FILENAME = "resource/config/NetMessageProto.json";

    let MessageContainerClass   : typeof ProtoTypes.NetMessage.MessageContainer;
    let FullConfigClass         : typeof ProtoTypes.Config.FullConfig;
    let SerialWarClass          : typeof ProtoTypes.WarSerialization.SerialWar;
    let MapRawDataClass         : typeof ProtoTypes.Map.MapRawData;

    export function init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            protobuf.load(PROTO_FILENAME).then(
                protoRoot => {
                    if (!protoRoot) {
                        reject("no root!");
                    } else {
                        MessageContainerClass   = protoRoot.lookupType("NetMessage.MessageContainer") as any;
                        FullConfigClass         = protoRoot.lookupType("Config.FullConfig") as any;
                        SerialWarClass          = protoRoot.lookupType("WarSerialization.SerialWar") as any;
                        MapRawDataClass         = protoRoot.lookupType("Map.MapRawData") as any;
                        resolve();
                    }
                },
                reason => reject(reason)
            );
        });
    }

    export function encodeAsMessageContainer(action: IMessageContainer): Uint8Array | undefined {
        if (Helpers.getMessageCode(action) != null) {
            return MessageContainerClass.encode(action).finish();
        } else {
            Logger.assert(false, "ProtoManager.encodeAsMessageContainer() invalid message! ", JSON.stringify(action));
            return undefined;
        }
    }
    export function decodeAsMessageContainer(data: any): IMessageContainer {
        return MessageContainerClass.toObject(MessageContainerClass.decode(getDataForDecode(data)));
    }

    export function decodeAsFullConfig(data: any): ProtoTypes.Config.IFullConfig {
        return FullConfigClass.toObject(FullConfigClass.decode(getDataForDecode(data)));
    }

    export function encodeAsSerialWar(data: ISerialWar): Uint8Array {
        return SerialWarClass.encode(data).finish();
    }
    export function decodeAsSerialWar(data: any): ISerialWar {
        return SerialWarClass.toObject(SerialWarClass.decode(data)) as any;
    }

    export function encodeAsMapRawData(data: IMapRawData): Uint8Array {
        return MapRawDataClass.encode(data).finish();
    }
    export function decodeAsMapRawData(data: any): IMapRawData {
        return MapRawDataClass.toObject(MapRawDataClass.decode(data));
    }

    function getDataForDecode(encodedData: any): Uint8Array | protobuf.Reader {
        if (encodedData instanceof ArrayBuffer) {
            return new Uint8Array(encodedData);
        } else {
            return Object.keys(encodedData).map(function(k) {
                return encodedData[k];
            }) as any as Uint8Array;
        }
    }
}
