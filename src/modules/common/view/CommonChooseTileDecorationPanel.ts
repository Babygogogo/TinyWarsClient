
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
namespace Twns.Common {
    import DataForDrawTileDecorator = MapEditor.DataForDrawTileDecoration;
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;

    export type OpenDataForCommonChooseTileDecorationPanel = {
        gameConfig  : Config.GameConfig;
        callback    : (decoratorType: number, shapeId: number) => void;
    };
    export class CommonChooseTileDecorationPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseTileDecorationPanel> {
        private readonly _listCategory!     : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCategory.setItemRenderer(CategoryRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListTileDecorator();
        }
        protected _onClosing(): void {
            // nothing to do
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
        }

        private _createDataForListCategory(): DataForCategoryRenderer[] {
            const gameConfig    = this._getOpenData().gameConfig;
            const typeMap       = new Map<number, DataForDrawTileDecorator[]>();
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

            const dataArray : DataForCategoryRenderer[] = [];
            const callback  = this._getOpenData().callback;
            for (const [, dataListForDrawTileDecorator] of typeMap) {
                dataArray.push({
                    dataListForDrawTileDecorator,
                    callback,
                    gameConfig,
                });
            }

            return dataArray;
        }

        private _updateListTileDecorator(): void {
            this._listCategory.bindData(this._createDataForListCategory());
            this._listCategory.scrollVerticalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        gameConfig                      : Config.GameConfig;
        dataListForDrawTileDecorator    : DataForDrawTileDecorator[];
        callback                        : (decoratorType: number, shapeId: number) => void;
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
            const callback                  = data.callback;
            for (const dataForDrawTileDecorator of dataListForDrawTileDecorator) {
                dataListForTileDecorator.push({
                    callback,
                    dataForDrawTileDecorator,
                    gameConfig,
                });
            }
            this._listTileDecorator.bindData(dataListForTileDecorator);
        }
    }

    type DataForTileDecoratorRenderer = {
        gameConfig                  : Config.GameConfig;
        dataForDrawTileDecorator    : DataForDrawTileDecorator;
        callback                    : (decoratorType: number, shapeId: number) => void;
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
            const dataForDrawTileDecorator  = data.dataForDrawTileDecorator;
            data.callback(dataForDrawTileDecorator.decoratorType, dataForDrawTileDecorator.shapeId);
            PanelHelpers.close(PanelHelpers.PanelDict.CommonChooseTileDecorationPanel);
        }
    }
}

// export default TwnsCommonChooseTileDecoratorPanel;
