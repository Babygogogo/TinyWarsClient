
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import WeatherType              = Twns.Types.WeatherType;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import ISerialWeatherManager    = CommonProto.WarSerialization.ISerialWeatherManager;

    export class BwWeatherManager {
        private _forceWeatherType?      : WeatherType | null;
        private _expirePlayerIndex?     : number | null;
        private _expireTurnIndex?       : number | null;
        private _war?                   : Twns.BaseWar.BwWar;

        private readonly _view = new Twns.BaseWar.BwWeatherManagerView();

        public init(data: Twns.Types.Undefinable<ISerialWeatherManager>): void {
            this.setForceWeatherType(data?.forceWeatherType ?? null);
            this.setExpireTurnIndex(data?.expireTurnIndex ?? null);
            this.setExpirePlayerIndex(data?.expirePlayerIndex ?? null);

            this.getView().init(this);
        }
        public fastInit(data: Twns.Types.Undefinable<ISerialWeatherManager>): void {
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

        public startRunning(war: Twns.BaseWar.BwWar): void {
            this._setWar(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
        }

        private _setWar(war: Twns.BaseWar.BwWar): void {
            this._war = war;
        }
        private _getWar(): Twns.BaseWar.BwWar {
            return Twns.Helpers.getExisted(this._war, ClientErrorCode.BwWeatherManager_GetWar_00);
        }

        public getView(): Twns.BaseWar.BwWeatherManagerView {
            return this._view;
        }

        public getDefaultWeatherType(): WeatherType {
            return this._getWar().getCommonSettingManager().getSettingsDefaultWeatherType();
        }
        public getCurrentWeatherType(): WeatherType {
            return this.getForceWeatherType() ?? this.getDefaultWeatherType();
        }
        public getCurrentWeatherCfg(): Twns.Types.WeatherCfg {
            return Twns.Helpers.getExisted(this._getWar().getGameConfig().getWeatherCfg(this.getCurrentWeatherType()));
        }

        public setForceWeatherType(type: WeatherType | null): void {
            if (this._forceWeatherType !== type) {
                this._forceWeatherType = type;
                Twns.Notify.dispatch(Twns.Notify.NotifyType.BwForceWeatherTypeChanged);
            }
        }
        public getForceWeatherType(): WeatherType | null {
            return Twns.Helpers.getDefined(this._forceWeatherType, ClientErrorCode.BwWeatherManager_GetForceWeatherType_00);
        }

        public setExpirePlayerIndex(playerIndex: number | null): void {
            this._expirePlayerIndex = playerIndex;
        }
        public getExpirePlayerIndex(): number | null {
            return Twns.Helpers.getDefined(this._expirePlayerIndex, ClientErrorCode.BwWeatherManager_GetExpirePlayerIndex_00);
        }

        public setExpireTurnIndex(turnIndex: number | null): void {
            this._expireTurnIndex = turnIndex;
        }
        public getExpireTurnIndex(): number | null {
            return Twns.Helpers.getDefined(this._expireTurnIndex, ClientErrorCode.BwWeatherManager_GetExpireTurnIndex_00);
        }

        public updateOnPlayerTurnSwitched(): void {
            const expireTurnIndex   = this.getExpireTurnIndex();
            const expirePlayerIndex = this.getExpirePlayerIndex();
            if ((expireTurnIndex == null) || (expirePlayerIndex == null)) {
                return;
            }

            const turnManager       = this._getWar().getTurnManager();
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
            const expireTurnIndex = this.getExpireTurnIndex();
            const currentWeatherName = Lang.getWeatherName(this.getCurrentWeatherType());
            const defaultWeatherName = Lang.getWeatherName(this.getDefaultWeatherType());
            if (expireTurnIndex == null) {
                return `${Lang.getFormattedText(LangTextType.F0073, currentWeatherName, defaultWeatherName)}`
                    + `\n\n${Lang.getText(LangTextType.R0009)}`;
            } else {
                const war           = this._getWar();
                const turnManager   = war.getTurnManager();
                return `${Lang.getFormattedText(LangTextType.F0073, currentWeatherName, defaultWeatherName)}`
                    + `\n${Lang.getFormattedText(LangTextType.F0074, expireTurnIndex, this.getExpirePlayerIndex(), turnManager.getTurnIndex(), turnManager.getPlayerIndexInTurn())}`
                    + `\n\n${Lang.getText(LangTextType.R0009)}`;
            }
        }
    }
}
