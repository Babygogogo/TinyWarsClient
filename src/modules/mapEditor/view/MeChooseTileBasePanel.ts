
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
namespace Twns.MapEditor {
    import DataForDrawTileBase  = Twns.MapEditor.DataForDrawTileBase;
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;

    const MAX_RECENT_COUNT = 10;

    export type OpenDataForMeChooseTileBasePanel = void;
    export class MeChooseTileBasePanel extends TwnsUiPanel.UiPanel<OpenDataForMeChooseTileBasePanel> {
        private readonly _listCategory!     : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _listRecent!       : TwnsUiScrollList.UiScrollList<DataForTileBaseRenderer>;
        private readonly _labelRecentTitle! : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _groupFill!        : eui.Group;
        private readonly _imgFill!          : TwnsUiImage.UiImage;
        private readonly _labelFill!        : TwnsUiLabel.UiLabel;

        private _needFill           = false;
        private _dataListForRecent  : DataForTileBaseRenderer[] = [];

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._groupFill,  callback: this._onTouchedGroupFill },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCategory.setItemRenderer(CategoryRenderer);
            this._listRecent.setItemRenderer(TileBaseRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._needFill = false;
            this._updateImgFill();
            this._updateListTileObject();
            this._updateListRecent();
        }
        protected _onClosing(): void {
            // nothing to do
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
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupFill(): void {
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
        private readonly _labelCategory!    : TwnsUiLabel.UiLabel;
        private readonly _listTileBase!     : TwnsUiScrollList.UiScrollList<DataForTileBaseRenderer>;

        protected _onOpened(): void {
            this._listTileBase.setItemRenderer(TileBaseRenderer);
            this._listTileBase.setScrollPolicyH(eui.ScrollPolicy.OFF);
        }

        protected _onDataChanged(): void {
            const data                      = this._getData();
            const dataListForDrawTileBase   = data.dataListForDrawTileBase;
            this._labelCategory.text        = Lang.getTileName(Twns.Config.ConfigManager.getTileType(dataListForDrawTileBase[0].baseType, Twns.Types.TileObjectType.Empty)) ?? CommonConstants.ErrorTextForUndefined;

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
            const panel                 = data.panel;
            const dataForDrawTileBase   = data.dataForDrawTileBase;
            if (!panel.getNeedFill()) {
                panel.updateOnChooseTileBase(dataForDrawTileBase);
                panel.close();
                Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar()).getDrawer().setModeDrawTileBase(dataForDrawTileBase);
            } else {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getText(LangTextType.A0089),
                    callback: () => {
                        const war           = Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar());
                        const gameConfig    = war.getGameConfig();
                        for (const tile of war.getTileMap().getAllTiles()) {
                            tile.init({
                                gridIndex       : tile.getGridIndex(),
                                objectShapeId   : tile.getObjectShapeId(),
                                objectType      : tile.getObjectType(),
                                playerIndex     : tile.getPlayerIndex(),
                                baseShapeId     : dataForDrawTileBase.shapeId,
                                baseType        : dataForDrawTileBase.baseType,
                                locationFlags   : tile.getLocationFlags(),
                                isHighlighted   : tile.getIsHighlighted(),
                            }, gameConfig);
                            tile.startRunning(war);
                            tile.flushDataToView();
                        }

                        panel.updateOnChooseTileBase(dataForDrawTileBase);
                        panel.close();
                        Twns.Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: war.getCursor().getGridIndex() } as Twns.Notify.NotifyData.MeTileChanged);
                    },
                });
            }
        }
    }
}

// export default TwnsMeChooseTileBasePanel;
