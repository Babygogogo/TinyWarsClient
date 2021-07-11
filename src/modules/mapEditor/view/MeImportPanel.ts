
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as Types                       from "../../../utility/Types";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as MeModel                     from "../model/MeModel";

export class MeImportPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeImportPanel;

    private _group      : eui.Group;
    private _listMap    : UiScrollList<DataForMapRenderer>;
    private _btnCancel  : UiButton;

    public static show(): void {
        if (!MeImportPanel._instance) {
            MeImportPanel._instance = new MeImportPanel();
        }
        MeImportPanel._instance.open(undefined);
    }
    public static async hide(): Promise<void> {
        if (MeImportPanel._instance) {
            await MeImportPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/mapEditor/MeImportPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,  callback: this.close },
        ]);
        this._listMap.setItemRenderer(MapRenderer);
        this._listMap.setScrollPolicyH(eui.ScrollPolicy.OFF);

        this._updateComponentsForLanguage();

        this._updateListMap();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
    }

    private async _createDataForListMap(): Promise<DataForMapRenderer[]> {
        const dataList: DataForMapRenderer[] = [];
        for (const [mapFileName] of WarMapModel.getBriefDataDict()) {
            dataList.push({
                mapId: mapFileName,
                mapName     : await WarMapModel.getMapNameInCurrentLanguage(mapFileName),
                panel       : this,
            });
        }
        return dataList.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
    }

    private async _updateListMap(): Promise<void> {
        this._listMap.bindData(await this._createDataForListMap());
        this._listMap.scrollVerticalTo(0);
    }
}

type DataForMapRenderer = {
    mapId   : number;
    mapName : string;
    panel   : MeImportPanel;
};
class MapRenderer extends UiListItemRenderer<DataForMapRenderer> {
    private _group          : eui.Group;
    private _labelName      : UiLabel;

    protected _onDataChanged(): void {
        const data              = this.data;
        this._labelName.text    = data.mapName;
    }

    public onItemTapEvent(): void {
        const data = this.data;
        CommonConfirmPanel.show({
            content : Lang.getText(Lang.Type.A0095) + `\n"${data.mapName}"`,
            callback: async () => {
                const war = MeModel.getWar();
                war.stopRunning();
                await war.initWithMapEditorData({
                    mapRawData  : await WarMapModel.getRawData(data.mapId),
                    slotIndex   : war.getMapSlotIndex(),
                });
                war.setIsMapModified(true);
                war.startRunning()
                    .startRunningView();

                data.panel.close();
            },
        });
    }
}
