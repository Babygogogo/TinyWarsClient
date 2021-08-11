
import Logger from "../helpers/Logger";

namespace ResAutoRelease {
    const RELEASE_INTERVAL  = window.CLIENT_VERSION === "DEVELOP" ? 3 : 30;
    const NO_RELEASE_DICT   : { [path: string]: boolean } = {
        // "resource/assets/texture/unit/v1_unit.png"  : true,
    };

    interface MyBitmapData extends egret.BitmapData {
        _url_   : string;
    }
    type ReleaseData = {
        time        : number;
        bitmapData  : MyBitmapData;
        callback    : (data: MyBitmapData) => void;
    };

    let _releaseTime    = 0;
    const _releaseDict  : { [key:string]: ReleaseData } = {};

    export function startAutoRelease(): void {
        const getResByUrl = RES.getResByUrl;
        // @ts-ignore
        window["RES"].getResByUrl = function(url, compFunc: RES.GetResAsyncCallback, thisObject, type) {
            const src = url;
            if ((url)                                               &&
                (!RES.hasRes(url))                                  &&
                (url.indexOf("resource/") == 0)                     &&
                ((url.includes(".png")) || (url.includes(".jpg")))
            ) {
                const key       = url.substr(url.lastIndexOf("/")+1).replace(".", "_");
                const config    = (RES as any)["config"];
                const r         = config.getResource(key);
                if ((!r) || (!url.includes(r.url))) {
                    config.addResourceData({
                        name    : url,
                        root    : "resource/",
                        url     : url.substr(9),
                        type    : RES.ResourceItem.TYPE_IMAGE,
                    });
                } else {
                    url = key;
                }
            }
            if (RES.hasRes(url)) {
                return RES.getResAsync(url, (data)=>{compFunc && compFunc.call(thisObject, data, src);}, thisObject);
            } else {
                return getResByUrl.call(RES, url, compFunc, thisObject, type);
            }
        };

        // _releaseTime = new Date().getTime();
        // const timer = new egret.Timer(3000);
        // timer.addEventListener(egret.TimerEvent.TIMER, updateDelayRelease, ResAutoRelease);
        // timer.start();

        // // const EgretArmatureDisplay  = dragonBones.EgretArmatureDisplay.prototype
        // // const onAddToStageSke       = EgretArmatureDisplay.$onAddToStage
        // // EgretArmatureDisplay.$onAddToStage = function (stage: egret.Stage, nestLevel: number) {
        // //     onAddToStageSke.call(this, stage, nestLevel);

        // //     const datas: egret.sys.BitmapNode[] = this.$renderNode.drawData;
        // //     BitmapData.$addDisplayObject(this, datas && datas[0].image);
        // // }

        // // const onRemoveFromStageSke = EgretArmatureDisplay.$onRemoveFromStage;
        // // EgretArmatureDisplay.$onRemoveFromStage = function() {
        // //     onRemoveFromStageSke.call(this);

        // //     const datas: egret.sys.BitmapNode[] = this.$renderNode.drawData;
        // //     BitmapData.$removeDisplayObject(this, datas && datas[0].image);
        // // }

        // // @ts-ignore
        // interface MyMovieClip extends egret.MovieClip {
        //     _image_     : egret.BitmapData | null;
        // }
        // const MovieClip         = egret.MovieClip.prototype as MyMovieClip;
        // const onAddToStageMC    = MovieClip.$onAddToStage;
        // MovieClip.$onAddToStage = function (stage: egret.Stage, nestLevel: number) {
        //     onAddToStageMC.call(this, stage, nestLevel);

        //     this._image_ && BitmapData.$removeDisplayObject(this, this._image_);
        //     this._image_ = this.$texture && this.$texture.$bitmapData;
        //     this._image_ && BitmapData.$addDisplayObject(this, this._image_);
        // };

        // const onRemoveFromStageMC = MovieClip.$onRemoveFromStage;
        // MovieClip.$onRemoveFromStage = function() {
        //     onRemoveFromStageMC.call(this);

        //     this._image_ && BitmapData.$removeDisplayObject(this, this._image_);
        //     this._image_ = null;
        // };

        // const setMovieClipData = MovieClip["setMovieClipData"];
        // MovieClip["setMovieClipData"] = function(value: egret.MovieClipData) {
        //     if (this.$movieClipData == value) {
        //         return;
        //     }

        //     setMovieClipData.call(this, value);
        //     this._image_ && BitmapData.$removeDisplayObject(this, this._image_);
        //     this._image_ = this.$stage && this.$texture && this.$texture.$bitmapData;
        //     this._image_ && BitmapData.$addDisplayObject(this, this._image_);
        // };

        // interface MyImageLoader extends egret.ImageLoader {
        //     _url_           : string;
        //     onImageComplete : (e: egret.Event) => void;
        // }
        // const ImageLoader   = egret.ImageLoader.prototype as MyImageLoader;
        // const load          = ImageLoader.load;
        // ImageLoader.load    = function (url: string) {
        //     load.call(this, url);
        //     const index = url.indexOf("?");
        //     this._url_  = index < 0 ? url : url.substr(0, index);
        // };

        // const onImageComplete       = ImageLoader.onImageComplete;
        // ImageLoader.onImageComplete = function (event: egret.Event) {
        //     onImageComplete.call(this, event);
        //     (this.data as MyBitmapData)._url_ = this._url_;
        // };

        // function loadBitmapData(url: string, succeed: (t: egret.BitmapData) => egret.Texture | void, loadNum = 3) {
        //     if (!url) {
        //         return Logger.error("纹理复用错误!");
        //     }

        //     const r = {
        //         name    : url,
        //         url     : url,
        //         type    : RES.ResourceItem.TYPE_IMAGE,
        //         root    : "",
        //         extra   : 1,
        //         _image_ : true,
        //     };
        //     return (RES as any).queue.pushResItem(r).then(
        //         function (value: egret.Texture) {
        //             return succeed(value && value.bitmapData) || value;
        //         },
        //         (error: any) => {
        //             // @ts-ignore
        //             (RES.ResourceEvent as any)["dispatchResourceEvent"](this, RES.ResourceEvent.ITEM_LOAD_ERROR, "", r);
        //             if (loadNum > 0) {
        //                 setTimeout(() => {
        //                     loadBitmapData(url, succeed, loadNum - 1);
        //                 }, 100);
        //             }
        //             return Promise.reject(error);
        //         }
        //     );
        // }

        // const ResourceLoader    = RES.ResourceLoader.prototype;
        // const loadResource      = ResourceLoader["loadResource"];
        // ResourceLoader["loadResource"] = function (r, p) {
        //     if (r["_image_"]) {
        //         const t = (RES.processor as any)["isSupport"](r);
        //         if (t) {
        //             return t.onLoadStart((RES as any)["host"], r);
        //         }
        //     }

        //     return loadResource.call(this, r, p);
        // };

        // const save = (RES as any)["host"].save;
        // (RES as any)["host"].save = function (resource: any, data: any) {
        //     !resource["_image_"] && save.call(this, resource, data);
        // };

        // const BitmapData = egret.BitmapData;
        // BitmapData.$addDisplayObject = function (displayObject: egret.DisplayObject, bitmapData: MyBitmapData) {
        //     const hashCode = bitmapData && bitmapData.hashCode;
        //     if(!hashCode) {
        //         return;
        //     }

        //     let tempList: egret.DisplayObject[] = BitmapData["_displayList"][hashCode];
        //     if (!tempList) {
        //         tempList = BitmapData["_displayList"][hashCode] = [];
        //     }
        //     if (tempList.indexOf(displayObject) >= 0) {
        //         return;
        //     }

        //     tempList.push(displayObject);
        //     if ((!popDelayRelease(hashCode))    &&
        //         (!bitmapData.format)            &&
        //         (tempList.length == 1)
        //     ) {
        //         loadBitmapData(bitmapData._url_, (data: egret.BitmapData) => {
        //             bitmapData.source = data.source;
        //             bitmapData.format = data.format;

        //             for (const display of (BitmapData["_displayList"][hashCode] || [])) {
        //                 display.$renderDirty = true;

        //                 const p = display.$parent;
        //                 if (p && !p.$cacheDirty) {
        //                     p.$cacheDirty = true;
        //                     p.$cacheDirtyUp();
        //                 }

        //                 const maskedObject = display.$maskedObject;
        //                 if (maskedObject && !maskedObject.$cacheDirty) {
        //                     maskedObject.$cacheDirty = true;
        //                     maskedObject.$cacheDirtyUp();
        //                 }
        //             }
        //         });
        //     } else if (!bitmapData.format) {
        //         bitmapData.format = "image";
        //     }
        // };

        // BitmapData.$removeDisplayObject = function (displayObject: egret.DisplayObject, bitmapData: MyBitmapData) {
        //     const hashCode: number = bitmapData && bitmapData.hashCode;
        //     if (!hashCode) {
        //         return;
        //     }

        //     const tempList: egret.DisplayObject[] = BitmapData["_displayList"][hashCode];
        //     if (!tempList) {
        //         return;
        //     }

        //     const index = tempList.indexOf(displayObject);
        //     if (index < 0) {
        //         return;
        //     }

        //     tempList.splice(index, 1);
        //     if (tempList.length) {
        //         return;
        //     }

        //     if (!bitmapData._url_) {
        //         return;
        //     }

        //     if (NO_RELEASE_DICT[bitmapData._url_]) {
        //         return;
        //     }

        //     addDelayRelease(bitmapData.hashCode, bitmapData, () => {
        //         if (bitmapData.format) {
        //             bitmapData.$dispose();
        //             bitmapData.format = "";
        //         }
        //     });
        // };
    }

    function addDelayRelease(key: string | number, data: MyBitmapData, finish: () => void, delay?: number) {
        _releaseDict[key] = {
            time        : delay || RELEASE_INTERVAL,
            bitmapData  : data,
            callback    : finish
        };
    }
    function popDelayRelease(key: string | number): MyBitmapData {
        const data = _releaseDict[key];
        data && (delete _releaseDict[key]);
        return data && data.bitmapData;
    }
    function updateDelayRelease(): void {
        const lastTime = _releaseTime;
        _releaseTime = new Date().getTime();
        const interval = (_releaseTime - lastTime) * 0.001;

        const dict = _releaseDict;
        for (const name in dict) {
            const data = dict[name];
            data.time -= interval;
            if (data.time <= 0) {
                delete dict[name];
                data.callback && data.callback(data.bitmapData);
            }
        }
    }
}

export default ResAutoRelease;
