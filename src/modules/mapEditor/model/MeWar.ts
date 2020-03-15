
namespace TinyWars.MapEditor {
    import Types = Utility.Types;

    export class MeWar {
        private _slotIndex      : number;
        private _configVersion  : string;
        private _isReview       : boolean;
        private _isRunning      = false;

        private _view           : MeWarView;
        private _field          : MeField;
        private _drawer         : MeDrawer;

        public init(data: Types.MapRawData, slotIndex: number, configVersion: string, isReview: boolean): MeWar {
            this._setSlotIndex(slotIndex);
            this._setConfigVersion(configVersion);
            this._setIsReview(isReview);

            this._setField((this.getField() || new MeField()).init(data, configVersion));
            this._setDrawer((this.getDrawer() || new MeDrawer()).init(data));
            this._initView();

            return this;
        }
        private _initView(): void {
            this._view = this._view || new MeWarView();
            this._view.init(this);
        }

        public serializeForSimulation(): Types.SerializedWar {
            return {
                warId                   : null,
                warName                 : null,
                warPassword             : null,
                warComment              : null,
                configVersion           : this.getConfigVersion(),
                executedActions         : [],
                nextActionId            : 0,
                remainingVotesForDraw   : null,
                warRuleIndex            : null,
                timeLimit               : null,
                hasFogByDefault         : false,
                incomeModifier          : 100,
                energyGrowthModifier    : 100,
                attackPowerModifier     : 0,
                moveRangeModifier       : 0,
                visionRangeModifier     : 0,
                initialFund             : 0,
                initialEnergy           : 0,
                bannedCoIdList          : [],
                luckLowerLimit          : 0,
                luckUpperLimit          : 10,
                singlePlayerWarType     : Types.SinglePlayerWarType.Custom,
                isSinglePlayerCheating  : true,
                mapFileName             : null,
                players                 : this._generateSimulationDataForPlayerManager(),
                field                   : this.getField().serializeForSimulation(),
                turn                    : this._generateSimulationDataForTurnManager(),
                seedRandomState         : null,
            };
        }

        public getView(): MeWarView {
            return this._view;
        }

        public startRunning(): MeWar {
            this.getField().startRunning(this);
            this.getDrawer().startRunning(this);

            this._isRunning = true;

            return this;
        }
        public startRunningView(): MeWar {
            this.getView().startRunningView();
            this.getField().startRunningView();

            return this;
        }
        public stopRunning(): MeWar {
            this.getField().stopRunning();
            this.getDrawer().stopRunning();
            this.getView().stopRunning();

            this._isRunning = false;

            return this;
        }
        public getIsRunning(): boolean {
            return this._isRunning;
        }

        private _setSlotIndex(warId: number): void {
            this._slotIndex = warId;
        }
        public getSlotIndex(): number {
            return this._slotIndex;
        }

        private _setIsReview(isReview: boolean): void {
            this._isReview = isReview;
        }
        public getIsReview(): boolean {
            return this._isReview;
        }

        private _setConfigVersion(configVersion: string): void {
            this._configVersion = configVersion;
        }
        public getConfigVersion(): string {
            return this._configVersion;
        }

        public setMapDesigner(designer: string): void {
            this.getField().setMapDesigner(designer);
        }
        public getMapDesigner(): string {
            return this.getField().getMapDesigner();
        }

        public setDesignerUserId(id: number): void {
            this.getField().setDesignerUserId(id);
        }
        public getDesignerUserId(): number {
            return this.getField().getDesignerUserId();
        }

        public getModifiedTime(): number {
            return this.getField().getModifiedTime();
        }

        private _setField(field: MeField): void {
            this._field = field;
        }
        public getField(): MeField {
            return this._field;
        }

        private _setDrawer(drawer: MeDrawer): void {
            this._drawer = drawer;
        }
        public getDrawer(): MeDrawer {
            return this._drawer;
        }

        public getUnitMap(): MeUnitMap {
            return this.getField().getUnitMap();
        }
        public getTileMap(): MeTileMap {
            return this.getField().getTileMap();
        }
        public getGridVisionEffect(): MeGridVisionEffect {
            return this.getField().getGridVisionEffect();
        }

        public setMapName(name: string): void {
            this.getField().setMapName(name);
        }
        public getMapName(): string {
            return this.getField().getMapName();
        }

        public setMapNameEnglish(name: string): void {
            this.getField().setMapNameEnglish(name);
        }
        public getMapNameEnglish(): string {
            return this.getField().getMapNameEnglish();
        }

        public setIsMultiPlayer(isMultiPlayer: boolean): void {
            this.getField().setIsMultiPlayer(isMultiPlayer);
        }
        public getIsMultiPlayer(): boolean {
            return this.getField().getIsMultiPlayer();
        }

        public setIsSinglePlayer(isSinglePlayer: boolean): void {
            this.getField().setIsSinglePlayer(isSinglePlayer);
        }
        public getIsSinglePlayer(): boolean {
            return this.getField().getIsSinglePlayer();
        }

        private _generateSimulationDataForPlayerManager(): Types.SerializedPlayer[] {
            const maxPlayerIndex    = this.getField().getMaxPlayerIndex();
            const selfUserId        = User.UserModel.getSelfUserId();
            const dataList          : Types.SerializedPlayer[] = [];
            for (let playerIndex = 0; playerIndex <= maxPlayerIndex; ++playerIndex) {
                dataList.push({
                    fund                        : 0,
                    hasVotedForDraw             : false,
                    isAlive                     : true,
                    playerIndex,
                    teamIndex                   : playerIndex,
                    watchRequestSrcUserIdList   : [],
                    watchOngoingSrcUserIdList   : [],
                    userId                      : playerIndex > 0 ? selfUserId : null,
                    coId                        : null,
                    coUnitId                    : null,
                    coCurrentEnergy             : null,
                    coUsingSkillType            : Types.CoSkillType.Passive,
                    coIsDestroyedInTurn         : false,
                });
            }

            return dataList;
        }

        private _generateSimulationDataForTurnManager(): Types.SerializedTurn {
            return {
                turnIndex       : 0,
                playerIndex     : 0,
                turnPhaseCode   : Types.TurnPhaseCode.WaitBeginTurn,
                enterTurnTime   : null,
            };
        }
    }
}
