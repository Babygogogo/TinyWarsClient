
namespace GameBase {
    export module Logger {
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

        const logLevel: LogLevels = LogLevels.All;
        const console : Console = window.console;

        export function trace(...rest: any[]): void {
            if (logLevel <= LogLevels.Trace) {
                if (egret.Capabilities.isMobile) {
                    console.trace(rest.join(" "));
                } else {
                    console.trace.apply(console, rest);
                }
            }
        }

        export function debug(...rest: any[]): void {
            if (logLevel <= LogLevels.Debug) {
                if (egret.Capabilities.isMobile) {
                    console.debug(rest.join(" "));
                } else {
                    console.debug.apply(console, rest);
                }
            }
        }

        export function log(...rest: any[]): void {
            if (logLevel <= LogLevels.Log) {
                if (egret.Capabilities.isMobile) {
                    console.log(rest.join(" "));
                } else {
                    console.log.apply(console, rest);
                }
            }
        }

        export function info(...rest: any[]): void {
            if (logLevel <= LogLevels.Info) {
                if (egret.Capabilities.isMobile) {
                    console.info(rest.join(" "));
                } else {
                    console.info.apply(console, rest);
                }
            }
        }

        export function warn(...rest: any[]): void {
            if (logLevel <= LogLevels.Warn) {
                if (egret.Capabilities.isMobile) {
                    console.warn(rest.join(" "));
                } else {
                    console.warn.apply(console, rest);
                }
            }
        }

        export function error(...rest: any[]): void {
            if (logLevel <= LogLevels.Error) {
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
