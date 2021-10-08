/// 阅读 api.d.ts 查看文档
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
///<reference path="api.d.ts"/>

import * as path from 'path';
import { UglifyPlugin, IncrementCompilePlugin, CompilePlugin, ManifestPlugin, ExmlPlugin, EmitResConfigFilePlugin, TextureMergerPlugin, RenamePlugin, StartServerPlugin } from 'built-in';
import { CustomPlugin } from './myplugin';
import { EuiCompilerPlugin } from './plugins/eui-compiler-plugin';
import { WebpackDevServerPlugin, WebpackBundlePlugin } from './plugins/webpack-plugin';

const USE_OLD_COMPILER = true;

const config: ResourceManagerConfig = {

    buildConfig: (params) => {
        const { target, command, projectName, version } = params;

        if (command == 'build') {
            const outputDir = 'bin-debug';
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
                    // new EuiCompilerPlugin(),//新的 eui 编译器

                    USE_OLD_COMPILER
                        ? new IncrementCompilePlugin()
                        : new WebpackBundlePlugin({ //新的 Webpack 编译器
                            libraryType: "debug",
                            defines: { DEBUG: true, RELEASE: false },
                            typescript: { mode: 'legacy' },
                            html: {
                                templateFilePath: "template/web/index.html"
                            }
                        }),

                    new ManifestPlugin({ output: "manifest.json" })
                ]
            };
        }
        else if (command == 'publish') {
            const outputDir = `bin-release/web/${version}`;
            return {
                outputDir,
                commands: [
                    new CustomPlugin(),

                    USE_OLD_COMPILER
                        ? new CompilePlugin({ libraryType: "release", defines: { DEBUG: false, RELEASE: true } })
                        : new WebpackBundlePlugin({ //新的 Webpack 编译器
                            libraryType: "release",
                            defines: { DEBUG: false, RELEASE: true },
                            typescript: { mode: 'legacy' },
                            html: {
                                templateFilePath: "template/web/index.html"
                            },
                        }),

                    new ExmlPlugin('commonjs2'), // 非 EUI 项目关闭此设置
                    // new EuiCompilerPlugin(),//新的 eui 编译器
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
        else if (command == 'run') {
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
                    // new EuiCompilerPlugin(),//新的 eui 编译器

                    USE_OLD_COMPILER
                        ? new IncrementCompilePlugin()
                        : new WebpackDevServerPlugin({ //新的 Webpack 编译器
                            libraryType: "debug",
                            defines: { DEBUG: true, RELEASE: false },
                            typescript: { mode: 'legacy' },
                            html: {
                                templateFilePath: "template/web/index.html"
                            },
                            open: true
                        }),
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
