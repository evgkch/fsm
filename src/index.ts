import Emitter, { IEvent, IReceiver, Listener } from '/@lib/emitterjs';

export type Pointer = number | string | symbol;

interface IDispatcher {
    dispatch(event: IEvent): any;
}

export type Transition<P extends Pointer, E extends IEvent, S> = {
    to?: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => any;    
};

export type Scheme<P extends Pointer, E extends IEvent, S> = {
    [key in P]?: Transition<P, E, S>[];
};

export class TransitionEvent<P extends Pointer, S> implements IEvent {    
    constructor(public readonly type: P, public readonly state: S) {}
}

export interface IFSM<P extends Pointer, E extends IEvent, S> extends IDispatcher, IReceiver<TransitionEvent<P ,S>> {    
    readonly scheme: Scheme<P, E, S>;       
    readonly isActive: boolean; 
}

class FSM<P extends Pointer, E extends IEvent, S> implements IFSM<P, E, S> {    

    private emitter: Emitter<TransitionEvent<P, S>> = new Emitter;
    private state: S;
    private pointer: P;
    scheme: Scheme<P, E, S>;

    constructor(scheme: Scheme<P, E, S>, initialPointer: P, state: S) { 
        this.scheme = scheme;           
        this.pointer = initialPointer;
        this.state = state;        
    }

    get isActive(): boolean {
        return this.pointer in this.scheme;
    }

    dispatch(event: E): void {
        if (this.isActive)
        {
            const transitions = this.scheme[this.pointer];
            if (transitions)
            {
                const transition = transitions.find((transition: Transition<P, E, S>) =>
                    transition.if(event, this.state)
                );
                if (transition)
                {
                    if (transition.to)
                        this.pointer = transition.to;
                    if (transition.update)
                        transition.update(event, this.state);
                    // Emit update
                    this.emitter.emit(new TransitionEvent(this.pointer, this.state));
                }
            }
        }
        else        
            this.emitter.events.forEach(this.emitter.offAll.bind(this.emitter));        
    }

    on<K extends TransitionEvent<P, S>>(pointer: K['type'], listener: Listener<K>) {
        return this.emitter.on(pointer, listener);
    }

    off<K extends TransitionEvent<P, S>>(pointer: K['type'], listener: Listener<K>) {
        return this.emitter.off(pointer, listener);
    }
}

export default FSM;
