
namespace ProtoEnums {
    export const enum S_Login_Status {
        Succeed,
        AccountInvalid,
        PasswordInvalid,
        AlreadyLoggedIn,
    }

    export const enum S_Register_Status {
        Succeed,
        AccountInvalid,
        AccountUsed,
        PasswordInvalid,
        AlreadyLoggedIn,
    }

    export const enum S_Logout_Status {
        SelfRequest,
        Collision,
    }
}
