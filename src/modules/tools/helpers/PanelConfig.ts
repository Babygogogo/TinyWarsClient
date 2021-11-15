
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsPanelConfig {
    import LayerType    = Types.LayerType;

    export type PanelConfig<T> = {
        cls             : new () => TwnsUiPanel2.UiPanel2<T>;
        skinName        : string;
        layer           : LayerType;
        isExclusive?    : boolean;
        needCache?      : boolean;
    };

    export let PanelConfigDict: {
        ChatPanel: PanelConfig<TwnsChatPanel.OpenData>;
    };

    export function init(): void {
        PanelConfigDict = {
            ChatPanel  : {
                cls         : TwnsChatPanel?.ChatPanel,
                skinName    : `resource/skins/chat/ChatPanel.exml`,
                layer       : LayerType.Hud0,
                needCache   : true,
            } as PanelConfig<TwnsChatPanel.OpenData>,
        };
    }
}
