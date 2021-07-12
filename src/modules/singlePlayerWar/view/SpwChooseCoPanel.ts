
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiListItemRenderer }           from "../../../utility/ui/UiListItemRenderer";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiScrollList }                 from "../../../utility/ui/UiScrollList";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { BwWar }                        from "../../baseWar/model/BwWar";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";

type OpenDataForSpwChooseCoPanel = {
    war         : BwWar;
    playerIndex : number;
};

export class SpwChooseCoPanel extends TwnsUiPanel.UiPanel<OpenDataForSpwChooseCoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: SpwChooseCoPanel;

    private _labelChooseCo  : TwnsUiLabel.UiLabel;
    private _btnHelp        : TwnsUiButton.UiButton;
    private _listCo         : TwnsUiScrollList.UiScrollList<DataForCoRenderer>;
    private _btnBack        : TwnsUiButton.UiButton;

    private _imgCoPortrait                  : TwnsUiImage.UiImage;
    private _labelNameTitle                 : TwnsUiLabel.UiLabel;
    private _labelName                      : TwnsUiLabel.UiLabel;
    private _labelDesignerTitle             : TwnsUiLabel.UiLabel;
    private _labelDesigner                  : TwnsUiLabel.UiLabel;
    private _labelBoardCostPercentageTitle  : TwnsUiLabel.UiLabel;
    private _labelBoardCostPercentage       : TwnsUiLabel.UiLabel;
    private _labelZoneRadiusTitle           : TwnsUiLabel.UiLabel;
    private _labelZoneRadius                : TwnsUiLabel.UiLabel;
    private _labelEnergyBarTitle            : TwnsUiLabel.UiLabel;
    private _labelEnergyBar                 : TwnsUiLabel.UiLabel;

    private _listPassiveSkill   : TwnsUiScrollList.UiScrollList<DataForSkillRenderer>;
    private _labelNoPassiveSkill: TwnsUiLabel.UiLabel;

    private _listCop            : TwnsUiScrollList.UiScrollList<DataForSkillRenderer>;
    private _labelNoCop         : TwnsUiLabel.UiLabel;
    private _labelCopEnergyTitle: TwnsUiLabel.UiLabel;
    private _labelCopEnergy     : TwnsUiLabel.UiLabel;

    private _listScop               : TwnsUiScrollList.UiScrollList<DataForSkillRenderer>;
    private _labelNoScop            : TwnsUiLabel.UiLabel;
    private _labelScopEnergyTitle   : TwnsUiLabel.UiLabel;
    private _labelScopEnergy        : TwnsUiLabel.UiLabel;

    private _dataForListCo      : DataForCoRenderer[] = [];
    private _selectedIndex      : number;

    public static show(openData: OpenDataForSpwChooseCoPanel): void {
        if (!SpwChooseCoPanel._instance) {
            SpwChooseCoPanel._instance = new SpwChooseCoPanel();
        }

        SpwChooseCoPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (SpwChooseCoPanel._instance) {
            await SpwChooseCoPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/singlePlayerWar/SpwChooseCoPanel.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            { ui: this._btnBack,    callback: this._onTouchTapBtnBack },
        ]);
        this._listCo.setItemRenderer(CoRenderer);
        this._listPassiveSkill.setItemRenderer(SkillRenderer);
        this._listCop.setItemRenderer(SkillRenderer);
        this._listScop.setItemRenderer(SkillRenderer);

        this._initListCo();
        this._updateView();
    }

    public setSelectedIndex(newIndex: number): void {
        const dataList = this._dataForListCo;
        if (dataList.length <= 0) {
            this._selectedIndex = undefined;
            this._showCoInfo(null);

        } else if (dataList[newIndex]) {
            const oldIndex      = this._selectedIndex;
            this._selectedIndex = newIndex;
            (dataList[oldIndex])    && (this._listCo.updateSingleData(oldIndex, dataList[oldIndex]));
            (oldIndex !== newIndex) && (this._listCo.updateSingleData(newIndex, dataList[newIndex]));

            this._showCoInfo(dataList[newIndex]);
        }
    }
    public getSelectedIndex(): number {
        return this._selectedIndex;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title   : Lang.getText(LangTextType.B0147),
            content : Lang.getText(LangTextType.R0004),
        });
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._labelChooseCo.text    = Lang.getText(LangTextType.B0145);
        this._btnHelp.label         = Lang.getText(LangTextType.B0143);
        this._btnBack.label         = Lang.getText(LangTextType.B0146);
    }

    private _initListCo(): void {
        const openData      = this._getOpenData();
        const selfCoId      = openData.war.getPlayer(openData.playerIndex).getCoId();
        const dataForListCo = this._createDataForListCo();
        this._dataForListCo = dataForListCo;
        this._listCo.bindData(dataForListCo);
        this._listCo.scrollVerticalTo(0);
        this.setSelectedIndex(dataForListCo.findIndex(data => data.coBasicCfg.coId === selfCoId));
    }

    private _createDataForListCo(): DataForCoRenderer[] {
        const data          : DataForCoRenderer[] = [];
        const openData      = this._getOpenData();
        const war           = openData.war;
        const playerIndex   = openData.playerIndex;

        let index = 0;
        for (const coBasicCfg of ConfigManager.getEnabledCoArray(war.getConfigVersion())) {
            data.push({
                war,
                playerIndex,
                coBasicCfg,
                index,
                panel       : this,
            });
            ++index;
        }
        return data;
    }

    private _showCoInfo(data: DataForCoRenderer): void {
        this._labelNameTitle.text                   = `${Lang.getText(LangTextType.B0162)}: `;
        this._labelDesignerTitle.text               = `${Lang.getText(LangTextType.B0163)}: `;
        this._labelBoardCostPercentageTitle.text    = `${Lang.getText(LangTextType.B0164)}: `;
        this._labelZoneRadiusTitle.text             = `${Lang.getText(LangTextType.B0165)}: `;
        this._labelEnergyBarTitle.text              = `${Lang.getText(LangTextType.B0166)}: `;
        this._labelCopEnergyTitle.text              = `${Lang.getText(LangTextType.B0167)}: `;
        this._labelScopEnergyTitle.text             = `${Lang.getText(LangTextType.B0167)}: `;

        const cfg = data.coBasicCfg;
        if (!cfg) {
            this._imgCoPortrait.source          = "";
            this._labelName.text                = "--";
            this._labelDesigner.text            = "--";
            this._labelBoardCostPercentage.text = "--";
            this._labelZoneRadius.text          = "--";
            this._labelEnergyBar.text           = "--";
            this._labelNoPassiveSkill.text      = Lang.getText(LangTextType.B0001);
            this._labelNoCop.text               = Lang.getText(LangTextType.B0001);
            this._labelCopEnergy.text           = "--";
            this._labelNoScop.text              = Lang.getText(LangTextType.B0001);
            this._labelScopEnergy.text          = "--";
            this._listPassiveSkill.clear();
            this._listCop.clear();
            this._listScop.clear();

        } else {
            this._imgCoPortrait.source          = ConfigManager.getCoBustImageSource(cfg.coId);
            this._labelName.text                = cfg.name;
            this._labelDesigner.text            = cfg.designer;
            this._labelBoardCostPercentage.text = `${cfg.boardCostPercentage}%`;
            this._labelZoneRadius.text          = `${cfg.zoneRadius}`;
            this._labelEnergyBar.text           = (cfg.zoneExpansionEnergyList || []).join(` / `) || `--`;

            const passiveSkills = cfg.passiveSkills || [];
            if (!passiveSkills.length) {
                this._labelNoPassiveSkill.text = Lang.getText(LangTextType.B0001);
                this._listPassiveSkill.clear();
            } else {
                this._labelNoPassiveSkill.text = "";
                const dataArray: DataForSkillRenderer[] = [];
                for (let i = 0; i < passiveSkills.length; ++i) {
                    dataArray.push({
                        index   : i + 1,
                        skillId : passiveSkills[i],
                    });
                }
                this._listPassiveSkill.bindData(dataArray);
            }

            const copSkills = cfg.powerSkills || [];
            if (!copSkills.length) {
                this._labelNoCop.text       = Lang.getText(LangTextType.B0001);
                this._labelCopEnergy.text   = "--";
                this._listCop.clear();
            } else {
                this._labelNoCop.text       = "";
                this._labelCopEnergy.text   = `${cfg.powerEnergyList[0]}`;

                const dataArray: DataForSkillRenderer[] = [];
                for (let i = 0; i < copSkills.length; ++i) {
                    dataArray.push({
                        index   : i + 1,
                        skillId : copSkills[i],
                    });
                }
                this._listCop.bindData(dataArray);
            }

            const scopSkills = cfg.superPowerSkills || [];
            if (!scopSkills.length) {
                this._labelNoScop.text      = Lang.getText(LangTextType.B0001);
                this._labelScopEnergy.text  = "--";
                this._listScop.clear();
            } else {
                this._labelNoScop.text      = "";
                this._labelScopEnergy.text  = `${cfg.powerEnergyList[1]}`;

                const dataArray: DataForSkillRenderer[] = [];
                for (let i = 0; i < scopSkills.length; ++i) {
                    dataArray.push({
                        index   : i + 1,
                        skillId : scopSkills[i],
                    });
                }
                this._listScop.bindData(dataArray);
            }
        }
    }
}

