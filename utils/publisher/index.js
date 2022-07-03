
const fs            = require("fs");
const crypto        = require("crypto");
const path          = require("path");
const execSync      = require('child_process').execSync;
const PublishConfig = require("../../../TinyWarsExternals/utils/Publisher/PublishConfig");

const DESTINATION_PATH      = "bin-release/web/twc/";
const INDEX_PATH            = `${DESTINATION_PATH}index.html`;
const MANIFEST_PATH         = `${DESTINATION_PATH}manifest.json`;
const RESOURCE_PATH         = `${DESTINATION_PATH}resource/`;
const TSCONFIG_PATH         = "tsconfig.json";
const COMMON_CONSTANTS_PATH = "src/modules/tools/helpers/CommonConstants.ts";
const TSCONFIG_FOR_PUBLISH  = {
    "compilerOptions": {
        "target": "es5",
        "outDir": "bin-debug",
        "downlevelIteration": true,
        "importHelpers": true,
        "experimentalDecorators": true,
        "lib": [
            "dom",
            "es5",
            "es6",
            "es2015.collection",
            "es2015.iterable",
            "es2015.promise"
        ],
        "types": []
    },
    "include": [
        "src",
        "libs"
    ]
};

async function main() {
    const publishConfig = PublishConfig[process.argv[2]];
    if (publishConfig == null) {
        console.error(`Publisher index.js empty publishConfig!!`);
        return;
    }

    const currTsConfig          = fs.readFileSync(TSCONFIG_PATH, "utf8");
    const currCommonConstants   = fs.readFileSync(COMMON_CONSTANTS_PATH, "utf8");

    fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(TSCONFIG_FOR_PUBLISH), { encoding: "utf8", flag: "w+" });
    fs.writeFileSync(COMMON_CONSTANTS_PATH, getCommonConstantsForPublish(currCommonConstants, publishConfig), { encoding: "utf8", flag: "w+" });
    console.log(execSync(`egret publish --version twc`, {encoding: "utf8"}));
    fs.writeFileSync(TSCONFIG_PATH, currTsConfig, { encoding: "utf8", flag: "w+" });
    fs.writeFileSync(COMMON_CONSTANTS_PATH, currCommonConstants, { encoding: "utf8", flag: "w+" });

    const clientVersion = getVersion();
    fs.writeFileSync(
        INDEX_PATH,
        fs.readFileSync(INDEX_PATH, "utf8")
            .replace(/window\.CLIENT_VERSION.*/,    `window.CLIENT_VERSION = "${clientVersion}";`)
            .replace(/window\.GAME_SERVER_PORT.*/,  `window.GAME_SERVER_PORT = ${publishConfig.gameServerPort};`)
            .replace(`<title>TinyWars</title>`,     `<title>${publishConfig.gameName}</title>`)
    );

    await handleVersionForAllResources(clientVersion);

    console.log(`Publish succeeded: ${process.argv[2]}`);
}

function getVersion() {
    const d = new Date();
    return `${d.getFullYear() % 100}.${getNumText(d.getMonth() + 1)}${getNumText(d.getDate())}.${getNumText(d.getHours())}${getNumText(d.getMinutes())}`;
}

function repeatString(str, times) {
    return (new Array(times + 1)).join(str);
}

function getDigitsCount(num) {
    num = Math.abs(num);
    let count = 1;
    while (num >= 10) {
        ++count;
        num = Math.floor(num / 10);
    }

    return count;
}

function getNumText(num, targetLength = 2) {
    return repeatString("0", targetLength - getDigitsCount(num)) + num;
}

function getCommonConstantsForPublish(currData, publishConfig) {
    return currData
        .replace(/= Types\.GameVersion\..*/,                            `= Types.GameVersion.${publishConfig.gameVersion};`);
        // .replace(/= Types\.GameMode\..*/,       `= ${publishConfig.gameMode};`);
}

async function handleVersionForAllResources(clientVersion) {
    fs.unlinkSync(`${RESOURCE_PATH}ResHashDict.DEVELOP.json`);

    const allMapping = {};
    for (const mapping of await Promise.all(handleVersionForDirectory(RESOURCE_PATH))) {
        // console.log(mapping);
        if (mapping) {
            allMapping[mapping[0]] = mapping[1];
        }
    }

    fs.writeFileSync(`${RESOURCE_PATH}ResHashDict.${clientVersion}.json`, JSON.stringify(allMapping));

    const manifest              = JSON.parse(fs.readFileSync(MANIFEST_PATH));
    manifest.resHashDictPath    = `resource/ResHashDict.${clientVersion}.json`;
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest));
}

function handleVersionForDirectory(directoryPath) {
    const promiseArray = [];
    for (const name of fs.readdirSync(directoryPath)) {
        const fullName = path.join(directoryPath, name);
        if (fs.statSync(fullName).isFile()) {
            promiseArray.push(handleVersionForFile(fullName));
        } else {
            promiseArray.push(...handleVersionForDirectory(fullName));
        }
    }

    return promiseArray;
}

function handleVersionForFile(oldFileFullName) {
    return new Promise(resolve => {
        const hash  = crypto.createHash(`md5`);
        const input = fs.createReadStream(oldFileFullName);
        input.on('readable', () => {
            const data = input.read();
            if (data)
                hash.update(data);
            else {
                const hashValue         = hash.digest('hex');
                const indexForDot       = oldFileFullName.lastIndexOf(`.`);
                const index             = (indexForDot >= 0 ? indexForDot : oldFileFullName.lastIndexOf(path.sep)) + 1;
                const newFileFullName   = `${oldFileFullName.slice(0, index)}${hashValue}.${oldFileFullName.slice(index)}`;

                // console.log(oldFileFullName, hashValue, newFileFullName);
                fs.renameSync(oldFileFullName, newFileFullName);

                resolve([oldFileFullName.slice(DESTINATION_PATH.length).replace(/\\/g, `/`), hashValue]);
            }
        });
    });
}

main();
