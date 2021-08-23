import Emitter, { IEvent, IReceiver } from '/@lib/emitterjs';

export interface IState extends IEvent {};

interface IDispatcher {
    dispatch(event: IEvent): any;
}

export type Transition<S extends IState> = {
    to: S['type'];
    if: (event: IEvent, state: Omit<S, 'type'>) => boolean;
    update?: (state: Omit<S, 'type'>, event: IEvent) => Partial<Omit<S, 'type'>>;    
} | {
    to?: S['type'];
    if: (event: IEvent, state: Omit<S, 'type'>) => boolean;
    update: (state: Omit<S, 'type'>, event: IEvent) => Partial<Omit<S, 'type'>>;    
};

export type Scheme<S extends IState> = {
    [key in S['type']]?: Transition<S>[];
};

export interface IFSM<S extends IState> extends IDispatcher, IReceiver<S> {    
    readonly scheme: Scheme<S>;       
    readonly isActive: boolean; 
}

class FSM<S extends IState> implements IFSM<S> {    

    private emitter: Emitter<S> = new Emitter;
    private state: S;
    scheme: Scheme<S>;    

    constructor(scheme: Scheme<S>, initialState: S) { 
        this.scheme = scheme;      
        this.state = initialState;
    }

    get isActive(): boolean {
        return this.state.type in this.scheme;
    }

    dispatch(event: IEvent): void {
        if (this.isActive)
        {
            const transitions = this.scheme[<S['type']> this.state.type];
            if (transitions)
            {
                const transition = transitions.find((transition: Transition<S>) =>
                    transition.if(event, this.state)
                );
                if (transition)
                {                                        
                    this.state = Object.assign(this.state,
                        transition.update && transition.update(this.state, event),
                        { type: transition.to || this.state.type }
                    ); 
                    // Emit update
                    this.emitter.emit(this.state);
                }
            }
        }
        else        
            this.emitter.events.forEach(this.emitter.offAll.bind(this.emitter));        
    }

    on = this.emitter.on.bind(this.emitter);

    off = this.emitter.off.bind(this.emitter);
}

export default FSM;
