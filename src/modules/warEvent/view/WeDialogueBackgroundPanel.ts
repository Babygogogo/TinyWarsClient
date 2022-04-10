

// import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsBwActionPlanner      from "../model/BwActionPlanner";
// import TwnsBwUnit               from "../model/BwUnit";
// import TwnsBwWar                from "../model/BwWar";
// import TwnsBwUnitDetailPanel    from "./BwUnitDetailPanel";
// import TwnsBwUnitView           from "./BwUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType   = TwnsNotifyType.NotifyType;
    import GameConfig   = Config.GameConfig;

    export type OpenDataForWeDialogueBackgroundPanel = {
        gameConfig  : GameConfig;
        action      : CommonProto.WarEvent.IWeaDialogue;
    };
    export class WeDialogueBackgroundPanel extends TwnsUiPanel.UiPanel<OpenDataForWeDialogueBackgroundPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _listBackground!   : TwnsUiScrollList.UiScrollList<DataForBackgroundRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listBackground.setItemRenderer(BackgroundRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyBwPlannerStateChanged(): void {
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const backgroundId  = this._getOpenData().action.backgroundId;
            const list          = this._listBackground;
            const dataArray     = this._createDataForList();
            list.bindData(dataArray);
            list.setSelectedIndex(Math.max(0, dataArray.findIndex(v => v.backgroundId === backgroundId)));
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
        }

        private _createDataForList(): DataForBackgroundRenderer[] {
            const openData  = this._getOpenData();
            const maxId     = openData.gameConfig.getSystemCfg().dialogueBackgroundMaxId;
            const dataArray : DataForBackgroundRenderer[] = [];
            const action    = openData.action;
            for (let backgroundId = 0; backgroundId <= maxId; ++backgroundId) {
                dataArray.push({
                    backgroundId,
                    action,
                    panel       : this,
                });
            }

            return dataArray;
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

    type DataForBackgroundRenderer = {
        backgroundId            : number;
        action                  : CommonProto.WarEvent.IWeaDialogue;
        panel                   : WeDialogueBackgroundPanel;
    };
    class BackgroundRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForBackgroundRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _imgBg!        : TwnsUiImage.UiImage;
        private readonly _imgTarget!    : TwnsUiImage.UiImage;
        private readonly _groupSelect!  : eui.Group;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._imgBg,                      callback: this._onTouchedImgBg,         eventType: egret.TouchEvent.TOUCH_BEGIN },
                { ui: this._groupSelect,                callback: this._onTouchedGroupSelect },
            ]);

            this._imgBg.touchEnabled = true;
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        private _onTouchedGroupSelect(): void {
            const data                  = this._getData();
            const panel                 = data.panel;
            data.action.backgroundId    = data.backgroundId;
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonConfirm01);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
            panel.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._imgTarget.source = Twns.Config.ConfigManager.getDialogueBackgroundImage(this._getData().backgroundId);
        }
    }
}

// export default TwnsWeDialogueBackgroundPanel;
