
namespace TinyWars.Utility.ProtoManager {
    const PROTO_FILENAME = "resource/config/NetMessageProto.json";

    let _actionContainerClass   : typeof ProtoTypes.ActionContainer;
    let _fullConfigClass        : typeof ProtoTypes.FullConfig;
    let _serializedMcwWarClass  : typeof ProtoTypes.SerializedMcwWar;

    export function init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            protobuf.load(PROTO_FILENAME).then(
                root => {
                    if (!root) {
                        reject("no root!");
                    } else {
                        _actionContainerClass   = root.lookupType("ActionContainer") as any;
                        _fullConfigClass        = root.lookupType("FullConfig") as any;
                        _serializedMcwWarClass  = root.lookupType("SerializedMcwWar") as any;
                        resolve();
                    }
                },
                reason => reject(reason)
            );
        });
    }

    export function encodeAsActionContainer(action: ProtoTypes.IActionContainer): Uint8Array | undefined {
        if (Helpers.getActionCode(action) != null) {
            return _actionContainerClass.encode(action).finish();
        } else {
            Logger.assert(false, "ProtoManager.encodeAsContainer() invalid action! ", JSON.stringify(action));
            return undefined;
        }
    }
    export function decodeAsActionContainer(data: any): ProtoTypes.IActionContainer {
        return _actionContainerClass.decode(getDataForDecode(data)).toJSON();
    }

    export function decodeAsFullConfig(data: any): Types.FullConfig {
        return _fullConfigClass.decode(getDataForDecode(data)).toJSON() as any;
    }

    export function encodeAsSerializedMcwWar(data: Types.SerializedMcwWar): Uint8Array {
        return _serializedMcwWarClass.encode(data).finish();
    }
    export function decodeAsSerializedMcwWar(data: any): Types.SerializedMcwWar {
        return _serializedMcwWarClass.decode(data).toJSON() as any;
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
