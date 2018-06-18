
namespace GameBase {
    export module Logger {
        const enum LogLevels {
            ALL   = 0,
            TRACE = 1,
            DEBUG = 2,
            LOG   = 3,
            INFO  = 4,
            WARN  = 5,
            ERROR = 6,
            FATAL = 7,
            OFF   = 0xFFFFFFFF,
        }

        const logLevel: LogLevels = LogLevels.ALL;
        const console : Console = window.console;

        export function trace(...rest: any[]): void {
            if (logLevel <= LogLevels.TRACE) {
                if (egret.Capabilities.isMobile) {
                    console.trace(rest.join(" "));
                } else {
                    console.trace.apply(console, rest);
                }
            }
        }

        export function debug(...rest: any[]): void {
            if (logLevel <= LogLevels.DEBUG) {
                if (egret.Capabilities.isMobile) {
                    console.debug(rest.join(" "));
                } else {
                    console.debug.apply(console, rest);
                }
            }
        }

        export function log(...rest: any[]): void {
            if (logLevel <= LogLevels.LOG) {
                if (egret.Capabilities.isMobile) {
                    console.log(rest.join(" "));
                } else {
                    console.log.apply(console, rest);
                }
            }
        }

        export function info(...rest: any[]): void {
            if (logLevel <= LogLevels.INFO) {
                if (egret.Capabilities.isMobile) {
                    console.info(rest.join(" "));
                } else {
                    console.info.apply(console, rest);
                }
            }
        }

        export function warn(...rest: any[]): void {
            if (logLevel <= LogLevels.WARN) {
                if (egret.Capabilities.isMobile) {
                    console.warn(rest.join(" "));
                } else {
                    console.warn.apply(console, rest);
                }
            }
        }

        export function error(...rest: any[]): void {
            if (logLevel <= LogLevels.ERROR) {
                if (egret.Capabilities.isMobile) {
                    console.error(rest.join(" "));
                } else {
                    console.error.apply(console, rest);
                }
            }
        }

        export function dump(obj): void {
            Logger.log(JSON.stringify(obj));
        }
    }
}
