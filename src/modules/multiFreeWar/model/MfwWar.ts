
// import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiFreeWar {
    import MpwWar           = MultiPlayerWar.MpwWar;
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import ISettingsForMfw  = CommonProto.WarSettings.ISettingsForMfw;
    import ClientErrorCode  = Twns.ClientErrorCode;
    import GameConfig       = Config.GameConfig;

    export class MfwWar extends MpwWar {
        private _settingsForMfw?    : ISettingsForMfw;

        public init(data: ISerialWar, gameConfig: GameConfig): void {
            this._baseInit(data, gameConfig, WarHelpers.WarCommonHelpers.getWarType(data));
            this._setSettingsForMfw(Twns.Helpers.getExisted(data.settingsForMfw, ClientErrorCode.MfwWar_Init_00));

            this._initView();
        }

        public getCanCheat(): boolean {
            return false;
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

        private _setSettingsForMfw(settings: ISettingsForMfw): void {
            this._settingsForMfw = settings;
        }
        public getSettingsForMfw(): ISettingsForMfw {
            return Twns.Helpers.getExisted(this._settingsForMfw);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string | null {
            return this.getSettingsForMfw().warName ?? null;
        }
        public getWarPassword(): string | null {
            return this.getSettingsForMfw().warPassword ?? null;
        }
        public getWarComment(): string | null {
            return this.getSettingsForMfw().warComment ?? null;
        }

        public getSettingsBootTimerParams(): number[] {
            return Twns.Helpers.getExisted(this.getSettingsForMfw().bootTimerParams);
        }
    }
}

// export default TwnsMfwWar;
