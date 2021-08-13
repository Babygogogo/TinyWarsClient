
import TwnsBwUnit                   from "../../baseWar/model/BwUnit";
import TwnsBwUnitView               from "../../baseWar/view/BwUnitView";
import TwnsChatPanel                from "../../chat/view/ChatPanel";
import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
import TwnsCommonInputPanel         from "../../common/view/CommonInputPanel";
import TwnsMmAcceptMapPanel         from "../../mapManagement/view/MmAcceptMapPanel";
import TwnsMmRejectMapPanel         from "../../mapManagement/view/MmRejectMapPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import FloatText                    from "../../tools/helpers/FloatText";
import FlowManager                  from "../../tools/helpers/FlowManager";
import Logger                       from "../../tools/helpers/Logger";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import TwnsUserSettingsPanel        from "../../user/view/UserSettingsPanel";
import TwnsWeEventListPanel         from "../../warEvent/view/WeEventListPanel";
import TwnsMeDrawer                 from "../model/MeDrawer";
import MeMfwModel                   from "../model/MeMfwModel";
import MeModel                      from "../model/MeModel";
import MeSimModel                   from "../model/MeSimModel";
import MeUtility                    from "../model/MeUtility";
import TwnsMeWar                    from "../model/MeWar";
import TwnsMeChooseUnitPanel        from "./MeChooseUnitPanel";
import TwnsMeClearPanel             from "./MeClearPanel";
import TwnsMeConfirmSaveMapPanel    from "./MeConfirmSaveMapPanel";
import TwnsMeImportPanel            from "./MeImportPanel";
import TwnsMeMapTagPanel            from "./MeMapTagPanel";
import TwnsMeMfwSettingsPanel       from "./MeMfwSettingsPanel";
import TwnsMeModifyMapNamePanel     from "./MeModifyMapNamePanel";
import TwnsMeOffsetPanel            from "./MeOffsetPanel";
import TwnsMeResizePanel            from "./MeResizePanel";
import TwnsMeSimSettingsPanel       from "./MeSimSettingsPanel";
import TwnsMeTileSimpleView         from "./MeTileSimpleView";
import TwnsMeWarRulePanel           from "./MeWarRulePanel";

namespace TwnsMeWarMenuPanel {
    import CommonConfirmPanel       = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import CommonInputPanel         = TwnsCommonInputPanel.CommonInputPanel;
    import UserSettingsPanel        = TwnsUserSettingsPanel.UserSettingsPanel;
    import BwUnitView               = TwnsBwUnitView.BwUnitView;
    import DataForDrawUnit          = TwnsMeDrawer.DataForDrawUnit;
    import MeWar                    = TwnsMeWar.MeWar;
    import MeModifyMapNamePanel     = TwnsMeModifyMapNamePanel.MeModifyMapNamePanel;
    import MeResizePanel            = TwnsMeResizePanel.MeResizePanel;
    import MeConfirmSaveMapPanel    = TwnsMeConfirmSaveMapPanel.MeConfirmSaveMapPanel;
    import MeWarRulePanel           = TwnsMeWarRulePanel.MeWarRulePanel;
    import MeChooseUnitPanel        = TwnsMeChooseUnitPanel.MeChooseUnitPanel;
    import MeMapTagPanel            = TwnsMeMapTagPanel.MeMapTagPanel;
    import MeSimSettingsPanel       = TwnsMeSimSettingsPanel.MeSimSettingsPanel;
    import MeClearPanel             = TwnsMeClearPanel.MeClearPanel;
    import MeImportPanel            = TwnsMeImportPanel.MeImportPanel;
    import MeMfwSettingsPanel       = TwnsMeMfwSettingsPanel.MeMfwSettingsPanel;
    import MeOffsetPanel            = TwnsMeOffsetPanel.MeOffsetPanel;
    import WeEventListPanel         = TwnsWeEventListPanel.WeEventListPanel;
    import MmAcceptMapPanel         = TwnsMmAcceptMapPanel.MmAcceptMapPanel;
    import MmRejectMapPanel         = TwnsMmRejectMapPanel.MmRejectMapPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import UnitType                 = Types.UnitType;
    import TileBaseType             = Types.TileBaseType;
    import TileObjectType           = Types.TileObjectType;
    import LangTextType             = TwnsLangTextType.LangTextType;

