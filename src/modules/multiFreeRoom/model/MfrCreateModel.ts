
import CommonConstants      from "../../tools/helpers/CommonConstants";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import Types                from "../../tools/helpers/Types";
import WarRuleHelpers     from "../../tools/warHelpers/WarRuleHelpers";

namespace MfrCreateModel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import BootTimerType    = Types.BootTimerType;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;

    export type DataForJoinRoom = ProtoTypes.NetMessage.MsgMfrJoinRoom.IC;

    const REGULAR_TIME_LIMITS = [
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];

    type DataForCreateRoom      = {
        settingsForMfw  : ProtoTypes.WarSettings.ISettingsForMfw;
        selfPlayerIndex : number | null;
    };

    const _dataForCreateRoom: DataForCreateRoom = {
        settingsForMfw          : {},

        selfPlayerIndex         : null,
    };

    export async function resetDataByInitialWarData(warData: ISerialWar): Promise<void> {
        setInitialWarData(warData);
        setWarName("");
        setWarPassword("");
        setWarComment("");
        setBootTimerParams([BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        setSelfPlayerIndex(warData.playerManager.players.find(v => {
            return (v.aliveState !== Types.PlayerAliveState.Dead)
                && (v.playerIndex !== CommonConstants.WarNeutralPlayerIndex)
                && (v.userId != null);
        }).playerIndex);
    }
    export function getData(): DataForCreateRoom {
        return _dataForCreateRoom;
    }
    export function getWarRule(): ProtoTypes.WarRule.IWarRule | null | undefined {
        return getSettingsForMfw().initialWarData.settingsForCommon.warRule;
    }
    function getSettingsForMfw(): ProtoTypes.WarSettings.ISettingsForMfw {
        return getData().settingsForMfw;
    }

    export function getInitialWarData(): ISerialWar {
        return getSettingsForMfw().initialWarData;
    }
    function setInitialWarData(warData: ISerialWar): void {
        getSettingsForMfw().initialWarData = warData;
    }

    export function setWarName(name: string): void {
        getSettingsForMfw().warName = name;
    }
    export function getWarName(): string {
        return getSettingsForMfw().warName;
    }

    export function setWarPassword(password: string): void {
        getSettingsForMfw().warPassword = password;
    }
    export function getWarPassword(): string {
        return getSettingsForMfw().warPassword;
    }

    export function setWarComment(comment: string): void {
        getSettingsForMfw().warComment = comment;
    }
    export function getWarComment(): string {
        return getSettingsForMfw().warComment;
    }

    export function setSelfPlayerIndex(playerIndex: number): void {
        if (playerIndex !== getSelfPlayerIndex()) {
            getData().selfPlayerIndex = playerIndex;
            Notify.dispatch(NotifyType.MfrCreateSelfPlayerIndexChanged);
        }
    }
    export function tickSelfPlayerIndex(): void {
        setSelfPlayerIndex(getSelfPlayerIndex() % WarRuleHelpers.getPlayersCount(getWarRule()) + 1);
    }
    export function getSelfPlayerIndex(): number {
        return getData().selfPlayerIndex;
    }
    export function getSelfPlayerData(): ProtoTypes.WarSerialization.ISerialPlayer {
        const playerIndex = getSelfPlayerIndex();
        return getInitialWarData().playerManager.players.find(v => v.playerIndex === playerIndex);
    }

    export function setHasFog(hasFog: boolean): void {
        getWarRule().ruleForGlobalParams.hasFogByDefault = hasFog;
    }
    export function getHasFog(): boolean {
        return getWarRule().ruleForGlobalParams.hasFogByDefault;
    }

    export function setBootTimerParams(params: number[]): void {
        getSettingsForMfw().bootTimerParams = params;
    }
    export function getBootTimerParams(): number[] {
        return getSettingsForMfw().bootTimerParams;
    }
    export function tickBootTimerType(): void {
        const params = getBootTimerParams();
        if ((params) && (params[0] === BootTimerType.Regular)) {
            setBootTimerParams([BootTimerType.Incremental, 60 * 15, 15]);
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
        WarRuleHelpers.tickTeamIndex(getWarRule(), playerIndex);
    }
    export function getTeamIndex(playerIndex: number): number {
        return WarRuleHelpers.getTeamIndex(getWarRule(), playerIndex);
    }

    export function setInitialFund(playerIndex: number, fund: number): void {
        WarRuleHelpers.setInitialFund(getWarRule(), playerIndex, fund);
    }
    export function getInitialFund(playerIndex: number): number {
        return WarRuleHelpers.getInitialFund(getWarRule(), playerIndex);
    }

    export function setIncomeMultiplier(playerIndex: number, multiplier: number): void {
        WarRuleHelpers.setIncomeMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getIncomeMultiplier(playerIndex: number): number {
        return WarRuleHelpers.getIncomeMultiplier(getWarRule(), playerIndex);
    }

    export function setEnergyAddPctOnLoadCo(playerIndex: number, percentage: number): void {
        WarRuleHelpers.setEnergyAddPctOnLoadCo(getWarRule(), playerIndex, percentage);
    }
    export function getEnergyAddPctOnLoadCo(playerIndex: number): number {
        return WarRuleHelpers.getEnergyAddPctOnLoadCo(getWarRule(), playerIndex);
    }

    export function setEnergyGrowthMultiplier(playerIndex: number, multiplier: number): void {
        WarRuleHelpers.setEnergyGrowthMultiplier(getWarRule(), playerIndex, multiplier);
    }
    export function getEnergyGrowthMultiplier(playerIndex: number): number {
        return WarRuleHelpers.getEnergyGrowthMultiplier(getWarRule(), playerIndex);
    }

    export function setLuckLowerLimit(playerIndex: number, limit: number): void {
        WarRuleHelpers.setLuckLowerLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckLowerLimit(playerIndex: number): number {
        return WarRuleHelpers.getLuckLowerLimit(getWarRule(), playerIndex);
    }

    export function setLuckUpperLimit(playerIndex: number, limit: number): void {
        WarRuleHelpers.setLuckUpperLimit(getWarRule(), playerIndex, limit);
    }
    export function getLuckUpperLimit(playerIndex: number): number {
        return WarRuleHelpers.getLuckUpperLimit(getWarRule(), playerIndex);
    }

    export function setMoveRangeModifier(playerIndex: number, modifier: number): void {
        WarRuleHelpers.setMoveRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getMoveRangeModifier(playerIndex: number): number {
        return WarRuleHelpers.getMoveRangeModifier(getWarRule(), playerIndex);
    }

    export function setAttackPowerModifier(playerIndex: number, modifier: number): void {
        WarRuleHelpers.setAttackPowerModifier(getWarRule(), playerIndex, modifier);
    }
    export function getAttackPowerModifier(playerIndex: number): number {
        return WarRuleHelpers.getAttackPowerModifier(getWarRule(), playerIndex);
    }

    export function setVisionRangeModifier(playerIndex: number, modifier: number): void {
        WarRuleHelpers.setVisionRangeModifier(getWarRule(), playerIndex, modifier);
    }
    export function getVisionRangeModifier(playerIndex: number): number {
        return WarRuleHelpers.getVisionRangeModifier(getWarRule(), playerIndex);
    }
}

export default MfrCreateModel;
