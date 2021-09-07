
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import WarMapModel              from "../../warMap/model/WarMapModel";
import MeModel                  from "../model/MeModel";

namespace TwnsMeImportPanel {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;

    export class MeImportPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeImportPanel;

        private readonly _group!        : eui.Group;
        private readonly _listMap!      : TwnsUiScrollList.UiScrollList<DataForMapRenderer>;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;

        public static show(): void {
            if (!MeImportPanel._instance) {
                MeImportPanel._instance = new MeImportPanel();
            }
            MeImportPanel._instance.open();
        }
        public static async hide(): Promise<void> {
            if (MeImportPanel._instance) {
                await MeImportPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
        }

        private async _createDataForListMap(): Promise<DataForMapRenderer[]> {
            const dataList: DataForMapRenderer[] = [];
            for (const [mapFileName] of WarMapModel.getBriefDataDict()) {
                dataList.push({
                    mapId: mapFileName,
                    mapName     : await WarMapModel.getMapNameInCurrentLanguage(mapFileName).catch(err => { CompatibilityHelpers.showError(err); throw err; }) ?? CommonConstants.ErrorTextForUndefined,
                    panel       : this,
                });
            }
            return dataList.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _updateListMap(): Promise<void> {
            this._listMap.bindData(await this._createDataForListMap().catch(err => { CompatibilityHelpers.showError(err); throw err; }));
            this._listMap.scrollVerticalTo(0);
        }
    }

    type DataForMapRenderer = {
        mapId   : number;
        mapName : string;
        panel   : MeImportPanel;
    };
    class MapRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this._getData();
            this._labelName.text    = data.mapName;
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0095) + `\n"${data.mapName}"`,
                callback: async () => {
                    const war = Helpers.getExisted(MeModel.getWar());
                    war.stopRunning();
                    await war.initWithMapEditorData({
                        mapRawData  : await WarMapModel.getRawData(data.mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }),
                        slotIndex   : war.getMapSlotIndex(),
                    }).catch(err => { CompatibilityHelpers.showError(err); throw err; });
                    war.setIsMapModified(true);
                    war.startRunning()
                        .startRunningView();

                    data.panel.close();
                },
            });
        }
    }
}

export default TwnsMeImportPanel;
