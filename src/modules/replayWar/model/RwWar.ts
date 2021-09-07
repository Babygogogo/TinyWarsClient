
import TwnsBwCommonSettingManager   from "../../baseWar/model/BwCommonSettingManager";
import TwnsBwWar                    from "../../baseWar/model/BwWar";
import TwnsBwWarEventManager        from "../../baseWar/model/BwWarEventManager";
import TwnsClientErrorCode          from "../../tools/helpers/ClientErrorCode";
import CompatibilityHelpers         from "../../tools/helpers/CompatibilityHelpers";
import FloatText                    from "../../tools/helpers/FloatText";
import Helpers                      from "../../tools/helpers/Helpers";
import SoundManager                 from "../../tools/helpers/SoundManager";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import WarActionExecutor            from "../../tools/warHelpers/WarActionExecutor";
import WarVisibilityHelpers         from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsRwWarMenuPanel           from "../view/RwWarMenuPanel";
import TwnsRwField                  from "./RwField";
import TwnsRwPlayerManager          from "./RwPlayerManager";

namespace TwnsRwWar {
    import BwWarEventManager        = TwnsBwWarEventManager.BwWarEventManager;
    import RwWarMenuPanel           = TwnsRwWarMenuPanel.RwWarMenuPanel;
    import RwPlayerManager          = TwnsRwPlayerManager.RwPlayerManager;
    import RwField                  = TwnsRwField.RwField;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import WarType                  = Types.WarType;
    import WarAction                = ProtoTypes.WarAction;
    import IWarActionContainer      = WarAction.IWarActionContainer;
    import ISerialWar               = ProtoTypes.WarSerialization.ISerialWar;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                    = TwnsBwWar.BwWar;
    import BwCommonSettingManager   = TwnsBwCommonSettingManager.BwCommonSettingManager;

    type CheckPointData = {
        warData     : ISerialWar;
        nextActionId: number;
    };

    export class RwWar extends BwWar {
        private readonly _playerManager         = new RwPlayerManager();
        private readonly _field                 = new RwField();
        private readonly _commonSettingManager  = new BwCommonSettingManager();
        private readonly _warEventManager       = new BwWarEventManager();

        private _settingsForMcw?                    : ProtoTypes.WarSettings.ISettingsForMcw | null;
        private _settingsForScw?                    : ProtoTypes.WarSettings.ISettingsForScw | null;
        private _settingsForMrw?                    : ProtoTypes.WarSettings.ISettingsForMrw | null;

        private _replayId?                          : number;
        private _isAutoReplay                       = false;
        private _nextActionId                       = 0;
        private _checkPointIdsForNextActionId       = new Map<number, number>();
        private _checkPointDataListForCheckPointId  = new Map<number, CheckPointData>();

