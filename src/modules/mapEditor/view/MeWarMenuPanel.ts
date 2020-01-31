
namespace TinyWars.MapEditor {
    import ConfirmPanel = Common.ConfirmPanel;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import FlowManager  = Utility.FlowManager;
    import Logger       = Utility.Logger;
    import FloatText    = Utility.FloatText;
    import LocalStorage = Utility.LocalStorage;
    import ProtoManager = Utility.ProtoManager;
    import ProtoTypes   = Utility.ProtoTypes;
    import WarMapModel  = WarMap.WarMapModel;
    import TimeModel    = Time.TimeModel;

    const enum MenuType {
        Main,
        Advanced,
    }

    export class MeWarMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWarMenuPanel;

        private _group          : eui.Group;
        private _listCommand    : GameUi.UiScrollList;
        private _labelNoCommand : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _labelMenuTitle : GameUi.UiLabel;

        private _groupInfo                  : eui.Group;
        private _labelMapInfoTitle          : TinyWars.GameUi.UiLabel;
        private _groupMapName               : eui.Group;
        private _labelMapNameTitle          : TinyWars.GameUi.UiLabel;
        private _labelMapName               : TinyWars.GameUi.UiLabel;
        private _btnModifyMapName           : TinyWars.GameUi.UiButton;
        private _groupMapNameEnglish        : eui.Group;
        private _labelMapNameEnglishTitle   : TinyWars.GameUi.UiLabel;
        private _labelMapNameEnglish        : TinyWars.GameUi.UiLabel;
        private _btnModifyMapNameEnglish    : TinyWars.GameUi.UiButton;
        private _groupMapDesigner           : eui.Group;
        private _labelMapDesignerTitle      : TinyWars.GameUi.UiLabel;
        private _labelMapDesigner           : TinyWars.GameUi.UiLabel;
        private _btnModifyMapDesigner       : TinyWars.GameUi.UiButton;
        private _groupMapSize               : eui.Group;
        private _labelMapSizeTitle          : TinyWars.GameUi.UiLabel;
        private _labelMapSize               : TinyWars.GameUi.UiLabel;
        private _groupIsMultiPlayer         : eui.Group;
        private _labelIsMultiPlayerTitle    : TinyWars.GameUi.UiLabel;
        private _groupIsMultiPlayerBox      : eui.Group;
        private _imgIsMultiPlayer           : TinyWars.GameUi.UiImage;
        private _groupIsSinglePlayer        : eui.Group;
        private _labelIsSinglePlayerTitle   : TinyWars.GameUi.UiLabel;
        private _groupIsSinglePlayerBox     : eui.Group;
        private _imgIsSinglePlayer          : TinyWars.GameUi.UiImage;

