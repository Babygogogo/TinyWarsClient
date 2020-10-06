
namespace TinyWars.MapEditor.MeProxy {
    import NetManager   = Network.Manager;
    import NetCodes     = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetCodes.S_MeGetMapDataList, callback: _onSMeGetMapDataList },
            { msgCode: NetCodes.S_MeGetMapData,     callback: _onSMeGetMapData },
            { msgCode: NetCodes.S_MeSubmitMap,      callback: _onSMeSubmitMap },
        ], MeProxy);
    }

    export function reqMeGetMapDataList(): void {
        NetManager.send({
            C_MeGetMapDataList: {},
        });
    }
    function _onSMeGetMapDataList(e: egret.Event): void {
        const data = e.data as NetMessage.IS_MeGetMapDataList;
        if (!data.errorCode) {
            MeModel.resetDataList(data.dataList);
            Notify.dispatch(Notify.Type.SMeGetDataList, data);
        }
    }

    export function reqMeGetMapData(slotIndex: number): void {
        NetManager.send({
            C_MeGetMapData: {
                slotIndex,
            },
        });
    }
    function _onSMeGetMapData(e: egret.Event): void {
        const data = e.data as NetMessage.IS_MeGetMapData;
        if (!data.errorCode) {
            MeModel.updateData(data.slotIndex, data.data);
            Notify.dispatch(Notify.Type.SMeGetData, data);
        }
    }

    export function reqMeSubmitMap(slotIndex: number, mapRawData: ProtoTypes.Map.IMapRawData, needReview: boolean): void {
        NetManager.send({
            C_MeSubmitMap: {
                slotIndex,
                needReview,
                mapRawData,
            },
        });
    }
    function _onSMeSubmitMap(e: egret.Event): void {
        const data = e.data as NetMessage.IS_MeSubmitMap;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMeSubmitMap, data);
        }
    }
}
