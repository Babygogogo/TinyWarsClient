
import { UiImage }                      from "../../../gameui/UiImage";
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { BwWar }                        from "../../baseWar/model/BwWar";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";

type OpenDataForSpwChooseCoPanel = {
    war         : BwWar;
    playerIndex : number;
};

export class SpwChooseCoPanel extends UiPanel<OpenDataForSpwChooseCoPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: SpwChooseCoPanel;

    private _labelChooseCo  : UiLabel;
    private _btnHelp        : UiButton;
    private _listCo         : UiScrollList<DataForCoRenderer>;
    private _btnBack        : UiButton;

    private _imgCoPortrait                  : UiImage;
    private _labelNameTitle                 : UiLabel;
    private _labelName                      : UiLabel;
    private _labelDesignerTitle             : UiLabel;
    private _labelDesigner                  : UiLabel;
    private _labelBoardCostPercentageTitle  : UiLabel;
    private _labelBoardCostPercentage       : UiLabel;
    private _labelZoneRadiusTitle           : UiLabel;
    private _labelZoneRadius                : UiLabel;
    private _labelEnergyBarTitle            : UiLabel;
    private _labelEnergyBar                 : UiLabel;

    private _listPassiveSkill   : UiScrollList<DataForSkillRenderer>;
    private _labelNoPassiveSkill: UiLabel;

    private _listCop            : UiScrollList<DataForSkillRenderer>;
    private _labelNoCop         : UiLabel;
    private _labelCopEnergyTitle: UiLabel;
    private _labelCopEnergy     : UiLabel;

    private _listScop               : UiScrollList<DataForSkillRenderer>;
    private _labelNoScop            : UiLabel;
    private _labelScopEnergyTitle   : UiLabel;
    private _labelScopEnergy        : UiLabel;

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
class CoRenderer extends UiListItemRenderer<DataForCoRenderer> {
    private _btnChoose: UiButton;
    private _btnNext  : UiButton;
    private _labelName: UiLabel;

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

class SkillRenderer extends UiListItemRenderer<DataForSkillRenderer> {
    private _labelIndex : UiLabel;
    private _labelDesc  : UiLabel;

    protected _onDataChanged(): void {
        const data              = this.data;
        this._labelIndex.text   = `${data.index}.`;
        this._labelDesc.text    = ConfigManager.getCoSkillCfg(ConfigManager.getLatestFormalVersion(), data.skillId).desc[Lang.getCurrentLanguageType()];
    }
}
