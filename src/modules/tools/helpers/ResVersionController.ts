
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWarsNamespace {
    let resHashDict: { [k: string]: string } = {};

    export class ResVersionController implements RES.VersionController {
        public init(): Promise<void> {
            return new Promise(resolve => {
                const request = new XMLHttpRequest();
                request.open(`GET`, `resource/ResHashDict.${window.CLIENT_VERSION}.json`);
                request.onload = () => {
                    resHashDict = JSON.parse(request.responseText);
                    resolve();
                };
                request.send(null);
            });
        }

        public getVirtualUrl(url: string): string {
            const hashValue = resHashDict[url];
            if (!hashValue) {
                return url;
            } else {
                const indexForDot   = url.lastIndexOf(`.`);
                const index         = (indexForDot >= 0 ? indexForDot : url.lastIndexOf(`/`)) + 1;
                return `${url.slice(0, index)}${hashValue}.${url.slice(index)}`;
            }
        }
    }
}
