
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
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
    import DataForDrawTileObject    = Twns.MapEditor.DataForDrawTileObject;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;

    const MAX_RECENT_COUNT = 10;

    export type OpenDataForMeChooseTileObjectPanel = void;
    export class MeChooseTileObjectPanel extends TwnsUiPanel.UiPanel<OpenDataForMeChooseTileObjectPanel> {
        private readonly _labelRecentTitle! : TwnsUiLabel.UiLabel;
        private readonly _listRecent!       : TwnsUiScrollList.UiScrollList<DataForTileObjectRenderer>;
        private readonly _listCategory!     : TwnsUiScrollList.UiScrollList<DataForCategoryRenderer>;
        private readonly _btnAdjustRoad!    : TwnsUiButton.UiButton;
        private readonly _btnAdjustPlasma!  : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        private _dataListForRecent  : DataForTileObjectRenderer[] = [];

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnAdjustRoad,      callback: this._onTouchedBtnAdjustRoad },
                { ui: this._btnAdjustPlasma,    callback: this._onTouchedBtnAdjustPlasma },
                { ui: this._btnCancel,          callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listRecent.setItemRenderer(TileObjectRenderer);
            this._listCategory.setItemRenderer(CategoryRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListRecent();
            this._updateListCategory();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public updateOnChooseTileObject(data: DataForDrawTileObject): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => {
                const oldData = v.dataForDrawTileObject;
                return (oldData.objectType != data.objectType)
                    || (oldData.playerIndex != data.playerIndex)
                    || (oldData.shapeId != data.shapeId);
            });
            dataList.length     = 0;
            dataList[0]         = {
                dataForDrawTileObject   : data,
                panel                   : this,
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

        private _onTouchedBtnAdjustRoad(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content: Lang.getText(LangTextType.A0259),
                callback: () => {
                    const drawer = Helpers.getExisted(Twns.MapEditor.MeModel.getWar()).getDrawer();
                    drawer.autoAdjustRoads();
                    drawer.autoAdjustBridges();
                    this.close();
                },
            });
        }
        private _onTouchedBtnAdjustPlasma(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content: Lang.getText(LangTextType.A0260),
                callback: () => {
                    const drawer = Helpers.getExisted(Twns.MapEditor.MeModel.getWar()).getDrawer();
                    drawer.autoAdjustPlasmas();
                    drawer.autoAdjustPipes();
                    this.close();
                },
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._btnAdjustRoad.label   = Lang.getText(LangTextType.B0740);
            this._btnAdjustPlasma.label = Lang.getText(LangTextType.B0741);
            this._labelRecentTitle.text = `${Lang.getText(LangTextType.B0372)}:`;
        }

        private _createDataForListCategory(): DataForCategoryRenderer[] {
            const mapping = new Map<number, DataForDrawTileObject[]>();
            for (const [objectType, cfg] of CommonConstants.TileObjectShapeConfigs) {
                for (let playerIndex = cfg.minPlayerIndex; playerIndex <= cfg.maxPlayerIndex; ++playerIndex) {
                    if (!mapping.has(playerIndex)) {
                        mapping.set(playerIndex, []);
                    }

                    const dataListForDrawTileObject = Helpers.getExisted(mapping.get(playerIndex));
                    const shapesCount               = Twns.User.UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0 ? cfg.shapesCountForV0 : cfg.shapesCount;
                    for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                        dataListForDrawTileObject.push({
                            objectType,
                            playerIndex,
                            shapeId
                        });
                    }
                }
            }

            const dataList: DataForCategoryRenderer[] = [];
            for (const [, dataListForDrawTileObject] of mapping) {
                dataList.push({
                    dataListForDrawTileObject,
                    panel                       : this,
                });
            }

            return dataList;
        }

        private _updateListCategory(): void {
            const dataList = this._createDataForListCategory();
            this._listCategory.bindData(dataList);
            this._listCategory.scrollVerticalTo(0);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForCategoryRenderer = {
        dataListForDrawTileObject   : DataForDrawTileObject[];
        panel                       : MeChooseTileObjectPanel;
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
            const panel                 = data.panel;
            for (const dataForDrawTileObject of dataListForDrawTileObject) {
                dataListForTileObject.push({
                    panel,
                    dataForDrawTileObject,
                });
            }
            this._listTileObject.bindData(dataListForTileObject);
        }
    }

    type DataForTileObjectRenderer = {
        dataForDrawTileObject   : DataForDrawTileObject;
        panel                   : MeChooseTileObjectPanel;
    };
    class TileObjectRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileObjectRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
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
            const dataForDrawTileObject = data.dataForDrawTileObject;
            const tileObjectType        = dataForDrawTileObject.objectType;
            this._labelName.text        = Lang.getTileName(Twns.Config.ConfigManager.getTileType(Types.TileBaseType.Plain, tileObjectType)) || CommonConstants.ErrorTextForUndefined;
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
            const panel                 = data.panel;
            const dataForDrawTileObject = data.dataForDrawTileObject;
            panel.updateOnChooseTileObject(dataForDrawTileObject);
            panel.close();
            Helpers.getExisted(Twns.MapEditor.MeModel.getWar()).getDrawer().setModeDrawTileObject(dataForDrawTileObject);
        }
    }
}

// export default TwnsMeChooseTileObjectPanel;
