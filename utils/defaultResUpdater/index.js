
const fs            = require("fs");

const RESOURCE_PATH         = `../../resource/`;
const DEFAULT_RES_JSON_PATH = `${RESOURCE_PATH}default.res.json`;

function main() {
    const resData = require(DEFAULT_RES_JSON_PATH);

    for (const resourceData of resData.resources) {
        const url = resourceData.url;
        if (url.includes(`.json`)) {
            const keyArray = [];
            for (const filename in require(`${RESOURCE_PATH}${url}`).frames) {
                keyArray.push(filename);
            }
            resourceData.subkeys = keyArray.join(`,`);
        }
    }

    fs.writeFileSync(DEFAULT_RES_JSON_PATH, JSON.stringify(resData, null, 4));
}

main();
