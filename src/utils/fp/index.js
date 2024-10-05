/**
 * @function isFn
 * @description Check if provided value is some callable function
 * @param {unknown} value
 * @return {boolean}
 */
export const isFn = value => typeof value === 'function';

/**
 * @function assertIsFunction
 * @description Asserts that provided {@link fn} is callable function
 * @param {unknown} fn
 * @return {boolean}
 */
export function assertIsFunction(fn) {
    if (!isFn(fn)) {
        throw new TypeError(`Expect to have type of Function parameter to be provided, but got: "${typeof fn}".`);
    }
    return true;
}

/**
 * @function assertFunctions
 * @description Asserts that all provided {@link fns} are callable functions
 * @param {...Function} fns - The callable functions to assert
 */
export function assertFunctions(...fns) {
    return fns.every(assertIsFunction)
}

/**
 * @function reduce
 * @description A function to a collections values into any other type
 * @param {Array<*>} collection - The collection to reduce
 * @param {Function} reducer - The reducer function to be applied on the last and current value
 * @param {*} initialValue - The initial value to apply the reducer to
 * @returns {*} The reduced value, this will be the same type as the initialValue parameter
 */
function reduce(collection, reducer, initialValue) {
    let acc = initialValue;
    const values = [...collection];

    for (let idx = 0; idx < values.length; idx++) {
        acc = reducer(acc, values[idx], idx, values);
    }

    return acc;
}

/**
 * @function pipe
 * @description A function pipeline to apply over a given value
 * @param {...Function} fns - The functions to call when a value is provided
 * @returns {function(*=): *} The function where the value to call the pipeline on is provided
 */
export function pipe(...fns) {
    assertFunctions.apply(null, fns);
    return init => reduce(fns, (prev, fn) => fn(prev), init);
}

/**
 * @function pipeWith
 * @description A function to apply a pipeline of functions to a given value
 * @param {*} init - The value to apply the pipeline to
 * @param {...Function} fns - The functions to call when a value is provided
 * @returns {*} The result of the pipeline
 */
export function pipeWith(init, ...fns) {
    return pipe(...fns)(isFn(init) ? init() : init);
}

/**
 * @function tap
 * @param {Function} tapFn
 * @return {function(...[*]): *}
 */
export function tap(tapFn) {
    assertIsFunction(tapFn);

    return function passThrough(...args) {
        tapFn(...args);
        return args.length === 1 ? args.shift() : [...args];
    }
}

export const IO = {
    /**
     * @function IO.pipeWith
     * @description An IO ()=> function to apply a pipeline of functions to a given value
     * @param {*} value - The value to apply the pipeline to
     * @param {...Function} fns - The functions to call when a value is provided
     * @returns {function(): *} The IO function with result of the pipeline
     */
    pipeWith: (value, ...fns) => () => pipeWith(value, ...fns),
    /**
     * @function pipe
     * @description An IO ()=> function pipeline to apply over a given value
     * @param {...Function} fns - The functions to call when a value is provided
     * @returns {function(*=): *} The function where the value to call the pipeline on is provided
     */
    pipe: (...fns) => () => pipe(...fns),
}