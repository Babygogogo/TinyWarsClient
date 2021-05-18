
namespace TinyWars.SinglePlayerMode.SpmProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgSpmCreateScw,                      callback: _onMsgSpmCreateScw, },
            { msgCode: ActionCode.MsgSpmCreateSfw,                      callback: _onMsgSpmCreateSfw, },
            { msgCode: ActionCode.MsgSpmGetWarSaveSlotFullDataArray,    callback: _onMsgSpmGetWarSaveSlotFullDataArray, },
            { msgCode: ActionCode.MsgSpmDeleteWarSaveSlot,              callback: _onMsgSpmDeleteWarSaveSlot, },
            { msgCode: ActionCode.MsgSpmSaveScw,                        callback: _onMsgSpmSaveScw, },
        ], SpmProxy);
    }

    export function reqSpmGetWarSaveSlotFullDataArray(): void {
        NetManager.send({
            MsgSpmGetWarSaveSlotFullDataArray: { c: {} },
        });
    }
    function _onMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmGetWarSaveSlotFullDataArray.IS;
        if (!data.errorCode) {
            SpmModel.SaveSlot.updateOnMsgSpmGetWarSaveSlotFullDataArray(data);
            Notify.dispatch(Notify.Type.MsgSpmGetWarSaveSlotFullDataArray, data);
        }
    }

    export function reqSpmCreateScw(param: SingleCustomRoom.ScrModel.DataForCreateWar): void {
        NetManager.send({
            MsgSpmCreateScw: { c: param },
        });
    }
    function _onMsgSpmCreateScw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateScw.IS;
        if (!data.errorCode) {
            SpmModel.SaveSlot.updateOnMsgSpmCreateScw(data);
            Notify.dispatch(Notify.Type.MsgSpmCreateScw, data);
        }
    }

    export function reqSpmCreateSfw({ slotIndex, slotExtraData, warData }: {
        slotIndex       : number;
        slotExtraData   : ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData         : ProtoTypes.WarSerialization.ISerialWar;
    }): void {
        NetManager.send({
            MsgSpmCreateSfw: { c: {
                slotIndex,
                slotExtraData,
                warData,
            }, },
        });
    }
    function _onMsgSpmCreateSfw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
        if (!data.errorCode) {
            SpmModel.SaveSlot.updateOnMsgSpmCreateSfw(data);
            Notify.dispatch(Notify.Type.MsgSpmCreateSfw, data);
        }
    }

    export function reqSpmSaveScw(war: SinglePlayerWar.SpwWar): void {
        NetManager.send({
            MsgSpmSaveScw: { c: {
                slotIndex       : war.getSaveSlotIndex(),
                slotExtraData   : war.getSaveSlotExtraData(),
                warData         : war.serialize(),
            }, },
        });
    }
    function _onMsgSpmSaveScw(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmSaveScw.IS;
        if (!data.errorCode) {
            SpmModel.SaveSlot.updateOnMsgSpmSaveScw(data);
            Notify.dispatch(Notify.Type.MsgSpmSaveScw, data);
        }
    }

    export function reqSpmDeleteWarSaveSlot(slotIndex: number): void {
        NetManager.send({
            MsgSpmDeleteWarSaveSlot: { c: {
                slotIndex,
            } },
        })
    }
    function _onMsgSpmDeleteWarSaveSlot(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgSpmDeleteWarSaveSlot.IS;
        if (!data.errorCode) {
            SpmModel.SaveSlot.updateOnMsgSpmDeleteWarSaveSlot(data.slotIndex);
            Notify.dispatch(Notify.Type.MsgSpmDeleteWarSaveSlot, data);
        }
    }
}
