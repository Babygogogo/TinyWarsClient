
namespace TinyWars.RankMatchRoom {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import Logger           = Utility.Logger;
    import IRmrRoomInfo     = ProtoTypes.RankMatchRoom.IRmrRoomInfo;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class RmrRoomAvailableCoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud2;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RmrRoomAvailableCoPanel;

        private _labelAvailableCoTitle  : TinyWars.GameUi.UiLabel;
        private _groupCoTiers           : eui.Group;
        private _groupCoNames           : eui.Group;
        private _btnCancel              : TinyWars.GameUi.UiButton;
        private _btnConfirm             : TinyWars.GameUi.UiButton;

        private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        private _roomInfo               : IRmrRoomInfo;
        private _srcPlayerIndex         : number;
        private _availableCoIdSet       = new Set<number>();
        private _allCoIdSet             = new Set<number>();

        public static show(roomInfo: IRmrRoomInfo, srcPlayerIndex: number): void {
            if (!RmrRoomAvailableCoPanel._instance) {
                RmrRoomAvailableCoPanel._instance = new RmrRoomAvailableCoPanel();
            }
            const instance              = RmrRoomAvailableCoPanel._instance;
            instance._roomInfo          = roomInfo;
            instance._srcPlayerIndex    = srcPlayerIndex;
            instance.open();
        }

