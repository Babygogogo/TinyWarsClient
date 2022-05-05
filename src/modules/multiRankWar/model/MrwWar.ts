
// import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiRankWar {
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import ISettingsForMrw  = CommonProto.WarSettings.ISettingsForMrw;
    import ClientErrorCode  = Twns.ClientErrorCode;
    import MpwWar           = MultiPlayerWar.MpwWar;
    import GameConfig       = Config.GameConfig;

    export class MrwWar extends MpwWar {
        private _settingsForMrw?    : ISettingsForMrw;

        public init(data: ISerialWar, gameConfig: GameConfig): void {
            this._baseInit(data, gameConfig, WarHelpers.WarCommonHelpers.getWarType(data));
            this._setSettingsForMrw(Twns.Helpers.getExisted(data.settingsForMrw, ClientErrorCode.MrwWar_Init_00));

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
        public getMapId(): number {
            return Twns.Helpers.getExisted(this.getSettingsForMrw().mapId);
        }

        private _setSettingsForMrw(settings: ISettingsForMrw): void {
            this._settingsForMrw = settings;
        }
        public getSettingsForMrw(): ISettingsForMrw {
            return Twns.Helpers.getExisted(this._settingsForMrw);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getSettingsBootTimerParams(): number[] {
            return Twns.CommonConstants.WarBootTimerDefaultParams;
        }
    }
}

// export default TwnsMrwWar;
