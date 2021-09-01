
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import UserModel                from "../../user/model/UserModel";
import WwProxy                  from "../model/WwProxy";

namespace TwnsWwMakeRequestDetailPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    type OpenDataForMcrWatchMakeRequestDetailPanel = {
        watchInfo: ProtoTypes.MultiPlayerWar.IMpwWatchInfo;
    };
    export class WwMakeRequestDetailPanel extends TwnsUiPanel.UiPanel<OpenDataForMcrWatchMakeRequestDetailPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WwMakeRequestDetailPanel;

        private readonly _labelMenuTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelYes!         : TwnsUiLabel.UiLabel;
        private readonly _labelNo!          : TwnsUiLabel.UiLabel;
        private readonly _listPlayer!       : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        private _dataForListPlayer  : DataForPlayerRenderer[] | undefined;

        public static show(openData: OpenDataForMcrWatchMakeRequestDetailPanel): void {
            if (!WwMakeRequestDetailPanel._instance) {
                WwMakeRequestDetailPanel._instance = new WwMakeRequestDetailPanel();
            }
            WwMakeRequestDetailPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WwMakeRequestDetailPanel._instance) {
                await WwMakeRequestDetailPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/watchWar/WwMakeRequestDetailPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._dataForListPlayer = this._generateDataForListPlayer();
            this._updateView();
        }

        protected async _onClosed(): Promise<void> {
            this._dataForListPlayer = undefined;
        }

        public setPlayerSelected(playerIndex: number, selected: boolean): void {
            const dataList = this._dataForListPlayer;
            if (dataList) {
                const index         = dataList.findIndex(value => value.playerInfo.playerIndex === playerIndex);
                const data          = dataList[index];
                data.isRequesting   = selected;
                this._listPlayer.updateSingleData(index, data);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(): void {
            const userIds: number[] = [];
            for (const data of this._dataForListPlayer || []) {
                if (data.isRequesting) {
                    const userId = data.playerInfo.userId;
                    (userId != null) && (userIds.push(userId));
                }
            }
            if (userIds.length > 0) {
                const warId = this._getOpenData().watchInfo.warInfo?.warId;
                (warId != null) && (WwProxy.reqWatchMakeRequest(warId, userIds));
            }
            this.close();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._listPlayer.bindData(this._dataForListPlayer || []);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(LangTextType.B0207);
            this._labelYes.text         = Lang.getText(LangTextType.B0012);
            this._labelNo.text          = Lang.getText(LangTextType.B0013);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
        }

        private _generateDataForListPlayer(): DataForPlayerRenderer[] {
            const openData          = this._getOpenData().watchInfo;
            const warInfo           = openData.warInfo;
            const configVersion     = warInfo?.settingsForCommon?.configVersion;
            if (configVersion == null) {
                return [];
            }

            const ongoingDstUserIds = openData.ongoingDstUserIds || [];
            const requestDstUserIds = openData.requestDstUserIds || [];
            const playerInfoList    = warInfo?.playerInfoList || [];

            const dataList: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playerInfoList.length; ++playerIndex) {
                const playerInfo = playerInfoList.find(v => v.playerIndex === playerIndex);
                if (playerInfo == null) {
                    continue;
                }

                const userId = playerInfo.userId;
                if (userId == null) {
                    continue;
                }

                dataList.push({
                    panel           : this,
                    configVersion,
                    playerInfo,
                    isRequested     : requestDstUserIds.indexOf(userId) >= 0,
                    isWatching      : ongoingDstUserIds.indexOf(userId) >= 0,
                    isRequesting    : false,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        panel           : WwMakeRequestDetailPanel;
        configVersion   : string;
        playerInfo      : ProtoTypes.Structure.IWarPlayerInfo;
        isRequested     : boolean;
        isWatching      : boolean;
        isRequesting    : boolean;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _labelIndex!   : TwnsUiLabel.UiLabel;
        private readonly _labelTeam!    : TwnsUiLabel.UiLabel;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelState!   : TwnsUiLabel.UiLabel;
        private readonly _imgAccept!    : TwnsUiImage.UiImage;
        private readonly _imgDecline!   : TwnsUiImage.UiImage;

        protected async _onDataChanged(): Promise<void> {
            const data              = this._getData();
            const playerInfo        = data.playerInfo;
            const playerIndex       = playerInfo.playerIndex;
            const teamIndex         = playerInfo.teamIndex;
            this._labelIndex.text   = playerIndex == null ? CommonConstants.ErrorTextForUndefined : Lang.getPlayerForceName(playerIndex);
            this._labelTeam.text    = (teamIndex == null ? null : Lang.getPlayerTeamName(teamIndex)) || CommonConstants.ErrorTextForUndefined;

            if (!playerInfo.isAlive) {
                this._imgAccept.visible     = false;
                this._imgDecline.visible    = false;
                this._labelState.visible    = true;
                this._labelState.text       = `(${Lang.getText(LangTextType.B0056)})`;
            } else {
                if (playerInfo.userId === UserModel.getSelfUserId()) {
                    this._imgAccept.visible     = false;
                    this._imgDecline.visible    = false;
                    this._labelState.visible    = true;
                    this._labelState.text       = `(${Lang.getText(LangTextType.B0216)})`;
                } else {
                    if (data.isRequested) {
                        this._imgAccept.visible     = false;
                        this._imgDecline.visible    = false;
                        this._labelState.visible    = true;
                        this._labelState.text       = `${Lang.getText(LangTextType.B0212)}`;
                    } else {
                        if (data.isWatching) {
                            this._imgAccept.visible     = false;
                            this._imgDecline.visible    = false;
                            this._labelState.visible    = true;
                            this._labelState.text       = `${Lang.getText(LangTextType.B0213)}`;
                        } else {
                            this._imgAccept.visible     = data.isRequesting;
                            this._imgDecline.visible    = !data.isRequesting;
                            this._labelState.visible    = false;
                        }
                    }
                }
            }

            const userId    = playerInfo.userId;
            const labelName = this._labelName;
            const coName    = ConfigManager.getCoNameAndTierText(data.configVersion, Helpers.getExisted(playerInfo.coId));
            if (userId == null) {
                labelName.text = `${Lang.getText(LangTextType.B0607)} ${coName}`;
            } else {
                labelName.text = `${await UserModel.getUserNickname(userId)} ${coName}`;
            }
        }

        public onItemTapEvent(): void {
            if ((this._imgAccept.visible) || (this._imgDecline.visible)) {
                const data          = this._getData();
                const playerIndex   = data.playerInfo.playerIndex;
                (playerIndex != null) && (data.panel.setPlayerSelected(playerIndex, !data.isRequesting));
            }
        }
    }
}

export default TwnsWwMakeRequestDetailPanel;
