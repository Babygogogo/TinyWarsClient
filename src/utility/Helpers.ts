
namespace Utility {
    export namespace Helpers {
        export function checkIsWebGl(): boolean {
            return egret.Capabilities.renderMode === "webgl";
        }

        export function changeColor(obj: egret.DisplayObject, color: Types.ColorType, value = 100): void {
            if (checkIsWebGl()) {
                obj.filters = [new egret.ColorMatrixFilter(getColorMatrix(color, value))];
            }
        }

        function getColorMatrix(color: Types.ColorType, value = 100): number[] {
            switch (color) {
                case Types.ColorType.Blue:
                    return [
                        1, 0, 0, 0, 0,
                        0, 1, 0, 0, 0,
                        0, 0, 1, 0, value,
                        0, 0, 0, 1, 0
                    ];

                case Types.ColorType.Gray:
                    return [
                        0.3, 0.6, 0, 0, 0,
                        0.3, 0.6, 0, 0, 0,
                        0.3, 0.6, 0, 0, 0,
                        0, 0, 0, 1, 0
                    ];

                case Types.ColorType.Green:
                    return [
                        1, 0, 0, 0, 0,
                        0, 1, 0, 0, value,
                        0, 0, 1, 0, 0,
                        0, 0, 0, 1, 0
                    ];

                case Types.ColorType.Red:
                    return [
                        1, 0, 0, 0, value,
                        0, 1, 0, 0, 0,
                        0, 0, 1, 0, 0,
                        0, 0, 0, 1, 0
                    ];

                case Types.ColorType.White:
                    return [
                        1, 0, 0, 0, value,
                        0, 1, 0, 0, value,
                        0, 0, 1, 0, value,
                        0, 0, 0, 1, 0
                    ];

                case Types.ColorType.Origin:
                default:
                    return [
                        1, 0, 0, 0, 0,
                        0, 1, 0, 0, 0,
                        0, 0, 1, 0, 0,
                        0, 0, 0, 1, 0
                    ];
            }
        }
    }
}
