
namespace TinyWars.WarMap {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForBuildingListPanel = {
        configVersion   : string;
        mapRawData      : ProtoTypes.Map.IMapRawData;
    }

    export class WarMapBuildingListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: WarMapBuildingListPanel;

        public _labelTitle  : GameUi.UiLabel;
        public _listTile    : GameUi.UiScrollList;

        private _openData   : OpenDataForBuildingListPanel;

        public static show(openData: OpenDataForBuildingListPanel): void {
            if (!WarMapBuildingListPanel._instance) {
                WarMapBuildingListPanel._instance = new WarMapBuildingListPanel();
            }
            WarMapBuildingListPanel._instance._openData = openData;
            WarMapBuildingListPanel._instance.open();
        }

        public static hide(): void {
            if (WarMapBuildingListPanel._instance) {
                WarMapBuildingListPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/warMap/WarMapBuildingListPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);

            this._listTile.setItemRenderer(TileRenderer);
        }
        protected _onOpened(): void {
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
            const openData      = this._openData;
            const mapRawData    = openData.mapRawData;
            const configVersion = openData.configVersion;
            const dict          = new Map<number, Map<number, number>>();
            for (const tileData of mapRawData.tileDataList) {
                const template = ConfigManager.getTileTemplateCfg(configVersion, Types.TileBaseType.Plain, tileData.objectType);
                if ((template) && (template.maxCapturePoint != null)) {
                    const tileType = template.type;
                    if (!dict.has(tileType)) {
                        dict.set(tileType, new Map<number, number>());
                    }

                    const playerIndex   = tileData.playerIndex;
                    const subDict       = dict.get(tileType);
                    subDict.set(playerIndex, (subDict.get(playerIndex) || 0) + 1);
                }
            }

            const dataList          : DataForTileRenderer[] = [];
            const maxPlayerIndex    = mapRawData.playersCountUnneutral;
            for (const [tileType, subDict] of dict) {
                dataList.push({
                    configVersion,
                    maxPlayerIndex: maxPlayerIndex,
                    tileType,
                    dict    : subDict,
                });
            }
            this._listTile.bindData(dataList);
        }
    }

    type DataForTileRenderer = {
        configVersion   : string;
        maxPlayerIndex  : number;
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
            const maxPlayerIndex    = data.maxPlayerIndex;
            let totalNum            = 0;
            for (let playerIndex = CommonConstants.WarNeutralPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                const num                               = dict.get(playerIndex) || 0;
                totalNum                                += num;
                this._labelNumList[playerIndex].text    = playerIndex <= maxPlayerIndex ? `${num}` : `--`;
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
