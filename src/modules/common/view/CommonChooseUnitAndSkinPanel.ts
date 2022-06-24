
// import TwnsBwWar                from "../../baseWar/model/BwWar";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarEventHelper           from "../model/WarEventHelper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import NotifyType           = Notify.NotifyType;
    import LangTextType         = Lang.LangTextType;
    import GameConfig           = Config.GameConfig;

    export type OpenDataForCommonChooseUnitAndSkinPanel = {
        gameConfig      : GameConfig;
        unitTypeArray   : number[];
        skinIdArray     : number[];
        callback        : (unitType: number, skinId: number) => void;
    };
    export class CommonChooseUnitAndSkinPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseUnitAndSkinPanel> {
        private readonly _imgMask!      : TwnsUiImage.UiImage;
        private readonly _group!        : eui.Group;
        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;
        private readonly _listSkin!     : TwnsUiScrollList.UiScrollList<DataForSkinRenderer>;
        private readonly _listType!     : TwnsUiScrollList.UiScrollList<DataForTypeRenderer>;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listSkin.setItemRenderer(SkinRenderer);
            this._listType.setItemRenderer(TypeRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public updateOnSelectedSkinIdChanged(): void {
            const listType      = this._listType;
            const selectedIndex = listType.getSelectedIndex();
            this._updateListType();
            listType.setSelectedIndex(selectedIndex ?? 0);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onTouchedBtnConfirm(): void {
            const unitType  = Helpers.getExisted(this._listType.getSelectedData()?.unitType);
            const skinId    = Helpers.getExisted(this._listSkin.getSelectedData()?.skinId);
            this._getOpenData().callback(unitType, skinId);
            this.close();
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateListSkin();
            this._updateListType();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0913);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
        }
        private _updateListSkin(): void {
            const dataArray: DataForSkinRenderer[] = [];
            for (const skinId of this._getOpenData().skinIdArray) {
                dataArray.push({
                    skinId,
                    panel   : this,
                });
            }

            const list = this._listSkin;
            list.bindData(dataArray);
            list.setSelectedIndex(0);
        }
        private _updateListType(): void {
            const openData      = this._getOpenData();
            const skinId        = Helpers.getExisted(this._listSkin.getSelectedData()?.skinId ?? openData.skinIdArray[0]);
            const gameConfig    = openData.gameConfig;
            const dataArray     : DataForTypeRenderer[] = [];
            for (const newUnitType of openData.unitTypeArray) {
                dataArray.push({
                    gameConfig,
                    unitType        : newUnitType,
                    skinId,
                });
            }

            const list = this._listType;
            list.bindData(dataArray);
            list.setSelectedIndex(0);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForSkinRenderer = {
        skinId  : number;
        panel   : CommonChooseUnitAndSkinPanel;
    };
    class SkinRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkinRenderer> {
        private readonly _imgColor! : TwnsUiImage.UiImage;

        protected _onDataChanged(): void {
            this._updateImgColor();
        }

        public onItemTapEvent(): void {
            this._getData().panel.updateOnSelectedSkinIdChanged();
        }

        private _updateImgColor(): void {
            this._imgColor.source = WarHelpers.WarCommonHelpers.getImageSourceForSkinId(this._getData().skinId, true);
        }
    }

    type DataForTypeRenderer = {
        gameConfig  : GameConfig;
        unitType    : number;
        skinId      : number;
    };
    class TypeRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
        private readonly _conUnitView!  : eui.Group;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;

        private readonly _unitView      = new WarMap.WarMapUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            ]);

            this._conUnitView.addChild(this._unitView);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateLabelType();
            this._updateUnitView();
        }

        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAnimationTick(): void {
            this._unitView.updateOnAnimationTick(Timer.getUnitAnimationTickCount());
        }

        private _updateComponentsForLanguage(): void {
            this._updateLabelType();
        }

        private _updateLabelType(): void {
            const data              = this._getData();
            const newUnitType       = data.unitType;
            this._labelType.text    = Lang.getUnitName(newUnitType, data.gameConfig) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateUnitView(): void {
            const data = this._getData();
            this._unitView.update({
                gameConfig  : data.gameConfig,
                gridIndex   : { x: 0, y: 0 },
                playerIndex : data.skinId,
                unitType    : data.unitType,
            });
        }
    }
}

// export default TwnsCommonChooseUnitAndSkinPanel;
