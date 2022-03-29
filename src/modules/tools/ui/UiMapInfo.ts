
// import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
// import TwnsMeTileSimpleView     from "../../mapEditor/view/MeTileSimpleView";
// import UserModel                from "../../user/model/UserModel";
// import UserProxy                from "../../user/model/UserProxy";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import CommonConstants          from "../helpers/CommonConstants";
// import ConfigManager            from "../helpers/ConfigManager";
// import FloatText                from "../helpers/FloatText";
// import Helpers                  from "../helpers/Helpers";
// import SoundManager             from "../helpers/SoundManager";
// import Types                    from "../helpers/Types";
// import Lang                     from "../lang/Lang";
// import TwnsLangTextType         from "../lang/LangTextType";
// import TwnsNotifyType           from "../notify/NotifyType";
// import ProtoTypes               from "../proto/ProtoTypes";
// import WarCommonHelpers         from "../warHelpers/WarCommonHelpers";
// import TwnsUiComponent          from "./UiComponent";
// import TwnsUiImage              from "./UiImage";
// import TwnsUiLabel              from "./UiLabel";
// import TwnsUiListItemRenderer   from "./UiListItemRenderer";
// import TwnsUiScrollList         from "./UiScrollList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUiMapInfo {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import TileType         = Types.TileType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    type DataForUiMapInfo = {
        mapInfo?    : {
            mapId           : number;
        };
        warData?    : CommonProto.WarSerialization.ISerialWar;
    };

    export class UiMapInfo extends TwnsUiComponent.UiComponent {
        private readonly _groupTile!                : eui.Group;
        private readonly _listTile!                 : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;

        private readonly _groupMapInfo!             : eui.Group;
        private readonly _labelMapName!             : TwnsUiLabel.UiLabel;
        private readonly _labelDesigner!            : TwnsUiLabel.UiLabel;
        private readonly _labelMapIdTitle!          : TwnsUiLabel.UiLabel;
        private readonly _labelMapId!               : TwnsUiLabel.UiLabel;
        private readonly _labelRatingTitle!         : TwnsUiLabel.UiLabel;
        private readonly _labelRating!              : TwnsUiLabel.UiLabel;
        private readonly _labelRaters!              : TwnsUiLabel.UiLabel;
        private readonly _groupMyRating!            : eui.Group;
        private readonly _labelMyRatingTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelMyRating!            : TwnsUiLabel.UiLabel;
        private readonly _imgSetMyRating!           : TwnsUiImage.UiImage;

        private readonly _groupWarStatistics!       : eui.Group;
        private readonly _labelPlayedTimesTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelPlayedTimes!         : TwnsUiLabel.UiLabel;
        private readonly _imgWarStatistics!         : TwnsUiImage.UiImage;

        private readonly _labelPlayersCountTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCount!        : TwnsUiLabel.UiLabel;
        private readonly _labelMapSizeTitle!        : TwnsUiLabel.UiLabel;
        private readonly _labelMapSize!             : TwnsUiLabel.UiLabel;

        private _data: DataForUiMapInfo | null = null;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetMapRating, callback: this._onNotifyMsgUserSetMapRating },
                { type: NotifyType.MsgMapGetBriefData,  callback: this._onNotifyMsgMapGetBriefData },
            ]);
            this._setUiListenerArray([
                { ui: this._groupMyRating,              callback: this._onTouchedGroupMyRating },
                { ui: this._groupWarStatistics,         callback: this._onTouchedGroupWarStatistics },
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
        private _onNotifyMsgUserSetMapRating(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgUserSetMapRating.IS;
            if (data.mapId === this._data?.mapInfo?.mapId) {
                this._updateComponentsForMapInfo();
            }
        }
        private _onNotifyMsgMapGetBriefData(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMapGetBriefData.IS;
            if (data.mapId === this._data?.mapInfo?.mapId) {
                this._updateComponentsForMapInfo();
            }
        }
        private _onTouchedGroupMyRating(): void {
            const mapId = this._data?.mapInfo?.mapId;
            if (mapId != null) {
                const minValue = CommonConstants.MapMinRating;
                const maxValue = CommonConstants.MapMaxRating;
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonInputIntegerPanel, {
                    title           : Lang.getText(LangTextType.B0363),
                    currentValue    : UserModel.getMapRating(mapId) || 0,
                    minValue,
                    maxValue,
                    tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}]\n${Lang.getText(LangTextType.A0238)}`,
                    callback        : panel => {
                        UserProxy.reqUserSetMapRating(mapId, panel.getInputValue());
                    },
                });
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            }
        }
        private _onTouchedGroupWarStatistics(): void {
            const mapId = this._data?.mapInfo?.mapId;
            if (mapId != null) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonMapWarStatisticsPanel, { mapId });
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelPlayersCountTitle.text   = Lang.getText(LangTextType.B0229);
            this._labelPlayedTimesTitle.text    = Lang.getText(LangTextType.B0565);
            this._labelMapSizeTitle.text        = Lang.getText(LangTextType.B0300);
            this._labelRatingTitle.text         = Lang.getText(LangTextType.B0364);
            this._labelMapIdTitle.text          = Lang.getText(LangTextType.B0821);
            this._labelMyRatingTitle.text       = Lang.getText(LangTextType.B0363);
            this._updateLabelDesigner();
        }

        private async _updateComponentsForMapInfo(): Promise<void> {
            this._updateLabelDesigner();

            const data              = this._data;
            const labelMapName      = this._labelMapName;
            const labelMapId        = this._labelMapId;
            const labelPlayersCount = this._labelPlayersCount;
            const labelRating       = this._labelRating;
            const labelRaters       = this._labelRaters;
            const labelMyRating     = this._labelMyRating;
            const labelPlayedTimes  = this._labelPlayedTimes;
            const labelMapSize      = this._labelMapSize;
            const imgSetMyRating    = this._imgSetMyRating;
            const imgWarStatistics  = this._imgWarStatistics;

            if (data == null) {
                labelMapName.text           = `--`;
                labelMapId.text             = `--`;
                labelPlayersCount.text      = `--`;
                labelRating.text            = `--`;
                labelRaters.text            = `(--)`;
                labelMyRating.text          = `--`;
                labelPlayedTimes.text       = `--`;
                labelMapSize.text           = `--`;
                imgSetMyRating.visible      = false;
                imgWarStatistics.visible    = false;

                return;
            }

            const mapInfo = data.mapInfo;
            if (mapInfo) {
                const mapId                 = mapInfo.mapId;
                const mapRawData            = Helpers.getExisted(await WarMapModel.getRawData(mapId));
                const rating                = await WarMapModel.getAverageRating(mapId);
                const myRating              = UserModel.getMapRating(mapId);
                labelMapName.text           = await WarMapModel.getMapNameInCurrentLanguage(mapId) || CommonConstants.ErrorTextForUndefined;
                labelMapId.text             = `${mapId}`;
                labelPlayersCount.text      = `${mapRawData.playersCountUnneutral}`;
                labelRating.text            = rating != null ? rating.toFixed(2) : Lang.getText(LangTextType.B0001);
                labelRaters.text            = `(${await WarMapModel.getTotalRatersCount(mapId)})`;
                labelMyRating.text          = myRating != null ? `${myRating}` : Lang.getText(LangTextType.B0001);
                labelPlayedTimes.text       = `${await WarMapModel.getTotalPlayedTimes(mapId)}`;
                labelMapSize.text           = `${mapRawData.mapWidth} x ${mapRawData.mapHeight}`;
                imgSetMyRating.visible      = true;
                imgWarStatistics.visible    = true;
                this._listTile.bindData(generateDataForListTile(Helpers.getExisted(mapRawData.tileDataArray)));

                return;
            }

            const warData = data.warData;
            if (warData) {
                const tileMapData           = Helpers.getExisted(warData.field?.tileMap);
                const mapSize               = WarCommonHelpers.getMapSize(tileMapData);
                labelMapName.text           = `--`;
                labelMapId.text             = `--`;
                labelPlayersCount.text      = `${Helpers.getExisted(warData.playerManager?.players).length - 1}`;
                labelRating.text            = `--`;
                labelRaters.text            = `(--)`;
                labelPlayedTimes.text       = `--`;
                labelMapSize.text           = `${mapSize.width} x ${mapSize.height}`;
                imgSetMyRating.visible      = false;
                imgWarStatistics.visible    = false;
                this._listTile.bindData(generateDataForListTile(Helpers.getExisted(tileMapData.tiles)));

                return;
            }
        }

        private async _updateLabelDesigner(): Promise<void> {
            const data              = this._data;
            const labelDesigner     = this._labelDesigner;
            const prefix            = `${Lang.getText(LangTextType.B0163)}: `;
            if (data == null) {
                labelDesigner.text  = `${prefix}--`;
                return;
            }

            const mapInfo = data.mapInfo;
            if (mapInfo) {
                const mapRawData    = Helpers.getExisted(await WarMapModel.getRawData(mapInfo.mapId));
                labelDesigner.text  = `${prefix}${mapRawData.designerName || CommonConstants.ErrorTextForUndefined}`;
                return;
            }

            const warData = data.warData;
            if (warData) {
                labelDesigner.text  = `${prefix}--`;
                return;
            }
        }
    }

    function generateDataForListTile(tileDataArray: CommonProto.WarSerialization.ISerialTile[]): DataForTileRenderer[] {
        const tileCountDict = new Map<TileType, number>();
        for (const tile of tileDataArray || []) {
            const tileType = ConfigManager.getTileType(Helpers.getExisted(tile.baseType), Helpers.getExisted(tile.objectType));
            if (tileType != null) {
                tileCountDict.set(tileType, (tileCountDict.get(tileType) || 0) + 1);
            }
        }

        const dataArray: DataForTileRenderer[] = [];
        for (const tileType of TileTypes) {
            dataArray.push({
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
        tileType        : Types.TileType;
        num             : number;
    };
    class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _conTileView!  : eui.Group;
        private readonly _labelNum!     : TwnsUiLabel.UiLabel;

        private _tileView       = new TwnsMeTileSimpleView.MeTileSimpleView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();

        }
        protected async _onClosed(): Promise<void> {
            this._conTileView.removeChildren();
        }

        protected _onDataChanged(): void {
            const data          = this._getData();
            this._labelNum.text = `x${data.num}`;

            const tileObjectType = ConfigManager.getTileObjectTypeByTileType(data.tileType);
            this._tileView.init({
                tileBaseType        : null,
                tileBaseShapeId     : null,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
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
}

// export default TwnsUiMapInfo;
