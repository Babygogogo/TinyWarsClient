
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwWeatherManager {
    import WeatherType              = Types.WeatherType;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import ISerialWeatherManager    = ProtoTypes.WarSerialization.ISerialWeatherManager;

    export class BwWeatherManager {
        private _forceWeatherType?      : WeatherType | null;
        private _expirePlayerIndex?     : number | null;
        private _expireTurnIndex?       : number | null;

        private _war?                   : TwnsBwWar.BwWar;

        public init(data: Types.Undefinable<ISerialWeatherManager>): void {
            this.setForceWeatherType(data?.forceWeatherType ?? null);
            this.setExpireTurnIndex(data?.expireTurnIndex ?? null);
            this.setExpirePlayerIndex(data?.expirePlayerIndex ?? null);
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

        public startRunning(war: TwnsBwWar.BwWar): void {
            this._setWar(war);
        }

        private _setWar(war: TwnsBwWar.BwWar): void {
            this._war = war;
        }
        private _getWar(): TwnsBwWar.BwWar {
            return Helpers.getExisted(this._war, ClientErrorCode.BwWeatherManager_GetWar_00);
        }

        public getDefaultWeatherType(): WeatherType {
            return this._getWar().getCommonSettingManager().getSettingsDefaultWeatherType();
        }
        public getCurrentWeatherType(): WeatherType {
            return this.getForceWeatherType() ?? this.getDefaultWeatherType();
        }

        public setForceWeatherType(type: WeatherType | null): void {
            if (this._forceWeatherType !== type) {
                this._forceWeatherType = type;
                Notify.dispatch(TwnsNotifyType.NotifyType.BwForceWeatherTypeChanged);
            }
        }
        public getForceWeatherType(): WeatherType | null {
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
    }
}
