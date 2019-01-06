
namespace TinyWars.CustomOnlineWarJoiner {
    import ProtoTypes = Utility.ProtoTypes;

    export namespace JoinWarModel {
        let warInfos: ProtoTypes.IWaitingMultiCustomWarInfo[];

        export function setWarInfos(infos: ProtoTypes.IWaitingMultiCustomWarInfo[]): void {
            warInfos = infos;
        }
        export function getWarInfos(): ProtoTypes.IWaitingMultiCustomWarInfo[] {
            return warInfos;
        }
    }
}
