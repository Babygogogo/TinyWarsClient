
namespace TinyWars.Utility.Helpers {
    import ColorType            = Types.ColorType;
    import MessageCodes         = Network.Codes;
    import ILanguageText        = ProtoTypes.Structure.ILanguageText;
    import IMessageContainer    = ProtoTypes.NetMessage.IMessageContainer;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;

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

    export function getSuffixForRank(rank: number): string {
        if (rank == null) {
            return undefined;
        } else {
            if (Math.floor(rank / 10) % 10 === 1) {
                return `th`;
            } else {
                const num = rank % 10;
                if (num === 1) {
                    return `st`;
                } else if (num === 2) {
                    return `nd`;
                } else if (num === 3) {
                    return `rd`;
                } else {
                    return `th`;
                }
            }
        }
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

    export function getWarActionCode(container: IWarActionContainer): WarActionCodes | null {
        const name = getWarActionName(container);
        return name == null ? null : WarActionCodes[name];
    }
    export function getWarActionName(container: IWarActionContainer): string | null {
        for (const k in container) {
            if (k !== "actionId") {
                return k;
            }
        }
        return null;
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

    export function checkIsValidLanguageType(t: number | null | undefined): boolean {
        return (t === Types.LanguageType.Chinese)
            || (t === Types.LanguageType.English);
    }
    export function checkIsValidLanguageText({ data, minLength, maxLength }: {
        data        : ILanguageText;
        minLength   : number;
        maxLength   : number;
    }): boolean {
        if (!checkIsValidLanguageType(data.languageType)) {
            return false;
        }

        const text = data.text;
        if (text == null) {
            return false;
        }

        const length = text.length;
        return (length >= minLength) && (length <= maxLength);
    }
    export function checkIsValidLanguageTextArray({ list, minTextLength, maxTextLength, minTextCount }: {
        list            : ILanguageText[];
        minTextLength   : number;
        maxTextLength   : number;
        minTextCount    : number;
    }): boolean {
        if (list == null) {
            return minTextCount <= 0;
        }

        if (list.length <= 0) {
            return false;
        }

        const languageTypeSet = new Set<number>();
        for (const data of list) {
            const languageType = data.languageType;
            if ((languageType == null)                      ||
                (!checkIsValidLanguageType(languageType))   ||
                (languageTypeSet.has(languageType))
            ) {
                return false;
            }
            languageTypeSet.add(languageType);

            const text = data.text;
            if (text == null) {
                return false;
            }

            const length = text.length;
            if ((length > maxTextLength) || (length < minTextLength)) {
                return false;
            }
        }

        return true;
    }

    export function pickRandomElement<T>(list: T[]): T {
        if (!list) {
            return undefined;
        } else {
            return list[Math.floor(Math.random() * list.length)];
        }
    }
    export function deleteElementFromArray<T>(arr: T[], element: T, maxDeleteCount = Number.MAX_VALUE): number {
        let index       = 0;
        let deleteCount = 0;
        while ((index < arr.length) && (deleteCount < maxDeleteCount)) {
            if (arr[index] === element) {
                arr.splice(index, 1);
                ++deleteCount;
            } else {
                ++index;
            }
        }
        return deleteCount;
    }
    export function checkHasElement<T>(arr: T[], element: T): boolean {
        return arr ? arr.indexOf(element) >= 0 : undefined;
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

    export function getPointDistance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    export function getSquaredPointDistance(x1: number, y1: number, x2: number, y2: number): number {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
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

    export function resetTween<T>({ obj, beginProps, waitTime, endProps, tweenTime, callback }: {
        obj         : T;
        beginProps  : { [K in keyof T]?: T[K] };
        waitTime?   : number;
        endProps    : { [K in keyof T]?: T[K] };
        tweenTime?  : number;
        callback?   : () => void
    }): void {
        egret.Tween.removeTweens(obj);

        const tween = egret.Tween.get(obj)
            .set(beginProps)
            .wait(waitTime || 0)
            .to(endProps, tweenTime || 200, egret.Ease.sineOut);
        if (callback) {
            tween.call(callback);
        }
    }

    export namespace Sha1Generator {
        /*
        * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
        * in FIPS 180-1
        * Version 2.2 Copyright Paul Johnston 2000 - 2009.
        * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
        * Distributed under the BSD License
        * See http://pajhome.org.uk/crypt/md5 for details.
        * http://www.sharejs.com
        */

        /*
         * Configurable variables. You may need to tweak these to be compatible with
         * the server-side, but the defaults work in most cases.
         */
        var hexcase = 0; /* hex output format. 0 - lowercase; 1 - uppercase    */
        var b64pad = ""; /* base-64 pad character. "=" for strict RFC compliance  */

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        export function hex_sha1(s) {
            return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
        }

        export function b64_sha1(s) {
            return rstr2b64(rstr_sha1(str2rstr_utf8(s)));
        }

        export function any_sha1(s, e) {
            return rstr2any(rstr_sha1(str2rstr_utf8(s)), e);
        }

        export function hex_hmac_sha1(k, d) {
            return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
        }

        export function b64_hmac_sha1(k, d) {
            return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
        }

        export function any_hmac_sha1(k, d, e) {
            return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e);
        }

        /*
         * Perform a simple self-test to see if the VM is working
         */
        function sha1_vm_test() {
            return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
        }

        /*
         * Calculate the SHA1 of a raw string
         */
        function rstr_sha1(s) {
            return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
        }

        /*
         * Calculate the HMAC-SHA1 of a key and some data (raw strings)
         */
        function rstr_hmac_sha1(key, data) {
            var bkey = rstr2binb(key);
            if (bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);

            var ipad = Array(16),
                opad = Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
            return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
        }

        /*
         * Convert a raw string to a hex string
         */
        function rstr2hex(input) {
            try {
                hexcase
            } catch (e) {
                hexcase = 0;
            }
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var output = "";
            var x;
            for (var i = 0; i < input.length; i++) {
                x = input.charCodeAt(i);
                output += hex_tab.charAt((x >>> 4) & 0x0F) +
                    hex_tab.charAt(x & 0x0F);
            }
            return output;
        }

        /*
         * Convert a raw string to a base-64 string
         */
        function rstr2b64(input) {
            try {
                b64pad
            } catch (e) {
                b64pad = '';
            }
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var output = "";
            var len = input.length;
            for (var i = 0; i < len; i += 3) {
                var triplet = (input.charCodeAt(i) << 16) |
                    (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) |
                    (i + 2 < len ? input.charCodeAt(i + 2) : 0);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > input.length * 8) output += b64pad;
                    else output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
                }
            }
            return output;
        }

        /*
         * Convert a raw string to an arbitrary string encoding
         */
        function rstr2any(input, encoding) {
            var divisor = encoding.length;
            var remainders = Array();
            var i, q, x, quotient;

            /* Convert to an array of 16-bit big-endian values, forming the dividend */
            var dividend = Array(Math.ceil(input.length / 2));
            for (i = 0; i < dividend.length; i++) {
                dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
            }

            /*
             * Repeatedly perform a long division. The binary array forms the dividend,
             * the length of the encoding is the divisor. Once computed, the quotient
             * forms the dividend for the next step. We stop when the dividend is zero.
             * All remainders are stored for later use.
             */
            while (dividend.length > 0) {
                quotient = Array();
                x = 0;
                for (i = 0; i < dividend.length; i++) {
                    x = (x << 16) + dividend[i];
                    q = Math.floor(x / divisor);
                    x -= q * divisor;
                    if (quotient.length > 0 || q > 0)
                        quotient[quotient.length] = q;
                }
                remainders[remainders.length] = x;
                dividend = quotient;
            }

            /* Convert the remainders to the output string */
            var output = "";
            for (i = remainders.length - 1; i >= 0; i--)
                output += encoding.charAt(remainders[i]);

            /* Append leading zero equivalents */
            var full_length = Math.ceil(input.length * 8 /
                (Math.log(encoding.length) / Math.log(2)))
            for (i = output.length; i < full_length; i++)
                output = encoding[0] + output;

            return output;
        }

        /*
         * Encode a string as utf-8.
         * For efficiency, this assumes the input is valid utf-16.
         */
        function str2rstr_utf8(input) {
            var output = "";
            var i = -1;
            var x, y;

            while (++i < input.length) {
                /* Decode utf-16 surrogate pairs */
                x = input.charCodeAt(i);
                y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
                if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
                    x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
                    i++;
                }

                /* Encode output as utf-8 */
                if (x <= 0x7F)
                    output += String.fromCharCode(x);
                else if (x <= 0x7FF)
                    output += String.fromCharCode(0xC0 | ((x >>> 6) & 0x1F),
                        0x80 | (x & 0x3F));
                else if (x <= 0xFFFF)
                    output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
                else if (x <= 0x1FFFFF)
                    output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07),
                        0x80 | ((x >>> 12) & 0x3F),
                        0x80 | ((x >>> 6) & 0x3F),
                        0x80 | (x & 0x3F));
            }
            return output;
        }

        /*
         * Encode a string as utf-16
         */
        function str2rstr_utf16le(input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode(input.charCodeAt(i) & 0xFF,
                    (input.charCodeAt(i) >>> 8) & 0xFF);
            return output;
        }

        function str2rstr_utf16be(input) {
            var output = "";
            for (var i = 0; i < input.length; i++)
                output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF,
                    input.charCodeAt(i) & 0xFF);
            return output;
        }

        /*
         * Convert a raw string to an array of big-endian words
         * Characters >255 have their high-byte silently ignored.
         */
        function rstr2binb(input) {
            var output = Array(input.length >> 2);
            for (var i = 0; i < output.length; i++)
                output[i] = 0;
            for (var i = 0; i < input.length * 8; i += 8)
                output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
            return output;
        }

        /*
         * Convert an array of big-endian words to a string
         */
        function binb2rstr(input) {
            var output = "";
            for (var i = 0; i < input.length * 32; i += 8)
                output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
            return output;
        }

        /*
         * Calculate the SHA-1 of an array of big-endian words, and a bit length
         */
        function binb_sha1(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for (var j = 0; j < 80; j++) {
                    if (j < 16) w[j] = x[i + j];
                    else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)),
                        safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = bit_rol(b, 30);
                    b = a;
                    a = t;
                }

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return Array(a, b, c, d, e);

        }

        /*
         * Perform the appropriate triplet combination function for the current
         * iteration
         */
        function sha1_ft(t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*
         * Determine the appropriate additive constant for the current iteration
         */
        function sha1_kt(t) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
                (t < 60) ? -1894007588 : -899497514;
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function bit_rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }
    }
}
