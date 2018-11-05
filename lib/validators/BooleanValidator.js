module.exports = class BooleanValidator {
    constructor() {
        this._lastError = null
    }

    validate(description, value) {
        if (typeof value !== 'boolean') {
            this._lastError = new TypeError(`Wrong type for ${description}: not a boolean.`)
            return false
        }

        return true
    }

    getLastError() {
        return this._lastError
    }
}
