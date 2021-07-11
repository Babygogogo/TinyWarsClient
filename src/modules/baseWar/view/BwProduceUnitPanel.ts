

import * as Notify              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Types               from "../../../utility/Types";
import * as FloatText           from "../../../utility/FloatText";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as ConfigManager       from "../../../utility/ConfigManager";
import * as Helpers             from "../../../utility/Helpers";
import * as BwHelpers           from "../model/BwHelpers";
import { BwUnit }               from "../model/BwUnit";
import { BwWar }                from "../model/BwWar";
import { BwUnitDetailPanel }    from "./BwUnitDetailPanel";
import { BwUnitView }           from "./BwUnitView";
import { UiImage }              from "../../../gameui/UiImage";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiScrollList }         from "../../../gameui/UiScrollList";
import { UiButton }             from "../../../gameui/UiButton";
import { UiListItemRenderer }   from "../../../gameui/UiListItemRenderer";
import { UiLabel }              from "../../../gameui/UiLabel";
import { BwActionPlanner }      from "../model/BwActionPlanner";
import { CommonInputPanel }     from "../../common/view/CommonInputPanel";
import UnitType                 = Types.UnitType;
import GridIndex                = Types.GridIndex;

type OpenDataForBwProduceUnitPanel = {
    gridIndex   : GridIndex;
    war         : BwWar;
};
export class BwProduceUnitPanel extends UiPanel<OpenDataForBwProduceUnitPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: BwProduceUnitPanel;

    private _imgMask    : UiImage;
    private _group      : eui.Group;
    private _listUnit   : UiScrollList<DataForUnitRenderer>;
    private _btnCancel  : UiButton;
    private _btnDetail  : UiButton;

    private _dataForList: DataForUnitRenderer[];

    public static show(openData: OpenDataForBwProduceUnitPanel): void {
        if (!BwProduceUnitPanel._instance) {
            BwProduceUnitPanel._instance = new BwProduceUnitPanel();
        }
        BwProduceUnitPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (BwProduceUnitPanel._instance) {
            await BwProduceUnitPanel._instance.close();
        }
    }
    public static getIsOpening(): boolean {
        const instance = BwProduceUnitPanel._instance;
        return instance ? instance.getIsOpening() : false;
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = `resource/skins/baseWar/BwProduceUnitPanel.exml`;
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
            { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
        ]);
        this._listUnit.setItemRenderer(UnitRenderer);

        this._showOpenAnimation();

        this._updateView();

        Notify.dispatch(NotifyType.BwProduceUnitPanelOpened);
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();

        this._dataForList = null;

        Notify.dispatch(NotifyType.BwProduceUnitPanelClosed);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyBwPlannerStateChanged(): void {
        this.close();
    }

    private _onTouchedBtnCancel(): void {
        this._getOpenData().war.getActionPlanner().setStateIdle();
    }
    private _onTouchedBtnDetail(): void {
        const selectedIndex = this._listUnit.getSelectedIndex();
        const data          = selectedIndex != null ? this._dataForList[selectedIndex] : null;
        if (data) {
            BwUnitDetailPanel.show({
                unit  : data.unit,
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._dataForList = this._createDataForList();
        this._listUnit.bindData(this._dataForList);
    }

    private _updateComponentsForLanguage(): void {
        this._btnCancel.label = Lang.getText(LangTextType.B0154);
        this._btnDetail.label = Lang.getText(LangTextType.B0267);
    }

    private _createDataForList(): DataForUnitRenderer[] {
        const dataList          : DataForUnitRenderer[] = [];
        const openData          = this._getOpenData();
        const war               = openData.war;
        const gridIndex         = openData.gridIndex;
        const tile              = war.getTileMap().getTile(gridIndex);
        const player            = tile.getPlayer();
        const currentFund       = player.getFund();
        const playerIndex       = player.getPlayerIndex();
        const configVersion     = war.getConfigVersion();
        const actionPlanner     = war.getActionPlanner();
        const skillCfg          = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const unitCategory      = skillCfg ? skillCfg[1] : tile.getCfgProduceUnitCategory();
        const minNormalizedHp   = skillCfg ? BwHelpers.getNormalizedHp(skillCfg[3]) : BwHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);

        for (const unitType of ConfigManager.getUnitTypesByCategory(configVersion, unitCategory)) {
            const unit = new BwUnit();
            unit.init({
                gridIndex   : { x: -1, y: -1 },
                unitId      : -1,
                unitType,
                playerIndex,
            }, configVersion);
            unit.startRunning(war);
            const cfgCost = ConfigManager.getUnitTemplateCfg(configVersion, unitType).productionCost;
            dataList.push({
                unitType,
                currentFund,
                actionPlanner,
                gridIndex,
                unit,
                cfgCost,
                unitProductionSkillCfg  : skillCfg,
                minCost                 : skillCfg
                    ? Math.floor(cfgCost * minNormalizedHp * skillCfg[5] / CommonConstants.UnitHpNormalizer / 100)
                    : cfgCost,
                panel: this,
            });
        }

        return dataList.sort(sorterForDataForList);
    }

    private _showOpenAnimation(): void {
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
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>(resolve => {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
                callback    : resolve,
            });
        });
    }
}

