
import UserModel            from "../../user/model/UserModel";
import WarMapModel          from "../../warMap/model/WarMapModel";
import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
import CommonConstants      from "../helpers/CommonConstants";
import CompatibilityHelpers from "../helpers/CompatibilityHelpers";
import Helpers              from "../helpers/Helpers";
import LocalStorage         from "../helpers/LocalStorage";
import TwnsServerErrorCode  from "../helpers/ServerErrorCode";
import Types                from "../helpers/Types";
import ProtoTypes           from "../proto/ProtoTypes";
import TwnsLangCommonText   from "./LangCommonText";
import TwnsLangErrorText    from "./LangErrorText";
import TwnsLangTextType     from "./LangTextType";

namespace Lang {
    import LanguageType             = Types.LanguageType;
    import WarEventConditionType    = Types.WarEventConditionType;
    import WarEventActionType       = Types.WarEventActionType;
    import PlayerRuleType           = Types.PlayerRuleType;
    import GameVersion              = Types.GameVersion;
    import BgmCode                  = Types.BgmCode;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import ServerErrorCode          = TwnsServerErrorCode.ServerErrorCode;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import LangCommonText           = TwnsLangCommonText.LangCommonText;
    import LangErrorText            = TwnsLangErrorText.LangErrorText;

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
            throw new Error(`Lang.getText() empty text: ${t} ${languageType}`);
        }
    }

    export function getFormattedText(t: LangTextType, ...params: (Types.Undefinable<number | string>)[]): string {
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
            case 1  : return getText(LangTextType.B0008);
            case 2  : return getText(LangTextType.B0009);
            case 3  : return getText(LangTextType.B0010);
            case 4  : return getText(LangTextType.B0011);
            default : return null;
        }
    }

    export function getTileName(tileType: Types.TileType): string | null {
        switch (tileType) {
            case Types.TileType.Plain           : return getText(LangTextType.B1000);
            case Types.TileType.River           : return getText(LangTextType.B1001);
            case Types.TileType.Sea             : return getText(LangTextType.B1002);
            case Types.TileType.Beach           : return getText(LangTextType.B1003);
            case Types.TileType.Road            : return getText(LangTextType.B1004);
            case Types.TileType.BridgeOnPlain   : return getText(LangTextType.B1005);
            case Types.TileType.BridgeOnRiver   : return getText(LangTextType.B1006);
            case Types.TileType.BridgeOnBeach   : return getText(LangTextType.B1007);
            case Types.TileType.BridgeOnSea     : return getText(LangTextType.B1008);
            case Types.TileType.Wood            : return getText(LangTextType.B1009);
            case Types.TileType.Mountain        : return getText(LangTextType.B1010);
            case Types.TileType.Wasteland       : return getText(LangTextType.B1011);
            case Types.TileType.Ruins           : return getText(LangTextType.B1012);
            case Types.TileType.Fire            : return getText(LangTextType.B1013);
            case Types.TileType.Rough           : return getText(LangTextType.B1014);
            case Types.TileType.MistOnSea       : return getText(LangTextType.B1015);
            case Types.TileType.Reef            : return getText(LangTextType.B1016);
            case Types.TileType.Plasma          : return getText(LangTextType.B1017);
            case Types.TileType.GreenPlasma     : return getText(LangTextType.B1018);
            case Types.TileType.Meteor          : return getText(LangTextType.B1019);
            case Types.TileType.Silo            : return getText(LangTextType.B1020);
            case Types.TileType.EmptySilo       : return getText(LangTextType.B1021);
            case Types.TileType.Headquarters    : return getText(LangTextType.B1022);
            case Types.TileType.City            : return getText(LangTextType.B1023);
            case Types.TileType.CommandTower    : return getText(LangTextType.B1024);
            case Types.TileType.Radar           : return getText(LangTextType.B1025);
            case Types.TileType.Factory         : return getText(LangTextType.B1026);
            case Types.TileType.Airport         : return getText(LangTextType.B1027);
            case Types.TileType.Seaport         : return getText(LangTextType.B1028);
            case Types.TileType.TempAirport     : return getText(LangTextType.B1029);
            case Types.TileType.TempSeaport     : return getText(LangTextType.B1030);
            case Types.TileType.MistOnPlain     : return getText(LangTextType.B1031);
            case Types.TileType.MistOnRiver     : return getText(LangTextType.B1032);
            case Types.TileType.MistOnBeach     : return getText(LangTextType.B1033);
            default                             : return null;
        }
    }

    export function getTileDecoratorName(decoratorType: Types.TileDecoratorType): string | null {
        switch (decoratorType) {
            case Types.TileDecoratorType.Corner : return getText(LangTextType.B0663);
            case Types.TileDecoratorType.Empty  : return getText(LangTextType.B0001);
            default                             : return null;
        }
    }

    export function getUnitName(unitType: Types.UnitType): string | null {
        switch (unitType) {
            case Types.UnitType.Infantry        : return getText(LangTextType.B1200);
            case Types.UnitType.Mech            : return getText(LangTextType.B1201);
            case Types.UnitType.Bike            : return getText(LangTextType.B1202);
            case Types.UnitType.Recon           : return getText(LangTextType.B1203);
            case Types.UnitType.Flare           : return getText(LangTextType.B1204);
            case Types.UnitType.AntiAir         : return getText(LangTextType.B1205);
            case Types.UnitType.Tank            : return getText(LangTextType.B1206);
            case Types.UnitType.MediumTank      : return getText(LangTextType.B1207);
            case Types.UnitType.WarTank         : return getText(LangTextType.B1208);
            case Types.UnitType.Artillery       : return getText(LangTextType.B1209);
            case Types.UnitType.AntiTank        : return getText(LangTextType.B1210);
            case Types.UnitType.Rockets         : return getText(LangTextType.B1211);
            case Types.UnitType.Missiles        : return getText(LangTextType.B1212);
            case Types.UnitType.Rig             : return getText(LangTextType.B1213);
            case Types.UnitType.Fighter         : return getText(LangTextType.B1214);
            case Types.UnitType.Bomber          : return getText(LangTextType.B1215);
            case Types.UnitType.Duster          : return getText(LangTextType.B1216);
            case Types.UnitType.BattleCopter    : return getText(LangTextType.B1217);
            case Types.UnitType.TransportCopter : return getText(LangTextType.B1218);
            case Types.UnitType.Seaplane        : return getText(LangTextType.B1219);
            case Types.UnitType.Battleship      : return getText(LangTextType.B1220);
            case Types.UnitType.Carrier         : return getText(LangTextType.B1221);
            case Types.UnitType.Submarine       : return getText(LangTextType.B1222);
            case Types.UnitType.Cruiser         : return getText(LangTextType.B1223);
            case Types.UnitType.Lander          : return getText(LangTextType.B1224);
            case Types.UnitType.Gunboat         : return getText(LangTextType.B1225);
            default                             : return null;
        }
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

    export function getMoveTypeName(t: Types.MoveType): string | null {
        switch (t) {
            case Types.MoveType.Air         : return getText(LangTextType.B0117);
            case Types.MoveType.Infantry    : return getText(LangTextType.B0112);
            case Types.MoveType.Mech        : return getText(LangTextType.B0113);
            case Types.MoveType.Ship        : return getText(LangTextType.B0118);
            case Types.MoveType.Tank        : return getText(LangTextType.B0114);
            case Types.MoveType.TireA       : return getText(LangTextType.B0115);
            case Types.MoveType.TireB       : return getText(LangTextType.B0116);
            case Types.MoveType.Transport   : return getText(LangTextType.B0119);
            default                         : return null;
        }
    }

    export function getUnitCategoryName(t: Types.UnitCategory): string | null {
        switch (t) {
            case Types.UnitCategory.All                 : return getText(LangTextType.B0120);
            case Types.UnitCategory.Ground              : return getText(LangTextType.B0121);
            case Types.UnitCategory.Naval               : return getText(LangTextType.B0122);
            case Types.UnitCategory.Air                 : return getText(LangTextType.B0123);
            case Types.UnitCategory.GroundOrNaval       : return getText(LangTextType.B0124);
            case Types.UnitCategory.GroundOrAir         : return getText(LangTextType.B0125);
            case Types.UnitCategory.Direct              : return getText(LangTextType.B0126);
            case Types.UnitCategory.Indirect            : return getText(LangTextType.B0127);
            case Types.UnitCategory.Foot                : return getText(LangTextType.B0128);
            case Types.UnitCategory.Infantry            : return getText(LangTextType.B0129);
            case Types.UnitCategory.Vehicle             : return getText(LangTextType.B0130);
            case Types.UnitCategory.DirectMachine       : return getText(LangTextType.B0131);
            case Types.UnitCategory.Transport           : return getText(LangTextType.B0132);
            case Types.UnitCategory.LargeNaval          : return getText(LangTextType.B0133);
            case Types.UnitCategory.Copter              : return getText(LangTextType.B0134);
            case Types.UnitCategory.Tank                : return getText(LangTextType.B0135);
            case Types.UnitCategory.AirExceptSeaplane   : return getText(LangTextType.B0136);
            default                                     : return null;
        }
    }

    export function getWarTypeName(type: Types.WarType): string | null {
        switch (type) {
            case Types.WarType.McwStd   : return getText(LangTextType.B0417);
            case Types.WarType.McwFog   : return getText(LangTextType.B0418);
            case Types.WarType.Me       : return getText(LangTextType.B0419);
            case Types.WarType.MrwStd   : return getText(LangTextType.B0415);
            case Types.WarType.MrwFog   : return getText(LangTextType.B0416);
            case Types.WarType.ScwStd   : return getText(LangTextType.B0610);
            case Types.WarType.ScwFog   : return getText(LangTextType.B0611);
            case Types.WarType.SfwStd   : return getText(LangTextType.B0612);
            case Types.WarType.SfwFog   : return getText(LangTextType.B0613);
            default                     : return null;
        }
    }

    export function getWarBasicSettingsName(type: Types.WarBasicSettingsType): string | null {
        switch (type) {
            case Types.WarBasicSettingsType.MapName                 : return Lang.getText(LangTextType.B0225);
            case Types.WarBasicSettingsType.WarName                 : return Lang.getText(LangTextType.B0185);
            case Types.WarBasicSettingsType.WarPassword             : return Lang.getText(LangTextType.B0186);
            case Types.WarBasicSettingsType.WarComment              : return Lang.getText(LangTextType.B0187);
            case Types.WarBasicSettingsType.WarRuleTitle            : return Lang.getText(LangTextType.B0318);
            case Types.WarBasicSettingsType.HasFog                  : return Lang.getText(LangTextType.B0020);
            case Types.WarBasicSettingsType.TimerType               : return Lang.getText(LangTextType.B0574);
            case Types.WarBasicSettingsType.TimerRegularParam       : return Lang.getText(LangTextType.B0021);
            case Types.WarBasicSettingsType.TimerIncrementalParam1  : return Lang.getText(LangTextType.B0389);
            case Types.WarBasicSettingsType.TimerIncrementalParam2  : return Lang.getText(LangTextType.B0390);
            case Types.WarBasicSettingsType.SpmSaveSlotIndex        : return Lang.getText(LangTextType.B0255);
            case Types.WarBasicSettingsType.SpmSaveSlotComment      : return Lang.getText(LangTextType.B0605);
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
            case Types.MapEditorDrawerMode.Preview              : return getText(LangTextType.B0286);
            case Types.MapEditorDrawerMode.DrawUnit             : return getText(LangTextType.B0281);
            case Types.MapEditorDrawerMode.DrawTileBase         : return getText(LangTextType.B0282);
            case Types.MapEditorDrawerMode.DrawTileDecorator    : return getText(LangTextType.B0662);
            case Types.MapEditorDrawerMode.DrawTileObject       : return getText(LangTextType.B0283);
            case Types.MapEditorDrawerMode.DeleteUnit           : return getText(LangTextType.B0284);
            case Types.MapEditorDrawerMode.DeleteTileDecorator  : return getText(LangTextType.B0661);
            case Types.MapEditorDrawerMode.DeleteTileObject     : return getText(LangTextType.B0285);
            default                                             : return null;
        }
    }

    export function getUnitActionStateText(state: Types.UnitActionState): string | null{
        switch (state) {
            case Types.UnitActionState.Acted    : return getText(LangTextType.B0368);
            case Types.UnitActionState.Idle     : return getText(LangTextType.B0369);
            default                             : return null;
        }
    }

    export function getChatChannelName(channel: Types.ChatChannel): string | null {
        switch (channel) {
            case Types.ChatChannel.System   : return getText(LangTextType.B0374);
            case Types.ChatChannel.PublicEn : return getText(LangTextType.B0373);
            case Types.ChatChannel.PublicCn : return getText(LangTextType.B0384);
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

    export function getBgmName(code: BgmCode): string | null {
        switch (code) {
            case BgmCode.None           : return getText(LangTextType.B0001);
            case BgmCode.Lobby01        : return getText(LangTextType.B0632);
            case BgmCode.MapEditor01    : return getText(LangTextType.B0633);
            case BgmCode.Power00        : return getText(LangTextType.B0660);
            case BgmCode.Co0000         : return getText(LangTextType.B0638);
            case BgmCode.Co0001         : return getText(LangTextType.B0634);
            case BgmCode.Co0002         : return getText(LangTextType.B0636);
            case BgmCode.Co0003         : return getText(LangTextType.B0656);
            case BgmCode.Co0004         : return getText(LangTextType.B0655);
            case BgmCode.Co0005         : return getText(LangTextType.B0637);
            case BgmCode.Co0006         : return getText(LangTextType.B0654);
            case BgmCode.Co0007         : return getText(LangTextType.B0635);
            case BgmCode.Co0008         : return getText(LangTextType.B0657);
            case BgmCode.Co0009         : return getText(LangTextType.B0658);
            case BgmCode.Co0010         : return getText(LangTextType.B0653);
            case BgmCode.Co0011         : return getText(LangTextType.B0659);
            case BgmCode.Co9999         : return getText(LangTextType.B0639);
            default                     : return null;
        }
    }

    export function getWarRuleNameInLanguage(warRule: ProtoTypes.WarRule.IWarRule): string | null {
        if (warRule.ruleId == null) {
            return getText(LangTextType.B0321);
        } else {
            const ruleNameArray = warRule.ruleNameArray;
            return ruleNameArray ? getLanguageText({ textArray: ruleNameArray }) : null;
        }
    }

    export function getWarEventConditionTypeName(type: WarEventConditionType): string | null {
        switch (type) {
            case WarEventConditionType.WecTurnIndexEqualTo                  : return getText(LangTextType.B0504);
            case WarEventConditionType.WecTurnIndexGreaterThan              : return getText(LangTextType.B0505);
            case WarEventConditionType.WecTurnIndexLessThan                 : return getText(LangTextType.B0506);
            case WarEventConditionType.WecTurnIndexRemainderEqualTo         : return getText(LangTextType.B0507);
            case WarEventConditionType.WecTurnPhaseEqualTo                  : return getText(LangTextType.B0508);
            case WarEventConditionType.WecPlayerIndexInTurnEqualTo          : return getText(LangTextType.B0509);
            case WarEventConditionType.WecPlayerIndexInTurnGreaterThan      : return getText(LangTextType.B0510);
            case WarEventConditionType.WecPlayerIndexInTurnLessThan         : return getText(LangTextType.B0511);
            case WarEventConditionType.WecEventCalledCountTotalEqualTo      : return getText(LangTextType.B0512);
            case WarEventConditionType.WecEventCalledCountTotalGreaterThan  : return getText(LangTextType.B0513);
            case WarEventConditionType.WecEventCalledCountTotalLessThan     : return getText(LangTextType.B0514);
            case WarEventConditionType.WecPlayerAliveStateEqualTo           : return getText(LangTextType.B0515);
            default                                                         : return null;
        }
    }

    export function getWarEventActionTypeName(type: WarEventActionType): string | null {
        switch (type) {
            case WarEventActionType.AddUnit                 : return getText(LangTextType.B0617);
            case WarEventActionType.SetPlayerAliveState     : return getText(LangTextType.B0618);
            case WarEventActionType.Dialogue                : return getText(LangTextType.B0674);
            default                                         : return null;
        }
    }

    export function getPlayerRuleName(type: PlayerRuleType): string | null {
        switch (type) {
            case PlayerRuleType.TeamIndex               : return getText(LangTextType.B0019);
            case PlayerRuleType.BannedCoIdArray         : return getText(LangTextType.B0403);
            case PlayerRuleType.InitialFund             : return getText(LangTextType.B0178);
            case PlayerRuleType.IncomeMultiplier        : return getText(LangTextType.B0179);
            case PlayerRuleType.EnergyAddPctOnLoadCo    : return getText(LangTextType.B0180);
            case PlayerRuleType.EnergyGrowthMultiplier  : return getText(LangTextType.B0181);
            case PlayerRuleType.MoveRangeModifier       : return getText(LangTextType.B0182);
            case PlayerRuleType.AttackPowerModifier     : return getText(LangTextType.B0183);
            case PlayerRuleType.VisionRangeModifier     : return getText(LangTextType.B0184);
            case PlayerRuleType.LuckLowerLimit          : return getText(LangTextType.B0189);
            case PlayerRuleType.LuckUpperLimit          : return getText(LangTextType.B0190);
            case PlayerRuleType.AiCoIdInCcw             : return getText(LangTextType.B0641);
            case PlayerRuleType.AiControlInCcw          : return getText(LangTextType.B0642);
            default                                     : return null;
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
        textArray       : Types.Undefinable<ProtoTypes.Structure.ILanguageText[]>;
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
    export function concatLanguageTextList(textList: Types.Undefinable<ProtoTypes.Structure.ILanguageText[]>): string {
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
    export async function getGameStartDesc(data: ProtoTypes.NetMessage.MsgMpwCommonBroadcastGameStart.IS): Promise<string> {
        const playerArray   : string[] = [];
        let playerIndex     = CommonConstants.WarFirstPlayerIndex;
        for (const playerInfo of data.playerInfoList || []) {
            const userId = playerInfo.userId;
            playerArray.push(`P${playerIndex}: ${userId != null ? await UserModel.getUserNickname(userId).catch(err => { CompatibilityHelpers.showError(err); throw err; }) : `----`}`);
            ++playerIndex;
        }

        const mapId = data.mapId;
        return [
            getFormattedText(LangTextType.F0027, mapId != null ? await WarMapModel.getMapNameInCurrentLanguage(mapId).catch(err => { CompatibilityHelpers.showError(err); throw err; }) : getText(LangTextType.B0557)),
            ...playerArray,
            getText(LangTextType.A0125)
        ].join("\n");
    }
}

export default Lang;
