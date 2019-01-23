
const fs        = require("fs");
const execSync  = require('child_process').execSync;

const INDEX_PATH            = "bin-release/web/twc/index.html";
const TSCONFIG_PATH         = "tsconfig.json";
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
}

const currConfig = fs.readFileSync(TSCONFIG_PATH, "utf8");
fs.writeFileSync(TSCONFIG_PATH, JSON.stringify(TSCONFIG_FOR_PUBLISH), { encoding: "utf8", flag: "w+" });
console.log(execSync(`egret publish --version twc`, {encoding: "utf8"}));
fs.writeFileSync(TSCONFIG_PATH, currConfig, { encoding: "utf8", flag: "w+" });

fs.writeFileSync(
    INDEX_PATH,
    fs.readFileSync("bin-release/web/twc/index.html", "utf8")
        .replace(/window.CLIENT_VERSION.*/, `window.CLIENT_VERSION = ${getVersion()}`)
);

function getVersion() {
    const d = new Date();
    return `"${d.getFullYear() % 100}.${getNumText(d.getMonth() + 1)}${getNumText(d.getDate())}.${getNumText(d.getHours())}${getNumText(d.getMinutes())}";`;
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
