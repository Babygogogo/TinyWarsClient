
namespace TinyWars.MapEditor.MeProxy {
    import NetManager   = Network.Manager;
    import NetCodes     = Network.Codes;
    import Helpers      = Utility.Helpers;
    import Types        = Utility.Types;
    import ProtoManager = Utility.ProtoManager;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetCodes.S_MeGetDataList,    callback: _onSMeGetDataList },
            { msgCode: NetCodes.S_MeGetData,        callback: _onSMeGetData },
            { msgCode: NetCodes.S_MeSaveMap,        callback: _onSMeSaveMap },
        ], MeProxy);
    }

    export function reqGetDataList(): void {
        NetManager.send({
            C_MeGetDataList: {},
        });
    }
    function _onSMeGetDataList(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MeGetDataList;
        if (!data.errorCode) {
            MeModel.resetDataList(data.dataList);
            Notify.dispatch(Notify.Type.SMeGetDataList, data);
        }
    }

    export function reqGetData(slotIndex: number): void {
        NetManager.send({
            C_MeGetData: {
                slotIndex,
            },
        });
    }
    function _onSMeGetData(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MeGetData;
        if (!data.errorCode) {
            MeModel.updateData(data.slotIndex, data.data);
            Notify.dispatch(Notify.Type.SMeGetData, data);
        }
    }

    export function reqSaveMap(slotIndex: number, mapRawData: Types.MapRawData, needReview: boolean): void {
        NetManager.send({
            C_MeSaveMap: {
                slotIndex,
                needReview,
                mapRawData,
            },
        });
    }
    function _onSMeSaveMap(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MeSaveMap;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMeSaveMap, data);
        }
    }
}
