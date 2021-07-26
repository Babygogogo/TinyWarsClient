
import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsMfwWar {
    import MpwWar           = TwnsMpwWar.MpwWar;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMfw  = ProtoTypes.WarSettings.ISettingsForMfw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class MfwWar extends MpwWar {
        private _settingsForMfw?: ISettingsForMfw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data);
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForMfw = data.settingsForMfw;
            if (settingsForMfw == null) {
                return ClientErrorCode.MfwWarInit00;
            }

            this._setSettingsForMfw(settingsForMfw);

            this._initView();

            return ClientErrorCode.NoError;
        }

        public getCanCheat(): boolean {
            return false;
        }
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.MfwFog
                : Types.WarType.MfwStd;
        }
        public getIsNeedExecutedAction(): boolean {
            return false;
        }
        public getIsNeedSeedRandom(): boolean {
            return false;
        }
        public getMapId(): number | undefined {
            return undefined;
        }

        private _setSettingsForMfw(settings: ISettingsForMfw): void {
            this._settingsForMfw = settings;
        }
        public getSettingsForMfw(): ISettingsForMfw | null | undefined {
            return this._settingsForMfw;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarName(): string {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getWarName() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.warName;
        }
        public getWarPassword(): string {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getWarPassword() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.warPassword;
        }
        public getWarComment(): string {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getWarComment() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.warComment;
        }

        public getSettingsBootTimerParams(): number[] {
            const settingsForMfw = this.getSettingsForMfw();
            if (settingsForMfw == null) {
                Logger.error(`MfwWar.getSettingsBootTimerParams() empty settingsForMfw.`);
                return undefined;
            }

            return settingsForMfw.bootTimerParams;
        }
    }
}

export default TwnsMfwWar;
