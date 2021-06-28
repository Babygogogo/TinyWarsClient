
namespace TinyWars.BaseWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import CommonModel  = Common.CommonModel;

    const _LEFT_X   = 0;
    const _RIGHT_X  = 820;

    type OpenDataForBwUnitListPanel = {
        war : BwWar;
    };
    export class BwUnitListPanel extends GameUi.UiPanel<OpenDataForBwUnitListPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitListPanel;

        private readonly _group             : eui.Group;
        private readonly _labelName         : GameUi.UiLabel;
        private readonly _labelCountName    : GameUi.UiLabel;
        private readonly _labelValueName    : GameUi.UiLabel;
        private readonly _listUnit          : GameUi.UiScrollList<DataForUnitRenderer>;
        private readonly _labelCount        : GameUi.UiLabel;
        private readonly _labelValue        : GameUi.UiLabel;
        private readonly _btnSwitch         : GameUi.UiButton;

        private _cursor         : BaseWar.BwCursor;
        private _unitMap        : BaseWar.BwUnitMap;
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
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
                { type: Notify.Type.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
                { type: Notify.Type.BwWarMenuPanelOpened,           callback: this._onNotifyBwWarMenuPanelOpened },
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
            this._labelCountName.text   = `${Lang.getText(Lang.Type.B0160)}:`;
            this._labelValueName.text   = `${Lang.getText(Lang.Type.B0161)}:`;
            this._labelName.text        = Lang.getText(Lang.Type.B0152);
            this._btnSwitch.label       = Lang.getText(Lang.Type.B0244);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

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
        unit    : BaseWar.BwUnit;
        cursor  : BaseWar.BwCursor;
    };

    class UnitRenderer extends GameUi.UiListItemRenderer<DataForUnitRenderer> {
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

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._imgHp.source      = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_HP;
            this._imgFuel.source    = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FUEL;
            this._unitView          = new BaseWar.BwUnitView();
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
