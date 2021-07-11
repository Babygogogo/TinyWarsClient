
import { UiImage }                      from "../../../gameui/UiImage";
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiComponent }                  from "../../../gameui/UiComponent";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { UiZoomableComponent }          from "../../../gameui/UiZoomableComponent";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { UiTab }                        from "../../../gameui/UiTab";
import { UiTabItemRenderer }            from "../../../gameui/UiTabItemRenderer";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { UiMapInfo }                    from "../../../gameui/UiMapInfo";
import { UiCoInfo }                     from "../../../gameui/UiCoInfo";
import { NetMessageCodes }              from "../../../network/NetMessageCodes";
import { ClientErrorCode }              from "../../../utility/ClientErrorCode";
import { ChatPanel }                    from "../../chat/view/ChatPanel";
import { CommonConfirmPanel }           from "../../common/view/CommonConfirmPanel";
import { CommonErrorPanel }             from "../../common/view/CommonErrorPanel";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { CommonCoInfoPanel }            from "../../common/view/CommonCoInfoPanel";
import { CommonAlertPanel }             from "../../common/view/CommonAlertPanel";
import { CommonInputPanel }             from "../../common/view/CommonInputPanel";
import { BwProduceUnitPanel }           from "../../baseWar/view/BwProduceUnitPanel";
import { BwUnitActionsPanel }           from "../../baseWar/view/BwUnitActionsPanel";
import { UserPanel }                    from "../../user/view/UserPanel";
import { UserSettingsPanel }            from "../../user/view/UserSettingsPanel";
import { MpwWar }                       from "../../multiPlayerWar/model/MpwWar";
import { MfrCreateSettingsPanel }       from "../../multiFreeRoom/view/MfrCreateSettingsPanel";
import { SpmCreateSfwSaveSlotsPanel }   from "../../singlePlayerMode/view/SpmCreateSfwSaveSlotsPanel";
import { BwWar }                        from "../../baseWar/model/BwWar";
import { BwUnit }                       from "../../baseWar/model/BwUnit";
import * as NetManager                  from "../../../network/NetManager";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as DamageCalculator            from "../../../utility/DamageCalculator";
import * as DestructionHelpers          from "../../../utility/DestructionHelpers";
import * as FloatText                   from "../../../utility/FloatText";
import * as FlowManager                 from "../../../utility/FlowManager";
import * as GridIndexHelpers            from "../../../utility/GridIndexHelpers";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import * as LocalStorage                from "../../../utility/LocalStorage";
import * as NoSleepManager              from "../../../utility/NoSleepManager";
import * as Logger                      from "../../../utility/Logger";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as ProtoManager                from "../../../utility/ProtoManager";
import * as SoundManager                from "../../../utility/SoundManager";
import * as StageManager                from "../../../utility/StageManager";
import * as Types                       from "../../../utility/Types";
import * as VisibilityHelpers           from "../../../utility/VisibilityHelpers";
import * as BwHelpers                   from "../../baseWar/model/BwHelpers";
import * as BwWarRuleHelper             from "../../baseWar/model/BwWarRuleHelper";
import * as ChangeLogModel              from "../../changeLog/model/ChangeLogModel";
import * as ChangeLogProxy              from "../../changeLog/model/ChangeLogProxy";
import * as ChatProxy                   from "../../chat/model/ChatProxy";
import * as ChatModel                   from "../../chat/model/ChatModel";
import * as CommonModel                 from "../../common/model/CommonModel";
import * as CommonProxy                 from "../../common/model/CommonProxy";
import * as CcrModel                    from "../../coopCustomRoom/model/CcrModel";
import * as McrModel                    from "../../multiCustomRoom/model/McrModel";
import * as McrProxy                    from "../../multiCustomRoom/model/McrProxy";
import * as MfrModel                    from "../../multiFreeRoom/model/MfrModel";
import * as MfrProxy                    from "../../multiFreeRoom/model/MfrProxy";
import * as MpwModel                    from "../../multiPlayerWar/model/MpwModel";
import * as MpwProxy                    from "../../multiPlayerWar/model/MpwProxy";
import * as TimeModel                   from "../../time/model/TimeModel";
import * as UserModel                   from "../../user/model/UserModel";
import * as UserProxy                   from "../../user/model/UserProxy";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as WarMapProxy                 from "../../warMap/model/WarMapProxy";

export class BwBackgroundPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Bottom;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: BwBackgroundPanel;

    public static show(): void {
        if (!BwBackgroundPanel._instance) {
            BwBackgroundPanel._instance = new BwBackgroundPanel();
        }
        BwBackgroundPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (BwBackgroundPanel._instance) {
            await BwBackgroundPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this.skinName = "resource/skins/baseWar/BwBackgroundPanel.exml";
    }
}
