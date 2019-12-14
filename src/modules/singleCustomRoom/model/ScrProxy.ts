
namespace TinyWars.SingleCustomRoom.ScrProxy {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_ScrCreateWar,                   callback: _onSScrCreateWar, },
            { msgCode: ActionCode.S_ScrGetSaveSlotInfoList,         callback: _onSScrGetSaveSlotInfoList, },
            // { msgCode: ActionCode.S_McrContinueWar,                 callback: _onSMcrContinueWar, },
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

    // export function reqContinueWar(warId: number): void {
    //     NetManager.send({
    //         C_McrContinueWar: {
    //             warId: warId,
    //         },
    //     });
    // }
    // function _onSMcrContinueWar(e: egret.Event): void {
    //     const data = e.data as ProtoTypes.IS_McrContinueWar;
    //     if (data.errorCode) {
    //         Notify.dispatch(Notify.Type.SMcrContinueWarFailed, data);
    //     } else {
    //         Notify.dispatch(Notify.Type.SMcrContinueWar, data);
    //     }
    // }
}
