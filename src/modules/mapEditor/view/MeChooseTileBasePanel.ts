
import TwnsUiImage                      from "../../tools/ui/UiImage";
import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
import CommonConfirmPanel = TwnsCommonConfirmPanel.CommonConfirmPanel;import TwnsCommonConfirmPanel           from "../../common/view/CommonConfirmPanel";
import { DataForDrawTileBase }          from "../model/MeDrawer";
import TwnsMeTileSimpleView             from "./MeTileSimpleView";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import NotifyData                   from "../../tools/notify/NotifyData";
import Types                        from "../../tools/helpers/Types";
import MeModel                      from "../model/MeModel";

const MAX_RECENT_COUNT = 10;

export class MeChooseTileBasePanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeChooseTileBasePanel;

    private _listCategory       : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
    private _listRecent         : TwnsUiScrollList.UiScrollList<DataForTileBaseRenderer>;
    private _labelRecentTitle   : TwnsUiLabel.UiLabel;
    private _btnCancel          : TwnsUiButton.UiButton;
    private _groupFill          : eui.Group;
    private _imgFill            : TwnsUiImage.UiImage;
    private _labelFill          : TwnsUiLabel.UiLabel;

    private _needFill           : boolean;
    private _dataListForRecent  : DataForTileBaseRenderer[] = [];

    public static show(): void {
        if (!MeChooseTileBasePanel._instance) {
            MeChooseTileBasePanel._instance = new MeChooseTileBasePanel();
        }
        MeChooseTileBasePanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MeChooseTileBasePanel._instance) {
            await MeChooseTileBasePanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/mapEditor/MeChooseTileBasePanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,  callback: this.close },
            { ui: this._groupFill,  callback: this._onTouchedGroupFill },
        ]);
        this._listCategory.setItemRenderer(CategoryRenderer);
        this._listRecent.setItemRenderer(TileBaseRenderer);

        this._updateComponentsForLanguage();

        this._needFill = false;
        this._updateImgFill();
        this._updateListTileObject();
        this._updateListRecent();
    }

    public getNeedFill(): boolean {
        return this._needFill;
    }

    public updateOnChooseTileBase(data: DataForDrawTileBase): void {
        const dataList      = this._dataListForRecent;
        const filteredList  = dataList.filter(v => {
            const oldData = v.dataForDrawTileBase;
            return (oldData.baseType != data.baseType)
                || (oldData.shapeId != data.shapeId);
        });
        dataList.length     = 0;
        dataList[0]         = {
            dataForDrawTileBase : data,
            panel               : this,
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

    private _onTouchedGroupFill(e: egret.Event): void {
        this._needFill = !this._needFill;
        this._updateImgFill();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        this._labelFill.text        = Lang.getText(LangTextType.B0294);
        this._labelRecentTitle.text = `${Lang.getText(LangTextType.B0372)}:`;
    }

    private _updateImgFill(): void {
        this._imgFill.visible = this._needFill;
    }

    private _createDataForListCategory(): DataForCategoryRenderer[] {
        const typeMap = new Map<number, DataForDrawTileBase[]>();
        for (const [baseType, cfg] of CommonConstants.TileBaseShapeConfigs) {
            if (!typeMap.has(baseType)) {
                typeMap.set(baseType, []);
            }

            const list = typeMap.get(baseType);
            for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                list.push({
                    baseType,
                    shapeId,
                });
            }
        }

        const dataList: DataForCategoryRenderer[] = [];
        for (const [, dataListForDrawTileBase] of typeMap) {
            dataList.push({
                dataListForDrawTileBase,
                panel                   : this,
            });
        }

        return dataList;
    }

    private _updateListTileObject(): void {
        this._listCategory.bindData(this._createDataForListCategory());
        this._listCategory.scrollVerticalTo(0);
    }

    private _updateListRecent(): void {
        this._listRecent.bindData(this._dataListForRecent);
        this._listRecent.scrollHorizontalTo(0);
    }
}

type DataForCategoryRenderer = {
    dataListForDrawTileBase : DataForDrawTileBase[];
    panel                   : MeChooseTileBasePanel;
};

class CategoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
    private _labelCategory  : TwnsUiLabel.UiLabel;
    private _listTileBase   : TwnsUiScrollList.UiScrollList<DataForTileBaseRenderer>;

    protected _onOpened(): void {
        this._listTileBase.setItemRenderer(TileBaseRenderer);
        this._listTileBase.setScrollPolicyH(eui.ScrollPolicy.OFF);
    }

    protected _onDataChanged(): void {
        const data                      = this.data;
        const dataListForDrawTileBase   = data.dataListForDrawTileBase;
        this._labelCategory.text        = Lang.getTileName(ConfigManager.getTileType(dataListForDrawTileBase[0].baseType, Types.TileObjectType.Empty));

        const dataListForTileBase   : DataForTileBaseRenderer[] = [];
        const panel                 = data.panel;
        for (const dataForDrawTileBase of dataListForDrawTileBase) {
            dataListForTileBase.push({
                panel,
                dataForDrawTileBase,
            });
        }
        this._listTileBase.bindData(dataListForTileBase);
    }
}

type DataForTileBaseRenderer = {
    dataForDrawTileBase : DataForDrawTileBase;
    panel               : MeChooseTileBasePanel;
};
class TileBaseRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileBaseRenderer> {
    private _group          : eui.Group;
    private _conTileView    : eui.Group;

    private _tileView   = new TwnsMeTileSimpleView.MeTileSimpleView();

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
        ]);

        const tileView = this._tileView;
        this._conTileView.addChild(tileView.getImgBase());
        this._conTileView.addChild(tileView.getImgObject());
        tileView.startRunningView();
    }

    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    protected _onDataChanged(): void {
        const data                  = this.data;
        const dataForDrawTileBase   = data.dataForDrawTileBase;
        this._tileView.init({
            tileBaseShapeId     : dataForDrawTileBase.shapeId,
            tileBaseType        : dataForDrawTileBase.baseType,
            tileObjectShapeId   : null,
            tileObjectType      : null,
            playerIndex         : CommonConstants.WarNeutralPlayerIndex,
        });
        this._tileView.updateView();
    }

    public onItemTapEvent(): void {
        const data                  = this.data;
        const panel                 = data.panel;
        const dataForDrawTileBase   = data.dataForDrawTileBase;
        if (!panel.getNeedFill()) {
            panel.updateOnChooseTileBase(dataForDrawTileBase);
            panel.close();
            MeModel.getWar().getDrawer().setModeDrawTileBase(dataForDrawTileBase);
        } else {
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0089),
                callback: () => {
                    const war           = MeModel.getWar();
                    const configVersion = war.getConfigVersion();
                    for (const tile of war.getTileMap().getAllTiles()) {
                        tile.init({
                            gridIndex       : tile.getGridIndex(),
                            objectShapeId   : tile.getObjectShapeId(),
                            objectType      : tile.getObjectType(),
                            playerIndex     : tile.getPlayerIndex(),
                            baseShapeId     : dataForDrawTileBase.shapeId,
                            baseType        : dataForDrawTileBase.baseType,
                        }, configVersion);
                        tile.startRunning(war);
                        tile.flushDataToView();
                    }

                    panel.updateOnChooseTileBase(dataForDrawTileBase);
                    panel.close();
                    Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: war.getCursor().getGridIndex() } as NotifyData.MeTileChanged);
                },
            });
        }
    }
}
