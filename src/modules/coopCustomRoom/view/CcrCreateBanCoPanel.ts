
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiComponent }                  from "../../../gameui/UiComponent";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiCoInfo }                     from "../../../gameui/UiCoInfo";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonAlertPanel }             from "../../common/view/CommonAlertPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types                       from "../../../utility/Types";
import * as CcrModel                    from "../../coopCustomRoom/model/CcrModel";
import CreateModel                      = CcrModel.Create;

type OpenDataForCcrCreateBanCoPanel = {
    playerIndex : number;
};
export class CcrCreateBanCoPanel extends UiPanel<OpenDataForCcrCreateBanCoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud2;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: CcrCreateBanCoPanel;

    private readonly _imgMask                   : UiImage;
    private readonly _group                     : eui.Group;
    private readonly _labelAvailableCoTitle     : UiLabel;
    // private readonly _groupCoTiers              : eui.Group;
    private readonly _groupCoNames              : eui.Group;
    private readonly _btnCancel                 : UiButton;
    private readonly _btnConfirm                : UiButton;
    private readonly _uiCoInfo                  : UiCoInfo;

    // private _renderersForCoTiers    : RendererForCoTier[] = [];
    private _renderersForCoNames    : RendererForCoName[] = [];

    private _playerIndex            : number;
    private _bannedCoIdSet          = new Set<number>();
    private _previewCoId            : number;

    public static show(openData: OpenDataForCcrCreateBanCoPanel): void {
        if (!CcrCreateBanCoPanel._instance) {
            CcrCreateBanCoPanel._instance = new CcrCreateBanCoPanel();
        }
        CcrCreateBanCoPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (CcrCreateBanCoPanel._instance) {
            await CcrCreateBanCoPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/coopCustomRoom/CcrCreateBanCoPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnCancel,  callback: this._onTouchedBtnCancel },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);

        this._showOpenAnimation();

        const playerIndex = this._getOpenData().playerIndex;
        this._playerIndex = playerIndex;

        const bannedCoIdSet = this._bannedCoIdSet;
        bannedCoIdSet.clear();
        for (const coId of CreateModel.getBannedCoIdArray(playerIndex) || []) {
            bannedCoIdSet.add(coId);
        }

        this._updateComponentsForLanguage();
        // this._initGroupCoTiers();
        this._initGroupCoNames();
        this._initComponentsForPreviewCo();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();

        // this._clearGroupCoTiers();
        this._clearGroupCoNames();
    }

    private _setPreviewCoId(coId: number): void {
        if (this._getPreviewCoId() !== coId) {
            this._previewCoId = coId;
            this._updateComponentsForPreviewCoId();
        }
    }
    private _getPreviewCoId(): number {
        return this._previewCoId;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnCancel(): void {
        this.close();
    }

    private _onTouchedBtnConfirm(): void {
        const bannedCoIdSet = this._bannedCoIdSet;
        if (bannedCoIdSet.has(CommonConstants.CoEmptyId)) {
            CommonAlertPanel.show({
                title   : Lang.getText(LangTextType.B0088),
                content : Lang.getText(LangTextType.A0130),
            });
        } else {
            const playerIndex   = this._playerIndex;
            const callback      = () => {
                CreateModel.setBannedCoIdArray(playerIndex, bannedCoIdSet);
                Notify.dispatch(NotifyType.CcrCreateBannedCoIdArrayChanged);
                this.close();
            };
            if ((playerIndex !== CreateModel.getSelfPlayerIndex()) ||
                (!bannedCoIdSet.has(CreateModel.getSelfCoId()))
            ) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0057),
                    callback: () => {
                        CreateModel.setSelfCoId(CommonConstants.CoEmptyId);
                        callback();
                    },
                });
            }
        }
    }

    private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
        const renderer      = e.currentTarget as RendererForCoName;
        const coId          = renderer.getCoId();
        const bannedCoIdSet = this._bannedCoIdSet;
        this._setPreviewCoId(coId);

        if (!renderer.getIsSelected()) {
            bannedCoIdSet.delete(coId);
            this._updateGroupCoNames();

        } else {
            if (coId === CommonConstants.CoEmptyId) {
                CommonAlertPanel.show({
                    title   : Lang.getText(LangTextType.B0088),
                    content : Lang.getText(LangTextType.A0130),
                });
                return;
            }

            const callback = () => {
                bannedCoIdSet.add(coId);
                this._updateGroupCoNames();
            };

            if ((this._playerIndex !== CreateModel.getSelfPlayerIndex()) ||
                (coId !== CreateModel.getSelfCoId())
            ) {
                callback();
            } else {
                CommonConfirmPanel.show({
                    content : Lang.getText(LangTextType.A0057),
                    callback,
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._btnCancel.label               = Lang.getText(LangTextType.B0154);
        this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
        this._labelAvailableCoTitle.text    = `${Lang.getText(LangTextType.B0238)} (P${this._playerIndex})`;

        this._updateComponentsForPreviewCoId();
    }

    private _initGroupCoNames(): void {
        for (const cfg of ConfigManager.getEnabledCoArray(ConfigManager.getLatestFormalVersion())) {
            const renderer = new RendererForCoName();
            renderer.setCoId(cfg.coId);
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
        const bannedCoIdSet = this._bannedCoIdSet;
        for (const renderer of this._renderersForCoNames) {
            renderer.setIsSelected(!bannedCoIdSet.has(renderer.getCoId()));
        }
    }

    private _initComponentsForPreviewCo(): void {
        this._setPreviewCoId(CommonConstants.CoEmptyId);
    }

    private _updateComponentsForPreviewCoId(): void {
        const coId = this._previewCoId;
        if (coId == null) {
            return;
        }

        this._uiCoInfo.setCoData({
            configVersion   : ConfigManager.getLatestFormalVersion(),
            coId,
        });
    }

    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._imgMask,
            beginProps  : { alpha: 0 },
            endProps    : { alpha: 1 },
        });
        Helpers.resetTween({
            obj         : this._group,
            beginProps  : { alpha: 0, verticalCenter: -40 },
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
                endProps    : { alpha: 0, verticalCenter: -40 },
                callback    : resolve,
            });
        });
    }
}

class RendererForCoName extends UiComponent {
    private readonly _imgUnselected : UiImage;
    private readonly _imgSelected   : UiImage;
    private readonly _labelName     : UiLabel;

    private _coId           : number;
    private _isSelected     : boolean;

    public constructor() {
        super();

        this.skinName = "resource/skins/component/checkBox/CheckBox001.exml";
    }

    protected _onOpened(): void {
        this._updateView();
    }

    public setCoId(coId: number): void {
        this._coId = coId;

        this._updateView();
    }
    public getCoId(): number {
        return this._coId;
    }

    public setIsSelected(isSelected: boolean): void {
        this._isSelected = isSelected;
        this._updateView();
    }
    public getIsSelected(): boolean {
        return this._isSelected;
    }

    private _updateView(): void {
        if (!this.getIsOpening()) {
            return;
        }

        const coCfg             = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), this._coId);
        this._labelName.text    = coCfg ? coCfg.name : null;

        const isSelected            = this._isSelected;
        this._imgSelected.visible   = isSelected;
        this._imgUnselected.visible = !isSelected;
    }
}
