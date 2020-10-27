
namespace TinyWars.MapEditor.MeProxy {
    import NetManager   = Network.Manager;
    import NetCodes     = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetCodes.MsgMeGetMapDataList,    callback: _onMsgMeGetMapDataList    },
            { msgCode: NetCodes.MsgMeGetMapData,        callback: _onMsgMeGetMapData        },
            { msgCode: NetCodes.MsgMeSubmitMap,         callback: _onMsgMeSubmitMap         },
        ], MeProxy);
    }

    export function reqMeGetMapDataList(): void {
        NetManager.send({
            MsgMeGetMapDataList: { c: {} },
        });
    }
    async function _onMsgMeGetMapDataList(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMeGetMapDataList.IS;
        if (!data.errorCode) {
            await MeModel.resetDataList(data.dataList);
            Notify.dispatch(Notify.Type.MsgMeGetDataList, data);
        }
    }

    export function reqMeGetMapData(slotIndex: number): void {
        NetManager.send({
            MsgMeGetMapData: { c: {
                slotIndex,
            }, }
        });
    }
    function _onMsgMeGetMapData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMeGetMapData.IS;
        if (!data.errorCode) {
            MeModel.updateData(data.slotIndex, data.data);
            Notify.dispatch(Notify.Type.MsgMeGetData, data);
        }
    }

    export function reqMeSubmitMap(slotIndex: number, mapRawData: ProtoTypes.Map.IMapRawData, needReview: boolean): void {
        NetManager.send({
            MsgMeSubmitMap: { c: {
                slotIndex,
                needReview,
                mapRawData,
            }, }
        });
    }
    function _onMsgMeSubmitMap(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMeSubmitMap.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMeSubmitMap, data);
        }
    }
}
