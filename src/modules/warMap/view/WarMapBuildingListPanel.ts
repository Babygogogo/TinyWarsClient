
import { TwnsUiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }                 from "../../../utility/ui/UiScrollList";
import { MeTileSimpleView }             from "../../mapEditor/view/MeTileSimpleView";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";

type OpenDataForBuildingListPanel = {
    configVersion           : string;
    tileDataArray           : ProtoTypes.WarSerialization.ISerialTile[];
    playersCountUnneutral   : number;
};

export class WarMapBuildingListPanel extends TwnsUiPanel.UiPanel<OpenDataForBuildingListPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: WarMapBuildingListPanel;

    private readonly _labelTitle    : TwnsUiLabel.UiLabel;
    private readonly _listTile      : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;

    public static show(openData: OpenDataForBuildingListPanel): void {
        if (!WarMapBuildingListPanel._instance) {
            WarMapBuildingListPanel._instance = new WarMapBuildingListPanel();
        }
        WarMapBuildingListPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WarMapBuildingListPanel._instance) {
            await WarMapBuildingListPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/warMap/WarMapBuildingListPanel.exml";
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._listTile.setItemRenderer(TileRenderer);

        this._updateComponentsForLanguage();
        this._updateListTile();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text = Lang.getText(LangTextType.B0333);
    }

    private _updateListTile(): void {
        const openData      = this._getOpenData();
        const configVersion = openData.configVersion;
        const dict          = new Map<number, Map<number, number>>();
        for (const tileData of openData.tileDataArray || []) {
            const template = ConfigManager.getTileTemplateCfg(configVersion, Types.TileBaseType.Plain, tileData.objectType);
            if ((template) && (template.maxCapturePoint != null)) {
                const tileType = template.type;
                if (!dict.has(tileType)) {
                    dict.set(tileType, new Map<number, number>());
                }

                const playerIndex   = tileData.playerIndex;
                const subDict       = dict.get(tileType);
                subDict.set(playerIndex, (subDict.get(playerIndex) || 0) + 1);
            }
        }

        const dataList: DataForTileRenderer[] = [];
        for (const [tileType, subDict] of dict) {
            dataList.push({
                configVersion,
                maxPlayerIndex  : openData.playersCountUnneutral,
                tileType,
                dict            : subDict,
            });
        }
        this._listTile.bindData(dataList);
    }
}

type DataForTileRenderer = {
    configVersion   : string;
    maxPlayerIndex  : number;
    tileType        : Types.TileType;
    dict            : Map<number, number>;
};
class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
    private _group          : eui.Group;
    private _conTileView    : eui.Group;
    private _labelNum0      : TwnsUiLabel.UiLabel;
    private _labelNum1      : TwnsUiLabel.UiLabel;
    private _labelNum2      : TwnsUiLabel.UiLabel;
    private _labelNum3      : TwnsUiLabel.UiLabel;
    private _labelNum4      : TwnsUiLabel.UiLabel;
    private _labelTotalNum  : TwnsUiLabel.UiLabel;

    private _tileView       = new MeTileSimpleView();

    private _labelNumList   : TwnsUiLabel.UiLabel[];

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
        ]);

        const tileView = this._tileView;
        this._conTileView.addChild(tileView.getImgBase());
        this._conTileView.addChild(tileView.getImgObject());
        tileView.startRunningView();

        this._labelNumList = [
            this._labelNum0,
            this._labelNum1,
            this._labelNum2,
            this._labelNum3,
            this._labelNum4,
        ];
    }

    private _onNotifyTileAnimationTick(e: egret.Event): void {
        this._tileView.updateOnAnimationTick();
    }

    protected _onDataChanged(): void {
        const data              = this.data;
        const dict              = data.dict;
        const maxPlayerIndex    = data.maxPlayerIndex;
        let totalNum            = 0;
        for (let playerIndex = CommonConstants.WarNeutralPlayerIndex; playerIndex <= CommonConstants.WarMaxPlayerIndex; ++playerIndex) {
            const num                               = dict.get(playerIndex) || 0;
            totalNum                                += num;
            this._labelNumList[playerIndex].text    = playerIndex <= maxPlayerIndex ? `${num}` : `--`;
        }
        this._labelTotalNum.text = `${totalNum}`;

        const tileObjectType = ConfigManager.getTileObjectTypeByTileType(data.tileType);
        this._tileView.init({
            tileBaseType        : null,
            tileBaseShapeId     : null,
            tileObjectType      : tileObjectType,
            tileObjectShapeId   : 0,
            playerIndex         : tileObjectType === Types.TileObjectType.Headquarters
                ? CommonConstants.WarFirstPlayerIndex
                : CommonConstants.WarNeutralPlayerIndex,
        });
        this._tileView.updateView();
    }
}
