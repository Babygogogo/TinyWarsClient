
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeActionModifyPanel4 {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = Twns.BaseWar.BwWar;

    export type OpenData = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel4 extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnType!              : TwnsUiButton.UiButton;
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _labelMapSizeTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelMapSize!         : TwnsUiLabel.UiLabel;
        private readonly _labelGridIndex!       : TwnsUiLabel.UiLabel;
        private readonly _inputGridX!           : TwnsUiTextInput.UiTextInput;
        private readonly _inputGridY!           : TwnsUiTextInput.UiTextInput;
        private readonly _groupNeedFocus!       : eui.Group;
        private readonly _imgNeedFocus!         : TwnsUiImage.UiImage;
        private readonly _labelNeedFocus!       : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._groupNeedFocus,         callback: this._onTouchedGroupNeedFocus },
                { ui: this._btnType,                callback: this._onTouchedBtnType },
                { ui: this._btnBack,                callback: this.close },
                { ui: this._inputGridX,             callback: this._onFocusOutInputGridX,               eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputGridY,             callback: this._onFocusOutInputGridY,               eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(): void {
            this._updateComponentsForGridIndex();
            this._updateGroupNeedFocus();
        }

        private _onTouchedGroupNeedFocus(): void {
            const action            = Helpers.getExisted(this._getOpenData().action.WeaSetViewpoint);
            action.needFocusEffect  = !action.needFocusEffect;

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onFocusOutInputGridX(): void {
            const data      = this._getOpenData();
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.action.WeaSetViewpoint?.gridIndex));
            const newGridX  = Math.max(0, Math.min(parseInt(this._inputGridX.text) || 0, data.war.getTileMap().getMapSize().width - 1));
            if (newGridX !== gridIndex.x) {
                gridIndex.x = newGridX;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onFocusOutInputGridY(): void {
            const data      = this._getOpenData();
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.action.WeaSetViewpoint?.gridIndex));
            const newGridY  = Math.max(0, Math.min(parseInt(this._inputGridY.text) || 0, data.war.getTileMap().getMapSize().height - 1));
            if (newGridY !== gridIndex.y) {
                gridIndex.y = newGridY;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelMapSize();
            this._updateComponentsForGridIndex();
            this._updateGroupNeedFocus();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label             = Lang.getText(LangTextType.B0516);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelGridIndex.text       = Lang.getText(LangTextType.B0531);
            this._labelMapSizeTitle.text    = Lang.getText(LangTextType.B0300);
            this._labelNeedFocus.text       = Lang.getText(LangTextType.B0714);
        }

        private _updateLabelMapSize(): void {
            const mapSize           = this._getOpenData().war.getTileMap().getMapSize();
            this._labelMapSize.text = `${mapSize.width} x ${mapSize.height}`;
        }

        private _updateComponentsForGridIndex(): void {
            const inputX    = this._inputGridX;
            const inputY    = this._inputGridY;
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(this._getOpenData().action.WeaSetViewpoint?.gridIndex));
            inputX.text     = `${gridIndex.x}`;
            inputY.text     = `${gridIndex.y}`;
        }

        private _updateGroupNeedFocus(): void {
            this._imgNeedFocus.visible = !!this._getOpenData().action.WeaSetViewpoint?.needFocusEffect;
        }
    }
}

// export default TwnsWeActionModifyPanel4;
