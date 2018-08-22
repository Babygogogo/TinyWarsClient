
namespace NewCustomWarSettings {
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import TemplateMapManager   = TemplateMap.TemplateMapModel;

    export namespace SettingsModel {
        const TIME_LIMITS = [
            60 * 15,            // 15 min
            60 * 60 * 24 * 1,   // 1 day
            60 * 60 * 24 * 2,   // 2 days
            60 * 60 * 24 * 3,   // 3 days
            60 * 60 * 24 * 7,   // 7 days
        ];
        const DEFAULT_TIME_LIMIT = TIME_LIMITS[3];

        let mapIndexKeys: Types.MapIndexKeys;
        let mapInfo     : ProtoTypes.IMapInfo;

        let warName     : string;
        let warPassword : string;
        let warComment  : string;
        let playerIndex : number;
        let teamIndex   : number;
        let hasFog      : boolean;
        let timeLimit   : number;

        export function setMapIndexKeys(keys: Types.MapIndexKeys): void {
            mapIndexKeys = keys;
            mapInfo      = TemplateMapManager.getMapInfo(keys);
        }
        export function getMapIndexKeys(): Types.MapIndexKeys {
            return mapIndexKeys;
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
    }
}
