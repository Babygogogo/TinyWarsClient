
// import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
// import TwnsSpwWarMenuPanel  from "../../singlePlayerWar/view/SpwWarMenuPanel";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleRankWar {
    import SpwWar           = SinglePlayerWar.SpwWar;
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import ISettingsForSrw  = CommonProto.WarSettings.ISettingsForSrw;
    import GameConfig       = Config.GameConfig;

    export class SrwWar extends SpwWar {
        private _settingsForSrw?    : ISettingsForSrw;

        public init(data: ISerialWar, gameConfig: GameConfig): void {
            this._baseInit(data, gameConfig, WarHelpers.WarCommonHelpers.getWarType(data));
            this._setSettingsForSrw(Helpers.getExisted(data.settingsForSrw, ClientErrorCode.SrwWar_Init_00));

            this._initView();
        }

        public serialize(): ISerialWar {
            const randomNumberManager = this.getRandomNumberManager();
            return {
                settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon(),
                settingsForSrw              : this._getSettingsForSrw(),

                warId                       : this.getWarId(),
                isEnded                     : this.getIsEnded(),
                seedRandomInitialState      : Helpers.getExisted(randomNumberManager.getSeedRandomInitialState()),
                seedRandomCurrentState      : randomNumberManager.getSeedRandomCurrentState(),
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                weatherManager              : this.getWeatherManager().serialize(),
                warEventManager             : this.getWarEventManager().serialize(),
                playerManager               : this.getPlayerManager().serialize(),
                turnManager                 : this.getTurnManager().serialize(),
                field                       : this.getField().serialize(),
                executedActionManager       : this.getExecutedActionManager().serialize(),
                warStatisticsManager        : this.getWarStatisticsManager().serialize(),
            };
        }
        public serializeForValidation(): ISerialWar {
            const settingsForSrw        = Helpers.deepClone(this._getSettingsForSrw());
            settingsForSrw.totalScore   = this.calculateTotalScore();
            return {
                settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon(),
                settingsForSrw,

                warId                       : null,
                isEnded                     : null,
                seedRandomInitialState      : Helpers.getExisted(this.getRandomNumberManager().getSeedRandomInitialState()),
                seedRandomCurrentState      : null,
                remainingVotesForDraw       : null,
                weatherManager              : null,
                warEventManager             : null,
                playerManager               : this.getPlayerManager().serialize(),
                turnManager                 : null,
                field                       : null,
                executedActionManager       : this.getExecutedActionManager().serializeForSrwValidation(),
            };
        }

        public getIsNeedExecutedAction(): boolean {
            return true;
        }
        public getIsNeedSeedRandom(): boolean {
            return true;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getMapId(): number {
            return Helpers.getExisted(this._getSettingsForSrw().mapId);
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getShouldSerializeFullInfoForFreeModeGames(): boolean {
            return false;
        }

        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }

        private _setSettingsForSrw(settings: ISettingsForSrw): void {
            this._settingsForSrw = settings;
        }
        private _getSettingsForSrw(): ISettingsForSrw {
            return Helpers.getExisted(this._settingsForSrw);
        }

        public calculateTotalScore(): number {
            return 100_000 - (this.getTurnManager().getTurnIndex() - 1) * 1000 - this.getExecutedActionManager().getExecutedActionsCount();
        }
    }
}

// export default TwnsSrwWar;
