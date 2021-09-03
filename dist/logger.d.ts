import { IFSM, TransitionEvent } from "/index.js";
export declare class Logger {
    private fsm;
    private log;
    pointers: Set<any>;
    constructor(fsm: IFSM<any, any, any>, log: (evt: TransitionEvent<any, any>) => void);
    terminate(): void;
}
