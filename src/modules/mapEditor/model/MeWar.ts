
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MapEditor {
    import Helpers          = Utility.Helpers;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import CommonConstants  = Utility.CommonConstants;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import WarAction        = ProtoTypes.WarAction;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import IWarRule         = ProtoTypes.WarRule.IWarRule;
    import IMapRawData      = ProtoTypes.Map.IMapRawData;
    import IDataForMapTag   = ProtoTypes.Map.IDataForMapTag;
    import ILanguageText    = ProtoTypes.Structure.ILanguageText;

    export class MeWar extends BaseWar.BwWar {
        private readonly _playerManager         = new MePlayerManager();
        private readonly _turnManager           = new MeTurnManager();
        private readonly _field                 = new MeField();
        private readonly _commonSettingManager  = new MeCommonSettingManager();
        private readonly _drawer                = new MeDrawer();
        private readonly _warEventManager       = new MeWarEventManager();

        private _mapModifiedTime    : number;
        private _mapSlotIndex       : number;
        private _mapDesignerUserId  : number;
        private _mapDesignerName    : string;
        private _mapNameList        : ILanguageText[];
        private _isReviewingMap     = false;
        private _warRuleList        : IWarRule[] = [];
        private _isMapModified      = false;
        private _mapTag             : IDataForMapTag;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            this.getDrawer().init();

            this._initView();

            return ClientErrorCode.NoError;
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
            this._setWarRuleArray(mapRawData.warRuleArray || [warData.settingsForCommon.warRule]);
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

        public serializeForMap(): IMapRawData {
            const unitMap               = this.getUnitMap();
            const mapSize               = unitMap.getMapSize();
            const playersCountUnneutral = (this.getField() as MeField).getMaxPlayerIndex();
            MeUtility.reviseAllUnitIds(unitMap);

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
                warRuleArray            : this.getRevisedWarRuleArray(playersCountUnneutral),
                mapTag                  : this.getMapTag(),
                warEventFullData        : this.getWarEventManager().getWarEventFullData(),
            };
        }

        public getCanCheat(): boolean {
            return true;
        }
        public getWarType(): Types.WarType {
            return Types.WarType.Me;
        }
        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            return undefined;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return MeWarMenuPanel.getIsOpening();
        }

        public getSettingsBootTimerParams(): number[] | null | undefined {
            return [Types.BootTimerType.NoBoot];
        }

        public getPlayerManager(): MePlayerManager {
            return this._playerManager;
        }
        public getTurnManager(): MeTurnManager {
            return this._turnManager;
        }
        public getField(): MeField {
            return this._field;
        }
        public getCommonSettingManager(): MeCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): MeWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            // nothing to do.
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | undefined> {
            return undefined;
        }
        public async getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | undefined> {
            return undefined;
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
        public setMapSlotIndex(value: number): void {
            this._mapSlotIndex = value;
        }

        public getMapDesignerUserId(): number {
            return this._mapDesignerUserId;
        }
        public setMapDesignerUserId(value: number): void {
            this._mapDesignerUserId = value;
        }

        public getMapDesignerName(): string {
            return this._mapDesignerName;
        }
        public setMapDesignerName(value: string): void {
            this._mapDesignerName = value;
        }

        public getMapNameArray(): ILanguageText[] {
            return this._mapNameList;
        }
        public setMapNameArray(value: ILanguageText[]): void {
            this._mapNameList = value;
        }

        public getIsReviewingMap(): boolean {
            return this._isReviewingMap;
        }
        public setIsReviewingMap(value: boolean): void {
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
        private _setWarRuleArray(value: IWarRule[]): void {
            this._warRuleList = value;
        }
        public getWarRuleByRuleId(ruleId: number): IWarRule {
            return this.getWarRuleArray().find(v => v.ruleId === ruleId);
        }
        public getRevisedWarRuleArray(playersCountUnneutral: number): IWarRule[] {
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
            ruleList.push(BwWarRuleHelper.createDefaultWarRule(ruleList.length, CommonConstants.WarMaxPlayerIndex));
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
