
// import TwnsCommonCoListPanel    from "../../common/view/CommonCoListPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import NotifyData               from "../../tools/notify/NotifyData";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsBwWar                from "../model/BwWar";
// import TwnsBwProduceUnitPanel   from "./BwProduceUnitPanel";
// import TwnsBwTileDetailPanel    from "./BwTileDetailPanel";
// import TwnsBwTileView           from "./BwTileView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType           = Notify.NotifyType;

    const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
    const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
    // const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
    // const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
    // const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
    // const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
    // const _CELL_WIDTH           = 80;

    export type OpenDataForBwTileBriefPanel = {
        war : BaseWar.BwWar;
    };
    export class BwTileBriefPanel extends TwnsUiPanel.UiPanel<OpenDataForBwTileBriefPanel> {
        private readonly _group!            : eui.Group;
        private readonly _conTileView!      : eui.Group;
        private readonly _tileView          = new BaseWar.BwTileView();
        private readonly _labelName!        : TwnsUiLabel.UiLabel;
        private readonly _labelGridIndex!   : TwnsUiLabel.UiLabel;
        private readonly _labelState!       : TwnsUiLabel.UiLabel;
        private readonly _labelDefense!     : TwnsUiLabel.UiLabel;
        private readonly _imgDefense!       : TwnsUiImage.UiImage;
        private readonly _imgState!         : TwnsUiImage.UiImage;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                // { type: NotifyType.GlobalTouchBegin,            callback: this._onNotifyGlobalTouchBegin },
                // { type: NotifyType.GlobalTouchMove,             callback: this._onNotifyGlobalTouchMove },
                { type: NotifyType.BwCursorGridIndexChanged,    callback: this._onNotifyBwCursorGridIndexChanged },
                { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwActionPlannerStateChanged },
                { type: NotifyType.MeTileChanged,               callback: this._onNotifyMeTileChanged },
                { type: NotifyType.TileAnimationTick,           callback: this._onNotifyTileAnimationTick },
                { type: NotifyType.BwTileIsHighlightedChanged,  callback: this._onNotifyTileIsHighlightedChanged },
            ]);
            this._setUiListenerArray([
                { ui: this, callback: this._onTouchedThis, },
            ]);

            const tileView      = this._tileView;
            const conTileView   = this._conTileView;
            conTileView.addChild(tileView.getImgBase());
            conTileView.addChild(tileView.getImgDecorator());
            conTileView.addChild(tileView.getImgObject());
            conTileView.addChild(tileView.getImgHighlight());
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            this._conTileView.removeChildren();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // private _onNotifyGlobalTouchBegin(e: egret.Event): void {
        //     this._adjustPositionOnTouch(e.data);
        // }
        // private _onNotifyGlobalTouchMove(e: egret.Event): void {
        //     this._adjustPositionOnTouch(e.data);
        // }
        private _onNotifyBwCursorGridIndexChanged(e: egret.Event): void {
            const data  = e.data as Notify.NotifyData.BwCursorGridIndexChanged;
            const war   = this._getOpenData().war;
            if ((war.getIsRunning()) && (data === war.getCursor())) {
                this._updateView();
            }
        }
        private _onNotifyBwActionPlannerStateChanged(): void {
            const planner = this._getOpenData().war.getActionPlanner();
            if ((planner.getPreviousState() === Types.ActionPlannerState.ExecutingAction) &&
                (planner.getState() !== Types.ActionPlannerState.ExecutingAction)
            ) {
                this._updateView();
            }
        }
        private _onNotifyMeTileChanged(e: egret.Event): void {
            const data  = e.data as Notify.NotifyData.MeTileChanged;
            const war   = this._getOpenData().war;
            if ((war.getIsRunning()) && (GridIndexHelpers.checkIsEqual(data.gridIndex, war.getCursor().getGridIndex()))) {
                this._updateView();
            }
        }
        private _onNotifyTileAnimationTick(): void {
            this._tileView.updateView();
        }
        private _onNotifyTileIsHighlightedChanged(): void {
            this._updateTileView();
        }

        private _onTouchedThis(): void {
            const war                   = this._getOpenData().war;
            const gridIndex             = war.getCursor().getGridIndex();
            const tileMap               = war.getTileMap();
            const tile                  = tileMap.getTile(gridIndex);
            const warType               = war.getWarType();
            const gridId                = GridIndexHelpers.getGridId(gridIndex, tileMap.getMapSize());
            const callbackForMarkTile   = getCallbackForMarkTile(war, gridId);
            const callbackForUnmarkTile = getCallbackForUnmarkTile(war, gridId);

            if ((warType === Types.WarType.Me)                              ||
                (!WarHelpers.WarCommonHelpers.checkCanCheatInWar(warType))  ||
                (tile.getMaxHp() != null)
            ) {
                PanelHelpers.open(PanelHelpers.PanelDict.BwTileDetailPanel, {
                    tile,
                    callbackForAddUnit  : null,
                    callbackForMarkTile,
                    callbackForUnmarkTile,
                });
            } else {
                const playerIndexAndSkinIdArray = war.getPlayerManager().getAllPlayers()
                    .filter(v => v.getPlayerIndex() !== CommonConstants.PlayerIndex.Neutral)
                    .map(v => ({ playerIndex: v.getPlayerIndex(), skinId: v.getUnitAndTileSkinId()}))
                    .sort((v1, v2) => v1.playerIndex - v2.playerIndex);
                const skinIdArray               = playerIndexAndSkinIdArray.map(v => v.skinId);

                PanelHelpers.open(PanelHelpers.PanelDict.BwTileDetailPanel, {
                    tile,
                    callbackForAddUnit: () => {
                        const gameConfig = war.getGameConfig();
                        PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseUnitAndSkinPanel, {
                            gameConfig,
                            unitTypeArray   : gameConfig.getAllUnitTypeArray(),
                            skinIdArray,
                            callback        : (unitType, skinId) => {
                                const unitMap = war.getUnitMap();
                                if (unitMap.getUnitOnMap(gridIndex)) {
                                    WarHelpers.WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, false);
                                }

                                const unitId    = unitMap.getNextUnitId();
                                const unit      = new BwUnit();
                                unit.init({
                                    gridIndex,
                                    playerIndex     : playerIndexAndSkinIdArray.find(v => v.skinId === skinId)?.playerIndex,
                                    unitType,
                                    unitId          : unitId,
                                }, gameConfig);
                                unit.startRunning(war);
                                unit.startRunningView();
                                unitMap.setUnitOnMap(unit);
                                unitMap.setNextUnitId(unitId + 1);
                                war.updateTilesAndUnitsOnVisibilityChanged(false);
                                Notify.dispatch(NotifyType.BwUnitChanged, { gridIndex } as Notify.NotifyData.BwUnitChanged);
                            },
                        });
                    },
                    callbackForMarkTile,
                    callbackForUnmarkTile,
                });
            }

            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const war                   = this._getOpenData().war;
            const gridIndex             = war.getCursor().getGridIndex();
            const tile                  = war.getTileMap().getTile(gridIndex);
            this._labelDefense.text     = `${Math.floor(tile.getDefenseAmount() / 10)}`;
            this._labelGridIndex.text   = `x${gridIndex.x} y${gridIndex.y}`;
            this._labelName.text        = Lang.getTileName(tile.getType(), war.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined;
            this._updateTileView();

            if (tile.getCurrentHp() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = _IMAGE_SOURCE_HP;
                this._labelState.visible    = true;
                this._labelState.text       = `${tile.getCurrentHp()}`;
            } else if (tile.getCurrentCapturePoint() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = _IMAGE_SOURCE_CAPTURE;
                this._labelState.visible    = true;
                this._labelState.text       = `${tile.getCurrentCapturePoint()}`;
            } else if (tile.getCurrentBuildPoint() != null) {
                this._imgState.visible      = true;
                this._imgState.source       = _IMAGE_SOURCE_CAPTURE;
                this._labelState.visible    = true;
                this._labelState.text       = `${tile.getCurrentBuildPoint()}`;
            } else {
                this._imgState.visible      = false;
                this._labelState.visible    = false;
            }
        }

        private _updateTileView(): void {
            const war       = this._getOpenData().war;
            const tile      = war.getTileMap().getTile(war.getCursor().getGridIndex());
            const tileView  = this._tileView;
            tileView.setData({
                gameConfig  : tile.getGameConfig(),
                tileData    : tile.serialize(),
                hasFog      : tile.getHasFog(),
                skinId      : tile.getSkinId(),
                themeType   : tile.getTileThemeType(),
            });
            tileView.updateView();
        }

        // private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
        //     const unitBriefPanel = TwnsBwUnitBriefPanel.BwUnitBriefPanel.getInstance();
        //     let target = e.target as egret.DisplayObject;
        //     while (target) {
        //         if ((target) && ((target === this) || (target === unitBriefPanel))) {
        //             return;
        //         }
        //         target = target.parent;
        //     }

        //     const stageWidth    = StageManager.getStage().stageWidth;
        //     const group         = this._group;
        //     const currentX      = group.x;
        //     const newX          = e.stageX >= stageWidth / 4 * 3
        //         ? 0
        //         : (e.stageX < stageWidth / 4
        //             ? stageWidth - _CELL_WIDTH
        //             : currentX
        //         );
        //     if (newX !== currentX) {
        //         await this._showCloseAnimation();
        //         group.x = newX;
        //         this._showOpenAnimation();
        //     }
        // }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, bottom: -40 },
                endProps    : { alpha: 1, bottom: 0 },
                tweenTime   : 50,
            });

            await Helpers.wait(50);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, bottom: 0 },
                endProps    : { alpha: 0, bottom: -40 },
                tweenTime   : 50,
            });

            await Helpers.wait(50);
        }
    }

    function getCallbackForMarkTile(war: BwWar, gridId: number): (() => void) | null {
        if (war instanceof MultiPlayerWar.MpwWar) {
            const player = war.getPlayerLoggedIn();
            if (player == null) {
                return null;
            }
            if (player.checkHasMarkedGridId(gridId)) {
                return null;
            }

            return () => {
                MultiPlayerWar.MpwProxy.reqMpwCommonMarkTile(Helpers.getExisted(war.getWarId()), gridId, true);
            };

        } else {
            const player = war.getPlayer(CommonConstants.PlayerIndex.Neutral);
            if (player.checkHasMarkedGridId(gridId)) {
                return null;
            }

            return () => {
                player.addMarkedGridId(gridId);
            };
        }
    }
    function getCallbackForUnmarkTile(war: BwWar, gridId: number): (() => void) | null {
        if (war instanceof MultiPlayerWar.MpwWar) {
            const player = war.getPlayerLoggedIn();
            if (player == null) {
                return null;
            }
            if (!player.checkHasMarkedGridId(gridId)) {
                return null;
            }

            return () => {
                MultiPlayerWar.MpwProxy.reqMpwCommonMarkTile(Helpers.getExisted(war.getWarId()), gridId, false);
            };

        } else {
            const player = war.getPlayer(CommonConstants.PlayerIndex.Neutral);
            if (!player.checkHasMarkedGridId(gridId)) {
                return null;
            }

            return () => {
                player.deleteMarkedGridId(gridId);
            };
        }
    }
}

// export default TwnsBwTileBriefPanel;
