
namespace TinyWars.CustomOnlineWarCreator {
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import TemplateMapManager   = TemplateMap.TemplateMapModel;

    export namespace CreateWarModel {
        const TIME_LIMITS = [
            60 * 15,            // 15 min
            60 * 60 * 24 * 1,   // 1 day
            60 * 60 * 24 * 2,   // 2 days
            60 * 60 * 24 * 3,   // 3 days
            60 * 60 * 24 * 7,   // 7 days
        ];
        const DEFAULT_TIME_LIMIT = TIME_LIMITS[3];

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

        const MOVE_RANGE_MODIFIERS        = [-2, -1, 0, 1, 2];
        const DEFAULT_MOVE_RANGE_MODIFIER = 0;

        const ATTACK_MODIFIERS        = [-30, -20, -10, 0, 10, 20, 30];
        const DEFAULT_ATTACK_MODIFIER = 0;

        const VISION_MODIFIERS        = [-2, -1, 0, 1, 2];
        const DEFAULT_VISION_MODIFIER = 0;

        let mapIndexKey: Types.MapIndexKey;
        let mapInfo    : ProtoTypes.IMapInfo;

        let warName         : string;
        let warPassword     : string;
        let warComment      : string;
        let playerIndex     : number;
        let teamIndex       : number;
        let hasFog          : boolean;
        let timeLimit       : number;

        let initialFund         : number;
        let incomeModifier      : number;
        let initialEnergy       : number;
        let energyGrowthModifier: number;
        let moveRangeModifier   : number;
        let attackPowerModifier : number;
        let visionRangeModifier : number;

        export function setMapIndexKey(key: Types.MapIndexKey): void {
            mapIndexKey = key;
            mapInfo     = TemplateMapManager.getMapInfo(key);
        }
        export function getMapIndexKey(): Types.MapIndexKey {
            return mapIndexKey;
        }
        export function getMapInfo(): ProtoTypes.IMapInfo {
            return mapInfo;
        }

        export function resetSettings(): void {
            setWarName("");
            setWarPassword("");
            setWarComment("");
            setPlayerIndex(1);
            setTeamIndex(1);
            setHasFog(false);
            setTimeLimit(DEFAULT_TIME_LIMIT);

            setInitialFund(0);
            setIncomeModifier(100);
            setInitialEnergy(0);
            setEnergyGrowthModifier(100);
            setMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            setAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            setVisionRangeModifier(DEFAULT_VISION_MODIFIER);
        }
        export function createDataForCreateWar(): DataForCreateWar {
            return {
                mapName         : mapInfo.mapName,
                mapDesigner     : mapInfo.mapDesigner,
                mapVersion      : mapInfo.mapVersion,
                warName         : warName.length     > 0 ? warName     : undefined,
                warPassword     : warPassword.length > 0 ? warPassword : undefined,
                warComment      : warComment.length  > 0 ? warComment  : undefined,
                configVersion   : ConfigManager.getNewestConfigVersion(),

                playerIndex : playerIndex,
                teamIndex   : teamIndex,
                hasFog      : hasFog,
                timeLimit   : timeLimit,

                initialFund         : initialFund,
                incomeModifier      : incomeModifier,
                initialEnergy       : initialEnergy,
                energyGrowthModifier: energyGrowthModifier,
                moveRangeModifier   : moveRangeModifier,
                attackPowerModifier : attackPowerModifier,
                visionRangeModifier : visionRangeModifier,
            };
        }

        export function setWarName(name: string): void {
            warName = name;
        }
        export function getWarName(): string {
            return warName;
        }

        export function setWarPassword(password: string): void {
            warPassword = password;
        }
        export function getWarPassword(): string {
            return warPassword;
        }

        export function setWarComment(comment: string): void {
            warComment = comment;
        }
        export function getWarComment(): string {
            return warComment;
        }

        export function setPlayerIndex(index: number): void {
            playerIndex = index;
        }
        export function setPrevPlayerIndex(): void {
            const index = getPlayerIndex() - 1;
            setPlayerIndex(index > 0 ? index : mapInfo.playersCount);
        }
        export function setNextPlayerIndex(): void {
            const index = getPlayerIndex() + 1;
            setPlayerIndex(index > mapInfo.playersCount ? 1 : index);
        }
        export function getPlayerIndex(): number {
            return playerIndex;
        }

        export function setTeamIndex(index: number): void {
            teamIndex = index;
        }
        export function setPrevTeamIndex(): void {
            const index = getTeamIndex() - 1;
            setTeamIndex(index > 0 ? index : mapInfo.playersCount);
        }
        export function setNextTeamIndex(): void {
            const index = getTeamIndex() + 1;
            setTeamIndex(index > mapInfo.playersCount ? 1 : index);
        }
        export function getTeamIndex(): number {
            return teamIndex;
        }