        private _war            : MeWar;
        private _unitMap        : MeUnitMap;
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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SMeSaveMap,         callback: this._onNotifySMeSaveMap },
                { type: Notify.Type.SMmReviewMap,       callback: this._onNotifySMmReviewMap },
            ];
            this._uiListeners = [
                { ui: this._btnBack,                    callback: this._onTouchedBtnBack },
                { ui: this._btnModifyMapDesigner,       callback: this._onTouchedBtnModifyMapDesigner },
                { ui: this._btnModifyMapName,           callback: this._onTouchedBtnModifyMapName },
                { ui: this._btnModifyMapNameEnglish,    callback: this._onTouchedBtnModifyMapNameEnglish },
                { ui: this._groupIsMultiPlayerBox,      callback: this._onTouchedGroupIsMultiPlayerBox },
                { ui: this._groupIsSinglePlayerBox,     callback: this._onTouchedGroupIsSinglePlayerBox },
            ];
            this._listCommand.setItemRenderer(CommandRenderer);
        }
        protected _onOpened(): void {
            const war           = MeManager.getWar();
            this._war           = war;
            this._unitMap       = war.getUnitMap();
            this._menuType      = MenuType.Main;

            this._updateComponentsForLanguage();
            this._updateView();

            Notify.dispatch(Notify.Type.McwWarMenuPanelOpened);
        }
        protected _onClosed(): void {
            delete this._war;
            delete this._unitMap;
            delete this._dataForList;
            this._listCommand.clear();

            Notify.dispatch(Notify.Type.McwWarMenuPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifySMeSaveMap(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0085));
            this.close();
        }

        private _onNotifySMmReviewMap(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_MmReviewMap;
            if (data.isAccept) {
                FloatText.show(Lang.getText(Lang.Type.A0092));
            } else {
                FloatText.show(Lang.getText(Lang.Type.A0093));
            }
            Utility.FlowManager.gotoLobby();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
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
            Common.InputPanel.show({
                title           : Lang.getText(Lang.Type.B0225),
                currentValue    : war.getMapName(),
                maxChars        : ConfigManager.MAP_CONSTANTS.MaxMapNameLength,
                callback        : (panel) => {
                    war.setMapName(panel.getInputText());
                    this._updateGroupMapName();
                },
            });
        }

        private _onTouchedBtnModifyMapNameEnglish(e: egret.TouchEvent): void {
            const war = this._war;
            Common.InputPanel.show({
                title           : Lang.getText(Lang.Type.B0299),
                currentValue    : war.getMapNameEnglish(),
                maxChars        : ConfigManager.MAP_CONSTANTS.MaxMapNameEnglishLength,
                callback        : (panel) => {
                    war.setMapNameEnglish(panel.getInputText());
                    this._updateGroupMapNameEnglish();
                },
            });
        }

        private _onTouchedBtnModifyMapDesigner(e: egret.TouchEvent): void {
            const war = this._war;
            Common.InputPanel.show({
                title           : Lang.getText(Lang.Type.B0163),
                currentValue    : war.getMapDesigner(),
                maxChars        : ConfigManager.MAP_CONSTANTS.MaxDesignerLength,
                callback        : (panel) => {
                    war.setMapDesigner(panel.getInputText());
                    this._updateGroupMapDesigner();
                },
            });
        }

        private _onTouchedGroupIsMultiPlayerBox(e: egret.TouchEvent): void {
            const war = this._war;
            if (!war.getIsReview()) {
                war.setIsMultiPlayer(!war.getIsMultiPlayer());
                this._updateGroupIsMultiPlayer();
            }
        }

        private _onTouchedGroupIsSinglePlayerBox(e: egret.TouchEvent): void {
            const war = this._war;
            if (!war.getIsReview()) {
                war.setIsSinglePlayer(!war.getIsSinglePlayer());
                this._updateGroupIsSinglePlayer();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateListCommand();
            this._updateGroupMapName();
            this._updateGroupMapNameEnglish();
            this._updateGroupMapDesigner();
            this._updateGroupMapSize();
            this._updateGroupIsMultiPlayer();
            this._updateGroupIsSinglePlayer();
            this._updateListPlayer();
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
            this._labelMapNameTitle.text                = Lang.getText(Lang.Type.B0225);
            this._labelMapNameEnglishTitle.text         = Lang.getText(Lang.Type.B0299);
            this._labelMapDesignerTitle.text            = Lang.getText(Lang.Type.B0163);
            this._labelMapSizeTitle.text                = Lang.getText(Lang.Type.B0300);
            this._labelIsMultiPlayerTitle.text          = Lang.getText(Lang.Type.B0137);
            this._labelIsSinglePlayerTitle.text         = Lang.getText(Lang.Type.B0138);
            this._btnBack.label                         = Lang.getText(Lang.Type.B0146);
        }

        private _updateGroupMapName(): void {
            const war                       = this._war;
            this._labelMapName.text         = war.getMapName();
            this._btnModifyMapName.visible  = !war.getIsReview();
        }

        private _updateGroupMapNameEnglish(): void {
            const war                               = this._war;
            this._labelMapNameEnglish.text          = war.getMapNameEnglish();
            this._btnModifyMapNameEnglish.visible   = !war.getIsReview();
        }

        private _updateGroupMapDesigner(): void {
            const war                           = this._war;
            this._labelMapDesigner.text         = war.getMapDesigner();
            this._btnModifyMapDesigner.visible  = !war.getIsReview();
        }

        private _updateGroupMapSize(): void {
            const size              = this._war.getTileMap().getMapSize();
            this._labelMapSize.text = `${size.width} * ${size.height}`;
        }

        private _updateGroupIsMultiPlayer(): void {
            this._imgIsMultiPlayer.visible = this._war.getIsMultiPlayer();
        }

        private _updateGroupIsSinglePlayer(): void {
            this._imgIsSinglePlayer.visible = this._war.getIsSinglePlayer();
        }

        private _updateListPlayer(): void {
            // const war   = this._war;
            // const data  = [] as DataForPlayerRenderer[];
            // war.getPlayerManager().forEachPlayer(false, (player: ScwPlayer) => {
            //     data.push({
            //         war,
            //         player,
            //     });
            // });
            // this._listPlayer.bindData(data);
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
            const dataList = [] as DataForCommandRenderer[];

            const commandSaveMap = this._createCommandSaveMap();
            (commandSaveMap) && (dataList.push(commandSaveMap));

            const commandLoadMap = this._createCommandLoadMap();
            (commandLoadMap) && (dataList.push(commandLoadMap));

            const commandReviewAccept = this._createCommandReviewAccept();
            (commandReviewAccept) && (dataList.push(commandReviewAccept));

            const commandReviewReject = this._createCommandReviewReject();
            (commandReviewReject) && (dataList.push(commandReviewReject));

            const commandOpenAdvancedMenu = this._createCommandOpenAdvancedMenu();
            (commandOpenAdvancedMenu) && (dataList.push(commandOpenAdvancedMenu));

            const commandGotoLobby = this._createCommandGotoLobby();
            (commandGotoLobby) && (dataList.push(commandGotoLobby));

            return dataList;
        }

        private _createDataForAdvancedMenu(): DataForCommandRenderer[] {
            const dataList = [] as DataForCommandRenderer[];

            const commandShowTileAnimation = this._createCommandShowTileAnimation();
            (commandShowTileAnimation) && (dataList.push(commandShowTileAnimation));

            const commandStopTileAnimation = this._createCommandStopTileAnimation();
            (commandStopTileAnimation) && (dataList.push(commandStopTileAnimation));

            const commandResize = this._createCommandResize();
            (commandResize) && (dataList.push(commandResize));

            const commandOffset = this._createCommandOffset();
            (commandOffset) && (dataList.push(commandOffset));

            return dataList;
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

        private _createCommandSaveMap(): DataForCommandRenderer | null {
            if (this._war.getIsReview()) {
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
            if (this._war.getIsReview()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0288),
                    callback: () => {
                        Common.ConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getText(Lang.Type.A0072),
                            callback: () => {
                                const war       = this._war;
                                const slotIndex = war.getSlotIndex();
                                const data      = MeModel.getData(slotIndex);
                                war.stopRunning()
                                    .init(
                                        (data ? data.mapRawData as Types.MapRawData : null) || MeUtility.createDefaultMapRawData(slotIndex),
                                        slotIndex,
                                        war.getConfigVersion(),
                                        war.getIsReview()
                                    )
                                    .startRunning()
                                    .startRunningView();
                                this.close();
                            },
                        })
                    },
                };
            }
        }

        private _createCommandReviewAccept(): DataForCommandRenderer | null {
            if (!this._war.getIsReview()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0296),
                    callback: () => {
                        Common.ConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getText(Lang.Type.A0090),
                            callback: () => {
                                const war = this._war;
                                WarMap.WarMapProxy.reqReviewMap(war.getDesignerUserId(), war.getSlotIndex(), war.getModifiedTime(), true);
                            },
                        });
                    },
                };
            }
        }

        private _createCommandReviewReject(): DataForCommandRenderer | null {
            if (!this._war.getIsReview()) {
                return null;
            } else {
                return {
                    name    : Lang.getText(Lang.Type.B0297),
                    callback: () => {
                        Common.ConfirmPanel.show({
                            title   : Lang.getText(Lang.Type.B0088),
                            content : Lang.getText(Lang.Type.A0091),
                            callback: () => {
                                const war = this._war;
                                WarMap.WarMapProxy.reqReviewMap(war.getDesignerUserId(), war.getSlotIndex(), war.getModifiedTime(), false);
                            },
                        });
                    },
                };
            }
        }

        private _createCommandGotoLobby(): DataForCommandRenderer | undefined {
            return {
                name    : Lang.getText(Lang.Type.B0054),
                callback: () => {
                    ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0054),
                        content : Lang.getText(Lang.Type.A0025),
                        callback: () => FlowManager.gotoLobby(),
                    });
                },
            }
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
                        this._updateView();
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
                        this._updateView();
                    },
                }
            }
        }
        private _createCommandResize(): DataForCommandRenderer | null {
            if (this._war.getIsReview()) {
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
            if (this._war.getIsReview()) {
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
}
