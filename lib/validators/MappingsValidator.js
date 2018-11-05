const toString = Object.prototype.toString

module.exports = class MappingsValidator {
    constructor() {
        this._lastError = null
    }

    validate(description, mappings) {
        if (!/\[object Object\]/.test(toString.call(mappings))) {
            this._lastError = new TypeError(`Wrong type for ${description}: not an object.`)
            return false
        }

        // TODO: throw if values are not arrays
        // TODO: throw if values are empty arrays
        // TODO: throw if array items aren't strings.

        return true
    }

    getLastError() {
        return this._lastError
    }
}
