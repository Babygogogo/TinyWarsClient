
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import WarEventHelper               from "../model/WarEventHelper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;

    export type OpenDataForWeActionModifyPanel40 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel40 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel40> {
        private readonly _labelTitle!                       : TwnsUiLabel.UiLabel;
        private readonly _btnType!                          : TwnsUiButton.UiButton;
        private readonly _btnClose!                         : TwnsUiButton.UiButton;
        private readonly _labelDesc!                        : TwnsUiLabel.UiLabel;
        private readonly _labelError!                       : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                : TwnsUiImage.UiImage;

        private readonly _btnLocation!                      : TwnsUiButton.UiButton;
        private readonly _labelLocation!                    : TwnsUiLabel.UiLabel;
        private readonly _btnGridIndex!                     : TwnsUiButton.UiButton;
        private readonly _labelGridIndex!                   : TwnsUiLabel.UiLabel;
        private readonly _btnConIsHighlighted!              : TwnsUiButton.UiButton;
        private readonly _labelConIsHighlighted!            : TwnsUiLabel.UiLabel;

        private readonly _btnPlayerIndex!                   : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!                 : TwnsUiLabel.UiLabel;
        private readonly _btnConIsPlayerInTurn!             : TwnsUiButton.UiButton;
        private readonly _labelConIsPlayerInTurn!           : TwnsUiLabel.UiLabel;

        private readonly _btnConTileType!                   : TwnsUiButton.UiButton;
        private readonly _labelConTileType!                 : TwnsUiLabel.UiLabel;

        private readonly _btnDestroyUnit!                   : TwnsUiButton.UiButton;
        private readonly _labelDestroyUnit!                 : TwnsUiLabel.UiLabel;

        private readonly _btnActIsModifyTileBase!           : TwnsUiButton.UiButton;
        private readonly _labelActIsModifyTileBase!         : TwnsUiLabel.UiLabel;
        private readonly _btnActTileBase!                   : TwnsUiButton.UiButton;
        private readonly _conActTileBase!                   : eui.Group;

        private readonly _btnActIsModifyTileDecorator!      : TwnsUiButton.UiButton;
        private readonly _labelActIsModifyTileDecorator!    : TwnsUiLabel.UiLabel;
        private readonly _btnActTileDecorator!              : TwnsUiButton.UiButton;
        private readonly _btnDeleteActTileDecorator!        : TwnsUiButton.UiButton;
        private readonly _conActTileDecorator!              : eui.Group;

        private readonly _btnActIsModifyTileObject!         : TwnsUiButton.UiButton;
        private readonly _labelActIsModifyTileObject!       : TwnsUiLabel.UiLabel;
        private readonly _btnActTileObject!                 : TwnsUiButton.UiButton;
        private readonly _btnDeleteActTileObject!           : TwnsUiButton.UiButton;
        private readonly _conActTileObject!                 : eui.Group;

        private readonly _btnActIsHighlighted!              : TwnsUiButton.UiButton;
        private readonly _labelActIsHighlighted!            : TwnsUiLabel.UiLabel;

        private readonly _tileView                      = new MapEditor.MeTileSimpleView();

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
                { type: NotifyType.TileAnimationTick,           callback: this._onNotifyTileAnimationTick },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                           callback: this.close },
                { ui: this._btnType,                            callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,                  callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnLocation,                        callback: this._onTouchedBtnLocation },
                { ui: this._btnGridIndex,                       callback: this._onTouchedBtnGridIndex },
                { ui: this._btnConIsHighlighted,                callback: this._onTouchedBtnConIsHighlighted },

                { ui: this._btnPlayerIndex,                     callback: this._onTouchedBtnPlayerIndex },
                { ui: this._btnConIsPlayerInTurn,               callback: this._onTouchedBtnConIsPlayerInTurn },

                { ui: this._btnConTileType,                     callback: this._onTouchedBtnConTileType },

                { ui: this._btnDestroyUnit,                     callback: this._onTouchedBtnDestroyUnit },
                { ui: this._btnActIsHighlighted,                callback: this._onTouchedBtnActIsHighlighted },

                { ui: this._btnActIsModifyTileBase,             callback: this._onTouchedBtnActIsModifyTileBase },
                { ui: this._btnActTileBase,                     callback: this._onTouchedBtnActTileBase },

                { ui: this._btnActIsModifyTileDecorator,        callback: this._onTouchedBtnActIsModifyTileDecorator },
                { ui: this._btnActTileDecorator,                callback: this._onTouchedBtnActTileDecorator },
                { ui: this._btnDeleteActTileDecorator,          callback: this._onTouchedBtnDeleteActTileDecorator },

                { ui: this._btnActIsModifyTileObject,           callback: this._onTouchedBtnActIsModifyTileObject },
                { ui: this._btnActTileObject,                   callback: this._onTouchedBtnActTileObject },
                { ui: this._btnDeleteActTileObject,             callback: this._onTouchedBtnDeleteActTileObject },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._imgInnerTouchMask.touchEnabled = true;
            this._setInnerTouchMaskEnabled(false);

            const tileView = this._tileView;
            this._conActTileBase.addChild(tileView.getImgBase());
            this._conActTileObject.addChild(tileView.getImgObject());
            this._conActTileDecorator.addChild(tileView.getImgDecorator());
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyWarEventFullDataChanged(): void {
            this._updateView();
        }
        private _onNotifyTileAnimationTick(): void {
            this._updateTileView();
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            PanelHelpers.open(PanelHelpers.PanelDict.WeActionTypeListPanel, {
                fullData    : openData.fullData,
                action      : openData.action,
                war         : openData.war,
            });
        }
        private _onTouchedImgInnerTouchMask(): void {
            this._setInnerTouchMaskEnabled(false);
        }
        private _onTouchedBtnLocation(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseLocationPanel, {
                currentLocationIdArray  : action.conLocationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    action.conLocationIdArray = locationIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnGridIndex(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseGridIndexPanel, {
                currentGridIndexArray   : Helpers.getNonNullElements(action.conGridIndexArray?.map(v => GridIndexHelpers.convertGridIndex(v)) ?? []),
                mapSize                 : this._getOpenData().war.getTileMap().getMapSize(),
                callbackOnConfirm       : gridIndexArray => {
                    action.conGridIndexArray = gridIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnConIsHighlighted(): void {
            const action            = this._getAction();
            const conIsHighlighted  = action.conIsHighlighted;
            if (conIsHighlighted === true) {
                action.conIsHighlighted = false;
            } else if (conIsHighlighted === false) {
                action.conIsHighlighted = null;
            } else {
                action.conIsHighlighted = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnPlayerIndex(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : action.conPlayerIndexArray ?? [],
                maxPlayerIndex          : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    action.conPlayerIndexArray = playerIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnConIsPlayerInTurn(): void {
            const action                    = this._getAction();
            const conIsOwnerPlayerInTurn    = action.conIsOwnerPlayerInTurn;
            if (conIsOwnerPlayerInTurn == null) {
                action.conIsOwnerPlayerInTurn = true;
            } else if (conIsOwnerPlayerInTurn) {
                action.conIsOwnerPlayerInTurn = false;
            } else {
                action.conIsOwnerPlayerInTurn = null;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnConTileType(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseTileTypePanel, {
                gameConfig              : this._getOpenData().war.getGameConfig(),
                currentTileTypeArray    : action.conTileTypeArray ?? [],
                callbackOnConfirm       : tileTypeArray => {
                    action.conTileTypeArray = tileTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnDestroyUnit(): void {
            const action          = this._getAction();
            action.actDestroyUnit = !action.actDestroyUnit;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnActIsModifyTileBase(): void {
            const action                = this._getAction();
            action.actIsModifyTileBase  = !action.actIsModifyTileBase;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActTileBase(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseTileBasePanel, {
                gameConfig  : this._getOpenData().war.getGameConfig(),
                callback    : (baseType, baseShapeId) => {
                    const tileData          = Helpers.getExisted(this._getAction().actTileData);
                    tileData.baseType       = baseType;
                    tileData.baseShapeId    = baseShapeId;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnActIsModifyTileDecorator(): void {
            const action                    = this._getAction();
            action.actIsModifyTileDecorator = !action.actIsModifyTileDecorator;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActTileDecorator(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseTileDecorationPanel, {
                gameConfig  : this._getOpenData().war.getGameConfig(),
                callback    : (decoratorType, decoratorShapeId) => {
                    const tileData              = Helpers.getExisted(this._getAction().actTileData);
                    tileData.decoratorType      = decoratorType;
                    tileData.decoratorShapeId   = decoratorShapeId;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeleteActTileDecorator(): void {
            const tileData              = Helpers.getExisted(this._getAction().actTileData);
            tileData.decoratorType      = null;
            tileData.decoratorShapeId   = null;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnActIsModifyTileObject(): void {
            const action                    = this._getAction();
            action.actIsModifyTileObject    = !action.actIsModifyTileObject;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActTileObject(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseTileObjectPanel, {
                gameConfig  : this._getOpenData().war.getGameConfig(),
                callback    : (objectType, objectShapeId, playerIndex) => {
                    const tileData          = Helpers.getExisted(this._getAction().actTileData);
                    tileData.objectType     = objectType;
                    tileData.objectShapeId  = objectShapeId;
                    tileData.playerIndex    = playerIndex;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnDeleteActTileObject(): void {
            const tileData          = Helpers.getExisted(this._getAction().actTileData);
            tileData.objectType     = CommonConstants.TileObjectType.Empty;
            tileData.objectShapeId  = null;
            tileData.playerIndex    = CommonConstants.PlayerIndex.Neutral;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActIsHighlighted(): void {
            const tileData          = Helpers.getExisted(this._getAction().actTileData);
            const actIsHighlighted  = tileData.isHighlighted;
            if (actIsHighlighted === true) {
                tileData.isHighlighted = false;
            } else if (actIsHighlighted === false) {
                tileData.isHighlighted = null;
            } else {
                tileData.isHighlighted = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelLocation();
            this._updateLabelGridIndex();
            this._updateLabelConIsHighlighted();

            this._updateLabelPlayerIndex();
            this._updateLabelConIsPlayerInTurn();

            this._updateLabelConTileType();

            this._updateLabelDestroyUnit();
            this._updateTileView();
            this._updateLabelActIsHighlighted();
            this._updateLabelActIsModifyTileBase();
            this._updateLabelActIsModifyTileDecorator();
            this._updateLabelActIsModifyTileObject();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                           = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnClose.label                            = Lang.getText(LangTextType.B0146);
            this._btnType.label                             = Lang.getText(LangTextType.B0516);
            this._btnLocation.label                         = Lang.getText(LangTextType.B0764);
            this._btnGridIndex.label                        = Lang.getText(LangTextType.B0531);
            this._btnConIsHighlighted.label                 = Lang.getText(LangTextType.B0847);

            this._btnPlayerIndex.label                      = Lang.getText(LangTextType.B0031);
            this._btnConIsPlayerInTurn.label                = Lang.getText(LangTextType.B0086);

            this._btnConTileType.label                      = Lang.getText(LangTextType.B0718);

            this._btnDestroyUnit.label                      = Lang.getText(LangTextType.B0826);
            this._btnActIsHighlighted.label                 = Lang.getText(LangTextType.B0847);

            this._btnActIsModifyTileBase.label              = Lang.getText(LangTextType.B0850);
            this._btnActTileBase.label                      = Lang.getText(LangTextType.B0302);

            this._btnActIsModifyTileDecorator.label         = Lang.getText(LangTextType.B0851);
            this._btnActTileDecorator.label                 = Lang.getText(LangTextType.B0664);
            this._btnDeleteActTileDecorator.label           = Lang.getText(LangTextType.B0220);

            this._btnActIsModifyTileObject.label            = Lang.getText(LangTextType.B0852);
            this._btnActTileObject.label                    = Lang.getText(LangTextType.B0303);
            this._btnDeleteActTileObject.label              = Lang.getText(LangTextType.B0220);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForAction(openData.fullData, action, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForAction(action, war.getGameConfig()) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateLabelLocation(): void {
            const locationIdArray       = this._getAction().conLocationIdArray;
            this._labelLocation.text    = locationIdArray?.length ? locationIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelGridIndex(): void {
            const gridIndexArray        = this._getAction().conGridIndexArray;
            this._labelGridIndex.text   = gridIndexArray?.length ? gridIndexArray.map(v => `(${v.x},${v.y})`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelConIsHighlighted(): void {
            const isHighlighted = this._getAction().conIsHighlighted;
            const label         = this._labelConIsHighlighted;
            if (isHighlighted == null) {
                label.text  = `--`;
            } else {
                label.text = Lang.getText(isHighlighted ? LangTextType.B0012 : LangTextType.B0013);
            }
        }

        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getAction().conPlayerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelConIsPlayerInTurn(): void {
            const conIsOwnerPlayerInTurn    = this._getAction().conIsOwnerPlayerInTurn;
            const label                     = this._labelConIsPlayerInTurn;
            if (conIsOwnerPlayerInTurn == null) {
                label.text = `--`;
            } else {
                label.text = Lang.getText(conIsOwnerPlayerInTurn ? LangTextType.B0012 : LangTextType.B0013);
            }
        }

        private _updateLabelConTileType(): void {
            const conTileTypeArray      = this._getAction().conTileTypeArray;
            const gameConfig            = this._getOpenData().war.getGameConfig();
            this._labelConTileType.text = conTileTypeArray?.length ? conTileTypeArray.map(v => Lang.getTileName(v, gameConfig)).join(`, `) : Lang.getText(LangTextType.B0776);
        }

        private _updateLabelDestroyUnit(): void {
            this._labelDestroyUnit.text = Lang.getText(this._getAction().actDestroyUnit ? LangTextType.B0012 : LangTextType.B0013);
        }
        private _updateTileView(): void {
            const tileData  = Helpers.getExisted(this._getAction().actTileData);
            const tileView  = this._tileView;
            tileView.init({
                tileBaseType        : tileData.baseType ?? null,
                tileBaseShapeId     : tileData.baseShapeId ?? 0,
                tileObjectType      : tileData.objectType ?? null,
                tileObjectShapeId   : tileData.objectShapeId ?? null,
                tileDecoratorType   : tileData.decoratorType ?? null,
                tileDecoratorShapeId: tileData.decoratorShapeId ?? null,
                playerIndex         : Helpers.getExisted(tileData.playerIndex),
                gameConfig          : this._getOpenData().war.getGameConfig(),
            });
            tileView.updateView();
        }
        private _updateLabelActIsHighlighted(): void {
            const isHighlighted = this._getAction().actTileData?.isHighlighted;
            const label         = this._labelActIsHighlighted;
            if (isHighlighted == null) {
                label.text  = `--`;
            } else {
                label.text = Lang.getText(isHighlighted ? LangTextType.B0012 : LangTextType.B0013);
            }
        }
        private _updateLabelActIsModifyTileBase(): void {
            const isModify                      = this._getAction().actIsModifyTileBase;
            this._labelActIsModifyTileBase.text = Lang.getText((isModify) || (isModify == null) ? LangTextType.B0012 : LangTextType.B0013);
        }
        private _updateLabelActIsModifyTileDecorator(): void {
            const isModify                              = this._getAction().actIsModifyTileDecorator;
            this._labelActIsModifyTileDecorator.text    = Lang.getText((isModify) || (isModify == null) ? LangTextType.B0012 : LangTextType.B0013);
        }
        private _updateLabelActIsModifyTileObject(): void {
            const isModify                          = this._getAction().actIsModifyTileObject;
            this._labelActIsModifyTileObject.text   = Lang.getText((isModify) || (isModify == null) ? LangTextType.B0012 : LangTextType.B0013);
        }


        private _getAction(): CommonProto.WarEvent.IWeaSetTileType {
            return Helpers.getExisted(this._getOpenData().action.WeaSetTileType);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}
