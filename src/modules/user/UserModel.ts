
namespace User {
    export namespace UserModel {
        let userId       : number;
        let userPrivilege: number;

        export function updateOnLogin(data: Network.Proto.IS_Login): void {
            userId        = data.userId;
            userPrivilege = data.privilege;
        }

        export function getUserId(): number {
            return userId;
        }

        export function getUserPrivilege(): number {
            return userPrivilege;
        }
    }
}
