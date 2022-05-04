
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
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
namespace Twns.WarEvent {
    import LangTextType         = Twns.Lang.LangTextType;
    import NotifyType           = Twns.Notify.NotifyType;
    import IWarEventFullData    = CommonProto.Map.IWarEventFullData;

    export type OpenDataForWeConditionReplacePanel = {
        gameConfig      : Config.GameConfig;
        fullData        : IWarEventFullData;
        parentNodeId    : number;
        conditionId     : number;
    };
    export class WeConditionReplacePanel extends TwnsUiPanel.UiPanel<OpenDataForWeConditionReplacePanel> {
        private readonly _listCondition!    : TwnsUiScrollList.UiScrollList<DataForConditionRenderer>;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelNoCondition! : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._listCondition.setItemRenderer(ConditionRenderer);
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

            this._updateListConditionAndLabelNoCondition();
        }

        private _updateComponentsForLanguage(): void {
            const openData              = this._getOpenData();
            this._labelTitle.text       = `${Lang.getText(LangTextType.B0500)} C${openData.conditionId}`;
            this._labelNoCondition.text = Lang.getText(LangTextType.B0278);
            this._btnClose.label        = Lang.getText(LangTextType.B0146);
        }
        private _updateListConditionAndLabelNoCondition(): void {
            const openData          = this._getOpenData();
            const parentNodeId      = openData.parentNodeId;
            const srcConditionId    = openData.conditionId;
            const fullData          = openData.fullData;
            const gameConfig        = openData.gameConfig;

            const dataArray: DataForConditionRenderer[] = [];
            for (const condition of openData.fullData.conditionArray || []) {
                dataArray.push({
                    gameConfig,
                    parentNodeId,
                    srcConditionId,
                    candidateConditionId : Twns.Helpers.getExisted(condition.WecCommonData?.conditionId),
                    fullData,
                });
            }

            this._labelNoCondition.visible = !dataArray.length;
            this._listCondition.bindData(dataArray);
        }
    }

    type DataForConditionRenderer = {
        gameConfig              : Config.GameConfig;
        parentNodeId            : number;
        srcConditionId          : number;
        candidateConditionId    : number;
        fullData                : IWarEventFullData;
    };
    class ConditionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForConditionRenderer> {
        private readonly _labelConditionId! : TwnsUiLabel.UiLabel;
        private readonly _labelCondition!   : TwnsUiLabel.UiLabel;
        private readonly _btnCopy!          : TwnsUiButton.UiButton;
        private readonly _btnSelect!        : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCopy,    callback: this._onTouchedBtnCopy },
                { ui: this._btnSelect,  callback: this._onTouchedBtnSelect },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._btnCopy.visible = false;
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateLabelConditionId();
            this._updateLabelCondition();
            this._updateBtnSelect();
        }

        private _onTouchedBtnCopy(): void {          // DONE
            const data = this._getData();
            if (WarHelpers.WarEventHelpers.cloneAndReplaceConditionInParentNode({
                fullData                : data.fullData,
                parentNodeId            : data.parentNodeId,
                conditionIdForDelete    : data.srcConditionId,
                conditionIdForClone     : data.candidateConditionId,
            }) != null) {
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.WeConditionReplacePanel);
            }
        }
        private _onTouchedBtnSelect(): void {        // DONE
            const data = this._getData();
            if (WarHelpers.WarEventHelpers.replaceConditionInParentNode({
                fullData        : data.fullData,
                parentNodeId    : data.parentNodeId,
                oldConditionId  : data.srcConditionId,
                newConditionId  : data.candidateConditionId,
            })) {
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.WeConditionReplacePanel);
            }
        }
        private _onNotifyLanguageChanged(): void {        // DONE
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnCopy.label     = Lang.getText(LangTextType.B0487);
            this._btnSelect.label   = Lang.getText(LangTextType.B0492);

            this._updateLabelConditionId();
            this._updateLabelCondition();
        }

        private _updateLabelConditionId(): void {
            const data                  = this._getData();
            const conditionId           = data.candidateConditionId;
            const nodeNameArray         = data.fullData.conditionNodeArray?.filter(node => node.conditionIdArray?.some(v => v === conditionId)).map(v => `N${v.nodeId}`);
            this._labelConditionId.text = `C${conditionId} (${Lang.getText(LangTextType.B0749)}: ${nodeNameArray?.length ? nodeNameArray.join(`, `) : Lang.getText(LangTextType.B0001)})`;
        }
        private _updateLabelCondition(): void {
            const data      = this._getData();
            const condition = (data.fullData.conditionArray || []).find(v => v.WecCommonData?.conditionId === data.candidateConditionId);
            const label     = this._labelCondition;
            if (condition == null) {
                label.text = Lang.getText(LangTextType.A0160);
            } else {
                label.text = WarHelpers.WarEventHelpers.getDescForCondition(condition, data.gameConfig) || CommonConstants.ErrorTextForUndefined;
            }
        }
        private _updateBtnSelect(): void {
            const data              = this._getData();
            this._btnSelect.visible = data.srcConditionId !== data.candidateConditionId;
        }
    }
}

// export default TwnsWeConditionReplacePanel;
