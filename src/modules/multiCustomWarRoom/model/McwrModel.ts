
namespace TinyWars.MultiCustomWarRoom {
    import Types        = Utility.Types;
    import ProtoTypes   = Utility.ProtoTypes;
    import MapModel     = WarMap.WarMapModel;

    export const MAX_INITIAL_FUND     = 1000000;
    export const MIN_INITIAL_FUND     = 0;
    export const DEFAULT_INITIAL_FUND = 0;

    export const MAX_INCOME_MODIFIER     = 1000;
    export const MIN_INCOME_MODIFIER     = 0;
    export const DEFAULT_INCOME_MODIFIER = 0;

    export const MAX_INITIAL_ENERGY     = 100;
    export const MIN_INITIAL_ENERGY     = 0;
    export const DEFAULT_INITIAL_ENERGY = 0;

    export const MAX_ENERGY_MODIFIER     = 1000;
    export const MIN_ENERGY_MODIFIER     = 0;
    export const DEFAULT_ENERGY_MODIFIER = 0;

    const TIME_LIMITS = [
        60 * 15,            // 15 min
        60 * 60 * 24 * 1,   // 1 day
        60 * 60 * 24 * 2,   // 2 days
        60 * 60 * 24 * 3,   // 3 days
        60 * 60 * 24 * 7,   // 7 days
    ];
    const DEFAULT_TIME_LIMIT = TIME_LIMITS[3];

    const MOVE_RANGE_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_MOVE_RANGE_MODIFIER = 0;

    const ATTACK_MODIFIERS        = [-30, -20, -10, 0, 10, 20, 30];
    const DEFAULT_ATTACK_MODIFIER = 0;

    const VISION_MODIFIERS        = [-2, -1, 0, 1, 2];
    const DEFAULT_VISION_MODIFIER = 0;

    export type DataForCreateWar = {
        mapName         : string,
        mapDesigner     : string,
        mapVersion      : number,
        warName        ?: string;
        warPassword    ?: string;
        warComment     ?: string;
        configVersion   : number;

        playerIndex     : number;
        teamIndex       : number;

        hasFog              : boolean;
        timeLimit           : number;
        initialFund         : number;
        incomeModifier      : number;
        initialEnergy       : number;
        energyGrowthModifier: number;
        moveRangeModifier   : number;
        attackPowerModifier : number;
        visionRangeModifier : number;
    }

    export namespace McwrModel {
        const _dataForCreateWar: DataForCreateWar = {
            mapName         : "",
            mapDesigner     : "",
            mapVersion      : 0,
            warName         : undefined,
            warPassword     : undefined,
            warComment      : undefined,
            configVersion   : ConfigManager.getNewestConfigVersion(),

            playerIndex     : 0,
            teamIndex       : 0,

            hasFog              : false,
            timeLimit           : 0,
            initialFund         : 0,
            incomeModifier      : 0,
            initialEnergy       : 0,
            energyGrowthModifier: 0,
            moveRangeModifier   : 0,
            attackPowerModifier : 0,
            visionRangeModifier : 0,
        };
        let _unjoinedWarInfos: ProtoTypes.IWaitingMultiCustomWarInfo[];
        let _joinedWarInfos: ProtoTypes.IWaitingMultiCustomWarInfo[];

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for creating wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function getCreateWarMapInfo(): ProtoTypes.IMapInfo {
            return MapModel.getMapInfo(_dataForCreateWar);
        }

        export function resetCreateWarData(key: Types.MapIndexKey): void {
            _dataForCreateWar.mapName       = key.mapName;
            _dataForCreateWar.mapDesigner   = key.mapDesigner;
            _dataForCreateWar.mapVersion    = key.mapVersion;
            _dataForCreateWar.configVersion = ConfigManager.getNewestConfigVersion();
            setCreateWarName("");
            setCreateWarPassword("");
            setCreateWarComment("");
            setCreateWarPlayerIndex(1);
            setCreateWarTeamIndex(1);
            setCreateWarHasFog(false);
            setCreateWarTimeLimit(DEFAULT_TIME_LIMIT);

            setCreateWarInitialFund(0);
            setCreateWarIncomeModifier(100);
            setCreateWarInitialEnergy(0);
            setCreateWarEnergyGrowthModifier(100);
            setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
        }
        export function getCreateWarData(): DataForCreateWar {
            return _dataForCreateWar;
        }

