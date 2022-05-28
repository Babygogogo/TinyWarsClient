
// import UserModel            from "../../user/model/UserModel";
// import WarMapModel          from "../../warMap/model/WarMapModel";
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import Helpers              from "../helpers/Helpers";
// import LocalStorage         from "../helpers/LocalStorage";
// import TwnsServerErrorCode  from "../helpers/ServerErrorCode";
// import Types                from "../helpers/Types";
// import ProtoTypes           from "../proto/ProtoTypes";
// import TwnsLangCommonText   from "./LangCommonText";
// import TwnsLangErrorText    from "./LangErrorText";
// import TwnsLangTextType     from "./LangTextType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Lang {
    import LanguageType             = Types.LanguageType;
    import WarEventConditionType    = Types.WarEventConditionType;
    import WarEventActionType       = Types.WarEventActionType;
    import PlayerRuleType           = Types.PlayerRuleType;
    import GameVersion              = Types.GameVersion;

    let _languageType = LanguageType.Chinese;
    export function init(): void {
        setLanguageType(LocalStorage.getLanguageType());
    }

    export function getCurrentLanguageType(): LanguageType {
        return _languageType;
    }
    export function setLanguageType(language: LanguageType): void {
        _languageType = language;
    }
    export function getLanguageTypeName(type: LanguageType): string | null {
        switch (type) {
            case LanguageType.Chinese   : return getText(LangTextType.B0624, LanguageType.Chinese);
            case LanguageType.English   : return getText(LangTextType.B0625, LanguageType.English);
            default                     : return null;
        }
    }

    export function getText(t: LangTextType, languageType = getCurrentLanguageType()): string {
        const data = LangCommonText[t];
        const text = data ? data[languageType] : null;
        if (text != null) {
            return text;
        } else {
            throw Helpers.newError(`Lang.getText() empty text: ${t} ${languageType}`, ClientErrorCode.Lang_GetText_00);
        }
    }

    export function getFormattedText(t: LangTextType, ...params: (Types.Undefinable<number | string>)[]): string {
        if ((t < LangTextType.F0000) || (t >= LangTextType.R0000)) {
            throw Helpers.newError(`Lang.getFormattedText() invalid t:${t}`);
        }

        const data = getText(t);
        return data === CommonConstants.ErrorTextForLang
            ? CommonConstants.ErrorTextForLang
            : Helpers.formatString(data, ...params);
    }

    export function getErrorText(code: ServerErrorCode | ClientErrorCode): string {
        const textList  = LangErrorText[code];
        const text      = textList ? textList[_languageType] : null;
        return `${getText(LangTextType.B0452)} ${code}: ${text || getText(LangTextType.A0153)}`;
    }

    export function getPlayerForceName(playerIndex: number): string {
        return `P${playerIndex}`;
    }

    export function getPlayerTeamName(teamIndex: number): string | null {
        switch (teamIndex) {
            case 0  : return getText(LangTextType.B0030);
            case 1  : return getText(LangTextType.B0008);
            case 2  : return getText(LangTextType.B0009);
            case 3  : return getText(LangTextType.B0010);
            case 4  : return getText(LangTextType.B0011);
            case 5  : return getText(LangTextType.B0699);
            default : return null;
        }
    }

    export function getTileName(tileType: number, gameConfig: Config.GameConfig, languageType?: LanguageType): string | null {
        const textType = gameConfig.getTileTemplateCfg(tileType)?.lang;
        return textType == null ? null : getText(textType, languageType);
    }
    export function getTileBaseName(tileBaseType: number, gameConfig: Config.GameConfig): string | null {
        const tileType = gameConfig.getTileType(tileBaseType, CommonConstants.TileObjectType.Empty);
        return tileType == null ? null : getTileName(tileType, gameConfig);
    }
    export function getTileObjectName(tileObjectType: number, gameConfig: Config.GameConfig): string | null {
        const textType = gameConfig.getTileObjectCfg(tileObjectType)?.lang;
        return textType == null ? null : getText(textType);
    }
    export function getTileDecorationName(tileDecorationType: number, gameConfig: Config.GameConfig): string | null {
        const textType = gameConfig.getTileDecorationCfg(tileDecorationType)?.lang;
        return textType == null ? null : getText(textType);
    }
    export function getUnitName(unitType: number, gameConfig: Config.GameConfig, languageType?: LanguageType): string | null {
        const textType = gameConfig.getUnitTemplateCfg(unitType)?.lang;
        return textType == null ? null : getText(textType, languageType);
    }
    export function getWeatherName(weatherType: number, gameConfig: Config.GameConfig): string | null {
        const textType = gameConfig.getWeatherCfg(weatherType)?.lang;
        return textType == null ? null : getText(textType);
    }

    export function getUnitActionName(actionType: Types.UnitActionType): string | null{
        switch (actionType) {
            case Types.UnitActionType.BeLoaded          : return getText(LangTextType.B0037);
            case Types.UnitActionType.Join              : return getText(LangTextType.B0038);
            case Types.UnitActionType.UseCoPower        : return getText(LangTextType.B0142);
            case Types.UnitActionType.UseCoSuperPower   : return getText(LangTextType.B0144);
            case Types.UnitActionType.Attack            : return getText(LangTextType.B0039);
            case Types.UnitActionType.Capture           : return getText(LangTextType.B0040);
            case Types.UnitActionType.Dive              : return getText(LangTextType.B0041);
            case Types.UnitActionType.Surface           : return getText(LangTextType.B0042);
            case Types.UnitActionType.BuildTile         : return getText(LangTextType.B0043);
            case Types.UnitActionType.Supply            : return getText(LangTextType.B0044);
            case Types.UnitActionType.LaunchUnit        : return getText(LangTextType.B0045);
            case Types.UnitActionType.DropUnit          : return getText(LangTextType.B0046);
            case Types.UnitActionType.LaunchFlare       : return getText(LangTextType.B0047);
            case Types.UnitActionType.LaunchSilo        : return getText(LangTextType.B0048);
            case Types.UnitActionType.LoadCo            : return getText(LangTextType.B0139);
            case Types.UnitActionType.ProduceUnit       : return getText(LangTextType.B0049);
            case Types.UnitActionType.Wait              : return getText(LangTextType.B0050);
            default                                     : return null;
        }
    }

    export function getUnitAiModeName(mode: Types.UnitAiMode): string | null {
        switch (mode) {
            case Types.UnitAiMode.NoMove                : return getText(LangTextType.B0721);
            case Types.UnitAiMode.Normal                : return getText(LangTextType.B0723);
            case Types.UnitAiMode.WaitUntilCanAttack    : return getText(LangTextType.B0722);
            default                                     : return null;
        }
    }

    export function getRankName(playerRank: number): string | null {
        switch (playerRank) {
            case 0  : return getText(LangTextType.B0061);
            case 1  : return getText(LangTextType.B0062);
            case 2  : return getText(LangTextType.B0063);
            case 3  : return getText(LangTextType.B0064);
            case 4  : return getText(LangTextType.B0065);
            case 5  : return getText(LangTextType.B0066);
            case 6  : return getText(LangTextType.B0067);
            case 7  : return getText(LangTextType.B0068);
            case 8  : return getText(LangTextType.B0069);
            case 9  : return getText(LangTextType.B0070);
            case 10 : return getText(LangTextType.B0071);
            case 11 : return getText(LangTextType.B0072);
            case 12 : return getText(LangTextType.B0073);
            case 13 : return getText(LangTextType.B0074);
            case 14 : return getText(LangTextType.B0075);
            case 15 : return getText(LangTextType.B0076);
            default : return null;
        }
    }

    export function getMoveTypeName(moveType: number, gameConfig: Config.GameConfig): string | null {
        const langTextType = gameConfig.getMoveTypeCfg(moveType)?.lang;
        return langTextType != null ? Lang.getText(langTextType) : null;
    }

    export function getUnitCategoryName(unitCategory: number, gameConfig: Config.GameConfig): string | null {
        const langTextType = gameConfig.getUnitCategoryCfg(unitCategory)?.lang;
        return langTextType != null ? Lang.getText(langTextType) : null;
    }

    export function getWarTypeName(type: Types.WarType): string | null {
        switch (type) {
            case Types.WarType.McwStd   : return getText(LangTextType.B0417);
            case Types.WarType.McwFog   : return getText(LangTextType.B0418);
            case Types.WarType.Me       : return getText(LangTextType.B0419);
            case Types.WarType.MrwStd   : return getText(LangTextType.B0415);
            case Types.WarType.MrwFog   : return getText(LangTextType.B0416);
            case Types.WarType.MfwStd   : return getText(LangTextType.B0812);
            case Types.WarType.MfwFog   : return getText(LangTextType.B0813);
            case Types.WarType.ScwStd   : return getText(LangTextType.B0610);
            case Types.WarType.ScwFog   : return getText(LangTextType.B0611);
            case Types.WarType.SfwStd   : return getText(LangTextType.B0612);
            case Types.WarType.SfwFog   : return getText(LangTextType.B0613);
            case Types.WarType.CcwStd   : return getText(LangTextType.B0725);
            case Types.WarType.CcwFog   : return getText(LangTextType.B0726);
            case Types.WarType.SrwStd   : return getText(LangTextType.B0257);
            case Types.WarType.SrwFog   : return getText(LangTextType.B0817);
            default                     : return null;
        }
    }

    export function getWarBasicSettingsName(type: Types.WarBasicSettingsType): string | null {
        switch (type) {
            case Types.WarBasicSettingsType.MapId                   : return getText(LangTextType.B0225);
            case Types.WarBasicSettingsType.WarName                 : return getText(LangTextType.B0185);
            case Types.WarBasicSettingsType.WarPassword             : return getText(LangTextType.B0186);
            case Types.WarBasicSettingsType.WarComment              : return getText(LangTextType.B0187);
            case Types.WarBasicSettingsType.WarRuleTitle            : return getText(LangTextType.B0318);
            case Types.WarBasicSettingsType.HasFog                  : return getText(LangTextType.B0020);
            case Types.WarBasicSettingsType.Weather                 : return getText(LangTextType.B0705);
            case Types.WarBasicSettingsType.WarEvent                : return getText(LangTextType.B0469);
            case Types.WarBasicSettingsType.TurnsLimit              : return getText(LangTextType.B0842);
            case Types.WarBasicSettingsType.TimerType               : return getText(LangTextType.B0574);
            case Types.WarBasicSettingsType.TimerRegularParam       : return getText(LangTextType.B0021);
            case Types.WarBasicSettingsType.TimerIncrementalParam1  : return getText(LangTextType.B0389);
            case Types.WarBasicSettingsType.TimerIncrementalParam2  : return getText(LangTextType.B0390);
            case Types.WarBasicSettingsType.SpmSaveSlotIndex        : return getText(LangTextType.B0255);
            case Types.WarBasicSettingsType.SpmSaveSlotComment      : return getText(LangTextType.B0605);
            default                                                 : return null;
        }
    }

    export function getMapReviewStatusText(status: Types.MapReviewStatus): string | null{
        switch (status) {
            case Types.MapReviewStatus.None         : return getText(LangTextType.B0273);
            case Types.MapReviewStatus.Reviewing    : return getText(LangTextType.B0274);
            case Types.MapReviewStatus.Rejected     : return getText(LangTextType.B0275);
            case Types.MapReviewStatus.Accepted     : return getText(LangTextType.B0276);
            default                                 : return null;
        }
    }

    export function getMapEditorDrawerModeText(mode: Types.MapEditorDrawerMode): string | null{
        switch (mode) {
            case Types.MapEditorDrawerMode.Preview                  : return getText(LangTextType.B0286);
            case Types.MapEditorDrawerMode.DrawUnit                 : return getText(LangTextType.B0281);
            case Types.MapEditorDrawerMode.DrawTileBase             : return getText(LangTextType.B0282);
            case Types.MapEditorDrawerMode.DrawTileDecorator        : return getText(LangTextType.B0662);
            case Types.MapEditorDrawerMode.DrawTileObject           : return getText(LangTextType.B0283);
            case Types.MapEditorDrawerMode.DeleteUnit               : return getText(LangTextType.B0284);
            case Types.MapEditorDrawerMode.DeleteTileDecorator      : return getText(LangTextType.B0661);
            case Types.MapEditorDrawerMode.DeleteTileObject         : return getText(LangTextType.B0285);
            case Types.MapEditorDrawerMode.AddTileToLocation        : return getText(LangTextType.B0759);
            case Types.MapEditorDrawerMode.DeleteTileFromLocation   : return getText(LangTextType.B0760);
            default                                                 : return null;
        }
    }

    export function getUnitActionStateText(state: Types.UnitActionState): string | null{
        switch (state) {
            case Types.UnitActionState.Acted    : return getText(LangTextType.B0368);
            case Types.UnitActionState.Idle     : return getText(LangTextType.B0369);
            default                             : return null;
        }
    }

    export function getChatChannelName(channel: Types.ChatChannel, languageType: LanguageType = getCurrentLanguageType()): string | null {
        switch (channel) {
            case Types.ChatChannel.System   : return getText(LangTextType.B0374, languageType);
            case Types.ChatChannel.PublicEn : return getText(LangTextType.B0373, languageType);
            case Types.ChatChannel.PublicCn : return getText(LangTextType.B0384, languageType);
            default                         : return null;
        }
    }

    export function getUnitAndTileSkinName(skinId: number): string | null {
        switch (skinId) {
            case 0  : return "";
            case 1  : return getText(LangTextType.B0004);
            case 2  : return getText(LangTextType.B0005);
            case 3  : return getText(LangTextType.B0006);
            case 4  : return getText(LangTextType.B0007);
            case 5  : return getText(LangTextType.B0700);
            default : return null;
        }
    }

    export function getCoSkillTypeName(skillType: Types.CoSkillType): string | null {
        switch (skillType) {
            case Types.CoSkillType.Passive      : return getText(LangTextType.B0576);
            case Types.CoSkillType.Power        : return getText(LangTextType.B0577);
            case Types.CoSkillType.SuperPower   : return getText(LangTextType.B0578);
            default                             : return null;
        }
    }

    export function getPlayerAliveStateName(state: Types.PlayerAliveState): string | null {
        switch (state) {
            case Types.PlayerAliveState.Alive   : return getText(LangTextType.B0471);
            case Types.PlayerAliveState.Dead    : return getText(LangTextType.B0472);
            case Types.PlayerAliveState.Dying   : return getText(LangTextType.B0473);
            default                             : return null;
        }
    }

    export function getTurnPhaseName(phaseCode: Types.TurnPhaseCode): string | null {
        switch (phaseCode) {
            case Types.TurnPhaseCode.WaitBeginTurn  : return getText(LangTextType.B0474);
            case Types.TurnPhaseCode.Main           : return getText(LangTextType.B0475);
            default                                 : return null;
        }
    }

    export function getWarEventConditionTypeName(type: WarEventConditionType): string | null {
        switch (type) {
            case WarEventConditionType.WecTurnIndexEqualTo                  : return getText(LangTextType.B0504);
            case WarEventConditionType.WecTurnIndexGreaterThan              : return getText(LangTextType.B0505);
            case WarEventConditionType.WecTurnIndexLessThan                 : return getText(LangTextType.B0506);
            case WarEventConditionType.WecTurnIndexRemainderEqualTo         : return getText(LangTextType.B0507);
            case WarEventConditionType.WecTurnPhaseEqualTo                  : return getText(LangTextType.B0508);
            case WarEventConditionType.WecTurnAndPlayer                     : return getText(LangTextType.B0781);
            case WarEventConditionType.WecPlayerIndexInTurnEqualTo          : return getText(LangTextType.B0509);
            case WarEventConditionType.WecPlayerIndexInTurnGreaterThan      : return getText(LangTextType.B0510);
            case WarEventConditionType.WecPlayerIndexInTurnLessThan         : return getText(LangTextType.B0511);
            case WarEventConditionType.WecEventCalledCountTotalEqualTo      : return getText(LangTextType.B0512);
            case WarEventConditionType.WecEventCalledCountTotalGreaterThan  : return getText(LangTextType.B0513);
            case WarEventConditionType.WecEventCalledCountTotalLessThan     : return getText(LangTextType.B0514);
            case WarEventConditionType.WecEventCalledCount                  : return getText(LangTextType.B0789);
            case WarEventConditionType.WecWeatherAndFog                     : return getText(LangTextType.B0794);
            case WarEventConditionType.WecPlayerAliveStateEqualTo           : return getText(LangTextType.B0515);
            case WarEventConditionType.WecPlayerPresence                    : return getText(LangTextType.B0786);
            case WarEventConditionType.WecTilePlayerIndexEqualTo            : return getText(LangTextType.B0716);
            case WarEventConditionType.WecTileTypeEqualTo                   : return getText(LangTextType.B0717);
            case WarEventConditionType.WecTilePresence                      : return getText(LangTextType.B0779);
            case WarEventConditionType.WecUnitPresence                      : return getText(LangTextType.B0775);
            case WarEventConditionType.WecCustomCounter                     : return getText(LangTextType.B0802);
            case WarEventConditionType.WecOngoingPersistentActionPresence   : return getText(LangTextType.B0901);
            default                                                         : return null;
        }
    }

    export function getWarEventActionTypeName(type: WarEventActionType): string | null {
        switch (type) {
            case WarEventActionType.AddUnit                         : return getText(LangTextType.B0617);
            case WarEventActionType.SetUnitState                    : return getText(LangTextType.B0806);
            case WarEventActionType.SetTileType                     : return getText(LangTextType.B0825);
            case WarEventActionType.SetTileState                    : return getText(LangTextType.B0861);
            case WarEventActionType.Dialogue                        : return getText(LangTextType.B0674);
            case WarEventActionType.SetViewpoint                    : return getText(LangTextType.B0713);
            case WarEventActionType.SetWeather                      : return getText(LangTextType.B0715);
            case WarEventActionType.SetForceFogCode                 : return getText(LangTextType.B0795);
            case WarEventActionType.SetCustomCounter                : return getText(LangTextType.B0800);
            case WarEventActionType.SimpleDialogue                  : return getText(LangTextType.B0728);
            case WarEventActionType.PlayBgm                         : return getText(LangTextType.B0750);
            case WarEventActionType.StopPersistentAction            : return getText(LangTextType.B0887);
            case WarEventActionType.DeprecatedSetPlayerAliveState   : return getText(LangTextType.B0618);
            case WarEventActionType.DeprecatedSetPlayerFund         : return getText(LangTextType.B0752);
            case WarEventActionType.DeprecatedSetPlayerCoEnergy     : return getText(LangTextType.B0756);
            case WarEventActionType.SetPlayerAliveState             : return getText(LangTextType.B0618);
            case WarEventActionType.SetPlayerState                  : return getText(LangTextType.B0810);
            case WarEventActionType.SetPlayerCoEnergy               : return getText(LangTextType.B0756);
            case WarEventActionType.PersistentShowText              : return getText(LangTextType.B0888);
            case WarEventActionType.PersistentModifyPlayerAttribute : return getText(LangTextType.B0903);
            default                                                 : return null;
        }
    }

    export function getPlayerRuleName(type: PlayerRuleType): string | null {
        switch (type) {
            case PlayerRuleType.TeamIndex               : return getText(LangTextType.B0019);
            case PlayerRuleType.BannedCoCategoryIdArray : return getText(LangTextType.B0403);
            case PlayerRuleType.BannedUnitTypeArray     : return getText(LangTextType.B0895);
            case PlayerRuleType.CanActivateCoSkill      : return getText(LangTextType.B0897);
            case PlayerRuleType.InitialFund             : return getText(LangTextType.B0178);
            case PlayerRuleType.IncomeMultiplier        : return getText(LangTextType.B0179);
            case PlayerRuleType.EnergyAddPctOnLoadCo    : return getText(LangTextType.B0180);
            case PlayerRuleType.EnergyGrowthMultiplier  : return getText(LangTextType.B0181);
            case PlayerRuleType.MoveRangeModifier       : return getText(LangTextType.B0182);
            case PlayerRuleType.AttackPowerModifier     : return getText(LangTextType.B0183);
            case PlayerRuleType.VisionRangeModifier     : return getText(LangTextType.B0184);
            case PlayerRuleType.LuckLowerLimit          : return getText(LangTextType.B0189);
            case PlayerRuleType.LuckUpperLimit          : return getText(LangTextType.B0190);
            case PlayerRuleType.AiCoIdInCcw             : return getText(LangTextType.B0642);
            case PlayerRuleType.AiControlInCcw          : return getText(LangTextType.B0641);
            default                                     : return null;
        }
    }


    export function getValueComparatorName(comparator: Types.ValueComparator): string | null {
        switch (comparator) {
            case Types.ValueComparator.EqualTo          : return getText(LangTextType.B0767);
            case Types.ValueComparator.NotEqualTo       : return getText(LangTextType.B0768);
            case Types.ValueComparator.GreaterThan      : return getText(LangTextType.B0769);
            case Types.ValueComparator.NotGreaterThan   : return getText(LangTextType.B0770);
            case Types.ValueComparator.LessThan         : return getText(LangTextType.B0771);
            case Types.ValueComparator.NotLessThan      : return getText(LangTextType.B0772);
            default                                     : return null;
        }
    }

    export function getForceFogCodeName(code: Types.ForceFogCode): string | null {
        switch (code) {
            case Types.ForceFogCode.Fog         : return getText(LangTextType.B0796);
            case Types.ForceFogCode.Clear       : return getText(LangTextType.B0797);
            case Types.ForceFogCode.None        : return getText(LangTextType.B0798);
            default                             : return null;
        }
    }

    export function getGameVersionName(type: GameVersion): string | null {
        switch (type) {
            case GameVersion.Legacy : return getText(LangTextType.B0621);
            case GameVersion.Test   : return getText(LangTextType.B0622);
            case GameVersion.Awbw   : return getText(LangTextType.B0649);
            default                 : return null;
        }
    }
    export function getGameVersionDesc(type: GameVersion): string | null {
        switch (type) {
            case GameVersion.Legacy : return getText(LangTextType.A0217);
            case GameVersion.Test   : return getText(LangTextType.A0218);
            case GameVersion.Awbw   : return getText(LangTextType.A0224);
            default                 : return null;
        }
    }

    export function getStringInCurrentLanguage(nameList: Types.Undefinable<string[]>): string | null {
        if (!nameList) {
            return null;
        } else {
            return getCurrentLanguageType() === LanguageType.Chinese
                ? nameList[0]
                : nameList[1] || nameList[0];
        }
    }
    export function getLanguageText({ textArray, languageType = getCurrentLanguageType(), useAlternate = true }: {
        textArray       : Types.Undefinable<CommonProto.Structure.ILanguageText[]>;
        languageType?   : LanguageType;
        useAlternate?   : boolean;
    }): string | null {
        if ((textArray == null) || (!textArray.length)) {
            return null;
        }

        const data = textArray.find(v => v.languageType === languageType);
        if (data) {
            return data.text ?? null;
        } else {
            return useAlternate
                ? getLanguageText({ textArray, languageType: LanguageType.English, useAlternate: false })
                    || getLanguageText({ textArray, languageType: LanguageType.Chinese, useAlternate: false })
                : null;
        }
    }
    export function concatLanguageTextList(textList: Types.Undefinable<CommonProto.Structure.ILanguageText[]>): string {
        const strList: string[] = [];
        for (const data of textList || []) {
            strList.push(data.text || `??`);
        }
        return strList.join(`, `);
    }

    export function getBootTimerTypeName(type: Types.BootTimerType): string | null {
        switch (type) {
            case Types.BootTimerType.Regular    : return getText(LangTextType.B0387);
            case Types.BootTimerType.Incremental: return getText(LangTextType.B0388);
            default                             : return null;
        }
    }
    export function getBootTimerDesc(params: number[]): string | null {
        params          = params || [];
        const timerType = params[0] as Types.BootTimerType;
        if (timerType === Types.BootTimerType.Regular) {
            return `${getText(LangTextType.B0387)} ${Helpers.getTimeDurationText2(params[1])}`;
        } else if (timerType === Types.BootTimerType.Incremental) {
            return `${getText(LangTextType.B0388)} ${Helpers.getTimeDurationText2(params[1])} + ${Helpers.getTimeDurationText2(params[2])}`;
        } else {
            return null;
        }
    }
    export async function getGameStartDesc(data: CommonProto.NetMessage.MsgMpwCommonBroadcastGameStart.IS): Promise<string> {
        const playerArray   : string[] = [];
        let playerIndex     = CommonConstants.PlayerIndex.First;
        for (const playerInfo of data.playerInfoList || []) {
            const userId = playerInfo.userId;
            playerArray.push(`P${playerIndex}: ${userId != null ? await User.UserModel.getUserNickname(userId) : `----`}`);
            ++playerIndex;
        }

        const mapId = data.mapId;
        return [
            getFormattedText(LangTextType.F0027, mapId != null ? await WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId) : getText(LangTextType.B0557)),
            ...playerArray,
            getText(LangTextType.A0125)
        ].join("\n");
    }
}

// export default Lang;
