
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeChooseLocationPanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;

    export type OpenData = {
        isAdd   : boolean;
    };
    export class MeChooseLocationPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnSelectAllLocations!    : TwnsUiButton.UiButton;
        private readonly _btnUnselectAllLocations!  : TwnsUiButton.UiButton;
        private readonly _listLocation!             : TwnsUiScrollList.UiScrollList<DataForLocationRenderer>;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;

        private _initialVisibleLocations    = 0;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSelectAllLocations,      callback: this._onTouchedBtnSelectAllLocations },
                { ui: this._btnUnselectAllLocations,    callback: this._onTouchedBtnUnselectAllLocations },
                { ui: this._btnConfirm,                 callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,                  callback: this._onTouchedBtnCancel },
            ]);
            this._setIsTouchMaskEnabled();
            this._setCallbackOnTouchedMask(() => {
                this._getWar().getTileMap().setLocationVisibleFlags(this._initialVisibleLocations);
                this.close();
            });

            this._listLocation.setItemRenderer(LocationRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._initialVisibleLocations = this._getWar().getTileMap().getLocationVisibleFlags();
            this._updateListLocation();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): Twns.MapEditor.MeWar {
            return Helpers.getExisted(MeModel.getWar());
        }

        private _onTouchedBtnSelectAllLocations(): void {
            this._getWar().getTileMap().setAllLocationVisible(true);

            const indexArray        : number[] = [];
            const list              = this._listLocation;
            const dataArrayLength   = list.getBoundDataArrayLength() ?? 0;
            for (let i = 0; i < dataArrayLength; ++i) {
                indexArray.push(i);
            }
            list.setSelectedIndexArray(indexArray);
        }
        private _onTouchedBtnUnselectAllLocations(): void {
            this._getWar().getTileMap().setAllLocationVisible(false);
            this._listLocation.setSelectedIndexArray([]);
        }
        private _onTouchedBtnConfirm(): void {
            const selectedDataArray = this._listLocation.getSelectedDataArray();
            if (!selectedDataArray?.length) {
                FloatText.show(Lang.getText(LangTextType.A0266));
            } else {
                const drawer            = this._getWar().getDrawer();
                const locationIdArray   = selectedDataArray.map(v => v.locationId).sort((v1, v2) => v1 - v2);
                if (this._getOpenData().isAdd) {
                    drawer.setModeAddTileToLocation({ locationIdArray });
                } else {
                    drawer.setModeDeleteTileFromLocation({ locationIdArray });
                }
                this.close();
            }
        }
        private _onTouchedBtnCancel(): void {
            this._getWar().getTileMap().setLocationVisibleFlags(this._initialVisibleLocations);
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getText(this._getOpenData().isAdd ? LangTextType.B0759 : LangTextType.B0760);
            this._btnSelectAllLocations.label   = Lang.getText(LangTextType.B0761);
            this._btnUnselectAllLocations.label = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        }

        private _updateListLocation(): void {
            const dataArray : DataForLocationRenderer[] = [];
            const war       = this._getWar();
            for (let locationId = CommonConstants.MapMinLocationId; locationId <= CommonConstants.MapMaxLocationId; ++locationId) {
                dataArray.push({ war, locationId });
            }

            const tileMap       = war.getTileMap();
            const listLocation  = this._listLocation;
            listLocation.bindData(dataArray);
            listLocation.setSelectedIndexArray(Helpers.getNonNullElements(dataArray.map((v, i) => tileMap.getIsLocationVisible(v.locationId) ? i : null)));
        }
    }

    type DataForLocationRenderer = {
        war         : Twns.BaseWar.BwWar;
        locationId  : number;
    };
    class LocationRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
        private readonly _groupShow!        : eui.Group;
        private readonly _labelLocationId!  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupShow,  callback: this._onTouchedGroupShow },
            ]);
        }
        protected _onDataChanged(): void {
            this._labelLocationId.text = `${this._getData().locationId}`;
        }

        private _onTouchedGroupShow(): void {
            const data          = this._getData();
            const locationId    = data.locationId;
            const tileMap       = data.war.getTileMap();
            tileMap.setIsLocationVisible(locationId, !tileMap.getIsLocationVisible(locationId));
        }
    }
}

// export default TwnsMeChooseLocationPanel;
