import { createStore, combineReducers, applyMiddleware } from "redux";

// 常量 分别存放副作用的key即type 和相对应的方法
const effectsKey: string[] = [];
const effectsMethodArr: Function[] = [];

/**
 * 还原reducer的函数
 * @param {Object} model 传入的model对象
 */
const reductionReducer = (model) => {
    if (typeof model !== 'object') {
        throw Error('Model must be object!')
    }

    const {
        namespace,
        reducers
    } = model

    if (!namespace || typeof namespace !== 'string') {
        throw Error(`The namespace must be a defined and non-empty string! It is ${namespace}`)
    }

    const initState = model.state
    const reducerArr = Object.keys(reducers || {})

    reducerArr.forEach((reducer) => {
        if (typeof model.reducers[reducer] !== 'function') {
            throw Error(`The reducer must be a function! In ${namespace}`)
        }
    })

    // 该函数即redux函数
    return (state = initState, action) => {
        let result = state
        reducerArr.forEach((reducer) => {
            // 返回匹配的action
            if (action.type === `${namespace}/${reducer}`) {
                result = model.reducers[reducer](state, action)
            }
        })
        return result
    }
}

/**
 * 还原effects的函数
 * @param {Object} model
 */
const reductionEffects = (model) => {
    const {
        namespace,
        effects
    } = model
    const effectsArr = Object.keys(effects || {})

    effectsArr.forEach((effect) => {
        if (typeof model.effects[effect] !== 'function') {
            throw Error(`The effect must be a function! In ${namespace}`)
        }
    })
    effectsArr.forEach((effect) => {
        // 存放对应effect的type和方法
        effectsKey.push(namespace + '/' + effect)
        effectsMethodArr.push(model.effects[effect])
    })
}

/**
 * 处理effect的中间件 具体参考redux中间件
 * @param {Object} store
 */
const effectMiddler = store => next => (action) => {
    next(action)
    // 如果存在对应的effect， 调用其方法
    const index = effectsKey.indexOf(action.type)
    if (index > -1) {
        return effectsMethodArr[index](action, store)
    }
    return action
}

/**
 * @param {Object} models
 */
export const reduxify = (models) => {
    if (typeof models !== 'object') {
        throw Error('Models must be object!')
    }
    models['@@root'] = {
        namespace: '@@root',
        state: {}
    };
    // 初始化一个reducers 最后传给combinReducer的值 也是最终还原的redux
    const reducers = {}
    // 遍历传入的model
    const modelArr = Object.keys(models)
    modelArr.forEach((key) => {
        const model = models[key]
        // 还原effect
        reductionEffects(model)
        // 还原reducer，同时通过namespace属性处理命名空间
        const reducer = reductionReducer(model)
        reducers[model.namespace] = reducer
    })
    // 返回一个reducers和一个专门处理副作用的中间件
    // return {
    //     reducers,
    //     effectMiddler
    // }
    return createStore(combineReducers(reducers), {}, applyMiddleware(effectMiddler));
}
