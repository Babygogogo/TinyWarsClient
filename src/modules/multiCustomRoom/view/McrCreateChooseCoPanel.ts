
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiScrollList }                 from "../../../utility/ui/UiScrollList";
import { UiCoInfo }                     from "../../../utility/ui/UiCoInfo";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { McrCreateModel }               from "../model/McrCreateModel";
import { BwWarRuleHelpers }              from "../../baseWar/model/BwWarRuleHelpers";
import LangTextType         = TwnsLangTextType.LangTextType;
import NotifyType       = TwnsNotifyType.NotifyType;

type OpenDataForMcrCreateChooseCoPanel = {
    coId    : number | undefined | null;
};
export class McrCreateChooseCoPanel extends UiPanel<OpenDataForMcrCreateChooseCoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: McrCreateChooseCoPanel;

    private readonly _imgMask       : UiImage;
    private readonly _group         : eui.Group;

    private readonly _labelChooseCo : UiLabel;
    private readonly _listCo        : UiScrollList<DataForCoRenderer>;
    private readonly _btnConfirm    : UiButton;
    private readonly _btnCancel     : UiButton;
    private readonly _uiCoInfo      : UiCoInfo;

    private _dataForListCo          : DataForCoRenderer[] = [];
    private _selectedIndex          : number;

    public static show(openData: OpenDataForMcrCreateChooseCoPanel): void {
        if (!McrCreateChooseCoPanel._instance) {
            McrCreateChooseCoPanel._instance = new McrCreateChooseCoPanel();
        }

        McrCreateChooseCoPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (McrCreateChooseCoPanel._instance) {
            await McrCreateChooseCoPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/multiCustomRoom/McrCreateChooseCoPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnCancel,      callback: this._onTouchTapBtnBack },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._listCo.setItemRenderer(CoRenderer);

        this._showOpenAnimation();

        this._updateComponentsForLanguage();
        this._initListCo();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    public setSelectedIndex(newIndex: number): void {
        const dataList = this._dataForListCo;
        if (dataList.length <= 0) {
            this._selectedIndex = undefined;

        } else if (dataList[newIndex]) {
            const oldIndex      = this._selectedIndex;
            this._selectedIndex = newIndex;
            (dataList[oldIndex])    && (this._listCo.updateSingleData(oldIndex, dataList[oldIndex]));
            (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));
        }

        this._updateComponentsForCoInfo();
    }
    public getSelectedIndex(): number {
        return this._selectedIndex;
    }

    private _getSelectedCoId(): number | null {
        const data = this._dataForListCo[this.getSelectedIndex()];
        return data ? data.coBasicCfg.coId : null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
        const coId = this._getSelectedCoId();
        if (coId != null) {
            McrCreateModel.setSelfCoId(coId);
            this.close();
        }
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelChooseCo.text    = Lang.getText(LangTextType.B0145);
        this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
        this._btnCancel.label       = Lang.getText(LangTextType.B0154);

        this._updateComponentsForCoInfo();
    }

    private _initListCo(): void {
        this._dataForListCo = this._createDataForListCo();
        this._listCo.bindData(this._dataForListCo);
        this._listCo.scrollVerticalTo(0);

        const coId = this._getOpenData().coId;
        this.setSelectedIndex(this._dataForListCo.findIndex(data => {
            const cfg = data.coBasicCfg;
            return cfg ? cfg.coId === coId : coId == null;
        }));
    }

    private _createDataForListCo(): DataForCoRenderer[] {
        const creator       = McrCreateModel;
        const configVersion = ConfigManager.getLatestFormalVersion();
        const dataArray     : DataForCoRenderer[] = [];
        let index           = 0;
        for (const coId of BwWarRuleHelpers.getAvailableCoIdArrayForPlayer(creator.getWarRule(), creator.getSelfPlayerIndex(), configVersion)) {
            dataArray.push({
                coBasicCfg  : ConfigManager.getCoBasicCfg(configVersion, coId),
                index,
                panel       : this,
            });
            ++index;
        }
        return dataArray;
    }

    private _updateComponentsForCoInfo(): void {
        const coId = this._getSelectedCoId();
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

type DataForCoRenderer = {
    coBasicCfg  : ProtoTypes.Config.ICoBasicCfg;
    index       : number;
    panel       : McrCreateChooseCoPanel;
};
class CoRenderer extends UiListItemRenderer<DataForCoRenderer> {
    private _labelName: UiLabel;

    protected _onDataChanged(): void {
        const data              = this.data;
        this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
        this._labelName.text    = data.coBasicCfg.name;
    }

    public onItemTapEvent(e: eui.ItemTapEvent): void {
        const data = this.data;
        data.panel.setSelectedIndex(data.index);
    }
}
