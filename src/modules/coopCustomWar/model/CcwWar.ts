
import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsCcwWar {
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForCcw  = ProtoTypes.WarSettings.ISettingsForCcw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import MpwWar           = TwnsMpwWar.MpwWar;

    export class CcwWar extends MpwWar {
        private _settingsForCcw?: ISettingsForCcw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForCcw = data.settingsForCcw;
            if (settingsForCcw == null) {
                return ClientErrorCode.CcwWar_Init_00;
            }

            this._setSettingsForCcw(settingsForCcw);

            this._initView();

            return ClientErrorCode.NoError;
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

export default TwnsCcwWar;
