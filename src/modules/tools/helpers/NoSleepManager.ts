
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.NoSleepManager {
    let noSleepObject: {
        enable  : () => void;
        disable : () => void;
    };

    export function init(): void {
        noSleepObject = new NoSleep();
    }

    export function enable(): void {
        (noSleepObject) && (noSleepObject.enable());
    }

    export function disable(): void {
        (noSleepObject) && (noSleepObject.disable());
    }
}

// export default NoSleepManager;
