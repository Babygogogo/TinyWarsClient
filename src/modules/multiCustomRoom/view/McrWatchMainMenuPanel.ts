
import { UiImage }                          from "../../../gameui/UiImage";
import { UiListItemRenderer }               from "../../../gameui/UiListItemRenderer";
import { UiPanel }                          from "../../../gameui/UiPanel";
import { UiButton }                         from "../../../gameui/UiButton";
import { UiLabel }                          from "../../../gameui/UiLabel";
import { UiScrollList }                     from "../../../gameui/UiScrollList";
import * as Lang                            from "../../../utility/Lang";
import * as Notify                          from "../../../utility/Notify";
import * as Types                           from "../../../utility/Types";
import * as MpwModel                        from "../../multiPlayerWar/model/MpwModel";
import { LobbyBottomPanel }                 from "../../lobby/view/LobbyBottomPanel";
import { LobbyTopPanel }                    from "../../lobby/view/LobbyTopPanel";
import { McrWatchOngoingWarsPanel }         from "./McrWatchOngoingWarsPanel";
import { McrMainMenuPanel }                 from "./McrMainMenuPanel";
import { McrWatchMakeRequestWarsPanel }     from "./McrWatchMakeRequestWarsPanel";
import { McrWatchDeleteWatcherWarsPanel }   from "./McrWatchDeleteWatcherWarsPanel";
import { McrWatchHandleRequestWarsPanel }   from "./McrWatchHandleRequestWarsPanel";

export class McrWatchMainMenuPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: McrWatchMainMenuPanel;

    private _labelMenuTitle : UiLabel;
    private _btnBack        : UiButton;
    private _listCommand    : UiScrollList<DataForCommandRenderer>;

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
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
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
        LobbyTopPanel.show();
        LobbyBottomPanel.show();
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
        this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0206);
        this._btnBack.label         = Lang.getText(Lang.Type.B0146);
        this._listCommand.bindData(this._createDataForListCommand());
    }

    private _createDataForListCommand(): DataForCommandRenderer[] {
        return [
            {
                name    : Lang.getText(Lang.Type.B0207),
                callback: (): void => {
                    this.close();
                    McrWatchMakeRequestWarsPanel.show();
                },
            },
            {
                name    : Lang.getText(Lang.Type.B0208),
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
                name    : Lang.getText(Lang.Type.B0219),
                callback: (): void => {
                    this.close();
                    McrWatchDeleteWatcherWarsPanel.show();
                },
            },
            {
                name    : Lang.getText(Lang.Type.B0222),
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
class CommandRenderer extends UiListItemRenderer<DataForCommandRenderer> {
    private _labelCommand   : UiLabel;
    private _imgRed         : UiImage;

    protected _onDataChanged(): void {
        const data              = this.data;
        this._labelCommand.text = data.name;
        this._imgRed.visible    = (!!data.redChecker) && (data.redChecker());
    }

    public onItemTapEvent(e: eui.ItemTapEvent): void {
        this.data.callback();
    }
}