function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
    return a.unitType - b.unitType;
}

type DataForUnitRenderer = {
    unitType                : UnitType;
    unit                    : BwUnit;
    minCost                 : number;
    cfgCost                 : number;
    currentFund             : number;
    actionPlanner           : BwActionPlanner;
    gridIndex               : GridIndex;
    unitProductionSkillCfg  : number[] | null;
    panel                   : BwProduceUnitPanel;
};

class UnitRenderer extends UiListItemRenderer<DataForUnitRenderer> {
    private _group          : eui.Group;
    private _imgBg          : UiImage;
    private _conUnitView    : eui.Group;
    private _labelName      : UiLabel;
    private _labelCost      : UiLabel;
    private _labelProduce   : UiLabel;
    private _unitView       : BwUnitView;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
        ]);

        this._imgBg.touchEnabled = true;
        this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);

        this._unitView = new BwUnitView();
        this._conUnitView.addChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        if (this.data) {
            this._unitView.tickUnitAnimationFrame();
            this._unitView.tickStateAnimationFrame();
        }
    }

    private _onNotifyLanguageChanged(): void {
        (this.data) && (this._updateView());
    }

    protected _onDataChanged(): void {
        this._updateView();
    }

    private _onTouchedImgBg(): void {
        const data = this.data;
        if (data.currentFund < data.minCost) {
            FloatText.show(Lang.getText(LangTextType.B0053));
            return;
        }

        if (!data.panel.getIsOpening()) {
            return;
        }

        const actionPlanner = data.actionPlanner;
        if (actionPlanner.checkIsStateRequesting()) {
            return;
        }

        const skillCfg  = data.unitProductionSkillCfg;
        const unitType  = data.unitType;
        const gridIndex = data.gridIndex;
        if (!skillCfg) {
            actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, CommonConstants.UnitMaxHp);
        } else {
            const rawMinHp = skillCfg[3];
            const rawMaxHp = skillCfg[4];
            if (rawMinHp === rawMaxHp) {
                actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, rawMinHp);
            } else {
                const normalizer    = CommonConstants.UnitHpNormalizer;
                const minHp         = rawMinHp;
                const maxHp         = Math.min(
                    rawMaxHp,
                    Math.floor(data.currentFund * CommonConstants.UnitMaxHp / (data.cfgCost * skillCfg[5] / 100) / normalizer) * normalizer
                );
                CommonInputPanel.show({
                    title           : `${Lang.getUnitName(unitType)} HP`,
                    currentValue    : "" + maxHp,
                    maxChars        : 3,
                    charRestrict    : "0-9",
                    tips            : `${Lang.getText(LangTextType.B0319)}: [${minHp}, ${maxHp}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if ((isNaN(value)) || (value > maxHp) || (value < minHp)) {
                            FloatText.show(Lang.getText(LangTextType.A0098));
                        } else {
                            actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, value);
                        }
                    },
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const data = this.data;

        const unitType                  = data.unitType;
        const isFundEnough              = data.currentFund >= data.minCost;
        this._labelCost.text            = `${Lang.getText(LangTextType.B0079)}: ${data.minCost}`;
        this._labelCost.textColor       = isFundEnough ? 0x00FF00 : 0xFF0000;
        this._labelName.text            = Lang.getUnitName(unitType);
        this._labelProduce.textColor    = isFundEnough ? 0x00FF00 : 0xFF0000;
        this._labelProduce.text         = Lang.getText(LangTextType.B0095);

        this._unitView.init(data.unit).startRunningView();
    }
}
