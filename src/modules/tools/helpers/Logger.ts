
import Types     from "./Types";

namespace Logger {
    import LogLevel         = Types.LogLevel;

    const CONSOLE           = window.console;
    const LOG_LEVEL         = window.CLIENT_VERSION === "DEVELOP" ? LogLevel.All : LogLevel.Off;
    const IS_ASSERT_ENABLED = true;

    export function trace(...rest: any[]): void {
        if (LOG_LEVEL <= LogLevel.Trace) {
            if (egret.Capabilities.isMobile) {
                CONSOLE.trace(rest.join(" "));
            } else {
                CONSOLE.trace(...rest);
            }
        }
    }

    export function debug(...rest: any[]): void {
        if (LOG_LEVEL <= LogLevel.Debug) {
            if (egret.Capabilities.isMobile) {
                CONSOLE.debug(rest.join(" "));
            } else {
                CONSOLE.debug(...rest);
            }
        }
    }

    export function log(...rest: any[]): void {
        if (LOG_LEVEL <= LogLevel.Log) {
            if (egret.Capabilities.isMobile) {
                CONSOLE.log(rest.join(" "));
            } else {
                CONSOLE.log(...rest);
            }
        }
    }

    export function info(...rest: any[]): void {
        if (LOG_LEVEL <= LogLevel.Info) {
            if (egret.Capabilities.isMobile) {
                CONSOLE.info(rest.join(" "));
            } else {
                CONSOLE.info(...rest);
            }
        }
    }

    export function warn(...rest: any[]): void {
        if (LOG_LEVEL <= LogLevel.Warn) {
            if (egret.Capabilities.isMobile) {
                CONSOLE.warn(rest.join(" "));
            } else {
                CONSOLE.warn(...rest);
            }
        }
    }

    export function error(...rest: any[]): void {
        if (LOG_LEVEL <= LogLevel.Error) {
            if (egret.Capabilities.isMobile) {
                CONSOLE.error(rest.join(" "));
            } else {
                CONSOLE.error(...rest);
            }
        }
    }

    export function dump(obj: any): void {
        log(JSON.stringify(obj));
    }

    export function assert(cond: boolean, ...rest: any[]): void {
        if (IS_ASSERT_ENABLED) {
            if (egret.Capabilities.isMobile) {
                CONSOLE.assert(cond, rest.join(" "));
            } else {
                CONSOLE.assert(cond, ...rest);
            }
        }
    }
}

export default Logger;
