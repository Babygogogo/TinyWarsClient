
// import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomWar {
    import MpwWar           = TwnsMpwWar.MpwWar;
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import ISettingsForMcw  = CommonProto.WarSettings.ISettingsForMcw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import GameConfig       = Config.GameConfig;

    export class McwWar extends MpwWar {
        private _settingsForMcw?: ISettingsForMcw;

        public init(data: ISerialWar, gameConfig: GameConfig): void {
            this._baseInit(data, gameConfig);
            this._setSettingsForMcw(Helpers.getExisted(data.settingsForMcw, ClientErrorCode.McwWar_Init_00));

            this._initView();
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.McwFog
                : Types.WarType.McwStd;
        }
        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }
        public getMapId(): number {
            return Helpers.getExisted(this.getSettingsForMcw().mapId);
        }

        private _setSettingsForMcw(settings: ISettingsForMcw): void {
            this._settingsForMcw = settings;
        }
        public getSettingsForMcw(): ISettingsForMcw {
            return Helpers.getExisted(this._settingsForMcw);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string | null {
            const settingsForMcw = this.getSettingsForMcw();
            return settingsForMcw.warName ?? null;
        }
        public getWarPassword(): string | null {
            const settingsForMcw = this.getSettingsForMcw();
            return settingsForMcw.warPassword ?? null;
        }
        public getWarComment(): string | null {
            const settingsForMcw = this.getSettingsForMcw();
            return settingsForMcw.warComment ?? null;
        }

        public getSettingsBootTimerParams(): number[] {
            return Helpers.getExisted(this.getSettingsForMcw().bootTimerParams);
        }
    }
}

// export default TwnsMcwWar;
