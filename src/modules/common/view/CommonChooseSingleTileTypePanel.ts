
// import TwnsBwWar                from "../../baseWar/model/BwWar";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarEventHelper           from "../model/WarEventHelper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import NotifyType           = Twns.Notify.NotifyType;
    import LangTextType         = Twns.Lang.LangTextType;
    import TileType             = Twns.Types.TileType;

    export type OpenDataForCommonChooseSingleTileTypePanel = {
        currentTileType : TileType;
        tileTypeArray   : TileType[];
        playerIndex     : number;
        callback        : (tileType: TileType) => void;
    };
    export class CommonChooseSingleTileTypePanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseSingleTileTypePanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _group!        : eui.Group;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _listType!     : TwnsUiScrollList.UiScrollList<DataForTypeRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listType.setItemRenderer(TypeRenderer);

        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListType();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0516);
        }
        private _updateListType(): void {
            const openData      = this._getOpenData();
            const playerIndex   = openData.playerIndex;
            const dataArray     : DataForTypeRenderer[] = [];
            for (const newTileType of openData.tileTypeArray) {
                dataArray.push({
                    currentTileType: openData.currentTileType,
                    newTileType,
                    playerIndex,
                    callback        : openData.callback,
                });
            }
            this._listType.bindData(dataArray);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }

    type DataForTypeRenderer = {
        currentTileType : TileType;
        newTileType     : TileType;
        playerIndex     : number;
        callback        : (tileType: TileType) => void;
    };
    class TypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
        private readonly _conTileView!  : eui.Group;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;

        private readonly _tileView      = new Twns.MapEditor.MeTileSimpleView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
            ]);

            const conTileView   = this._conTileView;
            const tileView      = this._tileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateLabelType();
            this._updateTileView();
        }

        public onItemTapEvent(): void {
            const data          = this._getData();
            const newTileType   = data.newTileType;
            if (newTileType !== data.currentTileType) {
                data.callback(newTileType);

                Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.CommonChooseSingleTileTypePanel);
            }
        }

        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }
        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelType();
        }

        private _updateLabelType(): void {
            const data      = this._getData();
            const label     = this._labelType;
            label.text      = Lang.getTileName(data.newTileType) || Twns.CommonConstants.ErrorTextForUndefined;
            label.textColor = data.currentTileType === data.newTileType ? 0x00FF00 : 0xFFFFFF;
        }
        private _updateTileView(): void {
            const data          = this._getData();
            const tileType      = data.newTileType;
            const objectType    = Twns.Config.ConfigManager.getTileObjectTypeByTileType(tileType);
            const baseType      = Twns.Config.ConfigManager.getTileBaseTypeByTileType(tileType);
            const playerIndex   = data.playerIndex;

            this._tileView.init({
                tileBaseType        : baseType,
                tileBaseShapeId     : 0,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                tileObjectType      : objectType,
                tileObjectShapeId   : 0,
                playerIndex         : Twns.Config.ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType) ? playerIndex : Twns.CommonConstants.WarNeutralPlayerIndex,
            });
        }
    }
}

// export default TwnsCommonChooseSingleTileTypePanel;
