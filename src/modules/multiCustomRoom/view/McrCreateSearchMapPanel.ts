
namespace TinyWars.MultiCustomRoom {
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;

    export class McrCreateSearchMapPanel extends GameUi.UiPanel {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: McrCreateSearchMapPanel;

        private readonly _imgMask                   : GameUi.UiImage;

        private readonly _group                     : eui.Group;
        private readonly _btnReset                  : GameUi.UiButton;
        private readonly _btnSearch                 : GameUi.UiButton;
        private readonly _labelName                 : GameUi.UiLabel;
        private readonly _labelMapNameTitle         : GameUi.UiLabel;
        private readonly _labelDesignerTitle        : GameUi.UiLabel;
        private readonly _labelPlayersCountTitle    : GameUi.UiLabel;
        private readonly _labelPlayedTimesTitle     : GameUi.UiLabel;
        private readonly _labelMinRatingTitle       : GameUi.UiLabel;
        private readonly _labelDesc                 : GameUi.UiLabel;
        private readonly _inputMapName              : GameUi.UiTextInput;
        private readonly _inputDesigner             : GameUi.UiTextInput;
        private readonly _inputPlayersCount         : GameUi.UiTextInput;
        private readonly _inputPlayedTimes          : GameUi.UiTextInput;
        private readonly _inputMinRating            : GameUi.UiTextInput;

        private readonly _labelTagFogTitle          : GameUi.UiLabel;
        private readonly _labelTagFog               : GameUi.UiLabel;
        private readonly _btnTagFog                 : GameUi.UiButton;

        private _mapTag         : ProtoTypes.Map.IDataForMapTag = {};

        public static show(): void {
            if (!McrCreateSearchMapPanel._instance) {
                McrCreateSearchMapPanel._instance = new McrCreateSearchMapPanel();
            }
            McrCreateSearchMapPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McrCreateSearchMapPanel._instance) {
                await McrCreateSearchMapPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateSearchMapPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnReset,   callback: this._onTouchedBtnReset },
                { ui: this._btnSearch,  callback: this._onTouchedBtnSearch },
                { ui: this._btnTagFog,  callback: this._onTouchedBtnTagFog },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onTouchedBtnReset(e: egret.TouchEvent): void {
            McrCreateMapListPanel.getInstance().setMapFilters({});
            this.close();
        }

        private _onTouchedBtnSearch(e: egret.TouchEvent): void {
            const minRatingText = this._inputMinRating.text;
            const minRating     = minRatingText ? Number(minRatingText) : null;
            McrCreateMapListPanel.getInstance().setMapFilters({
                mapName     : this._inputMapName.text || null,
                mapDesigner : this._inputDesigner.text || null,
                playersCount: Number(this._inputPlayersCount.text) || null,
                playedTimes : Number(this._inputPlayedTimes.text) || null,
                minRating   : (minRating == null || isNaN(minRating)) ? null : minRating,
                mapTag      : this._mapTag,
            });

            this.close();
        }

        private _onTouchedBtnTagFog(e: egret.TouchEvent): void {
            const mapTag = this._mapTag;
            const hasFog = mapTag.fog;
            if (hasFog == true) {
                mapTag.fog = false;
            } else if (hasFog == false) {
                mapTag.fog = null;
            } else {
                mapTag.fog = true;
            }
            this._updateLabelTagFog();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(Lang.Type.B0447);
            this._labelMapNameTitle.text        = Lang.getText(Lang.Type.B0225);
            this._labelDesignerTitle.text       = Lang.getText(Lang.Type.B0251);
            this._labelPlayersCountTitle.text   = Lang.getText(Lang.Type.B0229);
            this._labelPlayedTimesTitle.text    = Lang.getText(Lang.Type.B0568);
            this._labelMinRatingTitle.text      = Lang.getText(Lang.Type.B0569);
            this._labelTagFogTitle.text         = Lang.getText(Lang.Type.B0570);
            this._labelDesc.text                = Lang.getText(Lang.Type.A0063);
            this._btnReset.label                = Lang.getText(Lang.Type.B0567);
            this._btnSearch.label               = Lang.getText(Lang.Type.B0228);
            this._updateLabelTagFog();
        }

        private _updateLabelTagFog(): void {
            const hasFog    = this._mapTag.fog;
            const label     = this._labelTagFog;
            if (hasFog == true) {
                label.text = Lang.getText(Lang.Type.B0012);
            } else if (hasFog == false) {
                label.text = Lang.getText(Lang.Type.B0013);
            } else {
                label.text = undefined;
            }
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }
}
