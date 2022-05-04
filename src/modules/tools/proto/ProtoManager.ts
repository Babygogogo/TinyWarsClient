
// import Logger               from "../helpers/Logger";
// import ProtoTypes           from "./ProtoTypes";
// import Helpers              from "../helpers/Helpers";
// import * as protobuf        from "../../../../libs/modules/ProtobufJs/ProtobufJs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace ProtoManager {
    import ClientErrorCode          = Twns.ClientErrorCode;
    import IMessageContainer        = CommonProto.NetMessage.IMessageContainer;
    import ISerialWar               = CommonProto.WarSerialization.ISerialWar;
    import IMapRawData              = CommonProto.Map.IMapRawData;
    import ISpmWarSaveSlotExtraData = CommonProto.SinglePlayerMode.ISpmWarSaveSlotExtraData;

    const PROTO_FILENAME = "resource/config/NetMessageProto.json";

    let MessageContainerClass       : typeof CommonProto.NetMessage.MessageContainer;
    let FullConfigClass             : typeof CommonProto.Config.FullConfig;
    let SerialWarClass              : typeof CommonProto.WarSerialization.SerialWar;
    let MapRawDataClass             : typeof CommonProto.Map.MapRawData;
    let SpmWarSaveSlotExtraData     : typeof CommonProto.SinglePlayerMode.SpmWarSaveSlotExtraData;

    export function init(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            protobuf.load(Twns.ResVersionController.getResVirtualUrl(PROTO_FILENAME)).then(
                protoRoot => {
                    if (!protoRoot) {
                        reject("no root!");
                    } else {
                        MessageContainerClass   = protoRoot.lookupType("NetMessage.MessageContainer") as any;
                        FullConfigClass         = protoRoot.lookupType("Config.FullConfig") as any;
                        SerialWarClass          = protoRoot.lookupType("WarSerialization.SerialWar") as any;
                        MapRawDataClass         = protoRoot.lookupType("Map.MapRawData") as any;
                        SpmWarSaveSlotExtraData = protoRoot.lookupType("SinglePlayerMode.SpmWarSaveSlotExtraData") as any;
                        resolve();
                    }
                },
                reason => reject(reason)
            );
        });
    }

    export function encodeAsMessageContainer(action: IMessageContainer): Uint8Array {
        if (Twns.Helpers.getMessageName(action) != null) {
            return MessageContainerClass.encode(action).finish();
        } else {
            throw Twns.Helpers.newError(`ProtoManager.encodeAsMessageContainer() invalid message! ${JSON.stringify(action)}`, ClientErrorCode.ProtoManager_EncodeAsMessageContainer_00);
        }
    }
    export function decodeAsMessageContainer(data: Uint8Array | ArrayBuffer): IMessageContainer {
        return MessageContainerClass.toObject(MessageContainerClass.decode(getDataForDecode(data)));
    }

    export function decodeAsFullConfig(data: Uint8Array): CommonProto.Config.IFullConfig {
        return FullConfigClass.toObject(FullConfigClass.decode(getDataForDecode(data)));
    }

    export function encodeAsSerialWar(data: ISerialWar): Uint8Array {
        return SerialWarClass.encode(data).finish();
    }
    export function decodeAsSerialWar(data: Uint8Array): ISerialWar {
        return SerialWarClass.toObject(SerialWarClass.decode(data)) as any;
    }

    export function encodeAsMapRawData(data: IMapRawData): Uint8Array {
        return MapRawDataClass.encode(data).finish();
    }
    export function decodeAsMapRawData(data: Uint8Array): IMapRawData {
        return MapRawDataClass.toObject(MapRawDataClass.decode(data));
    }

    export function encodeAsSpmWarSaveSlotExtraData(data: ISpmWarSaveSlotExtraData): Uint8Array {
        return SpmWarSaveSlotExtraData.encode(data).finish();
    }
    export function decodeAsSpmWarSaveSlotExtraData(data: Uint8Array): ISpmWarSaveSlotExtraData {
        return SpmWarSaveSlotExtraData.toObject(SpmWarSaveSlotExtraData.decode(data));
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

// export default ProtoManager;
