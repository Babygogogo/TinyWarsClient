
namespace Types {
    type ActionData = {
        [key: string]: ActionData | number | string;
    };

    export type Action = {
        actionCode   : number;
        [key: string]: ActionData | number | string;
    }
}
