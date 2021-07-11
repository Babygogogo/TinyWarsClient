
import { UiListItemRenderer }   from "../gameui/UiListItemRenderer";
import { UiComponent }          from "../gameui/UiComponent";
import { UiLabel }              from "../gameui/UiLabel";
import { UiScrollList }         from "../gameui/UiScrollList";
import { MeTileSimpleView }     from "../modules/mapEditor/view/MeTileSimpleView";
import * as CommonConstants     from "../utility/CommonConstants";
import * as ConfigManager       from "../utility/ConfigManager";
import * as Lang                from "../utility/Lang";
import { LangTextType } from "../utility/LangTextType";
import { Notify }               from "../utility/Notify";
import { NotifyType } from "../utility/NotifyType";
import * as ProtoTypes          from "../utility/ProtoTypes";
import { Types }                from "../utility/Types";
import * as BwHelpers           from "../modules/baseWar/model/BwHelpers";
import * as WarMapModel         from "../modules/warMap/model/WarMapModel";
import TileType                 = Types.TileType;

type DataForUiMapInfo = {
    mapInfo?    : {
        mapId           : number;
        configVersion   : string;
    };
    warData?    : ProtoTypes.WarSerialization.ISerialWar;
};

export class UiMapInfo extends UiComponent {
    private readonly _groupTile             : eui.Group;
    private readonly _listTile              : UiScrollList<DataForTileRenderer>;

    private readonly _groupMapInfo          : eui.Group;
    private readonly _labelMapName          : UiLabel;
    private readonly _labelDesignerTitle    : UiLabel;
    private readonly _labelDesigner         : UiLabel;
    private readonly _labelRatingTitle      : UiLabel;
    private readonly _labelRating           : UiLabel;
    private readonly _labelPlayedTimesTitle : UiLabel;
    private readonly _labelPlayedTimes      : UiLabel;
    private readonly _labelPlayersCountTitle: UiLabel;
    private readonly _labelPlayersCount     : UiLabel;
    private readonly _labelMapSizeTitle     : UiLabel;
    private readonly _labelMapSize          : UiLabel;

    private _data: DataForUiMapInfo | null;

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._listTile.setItemRenderer(TileRenderer);

        this._updateComponentsForLanguage();
        this._updateComponentsForMapInfo();
    }

    public setData(data: DataForUiMapInfo | null): void {
        this._data = data;
        if (this.getIsOpening()) {
            this._updateComponentsForMapInfo();
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelDesignerTitle.text       = `${Lang.getText(LangTextType.B0163)}:`;
        this._labelPlayersCountTitle.text   = Lang.getText(LangTextType.B0229);
        this._labelPlayedTimesTitle.text    = Lang.getText(LangTextType.B0565);
        this._labelMapSizeTitle.text        = Lang.getText(LangTextType.B0300);
        this._labelRatingTitle.text         = Lang.getText(LangTextType.B0253);
    }

    private async _updateComponentsForMapInfo(): Promise<void> {
        const data = this._data;
        if (!data) {
            return;
        }

        const labelMapName      = this._labelMapName;
        const labelDesigner     = this._labelDesigner;
        const labelPlayersCount = this._labelPlayersCount;
        const labelRating       = this._labelRating;
        const labelPlayedTimes  = this._labelPlayedTimes;
        const labelMapSize      = this._labelMapSize;

        const mapInfo = data.mapInfo;
        if (mapInfo) {
            const mapId             = mapInfo.mapId;
            const mapRawData        = await WarMapModel.getRawData(mapId);
            const rating            = await WarMapModel.getAverageRating(mapId);
            labelMapName.text       = await WarMapModel.getMapNameInCurrentLanguage(mapId);
            labelDesigner.text      = mapRawData.designerName;
            labelPlayersCount.text  = `${mapRawData.playersCountUnneutral}`;
            labelRating.text        = rating != null ? rating.toFixed(2) : Lang.getText(LangTextType.B0001);
            labelPlayedTimes.text   = `${await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId)}`;
            labelMapSize.text       = `${mapRawData.mapWidth} x ${mapRawData.mapHeight}`;
            this._listTile.bindData(generateDataForListTile(mapRawData.tileDataArray, mapInfo.configVersion));

            return;
        }

        const warData = data.warData;
        if (warData) {
            const tileMapData       = warData.field.tileMap;
            const mapSize           = BwHelpers.getMapSize(tileMapData);
            labelMapName.text       = `--`;
            labelDesigner.text      = `--`;
            labelPlayersCount.text  = `${warData.playerManager.players.length - 1}`;
            labelRating.text        = `--`;
            labelPlayedTimes.text   = `--`;
            labelMapSize.text       = `${mapSize.width} x ${mapSize.height}`;
            this._listTile.bindData(generateDataForListTile(tileMapData.tiles, warData.settingsForCommon.configVersion));

            return;
        }
    }
}

function generateDataForListTile(tileDataArray: ProtoTypes.WarSerialization.ISerialTile[], configVersion: string): DataForTileRenderer[] {
    const tileCountDict = new Map<TileType, number>();
    for (const tile of tileDataArray || []) {
        const tileType = ConfigManager.getTileType(tile.baseType, tile.objectType);
        if (tileType != null) {
            tileCountDict.set(tileType, (tileCountDict.get(tileType) || 0) + 1);
        }
    }

    const dataArray: DataForTileRenderer[] = [];
    for (const tileType of TileTypes) {
        dataArray.push({
            configVersion,
            tileType,
            num     : tileCountDict.get(tileType) || 0,
        });
    }
    return dataArray;
}

const TileTypes: TileType[] = [
    TileType.Factory,
    TileType.City,
    TileType.Airport,
    TileType.TempAirport,
    TileType.Seaport,
    TileType.TempSeaport,
    TileType.CommandTower,
    TileType.Radar,
];
type DataForTileRenderer = {
    configVersion   : string;
    tileType        : Types.TileType;
    num             : number;
};
class TileRenderer extends UiListItemRenderer<DataForTileRenderer> {
    private _group          : eui.Group;
    private _conTileView    : eui.Group;
    private _labelNum       : UiLabel;

    private _tileView       = new MeTileSimpleView();

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
        ]);

        const tileView = this._tileView;
        this._conTileView.addChild(tileView.getImgBase());
        this._conTileView.addChild(tileView.getImgObject());
        tileView.startRunningView();

    }
    protected async _onClosed(): Promise<void> {
        this._conTileView.removeChildren();
    }

    protected _onDataChanged(): void {
        const data          = this.data;
        this._labelNum.text = `x${data.num}`;

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

    public _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
}
