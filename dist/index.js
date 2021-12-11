import Emitter from '/@lib/signaljs';
export class TransitionEvent {
    constructor(type, state) {
        this.type = type;
        this.state = state;
    }
}
class FSM {
    constructor(scheme, initialPointer, state) {
        this.emitter = new Emitter;
        this.scheme = scheme;
        this.pointer = initialPointer;
        this.state = state;
    }
    get isActive() {
        return this.pointer in this.scheme;
    }
    dispatch(event) {
        if (this.isActive) {
            const transitions = this.scheme[this.pointer];
            if (transitions) {
                const transition = transitions.find((transition) => transition.if(event, this.state));
                if (transition) {
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
    dispatchAsync(event) {
        return new Promise(resolve => setTimeout(() => resolve(this.dispatch(event)), 0));
    }
    on(state, listener) {
        this.emitter.on(state, listener);
        return this;
    }
    once(state, listener) {
        this.emitter.once(state, listener);
        return this;
    }
    off(state, listener) {
        this.emitter.off(state, listener);
        return this;
    }
}
export default FSM;
