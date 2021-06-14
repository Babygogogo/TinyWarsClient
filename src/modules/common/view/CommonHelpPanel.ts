
namespace TinyWars.Common {
    import Helpers = Utility.Helpers;

    type OpenDataForCommonHelpPanel = {
        title  : string;
        content: string;
    }

    export class CommonHelpPanel extends GameUi.UiPanel<OpenDataForCommonHelpPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonHelpPanel;

        private readonly _imgMask       : GameUi.UiImage;
        private readonly _group         : eui.Group;
        private readonly _labelTitle    : GameUi.UiLabel;
        private readonly _scrContent    : eui.Scroller;
        private readonly _labelContent  : GameUi.UiLabel;

        public static show(openData: OpenDataForCommonHelpPanel): void {
            if (!CommonHelpPanel._instance) {
                CommonHelpPanel._instance = new CommonHelpPanel();
            }
            CommonHelpPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonHelpPanel._instance) {
                await CommonHelpPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/common/CommonHelpPanel.exml";
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }

        protected _onOpened(): void {
            const openData                      = this._getOpenData();
            this._labelTitle.text               = openData.title;
            this._scrContent.viewport.scrollV   = 0;
            this._labelContent.setRichText(openData.content);

            this._showOpenAnimation();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: -40 },
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
                    endProps    : { alpha: 0, verticalCenter: -40 },
                    callback    : resolve,
                });
            });
        }
    }
}
