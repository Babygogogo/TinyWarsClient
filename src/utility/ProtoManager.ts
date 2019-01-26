
namespace TinyWars.Utility {
    export namespace ProtoManager {
        import Codes = Network.Codes;

        const PROTO_FILENAME = "resource/config/NetMessageProto.json";

        let _protoRoot      : protobuf.Root;
        let _containerClass : typeof ProtoTypes.ActionContainer;
        let _fullConfigClass: typeof ProtoTypes.FullConfig;

        export function init(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                protobuf.load(PROTO_FILENAME).then(
                    root => {
                        if (!root) {
                            reject("no root!");
                        } else {
                            _protoRoot          = root;
                            _containerClass     = root.lookupType("ActionContainer") as any;
                            _fullConfigClass    = root.lookupType("FullConfig") as any;
                            resolve();
                        }
                    },
                    reason => reject(reason)
                );
            });
        }

        export function encodeAsContainer(action: ProtoTypes.IActionContainer): Uint8Array | undefined {
            if (Helpers.getActionCode(action) != null) {
                return _containerClass.encode(action).finish();
            } else {
                Logger.assert(false, "ProtoManager.encodeAsContainer() invalid action! ", JSON.stringify(action));
                return undefined;
            }
        }

        export function decodeAsContainer(data: any): ProtoTypes.IActionContainer {
            return _containerClass.decode(getDataForDecode(data)).toJSON();
        }

        export function decodeAsFullConfig(data: any): Types.FullConfig {
            return _fullConfigClass.decode(getDataForDecode(data)).toJSON() as any;
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
