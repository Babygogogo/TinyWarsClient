
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Types            from "../../tools/helpers/Types";
// import Notify           from "../../tools/notify/Notify";
// import TwnsNotifyType   from "../../tools/notify/NotifyType";
// import ProtoManager     from "../../tools/proto/ProtoManager";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace SpmModel {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NetMessage               = CommonProto.NetMessage;
    import SpmWarSaveSlotData       = Types.SpmWarSaveSlotData;
    import ISerialWar               = CommonProto.WarSerialization.ISerialWar;
    import ISpmRankInfoForRule      = NetMessage.MsgSpmGetRankList.ISpmRankInfoForRule;
    import MsgSpmGetRankListIs      = NetMessage.MsgSpmGetRankList.IS;
    import MsgSpmGetReplayDataIs    = NetMessage.MsgSpmGetReplayData.IS;

    export function init(): void {
        Notify.addEventListeners([
            { type: NotifyType.MsgSpmValidateSrw,   callback: _onNotifyMsgSpmValidateSrw, },
        ], null);
    }

    function _onNotifyMsgSpmValidateSrw(e: egret.Event): void {
        const data      = e.data as CommonProto.NetMessage.MsgSpmValidateSrw.IS;
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
    const _slotIndexSetAccessor = Helpers.createCachedDataAccessor<null, Set<number>>({
        reqData : () => SpmProxy.reqSpmGetWarSaveSlotIndexArray(),
    });
    const _slotFullDataAccessor = Helpers.createCachedDataAccessor<number, SpmWarSaveSlotData>({
        reqData : (slotIndex) => SpmProxy.reqSpmGetWarSaveSlotFullData(slotIndex),
    });
    let _previewingSlotIndex    : number;

    export function setSlotIndexSet(slotIndexSet: Set<number>): void {
        _slotIndexSetAccessor.setData(null, slotIndexSet);
    }
    export function getSlotIndexSet(): Promise<Set<number> | null> {
        return _slotIndexSetAccessor.getData(null);
    }
    async function addSlotIndex(slotIndex: number): Promise<void> {
        const slotIndexSet = await getSlotIndexSet();
        if (slotIndexSet == null) {
            setSlotIndexSet(new Set([slotIndex]));
        } else {
            slotIndexSet.add(slotIndex);
        }
    }
    async function deleteSlotIndex(slotIndex: number): Promise<void> {
        const slotIndexSet = await getSlotIndexSet();
        if (slotIndexSet == null) {
            // nothing to do
        } else {
            slotIndexSet.delete(slotIndex);
        }
    }

    export function setSlotFullData(slotIndex: number, fullData: SpmWarSaveSlotData | null): void {
        _slotFullDataAccessor.setData(slotIndex, fullData);
    }
    export function getSlotFullData(slotIndex: number): Promise<SpmWarSaveSlotData | null> {
        return _slotFullDataAccessor.getData(slotIndex);
    }


    export async function checkIsEmpty(slotIndex: number): Promise<boolean> {
        return !(await _slotIndexSetAccessor.getData(null))?.has(slotIndex);
    }
    export async function getAvailableIndex(): Promise<number> {
        for (let index = 0; index < CommonConstants.SpwSaveSlotMaxCount; ++index) {
            if (await checkIsEmpty(index)) {
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

    export async function updateOnMsgSpmCreateScw(data: NetMessage.MsgSpmCreateScw.IS): Promise<void> {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.extraData),
            warData         : Helpers.getExisted(data.warData),
        });
        await addSlotIndex(slotIndex);
    }
    export async function updateOnMsgSpmCreateSfw(data: NetMessage.MsgSpmCreateSfw.IS): Promise<void> {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.extraData),
            warData         : Helpers.getExisted(data.warData),
        });
        await addSlotIndex(slotIndex);
    }
    export async function updateOnMsgSpmCreateSrw(data: NetMessage.MsgSpmCreateSrw.IS): Promise<void> {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.extraData),
            warData         : Helpers.getExisted(data.warData),
        });
        await addSlotIndex(slotIndex);
    }
    export function updateOnMsgSpmSaveScw(data: NetMessage.MsgSpmSaveScw.IS): void {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.slotExtraData),
            warData         : Helpers.getExisted(data.warData),
        });
    }
    export function updateOnMsgSpmSaveSfw(data: NetMessage.MsgSpmSaveSfw.IS): void {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.slotExtraData),
            warData         : Helpers.getExisted(data.warData),
        });
    }
    export function updateOnMsgSpmSaveSrw(data: NetMessage.MsgSpmSaveSrw.IS): void {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.slotExtraData),
            warData         : Helpers.getExisted(data.warData),
        });
    }
    export async function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): Promise<void> {
        setSlotFullData(slotIndex, null);
        await deleteSlotIndex(slotIndex);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for rank list.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _rankDataGetter = Helpers.createCachedDataAccessor<number, ISpmRankInfoForRule[]>({
        reqData : (mapId: number) => SpmProxy.reqSpmGetRankList(mapId),
    });

    export function getRankData(mapId: number): Promise<ISpmRankInfoForRule[] | null> {
        return _rankDataGetter.getData(mapId);
    }

    export function updateOnMsgSpmGetRankList(data: MsgSpmGetRankListIs): void {
        _rankDataGetter.setData(Helpers.getExisted(data.mapId), data.infoArray ?? []);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for replay data.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    const _replayDataAccessor = Helpers.createCachedDataAccessor<number, ISerialWar>({
        reqData : (rankId: number) => SpmProxy.reqSpmGetReplayData(rankId),
    });

    export function getReplayData(rankId: number): Promise<ISerialWar | null> {
        return _replayDataAccessor.getData(rankId);
    }
    async function decodeAndReviseReplayData(encodedWar: Types.Undefinable<Uint8Array>): Promise<ISerialWar | null> {
        if (encodedWar == null) {
            return null;
        }

        const warData = ProtoManager.decodeAsSerialWar(encodedWar);
        if (warData.field == null) {
            warData.field = {
                fogMap  : {
                    forceFogCode: Types.ForceFogCode.None,
                },
            };
        }

        if (warData.turnManager == null) {
            warData.turnManager = {
                turnIndex       : CommonConstants.WarFirstTurnIndex,
                turnPhaseCode   : Types.TurnPhaseCode.WaitBeginTurn,
                playerIndex     : CommonConstants.WarNeutralPlayerIndex,
                enterTurnTime   : 0,
            };
        }

        const settingsForCommon = Helpers.getExisted(warData.settingsForCommon);
        const mapRawData        = await WarMapModel.getRawData(Helpers.getExisted(warData.settingsForSrw?.mapId));
        if (settingsForCommon.warRule == null) {
            if (mapRawData == null) {
                return null;
            }

            const ruleId    = Helpers.getExisted(settingsForCommon.presetWarRuleId);
            const warRule   = mapRawData.warRuleArray?.find(v => v.ruleId === ruleId);
            if (warRule == null) {
                return null;
            }

            settingsForCommon.warRule = Helpers.deepClone(warRule);
        }

        if (warData.warEventManager == null) {
            warData.warEventManager = {
                warEventFullData    : WarEventHelper.trimAndCloneWarEventFullData(mapRawData?.warEventFullData, settingsForCommon.warRule.warEventIdArray),
                calledCountList     : [],
            };
        }

        for (const playerData of warData.playerManager?.players ?? []) {
            playerData.fund                 ??= 0;
            playerData.hasVotedForDraw      ??= false;
            playerData.aliveState           ??= Types.PlayerAliveState.Alive;
            playerData.restTimeToBoot       ??= 0;
            playerData.coIsDestroyedInTurn  ??= false;
            playerData.coUsingSkillType     ??= Types.CoSkillType.Passive;
        }

        return warData;
    }

    export async function updateOnMsgSpmGetReplayData(data: MsgSpmGetReplayDataIs): Promise<void> {
        _replayDataAccessor.setData(Helpers.getExisted(data.rankId), await decodeAndReviseReplayData(data.encodedWar));
    }
}

// export default SpmModel;
