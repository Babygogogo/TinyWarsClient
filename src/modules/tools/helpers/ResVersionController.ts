
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWarsNamespace.ResVersionController {
    const RES_NAME_DICT: { [rawName: string]: string } = {};

    class VersionController implements RES.VersionController {
        public async init(): Promise<void> {
            // nothing to do
        }

        public getVirtualUrl(url: string): string {
            return RES_NAME_DICT[url] ?? url;
        }
    }

    export function init(): Promise<void> {
        return new Promise(resolve => {
            const request = new XMLHttpRequest();
            request.open(`GET`, `resource/ResHashDict.${window.CLIENT_VERSION}.json`);
            request.onload = () => {
                const hashDict = JSON.parse(request.responseText);
                for (const rawName in hashDict) {
                    const indexForDot           = rawName.lastIndexOf(`.`);
                    const index                 = (indexForDot >= 0 ? indexForDot : rawName.lastIndexOf(`/`)) + 1;
                    RES_NAME_DICT[rawName]    = `${rawName.slice(0, index)}${hashDict[rawName]}.${rawName.slice(index)}`;
                }
                RES.registerVersionController(new VersionController());

                resolve();
            };
            request.send(null);
        });
    }

    export function getResVirtualUrl(url: string): string {
        return RES_NAME_DICT[url] ?? url;
    }
}
