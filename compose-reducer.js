
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
        state[mod] = models[mod].state;
    });
    return state;
}

export default function(models) {
    const mods = Object.keys(models);
    let ret = {};
    mods.forEach(mod => {
        let modReducer = models[mod].reducers;
        // TODO: 跨模块相同的reducer.
        merge(ret, composeReducers(modReducer, mod));
    });

    let initState = getInitState(models);

    return (state = initState, action) => {
        const reducer = ret[action.type];
        let change = {};
        if (!reducer) return state;
        if (Array.isArray(reducer)) {
            reducer.forEach(fn => {
                change[fn.module] = fn(state, action);
            });
        } else if (typeof reducer === 'function') {
            change[reducer.module] = reducer(state, action);
        }

        // TODO:init state
        return {
            ...state,
            ...change
        };
    }
}
