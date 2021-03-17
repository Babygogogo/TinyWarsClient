
namespace TinyWars.BaseWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;

    type OpenDataForBwBuildingListPanel = {
        war: BwWar;
    }
    export class BwBuildingListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: BwBuildingListPanel;

        public _labelTitle  : GameUi.UiLabel;
        public _listTile    : GameUi.UiScrollList;

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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);
            this._listTile.setItemRenderer(TileRenderer);

            this._updateComponentsForLanguage();
            this._updateListTile();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyTileAnimationTick(e: egret.Event): void {
            const viewList = this._listTile.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof TileRenderer) && (child.updateOnTileAnimationTick());
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text = Lang.getText(Lang.Type.B0333);
        }

        private _updateListTile(): void {
            const dict  = new Map<number, Map<number, number>>();
            const war   = this._getOpenData<OpenDataForBwBuildingListPanel>().war;
            war.getTileMap().forEachTile(tile => {
                if (tile.getMaxCapturePoint() != null) {
                    const tileType = tile.getType();
                    if (!dict.has(tileType)) {
                        dict.set(tileType, new Map<number, number>());
                    }
                    const playerIndex   = tile.getPlayerIndex();
                    const subDict       = dict.get(tileType);
                    subDict.set(playerIndex, (subDict.get(playerIndex) || 0) + 1);
                }
            });

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
    }

    class TileRenderer extends GameUi.UiListItemRenderer {
        private _group          : eui.Group;
        private _conTileView    : eui.Group;
        private _labelNum0      : TinyWars.GameUi.UiLabel;
        private _labelNum1      : TinyWars.GameUi.UiLabel;
        private _labelNum2      : TinyWars.GameUi.UiLabel;
        private _labelNum3      : TinyWars.GameUi.UiLabel;
        private _labelNum4      : TinyWars.GameUi.UiLabel;
        private _labelTotalNum  : TinyWars.GameUi.UiLabel;

        private _tileView   = new MapEditor.MeTileSimpleView();

        private _labelNumList   : GameUi.UiLabel[];

        protected childrenCreated(): void {
            super.childrenCreated();

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

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForTileRenderer;
            const dict              = data.dict;
            const playerManager     = data.playerManager;
            let totalNum            = 0;
            for (let playerIndex = 0; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                const num                               = dict.get(playerIndex) || 0;
                totalNum                                += num;
                this._labelNumList[playerIndex].text    = playerManager.getPlayer(playerIndex) ? `${num}` : `--`;
            }
            this._labelTotalNum.text = `${totalNum}`;

            const tileObjectType = Utility.ConfigManager.getTileObjectTypeByTileType(data.tileType);
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

        public updateOnTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }
    }
}
