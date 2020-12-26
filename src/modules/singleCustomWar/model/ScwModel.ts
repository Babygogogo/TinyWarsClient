
namespace TinyWars.SingleCustomWar.ScwModel {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import IActionContainer         = ProtoTypes.WarAction.IActionContainer;

    let _war            : ScwWar;
    let _cachedActions  = new Array<IActionContainer>();

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar({ warData, slotIndex, slotComment }: {
        warData     : WarSerialization.ISerialWar;
        slotIndex   : number;
        slotComment : string;
    }): Promise<ScwWar> {
        if (_war) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        _war = (await new SingleCustomWar.ScwWar().init(warData)).startRunning().startRunningView() as ScwWar;
        _war.setSaveSlotIndex(slotIndex);
        _war.setSaveSlotComment(slotComment);
        checkAndRunRobot();

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war                    = undefined;
            _cachedActions.length   = 0;
        }
    }

    export function getWar(): ScwWar | undefined {
        return _war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function updateByWarAction(container: IActionContainer): Promise<void> {
        const war = getWar();
        if (war) {
            if (container.actionId !== war.getExecutedActionsCount() + _cachedActions.length) {
                Logger.error(`ScwModel._updateByActionContainer() invalid action id: ${container.actionId}`);
            } else {
                _cachedActions.push(container);
                ScwActionExecutor.checkAndRunFirstCachedAction(war, _cachedActions);
            }
        }
    }

    export async function checkAndRunRobot(): Promise<void> {
        const war = getWar();
        if ((war) && (!war.checkIsHumanInTurn())) {
            await updateByWarAction(ScwActionReviser.revise(war, await ScwRobot.getNextAction(war)));
        }
    }
}
