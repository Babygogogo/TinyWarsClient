
namespace TinyWars.CustomOnlineWarExiter {
    import ProtoTypes = Utility.ProtoTypes;

    export namespace ExitWarModel {
        let warInfos: ProtoTypes.IWaitingCustomOnlineWarInfo[];

        export function setWarInfos(infos: ProtoTypes.IWaitingCustomOnlineWarInfo[]): void {
            warInfos = infos;
        }
        export function getWarInfos(): ProtoTypes.IWaitingCustomOnlineWarInfo[] {
            return warInfos;
        }
    }
}
