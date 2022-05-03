
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Helpers          from "../../tools/helpers/Helpers";
// import Types            from "../../tools/helpers/Types";
// import Notify           from "../../tools/notify/Notify";
// import Twns.Notify   from "../../tools/notify/NotifyType";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers   from "../../tools/warHelpers/WarRuleHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiFreeRoom.MfrCreateModel {
    import NotifyType       = Twns.Notify.NotifyType;
    import BootTimerType    = Types.BootTimerType;
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;

    export type DataForJoinRoom = CommonProto.NetMessage.MsgMfrJoinRoom.IC;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    type DataForCreateRoom  = CommonProto.NetMessage.MsgMfrCreateRoom.IC;

    const _dataForCreateRoom: DataForCreateRoom = {
        settingsForMfw          : {},

        selfPlayerIndex         : CommonConstants.WarFirstPlayerIndex,
        selfCoId                : CommonConstants.CoEmptyId,
    };

    export async function resetDataByInitialWarData(warData: ISerialWar): Promise<void> {
        setInitialWarData(warData);
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);

        const playerData = Helpers.getExisted(warData.playerManager?.players?.find(v => {
            return (v.aliveState !== Types.PlayerAliveState.Dead)
                && (v.playerIndex !== CommonConstants.WarNeutralPlayerIndex)
                && (v.userId != null);
        }));
        setSelfPlayerIndex(Helpers.getExisted(playerData.playerIndex));
        setSelfCoId(Helpers.getExisted(playerData.coId));
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getInstanceWarRule(): CommonProto.WarRule.IInstanceWarRule {
        return Helpers.getExisted(getInitialWarData().settingsForCommon?.instanceWarRule);
    }
    function getSettingsForMfw(): CommonProto.WarSettings.ISettingsForMfw {
        return Helpers.getExisted(getData().settingsForMfw);
    }

    export function getTurnsLimit(): number {
        return getInitialWarData().settingsForCommon?.turnsLimit ?? CommonConstants.WarMaxTurnsLimit;
    }
    export function setTurnsLimit(turnsLimit: number): void {
        Helpers.getExisted(getInitialWarData().settingsForCommon).turnsLimit = turnsLimit;
    }

    export function getInitialWarData(): ISerialWar {
        return Helpers.getExisted(getSettingsForMfw().initialWarData);
    }
    function setInitialWarData(warData: ISerialWar): void {
        getSettingsForMfw().initialWarData = warData;
    }

    export function getConfigVersion(): string {
        return Helpers.getExisted(getInitialWarData().settingsForCommon?.configVersion);
    }

    export function setWarName(name: string | null): void {
        getSettingsForMfw().warName = name;
    }
    export function getWarName(): string | null {
        return getSettingsForMfw().warName ?? null;
    }

    export function setWarPassword(password: string | null): void {
        getSettingsForMfw().warPassword = password;
    }
    export function getWarPassword(): string | null {
        return getSettingsForMfw().warPassword ?? null;
    }

    export function setWarComment(comment: string | null): void {
        getSettingsForMfw().warComment = comment;
    }
    export function getWarComment(): string | null {
        return getSettingsForMfw().warComment ?? null;
    }

    export function setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== getSelfPlayerIndex()) {
            getData().selfPlayerIndex = playerIndex;
            Twns.Notify.dispatch(NotifyType.MfrCreateSelfPlayerIndexChanged);
        }
    }
    export function getSelfPlayerIndex(): number {
        return Helpers.getExisted(getData().selfPlayerIndex);
    }
    export function getSelfPlayerData(): CommonProto.WarSerialization.ISerialPlayer {
        const playerIndex = getSelfPlayerIndex();
        return Helpers.getExisted(getInitialWarData().playerManager?.players?.find(v => v.playerIndex === playerIndex));
    }

    export function setSelfCoId(coId: number): void {
        if (getSelfCoId() !== coId) {
            getData().selfCoId = coId;
            Twns.Notify.dispatch(NotifyType.MfrCreateSelfCoIdChanged);
        }
    }
    export function getSelfCoId(): number {
        return Helpers.getExisted(getData().selfCoId);
    }

    export function setHasFog(hasFog: boolean): void {
        Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams).hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return Helpers.getExisted(getInstanceWarRule().ruleForGlobalParams?.hasFogByDefault);
    }

    export function setBootTimerParams(params: number[]): void {
        getSettingsForMfw().bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return Helpers.getExisted(getSettingsForMfw().bootTimerParams);
    }
    export function tickBootTimerType(): void {
        const params = getBootTimerParams();
        if ((params) && (params[0] === BootTimerType.Regular)) {
            setBootTimerParams([BootTimerType.Incremental, 60 * 15, 10]);
        } else {
            setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        }
    }
    export function tickTimerRegularTime(): void {
        const params = getBootTimerParams();
        if (params[0] !== BootTimerType.Regular) {
            tickBootTimerType();
        } else {
            const index = REGULAR_TIME_LIMITS.indexOf(params[1]);
            if (index < 0) {
                tickBootTimerType();
            } else {
                const newIndex  = index + 1;
                params[1]       = newIndex < REGULAR_TIME_LIMITS.length ? REGULAR_TIME_LIMITS[newIndex] : REGULAR_TIME_LIMITS[0];
            }
        }
    }
    export function setTimerIncrementalInitialTime(seconds: number): void {
        getBootTimerParams()[1] = seconds;
    }
    export function setTimerIncrementalIncrementalValue(seconds: number): void {
        getBootTimerParams()[2] = seconds;
    }

    export function tickTeamIndex(playerIndex: number): void {
        WarHelpers.WarRuleHelpers.tickTeamIndex(getInstanceWarRule(), playerIndex);
    }
    export function getTeamIndex(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getTeamIndex(getInstanceWarRule(), playerIndex);
    }

    export function setInitialFund(playerIndex: number, fund: number): void {
        WarHelpers.WarRuleHelpers.setInitialFund(getInstanceWarRule(), playerIndex, fund);
    }
    export function getInitialFund(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getInitialFund(getInstanceWarRule(), playerIndex);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        WarHelpers.WarRuleHelpers.setIncomeMultiplier(getInstanceWarRule(), playerIndex, multiplier);
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getIncomeMultiplier(getInstanceWarRule(), playerIndex);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        WarHelpers.WarRuleHelpers.setEnergyAddPctOnLoadCo(getInstanceWarRule(), playerIndex, percentage);
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getEnergyAddPctOnLoadCo(getInstanceWarRule(), playerIndex);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        WarHelpers.WarRuleHelpers.setEnergyGrowthMultiplier(getInstanceWarRule(), playerIndex, multiplier);
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getEnergyGrowthMultiplier(getInstanceWarRule(), playerIndex);
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        WarHelpers.WarRuleHelpers.setLuckLowerLimit(getInstanceWarRule(), playerIndex, limit);
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getLuckLowerLimit(getInstanceWarRule(), playerIndex);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        WarHelpers.WarRuleHelpers.setLuckUpperLimit(getInstanceWarRule(), playerIndex, limit);
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getLuckUpperLimit(getInstanceWarRule(), playerIndex);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        WarHelpers.WarRuleHelpers.setMoveRangeModifier(getInstanceWarRule(), playerIndex, modifier);
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getMoveRangeModifier(getInstanceWarRule(), playerIndex);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        WarHelpers.WarRuleHelpers.setAttackPowerModifier(getInstanceWarRule(), playerIndex, modifier);
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getAttackPowerModifier(getInstanceWarRule(), playerIndex);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        WarHelpers.WarRuleHelpers.setVisionRangeModifier(getInstanceWarRule(), playerIndex, modifier);
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return WarHelpers.WarRuleHelpers.getVisionRangeModifier(getInstanceWarRule(), playerIndex);
    }
}

// export default MfrCreateModel;
