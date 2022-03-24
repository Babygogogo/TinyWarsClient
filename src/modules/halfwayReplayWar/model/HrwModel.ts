
// import Helpers              from "../../tools/helpers/Helpers";
// import Logger               from "../../tools/helpers/Logger";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoManager         from "../../tools/proto/ProtoManager";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import WarMapModel          from "../../warMap/model/WarMapModel";
// import TwnsRwWar            from "./RwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace HrwModel {
    import ClientErrorCode              = TwnsClientErrorCode.ClientErrorCode;
    import WarAction                    = ProtoTypes.WarAction;
    import WarSerialization             = ProtoTypes.WarSerialization;
    import IWarActionContainer          = WarAction.IWarActionContainer;
    import IMovingUnitAndPath           = ProtoTypes.Structure.IMovingUnitAndPath;
    import ICommonExtraDataForWarAction = ProtoTypes.Structure.ICommonExtraDataForWarAction;

    let _replayData         : ProtoTypes.NetMessage.MsgReplayGetData.IS | null = null;
    let _war                : TwnsHrwWar.HrwWar | null = null;

    export function init(): void {
        // nothing to do
    }

    export function setReplayData(data: ProtoTypes.NetMessage.MsgReplayGetData.IS): void {
        _replayData = data;
    }
    export function getReplayData(): ProtoTypes.NetMessage.MsgReplayGetData.IS | null {
        return _replayData;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(warData: WarSerialization.ISerialWar): Promise<TwnsHrwWar.HrwWar> {
        if (_war) {
            Logger.warn(`HrwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const mapId = WarCommonHelpers.getMapId(warData);
        if (mapId != null) {
            const mapRawData    = Helpers.getExisted(await WarMapModel.getRawData(mapId));
            const unitDataArray = mapRawData.unitDataArray || [];
            const field         = Helpers.getExisted(warData.field);
            field.tileMap       = { tiles: mapRawData.tileDataArray };
            field.unitMap       = {
                units       : unitDataArray,
                nextUnitId  : unitDataArray.length,
            };
        }
        {
            const settingsForMfw = warData.settingsForMfw;
            if (settingsForMfw) {
                const initialWarData            = Helpers.getExisted(settingsForMfw.initialWarData);
                warData.remainingVotesForDraw   = Helpers.deepClone(initialWarData.remainingVotesForDraw);
                warData.weatherManager          = Helpers.deepClone(initialWarData.weatherManager);
                warData.warEventManager         = Helpers.deepClone(initialWarData.warEventManager);
                warData.playerManager           = Helpers.deepClone(initialWarData.playerManager);
                warData.turnManager             = Helpers.deepClone(initialWarData.turnManager);
                warData.field                   = Helpers.deepClone(initialWarData.field);
            }
        }

        Helpers.getExisted(warData.executedActionManager).executedActionArray = generateExecutedActions(warData);

        const war = new TwnsHrwWar.HrwWar();
        await war.init(warData);
        war.startRunning().startRunningView();
        _war = war;
        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = null;
        }
    }

    export function getWar(): TwnsHrwWar.HrwWar | null {
        return _war;
    }

    function generateExecutedActions(warData: WarSerialization.ISerialWar): IWarActionContainer[] {
        const halfwayReplayActionArray      = warData.executedActionManager?.halfwayReplayActionArray ?? [];
        const actionsCount                  = halfwayReplayActionArray[0]?.actionArray?.length ?? 0;
        const rearrangedHalfwayActionArray  : IWarActionContainer[][] = new Array(actionsCount);
        const teamsCount                    = halfwayReplayActionArray.length;
        for (let actionId = 0; actionId < actionsCount; ++actionId) {
            const actionArrayForTeams: IWarActionContainer[] = new Array(teamsCount);
            for (let i = 0; i < teamsCount; ++i) {
                actionArrayForTeams[i] = Helpers.getExisted(halfwayReplayActionArray[i].actionArray, ClientErrorCode.HrwModel_GenerateExecutedActions_00)[actionId];
            }
            rearrangedHalfwayActionArray[actionId] = actionArrayForTeams;
        }

        const executedActionArray: IWarActionContainer[] = [];
        for (let actionId = 0; actionId < actionsCount; ++actionId) {
            const actionForTeams = rearrangedHalfwayActionArray[actionId];
            executedActionArray.push({
                actionId,
                WarActionPlayerDeleteUnit           : mergePlayerDeleteUnit(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionPlayerDeleteUnit))),
                WarActionPlayerEndTurn              : mergePlayerEndTurn(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionPlayerEndTurn))),
                WarActionPlayerProduceUnit          : mergePlayerProduceUnit(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionPlayerProduceUnit))),
                WarActionPlayerSurrender            : mergePlayerSurrender(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionPlayerSurrender))),
                WarActionPlayerUseCoSkill           : mergePlayerUseCoSkill(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionPlayerUseCoSkill))),
                WarActionPlayerVoteForDraw          : mergePlayerVoteForDraw(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionPlayerVoteForDraw))),
                WarActionSystemBeginTurn            : mergeSystemBeginTurn(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionSystemBeginTurn))),
                WarActionSystemCallWarEvent         : mergeSystemCallWarEvent(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionSystemCallWarEvent))),
                WarActionSystemDestroyPlayerForce   : mergeSystemDestroyPlayerForce(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionSystemDestroyPlayerForce))),
                WarActionSystemEndTurn              : mergeSystemEndTurn(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionSystemEndTurn))),
                WarActionSystemEndWar               : mergeSystemEndWar(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionSystemEndWar))),
                WarActionSystemHandleBootPlayer     : mergeSystemHandleBootPlayer(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionSystemHandleBootPlayer))),
                WarActionSystemVoteForDraw          : mergeSystemVoteForDraw(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionSystemVoteForDraw))),
                WarActionUnitAttackTile             : mergeUnitAttackTile(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitAttackTile))),
                WarActionUnitAttackUnit             : mergeUnitAttackUnit(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitAttackUnit))),
                WarActionUnitBeLoaded               : mergeUnitBeLoaded(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitBeLoaded))),
                WarActionUnitBuildTile              : mergeUnitBuildTile(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitBuildTile))),
                WarActionUnitCaptureTile            : mergeUnitCaptureTile(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitCaptureTile))),
                WarActionUnitDive                   : mergeUnitDive(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitDive))),
                WarActionUnitDropUnit               : mergeUnitDropUnit(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitDropUnit))),
                WarActionUnitJoinUnit               : mergeUnitJoinUnit(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitJoinUnit))),
                WarActionUnitLaunchFlare            : mergeUnitLaunchFlare(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitLaunchFlare))),
                WarActionUnitLaunchSilo             : mergeUnitLaunchSilo(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitLaunchSilo))),
                WarActionUnitLoadCo                 : mergeUnitLoadCo(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitLoadCo))),
                WarActionUnitProduceUnit            : mergeUnitProduceUnit(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitProduceUnit))),
                WarActionUnitSupplyUnit             : mergeUnitSupplyUnit(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitSupplyUnit))),
                WarActionUnitSurface                : mergeUnitSurface(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitSurface))),
                WarActionUnitUseCoSkill             : mergeUnitUseCoSkill(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitUseCoSkill))),
                WarActionUnitWait                   : mergeUnitWait(Helpers.getNonNullElements(actionForTeams.map(v => v.WarActionUnitWait))),
            });
        }

        return executedActionArray;
    }

    function mergePlayerDeleteUnit(actionArray: WarAction.IWarActionPlayerDeleteUnit[]): WarAction.IWarActionPlayerDeleteUnit | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergePlayerEndTurn(actionArray: WarAction.IWarActionPlayerEndTurn[]): WarAction.IWarActionPlayerEndTurn | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergePlayerProduceUnit(actionArray: WarAction.IWarActionPlayerProduceUnit[]): WarAction.IWarActionPlayerProduceUnit | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergePlayerSurrender(actionArray: WarAction.IWarActionPlayerSurrender[]): WarAction.IWarActionPlayerSurrender | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergePlayerUseCoSkill(actionArray: WarAction.IWarActionPlayerUseCoSkill[]): WarAction.IWarActionPlayerUseCoSkill | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    skillDataArray  : actionArray[0].extraData?.skillDataArray,
                    skillType       : actionArray[0].extraData?.skillType,
                },
            }
            : null;
    }
    function mergePlayerVoteForDraw(actionArray: WarAction.IWarActionPlayerVoteForDraw[]): WarAction.IWarActionPlayerVoteForDraw | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    isAgree         : actionArray[0].extraData?.isAgree,
                },
            }
            : null;
    }
    function mergeSystemBeginTurn(actionArray: WarAction.IWarActionSystemBeginTurn[]): WarAction.IWarActionSystemBeginTurn | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeSystemCallWarEvent(actionArray: WarAction.IWarActionSystemCallWarEvent[]): WarAction.IWarActionSystemCallWarEvent | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    warEventId      : actionArray[0].extraData?.warEventId,
                },
            }
            : null;
    }
    function mergeSystemDestroyPlayerForce(actionArray: WarAction.IWarActionSystemDestroyPlayerForce[]): WarAction.IWarActionSystemDestroyPlayerForce | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData     : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    targetPlayerIndex   : actionArray[0].extraData?.targetPlayerIndex,
                },
            }
            : null;
    }
    function mergeSystemEndTurn(actionArray: WarAction.IWarActionSystemEndTurn[]): WarAction.IWarActionSystemEndTurn | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeSystemEndWar(actionArray: WarAction.IWarActionSystemEndWar[]): WarAction.IWarActionSystemEndWar | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeSystemHandleBootPlayer(actionArray: WarAction.IWarActionSystemHandleBootPlayer[]): WarAction.IWarActionSystemHandleBootPlayer | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeSystemVoteForDraw(actionArray: WarAction.IWarActionSystemVoteForDraw[]): WarAction.IWarActionSystemVoteForDraw | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    isAgree         : actionArray[0].extraData?.isAgree,
                },
            }
            : null;
    }
    function mergeUnitAttackTile(actionArray: WarAction.IWarActionUnitAttackTile[]): WarAction.IWarActionUnitAttackTile | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    targetGridIndex : actionArray[0].extraData?.targetGridIndex,
                },
            }
            : null;
    }
    function mergeUnitAttackUnit(actionArray: WarAction.IWarActionUnitAttackUnit[]): WarAction.IWarActionUnitAttackUnit | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    targetGridIndex : actionArray[0].extraData?.targetGridIndex,
                },
            }
            : null;
    }
    function mergeUnitBeLoaded(actionArray: WarAction.IWarActionUnitBeLoaded[]): WarAction.IWarActionUnitBeLoaded | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitBuildTile(actionArray: WarAction.IWarActionUnitBuildTile[]): WarAction.IWarActionUnitBuildTile | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitCaptureTile(actionArray: WarAction.IWarActionUnitCaptureTile[]): WarAction.IWarActionUnitCaptureTile | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitDive(actionArray: WarAction.IWarActionUnitDive[]): WarAction.IWarActionUnitDive | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitDropUnit(actionArray: WarAction.IWarActionUnitDropUnit[]): WarAction.IWarActionUnitDropUnit | null {
        if (!actionArray.length) {
            return null;
        }

        const droppingUnitAndPathArrays: IMovingUnitAndPath[][] = [];
        for (const action of actionArray) {
            for (const data of action.extraData?.droppingUnitAndPathArray ?? []) {
                const unitId        = data.unit?.unitId;
                const existingArray = droppingUnitAndPathArrays.find(v => v[0]?.unit?.unitId === unitId);
                if (existingArray) {
                    existingArray.push(data);
                } else {
                    droppingUnitAndPathArrays.push([data]);
                }
            }
        }

        return {
            extraData: {
                commonExtraData             : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                isDropBlocked               : actionArray[0].extraData?.isDropBlocked,
                droppingUnitAndPathArray    : Helpers.getNonNullElements(droppingUnitAndPathArrays.map(v => mergeMovingUnitAndPathArray(v))),
            },
        };
    }
    function mergeUnitJoinUnit(actionArray: WarAction.IWarActionUnitJoinUnit[]): WarAction.IWarActionUnitJoinUnit | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitLaunchFlare(actionArray: WarAction.IWarActionUnitLaunchFlare[]): WarAction.IWarActionUnitLaunchFlare | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData     : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    targetGridIndex     : actionArray[0].extraData?.targetGridIndex,
                    flareRadius         : actionArray[0].extraData?.flareRadius,
                },
            }
            : null;
    }
    function mergeUnitLaunchSilo(actionArray: WarAction.IWarActionUnitLaunchSilo[]): WarAction.IWarActionUnitLaunchSilo | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData     : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    targetGridIndex     : actionArray[0].extraData?.targetGridIndex,
                },
            }
            : null;
    }
    function mergeUnitLoadCo(actionArray: WarAction.IWarActionUnitLoadCo[]): WarAction.IWarActionUnitLoadCo | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitProduceUnit(actionArray: WarAction.IWarActionUnitProduceUnit[]): WarAction.IWarActionUnitProduceUnit | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitSupplyUnit(actionArray: WarAction.IWarActionUnitSupplyUnit[]): WarAction.IWarActionUnitSupplyUnit | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitSurface(actionArray: WarAction.IWarActionUnitSurface[]): WarAction.IWarActionUnitSurface | null {
        return mergeCommonWarAction(actionArray);
    }
    function mergeUnitUseCoSkill(actionArray: WarAction.IWarActionUnitUseCoSkill[]): WarAction.IWarActionUnitUseCoSkill | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData : mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                    skillDataArray  : actionArray[0].extraData?.skillDataArray,
                    skillType       : actionArray[0].extraData?.skillType,
                },
            }
            : null;
    }
    function mergeUnitWait(actionArray: WarAction.IWarActionUnitWait[]): WarAction.IWarActionUnitWait | null {
        return mergeCommonWarAction(actionArray);
    }

    type CommonWarAction = {
        extraData?: {
            commonExtraData?: ICommonExtraDataForWarAction | null;
        } | null;
    };
    function mergeCommonWarAction(actionArray: CommonWarAction[]): CommonWarAction | null {
        return actionArray.length
            ? {
                extraData: {
                    commonExtraData: mergeCommonExtraData(actionArray.map(v => Helpers.getExisted(v.extraData?.commonExtraData))),
                },
            }
            : null;
    }
    function mergeCommonExtraData(dataArray: ICommonExtraDataForWarAction[]): ICommonExtraDataForWarAction {
        let nextUnitId                              : Types.Undefinable<number>;
        const destroyedUnitIdArray                  : number[] = [];
        const tileArrayAfterAction                  : WarSerialization.ISerialTile[] = [];
        const unitArrayAfterAction                  : WarSerialization.ISerialUnit[] = [];
        const playerArrayAfterAction                : WarSerialization.ISerialPlayer[] = [];
        const visibilityArrayFromPathsAfterAction   : number[] = [];
        const movingUnitAndPathArray                : IMovingUnitAndPath[] = [];
        for (const extraData of dataArray) {
            nextUnitId ??= extraData.nextUnitId;
            mergeDestroyedUnitIdArray(extraData.destroyedUnitIdArray, destroyedUnitIdArray);
            mergeTileArrayAfterAction(extraData.tileArrayAfterAction, tileArrayAfterAction);
            mergeUnitArrayAfterAction(extraData.unitArrayAfterAction, unitArrayAfterAction);
            mergePlayerArrayAfterAction(extraData.playerArrayAfterAction, playerArrayAfterAction);
            mergeVisibilityArrayFromPathsAfterAction(extraData.visibilityArrayFromPathsAfterAction, visibilityArrayFromPathsAfterAction);
            (extraData.movingUnitAndPath) && (movingUnitAndPathArray.push(extraData.movingUnitAndPath));
        }

        return {
            nextUnitId,
            destroyedUnitIdArray,
            tileArrayAfterAction,
            unitArrayAfterAction,
            playerArrayAfterAction,
            visibilityArrayFromPathsAfterAction,
            movingUnitAndPath                   : mergeMovingUnitAndPathArray(movingUnitAndPathArray),
        };
    }
    function mergeDestroyedUnitIdArray(src: Types.Undefinable<number[]>, dst: number[]): void {
        for (const id of src ?? []) {
            if (dst.indexOf(id) < 0) {
                dst.push(id);
            }
        }
    }
    function mergeTileArrayAfterAction(src: Types.Undefinable<WarSerialization.ISerialTile[]>, dst: WarSerialization.ISerialTile[]): void {
        for (const tileData of src ?? []) {
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(tileData.gridIndex), ClientErrorCode.HrwModel_MergeTileArrayAfterAction_00);
            if (!dst.find(v => GridIndexHelpers.checkIsEqual(Helpers.getExisted(GridIndexHelpers.convertGridIndex(v.gridIndex), ClientErrorCode.HrwModel_MergeTileArrayAfterAction_01), gridIndex))) {
                dst.push(tileData);
            }
        }
    }
    function mergeUnitArrayAfterAction(src: Types.Undefinable<WarSerialization.ISerialUnit[]>, dst: WarSerialization.ISerialUnit[]): void {
        for (const unitData of src ?? []) {
            if (!dst.find(v => v.unitId === unitData.unitId)) {
                dst.push(unitData);
            }
        }
    }
    function mergePlayerArrayAfterAction(src: Types.Undefinable<WarSerialization.ISerialPlayer[]>, dst: WarSerialization.ISerialPlayer[]): void {
        for (const playerData of src ?? []) {
            const existingPlayerData = dst.find(v => v.playerIndex === playerData.playerIndex);
            if (!existingPlayerData) {
                dst.push(playerData);
            } else {
                if (existingPlayerData.fund === 0) {
                    existingPlayerData.fund = playerData.fund;
                }
            }
        }
    }
    function mergeVisibilityArrayFromPathsAfterAction(src: Types.Undefinable<number[]>, dst: number[]): void {
        for (const id of src ?? []) {
            if (dst.indexOf(id) < 0) {
                dst.push(id);
            }
        }
    }
    function mergeMovingUnitAndPathArray(array: IMovingUnitAndPath[]): IMovingUnitAndPath | null {
        for (;;) {
            let isUpdated = false;
            for (let i = 0; i < array.length; ++i) {
                for (let j = i + 1; j < array.length; ++j) {
                    const mergedData = mergeMovingUnitAndPath(array[i], array[j]);
                    if (mergedData) {
                        array.splice(j, 1);
                        array.splice(i, 1, mergedData);
                        isUpdated = true;
                    }
                }
            }
            if (!isUpdated) {
                break;
            }
        }

        const length = array.length;
        if (length <= 1) {
            return array[0] ?? null;
        } else {
            array.sort((v1, v2) => {
                const path1     = Helpers.getExisted(v1.path, ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_00);
                const path2     = Helpers.getExisted(v2.path, ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_01);
                const lastNode1 = path1[path1.length - 1];
                const lastNode2 = path2[path2.length - 1];
                if (lastNode1.isVisible) {
                    return 1;
                } else if (lastNode2.isVisible) {
                    return -1;
                }

                const firstGridIndex1   = Helpers.getExisted(GridIndexHelpers.convertGridIndex(path1[0].gridIndex), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_02);
                const firstGridIndex2   = Helpers.getExisted(GridIndexHelpers.convertGridIndex(path2[0].gridIndex), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_03);
                const lastGridIndex1    = Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode1.gridIndex), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_04);
                const lastGridIndex2    = Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode2.gridIndex), ClientErrorCode.HrwModel_MergeMovingUnitAndPathArray_05);
                if (GridIndexHelpers.checkIsAdjacent(firstGridIndex1, lastGridIndex2)) {
                    return 1;
                } else if (GridIndexHelpers.checkIsAdjacent(firstGridIndex2, lastGridIndex1)) {
                    return -1;
                } else {
                    // 无法判断路径顺序
                    return 1;
                }
            });
            const mergedPath: ProtoTypes.Structure.IGridIndexAndPathInfo[] = [];
            for (const data of array) {
                for (const pathNode of data.path ?? []) {
                    mergedPath.push(pathNode);
                }
            }
            return {
                unit    : array[0].unit,
                path    : mergedPath,
            };
        }
    }
    function mergeMovingUnitAndPath(data1: IMovingUnitAndPath, data2: IMovingUnitAndPath): IMovingUnitAndPath | null {
        const unit1 = data1.unit;
        const path1 = data1.path;
        if ((unit1 == null) || (path1 == null) || (!path1.length)) {
            return data2;
        }

        const unit2 = data2.unit;
        const path2 = data2.path;
        if ((unit2 == null) || (path2 == null) || (!path2.length)) {
            return data1;
        }

        const length1 = path1.length;
        const length2 = path2.length;
        for (let index1 = 0; index1 < length1; ++index1) {
            const node1         = path1[index1];
            const gridIndex1    = Helpers.getExisted(GridIndexHelpers.convertGridIndex(node1.gridIndex), ClientErrorCode.HrwModel_MergeMovingUnitAndPath_00);
            for (let index2 = 0; index2 < length2; ++index2) {
                const node2         = path2[index2];
                const gridIndex2    = Helpers.getExisted(GridIndexHelpers.convertGridIndex(node2.gridIndex), ClientErrorCode.HrwModel_MergeMovingUnitAndPath_01);

                if (GridIndexHelpers.checkIsEqual(gridIndex1, gridIndex2)) {
                    const dstPath = Helpers.deepClone(path1);
                    const srcPath = path2;
                    for (let i = 0; ; ++i) {
                        const srcNode = srcPath[index2 + i];
                        if (srcNode == null) {
                            break;
                        }

                        const dstIndex  = index1 + i;
                        const dstNode   = dstPath[dstIndex];
                        if (dstNode == null) {
                            dstPath[dstIndex] = Helpers.deepClone(srcNode);
                        } else {
                            dstNode.isBlocked ||= srcNode.isBlocked;
                            dstNode.isVisible ||= srcNode.isVisible;
                        }
                    }

                    return {
                        unit    : Helpers.deepClone(unit1),
                        path    : dstPath,
                    };
                }
            }
        }

        return null;
    }
}

// export default HrwModel;
