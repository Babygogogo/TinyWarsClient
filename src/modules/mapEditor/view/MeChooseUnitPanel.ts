
// import TwnsBwUnit               from "../../baseWar/model/BwUnit";
// import TwnsBwUnitView           from "../../baseWar/view/BwUnitView";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsMeDrawer             from "../model/MeDrawer";
// import MeModel                  from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import DataForDrawUnit  = MapEditor.DataForDrawUnit;
    import LangTextType     = Lang.LangTextType;
    import NotifyType       = Notify.NotifyType;

    const MAX_RECENT_COUNT = 10;

    export type OpenDataForMeChooseUnitPanel = void;
    export class MeChooseUnitPanel extends TwnsUiPanel.UiPanel<OpenDataForMeChooseUnitPanel> {
        private readonly _labelRecentTitle! : TwnsUiLabel.UiLabel;
        private readonly _listRecent!       : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _listPlayerIndex!  : TwnsUiScrollList.UiScrollList<DataForPlayerIndexRenderer>;
        private readonly _listUnit!         : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        private _dataListForRecent   : DataForUnitRenderer[] = [];

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listPlayerIndex.setItemRenderer(PlayerIndexRenderer);
            this._listRecent.setItemRenderer(UnitRenderer);
            this._listUnit.setItemRenderer(UnitRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._resetListPlayerIndex(Twns.CommonConstants.WarFirstPlayerIndex);
            this._updateListUnit();
            this._updateListRecent();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public setAndReviseSelectedPlayerIndex(newPlayerIndex: number, needScroll: boolean): void {
            const listPlayerIndex   = this._listPlayerIndex;
            const index             = Helpers.getExisted(listPlayerIndex.getRandomIndex(v => v.playerIndex === newPlayerIndex));
            listPlayerIndex.setSelectedIndex(index);
            this._updateListUnit();

            if (needScroll) {
                listPlayerIndex.scrollVerticalToIndex(index);
            }
        }

        public updateOnChooseUnit(data: DataForDrawUnit): void {
            const dataList      = this._dataListForRecent;
            const filteredList  = dataList.filter(v => {
                const oldData = v.dataForDrawUnit;
                return (oldData.playerIndex != data.playerIndex)
                    || (oldData.unitType != data.unitType);
            });
            dataList.length     = 0;
            dataList[0]         = {
                dataForDrawUnit: data,
                panel   : this,
            };
            for (const v of filteredList) {
                if (dataList.length < MAX_RECENT_COUNT) {
                    dataList.push(v);
                } else {
                    break;
                }
            }
            this._updateListRecent();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._labelRecentTitle.text = `${Lang.getText(LangTextType.B0372)}:`;
        }

        private _resetListPlayerIndex(selectedPlayerIndex: number | null): void {
            const dataArray: DataForPlayerIndexRenderer[] = [];
            for (let playerIndex = Twns.CommonConstants.WarFirstPlayerIndex; playerIndex <= Twns.CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
                dataArray.push({
                    playerIndex,
                    panel       : this,
                });
            }

            const list = this._listPlayerIndex;
            list.bindData(dataArray);
            list.setSelectedIndex(list.getFirstIndex(v => v.playerIndex === selectedPlayerIndex) ?? (dataArray.length ? 0 : -1));
        }

        private async _updateListUnit(): Promise<void> {
            const playerIndex = this._listPlayerIndex.getSelectedData()?.playerIndex;
            const listUnit    = this._listUnit;
            if (playerIndex == null) {
                listUnit.clear();
                return;
            }

            const dataArray: DataForUnitRenderer[] = [];
            for (const unitType of (await Config.ConfigManager.getLatestGameConfig()).getUnitTypesByCategory(Types.UnitCategory.All) ?? []) {
                dataArray.push({
                    panel           : this,
                    dataForDrawUnit : {
                        playerIndex,
                        unitType,
                    },
                });
            }

            listUnit.bindData(dataArray);
        }

        private _updateListRecent(): void {
            this._listRecent.bindData(this._dataListForRecent);
            this._listRecent.scrollHorizontalTo(0);
        }
    }

    type DataForPlayerIndexRenderer = {
        playerIndex : number;
        panel       : MeChooseUnitPanel;
    };
    class PlayerIndexRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerIndexRenderer> {
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelPlayerIndex.text = `P${this._getData().playerIndex}`;
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedPlayerIndex(data.playerIndex, false);
        }
    }

    type DataForUnitRenderer = {
        dataForDrawUnit : DataForDrawUnit;
        panel           : MeChooseUnitPanel;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _conUnitView!  : eui.Group;

        private _unitView   = new BaseWar.BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);

            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickUnitAnimationFrame();
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            this._unitView.tickStateAnimationFrame();
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const dataForDrawUnit   = data.dataForDrawUnit;
            const unitType          = dataForDrawUnit.unitType;
            const war               = Helpers.getExisted(MapEditor.MeModel.getWar());
            this._labelName.text    = Lang.getUnitName(unitType) ?? Twns.CommonConstants.ErrorTextForUndefined;

            const unitView  = this._unitView;
            const unit      = new BaseWar.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType,
                playerIndex : dataForDrawUnit.playerIndex,
            }, war.getGameConfig());
            unit.startRunning(war);
            unitView.init(unit);
            unitView.startRunningView();
        }

        public onItemTapEvent(): void {
            const data              = this._getData();
            const panel             = data.panel;
            const dataForDrawUnit   = data.dataForDrawUnit;
            panel.updateOnChooseUnit(dataForDrawUnit);
            panel.close();
            Helpers.getExisted(MapEditor.MeModel.getWar()).getDrawer().setModeDrawUnit(dataForDrawUnit);
        }
    }
}

// export default TwnsMeChooseUnitPanel;
