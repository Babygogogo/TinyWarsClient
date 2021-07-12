
import { UiListItemRenderer }       from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                  from "../../../utility/ui/UiPanel";
import { UiButton }                 from "../../../utility/ui/UiButton";
import { UiLabel }                  from "../../../utility/ui/UiLabel";
import { UiScrollList }             from "../../../utility/ui/UiScrollList";
import { MmReviewListPanel }        from "./MmReviewListPanel";
import { MmAvailabilityListPanel }  from "./MmAvailabilityListPanel";
import { MmTagListPanel }           from "./MmTagListPanel";
import { FloatText }                from "../../../utility/FloatText";
import { FlowManager }              from "../../../utility/FlowManager";
import { Lang }                     from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                   from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { Types }                    from "../../../utility/Types";

export class MmMainMenuPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MmMainMenuPanel;

    private _labelMenuTitle : UiLabel;
    private _btnBack        : UiButton;
    private _listCommand    : UiScrollList<DataForCommandRenderer>;

    public static show(): void {
        if (!MmMainMenuPanel._instance) {
            MmMainMenuPanel._instance = new MmMainMenuPanel();
        }
        MmMainMenuPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (MmMainMenuPanel._instance) {
            await MmMainMenuPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/mapManagement/MmMainMenuPanel.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setUiListenerArray([
            { ui: this._btnBack, callback: this._onTouchedBtnBack },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
            { type: NotifyType.MsgMmReloadAllMaps, callback: this._onMsgMmReloadAllMaps },
        ]);
        this._listCommand.setItemRenderer(CommandRenderer);

        this._updateView();
        this._listCommand.bindData(await this._createDataForListCommand());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(e: egret.TouchEvent): void {
        this.close();
        FlowManager.gotoLobby();
    }
    private _onMsgUserLogout(e: egret.Event): void {
        this.close();
    }
    private _onMsgMmReloadAllMaps(e: egret.Event): void {
        FloatText.show(Lang.getText(LangTextType.A0075));
    }
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._labelMenuTitle.text   = Lang.getText(LangTextType.B0192);
        this._btnBack.label         = Lang.getText(LangTextType.B0146);
        this._listCommand.bindData(await this._createDataForListCommand());
    }

    private async _createDataForListCommand(): Promise<DataForCommandRenderer[]> {
        const dataList: DataForCommandRenderer[] = [
            {
                name    : Lang.getText(LangTextType.B0295),
                callback: (): void => {
                    this.close();
                    MmReviewListPanel.show();
                },
            },
            {
                name    : Lang.getText(LangTextType.B0193),
                callback: (): void => {
                    this.close();
                    MmAvailabilityListPanel.show({});
                },
            },
            {
                name    : Lang.getText(LangTextType.B0444),
                callback: (): void => {
                    this.close();
                    MmTagListPanel.show();
                },
            },
        ];

        return dataList;
    }
}

type DataForCommandRenderer = {
    name    : string;
    callback: () => void;
};
class CommandRenderer extends UiListItemRenderer<DataForCommandRenderer> {
    private _labelCommand: UiLabel;

    protected _onDataChanged(): void {
        const data = this.data;
        this._labelCommand.text = data.name;
    }

    public onItemTapEvent(e: eui.ItemTapEvent): void {
        this.data.callback();
    }
}
