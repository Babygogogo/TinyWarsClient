
namespace Utility {
    export namespace ProtoManager {
        import Codes = Network.Codes;

        const PROTO_FILENAME = "resource/config/NetMessageProto.json";

        let protoRoot     : protobuf.Root;
        let ContainerClass: typeof ProtoTypes.Container;

        export async function init(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                protobuf.load(PROTO_FILENAME, (err, root) => {
                    if ((err) || (!root)) {
                        reject(err || "no root");
                    } else {
                        protoRoot      = root;
                        ContainerClass = root.lookupType("Container") as any;
                        resolve();
                    }
                });
            });
        }

        export function encodeAsContainer(action: Types.Action): Uint8Array {
            if (action.actionCode == null) {
                throw "ProtoManager.encodeAsContainer() invalid action";
            } else {
                return ContainerClass.encode({
                    actionCode                : action.actionCode,
                    [Codes[action.actionCode]]: action,
                }).finish();
            }
        }

        export function decodeAsContainer(data: any): ProtoTypes.IContainer {
            return ContainerClass.decode(getDataForDecode(data)).toJSON();
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
}
