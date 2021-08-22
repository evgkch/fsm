const logic = {
    and: (x: boolean, y: boolean) => Number(x) & Number(y),
    or: (x: boolean, y: boolean) => Number(x) | Number(y),
    xor: (x: boolean, y: boolean) => Number(x) ^ Number(y)
}

const scheme = [
    {
        if: (event: any, state: any): boolean => (
            state.phase === 'moving' &&
            event.type === 'mousemove' &&
            (state.x + event.dx) % state.size !== state.x
        ),
        update: (event: any, state: any) => ({ x: (state.x + event.dx) % state.size  })
    },
    {
        if: (event: any, state: any): boolean => (
            state.phase === 'moving' &&
            event.type === 'mouseup'            
        ),
        update: () => ({ phase: 'stoped'  })
    }
]