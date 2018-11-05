const toString = Object.prototype.toString

module.exports = class ClientValidator {
    constructor() {
        this._lastError = null
    }

    validate(description, value) {
        if (!/\[object Object\]/.test(toString.call(value))) {
            this._lastError = new TypeError(`Wrong type for ${description}: not an object.`)
            return false
        }

        return true
    }

    getLastError() {
        return this._lastError
    }
}
