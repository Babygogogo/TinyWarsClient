
import TwnsBwUnit               from "../../baseWar/model/BwUnit";
import TwnsBwUnitView           from "../../baseWar/view/BwUnitView";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsMeDrawer             from "../model/MeDrawer";
import MeModel                  from "../model/MeModel";

namespace TwnsMeChooseUnitPanel {
    import BwUnitView       = TwnsBwUnitView.BwUnitView;
    import DataForDrawUnit  = TwnsMeDrawer.DataForDrawUnit;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    const MAX_RECENT_COUNT = 10;

    export class MeChooseUnitPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseUnitPanel;

        private readonly _labelRecentTitle! : TwnsUiLabel.UiLabel;
        private readonly _listRecent!       : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _listCategory!     : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        private _dataListForRecent   : DataForUnitRenderer[] = [];

        public static show(): void {
            if (!MeChooseUnitPanel._instance) {
                MeChooseUnitPanel._instance = new MeChooseUnitPanel();
            }
            MeChooseUnitPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (MeChooseUnitPanel._instance) {
                await MeChooseUnitPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeChooseUnitPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
            ]);
            this._listRecent.setItemRenderer(UnitRenderer);
            this._listCategory.setItemRenderer(CategoryRenderer);

            this._updateComponentsForLanguage();

            this._updateListCategory();
            this._updateListRecent();
        }

        public updateOnChooseUnit(data: DataForDrawUnit): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => {
                const oldData = v.dataForDrawUnit;
                return (oldData.playerIndex != data.playerIndex)
                    || (oldData.unitType != data.unitType);
            });
            dataList.length     = 0;
            dataList[0]         = {
                dataForDrawUnit: data,
                panel   : this,
            };
            for (const v of filteredList) {
                if (dataList.length < MAX_RECENT_COUNT) {
                    dataList.push(v);
                } else {
                    break;
                }
            }
            this._updateListRecent();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._labelRecentTitle.text = `${Lang.getText(LangTextType.B0372)}:`;
        }

        private _createDataForListUnit(): DataForCategoryRenderer[] {
            const mapping = new Map<number, DataForDrawUnit[]>();
            for (const unitType of ConfigManager.getUnitTypesByCategory(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), Types.UnitCategory.All)) {
                for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                    if (!mapping.has(playerIndex)) {
                        mapping.set(playerIndex, []);
                    }

                    Helpers.getExisted(mapping.get(playerIndex)).push({
                        playerIndex,
                        unitType,
                    });
                }
            }

            const dataList: DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawUnit] of mapping) {
                dataList.push({
                    dataListForDrawUnit,
                    panel               : this,
                });
            }

            return dataList;
        }

        private _updateListCategory(): void {
            const dataList = this._createDataForListUnit();
            this._listCategory.bindData(dataList);
            this._listCategory.scrollVerticalTo(0);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        dataListForDrawUnit : DataForDrawUnit[];
        panel               : MeChooseUnitPanel;
    };
    class CategoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
        private readonly _listUnit! : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;

        protected _onOpened(): void {
            this._listUnit.setItemRenderer(UnitRenderer);
            this._listUnit.setScrollPolicyH(eui.ScrollPolicy.OFF);
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const unitViewIdList    = data.dataListForDrawUnit;
            const dataListForUnit   : DataForUnitRenderer[] = [];
            const panel             = data.panel;
            for (const unitViewId of unitViewIdList) {
                dataListForUnit.push({
                    panel,
                    dataForDrawUnit: unitViewId,
                });
            }
            this._listUnit.bindData(dataListForUnit);
        }
    }

    type DataForUnitRenderer = {
        dataForDrawUnit : DataForDrawUnit;
        panel           : MeChooseUnitPanel;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _conUnitView!  : eui.Group;

        private _unitView   = new BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);

            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickUnitAnimationFrame();
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            this._unitView.tickStateAnimationFrame();
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const dataForDrawUnit   = data.dataForDrawUnit;
            const unitType          = dataForDrawUnit.unitType;
            const war               = Helpers.getExisted(MeModel.getWar());
            this._labelName.text    = Lang.getUnitName(unitType) ?? CommonConstants.ErrorTextForUndefined;

            const unitView  = this._unitView;
            const unit      = new TwnsBwUnit.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType,
                playerIndex : dataForDrawUnit.playerIndex,
            }, war.getConfigVersion());
            unit.startRunning(war);
            unitView.init(unit);
            unitView.startRunningView();
        }

        public onItemTapEvent(): void {
            const data              = this._getData();
            const panel             = data.panel;
            const dataForDrawUnit   = data.dataForDrawUnit;
            panel.updateOnChooseUnit(dataForDrawUnit);
            panel.close();
            Helpers.getExisted(MeModel.getWar()).getDrawer().setModeDrawUnit(dataForDrawUnit);
        }
    }
}

export default TwnsMeChooseUnitPanel;
