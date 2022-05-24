
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import LangTextType             = Lang.LangTextType;
    import ISerialWeatherManager    = CommonProto.WarSerialization.ISerialWeatherManager;

    export class BwWeatherManager {
        private _forceWeatherType?      : number | null;
        private _expirePlayerIndex?     : number | null;
        private _expireTurnIndex?       : number | null;
        private _war?                   : BaseWar.BwWar;

        private readonly _view = new BaseWar.BwWeatherManagerView();

        public init(data: Types.Undefinable<ISerialWeatherManager>): void {
            this.setForceWeatherType(data?.forceWeatherType ?? null);
            this.setExpireTurnIndex(data?.expireTurnIndex ?? null);
            this.setExpirePlayerIndex(data?.expirePlayerIndex ?? null);

            this.getView().init(this);
        }
        public fastInit(data: Types.Undefinable<ISerialWeatherManager>): void {
            this.init(data);
        }

        public serialize(): ISerialWeatherManager {
            return {
                forceWeatherType    : this.getForceWeatherType(),
                expireTurnIndex     : this.getExpireTurnIndex(),
                expirePlayerIndex   : this.getExpirePlayerIndex(),
            };
        }
        public serializeForCreateMfr(): ISerialWeatherManager {
            return this.serialize();
        }
        public serializeForCreateSfw(): ISerialWeatherManager {
            return this.serialize();
        }

        public startRunning(war: BaseWar.BwWar): void {
            this._setWar(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
        }

        private _setWar(war: BaseWar.BwWar): void {
            this._war = war;
        }
        public getWar(): BaseWar.BwWar {
            return Helpers.getExisted(this._war, ClientErrorCode.BwWeatherManager_GetWar_00);
        }

        public getView(): BaseWar.BwWeatherManagerView {
            return this._view;
        }

        public getDefaultWeatherType(): number {
            return this.getWar().getCommonSettingManager().getSettingsDefaultWeatherType();
        }
        public getCurrentWeatherType(): number {
            return this.getForceWeatherType() ?? this.getDefaultWeatherType();
        }
        public getCurrentWeatherCfg(): Types.WeatherCfg {
            return Helpers.getExisted(this.getWar().getGameConfig().getWeatherCfg(this.getCurrentWeatherType()));
        }

        public setForceWeatherType(type: number | null): void {
            if (this._forceWeatherType !== type) {
                this._forceWeatherType = type;
                Notify.dispatch(Notify.NotifyType.BwForceWeatherTypeChanged);
            }
        }
        public getForceWeatherType(): number | null {
            return Helpers.getDefined(this._forceWeatherType, ClientErrorCode.BwWeatherManager_GetForceWeatherType_00);
        }

        public setExpirePlayerIndex(playerIndex: number | null): void {
            this._expirePlayerIndex = playerIndex;
        }
        public getExpirePlayerIndex(): number | null {
            return Helpers.getDefined(this._expirePlayerIndex, ClientErrorCode.BwWeatherManager_GetExpirePlayerIndex_00);
        }

        public setExpireTurnIndex(turnIndex: number | null): void {
            this._expireTurnIndex = turnIndex;
        }
        public getExpireTurnIndex(): number | null {
            return Helpers.getDefined(this._expireTurnIndex, ClientErrorCode.BwWeatherManager_GetExpireTurnIndex_00);
        }

        public updateOnPlayerTurnSwitched(): void {
            const expireTurnIndex   = this.getExpireTurnIndex();
            const expirePlayerIndex = this.getExpirePlayerIndex();
            if ((expireTurnIndex == null) || (expirePlayerIndex == null)) {
                return;
            }

            const turnManager       = this.getWar().getTurnManager();
            const currentTurnIndex  = turnManager.getTurnIndex();
            if ((expireTurnIndex < currentTurnIndex)                                                                ||
                (expireTurnIndex === currentTurnIndex) && (expirePlayerIndex <= turnManager.getPlayerIndexInTurn())
            ) {
                this.setForceWeatherType(null);
                this.setExpireTurnIndex(null);
                this.setExpirePlayerIndex(null);
            }
        }

        public getDesc(): string {
            const war               = this.getWar();
            const gameConfig        = war.getGameConfig();
            const expireTurnIndex   = this.getExpireTurnIndex();
            const currentWeatherName = Lang.getWeatherName(this.getCurrentWeatherType(), gameConfig);
            const defaultWeatherName = Lang.getWeatherName(this.getDefaultWeatherType(), gameConfig);
            if (expireTurnIndex == null) {
                return `${Lang.getFormattedText(LangTextType.F0073, currentWeatherName, defaultWeatherName)}`
                    + `\n\n${Lang.getText(LangTextType.R0009)}`;
            } else {
                const turnManager   = war.getTurnManager();
                return `${Lang.getFormattedText(LangTextType.F0073, currentWeatherName, defaultWeatherName)}`
                    + `\n${Lang.getFormattedText(LangTextType.F0074, expireTurnIndex, this.getExpirePlayerIndex(), turnManager.getTurnIndex(), turnManager.getPlayerIndexInTurn())}`
                    + `\n\n${Lang.getText(LangTextType.R0009)}`;
            }
        }
    }
}
