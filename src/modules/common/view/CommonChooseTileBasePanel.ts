
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import NotifyData               from "../../tools/notify/NotifyData";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsMeDrawer             from "../model/MeDrawer";
// import MeModel                  from "../model/MeModel";
// import TwnsMeTileSimpleView     from "./MeTileSimpleView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import DataForDrawTileBase  = MapEditor.DataForDrawTileBase;
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;

    export type OpenDataForCommonChooseTileBasePanel = {
        gameConfig  : Config.GameConfig;
        callback    : (baseType: Types.TileBaseType, shapeId: number) => void;
    };
    export class CommonChooseTileBasePanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseTileBasePanel> {
        private readonly _listCategory!     : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCategory.setItemRenderer(CategoryRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListTileBase();
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
            const openData      = this._getOpenData();
            const gameConfig    = openData.gameConfig;
            const typeMap       = new Map<number, DataForDrawTileBase[]>();
            for (const cfg of gameConfig.getAllEnabledTileBaseCfgArray()) {
                const tileBaseType = cfg.tileBaseType;
                if (!typeMap.has(tileBaseType)) {
                    typeMap.set(tileBaseType, []);
                }

                const list = Helpers.getExisted(typeMap.get(tileBaseType));
                for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                    list.push({
                        baseType: tileBaseType,
                        shapeId,
                    });
                }
            }

            const callback  = openData.callback;
            const dataArray : DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawTileBase] of typeMap) {
                dataArray.push({
                    gameConfig,
                    dataListForDrawTileBase,
                    callback,
                });
            }

            return dataArray;
        }

        private _updateListTileBase(): void {
            this._listCategory.bindData(this._createDataForListCategory());
            this._listCategory.scrollVerticalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        dataListForDrawTileBase : DataForDrawTileBase[];
        gameConfig              : Config.GameConfig;
        callback                : (baseType: Types.TileBaseType, shapeId: number) => void;
    };
    class CategoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
        private readonly _labelCategory!    : TwnsUiLabel.UiLabel;
        private readonly _listTileBase!     : TwnsUiScrollList.UiScrollList<DataForTileBaseRenderer>;

        protected _onOpened(): void {
            this._listTileBase.setItemRenderer(TileBaseRenderer);
            this._listTileBase.setScrollPolicyH(eui.ScrollPolicy.OFF);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            const data                      = this._getData();
            const dataListForDrawTileBase   = data.dataListForDrawTileBase;
            const gameConfig                = data.gameConfig;
            this._labelCategory.text        = Lang.getTileName(Helpers.getExisted(gameConfig.getTileType(dataListForDrawTileBase[0].baseType, Types.TileObjectType.Empty)), gameConfig) ?? CommonConstants.ErrorTextForUndefined;

            const dataListForTileBase   : DataForTileBaseRenderer[] = [];
            const callback              = data.callback;
            for (const dataForDrawTileBase of dataListForDrawTileBase) {
                dataListForTileBase.push({
                    dataForDrawTileBase,
                    callback,
                    gameConfig,
                });
            }
            this._listTileBase.bindData(dataListForTileBase);
        }
    }

    type DataForTileBaseRenderer = {
        gameConfig          : Config.GameConfig;
        dataForDrawTileBase : DataForDrawTileBase;
        callback            : (baseType: Types.TileBaseType, shapeId: number) => void;
    };
    class TileBaseRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileBaseRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _conTileView!  : eui.Group;

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
            const data                  = this._getData();
            const dataForDrawTileBase   = data.dataForDrawTileBase;
            this._tileView.init({
                tileBaseShapeId     : dataForDrawTileBase.shapeId,
                tileBaseType        : dataForDrawTileBase.baseType,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                tileObjectShapeId   : null,
                tileObjectType      : null,
                playerIndex         : CommonConstants.WarNeutralPlayerIndex,
                gameConfig          : data.gameConfig,
            });
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data                  = this._getData();
            const dataForDrawTileBase   = data.dataForDrawTileBase;
            data.callback(dataForDrawTileBase.baseType, dataForDrawTileBase.shapeId);
            PanelHelpers.close(PanelHelpers.PanelDict.CommonChooseTileBasePanel);
        }
    }
}

// export default TwnsCommonChooseTileBasePanel;
