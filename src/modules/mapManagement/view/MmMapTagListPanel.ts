
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify       from "../../tools/notify/NotifyType";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import MeModel              from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapManagement {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;

    export type OpenDataForMmMapTagListPanel = void;
    export class MmMapTagListPanel extends TwnsUiPanel.UiPanel<OpenDataForMmMapTagListPanel> {
        private readonly _imgMask!              : TwnsUiImage.UiImage;
        private readonly _labelTitle!           : TwnsUiLabel.UiLabel;
        private readonly _btnClose!             : TwnsUiButton.UiButton;

        private readonly _labelMapTagEnabled!   : TwnsUiLabel.UiLabel;
        private readonly _labelMapTagName!      : TwnsUiLabel.UiLabel;
        private readonly _labelTips!            : TwnsUiLabel.UiLabel;

        private readonly _listLocation!         : TwnsUiScrollList.UiScrollList<DataForLocationRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMmSetMapTagSingleData,    callback: this._onNotifyMsgMmSetMapTagSingleData },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,          callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listLocation.setItemRenderer(LocationRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListLocation();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgMmSetMapTagSingleData(): void {
            FloatText.show(Lang.getText(LangTextType.A0312));
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(LangTextType.B0445);
            this._labelMapTagEnabled.text   = Lang.getText(LangTextType.B0431);
            this._labelMapTagName.text      = Lang.getText(LangTextType.B0162);
            this._labelTips.text            = Lang.getText(LangTextType.A0313);
        }

        private _updateListLocation(): void {
            const dataArray : DataForLocationRenderer[] = [];
            for (let mapTagId = CommonConstants.Map.MapTag.MinId; mapTagId <= CommonConstants.Map.MapTag.MaxId; ++mapTagId) {
                dataArray.push({ mapTagId });
            }

            this._listLocation.bindData(dataArray);
        }
    }

    type DataForLocationRenderer = {
        mapTagId  : number;
    };
    class LocationRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForLocationRenderer> {
        private readonly _labelMapTagId!    : TwnsUiLabel.UiLabel;
        private readonly _groupIsEnabled!   : eui.Group;
        private readonly _imgIsEnabled!     : TwnsUiImage.UiImage;
        private readonly _labelMapTagName!  : TwnsUiLabel.UiLabel;
        private readonly _groupModifyName!  : eui.Group;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMapGetMapTag, callback: this._onNotifyMsgMapGetMapTag },
            ]);
            this._setUiListenerArray([
                { ui: this._groupIsEnabled,     callback: this._onTouchedGroupIsEnabled },
                { ui: this._groupModifyName,    callback: this._onTouchedGroupModifyName },
            ]);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }
        private _onNotifyMsgMapGetMapTag(): void {
            this._updateView();
        }
        private async _onTouchedGroupIsEnabled(): Promise<void> {
            const mapTagId      = this._getData().mapTagId;
            const mapTagData    = (await WarMap.WarMapModel.getMapTag())?.mapTagDataArray?.find(v => v.mapTagId === mapTagId);
            const nameArray     = mapTagData?.nameArray ?? [];
            if ((mapTagData == null) || (Lang.getLanguageText({ textArray: nameArray}) == null)) {
                FloatText.show(Lang.getText(LangTextType.A0311));
                return;
            }

            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0225),
                callback: () => {
                    WarMap.WarMapProxy.reqMmSetMapTagSingleData({
                        mapTagId,
                        isEnabled   : !mapTagData.isEnabled,
                        nameArray,
                    });
                },
            });
        }
        private async _onTouchedGroupModifyName(): Promise<void> {
            const mapTagId      = this._getData().mapTagId;
            const mapTagData    = (await WarMap.WarMapModel.getMapTag())?.mapTagDataArray?.find(v => v.mapTagId === mapTagId);
            PanelHelpers.open(PanelHelpers.PanelDict.CommonInputLanguageTextPanel, {
                currentTextArray    : mapTagData?.nameArray ?? null,
                maxLength           : CommonConstants.Map.MapTag.NameMaxLength,
                callback            : textArray => {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                        content : Lang.getText(LangTextType.A0225),
                        callback: () => {
                            WarMap.WarMapProxy.reqMmSetMapTagSingleData({
                                mapTagId,
                                isEnabled   : !!mapTagData?.isEnabled,
                                nameArray   : textArray,
                            });
                        },
                    });
                },
            });
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private async _updateView(): Promise<void> {
            const mapTagId              = this._getData().mapTagId;
            const mapTagData            = (await WarMap.WarMapModel.getMapTag())?.mapTagDataArray?.find(v => v.mapTagId === mapTagId);
            this._labelMapTagId.text    = `${mapTagId}`;
            this._imgIsEnabled.visible  = !!mapTagData?.isEnabled;
            this._labelMapTagName.text  = Lang.getLanguageText({ textArray: mapTagData?.nameArray }) ?? '--';
        }
    }
}

// export default TwnsMmMapTagListPanel;
