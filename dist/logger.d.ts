import { IFSM, TransitionEvent, Pointer } from "./index.js";
export declare class Logger {
    private fsm;
    private log;
    pointers: Set<any>;
    constructor(fsm: IFSM<Pointer, any, any>, log: (evt: TransitionEvent<any, any>) => void);
    terminate(): void;
}
