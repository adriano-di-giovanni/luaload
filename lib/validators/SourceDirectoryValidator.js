module.exports = class SourceDirectoryValidator {
    constructor() {
        this._lastError = null
    }

    validate(description, value) {
        if (typeof value !== 'string') {
            this._lastError = new TypeError(`Wrong type for ${description}: not a string.`)
            return false
        }

        if (value.length === 0) {
            this._lastError = new Error(`Invalid value for ${description}: empty string.`)
            return false
        }

        return true
    }

    getLastError() {
        return this._lastError
    }
}
