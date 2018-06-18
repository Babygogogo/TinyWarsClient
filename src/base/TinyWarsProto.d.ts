

/** Properties of a Container. */
export interface IContainer {

    /** Container C_Register */
    C_Register?: (IC_Register|null);
}


/** Properties of a C_Register. */
export interface IC_Register {

    /** C_Register msgCode */
    msgCode?: (number|null);

    /** C_Register account */
    account?: (string|null);

    /** C_Register password */
    password?: (string|null);
}



/** Properties of a S_Register. */
export interface IS_Register {

    /** S_Register msgCode */
    msgCode?: (number|null);

    /** S_Register status */
    status?: (S_Register.Status|null);
}


export namespace S_Register {

    /** Status enum. */
    enum Status {
        SUCCEED = 0,
        ACCOUNT_INVALID = 1,
        ACCOUNT_USED = 2,
        PASSWORD_INVALID = 3
    }
}
