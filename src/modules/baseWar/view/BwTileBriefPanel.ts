
import Tween                    = egret.Tween;
import { Types }                from "../../../utility/Types";
import { Notify }               from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Lang                from "../../../utility/Lang";
import * as StageManager        from "../../../utility/StageManager";
import * as GridIndexHelpers    from "../../../utility/GridIndexHelpers";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiImage }              from "../../../gameui/UiImage";
import { BwWar }                from "../model/BwWar";
import { BwProduceUnitPanel }   from "./BwProduceUnitPanel";
import { BwTileView }           from "./BwTileView";
import { BwTileDetailPanel }    from "./BwTileDetailPanel";
import { BwCoListPanel }        from "./BwCoListPanel";
import { BwUnitBriefPanel }     from "./BwUnitBriefPanel";

const _IMAGE_SOURCE_HP      = `c04_t10_s00_f00`;
// const _IMAGE_SOURCE_FUEL    = `c04_t10_s01_f00`;
// const _IMAGE_SOURCE_AMMO    = `c04_t10_s02_f00`;
// const _IMAGE_SOURCE_DEFENSE = `c04_t10_s03_f00`;
const _IMAGE_SOURCE_CAPTURE = `c04_t10_s04_f00`;
const _IMAGE_SOURCE_BUILD   = `c04_t10_s05_f00`;
const _CELL_WIDTH           = 80;

