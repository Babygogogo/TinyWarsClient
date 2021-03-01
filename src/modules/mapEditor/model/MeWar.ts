
namespace TinyWars.MapEditor {
    import Helpers          = Utility.Helpers;
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import BwHelpers        = BaseWar.BwHelpers;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import IWarRule         = ProtoTypes.WarRule.IWarRule;
    import IMapRawData      = ProtoTypes.Map.IMapRawData;
    import IDataForMapTag   = ProtoTypes.Map.IDataForMapTag;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class MeWar extends BaseWar.BwWar {
        private _drawer             : MeDrawer;
        private _mapModifiedTime    : number;
        private _mapSlotIndex       : number;
        private _mapDesignerUserId  : number;
        private _mapDesignerName    : string;
        private _mapNameList        : ILanguageText[];
        private _isReviewingMap     = false;
        private _warRuleList        : IWarRule[] = [];
        private _isMapModified      = false;
        private _mapTag             : IDataForMapTag;

        public async init(data: ISerialWar): Promise<MeWar> {
            if (this._baseInit(data)) {
                Logger.error(`MeWar.init() failed this._baseInit().`);
                return undefined;
            }

            const mapSizeAndMaxPlayerIndex = await BwHelpers.getMapSizeAndMaxPlayerIndex(data);
            if (!mapSizeAndMaxPlayerIndex) {
                Logger.error(`MeWar.init() invalid war data! ${JSON.stringify(data)}`);
                return undefined;
            }

            const settingsForCommon = data.settingsForCommon;
            if (!settingsForCommon) {
                Logger.error(`MeWar.init() empty settingsForCommon! ${JSON.stringify(data)}`);
                return undefined;
            }

            const configVersion = settingsForCommon.configVersion;
            if (configVersion == null) {
                Logger.error(`MeWar.init() empty configVersion.`);
                return undefined;
            }

            const dataForPlayerManager = data.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`MeWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const dataForTurnManager = data.turnManager;
            if (dataForTurnManager == null) {
                Logger.error(`MeWar.init() empty dataForTurnManager.`);
                return undefined;
            }

            const dataForField = data.field;
            if (dataForField == null) {
                Logger.error(`MeWar.init() empty dataForField.`);
                return undefined;
            }

            const playerManager = (this.getPlayerManager() || new (this._getPlayerManagerClass())()).init(dataForPlayerManager);
            if (playerManager == null) {
                Logger.error(`MeWar.init() empty playerManager.`);
                return undefined;
            }

            const turnManager = (this.getTurnManager() || new (this._getTurnManagerClass())()).init(dataForTurnManager);
            if (turnManager == null) {
                Logger.error(`MeWar.init() empty turnManager.`);
                return undefined;
            }

            const field = await (this.getField() || new (this._getFieldClass())()).init(dataForField, configVersion, mapSizeAndMaxPlayerIndex);
            if (field == null) {
                Logger.error(`MeWar.init() empty field.`);
                return undefined;
            }

            this._setPlayerManager(playerManager);
            this._setTurnManager(turnManager);
            this._setField(field);
            this._setDrawer((this.getDrawer() || new MeDrawer()).init());

            this._initView();

            return this;
        }
        public async initWithMapEditorData(data: ProtoTypes.Map.IMapEditorData): Promise<void> {
            const warData = MeUtility.createISerialWar(data);
            await this.init(warData);

            const mapRawData = data.mapRawData;
            this.setMapSlotIndex(data.slotIndex);
            this.setMapModifiedTime(mapRawData.modifiedTime);
            this.setMapDesignerUserId(mapRawData.designerUserId);
            this.setMapDesignerName(mapRawData.designerName);
            this.setMapNameArray(mapRawData.mapNameArray);
            this.setWarRuleArray(mapRawData.warRuleArray || [warData.settingsForCommon.warRule]);
            this.setMapTag(mapRawData.mapTag);
        }

        public startRunning(): BaseWar.BwWar {
            super.startRunning();

            this.getDrawer().startRunning(this);

            return this;
        }
        public stopRunning(): BaseWar.BwWar {
            super.stopRunning();

            this.getDrawer().stopRunning();

            return this;
        }

        public serializeForSimulation(): ISerialWar | undefined {
            const settingsForCommon = Helpers.deepClone(this.getSettingsForCommon());
            if (settingsForCommon == null) {
                Logger.error(`MeWar.serializeForSimulation() empty settingsForCommon.`);
                return undefined;
            }

            const warEventManager = this.getWarEventManager();
            if (warEventManager == null) {
                Logger.error(`MeWar.serializeForSimulation() empty warEventManager.`);
                return undefined;
            }

            const playerManager = this.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`MeWar.serializeForSimulation() empty playerManager.`);
                return undefined;
            }

            const turnManager = this.getTurnManager();
            if (turnManager == null) {
                Logger.error(`MeWar.serializeForSimulation() empty turnManager.`);
                return undefined;
            }

            const field = this.getField();
            if (field == null) {
                Logger.error(`MeWar.serializeForSimulation() empty field.`);
                return undefined;
            }

            const serialWarEventManager = warEventManager.serializeForSimulation();
            if (serialWarEventManager == null) {
                Logger.error(`MeWar.serializeForSimulation() empty serialWarEventManager.`);
                return undefined;
            }

            const serialPlayerManager = playerManager.serializeForSimulation();
            if (serialPlayerManager == null) {
                Logger.error(`MeWar.serializeForSimulation() empty serialPlayerManager.`);
                return undefined;
            }

            const serialTurnManager = turnManager.serializeForSimulation();
            if (serialTurnManager == null) {
                Logger.error(`MeWar.serializeForSimulation() empty serialTurnManager.`);
                return undefined;
            }

            const serialField = field.serializeForSimulation();
            if (serialField == null) {
                Logger.error(`MeWar.serializeForSimulation() empty serialField.`);
                return undefined;
            }

            const playerRules           = settingsForCommon.warRule.ruleForPlayers;
            const playersCountUnneutral = (field as MeField).getMaxPlayerIndex();
            playerRules.playerRuleDataArray = playerRules.playerRuleDataArray.filter(v => {
                const playerIndex = v.playerIndex;
                return (playerIndex <= playersCountUnneutral)
                    && (playerIndex >= CommonConstants.WarFirstPlayerIndex);
            }).sort((v1, v2) => v1.playerIndex - v2.playerIndex);

            return {
                settingsForCommon,
                settingsForMcw              : null,
                settingsForMrw              : null,
                settingsForScw              : { isCheating: true },

                warId                       : this.getWarId(),
                seedRandomInitialState      : new Math.seedrandom("" + Math.random(), { state: true }).state(),
                seedRandomCurrentState      : null,
                executedActions             : [],
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : serialWarEventManager,
                playerManager               : serialPlayerManager,
                turnManager                 : serialTurnManager,
                field                       : serialField,
            };
        }

        public serializeForMap(): IMapRawData {
            const unitMap               = this.getUnitMap() as MeUnitMap;
            const mapSize               = unitMap.getMapSize();
            const playersCountUnneutral = (this.getField() as MeField).getMaxPlayerIndex();
            unitMap.reviseAllUnitIds();

            return {
                designerName            : this.getMapDesignerName(),
                designerUserId          : this.getMapDesignerUserId(),
                mapNameArray            : this.getMapNameArray(),
                mapWidth                : mapSize.width,
                mapHeight               : mapSize.height,
                playersCountUnneutral,
                modifiedTime            : Time.TimeModel.getServerTimestamp(),
                tileDataArray           : this.getTileMap().serialize().tiles,
                unitDataArray           : unitMap.serialize().units,
                warRuleArray            : this._getRevisedWarRuleArray(playersCountUnneutral),
                mapTag                  : this.getMapTag(),
                warEventFullData        : this.getWarEventManager().getWarEventFullData(),
            };
        }

        public getWarType(): Types.WarType {
            return Types.WarType.Me;
        }
        public getIsNeedReplay(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            return undefined;
        }

        protected _getFieldClass(): new () => MeField {
            return MeField;
        }
        protected _getWarEventManagerClass(): new () => BaseWar.BwWarEventManager {
            return MeWarEventManager;
        }
        protected _getPlayerManagerClass(): new () => MePlayerManager {
            return MePlayerManager;
        }
        protected _getTurnManagerClass(): new () => MeTurnManager {
            return MeTurnManager;
        }

        private _setDrawer(drawer: MeDrawer): void {
            this._drawer = drawer;
        }
        public getDrawer(): MeDrawer {
            return this._drawer;
        }

        public setMapModifiedTime(time: number): void {
            this._mapModifiedTime = time;
        }
        public getMapModifiedTime(): number {
            return this._mapModifiedTime;
        }

        public getMapSlotIndex(): number {
            return this._mapSlotIndex;
        }
        public setMapSlotIndex(value: number) {
            this._mapSlotIndex = value;
        }

        public getMapDesignerUserId(): number {
            return this._mapDesignerUserId;
        }
        public setMapDesignerUserId(value: number) {
            this._mapDesignerUserId = value;
        }

        public getMapDesignerName(): string {
            return this._mapDesignerName;
        }
        public setMapDesignerName(value: string) {
            this._mapDesignerName = value;
        }

        public getMapNameArray(): ILanguageText[] {
            return this._mapNameList;
        }
        public setMapNameArray(value: ILanguageText[]) {
            this._mapNameList = value;
        }

        public getIsReviewingMap(): boolean {
            return this._isReviewingMap;
        }
        public setIsReviewingMap(value: boolean) {
            this._isReviewingMap = value;
        }

        public getIsMapModified(): boolean {
            return this._isMapModified;
        }
        public setIsMapModified(hasSubmitted: boolean): void {
            this._isMapModified = hasSubmitted;
        }

        public getWarRuleArray(): IWarRule[] {
            return this._warRuleList;
        }
        public setWarRuleArray(value: IWarRule[]) {
            this._warRuleList = value;
        }
        public getWarRuleByRuleId(ruleId: number): IWarRule {
            return this.getWarRuleArray().find(v => v.ruleId === ruleId);
        }
        private _getRevisedWarRuleArray(playersCountUnneutral: number): IWarRule[] {
            const ruleArray: IWarRule[] = [];
            for (const rule of this.getWarRuleArray() || []) {
                const revisedRule = Helpers.deepClone(rule);
                const playerRules = revisedRule.ruleForPlayers;
                playerRules.playerRuleDataArray = playerRules.playerRuleDataArray.filter(v => {
                    const playerIndex = v.playerIndex;
                    return (playerIndex <= playersCountUnneutral)
                        && (playerIndex >= CommonConstants.WarFirstPlayerIndex);
                }).sort((v1, v2) => v1.playerIndex - v2.playerIndex);
                ruleArray.push(revisedRule);
            }

            return ruleArray;
        }

        public addWarRule(): void {
            const ruleList = this.getWarRuleArray();
            ruleList.push(BwSettingsHelper.createDefaultWarRule(ruleList.length, CommonConstants.WarMaxPlayerIndex));
        }
        public deleteWarRule(ruleId: number): void {
            const ruleList  = this.getWarRuleArray();
            const ruleIndex = ruleList.findIndex(v => v.ruleId === ruleId);
            if (ruleIndex >= 0) {
                ruleList.splice(ruleIndex, 1);
                for (let index = ruleIndex; index < ruleList.length; ++index) {
                    --ruleList[index].ruleId;
                }
            }
        }
        public setWarRuleNameList(ruleId: number, nameArray: ILanguageText[]): void {
            const rule = this.getWarRuleByRuleId(ruleId);
            if (rule) {
                rule.ruleNameArray = nameArray;
            }
        }

        public getMapTag(): IDataForMapTag {
            return this._mapTag;
        }
        public setMapTag(mapTag: IDataForMapTag): void {
            this._mapTag = mapTag;
        }
    }
}
