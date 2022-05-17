
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
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
    import DataForDrawTileObject    = MapEditor.DataForDrawTileObject;
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;

    const MAX_RECENT_COUNT = 10;

    export type OpenDataForMeChooseTileObjectPanel = void;
    export class MeChooseTileObjectPanel extends TwnsUiPanel.UiPanel<OpenDataForMeChooseTileObjectPanel> {
        private readonly _labelRecentTitle! : TwnsUiLabel.UiLabel;
        private readonly _listRecent!       : TwnsUiScrollList.UiScrollList<DataForTileObjectRenderer>;
        private readonly _listPlayerIndex!  : TwnsUiScrollList.UiScrollList<DataForPlayerIndexRenderer>;
        private readonly _listTileObject!   : TwnsUiScrollList.UiScrollList<DataForTileObjectRenderer>;
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

            this._listPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._listRecent.setItemRenderer(TileObjectRenderer);
            this._listTileObject.setItemRenderer(TileObjectRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._resetListPlayerIndex(CommonConstants.WarNeutralPlayerIndex);
            this._updateListRecent();
            this._updateListTileObject();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setAndReviseSelectedPlayerIndex(newPlayerIndex: number, needScroll: boolean): void {
            const listWarEventId    = this._listPlayerIndex;
            const index             = Helpers.getExisted(listWarEventId.getRandomIndex(v => v.playerIndex === newPlayerIndex));
            listWarEventId.setSelectedIndex(index);
            this._updateListTileObject();

            if (needScroll) {
                listWarEventId.scrollVerticalToIndex(index);
            }
        }

        public async updateOnChooseTileObject(data: DataForDrawTileObject): Promise<void> {
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
                gameConfig              : await Config.ConfigManager.getLatestGameConfig(),
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
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content: Lang.getText(LangTextType.A0259),
                callback: () => {
                    const drawer = Helpers.getExisted(MapEditor.MeModel.getWar()).getDrawer();
                    drawer.autoAdjustRoads();
                    drawer.autoAdjustBridges();
                    this.close();
                },
            });
        }
        private _onTouchedBtnAdjustPlasma(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content: Lang.getText(LangTextType.A0260),
                callback: () => {
                    const drawer = Helpers.getExisted(MapEditor.MeModel.getWar()).getDrawer();
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

        private _resetListPlayerIndex(selectedPlayerIndex: number | null): void {
            const dataArray: DataForPlayerIndexRenderer[] = [];
            for (let playerIndex = CommonConstants.WarNeutralPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                dataArray.push({
                    playerIndex,
                    panel       : this,
                });
            }

            const list = this._listPlayerIndex;
            list.bindData(dataArray);
            list.setSelectedIndex(list.getFirstIndex(v => v.playerIndex === selectedPlayerIndex) ?? (dataArray.length ? 0 : -1));
        }

        private async _updateListTileObject(): Promise<void> {
            const playerIndex       = this._listPlayerIndex.getSelectedData()?.playerIndex;
            const listTileObject    = this._listTileObject;
            if (playerIndex == null) {
                listTileObject.clear();
                return;
            }

            const gameConfig    = await Config.ConfigManager.getLatestGameConfig();
            const dataArray     : DataForTileObjectRenderer[] = [];
            for (const [objectType, cfg] of CommonConstants.TileObjectShapeConfigs) {
                if ((playerIndex < cfg.minPlayerIndex) || (playerIndex > cfg.maxPlayerIndex)) {
                    continue;
                }

                const shapesCount = User.UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0 ? cfg.shapesCountForV0 : cfg.shapesCount;
                for (let shapeId = 0; shapeId < shapesCount; ++shapeId) {
                    dataArray.push({
                        panel                   : this,
                        dataForDrawTileObject   : {
                            objectType,
                            playerIndex,
                            shapeId,
                        },
                        gameConfig,
                    });
                }
            }

            listTileObject.bindData(dataArray);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForPlayerIndexRenderer = {
        playerIndex : number;
        panel       : MeChooseTileObjectPanel;
    };
    class PlayerIndexRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelPlayerIndex.text = `P${this._getData().playerIndex}`;
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedPlayerIndex(data.playerIndex, false);
        }
    }

    type DataForTileObjectRenderer = {
        dataForDrawTileObject   : DataForDrawTileObject;
        gameConfig              : Config.GameConfig;
        panel                   : MeChooseTileObjectPanel;
    };
    class TileObjectRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileObjectRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
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
            const dataForDrawTileObject = data.dataForDrawTileObject;
            const tileObjectType        = dataForDrawTileObject.objectType;
            this._labelName.text        = Lang.getTileName(Config.ConfigManager.getTileType(Types.TileBaseType.Plain, tileObjectType), data.gameConfig) || CommonConstants.ErrorTextForUndefined;
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
            Helpers.getExisted(MapEditor.MeModel.getWar()).getDrawer().setModeDrawTileObject(dataForDrawTileObject);
        }
    }
}

// export default TwnsMeChooseTileObjectPanel;
