
const fs        = require("fs");
const execSync  = require('child_process').execSync;

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