        export function setCreateWarName(name: string): void {
            _dataForCreateWar.warName = name.length > 0 ? name : undefined;
        }
        export function getCreateWarName(): string | undefined {
            return _dataForCreateWar.warName;
        }

        export function setCreateWarPassword(password: string): void {
            _dataForCreateWar.warPassword = password.length > 0 ? password : undefined;
        }
        export function getCreateWarPassword(): string | undefined {
            return _dataForCreateWar.warPassword;
        }

        export function setCreateWarComment(comment: string): void {
            _dataForCreateWar.warComment = comment.length > 0 ? comment : undefined;
        }
        export function getCreateWarComment(): string | undefined {
            return _dataForCreateWar.warComment;
        }

        export function setCreateWarPlayerIndex(index: number): void {
            _dataForCreateWar.playerIndex = index;
        }
        export function setCreateWarPrevPlayerIndex(): void {
            const mapInfo   = getCreateWarMapInfo();
            const index     = getCreateWarPlayerIndex() - 1;
            setCreateWarPlayerIndex(index > 0 ? index : mapInfo.playersCount);
        }
        export function setCreateWarNextPlayerIndex(): void {
            const mapInfo   = getCreateWarMapInfo();
            const index     = getCreateWarPlayerIndex() + 1;
            setCreateWarPlayerIndex(index > mapInfo.playersCount ? 1 : index);
        }
        export function getCreateWarPlayerIndex(): number {
            return _dataForCreateWar.playerIndex;
        }

        export function setCreateWarTeamIndex(index: number): void {
            _dataForCreateWar.teamIndex = index;
        }
        export function setCreateWarPrevTeamIndex(): void {
            const mapInfo   = getCreateWarMapInfo();
            const index     = getCreateWarTeamIndex() - 1;
            setCreateWarTeamIndex(index > 0 ? index : mapInfo.playersCount);
        }
        export function setCreateWarNextTeamIndex(): void {
            const mapInfo   = getCreateWarMapInfo();
            const index     = getCreateWarTeamIndex() + 1;
            setCreateWarTeamIndex(index > mapInfo.playersCount ? 1 : index);
        }
        export function getCreateWarTeamIndex(): number {
            return _dataForCreateWar.teamIndex;
        }

        export function setCreateWarHasFog(has: boolean): void {
            _dataForCreateWar.hasFog = has;
        }
        export function setCreateWarPrevHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }
        export function setCreateWarNextHasFog(): void {
            setCreateWarHasFog(!getCreateWarHasFog());
        }
        export function getCreateWarHasFog(): boolean {
            return _dataForCreateWar.hasFog;
        }

        export function setCreateWarTimeLimit(limit: number): void {
            _dataForCreateWar.timeLimit = limit;
        }
        export function setCreateWarPrevTimeLimit(): void {
            const currLimit = getCreateWarTimeLimit();
            const index     = TIME_LIMITS.indexOf(currLimit);
            if (index < 0) {
                setCreateWarTimeLimit(DEFAULT_TIME_LIMIT);
            } else {
                const newIndex = index - 1;
                setCreateWarTimeLimit(newIndex >= 0 ? TIME_LIMITS[newIndex] : TIME_LIMITS[TIME_LIMITS.length - 1]);
            }
        }
        export function setCreateWarNextTimeLimit(): void {
            const currLimit = getCreateWarTimeLimit();
            const index     = TIME_LIMITS.indexOf(currLimit);
            if (index < 0) {
                setCreateWarTimeLimit(DEFAULT_TIME_LIMIT);
            } else {
                const newIndex = index + 1;
                setCreateWarTimeLimit(newIndex < TIME_LIMITS.length ? TIME_LIMITS[newIndex] : TIME_LIMITS[0]);
            }
        }
        export function getCreateWarTimeLimit(): number {
            return _dataForCreateWar.timeLimit;
        }

