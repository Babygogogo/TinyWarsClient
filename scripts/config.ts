/// 阅读 api.d.ts 查看文档
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, IncrementCompilePlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, RenamePlugin } from 'built-in';
import { WxgamePlugin } from './wxgame/wxgame';
import { BricksPlugin } from './bricks/bricks';
import { CustomPlugin } from './myplugin';
import { WebpackBundlePlugin, WebpackDevServerPlugin } from './plugins/webpack-plugin';

const config: ResourceManagerConfig = {


    buildConfig: (params) => {

        const { target, command, projectName, version } = params;

        if (command == 'build') {
            const outputDir = '.';
            return {
                outputDir,
                commands: [
                    // new EmitResConfigFilePlugin({
                    //     output: "resource/default.res.json",
                    //     typeSelector: config.typeSelector,
                    //     nameSelector: p => path.basename(p).replace(/\./gi, "_"),
                    //     groupSelector: p => "preload"
                    // }),
                    new ExmlPlugin('debug'), // 非 EUI 项目关闭此设置
                    // new IncrementCompilePlugin(),
                    new WebpackDevServerPlugin({
                        libraryType : "debug",
                        defines     : { DEBUG: true, RELEASE: false },
                        typescript  : { mode: "modern" },
                    }),
                ]
            };
        }
        else if (command == 'publish') {
            const outputDir = `bin-release/web/${version}`;
            return {
                outputDir,
                commands: [
                    new CustomPlugin(),
                    // new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } }),
                    new WebpackBundlePlugin({
                        libraryType : "release",
                        defines     : { DEBUG: false, RELEASE: true },
                        typescript  : { mode: "modern" },
                    }),
                    new ExmlPlugin('commonjs'), // 非 EUI 项目关闭此设置
                    new UglifyPlugin([{
                        sources: ["main.js"],
                        target: "main.min.js"
                    }]),
                    new RenamePlugin({
                        verbose: true, hash: 'crc32', matchers: [
                            { from: "**/*.js", to: "[path][name]_[hash].[ext]" }
                        ]
                    }),
                    new ManifestPlugin({ output: "manifest.json" })
                ]
            };
        }
        else {
            throw `unknown command : ${params.command}`;
        }
    },

    mergeSelector: (p) => {
        if (p.indexOf("assets/bitmap/") >= 0) {
            return "assets/bitmap/sheet.sheet";
        }
        else if (p.indexOf("armature") >= 0 && p.indexOf(".json") >= 0) {
            return "assets/armature/1.zip";
        }
    },

    typeSelector: (p) => {
        const ext = p.substr(p.lastIndexOf(".") + 1);
        const typeMap = {
            "jpg": "image",
            "png": "image",
            "webp": "image",
            "json": "json",
            "fnt": "font",
            "pvr": "pvr",
            "mp3": "sound",
            "zip": "zip",
            "sheet": "sheet",
            "exml": "text"
        };
        let type = typeMap[ext];
        if (type == "json") {
            if (p.indexOf("sheet") >= 0) {
                type = "sheet";
            } else if (p.indexOf("movieclip") >= 0) {
                type = "movieclip";
            }
        }
        return type;
    }
};


export = config;
