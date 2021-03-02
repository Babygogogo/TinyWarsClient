
namespace TinyWars.SingleCustomWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import CommonModel  = Common.CommonModel;

    const _LEFT_X   = 0;
    const _RIGHT_X  = 820;

    export class BwUnitListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitListPanel;

        private _group      : eui.Group;
        private _listUnit   : GameUi.UiScrollList;
        private _labelCount : GameUi.UiLabel;
        private _labelValue : GameUi.UiLabel;
        private _btnSwitch  : GameUi.UiButton;

        private _war        : ScwWar;
        private _cursor     : BaseWar.BwCursor;
        private _unitMap    : ScwUnitMap;
        private _turnManager: ScwTurnManager;
        private _dataForList: DataForUnitRenderer[];
        private _playerIndex: number;
        private _isLeftSide = false;

        public static show(): void {
            if (!BwUnitListPanel._instance) {
                BwUnitListPanel._instance = new BwUnitListPanel();
            }
            BwUnitListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (BwUnitListPanel._instance) {
                await BwUnitListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = `resource/skins/multiCustomWar/McwUnitListPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
                { type: Notify.Type.McwWarMenuPanelOpened,          callback: this._onNotifyMcwWarMenuPanelOpened },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSwitch, callback: this._onTouchedBtnSwitch },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);

            const war           = ScwModel.getWar();
            this._war           = war;
            this._unitMap       = war.getUnitMap() as ScwUnitMap;
            this._turnManager   = war.getTurnManager() as ScwTurnManager;
            this._cursor        = war.getField().getCursor();
            this._playerIndex   = this._war.getPlayerIndexInTurn();
            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            this._war           = null;
            this._unitMap       = null;
            this._cursor        = null;
            this._dataForList   = null;
            this._listUnit.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyGlobalTouchBegin(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyGlobalTouchMove(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewList = this._listUnit.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof UnitRenderer) && (child.updateOnUnitAnimationTick());
            }
        }
        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }
        private _onNotifyMcwWarMenuPanelOpened(e: egret.Event): void {
            this.close();
        }

        private _onTouchedBtnSwitch(e: egret.TouchEvent): void {
            this._playerIndex = this._turnManager.getNextPlayerIndex(this._playerIndex);
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._dataForList = this._createDataForList();
            this._listUnit.bindData(this._dataForList);
            this._labelCount.text = `${this._dataForList.length}`;

            let value = 0;
            for (const data of this._dataForList) {
                const unit = data.unit;
                value += unit.getProductionBaseCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
            }
            this._labelValue.text = `${value}`;
        }

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const datas         = [] as DataForUnitRenderer[];
            const playerIndex   = this._playerIndex;
            this._unitMap.forEachUnit(unit => {
                if (unit.getPlayerIndex() === playerIndex) {
                    datas.push({
                        cursor  : this._cursor,
                        unit    : unit as ScwUnit,
                    });
                }
            });
            return datas.sort(sorterForDataForList);
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
            return unitA.getType() - unitB.getType();
        }
    }

    const _IMAGE_SOURCE_HP          = `c03_t99_s02_f03`;
    const _IMAGE_SOURCE_FUEL        = `c03_t99_s02_f01`;
    const _IMAGE_SOURCE_AMMO        = `c03_t99_s02_f02`;
    const _IMAGE_SOURCE_MATERIAL    = `c03_t99_s02_f04`;
    const _IMAGE_SOURCE_FLARE       = `c03_t99_s02_f02`;

    type DataForUnitRenderer = {
        unit    : ScwUnit;
        cursor  : BaseWar.BwCursor;
    }

    class UnitRenderer extends GameUi.UiListItemRenderer {
        private _group          : eui.Group;
        private _conUnitView    : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _labelGridIndex : GameUi.UiLabel;
        private _labelHp        : GameUi.UiLabel;
        private _labelFuel      : GameUi.UiLabel;
        private _labelState     : GameUi.UiLabel;
        private _imgHp          : GameUi.UiImage;
        private _imgFuel        : GameUi.UiImage;
        private _imgState       : GameUi.UiImage;
        private _unitView       : BaseWar.BwUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._imgHp.source      = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_HP;
            this._imgFuel.source    = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FUEL;
            this._unitView          = new BaseWar.BwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        public updateOnUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            const data      = this.data as DataForUnitRenderer;
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
            const unit = (this.data as DataForUnitRenderer).unit;
            this._unitView.init(unit).startRunningView();
            this._labelHp.text          = `${unit.getCurrentHp()}`;
            this._labelFuel.text        = `${unit.getCurrentFuel()}`;
            this._labelName.text        = Lang.getUnitName(unit.getType());
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
