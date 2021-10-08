
import TwnsBwUnit               from "../../baseWar/model/BwUnit";
import TwnsBwWar                from "../../baseWar/model/BwWar";
import CommonModel              from "../../common/model/CommonModel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
import SoundManager             from "../../tools/helpers/SoundManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import Notify                   from "../../tools/notify/Notify";
import NotifyData               from "../../tools/notify/NotifyData";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsBwCursor             from "../model/BwCursor";
import TwnsBwUnitView           from "./BwUnitView";

namespace TwnsBwUnitListPanel {
    import BwUnitView       = TwnsBwUnitView.BwUnitView;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import BwWar            = TwnsBwWar.BwWar;
    import BwCursor         = TwnsBwCursor.BwCursor;

    type OpenDataForBwUnitListPanel = {
        war : BwWar;
    };
    export class BwUnitListPanel extends TwnsUiPanel.UiPanel<OpenDataForBwUnitListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitListPanel;

        private readonly _group!            : eui.Group;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;
        private readonly _labelCountName!   : TwnsUiLabel.UiLabel;
        private readonly _labelValueName!   : TwnsUiLabel.UiLabel;
        private readonly _listUnit!         : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _labelCount!       : TwnsUiLabel.UiLabel;
        private readonly _labelValue!       : TwnsUiLabel.UiLabel;
        private readonly _btnSwitch!        : TwnsUiButton.UiButton;

        private _playerIndex    : number | null = null;

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

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/baseWar/BwUnitListPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateChanged, callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSwitch, callback: this._onTouchedBtnSwitch },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);

            const war           = this._getOpenData().war;
            this._playerIndex   = war.getPlayerIndexInTurn();
            this._updateView();
        }

        public getSelectedData(): DataForUnitRenderer | null {
            return this._listUnit.getSelectedData();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyBwPlannerStateChanged(): void {
            this._updateComponentsForUnits();
        }

        private _onTouchedBtnSwitch(): void {
            const playerIndex = this._playerIndex;
            if (playerIndex != null) {
                this._playerIndex = this._getOpenData().war.getTurnManager().getNextPlayerIndex(playerIndex);
                this._updateComponentsForUnits();
            }
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
            this._updateComponentsForUnits();
        }

        private _updateComponentsForUnits(): void {
            const dataArray = this._createDataForList();
            this._listUnit.bindData(dataArray);
            this._labelCount.text = `${dataArray.length}`;

            let value = 0;
            for (const data of dataArray) {
                const unit = data.unit;
                value += unit.getProductionFinalCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
            }
            this._labelValue.text = `${value}`;
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const war           = this._getOpenData().war;
            const cursor        = war.getCursor();
            const dataList      : DataForUnitRenderer[]= [];
            const playerIndex   = this._playerIndex;
            for (const unit of war.getUnitMap().getAllUnits()) {
                if (unit.getPlayerIndex() === playerIndex) {
                    dataList.push({
                        cursor,
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
        private readonly _group!            : eui.Group;
        private readonly _conUnitView!      : eui.Group;
        private readonly _labelName!        : TwnsUiLabel.UiLabel;
        private readonly _labelGridIndex!   : TwnsUiLabel.UiLabel;
        private readonly _labelHp!          : TwnsUiLabel.UiLabel;
        private readonly _labelFuel!        : TwnsUiLabel.UiLabel;
        private readonly _labelState!       : TwnsUiLabel.UiLabel;
        private readonly _imgHp!            : TwnsUiImage.UiImage;
        private readonly _imgFuel!          : TwnsUiImage.UiImage;
        private readonly _imgState!         : TwnsUiImage.UiImage;
        private readonly _unitView          = new BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);

            this._imgHp.source      = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_HP;
            this._imgFuel.source    = CommonModel.getUnitAndTileTexturePrefix() + _IMAGE_SOURCE_FUEL;
            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
            }
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            if (this.data) {
                this._unitView.tickStateAnimationFrame();
            }
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(): void {
            const data      = this._getData();
            const cursor    = data.cursor;
            const war       = cursor.getWar();
            if ((war.getIsExecutingAction()) || (war.getActionPlanner().checkIsStateRequesting())) {
                return;
            }

            const gridIndex = data.unit.getGridIndex();
            if (GridIndexHelpers.checkIsEqual(gridIndex, cursor.getGridIndex())) {
                Notify.dispatch(NotifyType.BwCursorTapped, {
                    current : gridIndex,
                    tappedOn: gridIndex,
                } as NotifyData.BwCursorTapped);
                BwUnitListPanel.hide();
            } else {
                cursor.setGridIndex(gridIndex);
                cursor.updateView();
                war.getView().tweenGridToCentralArea(gridIndex);
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const unit = this._getData().unit;
            this._unitView.init(unit).startRunningView();
            this._labelHp.text          = `${unit.getCurrentHp()}`;
            this._labelFuel.text        = `${unit.getCurrentFuel()}`;
            this._labelName.text        = Lang.getUnitName(unit.getUnitType()) ?? CommonConstants.ErrorTextForUndefined;
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
