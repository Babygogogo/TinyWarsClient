
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiMapInfo        from "../../tools/ui/UiMapInfo";
// import TwnsUiTabPage        from "../../tools/ui/UiTabPage";
// import TwnsUiZoomableMap    from "../../tools/ui/UiZoomableMap";
// import WarMapModel          from "../../warMap/model/WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;
    import GameConfig       = Twns.Config.GameConfig;

    export type OpenDataForCommonMapInfoPage = {
        gameConfig  : GameConfig;
        mapInfo?    : {
            mapId   : number;
        };
        warInfo?    : {
            warData     : CommonProto.WarSerialization.ISerialWar;
            players     : Types.Undefinable<CommonProto.WarSerialization.ISerialPlayer[]>;
        };
    } | null;
    export class CommonWarMapInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForCommonMapInfoPage> {
        private readonly _zoomMap!      : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _uiMapInfo!    : TwnsUiMapInfo.UiMapInfo;
        private readonly _labelLoading! : TwnsUiLabel.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonWarMapInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForRoomInfo();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(LangTextType.A0150);
        }
        private async _updateComponentsForRoomInfo(): Promise<void> {
            const zoomMap   = this._zoomMap;
            const uiMapInfo = this._uiMapInfo;
            const openData  = this._getOpenData();
            if (openData == null) {
                uiMapInfo.visible   = false;
                zoomMap.visible     = false;
            } else {
                uiMapInfo.visible   = true;
                zoomMap.visible     = true;

                const { mapInfo, warInfo }  = openData;
                if (mapInfo) {
                    const mapId = mapInfo.mapId;
                    uiMapInfo.setData({
                        mapInfo: {
                            mapId,
                        },
                    });

                    const mapRawData = await Twns.WarMap.WarMapModel.getRawData(mapId);
                    if (mapRawData) {
                        zoomMap.showMapByMapData(mapRawData, openData.gameConfig);
                    } else {
                        zoomMap.clearMap();
                    }

                } else if (warInfo) {
                    const warData = warInfo.warData;
                    uiMapInfo.setData({
                        warData,
                    });
                    zoomMap.showMapByWarData(warData, warInfo.players, openData.gameConfig);

                } else {
                    uiMapInfo.setData(null);
                    zoomMap.clearMap();
                }
            }
        }
    }
}

// export default TwnsCommonWarMapInfoPage;
