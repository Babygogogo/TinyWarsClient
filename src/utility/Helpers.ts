
namespace TinyWars.Utility.Helpers {
    import ColorType            = Types.ColorType;
    import MessageCodes         = Network.Codes;
    import IMessageContainer    = ProtoTypes.NetMessage.IMessageContainer;
    import IActionContainer     = ProtoTypes.WarAction.IActionContainer;

    const COLOR_MATRIX_FILTERS = {
        [ColorType.Gray]: new egret.ColorMatrixFilter([
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0.3, 0.6, 0, 0, 0,
            0, 0, 0, 1, 0
        ]),

        [ColorType.Dark]: new egret.ColorMatrixFilter([
            0.625,  0,      0,      0,  0,
            0,      0.625,  0,      0,  0,
            0,      0,      0.625,  0,  0,
            0,      0,      0,      1,  0
        ]),
    };

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
            && (str.length >= 4)
            && (str.length <= 20);
    }

    export function checkIsDiscordIdValid(str: string | null): boolean {
        return (typeof str == "string") && (str.length === 18);
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
            if ((color === ColorType.Gray) || (color === ColorType.Dark)) {
                obj.filters = [COLOR_MATRIX_FILTERS[color]];
            } else if (color === ColorType.Origin) {
                obj.filters = undefined;
            } else {
                obj.filters = [new egret.ColorMatrixFilter(getColorMatrix(color, value))];
            }
        }
    }

    export function getMessageCode(container: IMessageContainer): MessageCodes | undefined {
        const name = getMessageName(container);
        return name == null ? undefined : MessageCodes[name as any] as any;
    }
    export function getMessageName(container: IMessageContainer): string | undefined {
        for (const k in container) {
            return k;
        }
        return undefined;
    }

    export function getWarActionCode(container: IActionContainer): WarActionCodes | null {
        const name = getWarActionName(container);
        return name == null ? null : WarActionCodes[name];
    }
    export function getWarActionName(container: IActionContainer): string | null {
        for (const k in container) {
            if (k !== "actionId") {
                return k;
            }
        }
        return null;
    }

    export function cloneObject(obj: { [key: string]: any }): { [key: string]: any } {
        const o: { [key: string]: any } = {};
        for (const k in obj) {
            o[k] = obj[k];
        }
        return o;
    }
    export function deepClone<T>(src: T): T {
        if ((src == null) || (typeof src != "object")) {
            return src;
        } else {
            const dst: any = (src instanceof Array) ? [] : {};
            for (const i in src) {
                dst[i] = deepClone(src[i]);
            }
            return dst;
        }
    }

    export function checkIsEmptyObject(obj: { [key: string]: any }): boolean {
        for (const k in obj) {
            return false;
        }
        return true;
    }

    export function checkIsNumber(value: any): boolean {
        return value === +value;
    }

    export function getObjectKeysCount(obj: { [key: string]: any }): number {
        let count = 0;
        for (const k in obj) {
            ++count;
        }
        return count;
    }

    export function pickRandomElement<T>(list: T[]): T {
        if (!list) {
            return undefined;
        } else {
            return list[Math.floor(Math.random() * list.length)];
        }
    }

    /** 获取一个整数的位数。不计负数的符号；0-9计为1；10-99计为2；以此类推 */
    export function getDigitsCount(num: number): number {
        num = Math.abs(num);
        let count = 1;
        while (num >= 10) {
            ++count;
            num = Math.floor(num / 10);
        }

        return count;
    }

    export function getNumText(num: number, targetLength = 2): string {
        return repeatString("0", targetLength - getDigitsCount(num)) + num;
    }

    export function getNormalizedHp(hp: number): number {
        return Math.ceil(hp / Utility.ConfigManager.UNIT_HP_NORMALIZER);
    }

    export function getPointDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    export function getSquaredPointDistance(x1: number, y1: number, x2: number, y2: number): number {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }

    export function getColorTextForPlayerIndex(playerIndex: number): string {
        switch (playerIndex) {
            case 0  : return Lang.getText(Lang.Type.B0030);
            case 1  : return Lang.getText(Lang.Type.B0004);
            case 2  : return Lang.getText(Lang.Type.B0005);
            case 3  : return Lang.getText(Lang.Type.B0006);
            case 4  : return Lang.getText(Lang.Type.B0007);
            default : return undefined;
        }
    }

    export function getTeamText(teamIndex: number): string {
        switch (teamIndex) {
            case 1  : return Lang.getText(Lang.Type.B0008);
            case 2  : return Lang.getText(Lang.Type.B0009);
            case 3  : return Lang.getText(Lang.Type.B0010);
            case 4  : return Lang.getText(Lang.Type.B0011);
            default : return undefined;
        }
    }

    export function getTimeDurationText(totalSeconds: number): string {
        if (totalSeconds <= 0) {
            return `0${Lang.getText(Lang.Type.B0017)}`;
        } else {
            const seconds = totalSeconds % 60;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            const hours   = Math.floor(totalSeconds / (60 * 60)) % 24;
            const days    = Math.floor(totalSeconds / (60 * 60 * 24));

            let text: string = "";
            (days    > 0) && (text = `${text}${days}${Lang.getText(Lang.Type.B0014)}`);
            (hours   > 0) && (text = `${text}${hours}${Lang.getText(Lang.Type.B0015)}`);
            (minutes > 0) && (text = `${text}${minutes}${Lang.getText(Lang.Type.B0016)}`);
            (seconds > 0) && (text = `${text}${seconds}${Lang.getText(Lang.Type.B0017)}`);
            return text;
        }
    }
    export function getTimeDurationText2(totalSeconds: number): string {
        if (totalSeconds <= 0) {
            return `00:00:00`;
        } else {
            const seconds = totalSeconds % 60;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            const hours   = Math.floor(totalSeconds / (60 * 60));
            return `${getNumText(hours)}:${getNumText(minutes)}:${getNumText(seconds)}`;
        }
    }

    type TimeTextController = {
        year?   : boolean;
        month?  : boolean;
        date?   : boolean;
        hour?   : boolean;
        minute? : boolean;
        second? : boolean;
    }
    /**
     * 返回指定时间戳对应的时间，格式： x年x月x日xx:xx:xx
     * @param controller 用于控制特定子串要不要显示，默认为全显示
     */
    export function getTimestampText(timestamp: number, controller?: TimeTextController): string {
        const d = new Date(timestamp * 1000);
        const needHour   = (!controller) || (controller.hour !== false);
        const needMinute = (!controller) || (controller.minute !== false);
        const needSecond = (!controller) || (controller.second !== false);
        const strYear    = (!controller) || (controller.year !== false)  ? `${getNumText(d.getFullYear(), 4)}${Lang.getText(Lang.Type.B0059)}`     : ``;
        const strMonth   = (!controller) || (controller.month !== false) ? `${getNumText(d.getMonth() + 1)}${Lang.getText(Lang.Type.B0058)}`    : ``;
        const strDate    = (!controller) || (controller.date !== false)  ? `${getNumText(d.getDate())}${Lang.getText(Lang.Type.B0057)}`         : ``;
        const strHour    = needHour                 ? `${getNumText(d.getHours())}`   : "";
        const sep1       = needHour   && needMinute ? ":" : "";
        const strMinute  = needMinute               ? `${getNumText(d.getMinutes())}` : "";
        const sep2       = needMinute && needSecond ? ":" : "";
        const strSecond  = needSecond               ? `${getNumText(d.getSeconds())}` : "";
        return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
    }
    export function getTimestampShortText(timestamp: number, controller?: TimeTextController): string {
        const d = new Date(timestamp * 1000);
        const needHour   = (!controller) || (controller.hour !== false);
        const needMinute = (!controller) || (controller.minute !== false);
        const needSecond = (!controller) || (controller.second !== false);
        const strYear    = (!controller) || (controller.year !== false)  ? `${getNumText(d.getFullYear(), 4)}/`     : ``;
        const strMonth   = (!controller) || (controller.month !== false) ? `${getNumText(d.getMonth() + 1)}/`    : ``;
        const strDate    = (!controller) || (controller.date !== false)  ? `${getNumText(d.getDate())} `         : ``;
        const strHour    = needHour                 ? `${getNumText(d.getHours())}`   : "";
        const sep1       = needHour   && needMinute ? ":" : "";
        const strMinute  = needMinute               ? `${getNumText(d.getMinutes())}` : "";
        const sep2       = needMinute && needSecond ? ":" : "";
        const strSecond  = needSecond               ? `${getNumText(d.getSeconds())}` : "";
        return strYear + strMonth + strDate + strHour + sep1 + strMinute + sep2 + strSecond;
    }

    export function createEmptyMap<T>(mapWidth: number, mapHeight?: number, defaultValue?: T): T[][] {
        const map = new Array<T[]>(mapWidth);
        for (let i = 0; i < mapWidth; ++i) {
            if (!mapHeight) {
                map[i] = [];
            } else {
                map[i] = new Array(mapHeight);
                (defaultValue != null) && (map[i].fill(defaultValue));
            }
        }
        return map;
    }

    let _frameBeginTime = 0;
    export function checkAndCallLater(): Promise<void> {  // DONE
        if (Date.now() - _frameBeginTime <= 13) {
            return;
        } else {
            return new Promise<void>((resolve, reject) => {
                egret.callLater(() => {
                    _frameBeginTime = Date.now();
                    resolve();
                }, null);
            });
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

            default:
                return undefined;
        }
    }
}
