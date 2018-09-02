
namespace CustomOnlineWarJoiner {
    import ProtoTypes = Utility.ProtoTypes;

    export namespace JoinWarModel {
        let warInfos: ProtoTypes.IWaitingCustomOnlineWarInfo[];

        export function setWarInfos(infos: ProtoTypes.IWaitingCustomOnlineWarInfo[]): void {
            warInfos = infos;
        }
        export function getWarInfos(): ProtoTypes.IWaitingCustomOnlineWarInfo[] {
            return warInfos;
        }
    }
}