type DataForCoRenderer = {
    war             : BwWar;
    playerIndex     : number;
    coBasicCfg      : ProtoTypes.Config.ICoBasicCfg;
    index           : number;
    panel           : SpwChooseCoPanel;
};
class CoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForCoRenderer> {
    private _btnChoose: TwnsUiButton.UiButton;
    private _btnNext  : TwnsUiButton.UiButton;
    private _labelName: TwnsUiLabel.UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
    }

    protected _onDataChanged(): void {
        const data              = this.data;
        const cfg               = data.coBasicCfg;
        this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
        this._labelName.text    = cfg ? `${cfg.name} (T${cfg.tier})` : `(${Lang.getText(LangTextType.B0001)} CO)`;
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        const data = this.data;
        data.panel.setSelectedIndex(data.index);
    }

    private _onTouchTapBtnNext(e: egret.TouchEvent): void {
        const data      = this.data;
        const newCoId   = data.coBasicCfg.coId;
        const war       = data.war;
        const player    = war.getPlayer(data.playerIndex);
        if (newCoId !== player.getCoId()) {
            player.setCoId(newCoId);
            player.setCoCurrentEnergy(Math.min(player.getCoCurrentEnergy(), player.getCoMaxEnergy()));

            war.getTileMap().getView().updateCoZone();
        }
        data.panel.close();
    }
}

type DataForSkillRenderer = {
    index   : number;
    skillId : number;
};

class SkillRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSkillRenderer> {
    private _labelIndex : TwnsUiLabel.UiLabel;
    private _labelDesc  : TwnsUiLabel.UiLabel;

    protected _onDataChanged(): void {
        const data              = this.data;
        this._labelIndex.text   = `${data.index}.`;
        this._labelDesc.text    = ConfigManager.getCoSkillCfg(ConfigManager.getLatestFormalVersion(), data.skillId).desc[Lang.getCurrentLanguageType()];
    }
}
