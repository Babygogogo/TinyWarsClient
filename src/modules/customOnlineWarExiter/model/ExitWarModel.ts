
namespace TinyWars.CustomOnlineWarExiter {
    import ProtoTypes = Utility.ProtoTypes;

    export namespace ExitWarModel {
        let warInfos: ProtoTypes.IWaitingMultiCustomWarInfo[];

        export function setWarInfos(infos: ProtoTypes.IWaitingMultiCustomWarInfo[]): void {
            warInfos = infos;
        }
        export function getWarInfos(): ProtoTypes.IWaitingMultiCustomWarInfo[] {
            return warInfos;
        }
    }
}
