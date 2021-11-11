

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
namespace TwnsWeDialogueBackgroundPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;

    type OpenDataForWeDialogueBackgroundPanel = {
        action  : ProtoTypes.WarEvent.IWeaDialogue;
    };
    export class WeDialogueBackgroundPanel extends TwnsUiPanel.UiPanel<OpenDataForWeDialogueBackgroundPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeDialogueBackgroundPanel;

        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _listBackground!   : TwnsUiScrollList.UiScrollList<DataForBackgroundRenderer>;

        public static show(openData: OpenDataForWeDialogueBackgroundPanel): void {
            if (!WeDialogueBackgroundPanel._instance) {
                WeDialogueBackgroundPanel._instance = new WeDialogueBackgroundPanel();
            }
            WeDialogueBackgroundPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WeDialogueBackgroundPanel._instance) {
                await WeDialogueBackgroundPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = WeDialogueBackgroundPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/warEvent/WeDialogueBackgroundPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._listBackground.setItemRenderer(BackgroundRenderer);

            this._showOpenAnimation();

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
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
            const maxId     = ConfigManager.getSystemDialogueBackgroundMaxId(Helpers.getExisted(ConfigManager.getLatestConfigVersion()));
            const dataArray : DataForBackgroundRenderer[] = [];
            const action    = this._getOpenData().action;
            for (let backgroundId = 0; backgroundId <= maxId; ++backgroundId) {
                dataArray.push({
                    backgroundId,
                    action,
                    panel       : this,
                });
            }

            return dataArray;
        }

        private _showOpenAnimation(): void {
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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });

                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }

    type DataForBackgroundRenderer = {
        backgroundId            : number;
        action                  : ProtoTypes.WarEvent.IWeaDialogue;
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
            const data  = this._getData();
            const panel = data.panel;
            if (!panel.getIsOpening()) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
                return;
            }

            data.action.backgroundId = data.backgroundId;
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonConfirm01);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
            panel.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._imgTarget.source = ConfigManager.getDialogueBackgroundImage(this._getData().backgroundId);
        }
    }
}

// export default TwnsWeDialogueBackgroundPanel;
