
// import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.CoopCustomWar {
    import ISerialWar       = CommonProto.WarSerialization.ISerialWar;
    import ISettingsForCcw  = CommonProto.WarSettings.ISettingsForCcw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import MpwWar           = TwnsMpwWar.MpwWar;
    import GameConfig       = Config.GameConfig;

    export class CcwWar extends MpwWar {
        private _settingsForCcw?: ISettingsForCcw;

        public async init(data: ISerialWar, gameConfig: GameConfig): Promise<void> {
            this._baseInit(data, gameConfig);
            this._setSettingsForCcw(Helpers.getExisted(data.settingsForCcw, ClientErrorCode.CcwWar_Init_00));

            this._initView();
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.CcwFog
                : Types.WarType.CcwStd;
        }
        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }
        public getMapId(): number {
            return Helpers.getExisted(this.getSettingsForCcw().mapId);
        }

        private _setSettingsForCcw(settings: ISettingsForCcw): void {
            this._settingsForCcw = settings;
        }
        public getSettingsForCcw(): ISettingsForCcw {
            return Helpers.getExisted(this._settingsForCcw);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string | null {
            const settingsForCcw = this.getSettingsForCcw();
            return settingsForCcw.warName ?? null;
        }
        public getWarPassword(): string | null {
            const settingsForCcw = this.getSettingsForCcw();
            return settingsForCcw.warPassword ?? null;
        }
        public getWarComment(): string | null {
            const settingsForCcw = this.getSettingsForCcw();
            return settingsForCcw.warComment ?? null;
        }

        public getSettingsBootTimerParams(): number[] {
            const settingsForCcw = this.getSettingsForCcw();
            return Helpers.getExisted(settingsForCcw.bootTimerParams);
        }
    }
}

// export default TwnsCcwWar;
