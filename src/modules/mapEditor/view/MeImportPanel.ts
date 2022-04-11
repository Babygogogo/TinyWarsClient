
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarMapModel              from "../../warMap/model/WarMapModel";
// import MeModel                  from "../model/MeModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMeImportPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;

    export type OpenData = void;
    export class MeImportPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _group!        : eui.Group;
        private readonly _listMap!      : TwnsUiScrollList.UiScrollList<DataForMapRenderer>;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listMap.setItemRenderer(MapRenderer);
            this._listMap.setScrollPolicyH(eui.ScrollPolicy.OFF);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this._updateListMap();
        }
        protected _onClosing(): void {
            // nothing to do
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
            const dataArray     : DataForMapRenderer[] = [];
            const promiseArray  : Promise<void>[] = [];
            for (const mapId of WarMapModel.getEnabledMapIdArray()) {
                promiseArray.push((async () => {
                    const mapBriefData = await WarMapModel.getBriefData(mapId);
                    if (mapBriefData == null) {
                        return;
                    }

                    if (mapBriefData.mapExtraData?.isEnabled) {
                        dataArray.push({
                            mapId,
                            mapName     : await WarMapModel.getMapNameInCurrentLanguage(mapId) ?? CommonConstants.ErrorTextForUndefined,
                            panel       : this,
                        });
                    }
                })());
            }

            await Promise.all(promiseArray);
            return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
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
    class MapRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            const data              = this._getData();
            this._labelName.text    = `#${data.mapId} ${data.mapName}`;
        }

        public onItemTapEvent(): void {
            const data  = this._getData();
            const mapId = data.mapId;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0095) + `\n#${mapId} ${data.mapName}`,
                callback: async () => {
                    const war = Helpers.getExisted(MeModel.getWar());
                    war.stopRunning();
                    await war.initWithMapEditorData(
                        {
                            mapRawData  : await WarMapModel.getRawData(mapId),
                            slotIndex   : war.getMapSlotIndex(),
                        },
                        await Twns.Config.ConfigManager.getLatestGameConfig()
                    );
                    war.setIsMapModified(true);
                    war.startRunning()
                        .startRunningView();

                    data.panel.close();
                },
            });
        }
    }
}

// export default TwnsMeImportPanel;
