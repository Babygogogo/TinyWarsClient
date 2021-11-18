
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
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
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
namespace TwnsBwTileDetailPanel {
    import BwTile           = TwnsBwTile.BwTile;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import UnitType         = Types.UnitType;

    // eslint-disable-next-line no-shadow
    enum TileInfoType {
        DefenseBonus,
        Income,
        Vision,
        HideUnitCategory,
        IsDefeatedOnCapture,
        ProduceUnitCategory,
        GlobalBonus,
        RepairUnitCategory,
        Hp,
        CapturePoint,
        BuildPoint,
    }

    export type OpenData = {
        tile    : BwTile;
    };
    export class BwTileDetailPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;
        private readonly _labelName1!       : TwnsUiLabel.UiLabel;
        private readonly _conTileView!      : eui.Group;
        private readonly _listInfo!         : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;
        private readonly _labelMoveCost!    : TwnsUiLabel.UiLabel;
        private readonly _listMoveCost!     : TwnsUiScrollList.UiScrollList<DataForMoveRangeRenderer>;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _tileView          = new TwnsBwTileView.BwTileView();

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateChanged,     callback: this._onNotifyBwPlannerStateChanged },
                { type: NotifyType.TileAnimationTick,               callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                               callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listInfo.setItemRenderer(InfoRenderer);
            this._listMoveCost.setItemRenderer(MoveCostRenderer);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateTileViewAndLabelName();
            this._updateListInfo();
        }

        private _updateComponentsForLanguage(): void {
            this._labelMoveCost.text    = Lang.getText(LangTextType.B0351);
            this._btnClose.label        = Lang.getText(LangTextType.B0204);
            this._updateListMoveCost();
        }

        private _updateTileViewAndLabelName(): void {
            const data              = this._getOpenData();
            const tile              = data.tile;
            this._labelName.text    = Lang.getTileName(tile.getType()) ?? CommonConstants.ErrorTextForUndefined;
            this._labelName1.text   = Lang.getTileName(tile.getType(), Lang.getCurrentLanguageType() === Types.LanguageType.Chinese ? Types.LanguageType.English : Types.LanguageType.Chinese) ?? CommonConstants.ErrorTextForUndefined;

            const tileView = this._tileView;
            tileView.setData({
                tileData    : tile.serialize(),
                hasFog      : tile.getHasFog(),
                skinId      : tile.getSkinId(),
            });
            tileView.updateView();
        }

        private _updateListInfo(): void {
            const openData  = this._getOpenData();
            const tile      = openData.tile;
            const war       = tile.getWar();
            const dataArray : DataForInfoRenderer[] = Helpers.getNonNullElements([
                this._createInfoDefenseBonus(war, tile),
                this._createInfoIncome(war, tile),
                this._createInfoVision(war, tile),
                this._createInfoHideUnitCategory(war, tile),
                this._createInfoIsDefeatOnCapture(war, tile),
                this._createInfoProduceUnitCategory(war, tile),
                this._createInfoGlobalBonus(war, tile),
                this._createInfoRepairUnitCategory(war, tile),
                this._createInfoHp(war, tile),
                this._createInfoCapturePoint(war, tile),
                this._createInfoBuildPoint(war, tile),
            ]);

            let index = 0;
            for (const data of dataArray) {
                data.index = index++;
            }
            this._listInfo.bindData(dataArray);
        }
        private _createInfoDefenseBonus(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : TileInfoType.DefenseBonus,
                war,
                tile,
            };
        }
        private _createInfoIncome(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
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
        private _createInfoVision(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return ((tile.getCfgVisionRange() == 0) && (!tile.checkIsVisionEnabledForAllPlayers()) && (tile.getMaxCapturePoint() == null))
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.Vision,
                    war,
                    tile
                };
        }
        private _createInfoHideUnitCategory(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer {
            return {
                index       : 0,
                infoType    : TileInfoType.HideUnitCategory,
                war,
                tile,
            };
        }
        private _createInfoIsDefeatOnCapture(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return !tile.checkIsDefeatOnCapture()
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.IsDefeatedOnCapture,
                    war,
                    tile,
                };
        }
        private _createInfoProduceUnitCategory(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return tile.getCfgProduceUnitCategory() == null
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.ProduceUnitCategory,
                    war,
                    tile,
                };
        }
        private _createInfoGlobalBonus(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return ((tile.getGlobalAttackBonus() == null) && (tile.getGlobalDefenseBonus() == null))
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.GlobalBonus,
                    war,
                    tile,
                };
        }
        private _createInfoRepairUnitCategory(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return (tile.getRepairUnitCategory() == null)
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.RepairUnitCategory,
                    war,
                    tile,
                };
        }
        private _createInfoHp(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return (tile.getMaxHp() == null)
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.Hp,
                    war,
                    tile,
                };
        }
        private _createInfoCapturePoint(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return (tile.getMaxCapturePoint() == null)
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.CapturePoint,
                    war,
                    tile,
                };
        }
        private _createInfoBuildPoint(war: TwnsBwWar.BwWar, tile: BwTile): DataForInfoRenderer | null {
            return (tile.getMaxBuildPoint() == null)
                ? null
                : {
                    index       : 0,
                    infoType    : TileInfoType.BuildPoint,
                    war,
                    tile,
                };
        }

        private _updateListMoveCost(): void {
            this._listMoveCost.bindData(this._createDataForListMoveCost());
        }

        private _createDataForListMoveCost(): DataForMoveRangeRenderer[] {
            const openData          = this._getOpenData();
            const tile              = openData.tile;
            const configVersion     = tile.getConfigVersion();
            const tileCfg           = ConfigManager.getTileTemplateCfgByType(configVersion, tile.getType());
            const playerIndex       = tile.getPlayerIndex() || 1;

            const dataArray : DataForMoveRangeRenderer[] = [];
            let index       = 0;
            for (const unitType of ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All)) {
                dataArray.push({
                    index,
                    configVersion,
                    unitType,
                    tileCfg,
                    playerIndex,
                });
                ++index;
            }

            return dataArray.sort(sorterForDataForList);
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

    function sorterForDataForList(a: DataForMoveRangeRenderer, b: DataForMoveRangeRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForInfoRenderer = {
        index       : number;
        infoType    : TileInfoType;
        tile        : BwTile;
        war         : TwnsBwWar.BwWar;
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
            if (infoType === TileInfoType.DefenseBonus) {
                this._modifyAsDefenseBonus();
            } else if (infoType === TileInfoType.Income) {
                this._modifyAsIncome();
            } else if (infoType === TileInfoType.Vision) {
                this._modifyAsVision();
            } else if (infoType === TileInfoType.HideUnitCategory) {
                this._modifyAsHideUnitCategory();
            } else if (infoType === TileInfoType.IsDefeatedOnCapture) {
                this._modifyAsIsDefeatedOnCapture();
            } else if (infoType === TileInfoType.ProduceUnitCategory) {
                this._modifyAsProduceUnitCategory();
            } else if (infoType === TileInfoType.GlobalBonus) {
                this._modifyAsGlobalBonus();
            } else if (infoType === TileInfoType.RepairUnitCategory) {
                this._modifyAsRepairUnitCategory();
            } else if (infoType === TileInfoType.Hp) {
                this._modifyAsHp();
            } else if (infoType === TileInfoType.CapturePoint) {
                this._modifyAsCapturePoint();
            } else if (infoType === TileInfoType.BuildPoint) {
                this._modifyAsBuildPoint();
            } else {
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
            if (infoType === TileInfoType.DefenseBonus) {
                this._updateViewAsDefenseBonus();
            } else if (infoType === TileInfoType.Income) {
                this._updateViewAsIncome();
            } else if (infoType === TileInfoType.Vision) {
                this._updateViewAsVision();
            } else if (infoType === TileInfoType.HideUnitCategory) {
                this._updateViewAsHideUnitCategory();
            } else if (infoType === TileInfoType.IsDefeatedOnCapture) {
                this._updateViewAsIsDefeatedOnCapture();
            } else if (infoType === TileInfoType.ProduceUnitCategory) {
                this._updateViewAsProduceUnitCategory();
            } else if (infoType === TileInfoType.GlobalBonus) {
                this._updateViewAsGlobalBonus();
            } else if (infoType === TileInfoType.RepairUnitCategory) {
                this._updateViewAsRepairUnitCategory();
            } else if (infoType === TileInfoType.Hp) {
                this._updateViewAsHp();
            } else if (infoType === TileInfoType.CapturePoint) {
                this._updateViewAsCapturePoint();
            } else if (infoType === TileInfoType.BuildPoint) {
                this._updateViewAsBuildPoint();
            } else {
                throw Helpers.newError(`Invalid infoType: ${infoType}`);
            }
        }
        private _updateViewAsDefenseBonus(): void {
            const data                  = this._getData();
            const tile                  = data.tile;
            this._labelTitle.text       = Lang.getText(LangTextType.B0352);
            this._labelValue.text       = `${tile.getDefenseAmount()}`;
            this._groupExtra.visible    = true;
            this._labelExtraInfo.text   = Lang.getUnitCategoryName(tile.getDefenseUnitCategory()) ?? CommonConstants.ErrorTextForUndefined;
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
            const data                  = this._getData();
            const unitCategory          = data.tile.getCfgHideUnitCategory();
            this._labelTitle.text       = Lang.getText(LangTextType.B0356);
            this._labelValue.text       = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory) ?? CommonConstants.ErrorTextForUndefined);
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
            const data                  = this._getData();
            const unitCategory          = data.tile.getCfgProduceUnitCategory();
            this._labelTitle.text       = Lang.getText(LangTextType.B0358);
            this._labelValue.text       = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory) ?? CommonConstants.ErrorTextForUndefined);
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
            this._labelExtraInfo.text   = unitCategory == null ? `--` : (Lang.getUnitCategoryName(unitCategory) ?? CommonConstants.ErrorTextForUndefined);
            this._imgModify.visible     = false;
        }
        private _updateViewAsHp(): void {
            const { tile, war }         = this._getData();
            const currentHp             = tile.getCurrentHp();
            this._labelTitle.text       = Lang.getText(LangTextType.B0339);
            this._labelValue.text       = `${currentHp} / ${tile.getMaxHp()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (currentHp != null);
        }
        private _updateViewAsCapturePoint(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCurrentCapturePoint();
            this._labelTitle.text       = Lang.getText(LangTextType.B0361);
            this._labelValue.text       = `${currentValue} / ${tile.getMaxCapturePoint()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (currentValue != null);
        }
        private _updateViewAsBuildPoint(): void {
            const { tile, war }         = this._getData();
            const currentValue          = tile.getCurrentBuildPoint();
            this._labelTitle.text       = Lang.getText(LangTextType.B0362);
            this._labelValue.text       = `${currentValue} / ${tile.getMaxBuildPoint()}`;
            this._groupExtra.visible    = false;
            this._imgModify.visible     = (WarCommonHelpers.checkCanCheatInWar(war.getWarType())) && (currentValue != null);
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
            if (!WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = tile.getCurrentHp();
            const minValue  = 1;
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
                        tile.setCurrentHp(value);
                        tile.flushDataToView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsCapturePoint(): void {
            const { tile, war } = this._getData();
            const maxValue      = tile.getMaxCapturePoint();
            if (!WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = tile.getCurrentCapturePoint();
            const minValue  = 1;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0361),
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
                        tile.setCurrentCapturePoint(value);
                        tile.flushDataToView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
        private _modifyAsBuildPoint(): void {
            const { tile, war } = this._getData();
            const maxValue      = tile.getMaxBuildPoint();
            if (!WarCommonHelpers.checkCanCheatInWar(war.getWarType()) || (maxValue == null)) {
                return;
            }

            const currValue = tile.getCurrentBuildPoint();
            const minValue  = 1;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputPanel, {
                title           : Lang.getText(LangTextType.B0362),
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
                        tile.setCurrentBuildPoint(value);
                        tile.flushDataToView();
                        this._updateView();
                    }
                },
            });
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }
    }

    type DataForMoveRangeRenderer = {
        index           : number;
        configVersion   : string;
        unitType        : UnitType;
        tileCfg         : ProtoTypes.Config.ITileTemplateCfg;
        playerIndex     : number;
    };
    class MoveCostRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMoveRangeRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _imgBg!            : TwnsUiImage.UiImage;
        private readonly _conView!          : eui.Group;
        private readonly _unitView          = new TwnsWarMapUnitView.WarMapUnitView();
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
            const configVersion         = data.configVersion;
            const unitType              = data.unitType;
            const moveCostCfg           = ConfigManager.getMoveCostCfgByTileType(configVersion, Helpers.getExisted(data.tileCfg.type));
            const moveCost              = moveCostCfg[ConfigManager.getUnitTemplateCfg(configVersion, unitType).moveType].cost;
            this._imgBg.visible         = data.index % 8 < 4;
            this._labelMoveCost.text    = moveCost != null ? `${moveCost}` : `--`;
            this._unitView.update({
                gridIndex       : { x: 0, y: 0 },
                playerIndex     : data.playerIndex,
                unitType        : data.unitType,
                actionState     : Types.UnitActionState.Idle,
            }, Timer.getUnitAnimationTickCount());
        }
    }
}

// export default TwnsBwTileDetailPanel;
