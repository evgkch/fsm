import FSM, { IState, Scheme } from "../index";

class Water implements IState {

    static isSolid(t: number): boolean {
        return t < 0;
    }

    static isLiquid(t: number): boolean {
        return t >= 0 && t < 100
    }
    
    static isGas(t: number): boolean {
        return t >= 100;
    }

    type: 'solid' | 'liquid' | 'gas';

    constructor(public t: number) {
        if (Water.isSolid(t))
            this.type = 'solid';        
        else if (Water.isLiquid(t))
            this.type = 'liquid';        
        else if (Water.isGas(t))
            this.type = 'gas';
        else
            throw new TypeError('"t" in not a number')
    }
}

const scheme: Scheme<Water> = {
    ['solid']: [
        {
            to: 'liquid',
            if: (event, state) => event.type === 'heat' && Water.isLiquid(state.t + 1),
            update: state => ({ t: state.t + 1 })
        },
        {
            to: 'solid',
            if: () => true,
        }
    ],
    ['liquid']: [
        {
            to: 'solid',
            if: (event, state) => event.type === 'cool' && Water.isSolid(state.t - 1),
            update: state => ({ t: state.t - 1 })
        },
        {
            to: 'gas',
            if: (event, state) => event.type === 'heat' && Water.isSolid(state.t - 1),
            update: state => ({ t: state.t - 1 })
        },
    ]
}

export default scheme