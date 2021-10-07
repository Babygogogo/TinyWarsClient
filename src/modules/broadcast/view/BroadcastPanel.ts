
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import StageManager         from "../../tools/helpers/StageManager";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import BroadcastModel       from "../model/BroadcastModel";

namespace TwnsBroadcastPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;

    const _FLOW_SPEED = 80;

    export class BroadcastPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance        : BroadcastPanel | null = null;

        private readonly _groupLamp!    : eui.Group;
        private readonly _labelLamp!    : TwnsUiLabel.UiLabel;

        private _ongoingMessageIdSet    = new Set<number>();

        public static show(): void {
            if (!BroadcastPanel._instance) {
                BroadcastPanel._instance = new BroadcastPanel();
            }
            BroadcastPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (BroadcastPanel._instance) {
                await BroadcastPanel._instance.close();
            }
        }
        public static getInstance(): BroadcastPanel | null {
            return BroadcastPanel._instance;
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

        private _onNotifyTimeTick(): void {
            const messageList   = BroadcastModel.getOngoingMessageList();
            const ongoingSet    = this._ongoingMessageIdSet;
            if ((messageList.length !== ongoingSet.size)                                ||
                (messageList.some(v => !ongoingSet.has(Helpers.getExisted(v.messageId))))
            ) {
                this._resetComponentsForLamp(messageList);
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._resetView();
        }

        private _onMsgBroadcastGetMessageList(): void {
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
                ongoingSet.add(Helpers.getExisted(message.messageId));
                textList.push(Lang.getLanguageText({ textArray: message.textList }) ?? CommonConstants.ErrorTextForUndefined);
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

export default TwnsBroadcastPanel;
