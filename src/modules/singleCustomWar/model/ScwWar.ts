
// import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
// import TwnsSpwWarMenuPanel  from "../../singlePlayerWar/view/SpwWarMenuPanel";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SingleCustomWar {
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import ISettingsForScw  = CommonProto.WarSettings.ISettingsForScw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import GameConfig       = Config.GameConfig;

    export class ScwWar extends TwnsSpwWar.SpwWar {
        private _settingsForScw?    : ISettingsForScw;

        public async init(data: ISerialWar, gameConfig: GameConfig): Promise<void> {
            this._baseInit(data, gameConfig);
            this._setSettingsForScw(Helpers.getExisted(data.settingsForScw, ClientErrorCode.ScwWar_Init_00));

            this._initView();
        }

        public serialize(): ISerialWar {
            return {
                settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon(),
                settingsForScw              : this._getSettingsForScw(),

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
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.ScwFog
                : Types.WarType.ScwStd;
        }

        public getMapId(): number {
            return Helpers.getExisted(this._getSettingsForScw().mapId);
        }

        public getCanCheat(): boolean {
            return true;
        }

        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }

        private _setSettingsForScw(settings: ISettingsForScw): void {
            this._settingsForScw = settings;
        }
        private _getSettingsForScw(): ISettingsForScw {
            return Helpers.getExisted(this._settingsForScw);
        }
    }
}

// export default TwnsScwWar;
