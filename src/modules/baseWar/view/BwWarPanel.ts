
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsBwWar            from "../model/BwWar";
// import Types                from "../../tools/helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwWarPanel {
    export type OpenData = {
        war: TwnsBwWar.BwWar;
    };
    export class BwWarPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _group!    : eui.Group;

        protected _onOpening(): void {
            // nothing to do
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._group.addChild(this._getOpenData().war.getView());
        }
        protected _onClosing(): void {
            this._group.removeChildren();
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                tweenTime   : 2000,
            });

            await Helpers.wait(2000);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsBwWarPanel;
