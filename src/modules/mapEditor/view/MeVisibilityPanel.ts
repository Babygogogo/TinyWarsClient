
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import LangTextType = Twns.Lang.LangTextType;
    import NotifyType   = Twns.Notify.NotifyType;

    export type OpenDataForMeVisibilityPanel = void;
    export class MeVisibilityPanel extends TwnsUiPanel.UiPanel<OpenDataForMeVisibilityPanel> {
        private readonly _groupUnit!            : eui.Group;
        private readonly _labelUnit!            : TwnsUiLabel.UiLabel;
        private readonly _imgUnit!              : TwnsUiImage.UiImage;
        private readonly _groupTileObject!      : eui.Group;
        private readonly _imgTileObject!        : TwnsUiImage.UiImage;
        private readonly _labelTileObject!      : TwnsUiLabel.UiLabel;
        private readonly _groupTileBase!        : eui.Group;
        private readonly _imgTileBase!          : TwnsUiImage.UiImage;
        private readonly _labelTileBase!        : TwnsUiLabel.UiLabel;
        private readonly _groupTileDecorator!   : eui.Group;
        private readonly _imgTileDecorator!     : TwnsUiImage.UiImage;
        private readonly _labelTileDecorator!   : TwnsUiLabel.UiLabel;

        private readonly _btnShowAllLocations!  : TwnsUiButton.UiButton;
        private readonly _btnHideAllLocations!  : TwnsUiButton.UiButton;
        private readonly _listLocation!         : TwnsUiScrollList.UiScrollList<DataForLocationRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._groupTileBase,          callback: this._onTouchedGroupTileBase, },
                { ui: this._groupTileDecorator,     callback: this._onTouchedGroupTileDecorator },
                { ui: this._groupTileObject,        callback: this._onTouchedGroupTileObject, },
                { ui: this._groupUnit,              callback: this._onTouchedGroupUnit },
                { ui: this._btnShowAllLocations,    callback: this._onTouchedBtnShowAllLocations },
                { ui: this._btnHideAllLocations,    callback: this._onTouchedBtnHideAllLocations },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listLocation.setItemRenderer(LocationRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateGroupUnit();
            this._updateGroupTileBase();
            this._updateGroupTileDecorator();
            this._updateGroupTileObject();
            this._updateListLocation();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): Twns.MapEditor.MeWar {
            return Twns.Helpers.getExisted(Twns.MapEditor.MeModel.getWar());
        }

        private _onTouchedGroupTileBase(): void {
            const view = this._getWar().getField().getView();
            view.setTileBasesVisible(!view.getTileBasesVisible());
            this._updateGroupTileBase();
        }

        private _onTouchedGroupTileDecorator(): void {
            const view = this._getWar().getField().getView();
            view.setTileDecoratorsVisible(!view.getTileDecoratorsVisible());
            this._updateGroupTileDecorator();
        }

        private _onTouchedGroupTileObject(): void {
            const view = this._getWar().getField().getView();
            view.setTileObjectsVisible(!view.getTileObjectsVisible());
            this._updateGroupTileObject();
        }

        private _onTouchedGroupUnit(): void {
            const view = this._getWar().getField().getView();
            view.setUnitsVisible(!view.getUnitsVisible());
            this._updateGroupUnit();
        }

        private _onTouchedBtnShowAllLocations(): void {
            const tileMap = this._getWar().getTileMap();
            for (let locationId = Twns.CommonConstants.MapMinLocationId; locationId <= Twns.CommonConstants.MapMaxLocationId; ++locationId) {
                tileMap.setIsLocationVisible(locationId, true);
            }
        }
        private _onTouchedBtnHideAllLocations(): void {
            const war           = this._getWar();
            const tileMap       = war.getTileMap();
            const drawer        = war.getDrawer();
            const drawerMode    = drawer.getMode();
            for (let locationId = Twns.CommonConstants.MapMinLocationId; locationId <= Twns.CommonConstants.MapMaxLocationId; ++locationId) {
                if (((drawerMode === Twns.Types.MapEditorDrawerMode.AddTileToLocation) && (drawer.getDataForAddTileToLocation()?.locationIdArray.some(v => v === locationId)))           ||
                    ((drawerMode === Twns.Types.MapEditorDrawerMode.DeleteTileFromLocation) && (drawer.getDataForDeleteTileFromLocation()?.locationIdArray.some(v => v === locationId)))
                ) {
                    continue;
                }

                tileMap.setIsLocationVisible(locationId, false);
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTileBase.text        = Lang.getText(LangTextType.B0302);
            this._labelTileDecorator.text   = Lang.getText(LangTextType.B0664);
            this._labelTileObject.text      = Lang.getText(LangTextType.B0303);
            this._labelUnit.text            = Lang.getText(LangTextType.B0304);
            this._btnShowAllLocations.label = Lang.getText(LangTextType.B0757);
            this._btnHideAllLocations.label = Lang.getText(LangTextType.B0758);
        }

        private _updateGroupUnit(): void {
            this._imgUnit.visible = this._getWar().getField().getView().getUnitsVisible();
        }
        private _updateGroupTileBase(): void {
            this._imgTileBase.visible = this._getWar().getField().getView().getTileBasesVisible();
        }
        private _updateGroupTileDecorator(): void {
            this._imgTileDecorator.visible = this._getWar().getField().getView().getTileDecoratorsVisible();
        }
        private _updateGroupTileObject(): void {
            this._imgTileObject.visible = this._getWar().getField().getView().getTileObjectsVisible();
        }
        private _updateListLocation(): void {
            const dataArray : DataForLocationRenderer[] = [];
            const war       = this._getWar();
            for (let locationId = Twns.CommonConstants.MapMinLocationId; locationId <= Twns.CommonConstants.MapMaxLocationId; ++locationId) {
                dataArray.push({ war, locationId });
            }
            this._listLocation.bindData(dataArray);
        }
    }

    type DataForLocationRenderer = {
        war         : Twns.MapEditor.MeWar;
        locationId  : number;
    };
    class LocationRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
        private readonly _groupShow!        : eui.Group;
        private readonly _imgShow!          : TwnsUiImage.UiImage;
        private readonly _labelLocationId!  : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.BwTileMapLocationVisibleSet, callback: this._onNotifyBwTileMapLocationVisibleSet },
            ]);
            this._setUiListenerArray([
                { ui: this._groupShow,  callback: this._onTouchedGroupShow },
            ]);
        }
        protected _onDataChanged(): void {
            this._labelLocationId.text = `${this._getData().locationId}`;
            this._updateImgShow();
        }

        private _onNotifyBwTileMapLocationVisibleSet(): void {
            this._updateImgShow();
        }
        private _onTouchedGroupShow(): void {
            const data          = this._getData();
            const locationId    = data.locationId;
            const war           = data.war;
            const drawer        = war.getDrawer();
            if (((drawer.getMode() === Twns.Types.MapEditorDrawerMode.AddTileToLocation) && (drawer.getDataForAddTileToLocation()?.locationIdArray.some(v => v === locationId)))             ||
                ((drawer.getMode() === Twns.Types.MapEditorDrawerMode.DeleteTileFromLocation) && (drawer.getDataForDeleteTileFromLocation()?.locationIdArray.some(v => v === locationId)))
            ) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0267));
                return;
            }

            const tileMap = war.getTileMap();
            tileMap.setIsLocationVisible(locationId, !tileMap.getIsLocationVisible(locationId));
        }

        private _updateImgShow(): void {
            const data              = this._getData();
            this._imgShow.visible   = data.war.getTileMap().getIsLocationVisible(data.locationId);
        }
    }
}

// export default TwnsMeVisibilityPanel;
