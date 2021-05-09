
namespace TinyWars.SinglePlayerMode.SpmProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgScrGetSaveSlotInfoList,    callback: _onMsgScrGetSaveSlotInfoList, },
            { msgCode: ActionCode.MsgScrContinueWar,            callback: _onMsgScrContinueWar,         },
            { msgCode: ActionCode.MsgScrSaveWar,                callback: _onMsgScrSaveWar,             },
            { msgCode: ActionCode.MsgScrDeleteWar,              callback: _onMsgScrDeleteWar            },
        ], SpmProxy);
    }

    export function reqScrGetSaveSlotInfoList(): void {
        NetManager.send({
            MsgScrGetSaveSlotInfoList: { c: {} },
        });
    }
    function _onMsgScrGetSaveSlotInfoList(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrGetSaveSlotInfoList.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.SaveSlot.setInfoArray(data.infoList);
            Notify.dispatch(Notify.Type.MsgScrGetSaveInfoList, data);
        }
    }

    export function reqContinueWar(slotIndex: number): void {
        NetManager.send({
            MsgScrContinueWar: { c: {
                slotIndex,
            }, },
        });
    }
    function _onMsgScrContinueWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgScrContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgScrContinueWar, data);
        }
    }

    export function reqSaveWar(war: SinglePlayerWar.SpwWar): void {
        NetManager.send({
            MsgScrSaveWar: { c: {
                slotIndex   : war.getSaveSlotIndex(),
                slotComment : war.getSaveSlotComment(),
                warData     : war.serialize(),
            }, },
        });
    }
    function _onMsgScrSaveWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrSaveWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgScrSaveWar, data);
        }
    }

    export function reqScrDeleteWar(slotIndex: number): void {
        NetManager.send({
            MsgScrDeleteWar: { c: {
                slotIndex,
            } },
        })
    }
    function _onMsgScrDeleteWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrDeleteWar.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.SaveSlot.deleteInfo(data.slotIndex);
            Notify.dispatch(Notify.Type.MsgScrDeleteWar, data);
        }
    }
}