        export function setHasFog(has: boolean): void {
            hasFog = has;
        }
        export function setPrevHasFog(): void {
            setHasFog(!getHasFog());
        }
        export function setNextHasFog(): void {
            setHasFog(!getHasFog());
        }
        export function getHasFog(): boolean {
            return hasFog;
        }

        export function setTimeLimit(limit: number): void {
            timeLimit = limit;
        }
        export function setPrevTimeLimit(): void {
            const currLimit = getTimeLimit();
            const index     = TIME_LIMITS.indexOf(currLimit);
            if (index < 0) {
                setTimeLimit(DEFAULT_TIME_LIMIT);
            } else {
                const newIndex = index - 1;
                setTimeLimit(newIndex >= 0 ? TIME_LIMITS[newIndex] : TIME_LIMITS[TIME_LIMITS.length - 1]);
            }
        }
        export function setNextTimeLimit(): void {
            const currLimit = getTimeLimit();
            const index     = TIME_LIMITS.indexOf(currLimit);
            if (index < 0) {
                setTimeLimit(DEFAULT_TIME_LIMIT);
            } else {
                const newIndex = index + 1;
                setTimeLimit(newIndex < TIME_LIMITS.length ? TIME_LIMITS[newIndex] : TIME_LIMITS[0]);
            }
        }
        export function getTimeLimit(): number {
            return timeLimit;
        }

        export function setInitialFund(fund: number): void {
            initialFund = fund;
        }
        export function getInitialFund(): number {
            return initialFund;
        }

        export function setIncomeModifier(modifier: number): void {
            incomeModifier = modifier;
        }
        export function getIncomeModifier(): number {
            return incomeModifier;
        }

        export function setInitialEnergy(energy: number): void {
            initialEnergy = energy;
        }
        export function getInitialEnergy(): number {
            return initialEnergy;
        }

        export function setEnergyGrowthModifier(modifier: number): void {
            energyGrowthModifier = modifier;
        }
        export function getEnergyGrowthModifier(): number {
            return energyGrowthModifier;
        }

        export function setMoveRangeModifier(modifier: number): void {
            moveRangeModifier = modifier;
        }
        export function setPrevMoveRangeModifier(): void {
            const currModifier = getMoveRangeModifier();
            const modifiers    = MOVE_RANGE_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            } else {
                const newIndex = index - 1;
                setMoveRangeModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setNextMoveRangeModifier(): void {
            const currModifier = getMoveRangeModifier();
            const modifiers    = MOVE_RANGE_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setMoveRangeModifier(DEFAULT_MOVE_RANGE_MODIFIER);
            } else {
                const newIndex = index + 1;
                setMoveRangeModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getMoveRangeModifier(): number {
            return moveRangeModifier;
        }

        export function setAttackPowerModifier(modifier: number): void {
            attackPowerModifier = modifier;
        }
        export function setPrevAttackPowerModifier(): void {
            const currModifier = getAttackPowerModifier();
            const modifiers    = ATTACK_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            } else {
                const newIndex = index - 1;
                setAttackPowerModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setNextAttackPowerModifier(): void {
            const currModifier = getAttackPowerModifier();
            const modifiers    = ATTACK_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setAttackPowerModifier(DEFAULT_ATTACK_MODIFIER);
            } else {
                const newIndex = index + 1;
                setAttackPowerModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getAttackPowerModifier(): number {
            return attackPowerModifier;
        }

        export function setVisionRangeModifier(modifier: number): void {
            visionRangeModifier = modifier;
        }
        export function setPrevVisionRangeModifier(): void {
            const currModifier = getVisionRangeModifier();
            const modifiers    = VISION_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const newIndex = index - 1;
                setVisionRangeModifier(newIndex >= 0 ? modifiers[newIndex] : modifiers[modifiers.length - 1]);
            }
        }
        export function setNextVisionRangeModifier(): void {
            const currModifier = getVisionRangeModifier();
            const modifiers    = VISION_MODIFIERS;
            const index        = modifiers.indexOf(currModifier);
            if (index < 0) {
                setVisionRangeModifier(DEFAULT_VISION_MODIFIER);
            } else {
                const newIndex = index + 1;
                setVisionRangeModifier(newIndex < modifiers.length ? modifiers[newIndex] : modifiers[0]);
            }
        }
        export function getVisionRangeModifier(): number {
            return visionRangeModifier;
        }
    }
}
