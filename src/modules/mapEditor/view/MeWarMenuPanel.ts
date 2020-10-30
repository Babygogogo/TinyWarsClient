
namespace TinyWars.MapEditor {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import FlowManager      = Utility.FlowManager;
    import Logger           = Utility.Logger;
    import FloatText        = Utility.FloatText;
    import LocalStorage     = Utility.LocalStorage;
    import ProtoTypes       = Utility.ProtoTypes;
    import UnitType         = Types.UnitType;
    import TileBaseType     = Types.TileBaseType;
    import TileObjectType   = Types.TileObjectType;
    import TimeModel        = Time.TimeModel;

    const enum MenuType {
        Main,
        Advanced,
    }

    export class MeWarMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWarMenuPanel;

        private _group                  : eui.Group;
        private _listCommand            : GameUi.UiScrollList;
        private _labelNoCommand         : GameUi.UiLabel;
        private _btnBack                : GameUi.UiButton;
        private _labelMenuTitle         : GameUi.UiLabel;
        private _labelMapInfoTitle      : TinyWars.GameUi.UiLabel;

        private  _btnModifyMapName      : TinyWars.GameUi.UiButton;
        private  _labelMapName          : TinyWars.GameUi.UiLabel;

        private  _btnModifyMapDesigner  : TinyWars.GameUi.UiButton;
        private  _labelMapDesigner      : TinyWars.GameUi.UiLabel;

        private  _btnModifyMapSize      : TinyWars.GameUi.UiButton;
        private  _labelMapSize          : TinyWars.GameUi.UiLabel;

        private _listTile               : GameUi.UiScrollList;
        private _listUnit               : GameUi.UiScrollList;

        private _war            : MeWar;
        private _dataForList    : DataForCommandRenderer[];
        private _menuType       = MenuType.Main;

        public static show(): void {
            if (!MeWarMenuPanel._instance) {
                MeWarMenuPanel._instance = new MeWarMenuPanel();
            }
            MeWarMenuPanel._instance.open();
        }
        public static hide(): void {
            if (MeWarMenuPanel._instance) {
                MeWarMenuPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = MeWarMenuPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/mapEditor/MeWarMenuPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.TileAnimationTick,      callback: this._onNotifyTileAnimationTick },
                { type: Notify.Type.UnitAnimationTick,      callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.MsgMeSubmitMap,         callback: this._onMsgMeSubmitMap },
                { type: Notify.Type.MsgMmReviewMap,         callback: this._onMsgMmReviewMap },
                { type: Notify.Type.MsgScrCreateCustomWar,  callback: this._onMsgScrCreateCustomWar },
            ];
            this._uiListeners = [
                { ui: this._btnBack,                callback: this._onTouchedBtnBack },
                { ui: this._btnModifyMapDesigner,   callback: this._onTouchedBtnModifyMapDesigner },
                { ui: this._btnModifyMapName,       callback: this._onTouchedBtnModifyMapName },
                { ui: this._btnModifyMapSize,       callback: this._onTouchedBtnModifyMapSize },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
            this._listTile.setItemRenderer(TileRenderer);
            this._listUnit.setItemRenderer(UnitRenderer);
        }
        protected _onOpened(): void {
            const war           = MeManager.getWar();
            this._war           = war;
            this._menuType      = MenuType.Main;

            this._updateView();

            Notify.dispatch(Notify.Type.McwWarMenuPanelOpened);
        }
        protected _onClosed(): void {
            this._war           = null;
            this._dataForList   = null;
            this._listCommand.clear();

            Notify.dispatch(Notify.Type.McwWarMenuPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onMsgMeSubmitMap(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0085));
            this._war.setIsMapModified(false);
        }

        private _onMsgMmReviewMap(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMmReviewMap.IS;
            if (data.isAccept) {
                FloatText.show(Lang.getText(Lang.Type.A0092));
            } else {
                FloatText.show(Lang.getText(Lang.Type.A0093));
            }
            Utility.FlowManager.gotoLobby();
        }

        private _onMsgScrCreateCustomWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgScrCreateCustomWar.IS;
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0107),
                callback: () => {
                    FlowManager.gotoSingleCustomWar({
                        slotIndex   : data.slotIndex,
                        slotComment : data.slotComment,
                        warData     : data.warData,
                    });
                },
            });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            const viewList = this._listTile.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof TileRenderer) && (child.updateOnTileAnimationTick());
            }
        }

        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewList = this._listUnit.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof UnitRenderer) && (child.updateOnUnitAnimationTick());
            }
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            const type = this._menuType;
            if (type === MenuType.Main) {
                this.close();
            } else if (type === MenuType.Advanced) {
                this._menuType = MenuType.Main;
                this._updateListCommand();
            } else {
                Logger.error(`McwWarMenuPanel._onTouchedBtnBack() invalid this._menuType: ${type}`);
                this.close();
            }
        }

        private _onTouchedBtnModifyMapName(e: egret.TouchEvent): void {
            const war = this._war;
            if (!war.getIsReviewingMap()) {
                const mapNameList = war.getMapNameList();
                Common.CommonInputPanel.show({
                    title           : Lang.getText(Lang.Type.B0225),
                    tips            : Lang.getText(Lang.Type.A0131),
                    currentValue    : mapNameList.join(","),
                    maxChars        : Utility.ConfigManager.MAP_CONSTANTS.MaxMapNameLength * 2 + 1,
                    charRestrict    : null,
                    callback        : (panel) => {
                        const value         = panel.getInputText();
                        const newNameList   : string[] = [];
                        for (const rawName of (value ? value.split(",") : [])) {
                            const ruleName = rawName.trim();
                            if (ruleName) {
                                newNameList.push(ruleName);
                            }
                        }

                        if (!newNameList.length) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            mapNameList.length = 0;
                            for (const ruleName of newNameList) {
                                mapNameList.push(ruleName);
                            }
                            this._updateLabelMapName();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyMapSize(e: egret.TouchEvent): void {
            if (!this._war.getIsReviewingMap()) {
                MeResizePanel.show();
            }
        }

        private _onTouchedBtnModifyMapDesigner(e: egret.TouchEvent): void {
            const war = this._war;
            if (!war.getIsReviewingMap()) {
                Common.CommonInputPanel.show({
                    title           : Lang.getText(Lang.Type.B0163),
                    tips            : null,
                    currentValue    : war.getMapDesignerName(),
                    maxChars        : Utility.ConfigManager.MAP_CONSTANTS.MaxDesignerLength,
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
            this._labelMenuTitle.text                   = Lang.getText(Lang.Type.B0155);
            this._labelMapInfoTitle.text                = Lang.getText(Lang.Type.B0298);
            this._btnModifyMapName.label                = Lang.getText(Lang.Type.B0225);
            this._btnModifyMapDesigner.label            = Lang.getText(Lang.Type.B0163);
            this._btnModifyMapSize.label                = Lang.getText(Lang.Type.B0300);
            this._btnBack.label                         = Lang.getText(Lang.Type.B0146);
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = (this._war.getMapNameList() || []).join(",");
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
            this._war.getTileMap().forEachTile(tile => {
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
            });

            const dataList : DataForTileRenderer[] = [];
            for (const [k, v] of dictForTileBases) {
                dataList.push(v);
            }
            for (const [k, v] of dictForTileObjects) {
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
            this._war.getUnitMap().forEachUnit(unit => {
                const unitType = unit.getType();
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
            });

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
            if (type === MenuType.Main) {
                return this._createDataForMainMenu();
            } else if (type === MenuType.Advanced) {
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
                this._createCommandReviewAccept(),
                this._createCommandReviewReject(),
                this._createCommandOpenAdvancedMenu(),
                this._createCommandChat(),
                this._createCommandGotoLobby(),
            ].filter(v => !!v);
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            return [
                this._createCommandSimulation(),
                this._createCommandShowTileAnimation(),
                this._createCommandStopTileAnimation(),
                this._createCommandUseOriginTexture(),
                this._createCommandUseNewTexture(),
                this._createCommandClear(),
                this._createCommandResize(),
                this._createCommandOffset(),
                this._createCommandImport(),
            ].filter(v => !!v);
        }

        private _createCommandOpenAdvancedMenu(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0080),
                callback: () => {
                    this._menuType = MenuType.Advanced;
                    this._updateListCommand();
                },
            };
        }

        private _createCommandSubmitMap(): DataForCommandRenderer | null {
            if (this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0287),
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
                    name    : Lang.getText(Lang.Type.B0288),
                    callback: () => {
                        Common.CommonConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getText(Lang.Type.A0072),
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
                name    : Lang.getText(Lang.Type.B0314),
                callback: () => {
                    const war = this._war;
                    if (!war.getIsReviewingMap()) {
                        war.reviseWarRuleList();
                        MeWarRulePanel.show();
                        this.close();
                    } else {
                        if (war.getWarRuleList().length) {
                            MeWarRulePanel.show();
                            this.close();
                        } else {
                            FloatText.show(Lang.getText(Lang.Type.A0100));
                        }
                    }
                },
            }
        }

        private _createCommandReviewAccept(): DataForCommandRenderer | null {
            if (!this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0296),
                    callback: () => {
                        MapManagement.MmAcceptMapPanel.show();
                    },
                };
            }
        }

        private _createCommandReviewReject(): DataForCommandRenderer | null {
            if (!this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0297),
                    callback: () => {
                        MapManagement.MmRejectMapPanel.show();
                    },
                };
            }
        }

        private _createCommandChat(): DataForCommandRenderer | null {
            return {
                name    : Lang.getText(Lang.Type.B0383),
                callback: () => {
                    this.close();
                    Chat.ChatPanel.show({});
                },
            }
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0054),
                callback: () => {
                    Common.CommonConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0054),
                        content : this._war.getIsMapModified() ? Lang.getText(Lang.Type.A0143) : Lang.getText(Lang.Type.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
            }
        }

        private _createCommandSimulation(): DataForCommandRenderer | null {
            const war = this._war;
            return {
                name    : Lang.getText(Lang.Type.B0325),
                callback: () => {
                    const invalidationType = MeUtility.getMapInvalidationType(war.serializeForMap());
                    if (invalidationType !== Types.CustomMapInvalidationType.Valid) {
                        FloatText.show(Lang.getMapInvalidationDesc(invalidationType));
                        return;
                    }

                    const cb = () => {
                        war.reviseWarRuleList();
                        MeModel.Sim.resetData(war.serializeForMap(), war.serializeForSimulation());
                        MeSimSettingsPanel.show();
                        this.close();
                    };

                    if (!war.getIsMapModified()) {
                        cb();
                    } else {
                        Common.CommonConfirmPanel.show({
                            title           : Lang.getText(Lang.Type.B0088),
                            content         : Lang.getText(Lang.Type.A0142),
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

        private _createCommandShowTileAnimation(): DataForCommandRenderer | null {
            if (TimeModel.checkIsTileAnimationTicking()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0176),
                    callback: () => {
                        TimeModel.startTileAnimationTick();
                        LocalStorage.setShowTileAnimation(true);
                        this._updateListCommand();
                    },
                }
            }
        }
        private _createCommandStopTileAnimation(): DataForCommandRenderer | null {
            if (!TimeModel.checkIsTileAnimationTicking()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0177),
                    callback: () => {
                        TimeModel.stopTileAnimationTick();
                        LocalStorage.setShowTileAnimation(false);
                        this._updateListCommand();
                    },
                }
            }
        }
        private _createCommandUseOriginTexture(): DataForCommandRenderer | null {
            if (Common.CommonModel.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V0) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0385),
                    callback: () => {
                        Common.CommonModel.setUnitAndTileTextureVersion(Types.UnitAndTileTextureVersion.V0);
                        this._updateView();
                    }
                };
            }
        }
        private _createCommandUseNewTexture(): DataForCommandRenderer | null {
            if (Common.CommonModel.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V1) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0386),
                    callback: () => {
                        Common.CommonModel.setUnitAndTileTextureVersion(Types.UnitAndTileTextureVersion.V1);
                        this._updateView();
                    }
                };
            }
        }
        private _createCommandClear(): DataForCommandRenderer | null {
            if (this._war.getIsReviewingMap()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0391),
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
                    name    : Lang.getText(Lang.Type.B0290),
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
                    name    : Lang.getText(Lang.Type.B0293),
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
                    name    : Lang.getText(Lang.Type.B0313),
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
    }

    class CommandRenderer extends eui.ItemRenderer {
        private _group      : eui.Group;
        private _labelName  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }

        private _updateView(): void {
            const data = this.data as DataForCommandRenderer;
            this._labelName.text    = data.name;
        }
    }

    type DataForTileRenderer = {
        baseType    : TileBaseType;
        objectType  : TileObjectType;
        count       : number;
        tileType    : Types.TileType;
        playerIndex : number;
    }

    class TileRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _labelNum       : GameUi.UiLabel;
        private _conTileView    : eui.Group;

        private _tileView   = new MeTileSimpleView();

        protected childrenCreated(): void {
            super.childrenCreated();

            const tileView = this._tileView;
            this._conTileView.addChild(tileView.getImgBase());
            this._conTileView.addChild(tileView.getImgObject());
            tileView.startRunningView();
        }

        public updateOnTileAnimationTick(): void {
            this._tileView.updateOnAnimationTick();
        }

        protected dataChanged(): void {
            const data              = this.data as DataForTileRenderer;
            this._labelNum.text     = "" + data.count;
            this._tileView.init({
                tileBaseType        : data.baseType,
                tileBaseShapeId     : 0,
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
    }

    class UnitRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _labelNum       : GameUi.UiLabel;
        private _conUnitView    : eui.Group;

        private _unitView   = new MeUnitView();

        protected childrenCreated(): void {
            super.childrenCreated();

            this._conUnitView.addChild(this._unitView);
        }

        public updateOnUnitAnimationTick(): void {
            const unitView = this._unitView;
            unitView.tickStateAnimationFrame();
            unitView.tickUnitAnimationFrame();
        }

        protected dataChanged(): void {
            const data              = this.data as DataForUnitRenderer;
            const dataForDrawUnit   = data.dataForDrawUnit;
            this._labelNum.text    = "" + data.count;

            const war   = MeManager.getWar();
            const unit  = new MeUnit().init({
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
            const data = this.data as DataForUnitRenderer;
            MeChooseUnitPanel.hide();
            MeManager.getWar().getDrawer().setModeDrawUnit(data.dataForDrawUnit);
        }
    }
}
