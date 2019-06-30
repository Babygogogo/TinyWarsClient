
namespace TinyWars.Utility {
    export namespace Logger {
        const enum LogLevels {
            All   = 0,
            Trace = 1,
            Debug = 2,
            Log   = 3,
            Info  = 4,
            Warn  = 5,
            Error = 6,
            Off   = 0xFFFFFFFF,
        }

        const CONSOLE           = window.console;
        const LOG_LEVEL         = window.CLIENT_VERSION === "DEVELOP" ? LogLevels.All : LogLevels.Off;
        const IS_ASSERT_ENABLED = true;

        export function trace(...rest: any[]): void {
            if (LOG_LEVEL <= LogLevels.Trace) {
                if (egret.Capabilities.isMobile) {
                    CONSOLE.trace(rest.join(" "));
                } else {
                    CONSOLE.trace.apply(CONSOLE, rest);
                }
            }
        }

        export function debug(...rest: any[]): void {
            if (LOG_LEVEL <= LogLevels.Debug) {
                if (egret.Capabilities.isMobile) {
                    CONSOLE.debug(rest.join(" "));
                } else {
                    CONSOLE.debug.apply(CONSOLE, rest);
                }
            }
        }

        export function log(...rest: any[]): void {
            if (LOG_LEVEL <= LogLevels.Log) {
                if (egret.Capabilities.isMobile) {
                    CONSOLE.log(rest.join(" "));
                } else {
                    CONSOLE.log.apply(CONSOLE, rest);
                }
            }
        }

        export function info(...rest: any[]): void {
            if (LOG_LEVEL <= LogLevels.Info) {
                if (egret.Capabilities.isMobile) {
                    CONSOLE.info(rest.join(" "));
                } else {
                    CONSOLE.info.apply(CONSOLE, rest);
                }
            }
        }

        export function warn(...rest: any[]): void {
            if (LOG_LEVEL <= LogLevels.Warn) {
                if (egret.Capabilities.isMobile) {
                    CONSOLE.warn(rest.join(" "));
                } else {
                    CONSOLE.warn.apply(CONSOLE, rest);
                }
            }
        }

        export function error(...rest: any[]): void {
            if (LOG_LEVEL <= LogLevels.Error) {
                if (egret.Capabilities.isMobile) {
                    CONSOLE.error(rest.join(" "));
                } else {
                    CONSOLE.error.apply(CONSOLE, rest);
                }
            }
        }

        export function dump(obj): void {
            Logger.log(JSON.stringify(obj));
        }

        export function assert(...rest: any[]): void {
            if (IS_ASSERT_ENABLED) {
                if (egret.Capabilities.isMobile) {
                    CONSOLE.assert(rest.shift(), rest.join(" "));
                } else {
                    CONSOLE.assert.apply(console, rest);
                }
            }
        }
    }
}
