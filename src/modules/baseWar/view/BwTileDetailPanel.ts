
// import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Timer                    from "../../tools/helpers/Timer";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsWarMapUnitView       from "../../warMap/view/WarMapUnitView";
// import TwnsBwTile               from "../model/BwTile";
// import TwnsBwWar                from "../model/BwWar";
// import TwnsBwTileView           from "./BwTileView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import BwTile           = BaseWar.BwTile;
    import LangTextType     = Lang.LangTextType;
    import NotifyType       = Notify.NotifyType;
    import GameConfig       = Config.GameConfig;
    import TileInfoType     = Types.TileInfoType;

    export type OpenDataForBwTileDetailPanel = {
        tile    : BwTile;
    };
    export class BwTileDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForBwTileDetailPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;
        private readonly _labelName1!       : TwnsUiLabel.UiLabel;
        private readonly _conTileView!      : eui.Group;
        private readonly _listInfo!         : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        private readonly _groupMoveCost!    : eui.Group;
        private readonly _labelMoveCost!    : TwnsUiLabel.UiLabel;
        private readonly _listMoveCost!     : TwnsUiScrollList.UiScrollList<DataForMoveCostRenderer>;

        private readonly _groupDamageChart! : eui.Group;
        private readonly _labelDamageChart! : TwnsUiLabel.UiLabel;
        private readonly _labelMain1!       : TwnsUiLabel.UiLabel;
        private readonly _labelSub1!        : TwnsUiLabel.UiLabel;
        private readonly _labelMain2!       : TwnsUiLabel.UiLabel;
        private readonly _labelSub2!        : TwnsUiLabel.UiLabel;
        private readonly _listDamageChart!  : TwnsUiScrollList.UiScrollList<DataForDamageRenderer>;

        private readonly _btnTilesInfo!     : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _tileView          = new BaseWar.BwTileView();

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateChanged,     callback: this._onNotifyBwPlannerStateChanged },
                { type: NotifyType.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
                { type: NotifyType.BwTileIsHighlightedChanged,      callback: this._onNotifyTileIsHighlightedChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnTilesInfo,                           callback: this._onTouchedBtnTilesInfo },
                { ui: this._btnClose,                               callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listInfo.setItemRenderer(InfoRenderer);
            this._listMoveCost.setItemRenderer(MoveCostRenderer);
            this._listDamageChart.setItemRenderer(DamageRenderer);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
            conTileView.addChild(tileView.getImgHighlight());
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            this._conTileView.removeChildren();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwPlannerStateChanged(): void {
            // this.close();
        }
        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateView();
        }
        private _onNotifyTileIsHighlightedChanged(): void {
            this._updateTileView();
        }

        private _onTouchedBtnTilesInfo(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonTileChartPanel, {
                gameConfig  : this._getOpenData().tile.getGameConfig(),
            });
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateLabelName();
            this._updateTileView();
            this._updateListInfo();
            this._updateGroupMoveCost();
            this._updateGroupDamageChart();
        }

        private _updateComponentsForLanguage(): void {
            this._labelMoveCost.text        = Lang.getText(LangTextType.B0351);
            this._labelDamageChart.text     = Lang.getText(LangTextType.B0334);
            this._labelMain1.text           = Lang.getText(LangTextType.B0692);
            this._labelSub1.text            = Lang.getText(LangTextType.B0693);
            this._labelMain2.text           = Lang.getText(LangTextType.B0692);
            this._labelSub2.text            = Lang.getText(LangTextType.B0693);
            this._btnTilesInfo.label        = Lang.getText(LangTextType.B0910);
            this._btnClose.label            = Lang.getText(LangTextType.B0204);
        }

        private _updateLabelName(): void {
            const data              = this._getOpenData();
            const tile              = data.tile;
            const tileType          = tile.getType();
            const gameConfig        = tile.getGameConfig();
            this._labelName.text    = Lang.getTileName(tileType, gameConfig) ?? CommonConstants.ErrorTextForUndefined;
            this._labelName1.text   = Lang.getTileName(tileType, gameConfig, Lang.getCurrentLanguageType() === Types.LanguageType.Chinese ? Types.LanguageType.English : Types.LanguageType.Chinese) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _updateTileView(): void {
            const tile      = this._getOpenData().tile;
            const tileView  = this._tileView;
            tileView.setData({
                gameConfig  : tile.getGameConfig(),
                tileData    : tile.serialize(),
                hasFog      : tile.getHasFog(),
                skinId      : tile.getSkinId(),
                themeType   : tile.getTileThemeType(),
            });
            tileView.updateView();
        }

        private _updateListInfo(): void {
            const openData  = this._getOpenData();
            const tile      = openData.tile;
            const war       = tile.getWar();
            const dataArray : DataForInfoRenderer[] = Helpers.getNonNullElements([
                createInfoDefenseBonus(war, tile),
                createInfoIncome(war, tile),
                createInfoVision(war, tile),
                createInfoHideUnitCategory(war, tile),
                createInfoIsDefeatOnCapture(war, tile),
                createInfoProduceUnitCategory(war, tile),
                createInfoGlobalBonus(war, tile),
                createInfoRepairUnitCategory(war, tile),
                createInfoHp(war, tile),
                createInfoCapturePoint(war, tile),
                createInfoBuildPoint(war, tile),
                createInfoIsHighlighted(war, tile),
                createInfoCrystalRadius(war, tile),
                createInfoCrystalPriority(war, tile),
                createInfoCrystalCanAffectSelf(war, tile),
                createInfoCrystalCanAffectAlly(war, tile),
                createInfoCrystalCanAffectEnemy(war, tile),
                createInfoCrystalDeltaFund(war, tile),
                createInfoCrystalDeltaEnergyPercentage(war, tile),
                createInfoCrystalDeltaHp(war, tile),
                createInfoCrystalDeltaFuelPercentage(war, tile),
                createInfoCrystalDeltaPrimaryAmmoPercentage(war, tile),
                createInfoCannonRangeForUp(war, tile),
                createInfoCannonRangeForRight(war, tile),
                createInfoCannonRangeForDown(war, tile),
                createInfoCannonRangeForLeft(war, tile),
                createInfoCannonPriority(war, tile),
                createInfoCannonMaxTargetCount(war, tile),
                createInfoCannonCanAffectSelf(war, tile),
                createInfoCannonCanAffectAlly(war, tile),
                createInfoCannonCanAffectEnemy(war, tile),
                createInfoCannonDeltaHp(war, tile),
                createInfoCannonDeltaFuelPercentage(war, tile),
                createInfoCannonDeltaPrimaryAmmoPercentage(war, tile),
                createInfoLaserTurretRangeForUp(war, tile),
                createInfoLaserTurretRangeForRight(war, tile),
                createInfoLaserTurretRangeForDown(war, tile),
                createInfoLaserTurretRangeForLeft(war, tile),
                createInfoLaserTurretPriority(war, tile),
                createInfoLaserTurretCanAffectSelf(war, tile),
                createInfoLaserTurretCanAffectAlly(war, tile),
                createInfoLaserTurretCanAffectEnemy(war, tile),
                createInfoLaserTurretDeltaHp(war, tile),
                createInfoLaserTurretDeltaFuelPercentage(war, tile),
                createInfoLaserTurretDeltaPrimaryAmmoPercentage(war, tile),
            ]);

            let index = 0;
            for (const data of dataArray) {
                data.index = index++;
            }
            this._listInfo.bindData(dataArray);
        }

        private _updateGroupMoveCost(): void {
            const group = this._groupMoveCost;
            if (this._getOpenData().tile.getMaxHp() != null) {
                group.visible = false;
            } else {
                group.visible = true;
                this._listMoveCost.bindData(this._createDataForListMoveCost());
            }
        }

        private _updateGroupDamageChart(): void {
            const group = this._groupDamageChart;
            if (this._getOpenData().tile.getMaxHp() == null) {
                group.visible = false;
            } else {
                group.visible = true;
                this._listDamageChart.bindData(this._createDataForListDamageChart());
            }
        }

        private _createDataForListMoveCost(): DataForMoveCostRenderer[] {
            const openData      = this._getOpenData();
            const tile          = openData.tile;
            const gameConfig    = tile.getGameConfig();
            const tileCfg       = Helpers.getExisted(gameConfig.getTileTemplateCfgByType(tile.getType()));
            const playerIndex   = tile.getPlayerIndex() || 1;

            const dataArray : DataForMoveCostRenderer[] = [];
            let index       = 0;
            for (const unitType of gameConfig.getAllUnitTypeArray()) {
                dataArray.push({
                    index,
                    gameConfig,
                    unitType,
                    tileCfg,
                    playerIndex,
                });
                ++index;
            }

            return dataArray.sort(sorterForDataForList);
        }

        private _createDataForListDamageChart(): DataForDamageRenderer[] {
            const tile              = this._getOpenData().tile;
            const gameConfig        = tile.getGameConfig();
            const targetTileType    = tile.getType();
            const playerIndex       = CommonConstants.WarFirstPlayerIndex;

            const dataArray : DataForDamageRenderer[] = [];
            let index       = 0;
            for (const attackerUnitType of gameConfig.getAllUnitTypeArray()) {
                dataArray.push({
                    gameConfig,
                    index,
                    targetTileType,
                    attackerUnitType,
                    playerIndex,
                });
                ++index;
            }

            return dataArray;
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
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
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    function sorterForDataForList(a: DataForMoveCostRenderer, b: DataForMoveCostRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForInfoRenderer = {
        index       : number;
        infoType    : TileInfoType;
        tile        : BwTile;
        war         : BaseWar.BwWar;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelValue!       : TwnsUiLabel.UiLabel;
        private readonly _groupExtra!       : eui.Group;
        private readonly _labelExtraInfo!   : TwnsUiLabel.UiLabel;
        private readonly _imgModify!        : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this,                         callback: this._onTouchedSelf },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedSelf(): void {
            const infoType = this._getData().infoType;
            if      (infoType === TileInfoType.DefenseBonus)                            { this._modifyAsDefenseBonus(); }
            else if (infoType === TileInfoType.Income)                                  { this._modifyAsIncome(); }
            else if (infoType === TileInfoType.Vision)                                  { this._modifyAsVision(); }
            else if (infoType === TileInfoType.HideUnitCategory)                        { this._modifyAsHideUnitCategory(); }
            else if (infoType === TileInfoType.IsDefeatedOnCapture)                     { this._modifyAsIsDefeatedOnCapture(); }
            else if (infoType === TileInfoType.ProduceUnitCategory)                     { this._modifyAsProduceUnitCategory(); }
            else if (infoType === TileInfoType.GlobalBonus)                             { this._modifyAsGlobalBonus(); }
            else if (infoType === TileInfoType.RepairUnitCategory)                      { this._modifyAsRepairUnitCategory(); }
            else if (infoType === TileInfoType.Hp)                                      { this._modifyAsHp(); }
            else if (infoType === TileInfoType.CapturePoint)                            { this._modifyAsCapturePoint(); }
            else if (infoType === TileInfoType.BuildPoint)                              { this._modifyAsBuildPoint(); }
            else if (infoType === TileInfoType.IsHighlighted)                           { this._modifyAsIsHighlighted(); }
            else if (infoType === TileInfoType.CrystalRadius)                           { this._modifyAsCrystalRadius(); }
            else if (infoType === TileInfoType.CrystalPriority)                         { this._modifyAsCrystalPriority(); }
            else if (infoType === TileInfoType.CrystalCanAffectSelf)                    { this._modifyAsCrystalCanAffectSelf(); }
            else if (infoType === TileInfoType.CrystalCanAffectAlly)                    { this._modifyAsCrystalCanAffectAlly(); }
            else if (infoType === TileInfoType.CrystalCanAffectEnemy)                   { this._modifyAsCrystalCanAffectEnemy(); }
            else if (infoType === TileInfoType.CrystalDeltaFund)                        { this._modifyAsCrystalDeltaFund(); }
            else if (infoType === TileInfoType.CrystalDeltaEnergyPercentage)            { this._modifyAsCrystalDeltaEnergyPercentage(); }
            else if (infoType === TileInfoType.CrystalDeltaHp)                          { this._modifyAsCrystalDeltaHp(); }
            else if (infoType === TileInfoType.CrystalDeltaFuelPercentage)              { this._modifyAsCrystalDeltaFuelPercentage(); }
            else if (infoType === TileInfoType.CrystalDeltaPrimaryAmmoPercentage)       { this._modifyAsCrystalDeltaPrimaryAmmoPercentage(); }
            else if (infoType === TileInfoType.CannonRangeForUp)                        { this._modifyAsCannonRangeForUp(); }
            else if (infoType === TileInfoType.CannonRangeForRight)                     { this._modifyAsCannonRangeForRight(); }
            else if (infoType === TileInfoType.CannonRangeForLeft)                      { this._modifyAsCannonRangeForLeft(); }
            else if (infoType === TileInfoType.CannonRangeForDown)                      { this._modifyAsCannonRangeForDown(); }
            else if (infoType === TileInfoType.CannonPriority)                          { this._modifyAsCannonPriority(); }
            else if (infoType === TileInfoType.CannonMaxTargetCount)                    { this._modifyAsCannonMaxTargetCount(); }
            else if (infoType === TileInfoType.CannonCanAffectSelf)                     { this._modifyAsCannonCanAffectSelf(); }
            else if (infoType === TileInfoType.CannonCanAffectAlly)                     { this._modifyAsCannonCanAffectAlly(); }
            else if (infoType === TileInfoType.CannonCanAffectEnemy)                    { this._modifyAsCannonCanAffectEnemy(); }
            else if (infoType === TileInfoType.CannonDeltaHp)                           { this._modifyAsCannonDeltaHp(); }
            else if (infoType === TileInfoType.CannonDeltaFuelPercentage)               { this._modifyAsCannonDeltaFuelPercentage(); }
            else if (infoType === TileInfoType.CannonDeltaPrimaryAmmoPercentage)        { this._modifyAsCannonDeltaPrimaryAmmoPercentage(); }
            else if (infoType === TileInfoType.LaserTurretRangeForUp)                   { this._modifyAsLaserTurretRangeForUp(); }
            else if (infoType === TileInfoType.LaserTurretRangeForRight)                { this._modifyAsLaserTurretRangeForRight(); }
            else if (infoType === TileInfoType.LaserTurretRangeForLeft)                 { this._modifyAsLaserTurretRangeForLeft(); }
            else if (infoType === TileInfoType.LaserTurretRangeForDown)                 { this._modifyAsLaserTurretRangeForDown(); }
            else if (infoType === TileInfoType.LaserTurretPriority)                     { this._modifyAsLaserTurretPriority(); }
            else if (infoType === TileInfoType.LaserTurretCanAffectSelf)                { this._modifyAsLaserTurretCanAffectSelf(); }
            else if (infoType === TileInfoType.LaserTurretCanAffectAlly)                { this._modifyAsLaserTurretCanAffectAlly(); }
            else if (infoType === TileInfoType.LaserTurretCanAffectEnemy)               { this._modifyAsLaserTurretCanAffectEnemy(); }
            else if (infoType === TileInfoType.LaserTurretDeltaHp)                      { this._modifyAsLaserTurretDeltaHp(); }
            else if (infoType === TileInfoType.LaserTurretDeltaFuelPercentage)          { this._modifyAsLaserTurretDeltaFuelPercentage(); }
            else if (infoType === TileInfoType.LaserTurretDeltaPrimaryAmmoPercentage)   { this._modifyAsLaserTurretDeltaPrimaryAmmoPercentage(); }
            else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`);
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data          = this._getData();
            this._imgBg.visible = data.index % 2 === 0;

            const infoType = this._getData().infoType;
            if      (infoType === TileInfoType.DefenseBonus)                            { this._updateViewAsDefenseBonus(); }
            else if (infoType === TileInfoType.Income)                                  { this._updateViewAsIncome(); }
            else if (infoType === TileInfoType.Vision)                                  { this._updateViewAsVision(); }
            else if (infoType === TileInfoType.HideUnitCategory)                        { this._updateViewAsHideUnitCategory(); }
            else if (infoType === TileInfoType.IsDefeatedOnCapture)                     { this._updateViewAsIsDefeatedOnCapture(); }
            else if (infoType === TileInfoType.ProduceUnitCategory)                     { this._updateViewAsProduceUnitCategory(); }
            else if (infoType === TileInfoType.GlobalBonus)                             { this._updateViewAsGlobalBonus(); }
            else if (infoType === TileInfoType.RepairUnitCategory)                      { this._updateViewAsRepairUnitCategory(); }
            else if (infoType === TileInfoType.Hp)                                      { this._updateViewAsHp(); }
            else if (infoType === TileInfoType.CapturePoint)                            { this._updateViewAsCapturePoint(); }
            else if (infoType === TileInfoType.BuildPoint)                              { this._updateViewAsBuildPoint(); }
            else if (infoType === TileInfoType.IsHighlighted)                           { this._updateViewAsIsHighlighted(); }
            else if (infoType === TileInfoType.CrystalRadius)                           { this._updateViewAsCrystalRadius(); }
            else if (infoType === TileInfoType.CrystalPriority)                         { this._updateViewAsCrystalPriority(); }
            else if (infoType === TileInfoType.CrystalCanAffectSelf)                    { this._updateViewAsCrystalCanAffectSelf(); }
            else if (infoType === TileInfoType.CrystalCanAffectAlly)                    { this._updateViewAsCrystalCanAffectAlly(); }
            else if (infoType === TileInfoType.CrystalCanAffectEnemy)                   { this._updateViewAsCrystalCanAffectEnemy(); }
            else if (infoType === TileInfoType.CrystalDeltaFund)                        { this._updateViewAsCrystalDeltaFund(); }
            else if (infoType === TileInfoType.CrystalDeltaEnergyPercentage)            { this._updateViewAsCrystalDeltaEnergyPercentage(); }
            else if (infoType === TileInfoType.CrystalDeltaHp)                          { this._updateViewAsCrystalDeltaHp(); }
            else if (infoType === TileInfoType.CrystalDeltaFuelPercentage)              { this._updateViewAsCrystalDeltaFuelPercentage(); }
            else if (infoType === TileInfoType.CrystalDeltaPrimaryAmmoPercentage)       { this._updateViewAsCrystalDeltaPrimaryAmmoPercentage(); }
            else if (infoType === TileInfoType.CannonRangeForUp)                        { this._updateViewAsCannonRangeForUp(); }
            else if (infoType === TileInfoType.CannonRangeForRight)                     { this._updateViewAsCannonRangeForRight(); }
            else if (infoType === TileInfoType.CannonRangeForLeft)                      { this._updateViewAsCannonRangeForLeft(); }
            else if (infoType === TileInfoType.CannonRangeForDown)                      { this._updateViewAsCannonRangeForDown(); }
            else if (infoType === TileInfoType.CannonPriority)                          { this._updateViewAsCannonPriority(); }
            else if (infoType === TileInfoType.CannonMaxTargetCount)                    { this._updateViewAsCannonMaxTargetCount(); }
            else if (infoType === TileInfoType.CannonCanAffectSelf)                     { this._updateViewAsCannonCanAffectSelf(); }
            else if (infoType === TileInfoType.CannonCanAffectAlly)                     { this._updateViewAsCannonCanAffectAlly(); }
            else if (infoType === TileInfoType.CannonCanAffectEnemy)                    { this._updateViewAsCannonCanAffectEnemy(); }
            else if (infoType === TileInfoType.CannonDeltaHp)                           { this._updateViewAsCannonDeltaHp(); }
            else if (infoType === TileInfoType.CannonDeltaFuelPercentage)               { this._updateViewAsCannonDeltaFuelPercentage(); }
            else if (infoType === TileInfoType.CannonDeltaPrimaryAmmoPercentage)        { this._updateViewAsCannonDeltaPrimaryAmmoPercentage(); }
            else if (infoType === TileInfoType.LaserTurretRangeForUp)                   { this._updateViewAsLaserTurretRangeForUp(); }
            else if (infoType === TileInfoType.LaserTurretRangeForRight)                { this._updateViewAsLaserTurretRangeForRight(); }
            else if (infoType === TileInfoType.LaserTurretRangeForLeft)                 { this._updateViewAsLaserTurretRangeForLeft(); }
            else if (infoType === TileInfoType.LaserTurretRangeForDown)                 { this._updateViewAsLaserTurretRangeForDown(); }
            else if (infoType === TileInfoType.LaserTurretPriority)                     { this._updateViewAsLaserTurretPriority(); }
            else if (infoType === TileInfoType.LaserTurretCanAffectSelf)                { this._updateViewAsLaserTurretCanAffectSelf(); }
            else if (infoType === TileInfoType.LaserTurretCanAffectAlly)                { this._updateViewAsLaserTurretCanAffectAlly(); }
            else if (infoType === TileInfoType.LaserTurretCanAffectEnemy)               { this._updateViewAsLaserTurretCanAffectEnemy(); }
            else if (infoType === TileInfoType.LaserTurretDeltaHp)                      { this._updateViewAsLaserTurretDeltaHp(); }
            else if (infoType === TileInfoType.LaserTurretDeltaFuelPercentage)          { this._updateViewAsLaserTurretDeltaFuelPercentage(); }
            else if (infoType === TileInfoType.LaserTurretDeltaPrimaryAmmoPercentage)   { this._updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(); }
            else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`);
            }
        }
        private _updateViewAsDefenseBonus(): void {
            const tile                  = this._getData().tile;
            this._labelTitle.text       = Lang.getText(LangTextType.B0352);
            this._labelValue.text       = `${tile.getDefenseAmount()}`;
            this._groupExtra.visible    = true;
            this._labelExtraInfo.text   = Lang.getUnitCategoryName(tile.getDefenseUnitCategory(), tile.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined;
            this._imgModify.visible     = false;
        }
        private _updateViewAsIncome(): void {
            const data                  = this._getData();
            const tile                  = data.tile;
            this._labelTitle.text       = Lang.getText(LangTextType.B0353);
            this._labelValue.text       = `${tile.getCfgIncome()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsVision(): void {
            const data                  = this._getData();
            const tile                  = data.tile;
            this._labelTitle.text       = Lang.getText(LangTextType.B0354);
            this._labelValue.text       = `${tile.getCfgVisionRange()}`;
            this._imgModify.visible     = false;

            const groupExtra = this._groupExtra;
            if (!tile.checkIsVisionEnabledForAllPlayers()) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getText(LangTextType.B0379);
            }
        }
        private _updateViewAsHideUnitCategory(): void {
            const tile                  = this._getData().tile;
            const unitCategory          = tile.getCfgHideUnitCategory();
            this._labelTitle.text       = Lang.getText(LangTextType.B0356);
            this._labelValue.text       = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory, tile.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsIsDefeatedOnCapture(): void {
            const data                  = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0357);
            this._labelValue.text       = data.tile.checkIsDefeatOnCapture() ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsProduceUnitCategory(): void {
            const tile                  = this._getData().tile;
            const unitCategory          = tile.getCfgProduceUnitCategory();
            this._labelTitle.text       = Lang.getText(LangTextType.B0358);
            this._labelValue.text       = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory, tile.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsGlobalBonus(): void {
            const tile                  = this._getData().tile;
            const offenseBonus          = tile.getGlobalAttackBonus();
            const defenseBonus          = tile.getGlobalDefenseBonus();
            this._labelTitle.text       = Lang.getText(LangTextType.B0359);
            this._labelValue.text       = `${offenseBonus ?? `--`} / ${defenseBonus ?? `--`}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsRepairUnitCategory(): void {
            const tile                  = this._getData().tile;
            const unitCategory          = tile.getRepairUnitCategory();
            this._labelTitle.text       = Lang.getText(LangTextType.B0360);
            this._labelValue.text       = `${tile.getCfgNormalizedRepairHp()}`;
            this._groupExtra.visible    = true;
            this._labelExtraInfo.text   = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory, tile.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined);
            this._imgModify.visible     = false;
        }
        private _updateViewAsHp(): void {
            const { tile, war }         = this._getData();
            const currentHp             = tile.getCurrentHp();
            this._labelTitle.text       = Lang.getText(LangTextType.B0339);
            this._labelValue.text       = `${currentHp} / ${tile.getMaxHp()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (currentHp != null);
        }
        private _updateViewAsCapturePoint(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCurrentCapturePoint();
            this._labelTitle.text       = Lang.getText(LangTextType.B0361);
            this._labelValue.text       = `${currentValue} / ${tile.getMaxCapturePoint()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (currentValue != null);
        }
        private _updateViewAsBuildPoint(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCurrentBuildPoint();
            this._labelTitle.text       = Lang.getText(LangTextType.B0362);
            this._labelValue.text       = `${currentValue} / ${tile.getMaxBuildPoint()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (currentValue != null);
        }
        private _updateViewAsIsHighlighted(): void {
            const { tile, war }         = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0847);
            this._labelValue.text       = Lang.getText(tile.getIsHighlighted() ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType());
        }
        private _updateViewAsCrystalRadius(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.radius;
            this._labelTitle.text       = Lang.getText(LangTextType.B0734);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalPriority(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.priority;
            this._labelTitle.text       = Lang.getText(LangTextType.B0739);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalCanAffectSelf(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.canAffectSelf;
            this._labelTitle.text       = Lang.getText(LangTextType.B0735);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalCanAffectAlly(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.canAffectAlly;
            this._labelTitle.text       = Lang.getText(LangTextType.B0736);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalCanAffectEnemy(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.canAffectEnemy;
            this._labelTitle.text       = Lang.getText(LangTextType.B0737);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalDeltaFund(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.deltaFund;
            this._labelTitle.text       = Lang.getText(LangTextType.B0738);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalDeltaEnergyPercentage(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.deltaEnergyPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0730);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalDeltaHp(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.deltaHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0731);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalDeltaFuelPercentage(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.deltaFuelPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0732);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCrystalData()?.deltaPrimaryAmmoPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0733);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCrystal);
        }
        private _updateViewAsCannonRangeForUp(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.rangeForUp;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0742)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonRangeForRight(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.rangeForRight;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0743)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonRangeForDown(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.rangeForDown;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0744)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonRangeForLeft(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.rangeForLeft;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0745)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonPriority(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.priority;
            this._labelTitle.text       = Lang.getText(LangTextType.B0739);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonMaxTargetCount(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.maxTargetCount;
            this._labelTitle.text       = Lang.getText(LangTextType.B0746);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonCanAffectSelf(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.canAffectSelf;
            this._labelTitle.text       = Lang.getText(LangTextType.B0735);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonCanAffectAlly(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.canAffectAlly;
            this._labelTitle.text       = Lang.getText(LangTextType.B0736);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonCanAffectEnemy(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.canAffectEnemy;
            this._labelTitle.text       = Lang.getText(LangTextType.B0737);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonDeltaHp(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.deltaHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0731);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonDeltaFuelPercentage(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.deltaFuelPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0732);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomCannonData()?.deltaPrimaryAmmoPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0733);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomCannon);
        }
        private _updateViewAsLaserTurretRangeForUp(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.rangeForUp;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0742)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretRangeForRight(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.rangeForRight;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0743)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretRangeForDown(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.rangeForDown;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0744)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretRangeForLeft(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.rangeForLeft;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0745)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretPriority(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.priority;
            this._labelTitle.text       = Lang.getText(LangTextType.B0739);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretCanAffectSelf(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.canAffectSelf;
            this._labelTitle.text       = Lang.getText(LangTextType.B0735);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretCanAffectAlly(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.canAffectAlly;
            this._labelTitle.text       = Lang.getText(LangTextType.B0736);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretCanAffectEnemy(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.canAffectEnemy;
            this._labelTitle.text       = Lang.getText(LangTextType.B0737);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretDeltaHp(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.deltaHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0731);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.deltaFuelPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0732);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }
        private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCustomLaserTurretData()?.deltaPrimaryAmmoPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0733);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (tile.getType() === Types.TileType.CustomLaserTurret);
        }

        private _modifyAsDefenseBonus(): void {
            // nothing to do
        }
        private _modifyAsIncome(): void {
            // nothing to do
        }
        private _modifyAsVision(): void {
            // nothing to do
        }
        private _modifyAsHideUnitCategory(): void {
            // nothing to do
        }
        private _modifyAsIsDefeatedOnCapture(): void {
            // nothing to do
        }
        private _modifyAsProduceUnitCategory(): void {
            // nothing to do
        }
        private _modifyAsGlobalBonus(): void {
            // nothing to do
        }
        private _modifyAsRepairUnitCategory(): void {
            // nothing to do
        }
        private _modifyAsHp(): void {
            const { tile, war } = this._getData();
            const maxValue      = tile.getMaxHp();
            if (!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = tile.getCurrentHp();
            const minValue  = 1;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0339),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCurrentHp(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCapturePoint(): void {
            const { tile, war } = this._getData();
            const maxValue      = tile.getMaxCapturePoint();
            if (!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = tile.getCurrentCapturePoint();
            const minValue  = 1;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0361),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCurrentCapturePoint(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsBuildPoint(): void {
            const { tile, war } = this._getData();
            const maxValue      = tile.getMaxBuildPoint();
            if (!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = tile.getCurrentBuildPoint();
            const minValue  = 1;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0362),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCurrentBuildPoint(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsIsHighlighted(): void {
            const { tile, war } = this._getData();
            if (!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) {
                return;
            }

            tile.setIsHighlighted(!tile.getIsHighlighted());
            tile.flushDataToView();
            this._updateView();
        }
        private _modifyAsCrystalRadius(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            const currValue = tile.getCustomCrystalData()?.radius;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0734),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCrystalRadius(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalPriority(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            const currValue = tile.getCustomCrystalData()?.priority;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0739),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCrystalPriority(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalCanAffectSelf(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            tile.setCustomCrystalCanAffectSelf(!tile.getCustomCrystalData()?.canAffectSelf);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalCanAffectAlly(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            tile.setCustomCrystalCanAffectAlly(!tile.getCustomCrystalData()?.canAffectAlly);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalCanAffectEnemy(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            tile.setCustomCrystalCanAffectEnemy(!tile.getCustomCrystalData()?.canAffectEnemy);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalDeltaFund(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            const currValue = tile.getCustomCrystalData()?.deltaFund;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0738),
                currentValue    : currValue ?? 0,
                minValue        : -10000000,
                maxValue        : 10000000,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCrystalDeltaFund(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalDeltaEnergyPercentage(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            const currValue = tile.getCustomCrystalData()?.deltaEnergyPercentage;
            const minValue  = -100;
            const maxValue  = 100;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0730),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomCrystalDeltaEnergyPercentage(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalDeltaHp(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            const currValue = tile.getCustomCrystalData()?.deltaHp;
            const minValue  = -WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);
            const maxValue  = WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0731),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomCrystalDeltaHp(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalDeltaFuelPercentage(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            const currValue = tile.getCustomCrystalData()?.deltaFuelPercentage;
            const minValue  = -100;
            const maxValue  = 100;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0732),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomCrystalDeltaFuelPercentage(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCrystalDeltaPrimaryAmmoPercentage(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCrystal)) {
                return;
            }

            const currValue = tile.getCustomCrystalData()?.deltaPrimaryAmmoPercentage;
            const minValue  = -100;
            const maxValue  = 100;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0733),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomCrystalDeltaPrimaryAmmoPercentage(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonRangeForUp(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.rangeForUp;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0742)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCannonRangeForUp(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonRangeForRight(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.rangeForRight;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0743)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCannonRangeForRight(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonRangeForDown(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.rangeForDown;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0744)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCannonRangeForDown(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonRangeForLeft(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.rangeForLeft;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0745)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCannonRangeForLeft(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonPriority(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.priority;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0739),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomCannonPriority(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonMaxTargetCount(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.maxTargetCount;
            const minValue  = 1;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0746),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${Lang.getText(LangTextType.B0141)})`,
                callback        : panel => {
                    tile.setCustomCannonMaxTargetCount(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonCanAffectSelf(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            tile.setCustomCannonCanAffectSelf(!tile.getCustomCannonData()?.canAffectSelf);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonCanAffectAlly(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            tile.setCustomCannonCanAffectAlly(!tile.getCustomCannonData()?.canAffectAlly);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonCanAffectEnemy(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            tile.setCustomCannonCanAffectEnemy(!tile.getCustomCannonData()?.canAffectEnemy);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonDeltaHp(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.deltaHp;
            const minValue  = -WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);
            const maxValue  = WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0731),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomCannonDeltaHp(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonDeltaFuelPercentage(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.deltaFuelPercentage;
            const minValue  = -100;
            const maxValue  = 100;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0732),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomCannonDeltaFuelPercentage(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCannonDeltaPrimaryAmmoPercentage(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomCannon)) {
                return;
            }

            const currValue = tile.getCustomCannonData()?.deltaPrimaryAmmoPercentage;
            const minValue  = -100;
            const maxValue  = 100;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0733),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomCannonDeltaPrimaryAmmoPercentage(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretRangeForUp(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.rangeForUp;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0742)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomLaserTurretRangeForUp(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretRangeForRight(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.rangeForRight;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0743)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomLaserTurretRangeForRight(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretRangeForDown(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.rangeForDown;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0744)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomLaserTurretRangeForDown(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretRangeForLeft(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.rangeForLeft;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0745)})`,
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomLaserTurretRangeForLeft(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretPriority(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.priority;
            const minValue  = 0;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0739),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue        : 9999,
                tips            : ``,
                callback        : panel => {
                    tile.setCustomLaserTurretPriority(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretCanAffectSelf(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            tile.setCustomLaserTurretCanAffectSelf(!tile.getCustomLaserTurretData()?.canAffectSelf);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretCanAffectAlly(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            tile.setCustomLaserTurretCanAffectAlly(!tile.getCustomLaserTurretData()?.canAffectAlly);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretCanAffectEnemy(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            tile.setCustomLaserTurretCanAffectEnemy(!tile.getCustomLaserTurretData()?.canAffectEnemy);
            tile.flushDataToView();
            this._updateView();

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretDeltaHp(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.deltaHp;
            const minValue  = -WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);
            const maxValue  = WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0731),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomLaserTurretDeltaHp(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretDeltaFuelPercentage(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.deltaFuelPercentage;
            const minValue  = -100;
            const maxValue  = 100;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0732),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomLaserTurretDeltaFuelPercentage(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
            const { tile, war } = this._getData();
            if ((!WarHelpers.WarCommonHelpers.checkCanCheatInWar(war.getWarType())) || (tile.getType() !== Types.TileType.CustomLaserTurret)) {
                return;
            }

            const currValue = tile.getCustomLaserTurretData()?.deltaPrimaryAmmoPercentage;
            const minValue  = -100;
            const maxValue  = 100;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                title           : Lang.getText(LangTextType.B0733),
                currentValue    : currValue ?? 0,
                minValue,
                maxValue,
                tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    tile.setCustomLaserTurretDeltaPrimaryAmmoPercentage(panel.getInputValue());
                    tile.flushDataToView();
                    this._updateView();
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
    }

    type DataForMoveCostRenderer = {
        index           : number;
        gameConfig      : GameConfig;
        unitType        : number;
        tileCfg         : CommonProto.Config.ITileTemplateCfg;
        playerIndex     : number;
    };
    class MoveCostRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMoveCostRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _conView!          : eui.Group;
        private readonly _unitView          = new WarMap.WarMapUnitView();
        private readonly _labelMoveCost!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);

            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
            }
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            if (this.data) {
                this._unitView.updateOnStateIndicatorTick();
            }
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data                  = this._getData();
            const gameConfig            = data.gameConfig;
            const unitType              = data.unitType;
            const moveCostCfg           = Helpers.getExisted(gameConfig.getMoveCostCfg(Helpers.getExisted(data.tileCfg.type)));
            const moveCost              = moveCostCfg[Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.moveType)].cost;
            this._imgBg.visible         = data.index % 8 < 4;
            this._labelMoveCost.text    = moveCost != null ? `${moveCost}` : `--`;
            this._unitView.update({
                gameConfig,
                gridIndex       : { x: 0, y: 0 },
                playerIndex     : data.playerIndex,
                unitType        : data.unitType,
                actionState     : Types.UnitActionState.Idle,
            }, Timer.getUnitAnimationTickCount());
        }
    }

    type DataForDamageRenderer = {
        gameConfig          : GameConfig;
        index               : number;
        targetTileType      : Types.TileType;
        playerIndex?        : number;
        attackerUnitType    : number;
    };
    class DamageRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForDamageRenderer> {
        private readonly _group!                : eui.Group;
        private readonly _imgBg!                : TwnsUiImage.UiImage;
        private readonly _conView!              : eui.Group;
        private readonly _unitView              = new WarMap.WarMapUnitView();
        private readonly _tileView!             : TwnsUiImage.UiImage;
        private readonly _labelPrimaryAttack!   : TwnsUiLabel.UiLabel;
        private readonly _labelSecondaryAttack! : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);

            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            this._unitView.updateOnStateIndicatorTick();
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data              = this._getData();
            this._imgBg.visible     = data.index % 4 >= 2;

            const gameConfig        = data.gameConfig;
            const targetTileType    = data.targetTileType;
            const attackerUnitType  = data.attackerUnitType;
            this._unitView.visible  = true;
            this._tileView.visible  = false;
            this._unitView.update({
                gameConfig,
                gridIndex       : { x: 0, y: 0 },
                unitType        : attackerUnitType,
                playerIndex     : data.playerIndex,
                actionState     : Types.UnitActionState.Idle,
            }, Timer.getUnitAnimationTickCount());

            const attackCfg                 = Helpers.getExisted(gameConfig.getDamageChartCfgs(attackerUnitType));
            const targetArmorType           = Helpers.getExisted(gameConfig.getTileTemplateCfgByType(targetTileType)?.armorType);
            const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
            const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
            this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
            this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;
        }
    }

    function createInfoDefenseBonus(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : TileInfoType.DefenseBonus,
            war,
            tile,
        };
    }
    function createInfoIncome(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        const income = tile.getCfgIncome();
        return income == 0
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.Income,
                war,
                tile,
            };
    }
    function createInfoVision(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getCfgVisionRange() == 0) && (!tile.checkIsVisionEnabledForAllPlayers()) && (tile.getMaxCapturePoint() == null))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.Vision,
                war,
                tile
            };
    }
    function createInfoHideUnitCategory(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : TileInfoType.HideUnitCategory,
            war,
            tile,
        };
    }
    function createInfoIsDefeatOnCapture(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return !tile.checkIsDefeatOnCapture()
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.IsDefeatedOnCapture,
                war,
                tile,
            };
    }
    function createInfoProduceUnitCategory(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return tile.getCfgProduceUnitCategory() == null
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.ProduceUnitCategory,
                war,
                tile,
            };
    }
    function createInfoGlobalBonus(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getGlobalAttackBonus() == null) && (tile.getGlobalDefenseBonus() == null))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.GlobalBonus,
                war,
                tile,
            };
    }
    function createInfoRepairUnitCategory(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getRepairUnitCategory() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.RepairUnitCategory,
                war,
                tile,
            };
    }
    function createInfoHp(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getMaxHp() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.Hp,
                war,
                tile,
            };
    }
    function createInfoCapturePoint(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getMaxCapturePoint() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CapturePoint,
                war,
                tile,
            };
    }
    function createInfoBuildPoint(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getMaxBuildPoint() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.BuildPoint,
                war,
                tile,
            };
    }
    function createInfoIsHighlighted(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return {
            index       : 0,
            infoType    : TileInfoType.IsHighlighted,
            war,
            tile,
        };
    }
    function createInfoCrystalRadius(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getCustomCrystalData() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalRadius,
                war,
                tile,
            };
    }
    function createInfoCrystalPriority(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalPriority,
                war,
                tile,
            };
    }
    function createInfoCrystalCanAffectSelf(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalCanAffectSelf,
                war,
                tile,
            };
    }
    function createInfoCrystalCanAffectAlly(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalCanAffectAlly,
                war,
                tile,
            };
    }
    function createInfoCrystalCanAffectEnemy(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalCanAffectEnemy,
                war,
                tile,
            };
    }
    function createInfoCrystalDeltaFund(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaFund,
                war,
                tile,
            };
    }
    function createInfoCrystalDeltaEnergyPercentage(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaEnergyPercentage,
                war,
                tile,
            };
    }
    function createInfoCrystalDeltaHp(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getCustomCrystalData() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaHp,
                war,
                tile,
            };
    }
    function createInfoCrystalDeltaFuelPercentage(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaFuelPercentage,
                war,
                tile,
            };
    }
    function createInfoCrystalDeltaPrimaryAmmoPercentage(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaPrimaryAmmoPercentage,
                war,
                tile,
            };
    }
    function createInfoCannonRangeForUp(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomCannon) && (!tile.getCustomCannonData()?.rangeForUp))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForUp,
                war,
                tile,
            };
    }
    function createInfoCannonRangeForDown(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomCannon) && (!tile.getCustomCannonData()?.rangeForDown))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForDown,
                war,
                tile,
            };
    }
    function createInfoCannonRangeForLeft(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomCannon) && (!tile.getCustomCannonData()?.rangeForLeft))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForLeft,
                war,
                tile,
            };
    }
    function createInfoCannonRangeForRight(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomCannon) && (!tile.getCustomCannonData()?.rangeForRight))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForRight,
                war,
                tile,
            };
    }
    function createInfoCannonPriority(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonPriority,
                war,
                tile,
            };
    }
    function createInfoCannonMaxTargetCount(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonMaxTargetCount,
                war,
                tile,
            };
    }
    function createInfoCannonCanAffectSelf(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonCanAffectSelf,
                war,
                tile,
            };
    }
    function createInfoCannonCanAffectAlly(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonCanAffectAlly,
                war,
                tile,
            };
    }
    function createInfoCannonCanAffectEnemy(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonCanAffectEnemy,
                war,
                tile,
            };
    }
    function createInfoCannonDeltaHp(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getCustomCannonData() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonDeltaHp,
                war,
                tile,
            };
    }
    function createInfoCannonDeltaFuelPercentage(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonDeltaFuelPercentage,
                war,
                tile,
            };
    }
    function createInfoCannonDeltaPrimaryAmmoPercentage(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonDeltaPrimaryAmmoPercentage,
                war,
                tile,
            };
    }
    function createInfoLaserTurretRangeForUp(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomLaserTurret) && (!tile.getCustomLaserTurretData()?.rangeForUp))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForUp,
                war,
                tile,
            };
    }
    function createInfoLaserTurretRangeForDown(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomLaserTurret) && (!tile.getCustomLaserTurretData()?.rangeForDown))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForDown,
                war,
                tile,
            };
    }
    function createInfoLaserTurretRangeForLeft(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomLaserTurret) && (!tile.getCustomLaserTurretData()?.rangeForLeft))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForLeft,
                war,
                tile,
            };
    }
    function createInfoLaserTurretRangeForRight(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return ((tile.getType() !== Types.TileType.CustomLaserTurret) && (!tile.getCustomLaserTurretData()?.rangeForRight))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForRight,
                war,
                tile,
            };
    }
    function createInfoLaserTurretPriority(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretPriority,
                war,
                tile,
            };
    }
    function createInfoLaserTurretCanAffectSelf(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretCanAffectSelf,
                war,
                tile,
            };
    }
    function createInfoLaserTurretCanAffectAlly(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretCanAffectAlly,
                war,
                tile,
            };
    }
    function createInfoLaserTurretCanAffectEnemy(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretCanAffectEnemy,
                war,
                tile,
            };
    }
    function createInfoLaserTurretDeltaHp(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getCustomLaserTurretData() == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretDeltaHp,
                war,
                tile,
            };
    }
    function createInfoLaserTurretDeltaFuelPercentage(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretDeltaFuelPercentage,
                war,
                tile,
            };
    }
    function createInfoLaserTurretDeltaPrimaryAmmoPercentage(war: BaseWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
        return (tile.getType() !== Types.TileType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretDeltaPrimaryAmmoPercentage,
                war,
                tile,
            };
    }
}

// export default TwnsBwTileDetailPanel;
