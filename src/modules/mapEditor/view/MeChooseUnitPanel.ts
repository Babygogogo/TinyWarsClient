
import TwnsUiListItemRenderer           from "../../../utility/ui/UiListItemRenderer";
import TwnsUiPanel                      from "../../../utility/ui/UiPanel";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiScrollList                 from "../../../utility/ui/UiScrollList";
import { BwUnit }                       from "../../baseWar/model/BwUnit";
import { BwUnitView }                   from "../../baseWar/view/BwUnitView";
import { DataForDrawUnit }              from "../model/MeDrawer";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                        from "../../../utility/Types";
import { MeModel }                      from "../model/MeModel";

const MAX_RECENT_COUNT = 10;

export class MeChooseUnitPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeChooseUnitPanel;

    private _labelRecentTitle   : TwnsUiLabel.UiLabel;
    private _listRecent         : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
    private _listCategory       : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
    private _btnCancel          : TwnsUiButton.UiButton;

    private _dataListForRecent   : DataForUnitRenderer[] = [];

    public static show(): void {
        if (!MeChooseUnitPanel._instance) {
            MeChooseUnitPanel._instance = new MeChooseUnitPanel();
        }
        MeChooseUnitPanel._instance.open(undefined);
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
    private _onNotifyLanguageChanged(e: egret.Event): void {
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
        for (const unitType of ConfigManager.getUnitTypesByCategory(ConfigManager.getLatestFormalVersion(), Types.UnitCategory.All)) {
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                if (!mapping.has(playerIndex)) {
                    mapping.set(playerIndex, []);
                }

                mapping.get(playerIndex).push({
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
    private _listUnit: TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;

    protected _onOpened(): void {
        this._listUnit.setItemRenderer(UnitRenderer);
        this._listUnit.setScrollPolicyH(eui.ScrollPolicy.OFF);
    }

    protected _onDataChanged(): void {
        const data              = this.data;
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
    private _group          : eui.Group;
    private _labelName      : TwnsUiLabel.UiLabel;
    private _conUnitView    : eui.Group;

    private _unitView   = new BwUnitView();

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
        ]);

        this._conUnitView.addChild(this._unitView);
    }

    private _onNotifyUnitAnimationTick(): void {
        const unitView = this._unitView;
        unitView.tickStateAnimationFrame();
        unitView.tickUnitAnimationFrame();
    }

    protected _onDataChanged(): void {
        const data              = this.data;
        const dataForDrawUnit   = data.dataForDrawUnit;
        const unitType          = dataForDrawUnit.unitType;
        const war               = MeModel.getWar();
        this._labelName.text    = Lang.getUnitName(unitType);

        const unitView  = this._unitView;
        const unit      = new BwUnit();
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
        const data              = this.data;
        const panel             = data.panel;
        const dataForDrawUnit   = data.dataForDrawUnit;
        panel.updateOnChooseUnit(dataForDrawUnit);
        panel.close();
        MeModel.getWar().getDrawer().setModeDrawUnit(dataForDrawUnit);
    }
}
