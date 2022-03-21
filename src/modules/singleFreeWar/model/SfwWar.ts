
// import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
// import TwnsSpwWarMenuPanel  from "../../singlePlayerWar/view/SpwWarMenuPanel";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsSfwWar {
    import SpwWar           = TwnsSpwWar.SpwWar;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForSfw  = ProtoTypes.WarSettings.ISettingsForSfw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class SfwWar extends SpwWar {
        private _settingsForSfw?    : ISettingsForSfw;

        public async init(data: ISerialWar): Promise<void> {
            await this._baseInit(data);
            this._setSettingsForSfw(Helpers.getExisted(data.settingsForSfw, ClientErrorCode.SfwWar_Init_00));

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
                executedActions             : [],
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                weatherManager              : this.getWeatherManager().serialize(),
                warEventManager             : this.getWarEventManager().serialize(),
                playerManager               : this.getPlayerManager().serialize(),
                turnManager                 : this.getTurnManager().serialize(),
                field                       : this.getField().serialize(),
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
                ? Types.WarType.SfwFog
                : Types.WarType.SfwStd;
        }

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
