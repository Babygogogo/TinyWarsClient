
// import TwnsMeTileSimpleView     from "../../mapEditor/view/MeTileSimpleView";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarMap {
    import LangTextType     = Lang.LangTextType;
    import NotifyType       = Notify.NotifyType;
    import GameConfig       = Config.GameConfig;

    export type OpenDataForWarMapBuildingListPanel = {
        gameConfig              : GameConfig;
        tileDataArray           : CommonProto.WarSerialization.ISerialTile[];
        playersCountUnneutral   : number;
    };
    export class WarMapBuildingListPanel extends TwnsUiPanel.UiPanel<OpenDataForWarMapBuildingListPanel> {
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _listTile!     : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listTile.setItemRenderer(TileRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();
            this._updateListTile();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text = Lang.getText(LangTextType.B0333);
        }

        private _updateListTile(): void {
            const openData      = this._getOpenData();
            const gameConfig    = openData.gameConfig;
            const tileBaseType  = gameConfig.getDefaultTileBaseType();
            const dict          = new Map<number, Map<number, number>>();
            for (const tileData of openData.tileDataArray || []) {
                const template = gameConfig.getTileTemplateCfg(Helpers.getExisted(gameConfig.getTileType(tileBaseType, Helpers.getExisted(tileData.objectType))));
                if ((template) && (template.maxCapturePoint != null)) {
                    const tileType = template.type;
                    if (!dict.has(tileType)) {
                        dict.set(tileType, new Map<number, number>());
                    }

                    const playerIndex   = Helpers.getExisted(tileData.playerIndex);
                    const subDict       = Helpers.getExisted(dict.get(tileType));
                    subDict.set(playerIndex, (subDict.get(playerIndex) || 0) + 1);
                }
            }

            const dataList: DataForTileRenderer[] = [];
            for (const [tileType, subDict] of dict) {
                dataList.push({
                    maxPlayerIndex  : openData.playersCountUnneutral,
                    tileType,
                    dict            : subDict,
                    gameConfig,
                });
            }
            this._listTile.bindData(dataList);
        }
    }

    type DataForTileRenderer = {
        gameConfig      : GameConfig;
        maxPlayerIndex  : number;
        tileType        : number;
        dict            : Map<number, number>;
    };
    class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
        private readonly _group!            : eui.Group;
        private readonly _conTileView!      : eui.Group;
        private readonly _labelNum0!        : TwnsUiLabel.UiLabel;
        private readonly _labelNum1!        : TwnsUiLabel.UiLabel;
        private readonly _labelNum2!        : TwnsUiLabel.UiLabel;
        private readonly _labelNum3!        : TwnsUiLabel.UiLabel;
        private readonly _labelNum4!        : TwnsUiLabel.UiLabel;
        private readonly _labelNum5!        : TwnsUiLabel.UiLabel;
        private readonly _labelTotalNum!    : TwnsUiLabel.UiLabel;

        private _tileView       = new MapEditor.MeTileSimpleView();
        private _labelNumList   : TwnsUiLabel.UiLabel[] = [];

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

            this._labelNumList.push(
                this._labelNum0,
                this._labelNum1,
                this._labelNum2,
                this._labelNum3,
                this._labelNum4,
                this._labelNum5,
            );
        }
        protected _onClosed(): void {
            this._labelNumList.length = 0;
        }

        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const dict              = data.dict;
            const maxPlayerIndex    = data.maxPlayerIndex;
            let totalNum            = 0;
            for (let playerIndex = CommonConstants.PlayerIndex.Neutral; playerIndex <= CommonConstants.PlayerIndex.Max; ++playerIndex) {
                const num                               = dict.get(playerIndex) || 0;
                totalNum                                += num;
                this._labelNumList[playerIndex].text    = playerIndex <= maxPlayerIndex ? `${num}` : `--`;
            }
            this._labelTotalNum.text = `${totalNum}`;

            const gameConfig        = data.gameConfig;
            const tileObjectType    = gameConfig.getTileObjectTypeByTileType(data.tileType);
            this._tileView.init({
                tileBaseType        : null,
                tileBaseShapeId     : null,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                tileObjectType      : tileObjectType,
                tileObjectShapeId   : 0,
                playerIndex         : CommonConstants.PlayerIndex.Neutral,
                gameConfig,
            });
            this._tileView.updateView();
        }
    }
}

// export default TwnsWarMapBuildingListPanel;
