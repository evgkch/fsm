# fsmjs
A lib to create a Finite State Machine

# NOTE:
This lib use the [**channejs**](https://github.com/evgkch/channeljs) dependency to realized a receiver.
See how it works by the link above.

This lib use absolute imports. Keep in mind when assembling

## Usage
```typescript
// Define an interface that represented a volume with water
interface Water {
    t: number
}

// Define Pointers (state of aggregation)
enum WaterAggregation {
    Solid,
    Liquid,
    Gas
}

// Define heat event
class Heat {
    type = 'heat' as const;
    constructor(public readonly dt: number) {}
}

// Define transitions.
// At this example it is better to define its apart.
const to_solid: Transition<WaterAggregation.Solid, Heat, Water> = {
    to: WaterAggregation.Solid,
    if: (ev, state) => {
        const t = state.t + ev.dt;
        return t > 273.15 && t < 0;
    },
    update: (ev, state) => state.t += ev.dt
};

const to_liquid: Transition<WaterAggregation.Liquid, Heat, Water> = {
    to: WaterAggregation.Liquid,
    if: (ev, state) => {
        const t = state.t + ev.dt;
        return t >= 0 && t < 100;
    },
    update: (ev, state) => state.t += ev.dt
};

const to_gas: Transition<WaterAggregation.Gas, Heat, Water> = {
    to: WaterAggregation.Gas,
    if: (ev, state) => {
        const t = state.t + ev.dt;
        return t > 100;
    },
    update: (ev, state) => state.t += ev.dt
};

// Define a transition scheme
const scheme: Scheme<WaterAggregation, Heat, Water> = {
    [WaterAggregation.Solid]: [to_solid, to_liquid],
    [WaterAggregation.Liquid]: [to_solid, to_liquid, to_gas],
    [WaterAggregation.Gas]: [to_liquid, to_gas],
};

// Define some water with t = 0
const water: Water = { t: 0 };

// Define FSM
const fsm = new FSM<WaterAggregation, Heat, Water>(scheme, WaterAggregation.Liquid, water);

// Use dispatcher and receiver
const { dx, rx } = fsm;

// Subscribe on pointer changes
// See more 'https://github.com/evgkch/channeljs'
rx.on(WaterAggregation.Solid, (_, state) => { console.log(`water is solid; t = ${state.t}`); });
rx.on(WaterAggregation.Liquid, (_, state) => { console.log(`water is liquid; t = ${state.t}`); });
rx.on(WaterAggregation.Gas, (_, state) => { console.log(`water is gas; t = ${state.t}`); });

// Before t was 0. Next t is 20. The second listener works
dx.dispatch(new Heat(20));

// Before t was 20. Next t is 100. The third listener works
dx.dispatch(new Heat(20));

// Before t was 80. Next t is ... Ops! We had no transitions!. Listeners are silent
dx.dispatch(new Heat(-200));
```