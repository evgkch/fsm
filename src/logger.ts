import { IState, IFSM } from "./index";

export class Logger {

    stateTypes: Set<IState['type']> = new Set;

    constructor(private fsm: IFSM<any>, private log: (state: IState) => void) {        
        for (let stateType in this.fsm.scheme)
        {
            this.stateTypes.add(stateType);
            this.fsm.scheme[stateType]?.forEach(t => {
                if (t.to) this.stateTypes.add(t.to);
            })
        }
        this.stateTypes.forEach(stateType => this.fsm.on(stateType, this.log.bind(this)));
    }

    terminate() {
        this.stateTypes.forEach(stateType => this.fsm.off(stateType, this.log.bind(this)));
    }

}