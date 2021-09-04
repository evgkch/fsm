import { IFSM, TransitionEvent, Pointer } from "/index.js";

export class Logger {

    pointers: Set<any> = new Set;

    constructor(private fsm: IFSM<Pointer, any, any>, private log: (evt: TransitionEvent<any ,any>) => void) {        
        for (let pointer in this.fsm.scheme)
        {
            this.pointers.add(pointer);
            this.fsm.scheme[pointer]?.forEach(t => {
                if (t.to) this.pointers.add(t.to);
            })
        }
        this.pointers.forEach(pointer => this.fsm.on(pointer, this.log.bind(this)));
    }

    terminate() {
        this.pointers.forEach(pointer => this.fsm.off(pointer, this.log.bind(this)));
    }

}