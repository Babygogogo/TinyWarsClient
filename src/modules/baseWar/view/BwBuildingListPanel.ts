
import TwnsMeTileSimpleView     from "../../mapEditor/view/MeTileSimpleView";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsBwPlayerManager      from "../model/BwPlayerManager";
import TwnsBwWar                from "../model/BwWar";

namespace TwnsBwBuildingListPanel {
    import BwPlayerManager  = TwnsBwPlayerManager.BwPlayerManager;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import BwWar            = TwnsBwWar.BwWar;

    type OpenDataForBwBuildingListPanel = {
        war: BwWar;
    };
    export class BwBuildingListPanel extends TwnsUiPanel.UiPanel<OpenDataForBwBuildingListPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: BwBuildingListPanel;

        public _labelTitle  : TwnsUiLabel.UiLabel;
        public _listTile    : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;

        public static show(openData: OpenDataForBwBuildingListPanel): void {
            if (!BwBuildingListPanel._instance) {
                BwBuildingListPanel._instance = new BwBuildingListPanel();
            }
            BwBuildingListPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (BwBuildingListPanel._instance) {
                await BwBuildingListPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/baseWar/BwBuildingListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listTile.setItemRenderer(TileRenderer);

            this._updateComponentsForLanguage();
            this._updateListTile();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text = Lang.getText(LangTextType.B0333);
        }

        private _updateListTile(): void {
            const dict  = new Map<number, Map<number, number>>();
            const war   = this._getOpenData().war;
            for (const tile of war.getTileMap().getAllTiles()) {
                if (tile.getMaxCapturePoint() != null) {
                    const tileType = tile.getType();
                    if (!dict.has(tileType)) {
                        dict.set(tileType, new Map<number, number>());
                    }
                    const playerIndex   = tile.getPlayerIndex();
                    const subDict       = dict.get(tileType);
                    subDict.set(playerIndex, (subDict.get(playerIndex) || 0) + 1);
                }
            }

            const dataList      : DataForTileRenderer[] = [];
            const playerManager = war.getPlayerManager();
            const configVersion = war.getConfigVersion();
            for (const [tileType, subDict] of dict) {
                dataList.push({
                    configVersion,
                    playerManager,
                    tileType,
                    dict    : subDict,
                });
            }
            this._listTile.bindData(dataList);
        }
    }

    type DataForTileRenderer = {
        configVersion   : string;
        playerManager   : BwPlayerManager;
        tileType        : Types.TileType;
        dict            : Map<number, number>;
    };
    class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _labelNum0      : TwnsUiLabel.UiLabel;
        private _labelNum1      : TwnsUiLabel.UiLabel;
        private _labelNum2      : TwnsUiLabel.UiLabel;
        private _labelNum3      : TwnsUiLabel.UiLabel;
        private _labelNum4      : TwnsUiLabel.UiLabel;
        private _labelTotalNum  : TwnsUiLabel.UiLabel;

        private _tileView   = new TwnsMeTileSimpleView.MeTileSimpleView();

        private _labelNumList   : TwnsUiLabel.UiLabel[];

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);

            const tileView = this._tileView;
            this._conTileView.addChild(tileView.getImgBase());
            this._conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();

            this._labelNumList = [
                this._labelNum0,
                this._labelNum1,
                this._labelNum2,
                this._labelNum3,
                this._labelNum4,
            ];
        }

        protected _onDataChanged(): void {
            const data              = this.data;
            const dict              = data.dict;
            const playerManager     = data.playerManager;
            let totalNum            = 0;
            for (let playerIndex = 0; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                const num                               = dict.get(playerIndex) || 0;
                totalNum                                += num;
                this._labelNumList[playerIndex].text    = playerManager.getPlayer(playerIndex) ? `${num}` : `--`;
            }
            this._labelTotalNum.text = `${totalNum}`;

            const tileObjectType = ConfigManager.getTileObjectTypeByTileType(data.tileType);
            this._tileView.init({
                tileBaseType        : null,
                tileBaseShapeId     : null,
                tileObjectType      : tileObjectType,
                tileObjectShapeId   : 0,
                playerIndex         : tileObjectType === Types.TileObjectType.Headquarters
                    ? CommonConstants.WarFirstPlayerIndex
                    : CommonConstants.WarNeutralPlayerIndex,
            });
            this._tileView.updateView();
        }

        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }
    }
}

export default TwnsBwBuildingListPanel;
