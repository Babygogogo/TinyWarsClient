
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Types            from "../../tools/helpers/Types";
// import Notify           from "../../tools/notify/Notify";
// import TwnsNotifyType   from "../../tools/notify/NotifyType";
// import ProtoManager     from "../../tools/proto/ProtoManager";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace SpmModel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NetMessage           = ProtoTypes.NetMessage;
    import SpmWarSaveSlotData   = Types.SpmWarSaveSlotData;
    import ISpmRankInfoForRule  = NetMessage.MsgSpmGetRankList.ISpmRankInfoForRule;
    import MsgSpmGetRankListIs  = NetMessage.MsgSpmGetRankList.IS;

    export function init(): void {
        Notify.addEventListeners([
            { type: NotifyType.MsgSpmValidateSrw,   callback: _onNotifyMsgSpmValidateSrw, },
        ], null);
    }

    function _onNotifyMsgSpmValidateSrw(e: egret.Event): void {
        const data      = e.data as ProtoTypes.NetMessage.MsgSpmValidateSrw.IS;
        const status    = data.status;
        if (status === Types.SpmValidateSrwStatus.ConfigVersionNotLatest) {
            FloatText.show(Lang.getText(LangTextType.A0278));
        } else if (status === Types.SpmValidateSrwStatus.ScoreNotHighest) {
            FloatText.show(Lang.getText(LangTextType.A0279));
        } else if (status === Types.SpmValidateSrwStatus.ScoreTooLow) {
            FloatText.show(Lang.getText(LangTextType.A0281));
        } else {
            FloatText.show(Lang.getText(LangTextType.A0280));
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for save slots.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _slotDict             = new Map<number, SpmWarSaveSlotData>();
    let _hasReceivedSlotArray   = false;
    let _previewingSlotIndex    : number;

    export function getSlotDict(): Map<number, SpmWarSaveSlotData> {
        return _slotDict;
    }
    function setSlotData({ slotIndex, warData, slotExtraData }: {
        slotIndex       : number;
        warData         : ProtoTypes.WarSerialization.ISerialWar;
        slotExtraData   : ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    }): void {
        getSlotDict().set(slotIndex, {
            slotIndex,
            warData,
            extraData   : slotExtraData,
        });
    }

    export function getHasReceivedSlotArray(): boolean {
        return _hasReceivedSlotArray;
    }

    export function checkIsEmpty(slotIndex: number): boolean {
        return !getSlotDict().has(slotIndex);
    }

    export function getAvailableIndex(): number {
        for (let index = 0; index < CommonConstants.SpwSaveSlotMaxCount; ++index) {
            if (checkIsEmpty(index)) {
                return index;
            }
        }
        return 0;
    }

    export function getPreviewingSlotIndex(): number {
        return _previewingSlotIndex;
    }
    export function setPreviewingSlotIndex(index: number): void {
        if (getPreviewingSlotIndex() !== index) {
            _previewingSlotIndex = index;
            Notify.dispatch(NotifyType.SpmPreviewingWarSaveSlotChanged);
        }
    }

    export function updateOnMsgSpmGetWarSaveSlotFullDataArray(data: NetMessage.MsgSpmGetWarSaveSlotFullDataArray.IS): void {
        _hasReceivedSlotArray = true;

        getSlotDict().clear();
        for (const fullData of data.dataArray || []) {
            setSlotData({
                slotIndex       : Helpers.getExisted(fullData.slotIndex),
                slotExtraData   : ProtoManager.decodeAsSpmWarSaveSlotExtraData(Helpers.getExisted(fullData.encodedExtraData)),
                warData         : ProtoManager.decodeAsSerialWar(Helpers.getExisted(fullData.encodedWarData)),
            });
        }
    }
    export function updateOnMsgSpmCreateScw(data: NetMessage.MsgSpmCreateScw.IS): void {
        setSlotData({
            slotIndex       : Helpers.getExisted(data.slotIndex),
            slotExtraData   : Helpers.getExisted(data.extraData),
            warData         : Helpers.getExisted(data.warData),
        });
    }
    export function updateOnMsgSpmCreateSfw(data: NetMessage.MsgSpmCreateSfw.IS): void {
        setSlotData({
            slotIndex       : Helpers.getExisted(data.slotIndex),
            warData         : Helpers.getExisted(data.warData),
            slotExtraData   : Helpers.getExisted(data.extraData),
        });
    }
    export function updateOnMsgSpmCreateSrw(data: NetMessage.MsgSpmCreateSrw.IS): void {
        setSlotData({
            slotIndex       : Helpers.getExisted(data.slotIndex),
            warData         : Helpers.getExisted(data.warData),
            slotExtraData   : Helpers.getExisted(data.extraData),
        });
    }
    export function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): void {
        getSlotDict().delete(slotIndex);
    }
    export function updateOnMsgSpmSaveScw(data: NetMessage.MsgSpmSaveScw.IS): void {
        setSlotData({
            slotIndex       : Helpers.getExisted(data.slotIndex),
            warData         : Helpers.getExisted(data.warData),
            slotExtraData   : Helpers.getExisted(data.slotExtraData),
        });
    }
    export function updateOnMsgSpmSaveSfw(data: NetMessage.MsgSpmSaveSfw.IS): void {
        setSlotData({
            slotIndex       : Helpers.getExisted(data.slotIndex),
            warData         : Helpers.getExisted(data.warData),
            slotExtraData   : Helpers.getExisted(data.slotExtraData),
        });
    }
    export function updateOnMsgSpmSaveSrw(data: NetMessage.MsgSpmSaveSrw.IS): void {
        setSlotData({
            slotIndex       : Helpers.getExisted(data.slotIndex),
            warData         : Helpers.getExisted(data.warData),
            slotExtraData   : Helpers.getExisted(data.slotExtraData),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rank list.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _rankDataDict     = new Map<number, ISpmRankInfoForRule[]>();
    const _rankDataRequests = new Map<number, ((info: MsgSpmGetRankListIs) => void)[]>();

    export function getRankData(mapId: number): Promise<ISpmRankInfoForRule[]> {
        const localData = getLocalRankData(mapId);
        if (localData) {
            return new Promise<ISpmRankInfoForRule[]>((resolve) => resolve(localData));
        }

        if (_rankDataRequests.has(mapId)) {
            return new Promise<ISpmRankInfoForRule[]>((resolve) => {
                Helpers.getExisted(_rankDataRequests.get(mapId)).push(info => resolve(info.infoArray ?? []));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as MsgSpmGetRankListIs;
                if (data.mapId === mapId) {
                    Notify.removeEventListener(NotifyType.MsgSpmGetRankList,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgSpmGetRankListFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_rankDataRequests.get(mapId))) {
                        cb(data);
                    }
                    _rankDataRequests.delete(mapId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as MsgSpmGetRankListIs;
                if (data.mapId === mapId) {
                    Notify.removeEventListener(NotifyType.MsgSpmGetRankList,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgSpmGetRankListFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_rankDataRequests.get(mapId))) {
                        cb(data);
                    }
                    _rankDataRequests.delete(mapId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgSpmGetRankList,       callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgSpmGetRankListFailed, callbackOnFailed);

            SpmProxy.reqSpmGetRankList(mapId);
        });

        return new Promise((resolve) => {
            _rankDataRequests.set(mapId, [info => resolve(info.infoArray ?? [])]);
        });
    }

    function getLocalRankData(mapId: number): ISpmRankInfoForRule[] | null {
        return _rankDataDict.get(mapId) ?? null;
    }

    export function updateOnMsgSpmGetRankList(data: MsgSpmGetRankListIs): void {
        _rankDataDict.set(Helpers.getExisted(data.mapId), data.infoArray ?? []);
    }
}

// export default SpmModel;
