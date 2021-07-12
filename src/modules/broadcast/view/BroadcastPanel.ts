
import { TwnsUiPanel }              from "../../../utility/ui/UiPanel";
import { TwnsUiLabel }              from "../../../utility/ui/UiLabel";
import { Types }                from "../../../utility/Types";
import { TwnsNotifyType }       from "../../../utility/notify/NotifyType";
import { BroadcastModel }       from "../model/BroadcastModel";
import { Lang }                 from "../../../utility/lang/Lang";
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { StageManager }         from "../../../utility/StageManager";

export namespace TwnsBroadcastPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;

    const _FLOW_SPEED = 80;

    export class BroadcastPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BroadcastPanel;

        private _groupLamp              : eui.Group;
        private _labelLamp              : TwnsUiLabel.UiLabel;

        private _ongoingMessageIdSet    = new Set<number>();

        public static show(): void {
            if (!BroadcastPanel._instance) {
                BroadcastPanel._instance = new BroadcastPanel();
            }
            BroadcastPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (BroadcastPanel._instance) {
                await BroadcastPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/broadcast/BroadcastPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TimeTick,                   callback: this._onNotifyTimeTick },
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgBroadcastGetMessageList, callback: this._onMsgBroadcastGetMessageList },
            ]);

            this.touchEnabled   = false;
            this.touchChildren  = false;

            this._resetView();
        }

        private _onNotifyTimeTick(e: egret.Event): void {
            const messageList   = BroadcastModel.getOngoingMessageList();
            const ongoingSet    = this._ongoingMessageIdSet;
            if ((messageList.length !== ongoingSet.size)            ||
                (messageList.some(v => !ongoingSet.has(v.messageId)))
            ) {
                this._resetComponentsForLamp(messageList);
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._resetView();
        }

        private _onMsgBroadcastGetMessageList(e: egret.Event): void {
            this._resetView();
        }

        private _resetView(): void {
            this._resetComponentsForLamp(BroadcastModel.getOngoingMessageList());
        }

        private _resetComponentsForLamp(messageList: ProtoTypes.Broadcast.IBroadcastMessage[]): void {
            const ongoingSet = this._ongoingMessageIdSet;
            ongoingSet.clear();

            const textList: string[] = [];
            for (const message of messageList) {
                ongoingSet.add(message.messageId);
                textList.push(Lang.getLanguageText({ textArray: message.textList }));
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
