
const fs            = require("fs");
const execSync      = require('child_process').execSync;
const PublishConfig = require("../../../TinyWarsExternals/utils/Publisher/PublishConfig");

const INDEX_PATH            = "bin-release/web/twc/index.html";
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

const publishConfig = PublishConfig[process.argv[2]];
if (publishConfig == null) {
    console.error(`Publisher index.js empty publishConfig!!`);
    return;
}

const currTsConfig          = fs.readFileSync(TSCONFIG_PATH, "utf8");
const currCommonConstants   = fs.readFileSync(COMMON_CONSTANTS_PATH, "utf8");

fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(TSCONFIG_FOR_PUBLISH), { encoding: "utf8", flag: "w+" });
fs.writeFileSync(COMMON_CONSTANTS_PATH, getCommonConstantsForPublish(currCommonConstants), { encoding: "utf8", flag: "w+" });
console.log(execSync(`egret publish --version twc`, {encoding: "utf8"}));
fs.writeFileSync(TSCONFIG_PATH, currTsConfig, { encoding: "utf8", flag: "w+" });
fs.writeFileSync(COMMON_CONSTANTS_PATH, currCommonConstants, { encoding: "utf8", flag: "w+" });

fs.writeFileSync(
    INDEX_PATH,
    fs.readFileSync(INDEX_PATH, "utf8")
        .replace(/window\.CLIENT_VERSION.*/,    `window.CLIENT_VERSION = ${getVersion()};`)
        .replace(/window\.GAME_SERVER_PORT.*/,  `window.GAME_SERVER_PORT = ${publishConfig.gameServerPort};`)
);

function getVersion() {
    const d = new Date();
    return `"${d.getFullYear() % 100}.${getNumText(d.getMonth() + 1)}${getNumText(d.getDate())}.${getNumText(d.getHours())}${getNumText(d.getMinutes())}"`;
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

function getCommonConstantsForPublish(currData) {
    return currData
        .replace(/= Types\.GameVersion\..*/,                            `= Types.GameVersion.${publishConfig.gameVersion};`)
        .replace(/const WarRuleEnergyGrowthMultiplierForAttacker.*/,    `const WarRuleEnergyGrowthMultiplierForAttacker = ${publishConfig.warRuleEnergyGrowthMultiplierForAttacker};`)
        .replace(/const WarRuleEnergyGrowthMultiplierForDefender.*/,    `const WarRuleEnergyGrowthMultiplierForDefender = ${publishConfig.warRuleEnergyGrowthMultiplierForDefender};`);
        // .replace(/= Types\.GameMode\..*/,       `= ${publishConfig.gameMode};`);
}
