
namespace TinyWars.SingleCustomRoom.ScrProxy {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_ScrCreateWar,                   callback: _onSScrCreateWar, },
            { msgCode: ActionCode.S_ScrGetSaveSlotInfoList,         callback: _onSScrGetSaveSlotInfoList, },
            { msgCode: ActionCode.S_ScrContinueWar,                 callback: _onSScrContinueWar, },
        ], ScrProxy);
    }

    export function reqScrCreateWar(param: DataForCreateWar): void {
        NetManager.send({
            C_ScrCreateWar: param,
        });
    }
    function _onSScrCreateWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ScrCreateWar;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SScrCreateWar, data);
        }
    }

    export function reqScrGetSaveSlotInfoList(): void {
        NetManager.send({
            C_ScrGetSaveSlotInfoList: {},
        });
    }
    function _onSScrGetSaveSlotInfoList(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ScrGetSaveSlotInfoList;
        if (!data.errorCode) {
            ScrModel.setSaveSlotInfoList(data.infoList);
            Notify.dispatch(Notify.Type.SScrGetSaveInfoList, data);
        }
    }

    export function reqContinueWar(slotIndex: number): void {
        NetManager.send({
            C_ScrContinueWar: {
                slotIndex,
            },
        });
    }
    function _onSScrContinueWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_ScrContinueWar;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SScrContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.SScrContinueWar, data);
        }
    }
}
