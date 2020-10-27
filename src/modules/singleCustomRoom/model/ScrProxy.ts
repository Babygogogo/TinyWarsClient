
namespace TinyWars.SingleCustomRoom.ScrProxy {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgScrCreateWar,              callback: _onMsgScrCreateWar,           },
            { msgCode: ActionCode.MsgScrGetSaveSlotInfoList,    callback: _onMsgScrGetSaveSlotInfoList, },
            { msgCode: ActionCode.MsgScrContinueWar,            callback: _onMsgScrContinueWar,         },
            { msgCode: ActionCode.MsgScrSaveWar,                callback: _onMsgScrSaveWar,             },
            { msgCode: ActionCode.MsgScrCreateCustomWar,        callback: _onMsgScrCreateCustomWar      },
            { msgCode: ActionCode.MsgScrDeleteWar,              callback: _onMsgScrDeleteWar            },
        ], ScrProxy);
    }

    export function reqScrCreateWar(param: DataForCreateWar): void {
        NetManager.send({
            MsgScrCreateWar: { c: param },
        });
    }
    function _onMsgScrCreateWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrCreateWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgScrCreateWar, data);
        }
    }

    export function reqScrGetSaveSlotInfoList(): void {
        NetManager.send({
            MsgScrGetSaveSlotInfoList: { c: {} },
        });
    }
    function _onMsgScrGetSaveSlotInfoList(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrGetSaveSlotInfoList.IS;
        if (!data.errorCode) {
            ScrModel.setSaveSlotInfoList(data.infoList);
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

    export function reqSaveWar(war: SingleCustomWar.ScwWar): void {
        NetManager.send({
            MsgScrSaveWar: { c: {
                slotIndex   : war.getSaveSlotIndex(),
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

    export function reqScrCreateCustomWar(warData: ProtoTypes.WarSerialization.ISerialWar): void {
        NetManager.send({
            MsgScrCreateCustomWar: { c: {
                warData,
            }, }
        });
    }
    function _onMsgScrCreateCustomWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrCreateCustomWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgScrCreateCustomWar, data);
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
            Notify.dispatch(Notify.Type.MsgScrDeleteWar, data);
        }
    }
}
