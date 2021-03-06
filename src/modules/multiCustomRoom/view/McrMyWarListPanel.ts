
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarMapModel      = WarMap.WarMapModel;
    import IMpwWarInfo      = ProtoTypes.MultiPlayerWar.IMpwWarInfo;
    import IWarPlayerInfo   = ProtoTypes.Structure.IWarPlayerInfo;

    export class McrMyWarListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMyWarListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableMap;
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
            if (!McrMyWarListPanel._instance) {
                McrMyWarListPanel._instance = new McrMyWarListPanel();
            }
            McrMyWarListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McrMyWarListPanel._instance) {
                await McrMyWarListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/multiCustomRoom/McrMyWarListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMpwCommonGetMyWarInfoList,   callback: this._onMsgMpwCommonGetMyWarInfoList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            MultiPlayerWar.MpwProxy.reqMpwCommonGetMyWarInfoList();
        }

        protected async _onClosed(): Promise<void> {
            this._zoomMap.clearMap()
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
                this._zoomMap.clearMap();
                this._groupInfo.visible = false;
            }
        }
        public getSelectedIndex(): number {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
            const newData        = this._createDataForListWar(MultiPlayerWar.MpwModel.getMyMcwWarInfoList());
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
            this.close();
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

        private _createDataForListWar(warInfoList: IMpwWarInfo[]): DataForWarRenderer[] {
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

        private _createDataForListPlayer(warInfo: IMpwWarInfo, mapExtraData: ProtoTypes.Map.IMapExtraData): DataForPlayerRenderer[] {
            const enterTurnTime     = warInfo.enterTurnTime;
            const playerIndexInTurn = warInfo.playerIndexInTurn;
            const playerInfoList    = warInfo.playerInfoList;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playerInfoList.length; ++playerIndex) {
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
            const mapId                 = warInfo.settingsForMcw.mapId;
            const mapRawData            = await WarMapModel.getRawData(mapId);
            this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(warInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0013));
            this._labelWarComment.text  = warInfo.settingsForMcw.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(warInfo, (await WarMapModel.getBriefData(mapId)).mapExtraData));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            this._zoomMap.showMap(mapRawData);
        }
    }

    type DataForWarRenderer = {
        warInfo : IMpwWarInfo;
        index   : number;
        panel   : McrMyWarListPanel;
    }

    class WarRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _btnFight       : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;
        private _labelInTurn    : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            const btnNext   = this._btnNext;
            const btnFight  = this._btnFight;

            btnNext.label   = Lang.getText(Lang.Type.B0423);
            btnFight.label  = Lang.getText(Lang.Type.B0422);
            btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
            btnFight.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnFight, this);
            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForWarRenderer;
            const warInfo           = data.warInfo;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelInTurn.text  = this._checkIsInTurn(warInfo) ? Lang.getText(Lang.Type.B0231) : "";

            const warName = warInfo.settingsForMcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(warInfo.settingsForMcw.mapId).then(v => this._labelName.text = v);
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            McrMyWarListPanel.hide();
            McrWarInfoPanel.show({ warInfo: data.warInfo });
        }

        private _onTouchedBtnFight(e: egret.Event): void {
            const data = this.data as DataForWarRenderer;
            MultiPlayerWar.MpwProxy.reqMcwCommonContinueWar(data.warInfo.warId);
        }

        private _checkIsInTurn(info: IMpwWarInfo): boolean {
            const playerData = info.playerInfoList.find(v => v.playerIndex === info.playerIndexInTurn);
            return (playerData != null) && (playerData.userId === User.UserModel.getSelfUserId());
        }
    }

    type DataForPlayerRenderer = {
        playerInfo          : IWarPlayerInfo;
        enterTurnTime       : number;
        playerIndexInTurn   : number;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelIndex     : GameUi.UiLabel;
        private _labelName      : GameUi.UiLabel;
        private _labelStatus    : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const playerInfo        = data.playerInfo;
            const playerIndex       = playerInfo.playerIndex;
            const teamIndex         = playerInfo.teamIndex;
            const defeatTimestamp   = data.playerIndexInTurn === playerIndex ? data.enterTurnTime + playerInfo.restTimeToBoot : null;
            const labelIndex        = this._labelIndex;
            const labelName         = this._labelName;
            const labelStatus       = this._labelStatus;
            labelIndex.text         = `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(teamIndex)})`;
            labelName.text          = ``;
            User.UserModel.getUserNickname(playerInfo.userId).then(name => labelName.text = name);

            if (defeatTimestamp != null) {
                const leftTime          = defeatTimestamp - Time.TimeModel.getServerTimestamp();
                labelIndex.textColor    = 0x00FF00;
                labelName.textColor     = 0x00FF00;
                labelStatus.textColor   = 0x00FF00;
                labelStatus.text        = (leftTime > 0
                    ? ` (${Lang.getText(Lang.Type.B0027)}:${Helpers.getTimeDurationText(leftTime)})`
                    : ` (${Lang.getText(Lang.Type.B0028)})`)
            } else {
                labelIndex.textColor    = 0xFFFFFF;
                labelName.textColor     = 0xFFFFFF;
                labelStatus.textColor   = 0xFFFFFF;
                labelStatus.text        = playerInfo.isAlive ? `` : `${name} (${Lang.getText(Lang.Type.B0056)})`;
            }
        }
    }
}
