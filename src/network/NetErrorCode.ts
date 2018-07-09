
namespace Network {
    export const enum NetErrorCode {
        NoError = 0,

        Login_InvalidAccountOrPassword,
        Login_AlreadyLoggedIn,

        Register_InvalidAccount,
        Register_UsedAccount,
        Register_AlreadyLoggedIn,
        Register_InvalidPassword,
        Register_InvalidNickname,
        Register_UsedNickname,
    }
}
