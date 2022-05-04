
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import NotifyData               from "../../tools/notify/NotifyData";
// import Twns.Notify           from "../../tools/notify/NotifyType";
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
    import DataForDrawTileBase  = Twns.MapEditor.DataForDrawTileBase;
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;

    export type OpenDataForCommonChooseTileBasePanel = {
        callback: (baseType: Twns.Types.TileBaseType, shapeId: number) => void;
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
            const typeMap = new Map<number, DataForDrawTileBase[]>();
            for (const [baseType, cfg] of CommonConstants.TileBaseShapeConfigs) {
                if (!typeMap.has(baseType)) {
                    typeMap.set(baseType, []);
                }

                const list = Twns.Helpers.getExisted(typeMap.get(baseType));
                for (let shapeId = 0; shapeId < cfg.shapesCount; ++shapeId) {
                    if ((baseType === Twns.Types.TileBaseType.Sea) && (shapeId !== 0)) {
                        continue;
                    }

                    list.push({
                        baseType,
                        shapeId,
                    });
                }
            }

            const callback  = this._getOpenData().callback;
            const dataArray : DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawTileBase] of typeMap) {
                dataArray.push({
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
        callback                : (baseType: Twns.Types.TileBaseType, shapeId: number) => void;
    };
    class CategoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
        private readonly _labelCategory!    : TwnsUiLabel.UiLabel;
        private readonly _listTileBase!     : TwnsUiScrollList.UiScrollList<DataForTileBaseRenderer>;

        protected _onOpened(): void {
            this._listTileBase.setItemRenderer(TileBaseRenderer);
            this._listTileBase.setScrollPolicyH(eui.ScrollPolicy.OFF);
            this._setShortSfxCode(Twns.Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            const data                      = this._getData();
            const dataListForDrawTileBase   = data.dataListForDrawTileBase;
            this._labelCategory.text        = Lang.getTileName(Twns.Config.ConfigManager.getTileType(dataListForDrawTileBase[0].baseType, Twns.Types.TileObjectType.Empty)) ?? CommonConstants.ErrorTextForUndefined;

            const dataListForTileBase   : DataForTileBaseRenderer[] = [];
            const callback              = data.callback;
            for (const dataForDrawTileBase of dataListForDrawTileBase) {
                dataListForTileBase.push({
                    dataForDrawTileBase,
                    callback,
                });
            }
            this._listTileBase.bindData(dataListForTileBase);
        }
    }

    type DataForTileBaseRenderer = {
        dataForDrawTileBase : DataForDrawTileBase;
        callback            : (baseType: Twns.Types.TileBaseType, shapeId: number) => void;
    };
    class TileBaseRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileBaseRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _conTileView!  : eui.Group;

        private _tileView   = new Twns.MapEditor.MeTileSimpleView();

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
            });
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data                  = this._getData();
            const dataForDrawTileBase   = data.dataForDrawTileBase;
            data.callback(dataForDrawTileBase.baseType, dataForDrawTileBase.shapeId);
            Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.CommonChooseTileBasePanel);
        }
    }
}

// export default TwnsCommonChooseTileBasePanel;
