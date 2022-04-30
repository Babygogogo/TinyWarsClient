
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Types            from "../../tools/helpers/Types";
// import Notify           from "../../tools/notify/Notify";
// import TwnsNotifyType   from "../../tools/notify/NotifyType";
// import ProtoManager     from "../../tools/proto/ProtoManager";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerMode.SpmModel {
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
    const _slotFullDataAccessor = Helpers.createCachedDataAccessor<number, SpmWarSaveSlotData>({
        reqData : (slotIndex) => SpmProxy.reqSpmGetWarSaveSlotFullData(slotIndex),
    });
    let _previewingSlotIndex    : number;

    export function setSlotFullData(slotIndex: number, fullData: SpmWarSaveSlotData | null): void {
        _slotFullDataAccessor.setData(slotIndex, fullData);
    }
    export function getSlotFullData(slotIndex: number): Promise<SpmWarSaveSlotData | null> {
        return _slotFullDataAccessor.getData(slotIndex);
    }


    export async function checkIsEmpty(slotIndex: number): Promise<boolean> {
        return await _slotFullDataAccessor.getData(slotIndex) == null;
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

    export function updateOnMsgSpmCreateScw(data: NetMessage.MsgSpmCreateScw.IS): void {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.extraData),
            warData         : Helpers.getExisted(data.warData),
        });
    }
    export function updateOnMsgSpmCreateSfw(data: NetMessage.MsgSpmCreateSfw.IS): void {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.extraData),
            warData         : Helpers.getExisted(data.warData),
        });
    }
    export function updateOnMsgSpmCreateSrw(data: NetMessage.MsgSpmCreateSrw.IS): void {
        const slotIndex = Helpers.getExisted(data.slotIndex);
        setSlotFullData(slotIndex, {
            slotIndex,
            extraData       : Helpers.getExisted(data.extraData),
            warData         : Helpers.getExisted(data.warData),
        });
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
    export function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): void {
        setSlotFullData(slotIndex, null);
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
        // TODO: 目前认定只有war room有回放，以后有可能需要扩展到其他模式
        if (encodedWar == null) {
            return null;
        }

        const warData               = ProtoManager.decodeAsSerialWar(encodedWar);
        const settingsForCommon     = Helpers.getExisted(warData.settingsForCommon);
        const srcInstanceWarRule    = settingsForCommon.instanceWarRule;
        if (srcInstanceWarRule == null) {
            return null;
        }

        const mapRawData = await WarMap.WarMapModel.getRawData(Helpers.getExisted(warData.settingsForSrw?.mapId));
        if (mapRawData == null) {
            return null;
        }

        const templateWarRule = WarHelpers.WarRuleHelpers.getTemplateWarRule(srcInstanceWarRule, mapRawData.templateWarRuleArray);
        if (templateWarRule == null) {
            return null;
        }

        settingsForCommon.instanceWarRule = WarHelpers.WarRuleHelpers.createInstanceWarRule(templateWarRule, mapRawData.warEventFullData);

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

        if (warData.warEventManager == null) {
            warData.warEventManager = {
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
