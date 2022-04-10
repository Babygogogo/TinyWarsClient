
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
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import MpwWar           = TwnsMpwWar.MpwWar;
    import GameConfig       = Config.GameConfig;

    export class MrwWar extends MpwWar {
        private _settingsForMrw?    : ISettingsForMrw;

        public async init(data: ISerialWar, gameConfig: GameConfig): Promise<void> {
            this._baseInit(data, gameConfig);
            this._setSettingsForMrw(Helpers.getExisted(data.settingsForMrw, ClientErrorCode.MrwWar_Init_00));

            this._initView();
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.MrwFog
                : Types.WarType.MrwStd;
        }
        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }
        public getMapId(): number {
            return Helpers.getExisted(this.getSettingsForMrw().mapId);
        }

        private _setSettingsForMrw(settings: ISettingsForMrw): void {
            this._settingsForMrw = settings;
        }
        public getSettingsForMrw(): ISettingsForMrw {
            return Helpers.getExisted(this._settingsForMrw);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getSettingsBootTimerParams(): number[] {
            return CommonConstants.WarBootTimerDefaultParams;
        }
    }
}

// export default TwnsMrwWar;
