const composeReducers = (reducers, mod) => {
    let maps = {};
    Object.keys(reducers).forEach(key => {
        maps[key] = reducers[key];
        // 记录module
        reducers[key].module = mod;
    });

    return maps;
}



const merge = (dist = {}, source) => {
    if (!source) return dist;
    Object.keys(source).forEach(key => {
        if (dist[key]) {
            // 同一个action_type，对应多个处理reducer
            if (typeof dist[key] === 'function') {
                dist[key] = [dist[key], source[key]];
            } else {
                dist[key].push(source[key]);
            }
        } else {
            dist[key] = source[key];
        }
    });
    return dist;
}

/**
 * state: {
 *     list: [],
 *     total: 20
 * }
 * reducers: {
 *     [action.type]: function(state, {payload}) {
 *            return {
 *                ...state,
 *                xxx
 *            }
 *       }
 * }
 *
 *
 *
 */


const getInitState = (models) => {
    let state = {};
    Object.keys(models).forEach(mod => {
        if (models[mod].state) {
            state[mod] = models[mod].state
        } else if (typeof models[mod] === 'function') {
            state[mod] = models[mod]();
            console.log(models[mod]())
        }
    });
    return state;
}

export default function(models) {
    const mods = Object.keys(models);
    let ret = {};
    let extra = {};
    mods.forEach(mod => {
        let modReducer = models[mod].reducers;
        if (!modReducer) {
            if (typeof models[mod] === 'function') {
                extra[mod] = models[mod];
            }
        } else {
            merge(ret, composeReducers(modReducer, mod));
        }
    });

    let initState = getInitState(models);


    return (state = initState, action) => {
        if (action.type === '@@INIT') return initState;
        const reducer = ret[action.type];
        let change = {};
        if (reducer) {
            if (Array.isArray(reducer)) {
                reducer.forEach(fn => {
                    change[fn.module] = fn(state[fn.module], action);
                });
            } else if (typeof reducer === 'function') {
                change[reducer.module] = reducer(state[reducer.module], action);
            }
        }

        Object.keys(extra).forEach(key => {
            change[key] = extra[key](state[key], action);
        });
        return {
            ...state,
            ...change
        };
    }
}
