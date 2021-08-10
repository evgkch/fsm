import Emitter, { IEvent } from '@lib/emitter';
import { Contracts } from '@lib/emitter/src/contracts';

type StateType = string | number;

export interface IState extends Contracts.IEvent<StateType> {};

interface IReceiver<S extends IState> extends Contracts.IReceiver<StateType, S> {};

interface IDispatcher {
    dispatch(event: IEvent): any;
}

export type Transition<S extends IState> = {
    to: S['type'];
    update?: (state: Omit<S, 'type'>, event: IEvent) => { [key in S['type']]: Omit<S, 'type'> };
    if: (event: IEvent, state: Omit<S, 'type'>) => boolean;
}

export type Scheme<S extends IState> = {
    [key in S['type']]: Transition<S>[];
};

class FSM<S extends IState> implements IReceiver<S>, IDispatcher {

    #emitter: Emitter<S> = new Emitter;
    #scheme: Scheme<S>;
    #state: S;

    constructor(scheme: Scheme<S>, initialState: S) {        
        this.#scheme = scheme;
        this.#state = initialState;
    }

    get pointer(): S['type'] {
        return this.#state.type;
    }

    dispatch(event: IEvent): void {
        const transitions = this.#scheme[this.pointer];
        if (transitions)
        {
            const transition = transitions.find((transition: Transition<S>) =>
                transition.if(event, this.#state)
            );
            if (transition)
            {
                // Update state
                if (transition.update)
                    this.#state = Object.assign(this.#state, transition.update(this.#state, event), { type: transition.to });
                else
                    this.#state = Object.assign(this.#state, { type: transition.to });

                // Emit update
                this.#emitter.emit(this.#state);
            }
        }
    }

    on = this.#emitter.on;

    off = this.#emitter.off;

    offAll = this.#emitter.offAll;
}

export default FSM;
