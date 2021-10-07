
import TwnsSpwWar           from "../../singlePlayerWar/model/SpwWar";
import TwnsSpwWarMenuPanel  from "../../singlePlayerWar/view/SpwWarMenuPanel";
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import FloatText            from "../../tools/helpers/FloatText";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";

namespace TwnsSrwWar {
    import SpwWar           = TwnsSpwWar.SpwWar;
    import SpwWarMenuPanel  = TwnsSpwWarMenuPanel.SpwWarMenuPanel;
    import ISerialWar       = ProtoTypes.WarSerialization.ISerialWar;
    import ISettingsForSrw  = ProtoTypes.WarSettings.ISettingsForSrw;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class SrwWar extends SpwWar {
        private _settingsForSrw?    : ISettingsForSrw;

        public async init(data: ISerialWar): Promise<void> {
            await this._baseInit(data);
            this._setSettingsForSrw(Helpers.getExisted(data.settingsForSrw, ClientErrorCode.SrwWar_Init_00));

            this._initView();
        }

        public serialize(): ISerialWar {
            const randomNumberManager = this.getRandomNumberManager();
            return {
                settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon(),
                settingsForSrw              : this._getSettingsForSrw(),

                warId                       : this.getWarId(),
                seedRandomInitialState      : Helpers.getExisted(randomNumberManager.getSeedRandomInitialState()),
                seedRandomCurrentState      : randomNumberManager.getSeedRandomCurrentState(),
                executedActions             : this.getExecutedActionManager().getAllExecutedActions(),
                remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
                warEventManager             : this.getWarEventManager().serialize(),
                playerManager               : this.getPlayerManager().serialize(),
                turnManager                 : this.getTurnManager().serialize(),
                field                       : this.getField().serialize(),
            };
        }
        public serializeForValidation(): ISerialWar {
            const settingsForSrw        = Helpers.deepClone(this._getSettingsForSrw());
            settingsForSrw.totalScore   = this.calculateTotalScore();
            return {
                settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon(),
                settingsForSrw,

                warId                       : null,
                seedRandomInitialState      : Helpers.getExisted(this.getRandomNumberManager().getSeedRandomInitialState()),
                seedRandomCurrentState      : null,
                executedActions             : this.getExecutedActionManager().getAllExecutedActions(),
                remainingVotesForDraw       : null,
                warEventManager             : null,
                playerManager               : this.getPlayerManager().serialize(),
                turnManager                 : null,
                field                       : null,
            };
        }

        public getIsNeedExecutedAction(): boolean {
            return true;
        }
        public getIsNeedSeedRandom(): boolean {
            return true;
        }
        public getIsWarMenuPanelOpening(): boolean {
            return SpwWarMenuPanel.getIsOpening();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarType(): Types.WarType {
            return this.getCommonSettingManager().getSettingsHasFogByDefault()
                ? Types.WarType.SrwFog
                : Types.WarType.SrwStd;
        }

        public getMapId(): number {
            return Helpers.getExisted(this._getSettingsForSrw().mapId);
        }

        public getCanCheat(): boolean {
            return false;
        }

        public getSettingsBootTimerParams(): number[] {
            return [Types.BootTimerType.NoBoot];
        }

        private _setSettingsForSrw(settings: ISettingsForSrw): void {
            this._settingsForSrw = settings;
        }
        private _getSettingsForSrw(): ISettingsForSrw {
            return Helpers.getExisted(this._settingsForSrw);
        }

        public calculateTotalScore(): number {
            // TODO
            FloatText.show("SrwWar.calculateTotalScore() TODO!");
            return 0;
        }
    }
}

export default TwnsSrwWar;