        public static hide(): void {
            if (RmrRoomAvailableCoPanel._instance) {
                RmrRoomAvailableCoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/rankMatchRoom/RmrRoomAvailableCoPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
        }

        protected _onFirstOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgRmrDeleteRoom,   callback: this._onMsgRmrDeleteRoom },
            ]);
        }

        protected _onOpened(): void {
            const availableCoIdSet  = this._availableCoIdSet;
            const allCoIdSet        = this._allCoIdSet;
            availableCoIdSet.clear();
            allCoIdSet.clear();
            for (const coId of generateAvailableCoIdList(this._roomInfo, this._srcPlayerIndex)) {
                availableCoIdSet.add(coId);
                allCoIdSet.add(coId);
            }

            this._updateComponentsForLanguage();
            this._initGroupCoTiers();
            this._initGroupCoNames();
        }

        protected _onClosed(): void {
            this._clearGroupCoTiers();
            this._clearGroupCoNames();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgRmrDeleteRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgRmrDeleteRoom.IS;
            if (data.roomId === this._roomInfo.roomId) {
                this.close();
            }
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const availableCoIdSet = this._availableCoIdSet;
            if (!availableCoIdSet.has(CommonConstants.CoEmptyId)) {
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0130),
                });
                return;
            }

            const bannedCoIdList: number[] = [];
            for (const coId of this._allCoIdSet) {
                if (!availableCoIdSet.has(coId)) {
                    bannedCoIdList.push(coId);
                }
            }

            const bannedCoCount = bannedCoIdList.length;
            if (bannedCoCount > CommonConstants.RankMaxBanCoCount) {
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getFormattedText(Lang.Type.F0031, CommonConstants.RankMaxBanCoCount),
                });
                return;
            }

            const roomInfo = this._roomInfo;
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : bannedCoCount
                    ? Lang.getText(Lang.Type.A0138) + `\n${generateCoNameList(roomInfo.settingsForCommon.configVersion, bannedCoIdList)}`
                    : Lang.getText(Lang.Type.A0139),
                callback: () => {
                    RmrProxy.reqRmrSetBannedCoIdList(roomInfo.roomId, bannedCoIdList);
                    this.close();
                },
            });
        }

        private _onTouchedCoTierRenderer(e: egret.TouchEvent): void {
            const renderer          = e.currentTarget as RendererForCoTier;
            const availableCoIdSet  = this._availableCoIdSet;
            const allCoIdSet        = this._allCoIdSet;
            const configVersion     = this._roomInfo.settingsForCommon.configVersion;
            const coIdList          = renderer.getIsCustomSwitch()
                ? ConfigManager.getAvailableCustomCoIdList(configVersion).filter(v => allCoIdSet.has(v))
                : ConfigManager.getAvailableCoIdListInTier(configVersion, renderer.getCoTier()).filter(v => allCoIdSet.has(v));

            if (renderer.getState() === CoTierState.Unavailable) {
                for (const coId of coIdList) {
                    availableCoIdSet.add(coId);
                }
                this._updateGroupCoTiers();
                this._updateGroupCoNames();

            } else {
                for (const coId of coIdList) {
                    availableCoIdSet.delete(coId);
                }
                this._updateGroupCoTiers();
                this._updateGroupCoNames();
            }
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer          = e.currentTarget as RendererForCoName;
            const coId              = renderer.getCoId();
            const availableCoIdSet  = this._availableCoIdSet;

            if (!renderer.getIsSelected()) {
                availableCoIdSet.add(coId);
                this._updateGroupCoTiers();
                this._updateGroupCoNames();

            } else {
                availableCoIdSet.delete(coId);
                this._updateGroupCoTiers();
                this._updateGroupCoNames();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._labelAvailableCoTitle.text    = Lang.getText(Lang.Type.B0238);
        }

        private _initGroupCoTiers(): void {
            for (const tier of ConfigManager.getCoTiers(this._roomInfo.settingsForCommon.configVersion)) {
                const renderer = new RendererForCoTier();
                renderer.setCoTier(tier);
                renderer.setState(CoTierState.AllAvailable);
                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
                this._renderersForCoTiers.push(renderer);
                this._groupCoTiers.addChild(renderer);
            }

            const rendererForCustomCo = new RendererForCoTier();
            rendererForCustomCo.setIsCustomSwitch(true);
            rendererForCustomCo.setState(CoTierState.AllAvailable);
            rendererForCustomCo.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
            this._renderersForCoTiers.push(rendererForCustomCo);
            this._groupCoTiers.addChild(rendererForCustomCo);

            this._updateGroupCoTiers();
        }

        private _clearGroupCoTiers(): void {
            this._groupCoTiers.removeChildren();
            this._renderersForCoTiers.length = 0;
        }

        private _updateGroupCoTiers(): void {
            const availableCoIdSet  = this._availableCoIdSet;
            const allCoIdSet        = this._allCoIdSet;
            const configVersion     = this._roomInfo.settingsForCommon.configVersion;
            for (const renderer of this._renderersForCoTiers) {
                const includedCoIdList = renderer.getIsCustomSwitch()
                    ? ConfigManager.getAvailableCustomCoIdList(configVersion).filter(v => allCoIdSet.has(v))
                    : ConfigManager.getAvailableCoIdListInTier(configVersion, renderer.getCoTier()).filter(v => allCoIdSet.has(v));

                if (includedCoIdList.length <= 0) {
                    renderer.setState(CoTierState.Unavailable);
                } else {
                    if (includedCoIdList.every(coId => availableCoIdSet.has(coId))) {
                        renderer.setState(CoTierState.AllAvailable);
                    } else if (includedCoIdList.every(coId => !availableCoIdSet.has(coId))) {
                        renderer.setState(CoTierState.Unavailable);
                    } else {
                        renderer.setState(CoTierState.PartialAvailable);
                    }
                }
            }
        }

        private _initGroupCoNames(): void {
            const configVersion = this._roomInfo.settingsForCommon.configVersion;
            for (const coId of this._allCoIdSet) {
                const renderer = new RendererForCoName();
                renderer.setConfigVersion(configVersion);
                renderer.setCoId(coId);
                renderer.setIsSelected(true);

                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoNameRenderer, this);
                this._renderersForCoNames.push(renderer);
                this._groupCoNames.addChild(renderer);
            }

            this._updateGroupCoNames();
        }

        private _clearGroupCoNames(): void {
            this._groupCoNames.removeChildren();
            this._renderersForCoNames.length = 0;
        }

        private _updateGroupCoNames(): void {
            const availableCoIdSet = this._availableCoIdSet;
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsSelected(availableCoIdSet.has(renderer.getCoId()));
            }
        }
    }

    const enum CoTierState {
        AllAvailable,
        PartialAvailable,
        Unavailable,
    }

    class RendererForCoTier extends GameUi.UiListItemRenderer {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _tier           : number;
        private _isCustomSwitch = false;
        private _state          : CoTierState;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/CheckBox1.exml";
        }

        public setCoTier(tier: number): void {
            this._tier              = tier;
            this._labelName.text    = `Tier ${tier}`;
        }
        public getCoTier(): number {
            return this._tier;
        }

        public setIsCustomSwitch(isCustomSwitch: boolean): void {
            this._isCustomSwitch    = isCustomSwitch;
            this._labelName.text    = "Custom";
        }
        public getIsCustomSwitch(): boolean {
            return this._isCustomSwitch;
        }

        public setState(state: CoTierState): void {
            this._state = state;
            if (state === CoTierState.AllAvailable) {
                this._labelName.textColor = 0x00FF00;
            } else if (state === CoTierState.PartialAvailable) {
                this._labelName.textColor = 0xFFFF00;
            } else {
                this._labelName.textColor = 0xFF0000;
            }
            Helpers.changeColor(this._imgSelected, state === CoTierState.AllAvailable ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getState(): CoTierState {
            return this._state;
        }
    }

    class RendererForCoName extends GameUi.UiListItemRenderer {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _coId           : number;
        private _configVersion  : string;
        private _isSelected     : boolean;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/CheckBox1.exml";
        }

        public setConfigVersion(version: string): void {
            this._configVersion = version;
        }

        public setCoId(coId: number): void {
            this._coId = coId;

            const cfg               = ConfigManager.getCoBasicCfg(this._configVersion, coId);
            this._labelName.text    = `${cfg.name} (T${cfg.tier})`;
        }
        public getCoId(): number {
            return this._coId;
        }

        public setIsSelected(isSelected: boolean): void {
            this._isSelected            = isSelected;
            this._labelName.textColor   = isSelected ? 0x00ff00 : 0xff0000;
            Helpers.changeColor(this._imgSelected, isSelected ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getIsSelected(): boolean {
            return this._isSelected;
        }
    }

    function generateAvailableCoIdList(roomInfo: IRmrRoomInfo, srcPlayerIndex: number): Set<number> {
        const coIds = new Set<number>();
        for (const playerRule of roomInfo.settingsForCommon.warRule.ruleForPlayers.playerRuleDataList) {
            if (playerRule.playerIndex !== srcPlayerIndex) {
                for (const coId of playerRule.availableCoIdList) {
                    coIds.add(coId);
                }
            }
        }
        return coIds;
    }

    function generateCoNameList(configVersion: string, coIdList: number[]): string {
        const nameList: string[] = [];
        for (const coId of coIdList) {
            const name = ConfigManager.getCoNameAndTierText(configVersion, coId);
            if (name == null) {
                Logger.error(`RmrRoomAvailableCoPanel.generateCoNameList() invalid coId.`);
                return undefined;
            }

            nameList.push(name);
        }
        return nameList.join(`\n`);
    }
}
