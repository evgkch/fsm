var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _StateMachine_channel, _StateMachine_scheme, _StateMachine_state;
import Channel from 'channeljs';
class StateMachine {
    constructor(transitions, state) {
        _StateMachine_channel.set(this, new Channel);
        _StateMachine_scheme.set(this, new Map);
        _StateMachine_state.set(this, void 0);
        for (const transition of transitions) {
            if (!__classPrivateFieldGet(this, _StateMachine_scheme, "f").has(transition[0])) {
                __classPrivateFieldGet(this, _StateMachine_scheme, "f").set(transition[0], []);
            }
            __classPrivateFieldGet(this, _StateMachine_scheme, "f").get(transition[0]).push(transition[1]);
        }
        __classPrivateFieldSet(this, _StateMachine_state, state, "f");
    }
    get pointer() {
        return __classPrivateFieldGet(this, _StateMachine_state, "f")[0];
    }
    get content() {
        return __classPrivateFieldGet(this, _StateMachine_state, "f")[1];
    }
    get active() {
        return __classPrivateFieldGet(this, _StateMachine_scheme, "f").has(__classPrivateFieldGet(this, _StateMachine_state, "f")[this.pointer]);
    }
    get rx() {
        return __classPrivateFieldGet(this, _StateMachine_channel, "f").rx;
    }
    dispatch(event) {
        if (this.active) {
            const from = __classPrivateFieldGet(this, _StateMachine_state, "f")[this.pointer];
            if (__classPrivateFieldGet(this, _StateMachine_scheme, "f").has(from)) {
                const transitions = __classPrivateFieldGet(this, _StateMachine_scheme, "f").get(from);
                for (const transition of transitions) {
                    const content = transition[1](event, this.content);
                    if (content !== undefined) {
                        __classPrivateFieldSet(this, _StateMachine_state, [transition[0], content], "f");
                        __classPrivateFieldGet(this, _StateMachine_channel, "f").tx.send(transition[0], from, event);
                        return true;
                    }
                }
            }
        }
        return false;
    }
    dispatch_async(event) {
        return new Promise(resolve => setTimeout(() => resolve(this.dispatch.call(this, event)), 0));
    }
    clear() {
        return __classPrivateFieldGet(this, _StateMachine_channel, "f").clear();
    }
}
_StateMachine_channel = new WeakMap(), _StateMachine_scheme = new WeakMap(), _StateMachine_state = new WeakMap();
export default StateMachine;
