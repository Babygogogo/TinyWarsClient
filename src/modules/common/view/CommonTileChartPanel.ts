
// import CommonModel              from "../../common/model/CommonModel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
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
// import UserModel                from "../../user/model/UserModel";
// import TwnsWarMapUnitView       from "../../warMap/view/WarMapUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import NotifyType       = Notify.NotifyType;
    import LangTextType     = Lang.LangTextType;
    import GameConfig       = Config.GameConfig;
    import TileInfoType     = Types.TileInfoType;

    export type OpenDataForCommonTileChartPanel = {
        gameConfig   : GameConfig;
    };
    export class CommonTileChartPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonTileChartPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;

        private readonly _groupList!            : eui.Group;
        private readonly _listTile!             : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelName!            : TwnsUiLabel.UiLabel;
        private readonly _labelName1!           : TwnsUiLabel.UiLabel;
        private readonly _conTileView!          : eui.Group;
        private readonly _listInfo!             : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        private readonly _groupMoveCost!        : eui.Group;
        private readonly _labelMoveCost!        : TwnsUiLabel.UiLabel;
        private readonly _listMoveCost!         : TwnsUiScrollList.UiScrollList<DataForMoveCostRenderer>;

        private readonly _groupDamageChart!     : eui.Group;
        private readonly _labelDamageChart!     : TwnsUiLabel.UiLabel;
        private readonly _labelMain1!           : TwnsUiLabel.UiLabel;
        private readonly _labelSub1!            : TwnsUiLabel.UiLabel;
        private readonly _labelMain2!           : TwnsUiLabel.UiLabel;
        private readonly _labelSub2!            : TwnsUiLabel.UiLabel;
        private readonly _listDamageChart!      : TwnsUiScrollList.UiScrollList<DataForDamageRenderer>;

        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _tileView              = new MapEditor.MeTileSimpleView();

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TileAnimationTick,           callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,    callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listTile.setItemRenderer(TileRenderer);
            this._listMoveCost.setItemRenderer(MoveCostRenderer);
            this._listInfo.setItemRenderer(InfoRenderer);
            this._listDamageChart.setItemRenderer(DamageRenderer);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._listTile.bindData(this._createDataForListTile());
            this.setSelectedIndexAndUpdateView(0, true);
        }
        protected _onClosing(): void {
            this._conTileView.removeChildren();
        }

        public setSelectedIndexAndUpdateView(newIndex: number, needScroll: boolean): void {
            const listTile = this._listTile;
            listTile.setSelectedIndex(newIndex);
            this._updateTileView();
            this._updateLabelName();
            this._updateListInfo();
            this._updateGroupMoveCost();
            this._updateGroupDamageChart();

            if (needScroll) {
                listTile.scrollVerticalToIndex(newIndex);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });

            const groupList = this._groupList;
            egret.Tween.removeTweens(groupList);
            egret.Tween.get(groupList)
                .set({ alpha: 0, left: -40 })
                .to({ alpha: 1, left: 0 }, 200);

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 0, right: -40 })
                .to({ alpha: 1, right: 0 }, 200);

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            const groupList = this._groupList;
            egret.Tween.removeTweens(groupList);
            egret.Tween.get(groupList)
                .set({ alpha: 1, left: 0 })
                .to({ alpha: 0, left: -40 }, 200);

            const groupInfo = this._groupInfo;
            egret.Tween.removeTweens(groupInfo);
            egret.Tween.get(groupInfo)
                .set({ alpha: 1, right: 0 })
                .to({ alpha: 0, right: -40 }, 200);

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private _updateComponentsForLanguage(): void {
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
            this._labelMoveCost.text    = Lang.getText(LangTextType.B0351);
            this._labelDamageChart.text = Lang.getText(LangTextType.B0334);
            this._labelMain1.text       = Lang.getText(LangTextType.B0692);
            this._labelSub1.text        = Lang.getText(LangTextType.B0693);
            this._labelMain2.text       = Lang.getText(LangTextType.B0692);
            this._labelSub2.text        = Lang.getText(LangTextType.B0693);
            this._updateLabelName();
        }

        private _updateLabelName(): void {
            const tileType      = this._listTile.getSelectedData()?.tileType;
            const labelName     = this._labelName;
            const labelName1    = this._labelName1;
            const gameConfig    = this._getOpenData().gameConfig;
            if (tileType== null) {
                labelName.text  = ``;
                labelName1.text = ``;
            } else {
                labelName.text  = Lang.getTileName(tileType, gameConfig) ?? CommonConstants.ErrorTextForUndefined;
                labelName1.text = Lang.getTileName(tileType, gameConfig, Lang.getCurrentLanguageType() === Types.LanguageType.Chinese ? Types.LanguageType.English : Types.LanguageType.Chinese) ?? CommonConstants.ErrorTextForUndefined;
            }
        }

        private _updateTileView(): void {
            const tileType = this._listTile.getSelectedData()?.tileType;
            if (tileType == null) {
                return;
            }

            const tileView      = this._tileView;
            const gameConfig    = this._getOpenData().gameConfig;
            tileView.init({
                tileBaseType        : gameConfig.getTileTemplateCfg(tileType)?.toTileBaseType ?? null,
                tileBaseShapeId     : 0,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                tileObjectType      : gameConfig.getTileTemplateCfg(tileType)?.toTileObjectType ?? null,
                tileObjectShapeId   : 0,
                playerIndex         : CommonConstants.PlayerIndex.Neutral,
                gameConfig,
            });
            tileView.updateView();
        }

        private _updateListInfo(): void {
            const tileType  = this._listTile.getSelectedData()?.tileType;
            const listInfo  = this._listInfo;
            if (tileType == null) {
                listInfo.clear();
                return;
            }

            const gameConfig        = this._getOpenData().gameConfig;
            const tileTemplateCfg   = gameConfig.getTileTemplateCfg(tileType);
            if (tileTemplateCfg == null) {
                listInfo.clear();
                return;
            }

            const dataArray: DataForInfoRenderer[] = Helpers.getNonNullElements([
                createInfoDefenseBonus(tileTemplateCfg, gameConfig),
                createInfoIncome(tileTemplateCfg, gameConfig),
                createInfoVision(tileTemplateCfg, gameConfig),
                createInfoHideUnitCategory(tileTemplateCfg, gameConfig),
                createInfoIsDefeatOnCapture(tileTemplateCfg, gameConfig),
                createInfoProduceUnitCategory(tileTemplateCfg, gameConfig),
                createInfoGlobalBonus(tileTemplateCfg, gameConfig),
                createInfoRepairUnitCategory(tileTemplateCfg, gameConfig),
                createInfoHp(tileTemplateCfg, gameConfig),
                createInfoCapturePoint(tileTemplateCfg, gameConfig),
                createInfoBuildPoint(tileTemplateCfg, gameConfig),
                createInfoIsHighlighted(tileTemplateCfg, gameConfig),
                createInfoCrystalRadius(tileTemplateCfg, gameConfig),
                createInfoCrystalPriority(tileTemplateCfg, gameConfig),
                createInfoCrystalCanAffectSelf(tileTemplateCfg, gameConfig),
                createInfoCrystalCanAffectAlly(tileTemplateCfg, gameConfig),
                createInfoCrystalCanAffectEnemy(tileTemplateCfg, gameConfig),
                createInfoCrystalDeltaFund(tileTemplateCfg, gameConfig),
                createInfoCrystalDeltaEnergyPercentage(tileTemplateCfg, gameConfig),
                createInfoCrystalDeltaHp(tileTemplateCfg, gameConfig),
                createInfoCrystalDeltaFuelPercentage(tileTemplateCfg, gameConfig),
                createInfoCrystalDeltaPrimaryAmmoPercentage(tileTemplateCfg, gameConfig),
                createInfoCannonRangeForUp(tileTemplateCfg, gameConfig),
                createInfoCannonRangeForRight(tileTemplateCfg, gameConfig),
                createInfoCannonRangeForDown(tileTemplateCfg, gameConfig),
                createInfoCannonRangeForLeft(tileTemplateCfg, gameConfig),
                createInfoCannonPriority(tileTemplateCfg, gameConfig),
                createInfoCannonMaxTargetCount(tileTemplateCfg, gameConfig),
                createInfoCannonCanAffectSelf(tileTemplateCfg, gameConfig),
                createInfoCannonCanAffectAlly(tileTemplateCfg, gameConfig),
                createInfoCannonCanAffectEnemy(tileTemplateCfg, gameConfig),
                createInfoCannonDeltaHp(tileTemplateCfg, gameConfig),
                createInfoCannonDeltaFuelPercentage(tileTemplateCfg, gameConfig),
                createInfoCannonDeltaPrimaryAmmoPercentage(tileTemplateCfg, gameConfig),
                createInfoLaserTurretRangeForUp(tileTemplateCfg, gameConfig),
                createInfoLaserTurretRangeForRight(tileTemplateCfg, gameConfig),
                createInfoLaserTurretRangeForDown(tileTemplateCfg, gameConfig),
                createInfoLaserTurretRangeForLeft(tileTemplateCfg, gameConfig),
                createInfoLaserTurretPriority(tileTemplateCfg, gameConfig),
                createInfoLaserTurretCanAffectSelf(tileTemplateCfg, gameConfig),
                createInfoLaserTurretCanAffectAlly(tileTemplateCfg, gameConfig),
                createInfoLaserTurretCanAffectEnemy(tileTemplateCfg, gameConfig),
                createInfoLaserTurretDeltaHp(tileTemplateCfg, gameConfig),
                createInfoLaserTurretDeltaFuelPercentage(tileTemplateCfg, gameConfig),
                createInfoLaserTurretDeltaPrimaryAmmoPercentage(tileTemplateCfg, gameConfig),
            ]);

            let index = 0;
            for (const data of dataArray) {
                data.index = index++;
            }
            listInfo.bindData(dataArray);
        }

        private _updateGroupMoveCost(): void {
            const group             = this._groupMoveCost;
            const tileType          = this._listTile.getSelectedData()?.tileType;
            const tileTemplateCfg   = tileType == null ? null : this._getOpenData().gameConfig.getTileTemplateCfg(tileType);
            if ((tileTemplateCfg == null) || (tileTemplateCfg.maxHp)) {
                group.visible = false;
            } else {
                group.visible = true;
                this._listMoveCost.bindData(this._createDataForListMoveCost());
            }
        }

        private _updateGroupDamageChart(): void {
            const group             = this._groupDamageChart;
            const tileType          = this._listTile.getSelectedData()?.tileType;
            const tileTemplateCfg   = tileType == null ? null : this._getOpenData().gameConfig.getTileTemplateCfg(tileType);
            if ((tileTemplateCfg == null) || (!tileTemplateCfg.maxHp)) {
                group.visible = false;
            } else {
                group.visible = true;
                this._listDamageChart.bindData(this._createDataForListDamageChart());
            }
        }

        private _createDataForListMoveCost(): DataForMoveCostRenderer[] {
            const tileType      = this._listTile.getSelectedData()?.tileType;
            if (tileType == null) {
                return [];
            }

            const gameConfig    = this._getOpenData().gameConfig;
            const tileCfg       = Helpers.getExisted(gameConfig.getTileTemplateCfg(tileType));
            const dataArray     : DataForMoveCostRenderer[] = [];
            let index           = 0;
            for (const unitType of gameConfig.getAllUnitTypeArray()) {
                dataArray.push({
                    index,
                    gameConfig,
                    unitType,
                    tileCfg,
                });
                ++index;
            }

            return dataArray.sort((v1, v2) => v1.unitType - v2.unitType);
        }

        private _createDataForListDamageChart(): DataForDamageRenderer[] {
            const targetTileType = this._listTile.getSelectedData()?.tileType;
            if (targetTileType == null) {
                return [];
            }

            const openData      = this._getOpenData();
            const gameConfig    = openData.gameConfig;
            const playerIndex   = CommonConstants.PlayerIndex.First;
            const dataArray     : DataForDamageRenderer[] = [];
            let index           = 0;
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

        private _createDataForListTile(): DataForTileRenderer[] {
            const dataArray     : DataForTileRenderer[] = [];
            const gameConfig    = this._getOpenData().gameConfig;
            for (const tileType of gameConfig.getTileTypeArrayForTileChart()) {
                dataArray.push({
                    tileType,
                    panel   : this,
                    gameConfig,
                });
            }

            return dataArray;
        }
    }

    type DataForTileRenderer = {
        tileType        : number;
        panel           : CommonTileChartPanel;
        gameConfig      : Config.GameConfig;
    };
    class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
        private readonly _imgChoose!    : eui.Image;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this._getData();
            this._labelName.text    = Lang.getTileName(data.tileType, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined;
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            this._getData().panel.setSelectedIndexAndUpdateView(e.itemIndex, false);
        }
    }

    type DataForInfoRenderer = {
        gameConfig      : Config.GameConfig;
        index           : number;
        infoType        : TileInfoType;
        tileTemplateCfg : Types.TileTemplateCfg;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelValue!       : TwnsUiLabel.UiLabel;
        private readonly _groupExtra!       : eui.Group;
        private readonly _labelExtraInfo!   : TwnsUiLabel.UiLabel;
        private readonly _imgModify!        : TwnsUiImage.UiImage;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            this._updateView();
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
            const data                  = this._getData();
            const tileTemplateCfg       = data.tileTemplateCfg;
            this._labelTitle.text       = Lang.getText(LangTextType.B0352);
            this._labelValue.text       = `${tileTemplateCfg.defenseAmount}`;
            this._groupExtra.visible    = true;
            this._labelExtraInfo.text   = Lang.getUnitCategoryName(tileTemplateCfg.defenseUnitCategory, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined;
            this._imgModify.visible     = false;
        }
        private _updateViewAsIncome(): void {
            const data                  = this._getData();
            const tileTemplateCfg       = data.tileTemplateCfg;
            this._labelTitle.text       = Lang.getText(LangTextType.B0353);
            this._labelValue.text       = `${tileTemplateCfg.incomePerTurn}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsVision(): void {
            const data                  = this._getData();
            const tileTemplateCfg       = data.tileTemplateCfg;
            this._labelTitle.text       = Lang.getText(LangTextType.B0354);
            this._labelValue.text       = `${tileTemplateCfg.visionRange}`;
            this._imgModify.visible     = false;

            const groupExtra = this._groupExtra;
            if (!tileTemplateCfg.isVisionEnabledForAllPlayers) {
                groupExtra.visible = false;
            } else {
                groupExtra.visible          = true;
                this._labelExtraInfo.text   = Lang.getText(LangTextType.B0379);
            }
        }
        private _updateViewAsHideUnitCategory(): void {
            const data                  = this._getData();
            const unitCategory          = data.tileTemplateCfg.hideUnitCategory;
            this._labelTitle.text       = Lang.getText(LangTextType.B0356);
            this._labelValue.text       = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsIsDefeatedOnCapture(): void {
            const data                  = this._getData();
            this._labelTitle.text       = Lang.getText(LangTextType.B0357);
            this._labelValue.text       = data.tileTemplateCfg.isDefeatedOnCapture ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsProduceUnitCategory(): void {
            const data                  = this._getData();
            const unitCategory          = data.tileTemplateCfg.produceUnitCategory;
            this._labelTitle.text       = Lang.getText(LangTextType.B0358);
            this._labelValue.text       = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsGlobalBonus(): void {
            const tileTemplateCfg       = this._getData().tileTemplateCfg;
            const offenseBonus          = tileTemplateCfg.globalAttackBonus;
            const defenseBonus          = tileTemplateCfg.globalDefenseBonus;
            this._labelTitle.text       = Lang.getText(LangTextType.B0359);
            this._labelValue.text       = `${offenseBonus ?? `--`} / ${defenseBonus ?? `--`}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsRepairUnitCategory(): void {
            const data                  = this._getData();
            const tileTemplateCfg       = data.tileTemplateCfg;
            const unitCategory          = tileTemplateCfg.repairUnitCategory;
            this._labelTitle.text       = Lang.getText(LangTextType.B0360);
            this._labelValue.text       = `${tileTemplateCfg.repairAmount}`;
            this._groupExtra.visible    = true;
            this._labelExtraInfo.text   = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined);
            this._imgModify.visible     = false;
        }
        private _updateViewAsHp(): void {
            const tileTemplateCfg       = this._getData().tileTemplateCfg;
            const maxHp                 = tileTemplateCfg.maxHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0339);
            this._labelValue.text       = `${maxHp} / ${maxHp}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCapturePoint(): void {
            const tileTemplateCfg       = this._getData().tileTemplateCfg;
            const maxCapturePoint       = tileTemplateCfg.maxCapturePoint;
            this._labelTitle.text       = Lang.getText(LangTextType.B0361);
            this._labelValue.text       = `${maxCapturePoint} / ${maxCapturePoint}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsBuildPoint(): void {
            const tileTemplateCfg       = this._getData().tileTemplateCfg;
            const maxBuildPoint         = tileTemplateCfg.maxBuildPoint;
            this._labelTitle.text       = Lang.getText(LangTextType.B0362);
            this._labelValue.text       = `${maxBuildPoint} / ${maxBuildPoint}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsIsHighlighted(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0847);
            this._labelValue.text       = Lang.getText(LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalRadius(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.radius;
            this._labelTitle.text       = Lang.getText(LangTextType.B0734);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalPriority(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.priority;
            this._labelTitle.text       = Lang.getText(LangTextType.B0739);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalCanAffectSelf(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.canAffectSelf;
            this._labelTitle.text       = Lang.getText(LangTextType.B0735);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalCanAffectAlly(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.canAffectAlly;
            this._labelTitle.text       = Lang.getText(LangTextType.B0736);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalCanAffectEnemy(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.canAffectEnemy;
            this._labelTitle.text       = Lang.getText(LangTextType.B0737);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalDeltaFund(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.deltaFund;
            this._labelTitle.text       = Lang.getText(LangTextType.B0738);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalDeltaEnergyPercentage(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.deltaEnergyPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0730);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalDeltaHp(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.deltaHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0731);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalDeltaFuelPercentage(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.deltaFuelPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0732);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCrystalDeltaPrimaryAmmoPercentage(): void {
            const currentValue          = CommonConstants.TileDefaultCrystalData.deltaPrimaryAmmoPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0733);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonRangeForUp(): void {
            const currentValue          = CommonConstants.TileDefaultCannonUpData.rangeForUp;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0742)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonRangeForRight(): void {
            const currentValue          = CommonConstants.TileDefaultCannonRightData.rangeForRight;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0743)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonRangeForDown(): void {
            const currentValue          = CommonConstants.TileDefaultCannonDownData.rangeForDown;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0744)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonRangeForLeft(): void {
            const currentValue          = CommonConstants.TileDefaultCannonLeftData.rangeForLeft;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0745)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonPriority(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.priority;
            this._labelTitle.text       = Lang.getText(LangTextType.B0739);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonMaxTargetCount(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.maxTargetCount;
            this._labelTitle.text       = Lang.getText(LangTextType.B0746);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonCanAffectSelf(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.canAffectSelf;
            this._labelTitle.text       = Lang.getText(LangTextType.B0735);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonCanAffectAlly(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.canAffectAlly;
            this._labelTitle.text       = Lang.getText(LangTextType.B0736);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonCanAffectEnemy(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.canAffectEnemy;
            this._labelTitle.text       = Lang.getText(LangTextType.B0737);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonDeltaHp(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.deltaHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0731);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonDeltaFuelPercentage(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.deltaFuelPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0732);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsCannonDeltaPrimaryAmmoPercentage(): void {
            const currentValue          = CommonConstants.TileDefaultCustomCannonData.deltaPrimaryAmmoPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0733);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretRangeForUp(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.rangeForUp;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0742)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretRangeForRight(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.rangeForRight;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0743)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretRangeForDown(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.rangeForDown;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0744)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretRangeForLeft(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.rangeForLeft;
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0696)}(${Lang.getText(LangTextType.B0745)})`;
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretPriority(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.priority;
            this._labelTitle.text       = Lang.getText(LangTextType.B0739);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretCanAffectSelf(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.canAffectSelf;
            this._labelTitle.text       = Lang.getText(LangTextType.B0735);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretCanAffectAlly(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.canAffectAlly;
            this._labelTitle.text       = Lang.getText(LangTextType.B0736);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretCanAffectEnemy(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.canAffectEnemy;
            this._labelTitle.text       = Lang.getText(LangTextType.B0737);
            this._labelValue.text       = Lang.getText(currentValue ? LangTextType.B0012 : LangTextType.B0013);
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretDeltaHp(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.deltaHp;
            this._labelTitle.text       = Lang.getText(LangTextType.B0731);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretDeltaFuelPercentage(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.deltaFuelPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0732);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
        private _updateViewAsLaserTurretDeltaPrimaryAmmoPercentage(): void {
            const currentValue          = CommonConstants.TileDefaultCustomLaserTurretData.deltaPrimaryAmmoPercentage;
            this._labelTitle.text       = Lang.getText(LangTextType.B0733);
            this._labelValue.text       = `${currentValue}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = false;
        }
    }

    type DataForMoveCostRenderer = {
        index           : number;
        gameConfig      : GameConfig;
        unitType        : number;
        tileCfg         : CommonProto.Config.ITileTemplateCfg;
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
                playerIndex     : CommonConstants.PlayerIndex.First,
                unitType        : data.unitType,
                actionState     : Types.UnitActionState.Idle,
            }, Timer.getUnitAnimationTickCount());
        }
    }

    type DataForDamageRenderer = {
        gameConfig          : GameConfig;
        index               : number;
        targetTileType      : number;
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
            const targetArmorType           = Helpers.getExisted(gameConfig.getTileTemplateCfg(targetTileType)?.armorType);
            const primaryAttackDamage       = attackCfg[targetArmorType][Types.WeaponType.Primary].damage;
            const secondaryAttackDamage     = attackCfg[targetArmorType][Types.WeaponType.Secondary].damage;
            this._labelPrimaryAttack.text   = primaryAttackDamage == null ? `--` : `${primaryAttackDamage}`;
            this._labelSecondaryAttack.text = secondaryAttackDamage == null ? `--` : `${secondaryAttackDamage}`;
        }
    }

    function createInfoDefenseBonus(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : TileInfoType.DefenseBonus,
            tileTemplateCfg,
            gameConfig,
        };
    }
    function createInfoIncome(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const income = tileTemplateCfg.incomePerTurn ?? 0;
        return income == 0
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.Income,
                tileTemplateCfg,
                gameConfig
            };
    }
    function createInfoVision(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return ((!tileTemplateCfg.visionRange) && (!tileTemplateCfg.isVisionEnabledForAllPlayers) && (tileTemplateCfg.maxCapturePoint == null))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.Vision,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoHideUnitCategory(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer {
        return {
            index       : 0,
            infoType    : TileInfoType.HideUnitCategory,
            tileTemplateCfg,
            gameConfig,
        };
    }
    function createInfoIsDefeatOnCapture(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return !tileTemplateCfg.isDefeatedOnCapture
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.IsDefeatedOnCapture,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoProduceUnitCategory(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return tileTemplateCfg.produceUnitCategory == null
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.ProduceUnitCategory,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoGlobalBonus(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return ((tileTemplateCfg.globalAttackBonus == null) && (tileTemplateCfg.globalDefenseBonus == null))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.GlobalBonus,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoRepairUnitCategory(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.repairUnitCategory == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.RepairUnitCategory,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoHp(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.maxHp == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.Hp,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCapturePoint(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.maxCapturePoint == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CapturePoint,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoBuildPoint(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.maxBuildPoint == null)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.BuildPoint,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoIsHighlighted(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return null;
    }
    function createInfoCrystalRadius(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.Crystal) && (mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalRadius,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalPriority(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalPriority,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalCanAffectSelf(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalCanAffectSelf,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalCanAffectAlly(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalCanAffectAlly,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalCanAffectEnemy(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalCanAffectEnemy,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalDeltaFund(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaFund,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalDeltaEnergyPercentage(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaEnergyPercentage,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalDeltaHp(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.Crystal) && (mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaHp,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalDeltaFuelPercentage(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaFuelPercentage,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCrystalDeltaPrimaryAmmoPercentage(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCrystal)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CrystalDeltaPrimaryAmmoPercentage,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonRangeForUp(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CannonUp) && (mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForUp,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonRangeForDown(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CannonDown) && (mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForDown,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonRangeForLeft(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CannonLeft) && (mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForLeft,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonRangeForRight(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CannonRight) && (mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonRangeForRight,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonPriority(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonPriority,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonMaxTargetCount(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonMaxTargetCount,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonCanAffectSelf(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonCanAffectSelf,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonCanAffectAlly(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonCanAffectAlly,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonCanAffectEnemy(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonCanAffectEnemy,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonDeltaHp(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CannonRight) && (mapWeaponType !== CommonConstants.MapWeaponType.CannonLeft) && (mapWeaponType !== CommonConstants.MapWeaponType.CannonDown) && (mapWeaponType !== CommonConstants.MapWeaponType.CannonUp) && (mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonDeltaHp,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonDeltaFuelPercentage(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonDeltaFuelPercentage,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoCannonDeltaPrimaryAmmoPercentage(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomCannon)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.CannonDeltaPrimaryAmmoPercentage,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretRangeForUp(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret) && (mapWeaponType !== CommonConstants.MapWeaponType.LaserTurret))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForUp,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretRangeForDown(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret) && (mapWeaponType !== CommonConstants.MapWeaponType.LaserTurret))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForDown,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretRangeForLeft(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret) && (mapWeaponType !== CommonConstants.MapWeaponType.LaserTurret))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForLeft,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretRangeForRight(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret) && (mapWeaponType !== CommonConstants.MapWeaponType.LaserTurret))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretRangeForRight,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretPriority(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretPriority,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretCanAffectSelf(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretCanAffectSelf,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretCanAffectAlly(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretCanAffectAlly,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretCanAffectEnemy(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretCanAffectEnemy,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretDeltaHp(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        const mapWeaponType = tileTemplateCfg.mapWeaponType;
        return ((mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret) && (mapWeaponType !== CommonConstants.MapWeaponType.LaserTurret))
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretDeltaHp,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretDeltaFuelPercentage(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretDeltaFuelPercentage,
                tileTemplateCfg,
                gameConfig,
            };
    }
    function createInfoLaserTurretDeltaPrimaryAmmoPercentage(tileTemplateCfg: Types.TileTemplateCfg, gameConfig: Config.GameConfig): DataForInfoRenderer | null {
        return (tileTemplateCfg.mapWeaponType !== CommonConstants.MapWeaponType.CustomLaserTurret)
            ? null
            : {
                index       : 0,
                infoType    : TileInfoType.LaserTurretDeltaPrimaryAmmoPercentage,
                tileTemplateCfg,
                gameConfig,
            };
    }
}

// export default TwnsCommonTileChartPanel;
