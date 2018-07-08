
namespace Utility {
    export namespace Helpers {
        export function checkIsWebGl(): boolean {
            return egret.Capabilities.renderMode === "webgl";
        }

        export function checkIsAccountValid(str: string | undefined | null): boolean {
            return (typeof str === "string")
                && (str.length >= 6)
                && (str.length <= 20)
                && (str.search(/\W/) < 0);
        }

        export function checkIsPasswordValid(str: string | undefined | null): boolean {
            return (typeof str === "string")
                && (str.length >= 6)
                && (str.length <= 20)
                && (str.search(/\W/) < 0);
        }

        export function checkIsNicknameValid(str: string | undefined | null): boolean {
            return (typeof str === "string")
                && (str.length >= 6)
                && (str.length <= 20)
                && (str.search(/\W/) < 0);
        }

        export function formatString(...args: (number | string)[]): string {
            let i = 0, a, f = args[i++] as string, o = [], m, p, c, x, s = '';
            while (f) {
                if (m = /^[^\x25]+/.exec(f)) {
                    o.push(m[0]);
                } else if (m = /^\x25{2}/.exec(f)) {
                    o.push('%');
                } else if (m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f)) {
                    if (((a = args[m[1] || i++]) == null) || (a == undefined)) {
                        throw ('Too few arguments.');
                    }
                    if (/[^s]/.test(m[7])) {
                        let aa = Number(a);
                        if (isNaN(aa)) {
                            throw ('Expecting number but found ' + typeof (a));
                        } else {
                            a = aa
                        }
                    }
                    switch (m[7]) {
                        case 'b': a = a.toString(2); break;
                        case 'c': a = String.fromCharCode(a); break;
                        case 'i': a = parseInt(a); break;
                        case 'd': a = parseInt(a); break;
                        case 'e': a = m[6] ? a.toExponential(m[6]) : a.toExponential(); break;
                        case 'f': a = m[6] ? parseFloat(a).toFixed(m[6]) : parseFloat(a); break;
                        case 'o': a = a.toString(8); break;
                        case 's': a = ((a = String(a)) && m[6] ? a.substring(0, m[6]) : a); break;
                        case 'u': a = Math.abs(a); break;
                        case 'x': a = a.toString(16); break;
                        case 'X': a = a.toString(16).toUpperCase(); break;
                    }
                    a = (/[def]/.test(m[7]) && m[2] && a >= 0 ? '+' + a : a);
                    c = m[3] ? m[3] == '0' ? '0' : m[3].charAt(1) : ' ';
                    x = m[5] - String(a).length - s.length;
                    p = m[5] ? repeatString(c, x) : '';
                    o.push(s + (m[4] ? a + p : p + a));
                } else {
                    throw ('Huh ?!');
                }
                f = f.substring(m[0].length);
            }
            return o.join('');
        }

        export function repeatString(str: string, times: number): string {
            return (new Array(times + 1)).join(str);
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
