/* The MIT License (MIT)

Copyright (c) 2018 LeanIX GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

// from https://github.com/leanix/leanix-custom-reports

import Utilities from './Utilities';
import TypeUtilities from './TypeUtilities';

class ReportState {

	constructor() {
		this._defaultValues = {};
		this._validators = {};
		this._state = {};
	}

	prepareValue(key, validator, defaultValue) {
		if (!key) {
			return;
		}
		if (typeof validator !== 'function') {
			throw 'Validator must be a function.';
		}
		this._validators[key] = validator;
		_checkValue(key, validator, defaultValue);
		this._defaultValues[key] = defaultValue;
		// also set one for the state
		const currentValue = this._state[key];
		if (currentValue !== undefined && currentValue !== null) {
			// is the previous value still valid? if so, leave it
			try {
				_checkValue(key, validator, currentValue);
			} catch (err) {
				// previous value not valid, so reset it
				this._state[key] = undefined;
			}
		} else {
			this._state[key] = undefined;
		}
	}

	prepareBooleanValue(key, defaultValue) {
		this.prepareValue(key, (v) => {
			if (!TypeUtilities.isBoolean(v)) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be a boolean.'
				};
			}
		}, defaultValue);
	}

	prepareRangeValue(key, min, max, steps, defaultValue) {
		this.prepareValue(key, (v) => {
			if (!TypeUtilities.isNumber(v)) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be a number.'
				};
			}
			if (v < min) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be greater than or equal to ' + min + '.'
				};
			}
			if (v > max) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be lower than or equal to ' + max + '.'
				};
			}
			if (v % steps > 0) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be a multiple of ' + steps + '.'
				};
			}
		}, defaultValue);
	}

	prepareArrayValue(key, array, defaultValue) {
		this.prepareValue(key, (v) => {
			if (!array.includes(v)) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be one of ' + array.join(', ') + '.'
				};
			}
		}, defaultValue);
	}

	prepareStringValue(key, defaultValue) {
		this.prepareValue(key, (v) => {
			if (!TypeUtilities.isString(v)) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be a string.'
				};
			}
			if (v.length < 1) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be a non-empty string.'
				};
			}
		}, defaultValue);
	}

	prepareOptionalStringValue(key, defaultValue) {
		this.prepareValue(key, (v) => {
			if (!TypeUtilities.isString(v)) {
				return {
					key: key,
					value: v,
					message: 'Provided value must be a string.'
				};
			}
		}, defaultValue);
	}

	get(key) {
		if (!key) {
			return;
		}
		const value = this._state[key];
		return value === undefined || value === null ? this._defaultValues[key] : value;
	}

	getAll() {
		const result = {};
		for (let key in this._state) {
			const value = this.get(key);
			if (Array.isArray(value)) {
				result[key] = Utilities.copyArray(value, true);
			} else if (typeof value === 'object') {
				result[key] = Utilities.copyObject(value, true);
			} else {
				result[key] = value;
			}
		}
		return result;
	}

	set(key, value) {
		if (!key) {
			return;
		}
		const validator = this._validators[key];
		_checkValue(key, validator, value);
		return _setValue(this._state, key, value);
	}

	update(obj) {
		if (!obj) {
			return;
		}
		// first check all values before updating anything
		const errors = {};
		for (let key in obj) {
			const validator = this._validators[key];
			try {
				_checkValue(key, validator, obj[key]);
			} catch (err) {
				errors[err.key] = err;
			}
		}
		if (Object.keys(errors).length > 0) {
			throw errors;
		}
		const oldValues = {};
		for (let key in obj) {
			oldValues[key] = _setValue(this._state, key, obj[key]);
		}
		return oldValues;
	}

	reset() {
		for (let key in this._state) {
			this._state[key] = undefined;
		}
	}

	publish() {
		lx.publishState(this.getAll());
	}
}

function _checkValue(key, validator, value) {
	if (validator) {
		const error = validator(value, key);
		if (error) {
			throw error;
		}
	}
}

function _setValue(state, key, value) {
	const oldValue = state[key];
	state[key] = value;
	return oldValue;
}

export default ReportState;
