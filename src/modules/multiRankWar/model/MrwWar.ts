
import TwnsMpwWar           from "../../multiPlayerWar/model/MpwWar";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsMrwWar {
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForMrw  = ProtoTypes.WarSettings.ISettingsForMrw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import MpwWar           = TwnsMpwWar.MpwWar;

    export class MrwWar extends MpwWar {
        private _settingsForMrw?    : ISettingsForMrw;

        public async init(data: ISerialWar): Promise<ClientErrorCode> {
            const baseInitError = await this._baseInit(data).catch(err => { CompatibilityHelpers.showError(err); throw err; });
            if (baseInitError) {
                return baseInitError;
            }

            const settingsForMrw = data.settingsForMrw;
            if (settingsForMrw == null) {
                return ClientErrorCode.MrwWarInit00;
            }

            this._setSettingsForMrw(settingsForMrw);

            this._initView();

            return ClientErrorCode.NoError;
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
            return Helpers.getDefined(this._settingsForMrw);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getSettingsBootTimerParams(): number[] {
            return CommonConstants.WarBootTimerDefaultParams;
        }
    }
}

export default TwnsMrwWar;
