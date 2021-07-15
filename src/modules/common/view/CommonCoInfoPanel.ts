
import Helpers          from "../../tools/helpers/Helpers";
import Types            from "../../tools/helpers/Types";
import TwnsNotifyType   from "../../tools/notify/NotifyType";
import TwnsUiCoInfo     from "../../tools/ui/UiCoInfo";
import TwnsUiImage      from "../../tools/ui/UiImage";
import TwnsUiPanel      from "../../tools/ui/UiPanel";

namespace TwnsCommonCoInfoPanel {
    import NotifyType   = TwnsNotifyType.NotifyType;

    type OpenDataForCommonCoInfoPanel = {
        configVersion   : string;
        coId            : number;
    };
    export class CommonCoInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonCoInfoPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonCoInfoPanel;

        private readonly _imgMask       : TwnsUiImage.UiImage;
        private readonly _group         : eui.Group;
        private readonly _uiCoInfo      : TwnsUiCoInfo.UiCoInfo;

        public static show(openData: OpenDataForCommonCoInfoPanel): void {
            if (!CommonCoInfoPanel._instance) {
                CommonCoInfoPanel._instance = new CommonCoInfoPanel();
            }
            CommonCoInfoPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonCoInfoPanel._instance) {
                await CommonCoInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/common/CommonCoInfoPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();

            const openData = this._getOpenData();
            this._uiCoInfo.setCoData({
                configVersion   : openData.configVersion,
                coId            : openData.coId,
            });
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do
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
}

export default TwnsCommonCoInfoPanel;