        public async init(warData: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(warData).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            if (baseInitError) {
                return baseInitError;
            }

            this._setSettingsForMcw(warData.settingsForMcw ?? null);
            this._setSettingsForScw(warData.settingsForScw ?? null);
            this._setSettingsForMrw(warData.settingsForMrw ?? null);
            this.setNextActionId(0);

            this.setCheckPointId(0, 0);
            this.setCheckPointData(0, {
                nextActionId    : 0,
                warData         : Helpers.deepClone(warData),
            });

            // await Helpers.checkAndCallLater().catch(err => { CompatibilityHelpers.showError(err); throw err; });

            this._initView();

            return ClientErrorCode.NoError;
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getField(): RwField {
            return this._field;
        }
        public getPlayerManager(): RwPlayerManager {
            return this._playerManager;
        }
        public getCommonSettingManager(): BwCommonSettingManager {
            return this._commonSettingManager;
        }
        public getWarEventManager(): BwWarEventManager {
            return this._warEventManager;
        }

        public updateTilesAndUnitsOnVisibilityChanged(): void {
            // No need to update units.

            const tileMap       = this.getTileMap();
            const visibleTiles  = WarVisibilityHelpers.getAllTilesVisibleToTeam(this, this.getPlayerInTurn().getTeamIndex());
            for (const tile of tileMap.getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            }
            tileMap.getView().updateCoZone();
        }

        public async getDescForExePlayerDeleteUnit(action: WarAction.IWarActionPlayerDeleteUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0081)} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerEndTurn(action: WarAction.IWarActionPlayerEndTurn): Promise<string | null> {
            return `${Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }), this.getPlayerIndexInTurn())} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerProduceUnit(action: WarAction.IWarActionPlayerProduceUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0095)} ${Lang.getUnitName(Helpers.getExisted(action.unitType))} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerSurrender(action: WarAction.IWarActionPlayerSurrender): Promise<string | null> {
            return `${await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; })} ${Lang.getText(action.deprecatedIsBoot ? LangTextType.B0396: LangTextType.B0055)} ${this._getDescSuffix()}`;
        }
        public async getDescForExePlayerVoteForDraw(action: WarAction.IWarActionPlayerVoteForDraw): Promise<string | null> {
            const nickname      = await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            const playerIndex   = this.getPlayerIndexInTurn();
            const suffix        = this._getDescSuffix();
            if (!action.isAgree) {
                return `${Lang.getFormattedText(LangTextType.F0017, playerIndex, nickname)} ${suffix}`;
            } else {
                if (this.getDrawVoteManager().getRemainingVotes()) {
                    return `${Lang.getFormattedText(LangTextType.F0018, playerIndex, nickname)} ${suffix}`;
                } else {
                    return `${Lang.getFormattedText(LangTextType.F0019, playerIndex, nickname)} ${suffix}`;
                }
            }
        }
        public async getDescForExeSystemBeginTurn(action: WarAction.IWarActionSystemBeginTurn): Promise<string | null> {
            return `P${this.getPlayerIndexInTurn()} ${await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; })} ${Lang.getText(LangTextType.B0094)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemCallWarEvent(action: WarAction.IWarActionSystemCallWarEvent): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0451)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemDestroyPlayerForce(action: WarAction.IWarActionSystemDestroyPlayerForce): Promise<string | null> {
            const playerIndex = Helpers.getExisted(action.targetPlayerIndex);
            return `P${playerIndex} ${await this.getPlayer(playerIndex).getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; })}${Lang.getText(LangTextType.B0450)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemEndWar(action: WarAction.IWarActionSystemEndWar): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0087)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeSystemEndTurn(action: WarAction.IWarActionSystemEndTurn): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0030, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }), this.getPlayerIndexInTurn());
        }
        public async getDescForExeSystemHandleBootPlayer(action: WarAction.IWarActionSystemHandleBootPlayer): Promise<string | null> {
            return Lang.getFormattedText(LangTextType.F0028, await this.getPlayerInTurn().getNickname().catch(err => { CompatibilityHelpers.showError(err); throw err; }));
        }
        public async getDescForExeUnitAttackTile(action: WarAction.IWarActionUnitAttackTile): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0097)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitAttackUnit(action: WarAction.IWarActionUnitAttackUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0097)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitBeLoaded(action: WarAction.IWarActionUnitBeLoaded): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0098)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitBuildTile(action: WarAction.IWarActionUnitBuildTile): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0099)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitCaptureTile(action: WarAction.IWarActionUnitCaptureTile): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0100)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitDive(action: WarAction.IWarActionUnitDive): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0101)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitDropUnit(action: WarAction.IWarActionUnitDropUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0102)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitJoinUnit(action: WarAction.IWarActionUnitJoinUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0103)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitLaunchFlare(action: WarAction.IWarActionUnitLaunchFlare): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0104)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitLaunchSilo(action: WarAction.IWarActionUnitLaunchSilo): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0105)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitLoadCo(action: WarAction.IWarActionUnitLoadCo): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0139)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitProduceUnit(action: WarAction.IWarActionUnitProduceUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0106)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitSupplyUnit(action: WarAction.IWarActionUnitSupplyUnit): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0107)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitSurface(action: WarAction.IWarActionUnitSurface): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0108)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitUseCoSkill(action: WarAction.IWarActionUnitUseCoSkill): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0142)} ${this._getDescSuffix()}`;
        }
        public async getDescForExeUnitWait(action: WarAction.IWarActionUnitWait): Promise<string | null> {
            return `${Lang.getText(LangTextType.B0109)} ${this._getDescSuffix()}`;
        }
        private _getDescSuffix(): string {
            return `(${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(LangTextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`;
        }

        public serializeForCheckPoint(): CheckPointData {
            const randomNumberManager = this.getRandomNumberManager();
            return {
                nextActionId    : this.getNextActionId(),
                warData         : {
                    settingsForCommon           : null,
                    settingsForMcw              : null,
                    settingsForScw              : null,

                    warId                       : null,
                    seedRandomInitialState      : Helpers.getExisted(randomNumberManager.getSeedRandomInitialState()),
                    seedRandomCurrentState      : randomNumberManager.getSeedRandomCurrentState(),
                    executedActions             : null,
                    remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                    warEventManager             : Helpers.deepClone(this.getWarEventManager().serialize()),
                    playerManager               : this.getPlayerManager().serialize(),
                    turnManager                 : this.getTurnManager().serialize(),
                    field                       : this.getField().serialize(),
                },
            };
        }

        public getWarType(): WarType {
            const hasFog = this.getCommonSettingManager().getSettingsHasFogByDefault();
            if (this._getSettingsForMcw()) {
                return hasFog ? WarType.McwFog : WarType.McwStd;
            } else if (this._getSettingsForMrw()) {
                return hasFog ? WarType.MrwFog : WarType.MrwStd;
            } else if (this._getSettingsForScw()) {
                return hasFog ? WarType.ScwFog : WarType.ScwStd;
            } else {
                throw new Error(`Invalid war data.`);
            }
        }
        public getIsNeedExecutedAction(): boolean {
            return true;
        }
        public getIsNeedSeedRandom(): boolean {
            return true;
        }
        public getMapId(): number {
            const settingsForMcw = this._getSettingsForMcw();
            if (settingsForMcw) {
                return Helpers.getExisted(settingsForMcw.mapId);
            }

            const settingsForMrw = this._getSettingsForMrw();
            if (settingsForMrw) {
                return Helpers.getExisted(settingsForMrw.mapId);
            }

            const settingsForScw = this._getSettingsForScw();
            if (settingsForScw) {
                return Helpers.getExisted(settingsForScw.mapId);
            }

            throw new Error(`Invalid war data.`);
        }
        public getIsWarMenuPanelOpening(): boolean {
            return RwWarMenuPanel.getIsOpening();
        }

        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }

        public getIsRunTurnPhaseWithExtraData(): boolean {
            return false;
        }

        private _getSettingsForMcw(): ProtoTypes.WarSettings.ISettingsForMcw | null {
            return Helpers.getDefined(this._settingsForMcw);
        }
        private _setSettingsForMcw(value: ProtoTypes.WarSettings.ISettingsForMcw | null): void {
            this._settingsForMcw = value;
        }
        private _getSettingsForScw(): ProtoTypes.WarSettings.ISettingsForScw | null {
            return Helpers.getDefined(this._settingsForScw);
        }
        private _setSettingsForScw(value: ProtoTypes.WarSettings.ISettingsForScw | null): void {
            this._settingsForScw = value;
        }
        private _getSettingsForMrw(): ProtoTypes.WarSettings.ISettingsForMrw | null {
            return Helpers.getDefined(this._settingsForMrw);
        }
        private _setSettingsForMrw(value: ProtoTypes.WarSettings.ISettingsForMrw | null): void {
            this._settingsForMrw = value;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getReplayId(): number {
            return Helpers.getDefined(this._replayId);
        }
        public setReplayId(replayId: number): void {
            this._replayId = replayId;
        }

        public getNextActionId(): number {
            return this._nextActionId;
        }
        public setNextActionId(nextActionId: number): void {
            this._nextActionId = nextActionId;
            Notify.dispatch(NotifyType.RwNextActionIdChanged);
        }

        public getIsAutoReplay(): boolean {
            return this._isAutoReplay;
        }
        public setIsAutoReplay(isAuto: boolean): void {
            if (this.getIsAutoReplay() !== isAuto) {
                this._isAutoReplay = isAuto;
                Notify.dispatch(NotifyType.ReplayAutoReplayChanged);

                if ((isAuto) && (!this.getIsExecutingAction()) && (!this.checkIsInEnd())) {
                    this._executeNextAction(false);
                }
            }
        }

        public getCheckPointId(nextActionId: number): number | null {
            return this._checkPointIdsForNextActionId.get(nextActionId) ?? null;
        }
        public setCheckPointId(nextActionId: number, checkPointId: number): void {
            this._checkPointIdsForNextActionId.set(nextActionId, checkPointId);
        }

        public getCheckPointData(checkPointId: number): CheckPointData | null {
            return this._checkPointDataListForCheckPointId.get(checkPointId) ?? null;
        }
        public setCheckPointData(checkPointId: number, data: CheckPointData): void {
            this._checkPointDataListForCheckPointId.set(checkPointId, data);
        }

        public checkIsInBeginning(): boolean {
            return this.getNextActionId() <= 0;
        }
        public checkIsInEnd(): boolean {
            return this.getNextActionId() >= this.getTotalActionsCount();
        }

        public async loadNextCheckPoint(): Promise<void> {
            if (this.checkIsInEnd()) {
                return;
            }

            const checkPointId = Helpers.getExisted(this.getCheckPointId(this.getNextActionId())) + 1;
            this.setIsAutoReplay(false);

            while (!this.getCheckPointData(checkPointId)) {
                await Helpers.checkAndCallLater().catch(err => { CompatibilityHelpers.showError(err); throw err; });
                await this._executeNextAction(true).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
            this.stopRunning();
            await Helpers.checkAndCallLater().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            await this._loadCheckPoint(checkPointId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            await Helpers.checkAndCallLater().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            this.startRunning().startRunningView();
            FloatText.show(`${Lang.getText(LangTextType.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(LangTextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
        }
        public async loadPreviousCheckPoint(): Promise<void> {
            if (this.checkIsInBeginning()) {
                return;
            }

            const nextActionId = this.getNextActionId();
            const checkPointId = Math.min(Helpers.getExisted(this.getCheckPointId(nextActionId)), Helpers.getExisted(this.getCheckPointId(nextActionId - 1)));
            this.setIsAutoReplay(false);

            this.stopRunning();
            await Helpers.checkAndCallLater().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            await this._loadCheckPoint(checkPointId).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            await Helpers.checkAndCallLater().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            this.startRunning().startRunningView();
            FloatText.show(`${Lang.getText(LangTextType.A0045)} (${this.getNextActionId()} / ${this.getTotalActionsCount()} ${Lang.getText(LangTextType.B0191)}: ${this.getTurnManager().getTurnIndex()})`);
        }
        private async _loadCheckPoint(checkPointId: number): Promise<void> {
            const checkPointData        = Helpers.getExisted(this.getCheckPointData(checkPointId));
            const warData               = checkPointData.warData;
            const configVersion         = this.getConfigVersion();
            const playersCountUnneutral = this.getPlayerManager().getTotalPlayersCount(false);

            this.setNextActionId(checkPointData.nextActionId);
            this.getPlayerManager().fastInit(Helpers.getExisted(warData.playerManager), configVersion);
            this.getTurnManager().fastInit(Helpers.getExisted(warData.turnManager), playersCountUnneutral);
            this.getWarEventManager().fastInit(Helpers.getExisted(warData.warEventManager));
            this.getField().fastInit({
                data                    : Helpers.getExisted(warData.field),
                configVersion,
                playersCountUnneutral,
            });
            this.getDrawVoteManager().setRemainingVotes(warData.remainingVotesForDraw ?? null);
            this.getRandomNumberManager().init({
                isNeedSeedRandom    : this.getIsNeedSeedRandom(),
                initialState        : warData.seedRandomInitialState,
                currentState        : warData.seedRandomCurrentState,
            });
            this.setIsEnded(this.checkIsInEnd());

            await Helpers.checkAndCallLater().catch(err => { CompatibilityHelpers.showError(err); throw err; });
            this._fastInitView();
            SoundManager.playCoBgmWithWar(this, false);
        }

        public getTotalActionsCount(): number {
            return this.getExecutedActionManager().getExecutedActionsCount();
        }
        public getNextAction(): IWarActionContainer {
            return this.getExecutedActionManager().getExecutedAction(this.getNextActionId());
        }

        private async _executeNextAction(isFastExecute: boolean): Promise<void> {
            const action = this.getNextAction();
            if ((action == null)            ||
                (!this.getIsRunning())       ||
                (this.checkIsInEnd())        ||
                (this.getIsExecutingAction())
            ) {
                FloatText.show(Lang.getText(LangTextType.B0110));
            } else {
                await this._doExecuteAction(action, isFastExecute).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            }
        }
        private async _doExecuteAction(action: IWarActionContainer, isFastExecute: boolean): Promise<void> {
            this.setNextActionId(this.getNextActionId() + 1);
            const errorCode = await WarActionExecutor.checkAndExecute(this, action, isFastExecute).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            if (errorCode) {
                throw new Error(`RwWar._doExecuteAction() errorCode: ${errorCode}`);
            }

            const isInEnd = this.checkIsInEnd();
            if (isInEnd) {
                this.setIsAutoReplay(false);
            }

            const actionId          = this.getNextActionId();
            const turnManager       = this.getTurnManager();
            const prevCheckPointId  = Helpers.getExisted(this.getCheckPointId(actionId - 1));
            const prevTurnData      = Helpers.getExisted(Helpers.getExisted(this.getCheckPointData(prevCheckPointId)).warData.turnManager);
            const isNewCheckPoint   = (isInEnd) || (turnManager.getTurnIndex() !== prevTurnData.turnIndex) || (turnManager.getPlayerIndexInTurn() !== prevTurnData.playerIndex);
            const checkPointId      = isNewCheckPoint ? prevCheckPointId + 1 : prevCheckPointId;
            if (this.getCheckPointId(actionId) == null) {
                this.setCheckPointId(actionId, checkPointId);
            }
            if (this.getCheckPointData(checkPointId) == null) {
                this.setCheckPointData(checkPointId, this.serializeForCheckPoint());
            }

            if ((!isInEnd) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
                egret.setTimeout(() => {
                    if ((!this.checkIsInEnd()) && (this.getIsAutoReplay()) && (!this.getIsExecutingAction()) && (this.getIsRunning())) {
                        this._doExecuteAction(this.getNextAction(), isFastExecute);
                    }
                }, null, 1000);
            }
        }
    }
}

export default TwnsRwWar;
