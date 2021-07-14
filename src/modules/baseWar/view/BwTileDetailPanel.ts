
import CommonModel              from "../../common/model/CommonModel";
import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import FloatText                from "../../tools/helpers/FloatText";
import Timer                    from "../../tools/helpers/Timer";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import UserModel                from "../../user/model/UserModel";
import TwnsWarMapUnitView       from "../../warMap/view/WarMapUnitView";
import TwnsBwTile               from "../model/BwTile";

namespace TwnsBwTileDetailPanel {
    import WarMapUnitView   = TwnsWarMapUnitView.WarMapUnitView;
    import BwTile           = TwnsBwTile.BwTile;
    import CommonInputPanel = TwnsCommonInputPanel.CommonInputPanel;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import UnitType         = Types.UnitType;

    type OpenDataForBwTileDetailPanel = {
        tile    : BwTile;
    };

    const { height: GRID_HEIGHT } = CommonConstants.GridSize;

    export class BwTileDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForBwTileDetailPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwTileDetailPanel;

        private _group              : eui.Group;
        private _labelName          : TwnsUiLabel.UiLabel;
        private _imgTileBase        : TwnsUiImage.UiImage;
        private _imgTileObject      : TwnsUiImage.UiImage;
        private _listInfo           : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;
        private _labelMoveCost      : TwnsUiLabel.UiLabel;
        private _listMoveCost       : TwnsUiScrollList.UiScrollList<DataForMoveRangeRenderer>;

        private _dataForListMoveCost: DataForMoveRangeRenderer[];

        public static show(openData: OpenDataForBwTileDetailPanel): void {
            if (!BwTileDetailPanel._instance) {
                BwTileDetailPanel._instance = new BwTileDetailPanel();
            }
            BwTileDetailPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwTileDetailPanel._instance) {
                await BwTileDetailPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = BwTileDetailPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/baseWar/BwTileDetailPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._listInfo.setItemRenderer(InfoRenderer);
            this._listMoveCost.setItemRenderer(MoveCostRenderer);

            this._imgTileObject.anchorOffsetY = GRID_HEIGHT;

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            this._dataForListMoveCost = null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
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
            this._labelMoveCost.text = Lang.getText(LangTextType.B0351);
            this._updateListMoveCost();
        }

        private _updateTileViewAndLabelName(): void {
            const data                  = this._getOpenData();
            const tile                  = data.tile;
            const version               = UserModel.getSelfSettingsTextureVersion();
            const tickCount             = Timer.getTileAnimationTickCount();
            const skinId                = tile.getSkinId();
            this._imgTileBase.source    = CommonModel.getCachedTileBaseImageSource({
                version,
                skinId,
                baseType    : tile.getBaseType(),
                isDark      : false,
                shapeId     : tile.getBaseShapeId(),
                tickCount,
            });
            this._imgTileObject.source  = CommonModel.getCachedTileObjectImageSource({
                version,
                skinId,
                objectType  : tile.getObjectType(),
                isDark      : false,
                shapeId     : tile.getObjectShapeId(),
                tickCount,
            });
            this._labelName.text        = Lang.getTileName(tile.getType());
        }

        private _updateListInfo(): void {
            const data                  = this._getOpenData();
            const tile                  = data.tile;
            const configVersion         = tile.getConfigVersion();
            const tileType              = tile.getType();
            const cfg                   = ConfigManager.getTileTemplateCfgByType(configVersion, tileType);
            const defenseBonus          = cfg.defenseAmount;
            const income                = cfg.incomePerTurn;
            const visionRange           = cfg.visionRange;
            const hideCategory          = cfg.hideUnitCategory;
            const globalAttackBonus     = cfg.globalAttackBonus;
            const globalDefenseBonus    = cfg.globalDefenseBonus;
            const repairAmount          = cfg.repairAmount;
            const war                   = tile.getWar();
            const isCheating            = war.getCanCheat();

            const dataList: DataForInfoRenderer[] = [
                {
                    titleText               : Lang.getText(LangTextType.B0352),
                    valueText               : defenseBonus ? `${defenseBonus}(${Lang.getUnitCategoryName(cfg.defenseUnitCategory)})` : `--`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    titleText               : Lang.getText(LangTextType.B0353),
                    valueText               : `${income != null ? income : `--`}`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    titleText               : Lang.getText(LangTextType.B0354),
                    valueText               : visionRange != null
                        ? `${visionRange}${cfg.isVisionEnabledForAllPlayers ? `(${Lang.getText(LangTextType.B0355)})`: ``}`
                        : `--`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    titleText               : Lang.getText(LangTextType.B0356),
                    valueText               : `${hideCategory != null ? Lang.getUnitCategoryName(hideCategory) : `--`}`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    titleText               : Lang.getText(LangTextType.B0357),
                    valueText               : cfg.isDefeatedOnCapture ? Lang.getText(LangTextType.B0012) : Lang.getText(LangTextType.B0013),
                    callbackOnTouchedTitle  : null,
                },
                {
                    titleText               : Lang.getText(LangTextType.B0358),
                    valueText               : cfg.produceUnitCategory
                        ? Lang.getUnitCategoryName(cfg.produceUnitCategory)
                        : Lang.getText(LangTextType.B0013),
                    callbackOnTouchedTitle  : null,
                },
                {
                    titleText               : Lang.getText(LangTextType.B0359),
                    valueText               : `${globalAttackBonus == null ? `--` : globalAttackBonus + "%"} / ${globalDefenseBonus == null ? `--` : globalDefenseBonus + "%"}`,
                    callbackOnTouchedTitle  : null,
                },
                {
                    titleText               : Lang.getText(LangTextType.B0360),
                    valueText               : repairAmount != null ? `${repairAmount}(${Lang.getUnitCategoryName(cfg.repairUnitCategory)})` : `--`,
                    callbackOnTouchedTitle  : null,
                },
                this._createInfoHp(tile, isCheating),
                this._createInfoCapturePoint(tile, isCheating),
                this._createInfoBuildPoint(tile, isCheating),
            ].filter(v => !!v);

            this._listInfo.bindData(dataList);
        }

