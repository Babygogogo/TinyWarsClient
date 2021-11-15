
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsPanelConfig {
    import LayerType    = Types.LayerType;

    export type PanelConfig<T> = {
        cls             : new () => TwnsUiPanel2.UiPanel2<T>;
        name            : string;
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
                name        : ``,
                layer       : LayerType.Hud0,
                needCache   : true,
            } as PanelConfig<TwnsChatPanel.OpenData>,
        };

        for (const name in PanelConfigDict) {
            (PanelConfigDict as any)[name].name = name;
        }
    }
}
