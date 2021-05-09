
namespace TinyWars.SingleCustomRoom.ScrProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgScrCreateWar,              callback: _onMsgScrCreateWar,           },
            { msgCode: ActionCode.MsgScrCreateCustomWar,        callback: _onMsgScrCreateCustomWar      },
        ], ScrProxy);
    }

    export function reqScrCreateWar(param: ScrModel.DataForCreateWar): void {
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

    export function reqScrCreateFreeWar({ slotIndex, slotComment, warData }: {
        slotIndex   : number;
        slotComment : string | null | undefined;
        warData     : ProtoTypes.WarSerialization.ISerialWar;
    }): void {
        NetManager.send({
            MsgScrCreateCustomWar: { c: {
                slotIndex,
                slotComment,
                warData,
            }, },
        });
    }
    function _onMsgScrCreateCustomWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgScrCreateCustomWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgScrCreateCustomWar, data);
        }
    }
}
