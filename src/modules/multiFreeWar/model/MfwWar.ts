
import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsMfwWar {
    import MpwWar           = TwnsMpwWar.MpwWar;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMfw  = ProtoTypes.WarSettings.ISettingsForMfw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class MfwWar extends MpwWar {
        private _settingsForMfw?    : ISettingsForMfw;

        public async init(data: ISerialWar): Promise<void> {
            await this._baseInit(data);
            this._setSettingsForMfw(Helpers.getExisted(data.settingsForMfw, ClientErrorCode.MfwWar_Init_00));

            this._initView();
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
        public getMapId(): number | null {
            return null;
        }

        private _setSettingsForMfw(settings: ISettingsForMfw): void {
            this._settingsForMfw = settings;
        }
        public getSettingsForMfw(): ISettingsForMfw {
            return Helpers.getExisted(this._settingsForMfw);
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
            return Helpers.getExisted(this.getSettingsForMfw().bootTimerParams);
        }
    }
}

export default TwnsMfwWar;
