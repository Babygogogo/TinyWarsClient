
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
namespace Twns.Common {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;
    import PlayerAliveState = Twns.Types.PlayerAliveState;

    const AVAILABLE_STATES = [
        PlayerAliveState.Alive,
        PlayerAliveState.Dying,
        PlayerAliveState.Dead,
    ];

    export type OpenDataForCommonChoosePlayerAliveStatePanel = {
        currentAliveStateArray  : PlayerAliveState[];
        callbackOnConfirm       : (aliveStateArray: PlayerAliveState[]) => void;
    };
    export class CommonChoosePlayerAliveStatePanel extends TwnsUiPanel.UiPanel<OpenDataForCommonChoosePlayerAliveStatePanel> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnSelectAll!     : TwnsUiButton.UiButton;
        private readonly _btnUnselectAll!   : TwnsUiButton.UiButton;
        private readonly _listLocation!     : TwnsUiScrollList.UiScrollList<DataForAliveStateRenderer>;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSelectAll,       callback: this._onTouchedBtnSelectAll },
                { ui: this._btnUnselectAll,     callback: this._onTouchedBtnUnselectAll },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
                { ui: this._btnCancel,          callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listLocation.setItemRenderer(AliveStateRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListLocation();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnSelectAll(): void {
            const indexArray        : number[] = [];
            const list              = this._listLocation;
            const dataArrayLength   = list.getBoundDataArrayLength() ?? 0;
            for (let i = 0; i < dataArrayLength; ++i) {
                indexArray.push(i);
            }
            list.setSelectedIndexArray(indexArray);
        }
        private _onTouchedBtnUnselectAll(): void {
            this._listLocation.setSelectedIndexArray([]);
        }
        private _onTouchedBtnConfirm(): void {
            this._getOpenData().callbackOnConfirm(this._listLocation.getSelectedDataArray()?.map(v => v.aliveState).sort((v1, v2) => v1 - v2) ?? []);
            this.close();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getFormattedText(LangTextType.F0092, Lang.getText(LangTextType.B0784));
            this._btnSelectAll.label    = Lang.getText(LangTextType.B0761);
            this._btnUnselectAll.label  = Lang.getText(LangTextType.B0762);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        }

        private _updateListLocation(): void {
            const openData  = this._getOpenData();
            const dataArray : DataForAliveStateRenderer[] = [];
            for (const aliveState of AVAILABLE_STATES) {
                dataArray.push({ aliveState });
            }

            const aliveStateArray   = openData.currentAliveStateArray;
            const list              = this._listLocation;
            list.bindData(dataArray);
            list.setSelectedIndexArray(Twns.Helpers.getNonNullElements(dataArray.map((v, i) => aliveStateArray.indexOf(v.aliveState) >= 0 ? i : null)));
        }
    }

    type DataForAliveStateRenderer = {
        aliveState  : Twns.Types.PlayerAliveState;
    };
    class AliveStateRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForAliveStateRenderer> {
        private readonly _groupShow!    : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._labelName.text = Lang.getPlayerAliveStateName(this._getData().aliveState) ?? CommonConstants.ErrorTextForUndefined;
        }
    }
}

// export default TwnsCommonChoosePlayerAliveStatePanel;
