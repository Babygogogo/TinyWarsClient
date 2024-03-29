
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsMeDrawer             from "../model/MeDrawer";
// import MeModel                  from "../model/MeModel";
// import TwnsMeTileSimpleView     from "./MeTileSimpleView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import DataForDrawTileDecoration    = MapEditor.DataForDrawTileDecoration;
    import LangTextType                 = Lang.LangTextType;
    import NotifyType                   = Notify.NotifyType;

    const MAX_RECENT_COUNT = 10;

    export type OpenDataForMeChooseTileDecorationPanel = void;
    export class MeChooseTileDecorationPanel extends TwnsUiPanel.UiPanel<OpenDataForMeChooseTileDecorationPanel> {
        private readonly _listCategory!     : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _listRecent!       : TwnsUiScrollList.UiScrollList<DataForTileDecoratorRenderer>;
        private readonly _labelRecentTitle! : TwnsUiLabel.UiLabel;
        private readonly _btnAutoFill!      : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        private _dataListForRecent  : DataForTileDecoratorRenderer[] = [];

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnAutoFill,    callback: this._onTouchedBtnAutoFill },
                { ui: this._btnCancel,      callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCategory.setItemRenderer(CategoryRenderer);
            this._listRecent.setItemRenderer(TileDecoratorRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListTileDecorator();
            this._updateListRecent();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public updateOnChooseTileDecorator(data: DataForDrawTileDecoration): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => {
                const oldData = v.dataForDrawTileDecorator;
                return (oldData.decoratorType != data.decoratorType)
                    || (oldData.shapeId != data.shapeId);
            });
            dataList.length     = 0;
            dataList[0]         = {
                dataForDrawTileDecorator    : data,
                panel                       : this,
                gameConfig                  : Helpers.getExisted(MeModel.getWar()?.getGameConfig()),
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
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0233),
                callback: () => {
                    Helpers.getExisted(MapEditor.MeModel.getWar()).getDrawer().autoFillTileDecorators();
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
            const gameConfig    = Helpers.getExisted(MapEditor.MeModel.getWar()?.getGameConfig());
            const typeMap       = new Map<number, DataForDrawTileDecoration[]>();
            for (const cfg of gameConfig.getAllTileDecorationCfgArray()) {
                const tileDecorationType = cfg.tileDecorationType;
                if (!typeMap.has(tileDecorationType)) {
                    typeMap.set(tileDecorationType, []);
                }

                const list = Helpers.getExisted(typeMap.get(tileDecorationType));
                for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                    list.push({
                        decoratorType: tileDecorationType,
                        shapeId,
                    });
                }
            }

            const dataList      : DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawTileDecorator] of typeMap) {
                dataList.push({
                    dataListForDrawTileDecorator,
                    panel                       : this,
                    gameConfig,
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
        dataListForDrawTileDecorator    : DataForDrawTileDecoration[];
        panel                           : MeChooseTileDecorationPanel;
        gameConfig                      : Config.GameConfig;
    };
    class CategoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
        private readonly _labelCategory!        : TwnsUiLabel.UiLabel;
        private readonly _listTileDecorator!    : TwnsUiScrollList.UiScrollList<DataForTileDecoratorRenderer>;

        protected _onOpened(): void {
            this._listTileDecorator.setItemRenderer(TileDecoratorRenderer);
            this._listTileDecorator.setScrollPolicyH(eui.ScrollPolicy.OFF);
        }

        protected _onDataChanged(): void {
            const data                          = this._getData();
            const dataListForDrawTileDecorator  = data.dataListForDrawTileDecorator;
            const gameConfig                    = data.gameConfig;
            this._labelCategory.text            = Lang.getTileDecorationName(dataListForDrawTileDecorator[0].decoratorType, gameConfig) ?? CommonConstants.ErrorTextForUndefined;

            const dataListForTileDecorator  : DataForTileDecoratorRenderer[] = [];
            const panel                     = data.panel;
            for (const dataForDrawTileDecorator of dataListForDrawTileDecorator) {
                dataListForTileDecorator.push({
                    panel,
                    dataForDrawTileDecorator,
                    gameConfig,
                });
            }
            this._listTileDecorator.bindData(dataListForTileDecorator);
        }
    }

    type DataForTileDecoratorRenderer = {
        dataForDrawTileDecorator    : DataForDrawTileDecoration;
        panel                       : MeChooseTileDecorationPanel;
        gameConfig                  : Config.GameConfig;
    };
    class TileDecoratorRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileDecoratorRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _conTileView!  : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        private _tileView   = new MapEditor.MeTileSimpleView();

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
            const data                      = this._getData();
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
                playerIndex         : CommonConstants.PlayerIndex.Neutral,
                gameConfig          : data.gameConfig,
            });
            tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data                      = this._getData();
            const panel                     = data.panel;
            const dataForDrawTileDecorator  = data.dataForDrawTileDecorator;
            panel.updateOnChooseTileDecorator(dataForDrawTileDecorator);
            panel.close();
            Helpers.getExisted(MapEditor.MeModel.getWar()).getDrawer().setModeDrawTileDecorator(dataForDrawTileDecorator);
        }
    }
}

// export default TwnsMeChooseTileDecoratorPanel;
