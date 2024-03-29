
// import ScrCreateModel       from "../../singleCustomRoom/model/ScrCreateModel";
// import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
// import TwnsSrwWar           from "../../singleRankWar/model/SrwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import SpmModel             from "./SpmModel";
// import SpmSrwRankModel      from "./SpmSrwRankModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerMode.SpmProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessageCodes  = Net.NetMessageCodes;
    import SpwWar           = SinglePlayerWar.SpwWar;
    import SrwWar           = SingleRankWar.SrwWar;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgSpmCreateScw,                     callback: _onMsgSpmCreateScw },
            { msgCode: NetMessageCodes.MsgSpmCreateSfw,                     callback: _onMsgSpmCreateSfw },
            { msgCode: NetMessageCodes.MsgSpmCreateSrw,                     callback: _onMsgSpmCreateSrw },
            { msgCode: NetMessageCodes.MsgSpmGetWarSaveSlotFullData,        callback: _onMsgSpmGetWarSaveSlotFullData },
            { msgCode: NetMessageCodes.MsgSpmDeleteWarSaveSlot,             callback: _onMsgSpmDeleteWarSaveSlot },
            { msgCode: NetMessageCodes.MsgSpmSaveScw,                       callback: _onMsgSpmSaveScw },
            { msgCode: NetMessageCodes.MsgSpmSaveSfw,                       callback: _onMsgSpmSaveSfw },
            { msgCode: NetMessageCodes.MsgSpmSaveSrw,                       callback: _onMsgSpmSaveSrw },
            { msgCode: NetMessageCodes.MsgSpmGetRankList,                   callback: _onMsgSpmGetRankList },
            { msgCode: NetMessageCodes.MsgSpmValidateSrw,                   callback: _onMsgSpmValidateSrw },
            { msgCode: NetMessageCodes.MsgSpmGetReplayData,                 callback: _onMsgSpmGetReplayData },
        ], null);
    }

    export function reqSpmGetWarSaveSlotFullData(slotIndex: number): void {
        Net.NetManager.send({
            MsgSpmGetWarSaveSlotFullData: { c: {
                slotIndex,
            }, },
        });
    }
    function _onMsgSpmGetWarSaveSlotFullData(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmGetWarSaveSlotFullData.IS;
        if (!data.errorCode) {
            const slotIndex = Helpers.getExisted(data.slotIndex);
            const slotData  = data.slotData;
            if (slotData == null) {
                SinglePlayerMode.SpmModel.setSlotFullData(slotIndex, null);
            } else {
                SinglePlayerMode.SpmModel.setSlotFullData(slotIndex, {
                    slotIndex,
                    warData     : ProtoManager.decodeAsSerialWar(Helpers.getExisted(slotData.encodedWarData)),
                    extraData   : ProtoManager.decodeAsSpmWarSaveSlotExtraData(Helpers.getExisted(slotData.encodedExtraData)),
                });
            }
            Notify.dispatch(NotifyType.MsgSpmGetWarSaveFullData, data);
        }
    }

    export function reqSpmCreateScw(param: SingleCustomRoom.ScrCreateModel.DataForCreateWar): void {
        Net.NetManager.send({
            MsgSpmCreateScw: { c: param },
        });
    }
    function _onMsgSpmCreateScw(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmCreateScw.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.updateOnMsgSpmCreateScw(data);
            Notify.dispatch(NotifyType.MsgSpmCreateScw, data);
        }
    }

    export function reqSpmCreateSfw({ slotIndex, slotExtraData, warData }: {
        slotIndex       : number;
        slotExtraData   : CommonProto.SinglePlayerMode.ISpmWarSaveSlotExtraData;
        warData         : CommonProto.WarSerialization.ISerialWar;
    }): void {
        Net.NetManager.send({
            MsgSpmCreateSfw: { c: {
                slotIndex,
                slotExtraData,
                warData,
            }, },
        });
    }
    function _onMsgSpmCreateSfw(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmCreateSfw.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.updateOnMsgSpmCreateSfw(data);
            Notify.dispatch(NotifyType.MsgSpmCreateSfw, data);
        }
    }

    export function reqSpmCreateSrw(data: CommonProto.NetMessage.MsgSpmCreateSrw.IC): void {
        Net.NetManager.send({
            MsgSpmCreateSrw: { c: data },
        });
    }
    function _onMsgSpmCreateSrw(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmCreateSrw.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.updateOnMsgSpmCreateSrw(data);
            Notify.dispatch(NotifyType.MsgSpmCreateSrw, data);
        }
    }

    export function reqSpmSaveScw(war: SpwWar): void {
        Net.NetManager.send({
            MsgSpmSaveScw: { c: {
                slotIndex       : war.getSaveSlotIndex(),
                slotExtraData   : war.getSaveSlotExtraData(),
                warData         : war.serialize(),
            }, },
        });
    }
    function _onMsgSpmSaveScw(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmSaveScw.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.updateOnMsgSpmSaveScw(data);
            Notify.dispatch(NotifyType.MsgSpmSaveScw, data);
        }
    }

    export function reqSpmSaveSfw(war: SpwWar): void {
        Net.NetManager.send({
            MsgSpmSaveSfw: { c: {
                slotIndex       : war.getSaveSlotIndex(),
                slotExtraData   : war.getSaveSlotExtraData(),
                warData         : war.serialize(),
            }, },
        });
    }
    function _onMsgSpmSaveSfw(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmSaveSfw.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.updateOnMsgSpmSaveSfw(data);
            Notify.dispatch(NotifyType.MsgSpmSaveSfw, data);
        }
    }

    export function reqSpmSaveSrw(war: SpwWar): void {
        Net.NetManager.send({
            MsgSpmSaveSrw: { c: {
                slotIndex       : war.getSaveSlotIndex(),
                slotExtraData   : war.getSaveSlotExtraData(),
                warData         : war.serialize(),
            }, },
        });
    }
    function _onMsgSpmSaveSrw(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmSaveSrw.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.updateOnMsgSpmSaveSrw(data);
            Notify.dispatch(NotifyType.MsgSpmSaveSrw, data);
        }
    }

    export function reqSpmDeleteWarSaveSlot(slotIndex: number): void {
        Net.NetManager.send({
            MsgSpmDeleteWarSaveSlot: { c: {
                slotIndex,
            } },
        });
    }
    function _onMsgSpmDeleteWarSaveSlot(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmDeleteWarSaveSlot.IS;
        if (!data.errorCode) {
            SinglePlayerMode.SpmModel.updateOnMsgSpmDeleteWarSaveSlot(Helpers.getExisted(data.slotIndex));
            Notify.dispatch(NotifyType.MsgSpmDeleteWarSaveSlot, data);
        }
    }

    export function reqSpmGetRankList(mapId: number): void {
        Net.NetManager.send({
            MsgSpmGetRankList: { c: {
                mapId,
            } },
        });
    }
    function _onMsgSpmGetRankList(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmGetRankList.IS;
        SinglePlayerMode.SpmModel.updateOnMsgSpmGetRankList(data);
        Notify.dispatch(NotifyType.MsgSpmGetRankList, data);
    }

    export function reqSpmValidateSrw(war: SrwWar): void {
        Net.NetManager.send({
            MsgSpmValidateSrw: { c: {
                warData     : war.serializeForValidation(),
            } },
        });
    }
    function _onMsgSpmValidateSrw(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgSpmValidateSrw.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgSpmValidateSrw, data);
        }
    }

    export function reqSpmGetReplayData(rankId: number): void {
        Net.NetManager.send({
            MsgSpmGetReplayData: { c: {
                rankId,
            } },
        });
    }
    async function _onMsgSpmGetReplayData(e: egret.Event): Promise<void> {
        const data = e.data as CommonProto.NetMessage.MsgSpmGetReplayData.IS;
        await SinglePlayerMode.SpmModel.updateOnMsgSpmGetReplayData(data);
        Notify.dispatch(NotifyType.MsgSpmGetReplayData, data);
    }
}

// export default SpmProxy;
