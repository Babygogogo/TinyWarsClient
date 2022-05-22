
// import TwnsBwUnit                   from "../../baseWar/model/BwUnit";
// import TwnsBwUnitView               from "../../baseWar/view/BwUnitView";
// import TwnsChatPanel                from "../../chat/view/ChatPanel";
// import TwnsCommonConfirmPanel       from "../../common/view/CommonConfirmPanel";
// import TwnsCommonInputPanel         from "../../common/view/CommonInputPanel";
// import TwnsMmAcceptMapPanel         from "../../mapManagement/view/MmAcceptMapPanel";
// import TwnsMmRejectMapPanel         from "../../mapManagement/view/MmRejectMapPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import FloatText                    from "../../tools/helpers/FloatText";
// import FlowManager                  from "../../tools/helpers/FlowManager";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsUserSettingsPanel        from "../../user/view/UserSettingsPanel";
// import TwnsWeEventListPanel         from "../../warEvent/view/WeEventListPanel";
// import TwnsMeDrawer                 from "../model/MeDrawer";
// import MeMfwModel                   from "../model/MeMfwModel";
// import MeModel                      from "../model/MeModel";
// import MeSimModel                   from "../model/MeSimModel";
// import MeUtility                    from "../model/MeUtility";
// import TwnsMeWar                    from "../model/MeWar";
// import TwnsMeChooseUnitPanel        from "./MeChooseUnitPanel";
// import TwnsMeClearPanel             from "./MeClearPanel";
// import TwnsMeConfirmSaveMapPanel    from "./MeConfirmSaveMapPanel";
// import TwnsMeImportPanel            from "./MeImportPanel";
// import TwnsMeMapTagPanel            from "./MeMapTagPanel";
// import TwnsMeMfwSettingsPanel       from "./MeMfwSettingsPanel";
// import TwnsMeModifyMapNamePanel     from "./MeModifyMapNamePanel";
// import TwnsMeOffsetPanel            from "./MeOffsetPanel";
// import TwnsMeResizePanel            from "./MeResizePanel";
// import TwnsMeSimSettingsPanel       from "./MeSimSettingsPanel";
// import TwnsMeTileSimpleView         from "./MeTileSimpleView";
// import TwnsMeWarRulePanel           from "./MeWarRulePanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import DataForDrawUnit          = MapEditor.DataForDrawUnit;
    import NotifyType               = Notify.NotifyType;
    import LangTextType             = Lang.LangTextType;

    // eslint-disable-next-line no-shadow
    enum TwnsMeWarMenuType {
        Main,
        Advanced,
    }

    export type OpenDataForMeWarMenuPanel = void;
    export class MeWarMenuPanel extends TwnsUiPanel.UiPanel<OpenDataForMeWarMenuPanel> {
        private readonly _group!                : eui.Group;
        private readonly _listCommand!          : TwnsUiScrollList.UiScrollList<DataForCommandRenderer>;
        private readonly _labelNoCommand!       : TwnsUiLabel.UiLabel;
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelMapInfoTitle!    : TwnsUiLabel.UiLabel;

        private readonly _btnModifyMapName!     : TwnsUiButton.UiButton;
        private readonly _labelMapName!         : TwnsUiLabel.UiLabel;

        private readonly _btnMapDesc!           : TwnsUiButton.UiButton;
        private readonly _labelMapDesc!         : TwnsUiLabel.UiLabel;

        private readonly _btnModifyMapDesigner! : TwnsUiButton.UiButton;
        private readonly _labelMapDesigner!     : TwnsUiLabel.UiLabel;

        private readonly _btnModifyMapSize!     : TwnsUiButton.UiButton;
        private readonly _labelMapSize!         : TwnsUiLabel.UiLabel;

        private readonly _listTile!             : TwnsUiScrollList.UiScrollList<DataForTileRenderer>;
        private readonly _listUnit!             : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;

        private _menuType = TwnsMeWarMenuType.Main;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAndTileTextureVersionChanged,    callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: NotifyType.MeMapNameChanged,                    callback: this._onNotifyMeMapNameChanged },
                { type: NotifyType.MeMapDescChanged,                    callback: this._onNotifyMeMapDescChanged },
                { type: NotifyType.MsgSpmCreateSfw,                     callback: this._onMsgSpmCreateSfw },
                { type: NotifyType.MsgUserSetMapEditorAutoSaveTime,     callback: this._onNotifyMsgUserSetMapEditorAutoSaveTime },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,                callback: this._onTouchedBtnBack },
                { ui: this._btnModifyMapDesigner,   callback: this._onTouchedBtnModifyMapDesigner },
                { ui: this._btnModifyMapName,       callback: this._onTouchedBtnModifyMapName },
                { ui: this._btnMapDesc,             callback: this._onTouchedBtnMapDesc },
                { ui: this._btnModifyMapSize,       callback: this._onTouchedBtnModifyMapSize },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._listCommand.setItemRenderer(CommandRenderer);
            this._listTile.setItemRenderer(TileRenderer);
            this._listUnit.setItemRenderer(UnitRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._menuType = TwnsMeWarMenuType.Main;
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _getWar(): MeWar {
            return Helpers.getExisted(MapEditor.MeModel.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onMsgSpmCreateSfw(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgSpmCreateSfw.IS;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                content : Lang.getText(LangTextType.A0107),
                callback: () => {
                    FlowManager.gotoSinglePlayerWar({
                        slotIndex       : Helpers.getExisted(data.slotIndex),
                        slotExtraData   : Helpers.getExisted(data.extraData),
                        warData         : Helpers.getExisted(data.warData),
                    });
                },
            });
        }

        private _onNotifyMsgUserSetMapEditorAutoSaveTime(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgUserSetMapEditorAutoSaveTime.IS;
            FloatText.show(Lang.getText(data.time == null ? LangTextType.A0248 : LangTextType.A0247));
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

        private _onNotifyMeMapDescChanged(): void {
            this._updateLabelMapDesc();
        }

        private _onTouchedBtnBack(): void {
            const type = this._menuType;
            if (type === TwnsMeWarMenuType.Main) {
                this.close();
            } else if (type === TwnsMeWarMenuType.Advanced) {
                this._menuType = TwnsMeWarMenuType.Main;
                this._updateListCommand();
            } else {
                throw Helpers.newError(`McwWarMenuPanel._onTouchedBtnBack() invalid this._menuType: ${type}`);
            }
        }

        private _onTouchedBtnModifyMapName(): void {
            const war = this._getWar();
            if (!war.getIsReviewingMap()) {
                PanelHelpers.open(PanelHelpers.PanelDict.MeModifyMapNamePanel, void 0);
            }
        }

        private _onTouchedBtnMapDesc(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.MeModifyMapDescPanel, {
                war : this._getWar(),
            });
        }

        private _onTouchedBtnModifyMapSize(): void {
            if (!this._getWar().getIsReviewingMap()) {
                PanelHelpers.open(PanelHelpers.PanelDict.MeResizePanel, void 0);
            }
        }

        private _onTouchedBtnModifyMapDesigner(): void {
            const war = this._getWar();
            if (!war.getIsReviewingMap()) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonInputPanel, {
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

            const isReviewing       = this._getWar().getIsReviewingMap();
            const colorForButtons   = isReviewing ? 0xFFFFFF : 0x00FF00;
            this._btnBack.setTextColor(0x00FF00);
            this._btnModifyMapDesigner.setTextColor(colorForButtons);
            this._btnModifyMapName.setTextColor(colorForButtons);
            this._btnMapDesc.setTextColor(colorForButtons);
            this._btnModifyMapSize.setTextColor(colorForButtons);

            this._updateListCommand();
            this._updateLabelMapName();
            this._updateLabelMapDesc();
            this._updateGroupMapDesigner();
            this._updateGroupMapSize();
            this._updateListTile();
            this._updateListUnit();
        }

        private _updateListCommand(): void {
            const dataArray = this._createDataForList();
            if (!dataArray.length) {
                this._labelNoCommand.visible = true;
                this._listCommand.clear();
            } else {
                this._labelNoCommand.visible = false;
                this._listCommand.bindData(dataArray);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text                   = Lang.getText(LangTextType.B0155);
            this._labelMapInfoTitle.text                = Lang.getText(LangTextType.B0298);
            this._btnModifyMapName.label                = Lang.getText(LangTextType.B0225);
            this._btnMapDesc.label                      = Lang.getText(LangTextType.B0893);
            this._btnModifyMapDesigner.label            = Lang.getText(LangTextType.B0163);
            this._btnModifyMapSize.label                = Lang.getText(LangTextType.B0300);
            this._btnBack.label                         = Lang.getText(LangTextType.B0146);
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = Lang.concatLanguageTextList(this._getWar().getMapNameArray());
        }

        private _updateLabelMapDesc(): void {
            this._labelMapDesc.text = Lang.getLanguageText({
                textArray   : this._getWar().getMapDescArray(),
            }) ?? ``;
        }

        private _updateGroupMapDesigner(): void {
            const war                   = this._getWar();
            this._labelMapDesigner.text = war.getMapDesignerName();
        }

        private _updateGroupMapSize(): void {
            const size              = this._getWar().getTileMap().getMapSize();
            this._labelMapSize.text = `${size.width} * ${size.height}`;
        }

        private _updateListTile(): void {
            const dictForTileBases      = new Map<number, DataForTileRenderer>();
            const dictForTileObjects    = new Map<number, DataForTileRenderer>();
            const war                   = this._getWar();
            const gameConfig            = war.getGameConfig();
            for (const tile of war.getTileMap().getAllTiles()) {
                const tileObjectType    = tile.getObjectType();
                const tileBaseType      = tile.getBaseType();
                const tileType          = tile.getType();
                const playerIndex       = tile.getPlayerIndex();

                if (tileObjectType == CommonConstants.TileObjectType.Empty) {
                    if (dictForTileBases.has(tileBaseType)) {
                        ++Helpers.getExisted(dictForTileBases.get(tileBaseType)).count;
                    } else {
                        dictForTileBases.set(tileBaseType, {
                            baseType    : tileBaseType,
                            objectType  : null,
                            count       : 1,
                            tileType,
                            playerIndex,
                            gameConfig,
                        });
                    }
                } else {
                    if (dictForTileObjects.has(tileObjectType)) {
                        ++Helpers.getExisted(dictForTileObjects.get(tileObjectType)).count;
                    } else {
                        dictForTileObjects.set(tileObjectType, {
                            baseType    : null,
                            objectType  : tileObjectType,
                            count       : 1,
                            tileType,
                            playerIndex,
                            gameConfig,
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
            const dict = new Map<number, Map<number, DataForUnitRenderer>>();
            for (const unit of this._getWar().getUnitMap().getAllUnits()) {
                const unitType = unit.getUnitType();
                if (!dict.has(unitType)) {
                    dict.set(unitType, new Map());
                }

                const subDict       = Helpers.getExisted(dict.get(unitType));
                const playerIndex   = unit.getPlayerIndex();
                if (subDict.has(playerIndex)) {
                    ++Helpers.getExisted(subDict.get(playerIndex)).count;
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
                throw Helpers.newError(`Invalid menuType: ${type}`);
            }
        }

        private _createDataForMainMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandClear(),
                this._createCommandResize(),
                this._createCommandSimulation(),
                this._createCommandCreateMfr(),
                // this._createCommandChat(),
                this._createCommandOpenAdvancedMenu(),
                this._createCommandGotoMapListPanel(),
                this._createCommandGotoLobby(),
            ]);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return Helpers.getNonNullElements([
                this._createCommandAutoSaveMap(),
                this._createCommandImport(),
                this._createCommandImportFromClipboard(),
                this._createCommandExportToClipboard(),
            ]);
        }

        private _createCommandOpenAdvancedMenu(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0080),
                callback: () => {
                    this._menuType = TwnsMeWarMenuType.Advanced;
                    this._updateListCommand();
                },
            };
        }

        // private _createCommandChat(): DataForCommandRenderer | null {
        //     return {
        //         name    : Lang.getText(LangTextType.B0383),
        //         callback: () => {
        //             const war = this._getWar();
        //             TwnsPanelManager.open(TwnsPanelConfig.Dict.ChatPanel, {
        //                 toMapReviewTarget: war.getIsReviewingMap()
        //                     ? war.getMapDesignerUserId()
        //                     : Helpers.getExisted(UserModel.getSelfUserId())
        //             });

        //             this.close();
        //         },
        //     };
        // }

        private _createCommandGotoMapListPanel(): DataForCommandRenderer | null {
            const war = this._getWar();
            if (war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0650),
                    callback: () => {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            title   : Lang.getText(LangTextType.B0650),
                            content : war.getIsMapModified() ? Lang.getText(LangTextType.A0143) : Lang.getText(LangTextType.A0225),
                            callback: () => FlowManager.gotoMyWarListPanel(war.getWarType()),
                        });
                    },
                };
            }
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0054),
                callback: () => {
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                        title   : Lang.getText(LangTextType.B0054),
                        content : this._getWar().getIsMapModified() ? Lang.getText(LangTextType.A0143) : Lang.getText(LangTextType.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
            };
        }

        private _createCommandAutoSaveMap(): DataForCommandRenderer | null {
            if (this._getWar().getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0709),
                    callback: () => {
                        const currValue = User.UserModel.getSelfMapEditorAutoSaveTime();
                        const minValue  = CommonConstants.MapEditorAutoSaveMinTime;
                        const maxValue  = CommonConstants.MapEditorAutoSaveMaxTime;
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonInputPanel, {
                            title           : Lang.getText(LangTextType.B0709),
                            currentValue    : `${currValue ?? ``}`,
                            maxChars        : 4,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(LangTextType.B0319)}: [${minValue}, ${maxValue}](s)\n${Lang.getText(LangTextType.A0246)}`,
                            canBeEmpty      : true,
                            callback        : panel => {
                                const text  = panel.getInputText();
                                if (!text) {
                                    if (currValue != null) {
                                        User.UserProxy.reqSetMapEditorAutoSaveTime(null);
                                    }
                                } else {
                                    const value = Number(text);
                                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                                        FloatText.show(Lang.getText(LangTextType.A0098));
                                    } else {
                                        if (currValue !== value) {
                                            User.UserProxy.reqSetMapEditorAutoSaveTime(value);
                                        }
                                    }
                                }
                            },
                        });
                    },
                };
            }
        }

        private _createCommandSimulation(): DataForCommandRenderer | null {
            const war = this._getWar();
            return {
                name    : Lang.getText(LangTextType.B0325),
                callback: async () => {
                    const mapRawData    = war.serializeForMap();
                    const errorCode     = await MapEditor.MeHelpers.getErrorCodeForMapRawData(mapRawData);
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    const cb = () => {
                        MapEditor.MeSimModel.resetData(mapRawData, war.serializeForCreateSfw());
                        PanelHelpers.open(PanelHelpers.PanelDict.MeSimSettingsPanel, void 0);
                        this.close();
                    };

                    if (!war.getIsMapModified()) {
                        cb();
                    } else {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            content         : Lang.getText(LangTextType.A0142),
                            callback        : () => {
                                PanelHelpers.open(PanelHelpers.PanelDict.MeConfirmSaveMapPanel, void 0);
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
            const war = this._getWar();
            return {
                name    : Lang.getText(LangTextType.B0557),
                callback: async () => {
                    const mapRawData    = war.serializeForMap();
                    const errorCode     = await MapEditor.MeHelpers.getErrorCodeForMapRawData(mapRawData);
                    if (errorCode) {
                        FloatText.show(Lang.getErrorText(errorCode));
                        return;
                    }

                    const cb = () => {
                        MapEditor.MeMfwModel.resetData(mapRawData, war.serializeForCreateMfr());
                        PanelHelpers.open(PanelHelpers.PanelDict.MeMfwSettingsPanel, void 0);
                        this.close();
                    };

                    if (!war.getIsMapModified()) {
                        cb();
                    } else {
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            content         : Lang.getText(LangTextType.A0142),
                            callback        : () => {
                                PanelHelpers.open(PanelHelpers.PanelDict.MeConfirmSaveMapPanel, void 0);
                            },
                            callbackOnCancel: () => {
                                cb();
                            },
                        });
                    }
                }
            };
        }
        private _createCommandClear(): DataForCommandRenderer | null {
            if (this._getWar().getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0391),
                    callback: () => {
                        PanelHelpers.open(PanelHelpers.PanelDict.MeClearPanel, void 0);
                    },
                };
            }
        }
        private _createCommandResize(): DataForCommandRenderer | null {
            if (this._getWar().getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0290),
                    callback: () => {
                        PanelHelpers.open(PanelHelpers.PanelDict.MeResizePanel, void 0);
                    },
                };
            }
        }
        private _createCommandImport(): DataForCommandRenderer | null {
            if (this._getWar().getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0313),
                    callback: () => {
                        this.close();
                        PanelHelpers.open(PanelHelpers.PanelDict.MeImportPanel, void 0);
                    },
                };
            }
        }
        private _createCommandImportFromClipboard(): DataForCommandRenderer | null {
            const war = this._getWar();
            if (war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(LangTextType.B0681),
                    callback: () => {
                        if (navigator?.clipboard?.readText == null) {
                            FloatText.show(Lang.getText(LangTextType.A0275));
                            return;
                        }

                        PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                            content : Lang.getText(LangTextType.A0237),
                            callback: async () => {
                                war.stopRunning();
                                await war.initWithMapEditorData(
                                    {
                                        mapRawData  : JSON.parse(await navigator.clipboard.readText()),
                                        slotIndex   : war.getMapSlotIndex(),
                                    },
                                    war.getGameConfig()
                                );
                                war.setIsMapModified(true);
                                war.startRunning()
                                    .startRunningView();

                                this.close();
                            },
                        });
                    },
                };
            }

            // (async () => {
            //     const war = Helpers.getExisted(MeModel.getWar());
            //     war.stopRunning();
            //     await war.initWithMapEditorData({
            //         mapRawData  : JSON.parse(await navigator.clipboard.readText()),
            //         slotIndex   : war.getMapSlotIndex(),
            //     });
            //     war.setIsMapModified(true);
            //     war.startRunning()
            //         .startRunningView();
            // })();
        }
        private _createCommandExportToClipboard(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(LangTextType.B0680),
                callback: () => {
                    if (navigator?.clipboard?.writeText == null) {
                        FloatText.show(Lang.getText(LangTextType.A0275));
                        return;
                    }

                    navigator.clipboard.writeText(JSON.stringify(this._getWar().serializeForMap()));

                    FloatText.show(Lang.getText(LangTextType.A0235));
                },
            };
        }
    }

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    };

    class CommandRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCommandRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        public onItemTapEvent(): void {
            this._getData().callback();
        }

        private _updateView(): void {
            const data              = this._getData();
            this._labelName.text    = data.name;
        }
    }

    type DataForTileRenderer = {
        baseType    : number | null;
        objectType  : number | null;
        count       : number;
        tileType    : number;
        playerIndex : number;
        gameConfig  : Config.GameConfig;
    };

    class TileRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForTileRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelNum!     : TwnsUiLabel.UiLabel;
        private readonly _conTileView!  : eui.Group;

        private _tileView   = new MapEditor.MeTileSimpleView();

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
            const data              = this._getData();
            this._labelNum.text     = "" + data.count;
            this._tileView.init({
                tileBaseType        : data.baseType,
                tileBaseShapeId     : 0,
                tileDecoratorType   : null,
                tileDecoratorShapeId: null,
                tileObjectType      : data.objectType,
                tileObjectShapeId   : 0,
                playerIndex         : data.playerIndex,
                gameConfig          : data.gameConfig,
            });
            this._tileView.updateView();
        }
    }

    type DataForUnitRenderer = {
        count           : number;
        dataForDrawUnit : DataForDrawUnit;
    };

    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _labelNum!     : TwnsUiLabel.UiLabel;
        private readonly _conUnitView!  : eui.Group;

        private _unitView   = new BaseWar.BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);

            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickUnitAnimationFrame();
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            this._unitView.tickStateAnimationFrame();
        }

        protected _onDataChanged(): void {
            const data              = this._getData();
            const dataForDrawUnit   = data.dataForDrawUnit;
            this._labelNum.text    = "" + data.count;

            const war   = Helpers.getExisted(MapEditor.MeModel.getWar());
            const unit  = new BaseWar.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType    : dataForDrawUnit.unitType,
                playerIndex : dataForDrawUnit.playerIndex,
            }, war.getGameConfig());
            unit.startRunning(war);

            const unitView = this._unitView;
            unitView.init(unit);
            unitView.startRunningView();
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            PanelHelpers.close(PanelHelpers.PanelDict.MeChooseUnitPanel);
            Helpers.getExisted(MapEditor.MeModel.getWar()).getDrawer().setModeDrawUnit(data.dataForDrawUnit);
        }
    }
}

// export default TwnsMeWarMenuPanel;
