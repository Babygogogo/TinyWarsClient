
namespace GameUi {
    export const enum Layers {
        Top,
        Notify,
        Hud,
        Scene,
        Bottom,
    }

    export namespace LayerManager {
        const layers: { [layer: number]: egret.DisplayObjectContainer } = {};

        export function init(): void {
            _addLayer(Layers.Bottom);
            _addLayer(Layers.Scene);
            _addLayer(Layers.Hud);
            _addLayer(Layers.Notify);
            _addLayer(Layers.Top);
        }

        export function getLayer(layer: Layers): egret.DisplayObjectContainer {
            return layers[layer];
        }

        export function resize(): void {
            const height = StageManager.getStage().stageHeight;
            for (const k in layers) {
                const layer = layers[k];
                for (let i = 0; i < layer.numChildren; ++i) {
                    layer.getChildAt(i).height = height;
                }
            }
        }

        function _addLayer(layer: Layers): void {
            egret.assert(!layers[layer], "LayerManager.addLayer() duplicated layer: " + layer);
            layers[layer] = new egret.DisplayObjectContainer();
            StageManager.getStage().addChild(layers[layer]);
        }
    }
}
