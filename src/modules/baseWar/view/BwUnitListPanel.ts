
import TwnsBwUnit               from "../../baseWar/model/BwUnit";
import TwnsBwWar                from "../../baseWar/model/BwWar";
import CommonModel              from "../../common/model/CommonModel";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsBwCursor             from "../model/BwCursor";
import TwnsBwUnitMap            from "../model/BwUnitMap";
import TwnsBwUnitView           from "./BwUnitView";

namespace TwnsBwUnitListPanel {
    import BwUnitView       = TwnsBwUnitView.BwUnitView;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import BwUnitMap        = TwnsBwUnitMap.BwUnitMap;
    import BwWar            = TwnsBwWar.BwWar;
    import BwCursor         = TwnsBwCursor.BwCursor;

    type OpenDataForBwUnitListPanel = {
        war : BwWar;
    };
    export class BwUnitListPanel extends TwnsUiPanel.UiPanel<OpenDataForBwUnitListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitListPanel;

        private readonly _group             : eui.Group;
        private readonly _labelName         : TwnsUiLabel.UiLabel;
        private readonly _labelCountName    : TwnsUiLabel.UiLabel;
        private readonly _labelValueName    : TwnsUiLabel.UiLabel;
        private readonly _listUnit          : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _labelCount        : TwnsUiLabel.UiLabel;
        private readonly _labelValue        : TwnsUiLabel.UiLabel;
        private readonly _btnSwitch         : TwnsUiButton.UiButton;

        private _cursor         : BwCursor;
        private _unitMap        : BwUnitMap;
        private _dataForList    : DataForUnitRenderer[];
        private _playerIndex    : number;

        public static show(openData: OpenDataForBwUnitListPanel): void {
            if (!BwUnitListPanel._instance) {
                BwUnitListPanel._instance = new BwUnitListPanel();
            }
            BwUnitListPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwUnitListPanel._instance) {
                await BwUnitListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = `resource/skins/baseWar/BwUnitListPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: NotifyType.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
                { type: NotifyType.BwWarMenuPanelOpened,           callback: this._onNotifyBwWarMenuPanelOpened },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSwitch, callback: this._onTouchedBtnSwitch },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);

            const war           = this._getOpenData().war;
            this._unitMap       = war.getUnitMap();
            this._cursor        = war.getCursor();
            this._playerIndex   = war.getPlayerIndexInTurn();
            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            this._unitMap       = null;
            this._cursor        = null;
            this._dataForList   = null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyGlobalTouchBegin(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyGlobalTouchMove(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }
        private _onNotifyBwWarMenuPanelOpened(e: egret.Event): void {
            this.close();
        }

        private _onTouchedBtnSwitch(e: egret.TouchEvent): void {
            this._playerIndex = this._getOpenData().war.getTurnManager().getNextPlayerIndex(this._playerIndex);
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelCountName.text   = `${Lang.getText(LangTextType.B0160)}:`;
            this._labelValueName.text   = `${Lang.getText(LangTextType.B0161)}:`;
            this._labelName.text        = Lang.getText(LangTextType.B0152);
            this._btnSwitch.label       = Lang.getText(LangTextType.B0244);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._dataForList = this._createDataForList();
            this._listUnit.bindData(this._dataForList);
            this._labelCount.text = `${this._dataForList.length}`;

            let value = 0;
            for (const data of this._dataForList) {
                const unit = data.unit;
                value += unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
            }
            this._labelValue.text = `${value}`;
        }

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
            // do nothing
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const dataList      : DataForUnitRenderer[]= [];
            const playerIndex   = this._playerIndex;
            for (const unit of this._unitMap.getAllUnits()) {
                if (unit.getPlayerIndex() === playerIndex) {
                    dataList.push({
                        cursor  : this._cursor,
                        unit    : unit,
                    });
                }
            }
            return dataList.sort(sorterForDataForList);
        }
    }

    function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
        const unitA     = a.unit;
        const unitB     = b.unit;
        const stateA    = unitA.getActionState();
        const stateB    = unitB.getActionState();
        if ((stateA === Types.UnitActionState.Idle) && (stateB !== Types.UnitActionState.Idle)) {
            return -1;
        } else if ((stateA !== Types.UnitActionState.Idle) && (stateB === Types.UnitActionState.Idle)) {
            return 1;
        } else {
            return unitA.getUnitType() - unitB.getUnitType();
        }
    }

    const _IMAGE_SOURCE_HP          = `c03_t99_s02_f03`;
    const _IMAGE_SOURCE_FUEL        = `c03_t99_s02_f01`;
    const _IMAGE_SOURCE_AMMO        = `c03_t99_s02_f02`;
    const _IMAGE_SOURCE_MATERIAL    = `c03_t99_s02_f04`;
    const _IMAGE_SOURCE_FLARE       = `c03_t99_s02_f02`;

    type DataForUnitRenderer = {
        unit    : TwnsBwUnit.BwUnit;
        cursor  : BwCursor;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private _group          : eui.Group;
        private _conUnitView    : eui.Group;
        private _labelName      : TwnsUiLabel.UiLabel;
        private _labelGridIndex : TwnsUiLabel.UiLabel;
        private _labelHp        : TwnsUiLabel.UiLabel;
        private _labelFuel      : TwnsUiLabel.UiLabel;
        private _labelState     : TwnsUiLabel.UiLabel;
        private _imgHp          : TwnsUiImage.UiImage;
        private _imgFuel        : TwnsUiImage.UiImage;
        private _imgState       : TwnsUiImage.UiImage;
        private _unitView       : BwUnitView;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._imgHp.source      = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_HP;
            this._imgFuel.source    = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FUEL;
            this._unitView          = new BwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data      = this.data;
            const cursor    = data.cursor;
            const gridIndex = data.unit.getGridIndex();
            cursor.setGridIndex(gridIndex);
            cursor.updateView();
            cursor.getWar().getView().tweenGridToCentralArea(gridIndex);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const unit = this.data.unit;
            this._unitView.init(unit).startRunningView();
            this._labelHp.text          = `${unit.getCurrentHp()}`;
            this._labelFuel.text        = `${unit.getCurrentFuel()}`;
            this._labelName.text        = Lang.getUnitName(unit.getUnitType());
            this._labelGridIndex.text   = `x${unit.getGridX()} y${unit.getGridY()}`;

            if (unit.getCurrentBuildMaterial() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_MATERIAL;
                this._labelState.visible    = true;
                this._labelState.text       = `${unit.getCurrentBuildMaterial()}`;
            } else if (unit.getCurrentProduceMaterial() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_MATERIAL;
                this._labelState.visible    = true;
                this._labelState.text       = `${unit.getCurrentProduceMaterial()}`;
            } else if (unit.getFlareCurrentAmmo() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FLARE;
                this._labelState.visible    = true;
                this._labelState.text       = `${unit.getFlareCurrentAmmo()}`;
            } else if (unit.getPrimaryWeaponCurrentAmmo() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_AMMO;
                this._labelState.visible    = true;
                this._labelState.text       = `${unit.getPrimaryWeaponCurrentAmmo()}`;
            } else {
                this._imgState.visible      = false;
                this._labelState.visible    = false;
            }
        }
    }
}

export default TwnsBwUnitListPanel;
