
import { UiPanel }              from "../../../gameui/UiPanel";
import { Types }                from "../../../utility/Types";

export class LobbyBackgroundPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Bottom;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: LobbyBackgroundPanel;

    public static show(): void {
        if (!LobbyBackgroundPanel._instance) {
            LobbyBackgroundPanel._instance = new LobbyBackgroundPanel();
        }
        LobbyBackgroundPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (LobbyBackgroundPanel._instance) {
            await LobbyBackgroundPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/lobby/LobbyBackgroundPanel.exml";
    }
}
