
// import Lang                 from "../lang/Lang";
// import TwnsLangTextType     from "../lang/LangTextType";
// import ProtoTypes           from "../proto/ProtoTypes";
// import TwnsClientErrorCode  from "./ClientErrorCode";
// import Types                from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Helpers {
    import ColorType            = Types.ColorType;
    import ILanguageText        = CommonProto.Structure.ILanguageText;
    import IMessageContainer    = CommonProto.NetMessage.IMessageContainer;
    import IWarActionContainer  = CommonProto.WarAction.IWarActionContainer;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

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

    export function checkIsAccountValid(str: Types.Undefinable<string>): boolean {
        return (typeof str === "string")
            && (str.length >= 6)
            && (str.length <= 20)
            && (str.search(/\W/) < 0);
    }

    export function checkIsPasswordValid(str: Types.Undefinable<string>): boolean {
        return (typeof str === "string")
            && (str.length >= 6)
            && (str.length <= 20)
            && (str.search(/\W/) < 0);
    }

    export function checkIsNicknameValid(str: Types.Undefinable<string>): boolean {
        return (typeof str === "string")
            && (str.length >= 4)
            && (str.length <= 20);
    }

    export function checkIsDiscordIdValid(str: string | null): boolean {
        return (typeof str == "string") && (str.length >= 17) && (str.length <= 18);
    }

    export function formatString(...args: (Types.Undefinable<number | string>)[]): string {
        let i = 0, a: any, f = args[i++] as string, m: any[] | null, p, c, x;
        const o = [], s = '';

        while (f) {
            m = /^[^\x25]+/.exec(f);
            if (m) {
                o.push(m[0]);
                f = f.substring(m[0].length);
                continue;
            }

            m = /^\x25{2}/.exec(f);
            if (m) {
                o.push('%');
                f = f.substring(m[0].length);
                continue;
            }

            m = /^\x25(?:(\d+)\$)?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(f);
            if (m) {
                if (((a = args[m[1] || i++]) == null) || (a == null)) {
                    throw ('Too few arguments.');
                }
                if (/[^s]/.test(m[7])) {
                    const aa = Number(a);
                    if (isNaN(aa)) {
                        throw ('Expecting number but found ' + typeof (a));
                    } else {
                        a = aa;
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
                f = f.substring(m[0].length);
                continue;
            }

            throw ('Huh ?!');
        }

        return o.join('');
    }

    export function repeatString(str: string, times: number): string {
        return (new Array(Math.max(times, 0) + 1)).join(str);
    }

    export function getSuffixForRank(rank: Types.Undefinable<number>): string | null {
        if (rank == null) {
            return null;
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
                (obj.filters as any) = null;
            } else {
                obj.filters = [new egret.ColorMatrixFilter(getColorMatrix(color, value) ?? void 0)];
            }
        }
    }

    // export function getMessageCode(container: IMessageContainer): MessageCodes | null {
    //     const name = getMessageName(container);
    //     return name == null ? null : MessageCodes[name as any] as any;
    // }
    export function getMessageName(container: IMessageContainer): keyof IMessageContainer {
        for (const k in container) {
            return k as keyof IMessageContainer;
        }
        throw newError(`Invalid container.`, ClientErrorCode.Helpers_GetMessageName_00);
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

    /**
     * 对于某个key，如果其中一个obj不包含它，而另一个obj包含它但值为null/undefined，则依然认为这两个obj相同
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    export function checkIsSameValue(obj1: any, obj2: any): boolean {
        const type = typeof(obj1);
        if (type !== typeof(obj2)) {
            return false;
        }
        if (type !== "object") {
            return obj1 == obj2;
        }

        const keys = Object.keys(obj1).filter(v => obj1[v] != null);
        if (keys.length !== Object.keys(obj2).filter(v => obj2[v] != null).length) {
            return false;
        }

        return keys.every(v => checkIsSameValue(obj1[v], obj2[v]));
    }

    export function checkIsEmptyObject(obj: { [key: string]: any }): boolean {
        for (const k in obj) {
            return false;
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    export function checkIsNumber(value: any): boolean {
        return value === +value;
    }

    export function checkIsValidLanguageType(t: Types.Undefinable<number>): boolean {
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
        list            : Types.Undefinable<ILanguageText[]>;
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

    export function pickRandomElement<T>(list: T[], randomValue?: number): T {
        return list[Math.floor((randomValue ?? Math.random()) * list.length)];
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
        return arr.indexOf(element) >= 0;
    }
    export function getNonNullElements<T>(arr: Types.Undefinable<T>[]): T[] {
        return arr.filter(v => v != null) as T[];
    }

    export function checkIsMeetValueComparator({ comparator, actualValue, targetValue }: {
        comparator  : Types.ValueComparator;
        actualValue : number;
        targetValue : number;
    }): boolean {
        return ((comparator === Types.ValueComparator.EqualTo)          && (actualValue === targetValue))
            || ((comparator === Types.ValueComparator.NotEqualTo)       && (actualValue !== targetValue))
            || ((comparator === Types.ValueComparator.GreaterThan)      && (actualValue > targetValue))
            || ((comparator === Types.ValueComparator.NotGreaterThan)   && (actualValue <= targetValue))
            || ((comparator === Types.ValueComparator.LessThan)         && (actualValue < targetValue))
            || ((comparator === Types.ValueComparator.NotLessThan)      && (actualValue >= targetValue));
    }
    export function getNextValueComparator(comparator: Types.Undefinable<Types.ValueComparator>): Types.ValueComparator {
        switch (comparator) {
            case Types.ValueComparator.EqualTo          : return Types.ValueComparator.NotEqualTo;
            case Types.ValueComparator.NotEqualTo       : return Types.ValueComparator.GreaterThan;
            case Types.ValueComparator.GreaterThan      : return Types.ValueComparator.NotLessThan;
            case Types.ValueComparator.NotLessThan      : return Types.ValueComparator.LessThan;
            case Types.ValueComparator.LessThan         : return Types.ValueComparator.NotGreaterThan;
            default                                     : return Types.ValueComparator.EqualTo;
        }
    }

    export function getValueInRange({ minValue, maxValue, rawValue }: {
        minValue    : number;
        maxValue    : number;
        rawValue    : number;
    }): number {
        if (minValue > maxValue) {
            throw newError(`Helpers.getValueInRange() invalid minValue and maxValue: ${minValue}, ${maxValue}`, ClientErrorCode.Helpers_GetValueInRange_00);
        }

        if (rawValue > maxValue) {
            return maxValue;
        }
        if (rawValue < minValue) {
            return minValue;
        }
        return rawValue;
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
            return `0${Lang.getText(LangTextType.B0017)}`;
        } else {
            const seconds = totalSeconds % 60;
            const minutes = Math.floor(totalSeconds / 60) % 60;
            const hours   = Math.floor(totalSeconds / (60 * 60)) % 24;
            const days    = Math.floor(totalSeconds / (60 * 60 * 24));

            let text = "";
            (days    > 0) && (text = `${text}${days}${Lang.getText(LangTextType.B0014)}`);
            (hours   > 0) && (text = `${text}${hours}${Lang.getText(LangTextType.B0015)}`);
            (minutes > 0) && (text = `${text}${minutes}${Lang.getText(LangTextType.B0016)}`);
            (seconds > 0) && (text = `${text}${seconds}${Lang.getText(LangTextType.B0017)}`);
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
    };
    /**
     * 返回指定时间戳对应的时间，格式： x年x月x日xx:xx:xx
     * @param controller 用于控制特定子串要不要显示，默认为全显示
     */
    export function getTimestampText(timestamp: number, controller?: TimeTextController): string {
        const d = new Date(timestamp * 1000);
        const needHour   = (!controller) || (controller.hour !== false);
        const needMinute = (!controller) || (controller.minute !== false);
        const needSecond = (!controller) || (controller.second !== false);
        const strYear    = (!controller) || (controller.year !== false)  ? `${getNumText(d.getFullYear(), 4)}${Lang.getText(LangTextType.B0059)}`     : ``;
        const strMonth   = (!controller) || (controller.month !== false) ? `${getNumText(d.getMonth() + 1)}${Lang.getText(LangTextType.B0058)}`    : ``;
        const strDate    = (!controller) || (controller.date !== false)  ? `${getNumText(d.getDate())}${Lang.getText(LangTextType.B0057)}`         : ``;
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
    export async function checkAndCallLater(): Promise<void> {  // DONE
        if (Date.now() - _frameBeginTime > 13) {
            await new Promise<void>((resolve) => {
                egret.callLater(() => {
                    _frameBeginTime = Date.now();
                    resolve();
                }, null);
            });
        }
    }
    export function wait(timeMs: number): Promise<void> {
        return new Promise<void>(resolve => {
            egret.setTimeout(resolve, null, timeMs);
        });
    }
    export function createLazyFunc<T>(func: () => T): () => T {
        let hasCalled   = false;
        let result      : T;
        return () => {
            if (!hasCalled) {
                hasCalled   = true;
                result      = func();
            }
            return result;
        };
    }
    // export function createCachedDataGetter<DataType, NetMessageType>({ dataDict, dataExpireTime = 999999, notifyTypeForSucceed, notifyTypeForFail, checkIsTargetMessage, reqData }: {
    //     dataDict                : Map<number, DataType | null>;
    //     dataExpireTime?         : number;
    //     notifyTypeForSucceed    : TwnsNotifyType.NotifyType;
    //     notifyTypeForFail       : TwnsNotifyType.NotifyType;
    //     checkIsTargetMessage    : (msg: NetMessageType, key: number) => boolean;
    //     reqData                 : (key: number) => void;
    // }): (key: number) => Promise<DataType | null> {
    //     const requestDict           = new Map<number, (() => void)[]>();
    //     const requestTimestampDict  = new Map<number, number>();
    //     const dataTimestampDict     = new Map<number, number>();

    //     return (key: number): Promise<DataType | null> => {
    //         const serverTimestamp = Timer.getServerTimestamp();
    //         if ((dataDict.has(key))                                                     &&
    //             (serverTimestamp - (dataTimestampDict.get(key) ?? 0) <= dataExpireTime)
    //         ) {
    //             return new Promise<DataType | null>(resolve => resolve(dataDict.get(key) ?? null));
    //         }

    //         if ((requestDict.has(key))                                          &&
    //             (serverTimestamp - (requestTimestampDict.get(key) ?? 0) <= 10)
    //         ) {
    //             return new Promise<DataType | null>(resolve => {
    //                 getExisted(requestDict.get(key)).push(() => {
    //                     resolve(dataDict.get(key) ?? null);
    //                 });
    //             });
    //         }

    //         return new Promise<DataType | null>(resolve => {
    //             if (requestDict.has(key)) {
    //                 getExisted(requestDict.get(key)).push(() => {
    //                     resolve(dataDict.get(key) ?? null);
    //                 });

    //             } else {
    //                 const callbackOnSucceeded = (e: egret.Event): void => {
    //                     if (checkIsTargetMessage(e.data, key)) {
    //                         Notify.removeEventListener(notifyTypeForSucceed,    callbackOnSucceeded);
    //                         Notify.removeEventListener(notifyTypeForFail,       callbackOnFailed);

    //                         dataTimestampDict.set(key, Timer.getServerTimestamp());

    //                         for (const cb of getExisted(requestDict.get(key))) {
    //                             cb();
    //                         }
    //                         requestDict.delete(key);
    //                     }
    //                 };
    //                 const callbackOnFailed = (e: egret.Event): void => {
    //                     if (checkIsTargetMessage(e.data, key)) {
    //                         Notify.removeEventListener(notifyTypeForSucceed,    callbackOnSucceeded);
    //                         Notify.removeEventListener(notifyTypeForFail,       callbackOnFailed);

    //                         for (const cb of getExisted(requestDict.get(key))) {
    //                             cb();
    //                         }
    //                         requestDict.delete(key);
    //                     }
    //                 };
    //                 Notify.addEventListener(notifyTypeForSucceed,   callbackOnSucceeded);
    //                 Notify.addEventListener(notifyTypeForFail,      callbackOnFailed);

    //                 requestDict.set(key, [() => {
    //                     resolve(dataDict.get(key) ?? null);
    //                 }]);
    //             }

    //             requestTimestampDict.set(key, serverTimestamp);
    //             reqData(key);
    //         });
    //     };
    // }
    export function createCachedDataAccessor<KeyType, DataType>({ dataExpireTime = 999999, reqData }: {
        dataExpireTime?     : number;
        reqData             : (key: KeyType) => void;
    }): {
        getData     : (key: KeyType) => Promise<DataType | null>;
        setData     : (key: KeyType, data: DataType | null) => void;
    } {
        const dataDict              = new Map<KeyType, DataType | null>();
        const dataTimestampDict     = new Map<KeyType, number>();
        const requestDict           = new Map<KeyType, (() => void)[]>();
        const requestTimestampDict  = new Map<KeyType, number>();

        return {
            getData: (key: KeyType): Promise<DataType | null> => {
                const serverTimestamp = Timer.getServerTimestamp();
                if ((dataDict.has(key))                                                     &&
                    (serverTimestamp - (dataTimestampDict.get(key) ?? 0) <= dataExpireTime)
                ) {
                    return new Promise<DataType | null>(resolve => resolve(dataDict.get(key) ?? null));
                }

                if ((requestDict.has(key))                                          &&
                    (serverTimestamp - (requestTimestampDict.get(key) ?? 0) <= 10)
                ) {
                    return new Promise<DataType | null>(resolve => {
                        getExisted(requestDict.get(key)).push(() => {
                            resolve(dataDict.get(key) ?? null);
                        });
                    });
                }

                return new Promise<DataType | null>(resolve => {
                    if (requestDict.has(key)) {
                        getExisted(requestDict.get(key)).push(() => {
                            resolve(dataDict.get(key) ?? null);
                        });
                    } else {
                        requestDict.set(key, [() => {
                            resolve(dataDict.get(key) ?? null);
                        }]);
                    }

                    requestTimestampDict.set(key, serverTimestamp);
                    reqData(key);
                });
            },
            setData : (key: KeyType, data: DataType | null): void => {
                dataTimestampDict.set(key, Timer.getServerTimestamp());
                dataDict.set(key, data);

                for (const cb of requestDict.get(key) ?? []) {
                    cb();
                }
                requestDict.delete(key);
            },
        };
    }

    function getColorMatrix(color: Types.ColorType, value = 100): number[] | null {
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

            case Types.ColorType.Yellow:
                return [
                    1, 0, 0, 0, value,
                    0, 1, 0, 0, value,
                    0, 0, 1, 0, 0,
                    0, 0, 0, 1, 0
                ];

            default:
                return null;
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
            .to(endProps, tweenTime || CommonConstants.DefaultTweenTime, egret.Ease.sineOut);
        if (callback) {
            tween.call(callback);
        }
    }

    export function getDefined<T>(value: T | undefined, errorCode: ClientErrorCode): T {
        if (value === undefined) {
            throw newError(`Undefined value.`, errorCode);
        }

        return value;
    }
    export function getExisted<T>(value: Types.Undefinable<T>, errorCode?: ClientErrorCode): T {
        if (value == null) {
            throw newError(`Empty value`, errorCode);
        }

        return value;
    }

    export function newError(msg: string, errorCode?: ClientErrorCode): Types.CustomError {
        const error     : Types.CustomError = new Error(msg);
        error.errorCode = errorCode;
        return error;
    }

    export async function checkIsAnyPromiseTrue(promiseArray: (Promise<boolean> | boolean)[]): Promise<boolean> {
        for (const promise of promiseArray) {
            if (await promise) {
                return true;
            }
        }
        return false;
    }
}

// export default Helpers;
