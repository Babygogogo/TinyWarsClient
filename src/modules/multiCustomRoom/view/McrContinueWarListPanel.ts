
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarMapModel      = WarMap.WarMapModel;
    import IMcwWarInfo      = ProtoTypes.MultiCustomWar.IMcwWarInfo;
    import IWarPlayerInfo   = ProtoTypes.Structure.IWarPlayerInfo;

    export class McrContinueWarListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrContinueWarListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo              : eui.Group;
        private _labelMapName           : GameUi.UiLabel;
        private _labelDesigner          : GameUi.UiLabel;
        private _labelHasFog            : GameUi.UiLabel;
        private _labelWarCommentTitle   : GameUi.UiLabel;
        private _labelWarComment        : GameUi.UiLabel;
        private _labelPlayers           : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrContinueWarListPanel._instance) {
                McrContinueWarListPanel._instance = new McrContinueWarListPanel();
            }
            McrContinueWarListPanel._instance.open();
        }
        public static hide(): void {
            if (McrContinueWarListPanel._instance) {
                McrContinueWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrContinueWarListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.SMcwCommonGetWarInfoList,  callback: this._onNotifySMcrGetJoinedOngoingInfos },
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected _onOpened(): void {
            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);
            this._updateComponentsForLanguage();

            McrProxy.reqMcwCommonGetWarInfoList();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
            this._listWar.clear();
            this._listPlayer.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const dataList         = this._dataForListWar;
            this._selectedWarIndex = dataList[newIndex] ? newIndex : undefined;

            if (dataList[oldIndex]) {
                this._listWar.updateSingleData(oldIndex, dataList[oldIndex])
            };

            if (dataList[newIndex]) {
                this._listWar.updateSingleData(newIndex, dataList[newIndex]);
                await this._showMap(newIndex);
            } else {
                this._zoomMap.removeAllContents();
                this._groupInfo.visible = false;
            }
        }
        public getSelectedIndex(): number {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifySMcrGetJoinedOngoingInfos(e: egret.Event): void {
            const newData        = this._createDataForListWar(McrModel.getOngoingWarInfoList());
            this._dataForListWar = newData;

            if (newData.length > 0) {
                this._labelNoWar.visible = false;
                this._listWar.bindData(newData);
            } else {
                this._labelNoWar.visible = true;
                this._listWar.clear();
            }
            this.setSelectedIndex(0);
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrContinueWarListPanel.hide();
            McrMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0024);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelWarCommentTitle.text = `${Lang.getText(Lang.Type.B0187)}:`;
            this._labelPlayers.text         = `${Lang.getText(Lang.Type.B0232)}:`;
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
        }

        private _createDataForListWar(warInfoList: IMcwWarInfo[]): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            if (warInfoList) {
                for (let i = 0; i < warInfoList.length; ++i) {
                    data.push({
                        warInfo : warInfoList[i],
                        index   : i,
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private _createDataForListPlayer(warInfo: IMcwWarInfo, mapExtraData: ProtoTypes.Map.IMapExtraData): DataForPlayerRenderer[] {
            const enterTurnTime     = warInfo.enterTurnTime;
            const playerIndexInTurn = warInfo.playerIndexInTurn;
            const playerInfoList    = warInfo.playerInfoList;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex < playerInfoList.length; ++playerIndex) {
                dataList.push({
                    playerInfo      : playerInfoList.find(v => v.playerIndex === playerIndex),
                    enterTurnTime,
                    playerIndexInTurn,
                });
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const warInfo               = this._dataForListWar[index].warInfo;
            const settingsForCommon     = warInfo.settingsForCommon;
            const mapId                 = settingsForCommon.mapId;
            const mapRawData            = await WarMapModel.getRawData(mapId);
            const mapExtraData          = await WarMapModel.getExtraData(mapId);
            this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0013));
            this._labelWarComment.text  = warInfo.settingsForMultiPlayer.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, mapExtraData));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
            tileMapView.updateWithTileDataList(mapRawData.tileDataList);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithMapRawData(mapRawData);

            const gridSize = Utility.ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapRawData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapRawData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    type DataForWarRenderer = {
        warInfo : IMcwWarInfo;
        index   : number;
        panel   : McrContinueWarListPanel;
    }

    class WarRenderer extends eui.ItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;
        private _labelInTurn    : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForWarRenderer;
            const warInfo           = data.warInfo;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelInTurn.text  = this._checkIsInTurn(warInfo) ? Lang.getText(Lang.Type.B0231) : "";

            const warName = warInfo.settingsForMultiPlayer.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(warInfo.settingsForCommon.mapId).then(v => this._labelName.text = v);
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            McrContinueWarListPanel.hide();
            McrContinueWarInfoPanel.show(data.warInfo);
        }

        private _checkIsInTurn(info: IMcwWarInfo): boolean {
            return info.playerInfoList.find(v => v.playerIndex === info.playerIndexInTurn).userId === User.UserModel.getSelfUserId();
        }
    }

    type DataForPlayerRenderer = {
        playerInfo          : IWarPlayerInfo;
        enterTurnTime       : number;
        playerIndexInTurn   : number;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelName      : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;
        private _labelSkinId    : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const playerInfo        = data.playerInfo;
            const playerIndex       = playerInfo.playerIndex;
            const teamIndex         = playerInfo.teamIndex;
            const defeatTimestamp   = data.playerIndexInTurn === playerIndex ? data.enterTurnTime + playerInfo.restTimeToBoot : null;
            const labelIndex        = this._labelIndex;
            const labelSkinId       = this._labelSkinId;
            const labelName         = this._labelName;
            labelIndex.text         = `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(teamIndex)})`;
            labelSkinId.text        = `${Lang.getUnitAndTileSkinName(playerInfo.unitAndTileSkinId)}`;

            if (defeatTimestamp != null) {
                const leftTime          = defeatTimestamp - Time.TimeModel.getServerTimestamp();
                labelIndex.textColor    = 0x00FF00;
                labelSkinId.textColor   = 0x00FF00
                labelName.textColor     = 0x00FF00;
                User.UserModel.getUserNickname(playerInfo.userId).then(name => {
                    labelName.text = name + (leftTime > 0
                        ? ` (${Lang.getText(Lang.Type.B0027)}:${Helpers.getTimeDurationText(leftTime)})`
                        : ` (${Lang.getText(Lang.Type.B0028)})`);
                });
            } else {
                labelIndex.textColor    = 0xFFFFFF;
                labelSkinId.textColor   = 0xFFFFFF;
                labelName.textColor     = 0xFFFFFF;
                User.UserModel.getUserNickname(playerInfo.userId).then(name => {
                    labelName.text = playerInfo.isAlive
                        ? name
                        : `${name} (${Lang.getText(Lang.Type.B0056)})`;
                });
            }
        }
    }
}
