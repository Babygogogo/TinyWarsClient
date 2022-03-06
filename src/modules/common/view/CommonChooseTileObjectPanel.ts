
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsMeDrawer             from "../model/MeDrawer";
// import MeModel                  from "../model/MeModel";
// import TwnsMeTileSimpleView     from "./MeTileSimpleView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsCommonChooseTileObjectPanel {
    import DataForDrawTileObject    = TwnsMeDrawer.DataForDrawTileObject;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;

    export type OpenData = {
        callback: (tileObjectType: Types.TileObjectType, shapeId: number, playerIndex: number) => void;
    };
    export class CommonChooseTileObjectPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _listCategory!     : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,          callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCategory.setItemRenderer(CategoryRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListCategory();
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
            const mapping = new Map<number, DataForDrawTileObject[]>();
            for (const [objectType, cfg] of CommonConstants.TileObjectShapeConfigs) {
                for (let playerIndex = cfg.minPlayerIndex; playerIndex <= cfg.maxPlayerIndex; ++playerIndex) {
                    if (!mapping.has(playerIndex)) {
                        mapping.set(playerIndex, []);
                    }

                    const dataListForDrawTileObject = Helpers.getExisted(mapping.get(playerIndex));
                    const shapesCount               = UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0 ? cfg.shapesCountForV0 : cfg.shapesCount;
                    for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                        dataListForDrawTileObject.push({
                            objectType,
                            playerIndex,
                            shapeId
                        });
                    }
                }
            }

            const dataArray : DataForCategoryRenderer[] = [];
            const callback  = this._getOpenData().callback;
            for (const [, dataListForDrawTileObject] of mapping) {
                dataArray.push({
                    dataListForDrawTileObject,
                    callback,
                });
            }

            return dataArray;
        }

        private _updateListCategory(): void {
            const dataList = this._createDataForListCategory();
            this._listCategory.bindData(dataList);
            this._listCategory.scrollVerticalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        dataListForDrawTileObject   : DataForDrawTileObject[];
        callback                    : (tileObjectType: Types.TileObjectType, shapeId: number, playerIndex: number) => void;
    };
    class CategoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
        private readonly _labelCategory!    : TwnsUiLabel.UiLabel;
        private readonly _listTileObject!   : TwnsUiScrollList.UiScrollList<DataForTileObjectRenderer>;

        protected _onOpened(): void {
            this._listTileObject.setItemRenderer(TileObjectRenderer);
            this._listTileObject.setScrollPolicyH(eui.ScrollPolicy.OFF);
        }

        protected _onDataChanged(): void {
            const data                      = this._getData();
            const dataListForDrawTileObject = data.dataListForDrawTileObject;
            this._labelCategory.text        = Lang.getPlayerForceName(dataListForDrawTileObject[0].playerIndex);

            const dataListForTileObject : DataForTileObjectRenderer[] = [];
            const callback              = data.callback;
            for (const dataForDrawTileObject of dataListForDrawTileObject) {
                dataListForTileObject.push({
                    dataForDrawTileObject,
                    callback,
                });
            }
            this._listTileObject.bindData(dataListForTileObject);
        }
    }

    type DataForTileObjectRenderer = {
        dataForDrawTileObject   : DataForDrawTileObject;
        callback                : (tileObjectType: Types.TileObjectType, shapeId: number, playerIndex: number) => void;
    };
    class TileObjectRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileObjectRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _conTileView!  : eui.Group;

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
            const data                  = this._getData();
            const dataForDrawTileObject = data.dataForDrawTileObject;
            const tileObjectType        = dataForDrawTileObject.objectType;
            this._labelName.text        = Lang.getTileName(ConfigManager.getTileType(Types.TileBaseType.Plain, tileObjectType)) || CommonConstants.ErrorTextForUndefined;
            this._tileView.init({
                tileObjectType,
                tileObjectShapeId   : dataForDrawTileObject.shapeId,
                tileBaseShapeId     : null,
                tileBaseType        : null,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                playerIndex         : dataForDrawTileObject.playerIndex,
            });
            this._tileView.updateView();
        }

        public onItemTapEvent(): void {
            const data                  = this._getData();
            const dataForDrawTileObject = data.dataForDrawTileObject;
            data.callback(dataForDrawTileObject.objectType, dataForDrawTileObject.shapeId, dataForDrawTileObject.playerIndex);
            TwnsPanelManager.close(TwnsPanelConfig.Dict.CommonChooseTileObjectPanel);
        }
    }
}

// export default TwnsCommonChooseTileObjectPanel;
