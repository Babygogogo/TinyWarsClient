
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;
    import GameConfig   = Config.GameConfig;
    import CoSkillType  = Types.CoSkillType;
    import WeaponType   = Types.WeaponType;

    type PlayerData = {
        coId            : number;
        coSkillType     : CoSkillType | null;
        unitType        : number;
        unitHp          : number;
        unitWeaponType  : WeaponType | null;
        hasPrimaryAmmo  : boolean;
        unitPromotion   : number;
        tileType        : number;
        towersCount     : number;
        offenseBonus    : number;
        upperLuck       : number;
        lowerLuck       : number;
        fund            : number;
        citiesCount     : number;
    };
    type CalculatorData = {
        gameConfig      : GameConfig;
        weatherType     : number;
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
    let _savedData: CalculatorData | null = null;

    export type OpenDataForCommonDamageCalculatorPanel = {
        war                     : BaseWar.BwWar | null;
        data                    : CalculatorData | null;
        needReviseWeaponType    : boolean;
    };
    export class CommonDamageCalculatorPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonDamageCalculatorPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _group!                : eui.Group;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _labelPlayer1!         : TwnsUiLabel.UiLabel;
        private readonly _btnSelect1!           : TwnsUiButton.UiButton;
        private readonly _labelPlayer2!         : TwnsUiLabel.UiLabel;
        private readonly _btnSelect2!           : TwnsUiButton.UiButton;

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
        private readonly _btnSaveState!         : TwnsUiButton.UiButton;
        private readonly _btnLoadState!         : TwnsUiButton.UiButton;

        private readonly _btnWeather!           : TwnsUiButton.UiButton;
        private readonly _labelWeather!         : TwnsUiLabel.UiLabel;

        private readonly _labelAttackTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelAttackDamage!    : TwnsUiLabel.UiLabel;

        private readonly _labelDefendTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelDefendDamage!    : TwnsUiLabel.UiLabel;

        private readonly _unitView1             = new WarMap.WarMapUnitView();
        private readonly _unitView2             = new WarMap.WarMapUnitView();
        private readonly _tileView1             = new MapEditor.MeTileSimpleView();
        private readonly _tileView2             = new MapEditor.MeTileSimpleView();

        private _calculatorData?                : CalculatorData;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnClose,                   callback: this.close },
                { ui: this._btnSelect1,                 callback: this._onTouchedBtnSelect1 },
                { ui: this._btnSelect2,                 callback: this._onTouchedBtnSelect2 },
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
                { ui: this._btnSaveState,               callback: this._onTouchedBtnSaveState },
                { ui: this._btnLoadState,               callback: this._onTouchedBtnLoadState },
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
            const openData          = this._getOpenData();
            const calculatorData    = openData.data;
            this._setCalculatorData(calculatorData ? cloneCalculatorData(calculatorData) : await createDefaultCalculatorData());
            if (openData.needReviseWeaponType) {
                this._reviseWeaponType();
            }

            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public static createDefaultPlayerData(gameConfig: GameConfig): PlayerData {
            const unitType = gameConfig.getFirstUnitType();
            return {
                coId            : CommonConstants.CoId.Empty,
                coSkillType     : CoSkillType.Passive,
                unitType,
                unitHp          : CommonConstants.UnitMaxHp,
                unitWeaponType  : WeaponType.Primary,
                unitPromotion   : 0,
                tileType        : Helpers.getExisted(gameConfig.getTileType(gameConfig.getDefaultTileBaseType(), CommonConstants.TileObjectType.Empty)),
                towersCount     : 0,
                offenseBonus    : 0,
                upperLuck       : CommonConstants.WarRuleLuckDefaultUpperLimit,
                lowerLuck       : CommonConstants.WarRuleLuckDefaultLowerLimit,
                hasPrimaryAmmo  : !!gameConfig.getUnitTemplateCfg(unitType)?.primaryWeaponMaxAmmo,
                fund            : 0,
                citiesCount     : 0,
            };
        }

        private _setCalculatorData(data: CalculatorData): void {
            this._calculatorData = data;
        }
        private _getCalculatorData(): CalculatorData {
            return Helpers.getExisted(this._calculatorData);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnSelect1(): void {
            const war = Helpers.getExisted(this._getOpenData().war);
            PanelHelpers.open(PanelHelpers.PanelDict.BwUnitListPanel, {
                war,
                callbackOnSelect    : unit => {
                    this._getCalculatorData().attackerData = this._createPlayerDataForUnit(unit);
                    this._reviseWeaponType();
                    this._updateView();
                    PanelHelpers.close(PanelHelpers.PanelDict.BwUnitListPanel);
                },
            });
        }
        private _onTouchedBtnSelect2(): void {
            const war = Helpers.getExisted(this._getOpenData().war);
            PanelHelpers.open(PanelHelpers.PanelDict.BwUnitListPanel, {
                war,
                callbackOnSelect    : unit => {
                    this._getCalculatorData().defenderData = this._createPlayerDataForUnit(unit);
                    this._reviseWeaponType();
                    this._updateView();
                    PanelHelpers.close(PanelHelpers.PanelDict.BwUnitListPanel);
                },
            });
        }
        private _createPlayerDataForUnit(attackerUnit: BaseWar.BwUnit): PlayerData {
            const attackerPlayerIndex   = attackerUnit.getPlayerIndex();
            const attackerPlayer        = attackerUnit.getPlayer();
            const attackerGridIndex     = attackerUnit.getGridIndex();
            const war                   = attackerUnit.getWar();
            const tileMap               = war.getTileMap();
            const gameConfig            = war.getGameConfig();
            const commonSettingsManager = war.getCommonSettingManager();
            const hasFog                = war.getFogMap().checkHasFogCurrently();
            const allTiles              = tileMap.getAllTiles();
            const allCities             = allTiles.filter(v => v.getType() === CommonConstants.TileType.City);
            const allCommandTowers      = allTiles.filter(v => v.getType() === CommonConstants.TileType.CommandTower);
            const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const canSeeHiddenInfo1     = (!hasFog) || (watcherTeamIndexes.has(attackerPlayer.getTeamIndex()));
            const getIsAffectedByCo1    = Helpers.createLazyFunc((): boolean => {
                if ((attackerUnit.getHasLoadedCo()) || (!gameConfig.getCoBasicCfg(attackerPlayer.getCoId())?.maxLoadCount)) {
                    return true;
                }

                const distance = GridIndexHelpers.getMinDistance(attackerGridIndex, attackerPlayer.getCoGridIndexListOnMap());
                return (distance != null) && (distance <= attackerPlayer.getCoZoneRadius());
            });
            return {
                coId            : attackerPlayer.getCoId(),
                coSkillType     : attackerPlayer.checkCoIsUsingActiveSkill()
                    ? attackerPlayer.getCoUsingSkillType()
                    : (getIsAffectedByCo1() ? Types.CoSkillType.Passive : null),
                unitType        : attackerUnit.getUnitType(),
                unitHp          : attackerUnit.getCurrentHp(),
                unitWeaponType  : null,
                unitPromotion   : attackerUnit.getCurrentPromotion(),
                tileType        : tileMap.getTile(attackerGridIndex).getType(),
                towersCount     : allCommandTowers.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length,
                offenseBonus    : commonSettingsManager.getSettingsAttackPowerModifier(attackerPlayerIndex),
                upperLuck       : commonSettingsManager.getSettingsLuckUpperLimit(attackerPlayerIndex),
                lowerLuck       : commonSettingsManager.getSettingsLuckLowerLimit(attackerPlayerIndex),
                hasPrimaryAmmo  : !!attackerUnit.getPrimaryWeaponCurrentAmmo(),
                fund            : canSeeHiddenInfo1 ? attackerPlayer.getFund() : 0,
                citiesCount     : canSeeHiddenInfo1 ? allCities.filter(v => v.getPlayerIndex() === attackerPlayerIndex).length : 0,
            };
        }

        private _onTouchedImgCo1(): void {
            this._handleTouchedImgCo(this._getCalculatorData().attackerData);
        }
        private _onTouchedImgCo2(): void {
            this._handleTouchedImgCo(this._getCalculatorData().defenderData);
        }
        private _handleTouchedImgCo(playerData: PlayerData): void {
            const gameConfig = this._getCalculatorData().gameConfig;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                gameConfig,
                currentCoId         : playerData.coId,
                availableCoIdArray  : gameConfig.getEnabledCoArray().map(v => v.coId),
                callbackOnConfirm   : coId => {
                    playerData.coId = coId;
                    this._updateView();
                },
            });

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedBtnSkill1(): void {
            this._handleTouchedBtnSkill(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnSkill2(): void {
            this._handleTouchedBtnSkill(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnSkill(playerData: PlayerData): void {
            playerData.coSkillType  = getNextCoSkillType(this._getCalculatorData().gameConfig, playerData.coId, playerData.coSkillType);
            this._updateView();
        }

        private _onTouchedBtnUnitView1(): void {
            this._handleTouchedConUnitView(this._getCalculatorData().attackerData, 1);
        }
        private _onTouchedBtnUnitView2(): void {
            this._handleTouchedConUnitView(this._getCalculatorData().defenderData, 2);
        }
        private _handleTouchedConUnitView(playerData: PlayerData, playerIndex: number): void {
            const gameConfig = this._getCalculatorData().gameConfig;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleUnitTypePanel, {
                gameConfig,
                currentUnitType : playerData.unitType,
                unitTypeArray   : gameConfig.getAllUnitTypeArray(),
                playerIndex,
                callback        : unitType => {
                    if (playerData.unitType !== unitType) {
                        playerData.unitType         = unitType;
                        playerData.hasPrimaryAmmo   = !!gameConfig.getUnitTemplateCfg(unitType)?.primaryWeaponMaxAmmo;

                        this._reviseWeaponType();
                        this._updateView();
                    }
                },
            });
        }
        private _reviseWeaponType(): void {
            const calculatorData    = this._getCalculatorData();
            const playerData1       = calculatorData.attackerData;
            const playerData2       = calculatorData.defenderData;
            this._doReviseWeaponType(playerData1, playerData2);
            this._doReviseWeaponType(playerData2, playerData1);
        }
        private _doReviseWeaponType(playerData1: PlayerData, playerData2: PlayerData): void {
            const gameConfig    = this._getCalculatorData().gameConfig;
            const armorType2    = Helpers.getExisted(gameConfig.getUnitTemplateCfg(playerData2.unitType)?.armorType);
            const damageCfg     = (gameConfig.getDamageChartCfgs(playerData1.unitType) ?? {})[armorType2];
            if ((damageCfg[Types.WeaponType.Primary].damage != null) && (playerData1.hasPrimaryAmmo)) {
                playerData1.unitWeaponType = Types.WeaponType.Primary;
            } else if (damageCfg[Types.WeaponType.Secondary].damage != null) {
                playerData1.unitWeaponType = Types.WeaponType.Secondary;
            } else {
                playerData1.unitWeaponType = null;
            }
        }

        private _onTouchedBtnTileView1(): void {
            this._handleTouchedConTileView(this._getCalculatorData().attackerData, 1);
        }
        private _onTouchedBtnTileView2(): void {
            this._handleTouchedConTileView(this._getCalculatorData().defenderData, 2);
        }
        private _handleTouchedConTileView(playerData: PlayerData, playerIndex: number): void {
            const gameConfig = this._getCalculatorData().gameConfig;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleTileTypePanel, {
                gameConfig,
                currentTileType : playerData.tileType,
                tileTypeArray   : gameConfig.getTileTypeArrayForUnattackable(),
                playerIndex,
                callback        : tileType => {
                    playerData.tileType = tileType;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnHp1(): void {
            this._handleTouchedBtnHp(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnHp2(): void {
            this._handleTouchedBtnHp(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnHp(playerData: PlayerData): void {
            const currValue     = playerData.unitHp;
            const minValue      = 1;
            const maxValue      = CommonConstants.UnitMaxHp;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0339),
                currentValue    : currValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : value => {
                    playerData.unitHp = value;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnWeapon1(): void {
            this._handleTouchedBtnWeapon(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnWeapon2(): void {
            this._handleTouchedBtnWeapon(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnWeapon(playerData: PlayerData): void {
            playerData.unitWeaponType   = getNextUnitWeaponType(this._getCalculatorData().gameConfig, playerData.unitType, playerData.unitWeaponType);
            this._updateView();
        }

        private _onTouchedBtnPromotion1(): void {
            this._handleTouchedBtnPromotion(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnPromotion2(): void {
            this._handleTouchedBtnPromotion(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnPromotion(playerData: PlayerData): void {
            const minValue              = 0;
            const maxValue              = this._getCalculatorData().gameConfig.getUnitMaxPromotion();
            const newValue              = playerData.unitPromotion + 1;
            playerData.unitPromotion    = newValue > maxValue ? minValue : newValue;
            this._updateView();
        }

        private _onTouchedBtnTower1(): void {
            this._handleTouchedBtnTower(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnTower2(): void {
            this._handleTouchedBtnTower(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnTower(playerData: PlayerData): void {
            const currValue     = playerData.towersCount;
            const minValue      = 0;
            const maxValue      = 999;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0833),
                currentValue    : currValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : value => {
                    playerData.towersCount = value;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnOffenseBonus1(): void {
            this._handleTouchedBtnOffenseBonus(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnOffenseBonus2(): void {
            this._handleTouchedBtnOffenseBonus(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnOffenseBonus(playerData: PlayerData): void {
            const currValue     = playerData.offenseBonus;
            const minValue      = -10000;
            const maxValue      = 10000;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0183),
                currentValue    : currValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : value => {
                    playerData.offenseBonus = value;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnUpperLuck1(): void {
            this._handleTouchedBtnUpperLuck(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnUpperLuck2(): void {
            this._handleTouchedBtnUpperLuck(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnUpperLuck(playerData: PlayerData): void {
            const currValue     = playerData.upperLuck;
            const minValue      = playerData.lowerLuck;
            const maxValue      = 10000;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0190),
                currentValue    : currValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : value => {
                    playerData.upperLuck = value;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnLowerLuck1(): void {
            this._handleTouchedBtnLowerLuck(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnLowerLuck2(): void {
            this._handleTouchedBtnLowerLuck(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnLowerLuck(playerData: PlayerData): void {
            const currValue     = playerData.lowerLuck;
            const minValue      = -10000;
            const maxValue      = playerData.upperLuck;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0189),
                currentValue    : currValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : value => {
                    playerData.lowerLuck = value;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnFund1(): void {
            this._handleTouchedBtnFund(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnFund2(): void {
            this._handleTouchedBtnFund(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnFund(playerData: PlayerData): void {
            const currValue     = playerData.fund;
            const minValue      = -10000000;
            const maxValue      = 10000000;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0032),
                currentValue    : currValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : value => {
                    playerData.fund = value;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnCity1(): void {
            this._handleTouchedBtnProperty(this._getCalculatorData().attackerData);
        }
        private _onTouchedBtnCity2(): void {
            this._handleTouchedBtnProperty(this._getCalculatorData().defenderData);
        }
        private _handleTouchedBtnProperty(playerData: PlayerData): void {
            const currValue     = playerData.citiesCount;
            const minValue      = 0;
            const maxValue      = 999;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0834),
                currentValue    : currValue,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : value => {
                    playerData.citiesCount = value;
                    this._updateView();
                },
            });
        }

        private _onTouchedBtnSwitchPlayer(): void {
            const data                              = this._getCalculatorData();
            [data.attackerData, data.defenderData]  = [data.defenderData, data.attackerData];
            this._updateView();
        }

        private _onTouchedBtnSaveState(): void {
            _savedData = cloneCalculatorData(this._getCalculatorData());

            FloatText.show(Lang.getText(LangTextType.A0288));
        }
        private _onTouchedBtnLoadState(): void {
            const savedData = _savedData;
            if (savedData == null) {
                FloatText.show(Lang.getText(LangTextType.A0289));
            } else {
                this._setCalculatorData(cloneCalculatorData(savedData));
                this._updateView();
            }
        }

        private _onTouchedBtnWeather(): void {
            const data          = this._getCalculatorData();
            const typeArray     = data.gameConfig.getAvailableWeatherTypes();
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

            const data                      = this._getCalculatorData();
            const attackerData              = data.attackerData;
            const defenderData              = data.defenderData;
            const gameConfig                = data.gameConfig;
            const canSelect                 = this._getOpenData().war != null;
            this._btnSelect1.visible        = canSelect;
            this._btnSelect2.visible        = canSelect;
            this._imgCo1.source             = gameConfig.getCoEyeImageSource(attackerData.coId, true) ?? CommonConstants.ErrorTextForUndefined;
            this._imgCo2.source             = gameConfig.getCoEyeImageSource(defenderData.coId, true) ?? CommonConstants.ErrorTextForUndefined;
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
            this._labelWeather.text         = Lang.getWeatherName(data.weatherType, gameConfig) ?? CommonConstants.ErrorTextForUndefined;
            this._unitView1.update(createUnitViewData(attackerData.unitType, 1, gameConfig));
            this._unitView2.update(createUnitViewData(defenderData.unitType, 2, gameConfig));
            this._tileView1.init(createTileViewData(attackerData.tileType, 1, gameConfig)).updateView();
            this._tileView2.init(createTileViewData(defenderData.tileType, 2, gameConfig)).updateView();

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
            this._btnSelect1.label          = Lang.getText(LangTextType.B0258);
            this._btnSelect2.label          = Lang.getText(LangTextType.B0258);
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
            this._btnSaveState.label        = Lang.getText(LangTextType.B0844);
            this._btnLoadState.label        = Lang.getText(LangTextType.B0845);
            this._btnWeather.label          = Lang.getText(LangTextType.B0705);
            this._labelAttackTitle.text     = `${Lang.getText(LangTextType.B0039)}:`;
            this._labelDefendTitle.text     = `${Lang.getText(LangTextType.B0837)}:`;
        }

        private _updateComponentsForDamage(): void {
            const calculatorData        = this._getCalculatorData();
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
                const normalizedHp  = WarHelpers.WarCommonHelpers.getNormalizedHp(unitHp);
                if (counterDamageDict.has(normalizedHp)) {
                    Helpers.getExisted(counterDamageDict.get(normalizedHp)).possibility += info.possibility;
                    continue;
                }

                const data                              = cloneCalculatorData(calculatorData);
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
    function cloneCalculatorData(data: CalculatorData): CalculatorData {
        return {
            gameConfig      : data.gameConfig,
            weatherType     : Helpers.deepClone(data.weatherType),
            attackerData    : Helpers.deepClone(data.attackerData),
            defenderData    : Helpers.deepClone(data.defenderData),
        };
    }

    async function createDefaultCalculatorData(): Promise<CalculatorData> {
        const gameConfig = await Config.ConfigManager.getLatestGameConfig();
        return {
            gameConfig,
            weatherType     : gameConfig.getDefaultWeatherType(),
            attackerData    : CommonDamageCalculatorPanel.createDefaultPlayerData(gameConfig),
            defenderData    : CommonDamageCalculatorPanel.createDefaultPlayerData(gameConfig),
        };
    }
    function getNextCoSkillType(gameConfig: GameConfig, coId: number, skillType: CoSkillType | null): CoSkillType | null {
        if (coId === CommonConstants.CoId.Empty) {
            return null;
        }

        const cfg = gameConfig.getCoBasicCfg(coId);
        if (skillType == null) {
            return CoSkillType.Passive;

        } else if (skillType === CoSkillType.Passive) {
            if (cfg?.powerSkills?.length) {
                return CoSkillType.Power;
            } else {
                return getNextCoSkillType(gameConfig, coId, CoSkillType.Power);
            }

        } else if (skillType === CoSkillType.Power) {
            if (cfg?.superPowerSkills?.length) {
                return CoSkillType.SuperPower;
            } else {
                return getNextCoSkillType(gameConfig, coId, CoSkillType.SuperPower);
            }

        } else {
            return null;
        }
    }
    function getNextUnitWeaponType(gameConfig: GameConfig, unitType: number, weaponType: WeaponType | null): WeaponType | null {
        const cfg = gameConfig.getUnitTemplateCfg(unitType);
        if (weaponType == null) {
            if (cfg?.primaryWeaponMaxAmmo != null) {
                return WeaponType.Primary;
            } else {
                return getNextUnitWeaponType(gameConfig, unitType, WeaponType.Primary);
            }

        } else if (weaponType === WeaponType.Primary) {
            if (gameConfig.checkHasSecondaryWeapon(unitType)) {
                return WeaponType.Secondary;
            } else {
                return getNextUnitWeaponType(gameConfig, unitType, WeaponType.Secondary);
            }

        } else {
            return null;
        }
    }
    function createUnitViewData(unitType: number, playerIndex: number, gameConfig: GameConfig): Types.WarMapUnitViewData {
        return {
            gridIndex   : { x: 0, y: 0 },
            unitType,
            playerIndex,
            gameConfig,
        };
    }
    function createTileViewData(tileType: number, playerIndex: number, gameConfig: GameConfig): MapEditor.TileViewData {
        const objectType    = Helpers.getExisted(gameConfig.getTileObjectTypeByTileType(tileType));
        const baseType      = Helpers.getExisted(gameConfig.getTileBaseTypeByTileType(tileType));
        return {
            tileBaseType        : baseType,
            tileBaseShapeId     : 0,
            tileDecoratorType   : null,
            tileDecoratorShapeId: null,
            tileObjectType      : objectType,
            tileObjectShapeId   : 0,
            playerIndex         : gameConfig.checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType: objectType }) ? playerIndex : CommonConstants.PlayerIndex.Neutral,
            gameConfig,
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
        const gameConfig        = calculatorData.gameConfig;
        const attackerData      = calculatorData.attackerData;
        const defenderData      = calculatorData.defenderData;
        const attackerUnitType  = attackerData.unitType;
        const defenderUnitType  = defenderData.unitType;
        const cfgAttackDamage   = getCfgDamage({ gameConfig, attackerUnitType, defenderUnitType, weaponType: attackerData.unitWeaponType });
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
        const gameConfig        = calculatorData.gameConfig;
        const attackerData      = calculatorData.attackerData;
        const defenderData      = calculatorData.defenderData;
        const attackerUnitType  = attackerData.unitType;
        const defenderUnitType  = defenderData.unitType;
        const cfgAttackDamage   = getCfgDamage({ gameConfig, attackerUnitType, defenderUnitType, weaponType: attackerData.unitWeaponType });
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

    function getCfgDamage({ gameConfig, attackerUnitType, defenderUnitType, weaponType }: {
        gameConfig          : GameConfig;
        attackerUnitType    : number;
        defenderUnitType    : number;
        weaponType          : WeaponType | null;
    }): Types.Undefinable<number> {
        if (weaponType == null) {
            return null;
        }

        const armorType = Helpers.getExisted(gameConfig.getUnitTemplateCfg(defenderUnitType)?.armorType);
        return Helpers.getExisted(gameConfig.getDamageChartCfgs(attackerUnitType))[armorType][weaponType].damage;
    }
    function getLuckLimitModifierByCo(calculatorData: CalculatorData): { lower: number, upper: number } {
        const gameConfig        = calculatorData.gameConfig;
        const attackerData      = calculatorData.attackerData;
        const attackerUnitType  = attackerData.unitType;
        let lowerModifier               = 0;
        let upperModifier               = 0;
        for (const skillId of getCoSkillIdArray(gameConfig, attackerData.coId, attackerData.coSkillType)) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            const bonusCfg = skillCfg?.selfLuckRangeBonus;
            if ((bonusCfg)                                                              &&
                (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, bonusCfg[1]))
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
    function getTileDefenseAmountForUnit(gameConfig: GameConfig, unitType: number, unitHp: number, tileType: number): number {
        const tileTemplateCfg = Helpers.getExisted(gameConfig.getTileTemplateCfg(tileType));
        return gameConfig.checkIsUnitTypeInCategory(unitType, tileTemplateCfg.defenseUnitCategory)
            ? tileTemplateCfg.defenseAmount * WarHelpers.WarCommonHelpers.getNormalizedHp(unitHp) / WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp)
            : 0;
    }
    function getCoSkillIdArray(gameConfig: GameConfig, coId: number, skillType: CoSkillType | null): number[] {
        if (skillType == null) {
            return [];
        } else {
            const cfg = gameConfig.getCoBasicCfg(coId);
            if (skillType === CoSkillType.Passive) {
                return cfg?.passiveSkills ?? [];
            } else if (skillType === CoSkillType.Power) {
                return cfg?.powerSkills ?? [];
            } else {
                return cfg?.superPowerSkills ?? [];
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
        if ((attackerCoId === CommonConstants.CoId.Empty) || (attackerCoSkillType == null)) {
            return 0;
        }

        const gameConfig                = calculatorData.gameConfig;
        const defenderData              = calculatorData.defenderData;
        const attackerUnitType          = attackerData.unitType;
        const attackerTileType          = attackerData.tileType;
        const attackerFund              = attackerData.fund;
        const attackerPromotion         = attackerData.unitPromotion;

        let modifier = 0;
        for (const skillId of getCoSkillIdArray(gameConfig, attackerCoId, attackerCoSkillType)) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            {
                const cfg = skillCfg?.selfOffenseBonus;
                if ((cfg)                                                               &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))    &&
                    (gameConfig.checkIsTileTypeInCategory(attackerTileType, cfg[2]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg?.attackBonusByPromotion;
                if ((cfg)                                                           &&
                    (cfg[2] === attackerPromotion)                                  &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg?.selfOffenseBonusByFund;
                if ((cfg)                                                           &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] * attackerFund / 10000;
                }
            }

            {
                const cfg = skillCfg?.selfOffenseBonusByTileCount;
                if ((cfg)                                                           &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))
                ) {
                    // TODO: 这里做了简化处理（因为只有kindle有这个技能），以后如果有类似的新技能，就需要完整实现地形计数逻辑
                    const modifierPerTile   = cfg[3];
                    modifier                += modifierPerTile * attackerData.citiesCount;
                }
            }

            {
                const cfg = skillCfg?.selfOffenseBonusByTileDefense;
                if ((cfg)                                                           &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] / 100 * Helpers.getExisted(gameConfig.getTileTemplateCfg(attackerTileType)?.defenseAmount);
                }
            }

            {
                const cfg = skillCfg?.selfOffenseBonusByEnemyTileDefense;
                if ((cfg)                                                           &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] / 100 * getTileDefenseAmountForUnit(gameConfig, defenderData.unitType, defenderData.unitHp, defenderData.tileType);
                }
            }

            {
                const cfg = skillCfg?.selfOffenseBonusByCounter;
                if ((cfg)                                                               &&
                    (isCounter)                                                         &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))
                ) {
                    modifier += cfg[2];
                }
            }
        }

        return modifier;
    }
    function getAttackModifierByWeather(calculatorData: CalculatorData): number {
        const gameConfig        = calculatorData.gameConfig;
        const weatherType       = calculatorData.weatherType;
        const offenseBonusCfg   = gameConfig.getWeatherCfg(weatherType)?.offenseBonus;
        if (offenseBonusCfg == null) {
            return 0;
        }

        const attackerData      = calculatorData.attackerData;
        const attackerUnitType  = attackerData.unitType;
        const attackerTileType  = attackerData.tileType;
        const modifier          = offenseBonusCfg[2];
        if ((!modifier)                                                                     ||
            (!gameConfig.checkIsUnitTypeInCategory(attackerUnitType, offenseBonusCfg[0]))   ||
            (!gameConfig.checkIsTileTypeInCategory(attackerTileType, offenseBonusCfg[1]))
        ) {
            return 0;
        }

        for (const skillId of getCoSkillIdArray(gameConfig, attackerData.coId, attackerData.coSkillType)) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.selfUnitIgnoreWeather;
            if ((cfg)                                                               &&
                (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))    &&
                (gameConfig.checkIsTileTypeInCategory(attackerTileType, cfg[2]))    &&
                (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg[3]))

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
        const gameConfig            = calculatorData.gameConfig;
        const attackerData          = calculatorData.attackerData;
        const amountFromPromotion   = gameConfig.getUnitPromotionAttackBonus(attackerData.unitPromotion);
        const amountFromWarRule     = attackerData.offenseBonus;
        const amountFromGlobalTiles = attackerData.towersCount * (gameConfig.getTileTemplateCfg(CommonConstants.TileType.CommandTower)?.globalAttackBonus ?? 0);
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
        if ((defenderCoId === CommonConstants.CoId.Empty) || (defenderCoSkillType == null)) {
            return 0;
        }

        const gameConfig        = calculatorData.gameConfig;
        const defenderUnitType  = defenderData.unitType;
        const defenderTileType  = defenderData.tileType;
        const defenderPromotion = defenderData.unitPromotion;
        let modifier            = 0;
        for (const skillId of getCoSkillIdArray(gameConfig, defenderCoId, defenderCoSkillType)) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            {
                const cfg = skillCfg?.selfDefenseBonus;
                if ((cfg)                                                               &&
                    (gameConfig.checkIsUnitTypeInCategory(defenderUnitType, cfg[1]))    &&
                    (gameConfig.checkIsTileTypeInCategory(defenderTileType, cfg[2]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg?.defenseBonusByPromotion;
                if ((cfg)                                                           &&
                    (cfg[2] === defenderPromotion)                                  &&
                    (gameConfig.checkIsUnitTypeInCategory(defenderUnitType, cfg[1]))
                ) {
                    modifier += cfg[3];
                }
            }

            {
                const cfg = skillCfg?.selfDefenseBonusByTileDefense;
                if ((cfg)                                                           &&
                    (gameConfig.checkIsUnitTypeInCategory(defenderUnitType, cfg[1]))
                ) {
                    modifier += cfg[2] / 100 * Helpers.getExisted(gameConfig.getTileTemplateCfg(defenderTileType)?.defenseAmount);
                }
            }
        }
        return modifier;
    }
    function getDefenseBonusMultiplier(calculatorData: CalculatorData): number {
        const gameConfig            = calculatorData.gameConfig;
        const defenderData          = calculatorData.defenderData;
        const amountFromTile        = getTileDefenseAmountForUnit(gameConfig, defenderData.unitType, defenderData.unitHp, defenderData.tileType);
        const amountFromPromotion   = gameConfig.getUnitPromotionDefenseBonus(defenderData.unitPromotion);
        const amountFromCo          = getDefenseModifierByCo(calculatorData);
        const amountFromGlobalTiles = defenderData.towersCount * (gameConfig.getTileTemplateCfg(CommonConstants.TileType.CommandTower)?.globalDefenseBonus ?? 0);

        return WarHelpers.WarDamageCalculator.getDamageMultiplierForDefenseBonus(amountFromTile + amountFromPromotion + amountFromCo + amountFromGlobalTiles);
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
            (WarHelpers.WarCommonHelpers.getNormalizedHp(attackerHp) / 10)     *
            defenseBonusMultiplier
        ));
    }
}

// export default TwnsCommonDamageCalculatorPanel;
