/**
 * @description Check if provided value is `null` or `undefined`
 * @param value
 * @return {boolean}
 */
export const isNil = value => value === null || value === undefined;

/**
 * @description Check if provided value is not `null` and not `undefined`
 * @param value
 * @return {boolean}
 */
export const isSome = value => value !== null && value !== undefined;

/**
 * @description Check if provided value is some callable function
 * @param value
 * @return {boolean}
 */
export const isSomeFunction = value => value !== null && value !== undefined && typeof value === 'function';

/**
 * @description Asserts that provided `value` is not `null` and not `undefined`
 * @param {unknown} value
 * @param {message?} message
 */
export const assertIsNonNullable = (value, message = undefined) => {
    if (value === undefined || value === null) {
        const errorMsg = 'Nullish assertion Error';
        throw new Error(message ? `${errorMsg}: "${message}"` : `${message}.`);
    }
};

export const isInstanceOf = (elemType, value) => value instanceof elemType;

/**
 * @description Asserts that provided `value` is instance of provided `elemType`
 * @param elemType
 * @param value
 */
export const assertIsInstanceOf = (elemType, value) => {
    assertIsNonNullable(value, `#${String(elemType)}`);
    if (!(isInstanceOf(elemType, value))) {
        throw new Error(`Not expected value: ${String(value)} of type: "${String(elemType)}"`);
    }
};

/**
 * @description The `always true` return function
 * @returns {true}
 */
export const stubTrue = () => true;

/**
 * @description The `always false` return function
 * @returns {false}
 */
export const stubFalse = () => false;

/**
 * @description Check if provided {@link x} number is odd
 * @param {number} x
 * @returns {boolean}
 */
export const isOddNumber = x => Boolean(x & 1);

/**
 * @description Check if provided {@link x} number is even
 * @param {number} x
 * @returns {boolean}
 */
export const isEvenNumber = x => !(x & 1);


/**
 * @description Returns provided {@link source as is}
 * @param source
 */
export const identity = source => source;

/**
 * @description The no-operation function
 * @returns {void}
 */
export const noop = () => {
    /** This is intentional */
};

/**
 * @description Promisified `setTimeout` vwersion
 * @param {number} delay
 * @param {any} value
 * @return {Promise<unknown>}
 */
export const sleep = (delay, value = undefined) => new Promise(resolve => {
    setTimeout(() => {
        resolve(value);
    }, delay);
});

