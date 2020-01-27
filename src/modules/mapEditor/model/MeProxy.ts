
namespace TinyWars.MapEditor.MeProxy {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import Helpers    = Utility.Helpers;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_MeGetDataList,                   callback: _onSMeGetDataList },
        ], MeProxy);
    }

    export function reqGetDataList(): void {
        NetManager.send({
            C_MeGetDataList: {},
        });
    }
    function _onSMeGetDataList(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_MeGetDataList;
        if (!data.errorCode) {
            MeModel.resetDataList(data.dataList);
            Notify.dispatch(Notify.Type.SMeGetDataList, data);
        }
    }
}
