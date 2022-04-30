
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import WarRuleHelpers               from "../../tools/warHelpers/WarRuleHelpers";
// import TwnsMeWarMenuPanel           from "../view/MeWarMenuPanel";
// import TwnsMeCommonSettingManager   from "./MeCommonSettingManager";
// import TwnsMeDrawer                 from "./MeDrawer";
// import TwnsMeField                  from "./MeField";
// import TwnsMePlayerManager          from "./MePlayerManager";
// import MeUtility                    from "./MeUtility";
// import TwnsMeWarEventManager        from "./MeWarEventManager";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import WarAction                = CommonProto.WarAction;
    import ISerialWar               = CommonProto.WarSerialization.ISerialWar;
    import ITemplateWarRule         = CommonProto.WarRule.ITemplateWarRule;
    import IMapRawData              = CommonProto.Map.IMapRawData;
    import IDataForMapTag           = CommonProto.Map.IDataForMapTag;
    import ILanguageText            = CommonProto.Structure.ILanguageText;
    import GameConfig               = Config.GameConfig;

    export class MeWar extends BaseWar.BwWar {
        private readonly _playerManager         = new TwnsMePlayerManager.MePlayerManager();
        private readonly _field                 = new TwnsMeField.MeField();
        private readonly _commonSettingManager  = new MapEditor.MeCommonSettingManager();
        private readonly _drawer                = new TwnsMeDrawer.MeDrawer();
        private readonly _warEventManager       = new BaseWar.BwWarEventManager();

        private _mapModifiedTime?       : number;
        private _mapSlotIndex?          : number;
        private _mapDesignerUserId?     : number;
        private _mapDesignerName?       : string;
        private _mapNameList?           : ILanguageText[];
        private _mapDescArray?          : ILanguageText[];
        private _isReviewingMap         = false;
        private _templateWarRuleArray   : ITemplateWarRule[] = [];
        private _isMapModified          = false;
        private _mapTag?                : IDataForMapTag;

        public init(data: ISerialWar, gameConfig: GameConfig): void {
            this._baseInit(data, gameConfig);
            this.getDrawer().init();

            this._initView();
        }
        public initWithMapEditorData(data: CommonProto.Map.IMapEditorData, gameConfig: GameConfig): void {
            this.init(MapEditor.MeHelpers.createISerialWar(data), gameConfig);

            const mapRawData = Helpers.getExisted(data.mapRawData);
            this.setMapSlotIndex(Helpers.getExisted(data.slotIndex));
            this.setMapModifiedTime(Helpers.getExisted(mapRawData.modifiedTime));
            this.setMapDesignerUserId(Helpers.getExisted(mapRawData.designerUserId));
            this.setMapDesignerName(Helpers.getExisted(mapRawData.designerName));
            this.setMapNameArray(Helpers.getExisted(mapRawData.mapNameArray));
            this.setMapDescArray(mapRawData.mapExtraText?.mapDescription ?? []);
            this._setTemplateWarRuleArray(MapEditor.MeHelpers.createRevisedTemplateWarRuleArrayForMeWar(mapRawData.templateWarRuleArray));
            this.setMapTag(mapRawData.mapTag || {});
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
            const playersCountUnneutral = this.getPlayersCountUnneutral();
            MapEditor.MeHelpers.reviseAllUnitIds(unitMap);

            return {
                designerName            : this.getMapDesignerName(),
                designerUserId          : this.getMapDesignerUserId(),
                mapNameArray            : this.getMapNameArray(),
                mapWidth                : mapSize.width,
                mapHeight               : mapSize.height,
                playersCountUnneutral,
                modifiedTime            : Timer.getServerTimestamp(),
                tileDataArray           : this.getTileMap().serialize().tiles,
                unitDataArray           : unitMap.serialize().units,
                templateWarRuleArray    : this.getRevisedTemplateWarRuleArray(playersCountUnneutral),
                mapTag                  : this.getMapTag(),
                warEventFullData        : this.getWarEventManager().getWarEventFullData(),
                mapExtraText            : {
                    mapDescription      : this.getMapDescArray(),
                },
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
        public getMapId(): number | null {
            return null;
        }

        public getBootRestTime(): number | null {
            return null;
        }
        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }

        public getPlayerManager(): TwnsMePlayerManager.MePlayerManager {
            return this._playerManager;
        }
        public getField(): TwnsMeField.MeField {
            return this._field;
        }
        public getCommonSettingManager(): MapEditor.MeCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): BaseWar.BwWarEventManager {
            return this._warEventManager;
        }

        public getIsExecuteActionsWithExtraData(): boolean {
            return false;
        }

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            // nothing to do.
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | null> {
            return null;
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | null> {
            return null;
        }
        public async getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | null> {
            return null;
        }
        public async getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | null> {
            return null;
        }

        public getDrawer(): TwnsMeDrawer.MeDrawer {
            return this._drawer;
        }

        public setMapModifiedTime(time: number): void {
            this._mapModifiedTime = time;
        }
        public getMapModifiedTime(): number {
            return Helpers.getExisted(this._mapModifiedTime);
        }

        public getMapSlotIndex(): number {
            return Helpers.getExisted(this._mapSlotIndex);
        }
        public setMapSlotIndex(value: number): void {
            this._mapSlotIndex = value;
        }

        public getMapDesignerUserId(): number {
            return Helpers.getExisted(this._mapDesignerUserId);
        }
        public setMapDesignerUserId(value: number): void {
            this._mapDesignerUserId = value;
        }

        public getMapDesignerName(): string {
            return Helpers.getExisted(this._mapDesignerName);
        }
        public setMapDesignerName(value: string): void {
            this._mapDesignerName = value;
        }

        public getMapNameArray(): ILanguageText[] {
            return Helpers.getExisted(this._mapNameList);
        }
        public setMapNameArray(value: ILanguageText[]): void {
            this._mapNameList = value;
        }

        public getMapDescArray(): ILanguageText[] {
            return Helpers.getExisted(this._mapDescArray);
        }
        public setMapDescArray(value: ILanguageText[]): void {
            this._mapDescArray = value;
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

        public getTemplateWarRuleArray(): ITemplateWarRule[] {
            return this._templateWarRuleArray;
        }
        private _setTemplateWarRuleArray(value: ITemplateWarRule[]): void {
            this._templateWarRuleArray = value;
        }
        private _getTemplateWarRule(ruleId: number): ITemplateWarRule {
            return Helpers.getExisted(this.getTemplateWarRuleArray().find(v => v.ruleId === ruleId));
        }
        public getRevisedTemplateWarRuleArray(playersCountUnneutral: number): ITemplateWarRule[] {
            const revisedTemplateWarRuleArray: ITemplateWarRule[] = [];
            for (const templateWarRule of this.getTemplateWarRuleArray() || []) {
                const revisedRule = Helpers.deepClone(templateWarRule);
                const playerRules = Helpers.getExisted(revisedRule.ruleForPlayers);
                playerRules.playerRuleDataArray = Helpers.getExisted(playerRules.playerRuleDataArray).filter(v => {
                    const playerIndex = Helpers.getExisted(v.playerIndex);
                    return (playerIndex <= playersCountUnneutral)
                        && (playerIndex >= CommonConstants.WarFirstPlayerIndex);
                }).sort((v1, v2) => Helpers.getExisted(v1.playerIndex) - Helpers.getExisted(v2.playerIndex));
                revisedTemplateWarRuleArray.push(revisedRule);
            }

            return revisedTemplateWarRuleArray;
        }

        public addTemplateWarRule(): void {
            const templateWarRuleArray = this.getTemplateWarRuleArray();
            templateWarRuleArray.push(WarHelpers.WarRuleHelpers.createDefaultTemplateWarRule(templateWarRuleArray.length, CommonConstants.WarMaxPlayerIndex));
        }
        public deleteTemplateWarRule(templateWarRuleId: number): void {
            const templateWarRuleArray  = this.getTemplateWarRuleArray();
            const ruleIndex             = templateWarRuleArray.findIndex(v => v.ruleId === templateWarRuleId);
            if (ruleIndex >= 0) {
                templateWarRuleArray.splice(ruleIndex, 1);
                for (let i = ruleIndex; i < templateWarRuleArray.length; ++i) {
                    const templateWarRule   = templateWarRuleArray[i];
                    templateWarRule.ruleId  = Helpers.getExisted(templateWarRule.ruleId) - 1;
                }
            }
        }
        public setWarRuleNameList(ruleId: number, nameArray: ILanguageText[]): void {
            const templateWarRule = this._getTemplateWarRule(ruleId);
            if (templateWarRule) {
                templateWarRule.ruleNameArray = nameArray;
            }
        }

        public getMapTag(): IDataForMapTag {
            return Helpers.getExisted(this._mapTag);
        }
        public setMapTag(mapTag: IDataForMapTag): void {
            this._mapTag = mapTag;
        }

        public getPlayersCountUnneutral(): number {
            return (this.getField() as TwnsMeField.MeField).getMaxPlayerIndex();
        }
    }
}

// export default TwnsMeWar;
