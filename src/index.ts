import Emitter, { Signal, IReceiver } from '/@lib/signaljs';

export type Pointer = number | string | symbol;

export interface IEvent {
    type: Signal
}

export interface IDispatcher<E extends IEvent> {
    dispatch(event: E): this;
}

export interface IAsyncDispatcher<E extends IEvent> {
    dispatchAsync(event: E): Promise<this>;
}

export type Transition<P extends Pointer, S = undefined, E extends IEvent = IEvent> = {
    to: P;
    if: (event: E, state: S) => boolean;
    update?: (event: E, state: S) => void;    
};

export type Scheme<P extends Pointer, S = undefined, E extends IEvent = IEvent> = {
    [p in P]?: Transition<P, S, E>[];
};

export type SignalStateMap<P extends Pointer, S = undefined> = {
    [p in P]: [state: S]
}

export interface IFSM<P extends Pointer, S = undefined, E extends IEvent = IEvent> extends IDispatcher<E>, IAsyncDispatcher<E>, IReceiver<SignalStateMap<P, S>> {    
    readonly scheme: Scheme<P, S, E>;       
    readonly isActive: boolean; 
}

class FSM<P extends Pointer, S = undefined, E extends IEvent = IEvent> implements IFSM<P, S, E> {    

    private emitter: Emitter<SignalStateMap<P, S>> = new Emitter;
    private state: S;
    private pointer: P;
    scheme: Scheme<P, S, E>;

    constructor(scheme: Scheme<P, S, E>, initialPointer: P, state: S) { 
        this.scheme = scheme;           
        this.pointer = initialPointer;
        this.state = state;        
    }

    get isActive(): boolean {
        return this.pointer in this.scheme;
    }

    dispatch(event: E): this {
        if (this.isActive)
        {
            const transitions = this.scheme[this.pointer];
            if (transitions)
            {
                const transition = transitions.find(transition =>
                    transition.if(event, this.state)
                );
                if (transition)
                {
                    if (transition.to)
                        this.pointer = transition.to;
                    if (transition.update)
                        transition.update(event, this.state);
                    // Emit update
                    this.emitter.emit(this.pointer, this.state);
                }
            }
        }
        else        
            this.emitter.signals.forEach(this.emitter.offAll.bind(this.emitter));
        return this;
    }

    dispatchAsync(event: E): Promise<this> {
        return new Promise(resolve =>
            setTimeout(() => resolve(this.dispatch(event)), 0)
        ); 
    }

    on<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any) {
        this.emitter.on(state, listener);
        return this;
    }

    once<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any) {
        this.emitter.once(state, listener);
        return this;
    }

    off<K extends P>(state: K, listener: (...args: SignalStateMap<K, S>[K]) => any) {
        this.emitter.off(state, listener);
        return this;
    }
}

export default FSM;
