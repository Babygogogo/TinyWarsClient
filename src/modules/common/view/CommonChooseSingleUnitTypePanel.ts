
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

    export type OpenDataForCommonChooseSingleUnitTypePanel = {
        gameConfig      : GameConfig;
        currentUnitType : number | null;
        unitTypeArray   : number[];
        playerIndex     : number;
        callback        : (unitType: number) => void;
    };
    export class CommonChooseSingleUnitTypePanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChooseSingleUnitTypePanel> {
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
            const gameConfig    = openData.gameConfig;
            const dataArray     : DataForTypeRenderer[] = [];
            for (const newUnitType of openData.unitTypeArray) {
                dataArray.push({
                    gameConfig,
                    currentUnitType: openData.currentUnitType,
                    newUnitType,
                    playerIndex,
                    callback        : openData.callback,
                });
            }
            this._listType.bindData(dataArray);
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

    type DataForTypeRenderer = {
        gameConfig      : GameConfig;
        currentUnitType : number | null;
        newUnitType     : number;
        playerIndex     : number;
        callback        : (unitType: number) => void;
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

        public onItemTapEvent(): void {
            const data          = this._getData();
            const newUnitType   = data.newUnitType;
            if (newUnitType !== data.currentUnitType) {
                data.callback(newUnitType);

                PanelHelpers.close(PanelHelpers.PanelDict.CommonChooseSingleUnitTypePanel);
            }
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
            const data          = this._getData();
            const label         = this._labelType;
            const newUnitType   = data.newUnitType;
            label.text          = Lang.getUnitName(newUnitType, data.gameConfig) || CommonConstants.ErrorTextForUndefined;
            label.textColor     = data.currentUnitType === newUnitType ? 0x00FF00 : 0xFFFFFF;
        }
        private _updateUnitView(): void {
            const data = this._getData();
            this._unitView.update({
                gameConfig  : data.gameConfig,
                gridIndex   : { x: 0, y: 0 },
                playerIndex : data.playerIndex,
                unitType    : data.newUnitType,
            });
        }
    }
}

// export default TwnsCommonChooseSingleUnitTypePanel;
