
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWarsNamespace {
    const RES_NAME_DICT: { [rawName: string]: string } = {};

    export class ResVersionController implements RES.VersionController {
        public init(): Promise<void> {
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
                    resolve();
                };
                request.send(null);
            });
        }

        public getVirtualUrl(url: string): string {
            return RES_NAME_DICT[url] ?? url;
        }
    }
}
