import {isNil} from '#common-utils';

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
 * @param {...Function} fns The callable functions to assert
 */
export function assertFunctions(...fns) {
    return fns.every(assertIsFunction)
}

/**
 * @function reduce
 * @description A function to a collections values into any other type
 * @param {Array<*>} array The array to reduce
 * @param {Function} reducer The reducer function to be applied on the last and current value
 * @param {*} initialValue The initial value to apply the reducer to
 * @returns {*} The reduced value, this will be the same type as the initialValue parameter
 */
function reduce(array, reducer, initialValue) {
    let acc = initialValue;
    const arr = [...array];

    for (let idx = 0; idx < arr.length; idx++) {
        acc = reducer(acc, arr[idx], idx, arr);
    }

    return acc;
}

/**
 * @function pipe
 * @description A function pipeline to apply over a given value
 * @param {...Function} fns The functions to call when a value is provided
 * @returns {function(*=): *} The function where the value to call the pipeline on is provided
 */
export function pipe(...fns) {
    assertFunctions.apply(null, fns);
    return init => reduce(fns, (prev, fn) => fn(prev), init);
}

/**
 * @function pipeAsync
 * @description An async function pipeline to apply over a given value
 * @param {...Function} fns The async functions chain when a value is provided
 * @returns {function(*=): Promise<*>} The function where the value to call the pipeline on is provided
 */
export function pipeAsync(...fns) {
    return init => fns.reduce((p, fn) => p.then(fn), Promise.resolve(init));
}

/**
 * @function pipeWith
 * @description A function to apply a pipeline of functions to a given value
 * @param {*} init The value to apply the pipeline to
 * @param {...Function} fns The functions to call when a value is provided
 * @returns {*} The result of the pipeline
 */
export function pipeWith(init, ...fns) {
    return pipe(...fns)(isFn(init) ? init() : init);
}

/**
 * @function pipeAsyncWith
 * @description A function to apply a pipeline of async functions to a given value
 * @param {*} init The value to apply the pipeline to
 * @param {...Function} fns The async functions to call when a value is provided
 * @returns {Promise<*>} The result of the pipeline
 */
export function pipeAsyncWith(init, ...fns) {
    return pipeAsync(...fns)(isFn(init) ? init() : init);
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
        return args.length === 1
            ? args.shift()
            : [...args];
    }
}

/**
 * @function tapAsync
 * @param {Function} tapFn
 * @return {function(...[*]): Promise<*>}
 */
export function tapAsync(tapFn) {
    assertIsFunction(tapFn);

    return async function passThrough(...args) {
        await tapFn(...args);
        return args.length === 1
            ? args.shift()
            : [...args];
    }
}

export const IO = {
    /**
     * @function IO.pipeWith
     * @description An IO `() => pipeWith` version to apply a pipeline of functions to a given value
     * @param {*} value - The value to apply the pipeline to
     * @param {...Function} fns - The functions to call when a value is provided
     * @returns {function(): *} The IO function with result of the pipeline
     */
    pipeWith: (value, ...fns) => () => pipeWith(value, ...fns),
}

class Some {
    constructor(value) {
        this.value = value;
    }

    map = fn => {
        return new Some(fn(this.value));
    }

    chain = fn => {
        return fn(this.value);
    }

    getOrElse = (defaultValue) => {
        return this.value;
    }

    /**
     * @param {object} options
     * @param {function(*):*} options.some
     * @param {function():*} options.nothing
     * @returns {*}
     */
    matchWith = (options) => {
        return options.some(this.value);
    }

    get [Symbol.toStringTag]() {
        return `Some ${String(this.value)}`;
    }
}

export const Nothing = Object.freeze(new class None {
    map = (fn) => {
        return this;
    }

    chain = (fn) => {
        return this;
    }

    getOrElse = (defaultValue) => {
        return defaultValue;
    }

    /**
     * @param {object} options
     * @param {function(*):*} options.some
     * @param {function():*} options.nothing
     * @returns {*}
     */
    matchWith = (options) => {
        return options.nothing();
    }

    get [Symbol.toStringTag]() {
        return "Nothing";
    }
});

export const Maybe = {
    of: (value) => isNil(value) || value === Nothing
        ? Nothing
        : new Some(value),
}