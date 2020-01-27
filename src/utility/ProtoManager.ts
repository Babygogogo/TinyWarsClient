
namespace TinyWars.Utility.ProtoManager {
    const PROTO_FILENAME = "resource/config/NetMessageProto.json";

    let _messageContainerClass  : typeof ProtoTypes.MessageContainer;
    let _fullConfigClass        : typeof ProtoTypes.FullConfig;
    let _serializedWarClass     : typeof ProtoTypes.SerializedWar;
    let _mapRawDataClass        : typeof ProtoTypes.MapRawData;

    export function init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            protobuf.load(PROTO_FILENAME).then(
                root => {
                    if (!root) {
                        reject("no root!");
                    } else {
                        _messageContainerClass  = root.lookupType("MessageContainer") as any;
                        _fullConfigClass        = root.lookupType("FullConfig") as any;
                        _serializedWarClass     = root.lookupType("SerializedWar") as any;
                        _mapRawDataClass        = root.lookupType("MapRawData") as any;
                        resolve();
                    }
                },
                reason => reject(reason)
            );
        });
    }

    export function encodeAsMessageContainer(action: ProtoTypes.IMessageContainer): Uint8Array | undefined {
        if (Helpers.getMessageCode(action) != null) {
            return _messageContainerClass.encode(action).finish();
        } else {
            Logger.assert(false, "ProtoManager.encodeAsMessageContainer() invalid message! ", JSON.stringify(action));
            return undefined;
        }
    }
    export function decodeAsMessageContainer(data: any): ProtoTypes.IMessageContainer {
        return _messageContainerClass.toObject(_messageContainerClass.decode(getDataForDecode(data)));
    }

    export function decodeAsFullConfig(data: any): Types.FullConfig {
        return _fullConfigClass.toObject(_fullConfigClass.decode(getDataForDecode(data))) as any;
    }

    export function encodeAsSerializedWar(data: Types.SerializedWar): Uint8Array {
        return _serializedWarClass.encode(data).finish();
    }
    export function decodeAsSerializedWar(data: any): Types.SerializedWar {
        return _serializedWarClass.toObject(_serializedWarClass.decode(data)) as any;
    }

    export function encodeAsMapRawData(data: Types.MapRawData): Uint8Array {
        return _mapRawDataClass.encode(data).finish();
    }
    export function decodeAsMapRawData(data: any): ProtoTypes.IMapRawData {
        return _mapRawDataClass.toObject(_mapRawDataClass.decode(data));
    }

    function getDataForDecode(encodedData: any): Uint8Array | protobuf.Reader {
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
