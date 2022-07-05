
// import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
// import TwnsSpwWarMenuPanel  from "../../singlePlayerWar/view/SpwWarMenuPanel";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleFreeWar {
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import ISettingsForSfw  = CommonProto.WarSettings.ISettingsForSfw;
    import GameConfig       = Config.GameConfig;

    export class SfwWar extends SinglePlayerWar.SpwWar {
        private _settingsForSfw?    : ISettingsForSfw;

        public init(data: ISerialWar, gameConfig: GameConfig): void {
            this._baseInit(data, gameConfig, WarHelpers.WarCommonHelpers.getWarType(data));
            this._setSettingsForSfw(Helpers.getExisted(data.settingsForSfw, ClientErrorCode.SfwWar_Init_00));
            this.getRetractManager().setCanRetract(true);

            this._initView();
        }

        public serialize(): ISerialWar {
            return {
                settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon(),
                settingsForSfw              : this._getSettingsForSfw(),

                warId                       : this.getWarId(),
                isEnded                     : this.getIsEnded(),
                seedRandomInitialState      : null,
                seedRandomCurrentState      : null,
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                weatherManager              : this.getWeatherManager().serialize(),
                warEventManager             : this.getWarEventManager().serialize(),
                playerManager               : this.getPlayerManager().serialize(),
                turnManager                 : this.getTurnManager().serialize(),
                field                       : this.getField().serialize(),
                executedActionManager       : null,
                warStatisticsManager        : this.getWarStatisticsManager().serialize(),
            };
        }

        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getMapId(): number | null {
            return null;
        }

        public getCanCheat(): boolean {
            return true;
        }

        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }

        private _setSettingsForSfw(settings: ISettingsForSfw): void {
            this._settingsForSfw = settings;
        }
        private _getSettingsForSfw(): ISettingsForSfw {
            return Helpers.getExisted(this._settingsForSfw);
        }
    }
}

// export default TwnsSfwWar;