type OpenDataForBwTileBriefPanel = {
    war : BwWar;
};
export class BwTileBriefPanel extends UiPanel<OpenDataForBwTileBriefPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: BwTileBriefPanel;

    private readonly _group             : eui.Group;
    private readonly _conTileView       : eui.Group;
    private readonly _tileView          = new BwTileView();
    private readonly _labelName         : UiLabel;
    private readonly _labelGridIndex    : UiLabel;
    private readonly _labelState        : UiLabel;
    private readonly _labelDefense      : UiLabel;
    private readonly _imgDefense        : UiImage;
    private readonly _imgState          : UiImage;

    public static show(openData: OpenDataForBwTileBriefPanel): void {
        if (!BwTileBriefPanel._instance) {
            BwTileBriefPanel._instance = new BwTileBriefPanel();
        }
        BwTileBriefPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (BwTileBriefPanel._instance) {
            await BwTileBriefPanel._instance.close();
        }
    }
    public static getInstance(): BwTileBriefPanel {
        return BwTileBriefPanel._instance;
    }

    public constructor() {
        super();

        this.skinName = `resource/skins/baseWar/BwTileBriefPanel.exml`;
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.GlobalTouchBegin,               callback: this._onNotifyGlobalTouchBegin },
            { type: NotifyType.GlobalTouchMove,                callback: this._onNotifyGlobalTouchMove },
            { type: NotifyType.BwCursorGridIndexChanged,       callback: this._onNotifyBwCursorGridIndexChanged },
            { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
            { type: NotifyType.BwWarMenuPanelOpened,           callback: this._onNotifyBwWarMenuPanelOpened },
            { type: NotifyType.BwWarMenuPanelClosed,           callback: this._onNotifyBwWarMenuPanelClosed },
            { type: NotifyType.BwCoListPanelOpened,            callback: this._onNotifyBwCoListPanelOpened },
            { type: NotifyType.BwCoListPanelClosed,            callback: this._onNotifyBwCoListPanelClosed },
            { type: NotifyType.BwProduceUnitPanelOpened,       callback: this._onNotifyBwProduceUnitPanelOpened },
            { type: NotifyType.BwProduceUnitPanelClosed,       callback: this._onNotifyBwProduceUnitPanelClosed },
            { type: NotifyType.MeTileChanged,                  callback: this._onNotifyMeTileChanged },
            { type: NotifyType.TileAnimationTick,              callback: this._onNotifyTileAnimationTick },
        ]);
        this._setUiListenerArray([
            { ui: this, callback: this._onTouchedThis, },
        ]);

        this._conTileView.addChild(this._tileView.getImgBase());
        this._conTileView.addChild(this._tileView.getImgObject());

        const group     = this._group;
        group.alpha     = 0;
        group.bottom    = -40;
        this._showOpenAnimation();

        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyGlobalTouchBegin(e: egret.Event): void {
        this._adjustPositionOnTouch(e.data);
    }
    private _onNotifyGlobalTouchMove(e: egret.Event): void {
        this._adjustPositionOnTouch(e.data);
    }
    private _onNotifyBwCursorGridIndexChanged(e: egret.Event): void {
        this._updateView();
    }
    private _onNotifyBwActionPlannerStateChanged(e: egret.Event): void {
        const planner = this._getOpenData().war.getActionPlanner();
        if ((planner.getPreviousState() === Types.ActionPlannerState.ExecutingAction) &&
            (planner.getState() !== Types.ActionPlannerState.ExecutingAction)
        ) {
            this._updateView();
        }
    }
    private _onNotifyBwWarMenuPanelOpened(e: egret.Event): void {
        this._updateView();
    }
    private _onNotifyBwWarMenuPanelClosed(e: egret.Event): void {
        this._updateView();
    }
    private _onNotifyBwCoListPanelOpened(e: egret.Event): void {
        this._updateView();
    }
    private _onNotifyBwCoListPanelClosed(e: egret.Event): void {
        this._updateView();
    }
    private _onNotifyBwProduceUnitPanelOpened(e: egret.Event): void {
        this._updateView();
    }
    private _onNotifyBwProduceUnitPanelClosed(e: egret.Event): void {
        this._updateView();
    }
    private _onNotifyMeTileChanged(e: egret.Event): void {
        const data = e.data as Notify.Data.MeTileChanged;
        if (GridIndexHelpers.checkIsEqual(data.gridIndex, this._getOpenData().war.getCursor().getGridIndex())) {
            this._updateView();
        }
    }
    private _onNotifyTileAnimationTick(e: egret.Event): void {
        this._tileView.updateView();
    }

    private _onTouchedThis(e: egret.TouchEvent): void {
        const war   = this._getOpenData().war;
        const tile  = war.getTileMap().getTile(war.getCursor().getGridIndex());
        (tile) && (BwTileDetailPanel.show({ tile }));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const war = this._getOpenData().war;
        if ((war.getIsWarMenuPanelOpening())            ||
            (BwProduceUnitPanel.getIsOpening()) ||
            (BwCoListPanel.getIsOpening())
        ) {
            this.visible = false;
        } else {
            this.visible = true;

            const gridIndex = war.getCursor().getGridIndex();
            const tile      = war.getTileMap().getTile(gridIndex);
            const tileView  = this._tileView;
            tileView.setData({
                tileData    : tile.serialize(),
                hasFog      : tile.getHasFog(),
                skinId      : tile.getSkinId(),
            });
            tileView.updateView();
            this._labelDefense.text     = `${Math.floor(tile.getDefenseAmount() / 10)}`;
            this._labelName.text        = Lang.getTileName(tile.getType());
            this._labelGridIndex.text   = `x${gridIndex.x} y${gridIndex.y}`;

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
                this._imgState.source       = _IMAGE_SOURCE_BUILD;
                this._labelState.visible    = true;
                this._labelState.text       = `${tile.getCurrentBuildPoint()}`;
            } else {
                this._imgState.visible      = false;
                this._labelState.visible    = false;
            }
        }
    }

    private async _adjustPositionOnTouch(e: egret.TouchEvent): Promise<void> {
        const unitBriefPanel = BwUnitBriefPanel.getInstance();
        let target = e.target as egret.DisplayObject;
        while (target) {
            if ((target) && ((target === this) || (target === unitBriefPanel))) {
                return;
            }
            target = target.parent;
        }

        const stageWidth    = StageManager.getStage().stageWidth;
        const group         = this._group;
        const currentX      = group.x;
        const newX          = e.stageX >= stageWidth / 4 * 3
            ? 0
            : (e.stageX < stageWidth / 4
                ? stageWidth - _CELL_WIDTH
                : currentX
            );
        if (newX !== currentX) {
            await this._showCloseAnimation();
            group.x = newX;
            this._showOpenAnimation();
        }
    }

    private _showOpenAnimation(): void {
        const group = this._group;
        Tween.removeTweens(group);
        Tween.get(group)
            .to({ bottom: 0, alpha: 1 }, 50);
    }
    private _showCloseAnimation(): Promise<void> {
        return new Promise<void>(resolve => {
            const group = this._group;
            Tween.removeTweens(group);
            Tween.get(group)
                .to({ bottom: -40, alpha: 0 }, 50)
                .call(() => resolve());
        });
    }
}