        export function setCreateWarInitialFund(fund: number): void {
            _dataForCreateWar.initialFund = fund;
        }
        export function getCreateWarInitialFund(): number {
            return _dataForCreateWar.initialFund;
        }

        export function setCreateWarIncomeModifier(modifier: number): void {
            _dataForCreateWar.incomeModifier = modifier;
        }
        export function getCreateWarIncomeModifier(): number {
            return _dataForCreateWar.incomeModifier;
        }

        export function setCreateWarInitialEnergy(energy: number): void {
            _dataForCreateWar.initialEnergy = energy;
        }
        export function getCreateWarInitialEnergy(): number {
            return _dataForCreateWar.initialEnergy;
        }

        export function setCreateWarEnergyGrowthModifier(modifier: number): void {
            _dataForCreateWar.energyGrowthModifier = modifier;
        }
        export function getCreateWarEnergyGrowthModifier(): number {
            return _dataForCreateWar.energyGrowthModifier;
        }

        export function setCreateWarMoveRangeModifier(modifier: number): void {
            _dataForCreateWar.moveRangeModifier = modifier;
        }
        export function setCreateWarPrevMoveRangeModifier(): void {
            const currModifier = getCreateWarMoveRangeModifier();
            const modifiers    = MOVE_RANGE_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            } else {
                const newIndex = index - 1;
                setCreateWarMoveRangeModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setCreateWarNextMoveRangeModifier(): void {
            const currModifier = getCreateWarMoveRangeModifier();
            const modifiers    = MOVE_RANGE_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            } else {
                const newIndex = index + 1;
                setCreateWarMoveRangeModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getCreateWarMoveRangeModifier(): number {
            return _dataForCreateWar.moveRangeModifier;
        }

        export function setCreateWarAttackPowerModifier(modifier: number): void {
            _dataForCreateWar.attackPowerModifier = modifier;
        }
        export function setCreateWarPrevAttackPowerModifier(): void {
            const currModifier = getCreateWarAttackPowerModifier();
            const modifiers    = ATTACK_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            } else {
                const newIndex = index - 1;
                setCreateWarAttackPowerModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setCreateWarNextAttackPowerModifier(): void {
            const currModifier = getCreateWarAttackPowerModifier();
            const modifiers    = ATTACK_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            } else {
                const newIndex = index + 1;
                setCreateWarAttackPowerModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getCreateWarAttackPowerModifier(): number {
            return _dataForCreateWar.attackPowerModifier;
        }

        export function setCreateWarVisionRangeModifier(modifier: number): void {
            _dataForCreateWar.visionRangeModifier = modifier;
        }
        export function setCreateWarPrevVisionRangeModifier(): void {
            const currModifier = getCreateWarVisionRangeModifier();
            const modifiers    = VISION_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const newIndex = index - 1;
                setCreateWarVisionRangeModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setNextVisionRangeModifier(): void {
            const currModifier = getCreateWarVisionRangeModifier();
            const modifiers    = VISION_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setCreateWarVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const newIndex = index + 1;
                setCreateWarVisionRangeModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getCreateWarVisionRangeModifier(): number {
            return _dataForCreateWar.visionRangeModifier;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for joining wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setUnjoinedWarInfos(infos: ProtoTypes.IWaitingMultiCustomWarInfo[]): void {
            _unjoinedWarInfos = infos;
        }
        export function getUnjoinedWarInfos(): ProtoTypes.IWaitingMultiCustomWarInfo[] {
            return _unjoinedWarInfos;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for exiting joined wars.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        export function setJoinedWarInfos(infos: ProtoTypes.IWaitingMultiCustomWarInfo[]): void {
            _joinedWarInfos = infos;
        }
        export function getJoinedWarInfos(): ProtoTypes.IWaitingMultiCustomWarInfo[] {
            return _joinedWarInfos;
        }
    }
}
