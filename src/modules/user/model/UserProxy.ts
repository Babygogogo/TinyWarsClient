
namespace TinyWars.User {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;

    export namespace UserProxy {
        export function init(): void {
            NetManager.addListeners([
                { actionCode: NetMessageCodes.S_GetUserPublicInfo,  callback: _onSGetUserPublicInfo, },
            ])
        }

        export function reqGetUserPublicInfo(userId: number): void {
            NetManager.send({
                C_GetUserPublicInfo: {
                    userId,
                },
            });
        }
        function _onSGetUserPublicInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetUserPublicInfo;
            if (!data.errorCode) {
                UserModel.setUserInfo(data);
                Notify.dispatch(Notify.Type.SGetUserPublicInfo, data);
            }
        }
    }
}
