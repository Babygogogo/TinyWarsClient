
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import StageManager         from "../../tools/helpers/StageManager";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import BroadcastModel       from "../model/BroadcastModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Broadcast {
    import NotifyType       = Twns.Notify.NotifyType;

    const _FLOW_SPEED = 80;

    export type OpenDataForBroadcastPanel = void;
    export class BroadcastPanel extends TwnsUiPanel.UiPanel<OpenDataForBroadcastPanel> {
        private readonly _groupLamp!    : eui.Group;
        private readonly _labelLamp!    : TwnsUiLabel.UiLabel;

        private _ongoingMessageIdSet    = new Set<number>();

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TimeTick,                            callback: this._onNotifyTimeTick },
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgBroadcastGetAllMessageIdArray,    callback: this._onMsgBroadcastGetAllMessageIdArray },
            ]);

            this.touchEnabled   = false;
            this.touchChildren  = false;

            this._resetView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private async _onNotifyTimeTick(): Promise<void> {
            const messageIdArray    = await Twns.Broadcast.BroadcastModel.getOngoingMessageIdArray();
            const ongoingSet        = this._ongoingMessageIdSet;
            if ((messageIdArray.length !== ongoingSet.size)     ||
                (messageIdArray.some(v => !ongoingSet.has(v)))
            ) {
                this._resetComponentsForLamp(messageIdArray);
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._resetView();
        }

        private _onMsgBroadcastGetAllMessageIdArray(): void {
            this._resetView();
        }

        private async _resetView(): Promise<void> {
            this._resetComponentsForLamp(await Twns.Broadcast.BroadcastModel.getOngoingMessageIdArray());
        }

        private async _resetComponentsForLamp(messageIdArray: number[]): Promise<void> {
            const ongoingSet = this._ongoingMessageIdSet;
            ongoingSet.clear();

            const textList: string[] = [];
            for (const messageId of messageIdArray) {
                ongoingSet.add(messageId);
                textList.push(Lang.getLanguageText({ textArray: (await Twns.Broadcast.BroadcastModel.getMessageData(messageId))?.textList }) ?? CommonConstants.ErrorTextForUndefined);
            }

            const group = this._groupLamp;
            const label = this._labelLamp;
            egret.Tween.removeTweens(label);

            if (!textList.length) {
                group.visible = false;
            } else {
                group.visible = true;

                label.setRichText(textList.join("    "));
                const stageWidth    = StageManager.getStage().stageWidth;
                const textWidth     = label.width;
                egret.Tween.get(label, { loop: true })
                    .set({ x: stageWidth })
                    .to({ x: -textWidth }, (stageWidth + textWidth) / _FLOW_SPEED * 1000);
            }
        }
    }
}

// export default TwnsBroadcastPanel;
