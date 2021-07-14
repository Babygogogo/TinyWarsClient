
import TwnsUiImage                          from "../../tools/ui/UiImage";
import TwnsUiListItemRenderer               from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                          from "../../tools/ui/UiPanel";
import TwnsUiButton                          from "../../tools/ui/UiButton";
import TwnsUiLabel                          from "../../tools/ui/UiLabel";
import TwnsUiScrollList                     from "../../tools/ui/UiScrollList";
import Lang                             from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                           from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import Types                            from "../../tools/helpers/Types";
import MpwModel                         from "../../multiPlayerWar/model/MpwModel";
import TwnsLobbyBottomPanel                 from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel                    from "../../lobby/view/LobbyTopPanel";
import { McrWatchOngoingWarsPanel }         from "./McrWatchOngoingWarsPanel";
import { McrMainMenuPanel }                 from "./McrMainMenuPanel";
import { McrWatchMakeRequestWarsPanel }     from "./McrWatchMakeRequestWarsPanel";
import { McrWatchDeleteWatcherWarsPanel }   from "./McrWatchDeleteWatcherWarsPanel";
import { McrWatchHandleRequestWarsPanel }   from "./McrWatchHandleRequestWarsPanel";

export class McrWatchMainMenuPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McrWatchMainMenuPanel;

    private _labelMenuTitle : TwnsUiLabel.UiLabel;
    private _btnBack        : TwnsUiButton.UiButton;
    private _listCommand    : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;

    public static show(): void {
        if (!McrWatchMainMenuPanel._instance) {
            McrWatchMainMenuPanel._instance = new McrWatchMainMenuPanel();
        }
        McrWatchMainMenuPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (McrWatchMainMenuPanel._instance) {
            await McrWatchMainMenuPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrWatchMainMenuPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnBack, callback: this._onTouchedBtnBack },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserLogout,      callback: this._onMsgUserLogout },
        ]);
        this._listCommand.setItemRenderer(CommandRenderer);

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(e: egret.TouchEvent): void {
        this.close();
        McrMainMenuPanel.show();
        TwnsLobbyTopPanel.LobbyTopPanel.show();
        TwnsLobbyBottomPanel.LobbyBottomPanel.show();
    }

    private _onMsgUserLogout(e: egret.Event): void {
        this.close();
    }
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._labelMenuTitle.text   = Lang.getText(LangTextType.B0206);
        this._btnBack.label         = Lang.getText(LangTextType.B0146);
        this._listCommand.bindData(this._createDataForListCommand());
    }

    private _createDataForListCommand(): DataForCommandRenderer[] {
        return [
            {
                name    : Lang.getText(LangTextType.B0207),
                callback: (): void => {
                    this.close();
                    McrWatchMakeRequestWarsPanel.show();
                },
            },
            {
                name    : Lang.getText(LangTextType.B0208),
                callback: (): void => {
                    this.close();
                    McrWatchHandleRequestWarsPanel.show();
                },
                redChecker  : () => {
                    const watchInfos = MpwModel.getWatchRequestedWarInfos();
                    return (!!watchInfos) && (watchInfos.length > 0);
                },
            },
            {
                name    : Lang.getText(LangTextType.B0219),
                callback: (): void => {
                    this.close();
                    McrWatchDeleteWatcherWarsPanel.show();
                },
            },
            {
                name    : Lang.getText(LangTextType.B0222),
                callback: (): void => {
                    this.close();
                    McrWatchOngoingWarsPanel.show();
                },
            },
        ];
    }
}

type DataForCommandRenderer = {
    name        : string;
    callback    : () => void;
    redChecker? : () => boolean;
};
class CommandRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
    private _labelCommand   : TwnsUiLabel.UiLabel;
    private _imgRed         : TwnsUiImage.UiImage;

    protected _onDataChanged(): void {
        const data              = this.data;
        this._labelCommand.text = data.name;
        this._imgRed.visible    = (!!data.redChecker) && (data.redChecker());
    }

    public onItemTapEvent(e: eui.ItemTapEvent): void {
        this.data.callback();
    }
}