    // eslint-disable-next-line no-shadow
    enum TwnsMeWarMenuType {
        Main,
        Advanced,
    }

    export class MeWarMenuPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWarMenuPanel;

        private _group                  : eui.Group;
        private _listCommand            : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;
        private _labelNoCommand         : TwnsUiLabel.UiLabel;
        private _btnBack                : TwnsUiButton.UiButton;
        private _labelMenuTitle         : TwnsUiLabel.UiLabel;
        private _labelMapInfoTitle      : TwnsUiLabel.UiLabel;

        private _btnModifyMapName       : TwnsUiButton.UiButton;
        private _labelMapName           : TwnsUiLabel.UiLabel;

        private _btnModifyMapDesigner   : TwnsUiButton.UiButton;
        private _labelMapDesigner       : TwnsUiLabel.UiLabel;

        private _btnModifyMapSize       : TwnsUiButton.UiButton;
        private _labelMapSize           : TwnsUiLabel.UiLabel;

        private _listTile               : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;
        private _listUnit               : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;

        private _war            : MeWar;
        private _dataForList    : DataForCommandRenderer[];
        private _menuType       = TwnsMeWarMenuType.Main;

        public static show(): void {
            if (!MeWarMenuPanel._instance) {
                MeWarMenuPanel._instance = new MeWarMenuPanel();
            }
            MeWarMenuPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MeWarMenuPanel._instance) {
                await MeWarMenuPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = MeWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this.skinName = `resource/skins/mapEditor/MeWarMenuPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MeMapNameChanged,                   callback: this._onNotifyMeMapNameChanged },
                { type: NotifyType.MsgMeSubmitMap,                     callback: this._onMsgMeSubmitMap },
                { type: NotifyType.MsgMmReviewMap,                     callback: this._onMsgMmReviewMap },
                { type: NotifyType.MsgSpmCreateSfw,                    callback: this._onMsgSpmCreateSfw },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,                callback: this._onTouchedBtnBack },
                { ui: this._btnModifyMapDesigner,   callback: this._onTouchedBtnModifyMapDesigner },
                { ui: this._btnModifyMapName,       callback: this._onTouchedBtnModifyMapName },
                { ui: this._btnModifyMapSize,       callback: this._onTouchedBtnModifyMapSize },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listTile.setItemRenderer(TileRenderer);
            this._listUnit.setItemRenderer(UnitRenderer);

            const war           = MeModel.getWar();
            this._war           = war;
            this._menuType      = TwnsMeWarMenuType.Main;

            this._updateView();

            Notify.dispatch(NotifyType.BwWarMenuPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            this._war           = null;
            this._dataForList   = null;

            Notify.dispatch(NotifyType.BwWarMenuPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onMsgMeSubmitMap(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMeSubmitMap.IS;
            if (data.mapRawDataErrorCode) {
                FloatText.show(Lang.getText(LangTextType.A0197));
                FloatText.show(Lang.getErrorText(data.mapRawDataErrorCode));
            } else {
                FloatText.show(Lang.getText(LangTextType.A0085));
            }
            this._war.setIsMapModified(false);
        }

        private _onMsgMmReviewMap(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMmReviewMap.IS;
            if (data.isAccept) {
                FloatText.show(Lang.getText(LangTextType.A0092));
            } else {
                FloatText.show(Lang.getText(LangTextType.A0093));
            }
            FlowManager.gotoLobby();
        }

        private _onMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
            CommonConfirmPanel.show({
                content : Lang.getText(LangTextType.A0107),
                callback: () => {
                    FlowManager.gotoSinglePlayerWar({
                        slotIndex       : data.slotIndex,
                        slotExtraData   : data.extraData,
                        warData         : data.warData,
                    });
                },
            });
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyUnitAndTileTextureVersionChanged(): void {
            this._updateView();
        }

        private _onNotifyMeMapNameChanged(): void {
            this._updateLabelMapName();
        }

        private _onTouchedBtnBack(): void {
            const type = this._menuType;
            if (type === TwnsMeWarMenuType.Main) {
                this.close();
            } else if (type === TwnsMeWarMenuType.Advanced) {
                this._menuType = TwnsMeWarMenuType.Main;
                this._updateListCommand();
            } else {
                Logger.error(`McwWarMenuPanel._onTouchedBtnBack() invalid this._menuType: ${type}`);
                this.close();
            }
        }

        private _onTouchedBtnModifyMapName(): void {
            const war = this._war;
            if (!war.getIsReviewingMap()) {
                MeModifyMapNamePanel.show();
            }
        }

        private _onTouchedBtnModifyMapSize(): void {
            if (!this._war.getIsReviewingMap()) {
                MeResizePanel.show();
            }
        }

        private _onTouchedBtnModifyMapDesigner(): void {
            const war = this._war;
            if (!war.getIsReviewingMap()) {
                CommonInputPanel.show({
                    title           : Lang.getText(LangTextType.B0163),
                    tips            : null,
                    currentValue    : war.getMapDesignerName(),
                    maxChars        : CommonConstants.MapMaxDesignerLength,
                    charRestrict    : null,
                    callback        : (panel) => {
                        war.setMapDesignerName(panel.getInputText());
                        this._updateGroupMapDesigner();
                    },
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            const isReviewing       = this._war.getIsReviewingMap();
            const colorForButtons   = isReviewing ? 0xFFFFFF : 0x00FF00;
            this._btnBack.setTextColor(0x00FF00);
            this._btnModifyMapDesigner.setTextColor(colorForButtons);
            this._btnModifyMapName.setTextColor(colorForButtons);
            this._btnModifyMapSize.setTextColor(colorForButtons);

            this._updateListCommand();
            this._updateLabelMapName();
            this._updateGroupMapDesigner();
            this._updateGroupMapSize();
            this._updateListTile();
            this._updateListUnit();
        }

        private _updateListCommand(): void {
            this._dataForList = this._createDataForList();
            if (!this._dataForList.length) {
                this._labelNoCommand.visible = true;
                this._listCommand.clear();
            } else {
                this._labelNoCommand.visible = false;
                this._listCommand.bindData(this._dataForList);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text                   = Lang.getText(LangTextType.B0155);
            this._labelMapInfoTitle.text                = Lang.getText(LangTextType.B0298);
            this._btnModifyMapName.label                = Lang.getText(LangTextType.B0225);
            this._btnModifyMapDesigner.label            = Lang.getText(LangTextType.B0163);
            this._btnModifyMapSize.label                = Lang.getText(LangTextType.B0300);
            this._btnBack.label                         = Lang.getText(LangTextType.B0146);
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = Lang.concatLanguageTextList(this._war.getMapNameArray());
        }

        private _updateGroupMapDesigner(): void {
            const war                   = this._war;
            this._labelMapDesigner.text = war.getMapDesignerName();
        }

        private _updateGroupMapSize(): void {
            const size              = this._war.getTileMap().getMapSize();
            this._labelMapSize.text = `${size.width} * ${size.height}`;
        }

        private _updateListTile(): void {
            const dictForTileBases      = new Map<TileBaseType, DataForTileRenderer>();
            const dictForTileObjects    = new Map<TileObjectType, DataForTileRenderer>();
            for (const tile of this._war.getTileMap().getAllTiles()) {
                const tileObjectType    = tile.getObjectType();
                const tileBaseType      = tile.getBaseType();
                const tileType          = tile.getType();
                const playerIndex       = tile.getPlayerIndex();

                if (tileObjectType == TileObjectType.Empty) {
                    if (dictForTileBases.has(tileBaseType)) {
                        ++dictForTileBases.get(tileBaseType).count;
                    } else {
                        dictForTileBases.set(tileBaseType, {
                            baseType    : tileBaseType,
                            objectType  : null,
                            count       : 1,
                            tileType,
                            playerIndex,
                        });
                    }
                } else {
                    if (dictForTileObjects.has(tileObjectType)) {
                        ++dictForTileObjects.get(tileObjectType).count;
                    } else {
                        dictForTileObjects.set(tileObjectType, {
                            baseType    : null,
                            objectType  : tileObjectType,
                            count       : 1,
                            tileType,
                            playerIndex,
                        });
                    }
                }
            }

            const dataList : DataForTileRenderer[] = [];
            for (const [, v] of dictForTileBases) {
                dataList.push(v);
            }
            for (const [, v] of dictForTileObjects) {
                dataList.push(v);
            }
            this._listTile.bindData(dataList.sort((v1, v2) => {
                if (v1.tileType !== v2.tileType) {
                    return v1.tileType - v2.tileType;
                } else {
                    return v1.playerIndex - v2.playerIndex;
                }
            }));
        }

        private _updateListUnit(): void {
            const dict = new Map<UnitType, Map<number, DataForUnitRenderer>>();
            for (const unit of this._war.getUnitMap().getAllUnits()) {
                const unitType = unit.getUnitType();
                if (!dict.has(unitType)) {
                    dict.set(unitType, new Map());
                }

                const subDict       = dict.get(unitType);
                const playerIndex   = unit.getPlayerIndex();
                if (subDict.has(playerIndex)) {
                    ++subDict.get(playerIndex).count;
                } else {
                    subDict.set(playerIndex, {
                        count           : 1,
                        dataForDrawUnit : {
                            unitType,
                            playerIndex,
                        },
                    });
                }
            }

            const dataList: DataForUnitRenderer[] = [];
            for (const [, subDict] of dict) {
                for (const [, v] of subDict) {
                    dataList.push(v);
                }
            }
            this._listUnit.bindData(dataList.sort((v1, v2) => {
                const d1 = v1.dataForDrawUnit;
                const d2 = v2.dataForDrawUnit;
                const p1 = d1.playerIndex;
                const p2 = d2.playerIndex;
                if (p1 !== p2) {
                    return p1 - p2;
                } else {
                    return d1.unitType - d2.unitType;
                }
            }));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Menu item data creators.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _createDataForList(): DataForCommandRenderer[] {
            const type = this._menuType;
            if (type === TwnsMeWarMenuType.Main) {
                return this._createDataForMainMenu();
            } else if (type === TwnsMeWarMenuType.Advanced) {
                return this._createDataForAdvancedMenu();
            } else {
                Logger.error(`McwWarMenuPanel._createDataForList() invalid this._menuType: ${type}`);
                return [];
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return [
                this._createCommandSubmitMap(),
                this._createCommandLoadMap(),
                this._createCommandWarRule(),
                this._createCommandWarEvent(),
                this._createCommandMapTag(),
                this._createCommandReviewAccept(),
                this._createCommandReviewReject(),
                this._createCommandOpenAdvancedMenu(),
                this._createCommandChat(),
                this._createCommandGotoMapListPanel(),
                this._createCommandGotoLobby(),
            ].filter(v => !!v);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return [
                this._createCommandSimulation(),
                this._createCommandCreateMfr(),
                this._createCommandUserSettings(),
                this._createCommandClear(),
                this._createCommandResize(),
                this._createCommandOffset(),
                this._createCommandImport(),
            ].filter(v => !!v);
        }

        private _createCommandOpenAdvancedMenu(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(LangTextType.B0080),
                callback: () => {
                    this._menuType = TwnsMeWarMenuType.Advanced;
                    this._updateListCommand();
                },
            };
        }

        private _createCommandSubmitMap(): DataForCommandRenderer | null {
            if (this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0287),
                    callback: () => {
                        MeConfirmSaveMapPanel.show();
                    },
                };
            }
        }

        private _createCommandLoadMap(): DataForCommandRenderer | null {
            const war = this._war;
            if (war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0288),
                    callback: () => {
                        CommonConfirmPanel.show({
                            content : Lang.getText(LangTextType.A0072),
                            callback: async () => {
                                const slotIndex = war.getMapSlotIndex();
                                const data      = MeModel.getData(slotIndex);
                                war.stopRunning();
                                await war.initWithMapEditorData({
                                    mapRawData: (data ? data.mapRawData : null) || await MeUtility.createDefaultMapRawData(slotIndex),
                                    slotIndex,
                                });
                                war.setIsMapModified(false);
                                war.startRunning()
                                    .startRunningView();
                                this.close();
                            },
                        });
                    },
                };
            }
        }

        private _createCommandWarRule(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0314),
                callback: () => {
                    const war = this._war;
                    if (!war.getIsReviewingMap()) {
                        MeWarRulePanel.show();
                        this.close();
                    } else {
                        if (war.getWarRuleArray().length) {
                            MeWarRulePanel.show();
                            this.close();
                        } else {
                            FloatText.show(Lang.getText(LangTextType.A0100));
                        }
                    }
                },
            };
        }

        private _createCommandWarEvent(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0469),
                callback: () => {
                    WeEventListPanel.show({
                        war: this._war,
                    });
                    this.close();
                },
            };
        }

        private _createCommandMapTag(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0445),
                callback: () => {
                    MeMapTagPanel.show();
                },
            };
        }

        private _createCommandReviewAccept(): DataForCommandRenderer | null {
            const war = this._war;
            if (!war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0296),
                    callback: () => {
                        MmAcceptMapPanel.show({ war });
                    },
                };
            }
        }

        private _createCommandReviewReject(): DataForCommandRenderer | null {
            const war = this._war;
            if (!war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0297),
                    callback: () => {
                        MmRejectMapPanel.show({ war });
                    },
                };
            }
        }

        private _createCommandChat(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0383),
                callback: () => {
                    this.close();
                    TwnsChatPanel.ChatPanel.show({});
                },
            };
        }

        private _createCommandGotoMapListPanel(): DataForCommandRenderer | undefined {
            const war = this._war;
            if (war.getIsReviewingMap()) {
                return undefined;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0650),
                    callback: () => {
                        CommonConfirmPanel.show({
                            title   : Lang.getText(LangTextType.B0650),
                            content : war.getIsMapModified() ? Lang.getText(LangTextType.A0143) : Lang.getText(LangTextType.A0225),
                            callback: () => FlowManager.gotoMyWarListPanel(war.getWarType()),
                        });
                    },
                };
            }
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(LangTextType.B0054),
                callback: () => {
                    CommonConfirmPanel.show({
                        title   : Lang.getText(LangTextType.B0054),
                        content : this._war.getIsMapModified() ? Lang.getText(LangTextType.A0143) : Lang.getText(LangTextType.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
            };
        }

        private _createCommandSimulation(): DataForCommandRenderer | null {
            const war = this._war;
            return {
                name    : Lang.getText(LangTextType.B0325),
                callback: async () => {
                    const mapRawData    = war.serializeForMap();
                    const errorCode     = await MeUtility.getErrorCodeForMapRawData(mapRawData);
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    const cb = () => {
                        MeSimModel.resetData(mapRawData, war.serializeForCreateSfw());
                        MeSimSettingsPanel.show();
                        this.close();
                    };

                    if (!war.getIsMapModified()) {
                        cb();
                    } else {
                        CommonConfirmPanel.show({
                            content         : Lang.getText(LangTextType.A0142),
                            callback        : () => {
                                MeConfirmSaveMapPanel.show();
                            },
                            callbackOnCancel: () => {
                                cb();
                            },
                        });
                    }
                },
            };
        }

        private _createCommandCreateMfr(): DataForCommandRenderer | null {
            const war = this._war;
            return {
                name    : Lang.getText(LangTextType.B0557),
                callback: async () => {
                    const mapRawData    = war.serializeForMap();
                    const errorCode     = await MeUtility.getErrorCodeForMapRawData(mapRawData);
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    const cb = () => {
                        MeMfwModel.resetData(mapRawData, war.serializeForCreateMfr());
                        MeMfwSettingsPanel.show();
                        this.close();
                    };

                    if (!war.getIsMapModified()) {
                        cb();
                    } else {
                        CommonConfirmPanel.show({
                            content         : Lang.getText(LangTextType.A0142),
                            callback        : () => {
                                MeConfirmSaveMapPanel.show();
                            },
                            callbackOnCancel: () => {
                                cb();
                            },
                        });
                    }
                }
            };
        }
        private _createCommandUserSettings(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0560),
                callback: () => {
                    UserSettingsPanel.show();
                }
            };
        }
        private _createCommandClear(): DataForCommandRenderer | null {
            if (this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0391),
                    callback: () => {
                        MeClearPanel.show();
                    },
                };
            }
        }
        private _createCommandResize(): DataForCommandRenderer | null {
            if (this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0290),
                    callback: () => {
                        MeResizePanel.show();
                    },
                };
            }
        }
        private _createCommandOffset(): DataForCommandRenderer | null {
            if (this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0293),
                    callback: () => {
                        MeOffsetPanel.show();
                    },
                };
            }
        }
        private _createCommandImport(): DataForCommandRenderer | null {
            if (this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0313),
                    callback: () => {
                        this.close();
                        MeImportPanel.show();
                    },
                };
            }
        }
    }

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    };

    class CommandRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
        private _group      : eui.Group;
        private _labelName  : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(): void {
            this.data.callback();
        }

        private _updateView(): void {
            const data = this.data;
            this._labelName.text    = data.name;
        }
    }

    type DataForTileRenderer = {
        baseType    : TileBaseType;
        objectType  : TileObjectType;
        count       : number;
        tileType    : Types.TileType;
        playerIndex : number;
    };

    class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
        private _group          : eui.Group;
        private _labelNum       : TwnsUiLabel.UiLabel;
        private _conTileView    : eui.Group;

        private _tileView   = new TwnsMeTileSimpleView.MeTileSimpleView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.TileAnimationTick,  callback: this._onNotifyTileAnimationTick },
            ]);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();
        }

        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        protected _onDataChanged(): void {
            const data              = this.data;
            this._labelNum.text     = "" + data.count;
            this._tileView.init({
                tileBaseType        : data.baseType,
                tileBaseShapeId     : 0,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                tileObjectType      : data.objectType,
                tileObjectShapeId   : 0,
                playerIndex         : data.playerIndex,
            });
            this._tileView.updateView();
        }
    }

    type DataForUnitRenderer = {
        count           : number;
        dataForDrawUnit : DataForDrawUnit;
    };

    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private _group          : eui.Group;
        private _labelNum       : TwnsUiLabel.UiLabel;
        private _conUnitView    : eui.Group;

        private _unitView   = new BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickStateAnimationFrame();
            unitView.tickUnitAnimationFrame();
        }

        protected _onDataChanged(): void {
            const data              = this.data;
            const dataForDrawUnit   = data.dataForDrawUnit;
            this._labelNum.text    = "" + data.count;

            const war   = MeModel.getWar();
            const unit  = new TwnsBwUnit.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType    : dataForDrawUnit.unitType,
                playerIndex : dataForDrawUnit.playerIndex,
            }, war.getConfigVersion());
            unit.startRunning(war);

            const unitView = this._unitView;
            unitView.init(unit);
            unitView.startRunningView();
        }

        public onItemTapEvent(): void {
            const data = this.data;
            MeChooseUnitPanel.hide();
            MeModel.getWar().getDrawer().setModeDrawUnit(data.dataForDrawUnit);
        }
    }
}

export default TwnsMeWarMenuPanel;