        private _createInfoHp(tile: BwTile, isCheating: boolean): DataForInfoRenderer | null {
            const maxValue  = tile.getMaxHp();
            if (maxValue == null) {
                return null;
            } else {
                const currValue = tile.getCurrentHp();
                const minValue  = 1;
                return {
                    titleText               : Lang.getText(LangTextType.B0339),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            CommonInputPanel.show({
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
                                        this._updateListInfo();
                                    }
                                },
                            });
                        },
                };
            }
        }

        private _createInfoCapturePoint(tile: BwTile, isCheating: boolean): DataForInfoRenderer | null {
            const maxValue  = tile.getMaxCapturePoint();
            if (maxValue == null) {
                return null;
            } else {
                const currValue = tile.getCurrentCapturePoint();
                const minValue  = 1;
                return {
                    titleText               : Lang.getText(LangTextType.B0361),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            CommonInputPanel.show({
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
                                        this._updateListInfo();
                                    }
                                },
                            });
                        },
                };
            }
        }

        private _createInfoBuildPoint(tile: BwTile, isCheating: boolean): DataForInfoRenderer | null {
            const maxValue  = tile.getMaxBuildPoint();
            if (maxValue == null) {
                return null;
            } else {
                const currValue = tile.getCurrentBuildPoint();
                const minValue  = 1;
                return {
                    titleText               : Lang.getText(LangTextType.B0362),
                    valueText               : `${currValue} / ${maxValue}`,
                    callbackOnTouchedTitle  : !isCheating
                        ? null
                        : () => {
                            CommonInputPanel.show({
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
                                        this._updateListInfo();
                                    }
                                },
                            });
                        },
                };
            }
        }

        private _updateListMoveCost(): void {
            this._dataForListMoveCost = this._createDataForListMoveCost();
            this._listMoveCost.bindData(this._dataForListMoveCost);
        }

        private _createDataForListMoveCost(): DataForMoveRangeRenderer[] {
            const openData          = this._getOpenData();
            const tile              = openData.tile;
            const configVersion     = tile.getConfigVersion();
            const tileCfg           = ConfigManager.getTileTemplateCfgByType(configVersion, tile.getType());
            const playerIndex       = tile.getPlayerIndex() || 1;

            const dataList: DataForMoveRangeRenderer[] = [];
            for (const unitType of ConfigManager.getUnitTypesByCategory(configVersion, Types.UnitCategory.All)) {
                dataList.push({
                    configVersion,
                    unitType,
                    tileCfg,
                    playerIndex,
                });
            }

            return dataList.sort(sorterForDataForList);
        }
    }

    function sorterForDataForList(a: DataForMoveRangeRenderer, b: DataForMoveRangeRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForInfoRenderer = {
        titleText               : string;
        valueText               : string;
        callbackOnTouchedTitle  : (() => void) | null;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private _btnTitle   : TwnsUiButton.UiButton;
        private _labelValue : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnTitle, callback: this._onTouchedBtnTitle },
            ]);
        }

        protected _onDataChanged(): void {
            const data              = this.data;
            this._btnTitle.label    = data.titleText;
            this._labelValue.text   = data.valueText;
            this._btnTitle.setTextColor(data.callbackOnTouchedTitle ? 0x00FF00 : 0xFFFFFF);
        }

        private _onTouchedBtnTitle(e: egret.TouchEvent): void {
            const data      = this.data;
            const callback  = data ? data.callbackOnTouchedTitle : null;
            (callback) && (callback());
        }
    }

    type DataForMoveRangeRenderer = {
        configVersion   : string;
        unitType        : UnitType;
        tileCfg         : ProtoTypes.Config.ITileTemplateCfg;
        playerIndex     : number;
    };
    class MoveCostRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMoveRangeRenderer> {
        private _group          : eui.Group;
        private _conView        : eui.Group;
        private _unitView       : WarMapUnitView;
        private _labelMoveCost  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._unitView = new WarMapUnitView();
            this._conView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
            }
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data                  = this.data;
            const configVersion         = data.configVersion;
            const unitType              = data.unitType;
            const moveCostCfg           = ConfigManager.getMoveCostCfgByTileType(configVersion, data.tileCfg.type);
            const moveCost              = moveCostCfg[ConfigManager.getUnitTemplateCfg(configVersion, unitType).moveType].cost;
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

export default TwnsBwTileDetailPanel;
