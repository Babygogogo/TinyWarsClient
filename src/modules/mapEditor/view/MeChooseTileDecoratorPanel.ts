
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
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
import TwnsMeTileSimpleView     from "./MeTileSimpleView";

namespace TwnsMeChooseTileDecoratorPanel {
    import DataForDrawTileDecorator = TwnsMeDrawer.DataForDrawTileDecorator;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;

    const MAX_RECENT_COUNT = 10;

    export class MeChooseTileDecoratorPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeChooseTileDecoratorPanel;

        private readonly _listCategory      : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _listRecent        : TwnsUiScrollList.UiScrollList<DataForTileDecoratorRenderer>;
        private readonly _labelRecentTitle  : TwnsUiLabel.UiLabel;
        private readonly _btnAutoFill       : TwnsUiButton.UiButton;
        private readonly _btnCancel         : TwnsUiButton.UiButton;

        private _dataListForRecent  : DataForTileDecoratorRenderer[] = [];

        public static show(): void {
            if (!MeChooseTileDecoratorPanel._instance) {
                MeChooseTileDecoratorPanel._instance = new MeChooseTileDecoratorPanel();
            }
            MeChooseTileDecoratorPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MeChooseTileDecoratorPanel._instance) {
                await MeChooseTileDecoratorPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/mapEditor/MeChooseTileDecoratorPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnAutoFill,    callback: this._onTouchedBtnAutoFill },
                { ui: this._btnCancel,      callback: this.close },
            ]);
            this._listCategory.setItemRenderer(CategoryRenderer);
            this._listRecent.setItemRenderer(TileDecoratorRenderer);

            this._updateComponentsForLanguage();

            this._updateListTileDecorator();
            this._updateListRecent();
        }

        public updateOnChooseTileDecorator(data: DataForDrawTileDecorator): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => {
                const oldData = v.dataForDrawTileDecorator;
                return (oldData.decoratorType != data.decoratorType)
                    || (oldData.shapeId != data.shapeId);
            });
            dataList.length     = 0;
            dataList[0]         = {
                dataForDrawTileDecorator : data,
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
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnAutoFill(): void {
            TwnsCommonConfirmPanel.CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0233),
                callback: () => {
                    MeModel.getWar().getDrawer().autoFillTileDecorators();
                    this.close();
                },
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnAutoFill.label     = Lang.getText(LangTextType.B0678);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._labelRecentTitle.text = `${Lang.getText(LangTextType.B0372)}:`;
        }

        private _createDataForListCategory(): DataForCategoryRenderer[] {
            const typeMap = new Map<number, DataForDrawTileDecorator[]>();
            for (const [decoratorType, cfg] of CommonConstants.TileDecoratorShapeConfigs) {
                if (!typeMap.has(decoratorType)) {
                    typeMap.set(decoratorType, []);
                }

                const list = typeMap.get(decoratorType);
                for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                    if ((decoratorType === Types.TileDecoratorType.Corner) && (shapeId === 0)) {
                        continue;
                    }

                    list.push({
                        decoratorType,
                        shapeId,
                    });
                }
            }

            const dataList: DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawTileDecorator] of typeMap) {
                dataList.push({
                    dataListForDrawTileDecorator,
                    panel                       : this,
                });
            }

            return dataList;
        }

        private _updateListTileDecorator(): void {
            this._listCategory.bindData(this._createDataForListCategory());
            this._listCategory.scrollVerticalTo(0);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        dataListForDrawTileDecorator: DataForDrawTileDecorator[];
        panel                       : MeChooseTileDecoratorPanel;
    };
    class CategoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
        private _labelCategory      : TwnsUiLabel.UiLabel;
        private _listTileDecorator  : TwnsUiScrollList.UiScrollList<DataForTileDecoratorRenderer>;

        protected _onOpened(): void {
            this._listTileDecorator.setItemRenderer(TileDecoratorRenderer);
            this._listTileDecorator.setScrollPolicyH(eui.ScrollPolicy.OFF);
        }

        protected _onDataChanged(): void {
            const data                          = this.data;
            const dataListForDrawTileDecorator  = data.dataListForDrawTileDecorator;
            this._labelCategory.text            = Lang.getTileDecoratorName(dataListForDrawTileDecorator[0].decoratorType);

            const dataListForTileDecorator  : DataForTileDecoratorRenderer[] = [];
            const panel                     = data.panel;
            for (const dataForDrawTileDecorator of dataListForDrawTileDecorator) {
                dataListForTileDecorator.push({
                    panel,
                    dataForDrawTileDecorator,
                });
            }
            this._listTileDecorator.bindData(dataListForTileDecorator);
        }
    }

    type DataForTileDecoratorRenderer = {
        dataForDrawTileDecorator : DataForDrawTileDecorator;
        panel               : MeChooseTileDecoratorPanel;
    };
    class TileDecoratorRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileDecoratorRenderer> {
        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _labelName      : TwnsUiLabel.UiLabel;

        private _tileView   = new TwnsMeTileSimpleView.MeTileSimpleView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();
        }

        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        protected _onDataChanged(): void {
            const data                      = this.data;
            const dataForDrawTileDecorator  = data.dataForDrawTileDecorator;
            const shapeId                   = dataForDrawTileDecorator.shapeId;
            this._labelName.text            = `${shapeId}`;

            const tileView = this._tileView;
            tileView.init({
                tileBaseShapeId     : null,
                tileBaseType        : null,
                tileDecoratorType   : dataForDrawTileDecorator.decoratorType,
                tileDecoratorShapeId: shapeId,
                tileObjectShapeId   : null,
                tileObjectType      : null,
                playerIndex         : CommonConstants.WarNeutralPlayerIndex,
            });
            tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data                      = this.data;
            const panel                     = data.panel;
            const dataForDrawTileDecorator  = data.dataForDrawTileDecorator;
            panel.updateOnChooseTileDecorator(dataForDrawTileDecorator);
            panel.close();
            MeModel.getWar().getDrawer().setModeDrawTileDecorator(dataForDrawTileDecorator);
        }
    }
}

export default TwnsMeChooseTileDecoratorPanel;
