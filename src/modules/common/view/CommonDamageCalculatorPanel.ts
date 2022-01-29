
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCommonDamageCalculatorPanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import CoSkillType  = Types.CoSkillType;
    import UnitType     = Types.UnitType;
    import TileType     = Types.TileType;
    import WeaponType   = Types.WeaponType;
    import WeatherType  = Types.WeatherType;

    type PlayerData = {
        coId            : number;
        coSkillType     : CoSkillType | null;
        unitType        : UnitType;
        unitHp          : number;
        unitWeaponType  : WeaponType | null;
        unitPromotion   : number;
        tileType        : TileType;
        towersCount     : number;
        offenseBonus    : number;
        upperLuck       : number;
        lowerLuck       : number;
        fund            : number;
        citiesCount     : number;
    };
    type CalculatorData = {
        configVersion   : string;
        weatherType     : WeatherType;
        attackerData    : PlayerData;
        defenderData    : PlayerData;
    };
    type DamageInfo = {
        damage      : number;
        times       : number;
        possibility : number;
    };
    type DamageRange = {
        minDamage   : number;
        maxDamage   : number;
    };
    export type OpenData = {
        data    : CalculatorData | null;
    };
    export class CommonDamageCalculatorPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _labelPlayer1!         : TwnsUiLabel.UiLabel;
        private readonly _labelPlayer2!         : TwnsUiLabel.UiLabel;

        private readonly _imgCo1!               : TwnsUiImage.UiImage;
        private readonly _imgCo2!               : TwnsUiImage.UiImage;
        private readonly _btnSkill1!            : TwnsUiButton.UiButton;
        private readonly _btnSkill2!            : TwnsUiButton.UiButton;

        private readonly _conTileView1!         : eui.Group;
        private readonly _conTileView2!         : eui.Group;
        private readonly _btnTileView1!         : TwnsUiButton.UiButton;
        private readonly _btnTileView2!         : TwnsUiButton.UiButton;

        private readonly _conUnitView1!         : eui.Group;
        private readonly _conUnitView2!         : eui.Group;
        private readonly _btnUnitView1!         : TwnsUiButton.UiButton;
        private readonly _btnUnitView2!         : TwnsUiButton.UiButton;

        private readonly _btnHp1!               : TwnsUiButton.UiButton;
        private readonly _btnHp2!               : TwnsUiButton.UiButton;
        private readonly _labelHp1!             : TwnsUiLabel.UiLabel;
        private readonly _labelHp2!             : TwnsUiLabel.UiLabel;

        private readonly _btnWeapon1!           : TwnsUiButton.UiButton;
        private readonly _btnWeapon2!           : TwnsUiButton.UiButton;
        private readonly _labelWeapon1!         : TwnsUiLabel.UiLabel;
        private readonly _labelWeapon2!         : TwnsUiLabel.UiLabel;

        private readonly _btnPromotion1!        : TwnsUiButton.UiButton;
        private readonly _btnPromotion2!        : TwnsUiButton.UiButton;
        private readonly _labelPromotion1!      : TwnsUiLabel.UiLabel;
        private readonly _labelPromotion2!      : TwnsUiLabel.UiLabel;

        private readonly _btnTower1!            : TwnsUiButton.UiButton;
        private readonly _btnTower2!            : TwnsUiButton.UiButton;
        private readonly _labelTower1!          : TwnsUiLabel.UiLabel;
        private readonly _labelTower2!          : TwnsUiLabel.UiLabel;

        private readonly _btnOffenseBonus1!     : TwnsUiButton.UiButton;
        private readonly _btnOffenseBonus2!     : TwnsUiButton.UiButton;
        private readonly _labelOffenseBonus1!   : TwnsUiLabel.UiLabel;
        private readonly _labelOffenseBonus2!   : TwnsUiLabel.UiLabel;

        private readonly _btnUpperLuck1!        : TwnsUiButton.UiButton;
        private readonly _btnUpperLuck2!        : TwnsUiButton.UiButton;
        private readonly _labelUpperLuck1!      : TwnsUiLabel.UiLabel;
        private readonly _labelUpperLuck2!      : TwnsUiLabel.UiLabel;

        private readonly _btnLowerLuck1!        : TwnsUiButton.UiButton;
        private readonly _btnLowerLuck2!        : TwnsUiButton.UiButton;
        private readonly _labelLowerLuck1!      : TwnsUiLabel.UiLabel;
        private readonly _labelLowerLuck2!      : TwnsUiLabel.UiLabel;

        private readonly _btnFund1!             : TwnsUiButton.UiButton;
        private readonly _btnFund2!             : TwnsUiButton.UiButton;
        private readonly _labelFund1!           : TwnsUiLabel.UiLabel;
        private readonly _labelFund2!           : TwnsUiLabel.UiLabel;

        private readonly _btnCity1!             : TwnsUiButton.UiButton;
        private readonly _btnCity2!             : TwnsUiButton.UiButton;
        private readonly _labelCity1!           : TwnsUiLabel.UiLabel;
        private readonly _labelCity2!           : TwnsUiLabel.UiLabel;

        private readonly _btnSwitchPlayer!      : TwnsUiButton.UiButton;

        private readonly _btnWeather!           : TwnsUiButton.UiButton;
        private readonly _labelWeather!         : TwnsUiLabel.UiLabel;

        private readonly _labelAttackTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelAttackDamage!    : TwnsUiLabel.UiLabel;

        private readonly _labelDefendTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelDefendDamage!    : TwnsUiLabel.UiLabel;

        private readonly _unitView1             = new TwnsWarMapUnitView.WarMapUnitView();
        private readonly _unitView2             = new TwnsWarMapUnitView.WarMapUnitView();
        private readonly _tileView1             = new TwnsMeTileSimpleView.MeTileSimpleView();
        private readonly _tileView2             = new TwnsMeTileSimpleView.MeTileSimpleView();

        private _calculatorData                 : CalculatorData = createDefaultCalculatorData();

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,                   callback: this.close },
                { ui: this._imgCo1,                     callback: this._onTouchedImgCo1, },
                { ui: this._imgCo2,                     callback: this._onTouchedImgCo2, },
                { ui: this._btnSkill1,                  callback: this._onTouchedBtnSkill1 },
                { ui: this._btnSkill2,                  callback: this._onTouchedBtnSkill2 },
                { ui: this._btnUnitView1,               callback: this._onTouchedBtnUnitView1 },
                { ui: this._btnUnitView2,               callback: this._onTouchedBtnUnitView2 },
                { ui: this._btnTileView1,               callback: this._onTouchedBtnTileView1 },
                { ui: this._btnTileView2,               callback: this._onTouchedBtnTileView2 },
                { ui: this._btnHp1,                     callback: this._onTouchedBtnHp1 },
                { ui: this._btnHp2,                     callback: this._onTouchedBtnHp2 },
                { ui: this._btnWeapon1,                 callback: this._onTouchedBtnWeapon1 },
                { ui: this._btnWeapon2,                 callback: this._onTouchedBtnWeapon2 },
                { ui: this._btnPromotion1,              callback: this._onTouchedBtnPromotion1 },
                { ui: this._btnPromotion2,              callback: this._onTouchedBtnPromotion2 },
                { ui: this._btnTower1,                  callback: this._onTouchedBtnTower1 },
                { ui: this._btnTower2,                  callback: this._onTouchedBtnTower2 },
                { ui: this._btnOffenseBonus1,           callback: this._onTouchedBtnOffenseBonus1 },
                { ui: this._btnOffenseBonus2,           callback: this._onTouchedBtnOffenseBonus2 },
                { ui: this._btnUpperLuck1,              callback: this._onTouchedBtnUpperLuck1 },
                { ui: this._btnUpperLuck2,              callback: this._onTouchedBtnUpperLuck2 },
                { ui: this._btnLowerLuck1,              callback: this._onTouchedBtnLowerLuck1 },
                { ui: this._btnLowerLuck2,              callback: this._onTouchedBtnLowerLuck2 },
                { ui: this._btnFund1,                   callback: this._onTouchedBtnFund1 },
                { ui: this._btnFund2,                   callback: this._onTouchedBtnFund2 },
                { ui: this._btnCity1,                   callback: this._onTouchedBtnCity1 },
                { ui: this._btnCity2,                   callback: this._onTouchedBtnCity2 },
                { ui: this._btnSwitchPlayer,            callback: this._onTouchedBtnSwitchPlayer },
                { ui: this._btnWeather,                 callback: this._onTouchedBtnWeather },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
            ]);

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._imgCo1.touchEnabled = true;
            this._imgCo2.touchEnabled = true;
            this._conUnitView1.addChild(this._unitView1);
            this._conUnitView2.addChild(this._unitView2);

            {
                const conTileView   = this._conTileView1;
                const tileView      = this._tileView1;
                conTileView.addChild(tileView.getImgBase());
                conTileView.addChild(tileView.getImgDecorator());
                conTileView.addChild(tileView.getImgObject());
            }

            {
                const conTileView   = this._conTileView2;
                const tileView      = this._tileView2;
                conTileView.addChild(tileView.getImgBase());
                conTileView.addChild(tileView.getImgDecorator());
                conTileView.addChild(tileView.getImgObject());
            }
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._calculatorData = Helpers.deepClone(this._getOpenData().data) ?? createDefaultCalculatorData();
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedImgCo1(): void {
            this._handleTouchedImgCo(this._calculatorData.attackerData);
        }
        private _onTouchedImgCo2(): void {
            this._handleTouchedImgCo(this._calculatorData.defenderData);
        }
        private _handleTouchedImgCo(playerData: PlayerData): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCoPanel, {
                currentCoId         : playerData.coId,
                availableCoIdArray  : ConfigManager.getEnabledCoArray(this._calculatorData.configVersion).map(v => v.coId),
                callbackOnConfirm   : coId => {
                    playerData.coId = coId;
                    this._updateView();
                },
            });

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedBtnSkill1(): void {
            this._handleTouchedBtnSkill(this._calculatorData.attackerData);
        }
        private _onTouchedBtnSkill2(): void {
            this._handleTouchedBtnSkill(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnSkill(playerData: PlayerData): void {
            playerData.coSkillType  = getNextCoSkillType(this._calculatorData.configVersion, playerData.coId, playerData.coSkillType);
            this._updateView();
        }

        private _onTouchedBtnUnitView1(): void {
            this._handleTouchedConUnitView(this._calculatorData.attackerData, 1);
        }
        private _onTouchedBtnUnitView2(): void {
            this._handleTouchedConUnitView(this._calculatorData.defenderData, 2);
        }
        private _handleTouchedConUnitView(playerData: PlayerData, playerIndex: number): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseSingleUnitTypePanel, {
                currentUnitType : playerData.unitType,
                unitTypeArray   : ConfigManager.getUnitTypesByCategory(this._calculatorData.configVersion, Types.UnitCategory.All),
                playerIndex,
                callback        : unitType => {
                    playerData.unitType = unitType;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnTileView1(): void {
            this._handleTouchedConTileView(this._calculatorData.attackerData, 1);
        }
        private _onTouchedBtnTileView2(): void {
            this._handleTouchedConTileView(this._calculatorData.defenderData, 2);
        }
        private _handleTouchedConTileView(playerData: PlayerData, playerIndex: number): void {
            const configVersion         = this._calculatorData.configVersion;
            const destroyableTileTypes  = ConfigManager.getTileTypesByCategory(configVersion, Types.TileCategory.Destroyable);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseSingleTileTypePanel, {
                currentTileType : Types.TileType.Plain,
                tileTypeArray   : ConfigManager.getTileTypesByCategory(configVersion, Types.TileCategory.All).filter(v => destroyableTileTypes.indexOf(v) < 0),
                playerIndex,
                callback        : tileType => {
                    playerData.tileType = tileType;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnHp1(): void {
            this._handleTouchedBtnHp(this._calculatorData.attackerData);
        }
        private _onTouchedBtnHp2(): void {
            this._handleTouchedBtnHp(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnHp(playerData: PlayerData): void {
            const currValue     = playerData.unitHp;
            const minValue      = 1;
            const maxValue      = CommonConstants.UnitMaxHp;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0339),
                currentValue    : "" + currValue,
                maxChars        : 3,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        playerData.unitHp = value;
                        this._updateView();
                    }
                },
            });
        }

        private _onTouchedBtnWeapon1(): void {
            this._handleTouchedBtnWeapon(this._calculatorData.attackerData);
        }
        private _onTouchedBtnWeapon2(): void {
            this._handleTouchedBtnWeapon(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnWeapon(playerData: PlayerData): void {
            playerData.unitWeaponType   = getNextUnitWeaponType(this._calculatorData.configVersion, playerData.unitType, playerData.unitWeaponType);
            this._updateView();
        }

        private _onTouchedBtnPromotion1(): void {
            this._handleTouchedBtnPromotion(this._calculatorData.attackerData);
        }
        private _onTouchedBtnPromotion2(): void {
            this._handleTouchedBtnPromotion(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnPromotion(playerData: PlayerData): void {
            const minValue              = 0;
            const maxValue              = ConfigManager.getUnitMaxPromotion(this._calculatorData.configVersion);
            const newValue              = playerData.unitPromotion + 1;
            playerData.unitPromotion    = newValue > maxValue ? minValue : newValue;
            this._updateView();
        }

        private _onTouchedBtnTower1(): void {
            this._handleTouchedBtnTower(this._calculatorData.attackerData);
        }
        private _onTouchedBtnTower2(): void {
            this._handleTouchedBtnTower(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnTower(playerData: PlayerData): void {
            const currValue     = playerData.towersCount;
            const minValue      = 0;
            const maxValue      = 999;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0833),
                currentValue    : "" + currValue,
                maxChars        : 3,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        playerData.towersCount = value;
                        this._updateView();
                    }
                },
            });
        }

        private _onTouchedBtnOffenseBonus1(): void {
            this._handleTouchedBtnOffenseBonus(this._calculatorData.attackerData);
        }
        private _onTouchedBtnOffenseBonus2(): void {
            this._handleTouchedBtnOffenseBonus(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnOffenseBonus(playerData: PlayerData): void {
            const currValue     = playerData.offenseBonus;
            const minValue      = -10000;
            const maxValue      = 10000;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0183),
                currentValue    : "" + currValue,
                maxChars        : 6,
                charRestrict    : "0-9//-",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        playerData.offenseBonus = value;
                        this._updateView();
                    }
                },
            });
        }

        private _onTouchedBtnUpperLuck1(): void {
            this._handleTouchedBtnUpperLuck(this._calculatorData.attackerData);
        }
        private _onTouchedBtnUpperLuck2(): void {
            this._handleTouchedBtnUpperLuck(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnUpperLuck(playerData: PlayerData): void {
            const currValue     = playerData.upperLuck;
            const minValue      = playerData.lowerLuck;
            const maxValue      = 10000;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0190),
                currentValue    : "" + currValue,
                maxChars        : 6,
                charRestrict    : "0-9//-",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        playerData.upperLuck = value;
                        this._updateView();
                    }
                },
            });
        }

        private _onTouchedBtnLowerLuck1(): void {
            this._handleTouchedBtnLowerLuck(this._calculatorData.attackerData);
        }
        private _onTouchedBtnLowerLuck2(): void {
            this._handleTouchedBtnLowerLuck(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnLowerLuck(playerData: PlayerData): void {
            const currValue     = playerData.lowerLuck;
            const minValue      = -10000;
            const maxValue      = playerData.upperLuck;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0189),
                currentValue    : "" + currValue,
                maxChars        : 6,
                charRestrict    : "0-9//-",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        playerData.lowerLuck = value;
                        this._updateView();
                    }
                },
            });
        }

        private _onTouchedBtnFund1(): void {
            this._handleTouchedBtnFund(this._calculatorData.attackerData);
        }
        private _onTouchedBtnFund2(): void {
            this._handleTouchedBtnFund(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnFund(playerData: PlayerData): void {
            const currValue     = playerData.fund;
            const minValue      = -10000000;
            const maxValue      = 10000000;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0032),
                currentValue    : "" + currValue,
                maxChars        : 9,
                charRestrict    : "0-9//-",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        playerData.fund = value;
                        this._updateView();
                    }
                },
            });
        }

        private _onTouchedBtnCity1(): void {
            this._handleTouchedBtnProperty(this._calculatorData.attackerData);
        }
        private _onTouchedBtnCity2(): void {
            this._handleTouchedBtnProperty(this._calculatorData.defenderData);
        }
        private _handleTouchedBtnProperty(playerData: PlayerData): void {
            const currValue     = playerData.citiesCount;
            const minValue      = 0;
            const maxValue      = 999;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0834),
                currentValue    : "" + currValue,
                maxChars        : 3,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(LangTextType.A0098));
                    } else {
                        playerData.citiesCount = value;
                        this._updateView();
                    }
                },
            });
        }

        private _onTouchedBtnSwitchPlayer(): void {
            const data                              = this._calculatorData;
            [data.attackerData, data.defenderData]  = [data.defenderData, data.attackerData];
            this._updateView();
        }

        private _onTouchedBtnWeather(): void {
            const data          = this._calculatorData;
            const typeArray     = ConfigManager.getAvailableWeatherTypes(data.configVersion);
            data.weatherType    = typeArray[(typeArray.indexOf(data.weatherType) + 1) % typeArray.length];
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAnimationTick(): void {
            const tickCount = Timer.getUnitAnimationTickCount();
            this._unitView1.updateOnAnimationTick(tickCount);
            this._unitView2.updateOnAnimationTick(tickCount);
        }
        private _onNotifyTileAnimationTick(): void {
            this._tileView1.updateOnAnimationTick();
            this._tileView2.updateOnAnimationTick();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const data                      = this._calculatorData;
            const attackerData              = data.attackerData;
            const defenderData              = data.defenderData;
            const configVersion             = data.configVersion;
            this._imgCo1.source             = ConfigManager.getCoEyeImageSource(configVersion, attackerData.coId, true);
            this._imgCo2.source             = ConfigManager.getCoEyeImageSource(configVersion, defenderData.coId, true);
            this._labelHp1.text             = `${attackerData.unitHp}`;
            this._labelHp2.text             = `${defenderData.unitHp}`;
            this._labelPromotion1.text      = `${attackerData.unitPromotion}`;
            this._labelPromotion2.text      = `${defenderData.unitPromotion}`;
            this._labelTower1.text          = `${attackerData.towersCount}`;
            this._labelTower2.text          = `${defenderData.towersCount}`;
            this._labelOffenseBonus1.text   = `${attackerData.offenseBonus}`;
            this._labelOffenseBonus2.text   = `${defenderData.offenseBonus}`;
            this._labelUpperLuck1.text      = `${attackerData.upperLuck}`;
            this._labelUpperLuck2.text      = `${defenderData.upperLuck}`;
            this._labelLowerLuck1.text      = `${attackerData.lowerLuck}`;
            this._labelLowerLuck2.text      = `${defenderData.lowerLuck}`;
            this._labelFund1.text           = `${attackerData.fund}`;
            this._labelFund2.text           = `${defenderData.fund}`;
            this._labelCity1.text           = `${attackerData.citiesCount}`;
            this._labelCity2.text           = `${defenderData.citiesCount}`;
            this._labelWeapon1.text         = getWeaponTypeName(attackerData.unitWeaponType);
            this._labelWeapon2.text         = getWeaponTypeName(defenderData.unitWeaponType);
            this._labelWeather.text         = Lang.getWeatherName(data.weatherType);
            this._unitView1.update(createUnitViewData(attackerData.unitType, 1));
            this._unitView2.update(createUnitViewData(defenderData.unitType, 2));
            this._tileView1.init(createTileViewData(attackerData.tileType, 1)).updateView();
            this._tileView2.init(createTileViewData(defenderData.tileType, 2)).updateView();

            {
                const coSkillType1      = attackerData.coSkillType;
                const coSkillType2      = defenderData.coSkillType;
                this._btnSkill1.label   = coSkillType1 == null ? Lang.getText(LangTextType.B0829) : (Lang.getCoSkillTypeName(coSkillType1) ?? CommonConstants.ErrorTextForUndefined);
                this._btnSkill2.label   = coSkillType2 == null ? Lang.getText(LangTextType.B0829) : (Lang.getCoSkillTypeName(coSkillType2) ?? CommonConstants.ErrorTextForUndefined);
            }

            this._updateComponentsForDamage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(LangTextType.B0828);
            this._labelPlayer1.text         = Lang.getText(LangTextType.B0831);
            this._labelPlayer2.text         = Lang.getText(LangTextType.B0832);
            this._btnHp1.label              = Lang.getText(LangTextType.B0339);
            this._btnHp2.label              = Lang.getText(LangTextType.B0339);
            this._btnWeapon1.label          = Lang.getText(LangTextType.B0830);
            this._btnWeapon2.label          = Lang.getText(LangTextType.B0830);
            this._btnPromotion1.label       = Lang.getText(LangTextType.B0370);
            this._btnPromotion2.label       = Lang.getText(LangTextType.B0370);
            this._btnTower1.label           = Lang.getText(LangTextType.B0833);
            this._btnTower2.label           = Lang.getText(LangTextType.B0833);
            this._btnOffenseBonus1.label    = Lang.getText(LangTextType.B0183);
            this._btnOffenseBonus2.label    = Lang.getText(LangTextType.B0183);
            this._btnUpperLuck1.label       = Lang.getText(LangTextType.B0190);
            this._btnUpperLuck2.label       = Lang.getText(LangTextType.B0190);
            this._btnLowerLuck1.label       = Lang.getText(LangTextType.B0189);
            this._btnLowerLuck2.label       = Lang.getText(LangTextType.B0189);
            this._btnFund1.label            = Lang.getText(LangTextType.B0032);
            this._btnFund2.label            = Lang.getText(LangTextType.B0032);
            this._btnCity1.label            = Lang.getText(LangTextType.B0834);
            this._btnCity2.label            = Lang.getText(LangTextType.B0834);
            this._btnSwitchPlayer.label     = Lang.getText(LangTextType.B0835);
            this._btnWeather.label          = Lang.getText(LangTextType.B0705);
            this._labelAttackTitle.text     = `${Lang.getText(LangTextType.B0039)}:`;
            this._labelDefendTitle.text     = `${Lang.getText(LangTextType.B0837)}:`;
        }

        private _updateComponentsForDamage(): void {
            const calculatorData        = this._calculatorData;
            const attackDamageInfoArray = getAttackDamageInfoArray(calculatorData, false);
            const labelAttackDamage     = this._labelAttackDamage;
            if (!attackDamageInfoArray.length) {
                labelAttackDamage.text = Lang.getText(LangTextType.B0836);
            } else {
                labelAttackDamage.text = `${attackDamageInfoArray[0].damage} ~ ${attackDamageInfoArray[attackDamageInfoArray.length - 1].damage}`;
            }

            const revisedAttackDamageInfoArray: DamageInfo[] = attackDamageInfoArray.length
                ? attackDamageInfoArray
                : [{
                    damage      : 0,
                    times       : 1,
                    possibility : 1,
                }];
            const counterDamageDict = new Map<number, { range: DamageRange | null, possibility: number }>();
            for (const info of revisedAttackDamageInfoArray) {
                const unitHp        = Math.max(calculatorData.defenderData.unitHp - info.damage, 0);
                const normalizedHp  = WarCommonHelpers.getNormalizedHp(unitHp);
                if (counterDamageDict.has(normalizedHp)) {
                    Helpers.getExisted(counterDamageDict.get(normalizedHp)).possibility += info.possibility;
                    continue;
                }

                const data                              = Helpers.deepClone(calculatorData);
                [data.attackerData, data.defenderData]  = [data.defenderData, data.attackerData];
                data.attackerData.unitHp                = unitHp;
                counterDamageDict.set(normalizedHp, {
                    range       : getAttackDamageRange(data, true),
                    possibility : info.possibility,
                });
            }
            const textArray: string[] = [];
            for (const [normalizedHp, info] of counterDamageDict) {
                const range                 = info.range;
                const textForPossibility    = `(${Helpers.formatString(`%.2f`, info.possibility * 100)}%)`;
                if (range == null) {
                    textArray.push(`@${normalizedHp}HP${textForPossibility}: ${Lang.getText(LangTextType.B0836)}`);
                } else {
                    textArray.push(`@${normalizedHp}HP${textForPossibility}: ${range.minDamage} ~ ${range.maxDamage}`);
                }
            }
            this._labelDefendDamage.text = textArray.join(`\n`);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: -40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function createDefaultCalculatorData(): CalculatorData {
        return {
            configVersion   : Helpers.getExisted(ConfigManager.getLatestConfigVersion()),
            weatherType     : WeatherType.Clear,
            attackerData    : createDefaultPlayerData(),
            defenderData    : createDefaultPlayerData(),
        };
    }
    function createDefaultPlayerData(): PlayerData {
        return {
            coId            : CommonConstants.CoEmptyId,
            coSkillType     : CoSkillType.Passive,
            unitType        : UnitType.Tank,
            unitHp          : CommonConstants.UnitMaxHp,
            unitWeaponType  : WeaponType.Primary,
            unitPromotion   : 0,
            tileType        : TileType.Plain,
            towersCount     : 0,
            offenseBonus    : 0,
            upperLuck       : CommonConstants.WarRuleLuckDefaultUpperLimit,
            lowerLuck       : CommonConstants.WarRuleLuckDefaultLowerLimit,
            fund            : 0,
            citiesCount : 0,
        };
    }
    function getNextCoSkillType(configVersion: string, coId: number, skillType: CoSkillType | null): CoSkillType | null {
        if (coId === CommonConstants.CoEmptyId) {
            return null;
        }

        const cfg = ConfigManager.getCoBasicCfg(configVersion, coId);
        if (skillType == null) {
            return CoSkillType.Passive;

        } else if (skillType === CoSkillType.Passive) {
            if (cfg.powerSkills?.length) {
                return CoSkillType.Power;
            } else {
                return getNextCoSkillType(configVersion, coId, CoSkillType.Power);
            }

        } else if (skillType === CoSkillType.Power) {
            if (cfg.superPowerSkills?.length) {
                return CoSkillType.SuperPower;
            } else {
                return getNextCoSkillType(configVersion, coId, CoSkillType.SuperPower);
            }

        } else {
            return null;
        }
    }
    function getNextUnitWeaponType(configVersion: string, unitType: UnitType, weaponType: WeaponType | null): WeaponType | null {
        const cfg = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
        if (weaponType == null) {
            if (cfg.primaryWeaponMaxAmmo != null) {
                return WeaponType.Primary;
            } else {
                return getNextUnitWeaponType(configVersion, unitType, WeaponType.Primary);
            }

        } else if (weaponType === WeaponType.Primary) {
            if (ConfigManager.checkHasSecondaryWeapon(configVersion, unitType)) {
                return WeaponType.Secondary;
            } else {
                return getNextUnitWeaponType(configVersion, unitType, WeaponType.Secondary);
            }

        } else {
            return null;
        }
    }
    function createUnitViewData(unitType: UnitType, playerIndex: number): Types.WarMapUnitViewData {
        return {
            gridIndex   : { x: 0, y: 0 },
            unitType,
            playerIndex,
        };
    }
    function createTileViewData(tileType: TileType, playerIndex: number): TwnsMeTileSimpleView.TileViewData {
        const objectType    = ConfigManager.getTileObjectTypeByTileType(tileType);
        const baseType      = ConfigManager.getTileBaseTypeByTileType(tileType);
        return {
            tileBaseType        : baseType,
            tileBaseShapeId     : 0,
            tileDecoratorType   : null,
            tileDecoratorShapeId: null,
            tileObjectType      : objectType,
            tileObjectShapeId   : 0,
            playerIndex         : ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType) ? playerIndex : CommonConstants.WarNeutralPlayerIndex,
        };
    }

    function getWeaponTypeName(weaponType: WeaponType | null): string {
        if (weaponType == null) {
            return Lang.getText(LangTextType.B0001);
        } else {
            return Lang.getText(weaponType === WeaponType.Primary ? LangTextType.B0692 : LangTextType.B0693);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function getAttackDamageInfoArray(calculatorData: CalculatorData, isCounter: boolean): DamageInfo[] {
        const configVersion     = calculatorData.configVersion;
        const attackerData      = calculatorData.attackerData;
        const defenderData      = calculatorData.defenderData;
        const attackerUnitType  = attackerData.unitType;
        const defenderUnitType  = defenderData.unitType;
        const cfgAttackDamage   = getCfgDamage({ configVersion, attackerUnitType, defenderUnitType, weaponType: attackerData.unitWeaponType });
        if (cfgAttackDamage == null) {
            return [];
        }

        const damageInfoArray   : DamageInfo[] = [];
        const attackerLuckLimit = getAttackerLuckLimit(calculatorData);
        for (let luckValue = attackerLuckLimit.lower; luckValue <= attackerLuckLimit.upper; ++luckValue) {
            const damage    = getAttackDamage({ luckValue, isCounter, calculatorData, cfgAttackDamage });
            const info      = damageInfoArray.find(v => v.damage === damage);
            if (info) {
                ++info.times;
            } else {
                damageInfoArray.push({
                    damage,
                    times       : 1,
                    possibility : 0,
                });
            }
        }

        const totalTimes = attackerLuckLimit.upper - attackerLuckLimit.lower + 1;
        for (const info of damageInfoArray) {
            info.possibility = info.times / totalTimes;
        }

        return damageInfoArray.sort((v1, v2) => (v1.damage - v2.damage));
    }
    function getAttackDamageRange(calculatorData: CalculatorData, isCounter: boolean): DamageRange | null {
        const configVersion     = calculatorData.configVersion;
        const attackerData      = calculatorData.attackerData;
        const defenderData      = calculatorData.defenderData;
        const attackerUnitType  = attackerData.unitType;
        const defenderUnitType  = defenderData.unitType;
        const cfgAttackDamage   = getCfgDamage({ configVersion, attackerUnitType, defenderUnitType, weaponType: attackerData.unitWeaponType });
        if (cfgAttackDamage == null) {
            return null;
        }

        const attackerLuckLimit = getAttackerLuckLimit(calculatorData);
        return {
            minDamage   : getAttackDamage({
                luckValue       : attackerLuckLimit.lower,
                isCounter,
                calculatorData,
                cfgAttackDamage,
            }),
            maxDamage   : getAttackDamage({
                luckValue       : attackerLuckLimit.upper,
                isCounter,
                calculatorData,
                cfgAttackDamage,
            }),
        };
    }

    function getCfgDamage({ configVersion, attackerUnitType, defenderUnitType, weaponType }: {
        configVersion       : string;
        attackerUnitType    : UnitType;
        defenderUnitType    : UnitType;
        weaponType          : WeaponType | null;
    }): Types.Undefinable<number> {
        if (weaponType == null) {
            return null;
        }

        const armorType = Helpers.getExisted(ConfigManager.getUnitTemplateCfg(configVersion, defenderUnitType).armorType);
        return ConfigManager.getDamageChartCfgs(configVersion, attackerUnitType)[armorType][weaponType].damage;
    }
    function getLuckLimitModifierByCo(calculatorData: CalculatorData): { lower: number, upper: number } {
        const configVersion     = calculatorData.configVersion;
        const attackerData      = calculatorData.attackerData;
        const attackerUnitType  = attackerData.unitType;
        let lowerModifier               = 0;
        let upperModifier               = 0;
        for (const skillId of getCoSkillIdArray(configVersion, attackerData.coId, attackerData.coSkillType)) {
            const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
            const bonusCfg = skillCfg.selfLuckRangeBonus;
            if ((bonusCfg)                                                                      &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, bonusCfg[1]))
            ) {
                lowerModifier += bonusCfg[2];
                upperModifier += bonusCfg[3];
            }
        }

        return {
            lower   : lowerModifier,
            upper   : upperModifier,
        };
    }
    function getAttackerLuckLimit(calculatorData: CalculatorData): { lower: number, upper: number } {
        const attackerData  = calculatorData.attackerData;
        const limitFromCo   = getLuckLimitModifierByCo(calculatorData);
        return {
            lower   : attackerData.lowerLuck + limitFromCo.lower,
            upper   : attackerData.upperLuck + limitFromCo.upper,
        };
    }
    function getTileDefenseAmountForUnit(configVersion: string, unitType: UnitType, unitHp: number, tileType: TileType): number {
        const tileTemplateCfg = ConfigManager.getTileTemplateCfgByType(configVersion, tileType);
        return ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, tileTemplateCfg.defenseUnitCategory)
            ? tileTemplateCfg.defenseAmount * WarCommonHelpers.getNormalizedHp(unitHp) / WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp)
            : 0;
    }
    function getCoSkillIdArray(configVersion: string, coId: number, skillType: CoSkillType | null): number[] {
        if (skillType == null) {
            return [];
        } else {
            const cfg = ConfigManager.getCoBasicCfg(configVersion, coId);
            if (skillType === CoSkillType.Passive) {
                return cfg.passiveSkills ?? [];
            } else if (skillType === CoSkillType.Power) {
                return cfg.powerSkills ?? [];
            } else {
                return cfg.superPowerSkills ?? [];
            }
        }
    }
    function getAttackModifierByCo({ isCounter, calculatorData }: {
        isCounter       : boolean;
        calculatorData  : CalculatorData;
    }): number {
        const attackerData          = calculatorData.attackerData;
        const attackerCoId          = attackerData.coId;
        const attackerCoSkillType   = attackerData.coSkillType;
        if ((attackerCoId === CommonConstants.CoEmptyId) || (attackerCoSkillType == null)) {
            return 0;
        }

        const configVersion             = calculatorData.configVersion;
        const defenderData              = calculatorData.defenderData;
        const attackerUnitType          = attackerData.unitType;
        const attackerTileType          = attackerData.tileType;
        const attackerFund              = attackerData.fund;
        const attackerPromotion         = attackerData.unitPromotion;
        const attackerTileCountDict     = new Map<Types.TileCategory, number>([
            [Types.TileCategory.City, attackerData.citiesCount],
        ]);

        let modifier = 0;
        for (const skillId of getCoSkillIdArray(configVersion, attackerCoId, attackerCoSkillType)) {
            const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
            {
                const cfg = skillCfg.selfOffenseBonus;
                if ((cfg)                                                                               &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))  &&
                    (ConfigManager.checkIsTileTypeInCategory(configVersion, attackerTileType, cfg[2]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg.attackBonusByPromotion;
                if ((cfg)                                                                               &&
                    (cfg[2] === attackerPromotion)                                                      &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg.selfOffenseBonusByFund;
                if ((cfg)                                                                               &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] * attackerFund / 10000;
                }
            }

            {
                const cfg = skillCfg.selfOffenseBonusByTileCount;
                if ((cfg)                                                                               &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                ) {
                    const tileCategory      : Types.TileCategory = cfg[2];
                    const modifierPerTile   = cfg[3];
                    const currentTileCount  = attackerTileCountDict.get(tileCategory) ?? 0;
                    modifier                += modifierPerTile * currentTileCount;
                }
            }

            {
                const cfg = skillCfg.selfOffenseBonusByTileDefense;
                if ((cfg)                                                                               &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] / 100 * ConfigManager.getTileTemplateCfgByType(configVersion, attackerTileType).defenseAmount;
                }
            }

            {
                const cfg = skillCfg.selfOffenseBonusByEnemyTileDefense;
                if ((cfg)                                                                               &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] / 100 * getTileDefenseAmountForUnit(configVersion, defenderData.unitType, defenderData.unitHp, defenderData.tileType);
                }
            }

            {
                const cfg = skillCfg.selfOffenseBonusByCounter;
                if ((cfg)                                                                               &&
                    (isCounter)                                                                         &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2];
                }
            }
        }

        return modifier;
    }
    function getAttackModifierByWeather(calculatorData: CalculatorData): number {
        const configVersion     = calculatorData.configVersion;
        const weatherType       = calculatorData.weatherType;
        const offenseBonusCfg   = ConfigManager.getWeatherCfg(configVersion, weatherType).offenseBonus;
        if (offenseBonusCfg == null) {
            return 0;
        }

        const attackerData      = calculatorData.attackerData;
        const attackerUnitType  = attackerData.unitType;
        const attackerTileType  = attackerData.tileType;
        const modifier          = offenseBonusCfg[2];
        if ((!modifier)                                                                                     ||
            (!ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, offenseBonusCfg[0])) ||
            (!ConfigManager.checkIsTileTypeInCategory(configVersion, attackerTileType, offenseBonusCfg[1]))
        ) {
            return 0;
        }

        for (const skillId of getCoSkillIdArray(configVersion, attackerData.coId, attackerData.coSkillType)) {
            const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).selfUnitIgnoreWeather;
            if ((cfg)                                                                               &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))  &&
                (ConfigManager.checkIsTileTypeInCategory(configVersion, attackerTileType, cfg[2]))  &&
                (ConfigManager.checkIsWeatherTypeInCategory(configVersion, weatherType, cfg[3]))

            ) {
                return 0;
            }
        }

        return modifier;
    }
    function getAttackBonusMultiplier({ isCounter, calculatorData }: {
        isCounter           : boolean;
        calculatorData      : CalculatorData;
    }): number {
        const configVersion         = calculatorData.configVersion;
        const attackerData          = calculatorData.attackerData;
        const amountFromPromotion   = ConfigManager.getUnitPromotionAttackBonus(configVersion, attackerData.unitPromotion);
        const amountFromWarRule     = attackerData.offenseBonus;
        const amountFromGlobalTiles = attackerData.towersCount * (ConfigManager.getTileTemplateCfgByType(configVersion, TileType.CommandTower).globalAttackBonus ?? 0);
        const amountFromCo          = getAttackModifierByCo({ isCounter, calculatorData });

        const totalAmount = amountFromWarRule
            + amountFromPromotion
            + amountFromCo
            + getAttackModifierByWeather(calculatorData)
            + amountFromGlobalTiles;
        return Math.max(1 + totalAmount / 100, 0);
    }
    function getDefenseModifierByCo(calculatorData: CalculatorData): number {
        const defenderData          = calculatorData.defenderData;
        const defenderCoId          = defenderData.coId;
        const defenderCoSkillType   = defenderData.coSkillType;
        if ((defenderCoId === CommonConstants.CoEmptyId) || (defenderCoSkillType == null)) {
            return 0;
        }

        const configVersion         = calculatorData.configVersion;
        const defenderUnitType      = defenderData.unitType;
        const defenderTileType      = defenderData.tileType;
        const defenderPromotion     = defenderData.unitPromotion;
        let modifier = 0;
        for (const skillId of getCoSkillIdArray(configVersion, defenderCoId, defenderCoSkillType)) {
            const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
            {
                const cfg = skillCfg.selfDefenseBonus;
                if ((cfg)                                                                           &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, defenderUnitType, cfg[1]))      &&
                    (ConfigManager.checkIsTileTypeInCategory(configVersion, defenderTileType, cfg[2]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg.defenseBonusByPromotion;
                if ((cfg)                                                                       &&
                    (cfg[2] === defenderPromotion)                                                      &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, defenderUnitType, cfg[1]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg.selfDefenseBonusByTileDefense;
                if ((cfg)                                                                           &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, defenderUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] / 100 * ConfigManager.getTileTemplateCfgByType(configVersion, defenderTileType).defenseAmount;
                }
            }
        }
        return modifier;
    }
    function getDefenseBonusMultiplier(calculatorData: CalculatorData): number {
        const configVersion         = calculatorData.configVersion;
        const defenderData          = calculatorData.defenderData;
        const defenderTileType      = defenderData.tileType;
        const amountFromTile        = getTileDefenseAmountForUnit(configVersion, defenderData.unitType, defenderData.unitHp, defenderTileType);
        const amountFromPromotion   = ConfigManager.getUnitPromotionDefenseBonus(configVersion, defenderData.unitPromotion);
        const amountFromCo          = getDefenseModifierByCo(calculatorData);
        const amountFromGlobalTiles = defenderData.towersCount * (ConfigManager.getTileTemplateCfgByType(configVersion, defenderTileType).globalDefenseBonus ?? 0);

        return WarDamageCalculator.getDamageMultiplierForDefenseBonus(amountFromTile + amountFromPromotion + amountFromCo + amountFromGlobalTiles);
    }
    function getAttackDamage({ luckValue, isCounter, calculatorData, cfgAttackDamage }: {
        luckValue           : number;
        isCounter           : boolean;
        calculatorData      : CalculatorData;
        cfgAttackDamage     : number;
    }): number {
        const attackerData  = calculatorData.attackerData;
        const attackerHp    = attackerData.unitHp;
        if (attackerHp <= 0) {
            return 0;
        }

        const attackBonusMultiplier     = getAttackBonusMultiplier({ isCounter, calculatorData });
        const defenseBonusMultiplier    = getDefenseBonusMultiplier(calculatorData);
        return Math.max(0, Math.floor(0.000001 +
            (cfgAttackDamage * attackBonusMultiplier + luckValue)   *
            (WarCommonHelpers.getNormalizedHp(attackerHp) / 10)     *
            defenseBonusMultiplier
        ));
    }
}

// export default TwnsCommonDamageCalculatorPanel;
