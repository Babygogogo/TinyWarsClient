
namespace Utility {
    export namespace MapManager {
        const ONLINE_MAPS = [
            "三河谷",
            "世界大战",
            "保持微笑",
            "催眠",
            "八阵图贰",
            "副舞台",
            "勇者史诗",
            "危机四伏",
            "囚笼拘束",
            "四通八达",
            "回声岛",
            "回浪屿",
            "地下水",
            "地标",
            "多岩平原",
            "天壑",
            "对抗赵天同",
            "将棋",
            "小国争霸赛",
            "局外人",
            "干涸之境",
            "废墟",
            "悲终",
            "戈壁滩",
            "扬帆远航",
            "插座山脉",
            "斯潘岛",
            "无上之爱",
            "无光的舞台",
            "暴风眼",
            "正正方方",
            "水星要塞",
            "海岸突击",
            "深色烟草战争",
            "淹没",
            "满手血腥",
            "炼狱圣坛",
            "王牌空军",
            "离子太平洋",
            "背叛",
            "英雄泪",
            "贪心湾",
            "迷踪港",
            "选择",
            "避风港",
            "防爆屏障",
            "阻击赵天同",
            "陨石群",
            "零",
            "风暴前线",
            "高拉米加",
            "黑森林"
        ];

        export function getAllMapNames(): string[] {
            return ONLINE_MAPS;
        }

        export function getMapData(mapName: string, callback: (data: Types.TemplateMap, url: string) => void): any {
            return RES.getResByUrl("resource/assets/map/" + mapName + ".json", callback, undefined, RES.ResourceItem.TYPE_JSON);
        }
    }
}
