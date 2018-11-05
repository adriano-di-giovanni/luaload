const async = require('async')
const fs = require('fs')
const path = require('path')
const {
    clientValidator,
    sourceDirectoryValidator,
    mappingsValidator,
    booleanValidator,
} = require('./validators')

/**
 * The script loader.
 */
class LUAScriptLoader {
    constructor(client, sourceDirectory, mappings, shouldOutput = false) {
        if (!clientValidator.validate("argument 1, 'client'", client)) {
            throw clientValidator.getLastError()
        }

        if (!sourceDirectoryValidator.validate("argument 2, 'sourceDirectory'", sourceDirectory)) {
            throw sourceDirectoryValidator.getLastError()
        }

        if (!mappingsValidator.validate("argument 3, 'mappings'", mappings)) {
            throw mappingsValidator.getLastError()
        }

        if (!booleanValidator.validate("argument 4, 'shouldOutput'", shouldOutput)) {
            throw booleanValidator.getLastError()
        }

        this._client = client
        this._sourceDirectory = sourceDirectory
        this._mappings = mappings
        this._shouldOutput = shouldOutput
        this._shas = {}
    }

    /**
     * Concatenates and loads a script from files.
     * Returns the SHA-1 digest of the script.
     *
     * @param {String} key The key from the mappings.
     * @param {Function} done The final callback. Invoked with `(err, sha)`.
     */
    load(key, done) {
        const sha = this._shas[key]

        if (sha != null) {
            this._client.script('EXISTS', (err, reply) => {
                if (err) {
                    done(err)
                    return
                }

                // if we have the SHA for the script with the given key but the script isn't loaded
                // into redis
                if (!reply) {
                    delete this._shas[key]
                    load.call(this, key, done)
                    return
                }

                done(null, sha)
            })
            return
        }

        load.call(this, key, done)
    }
}

function concatenate(key, done) {
    const files = this._mappings[key]

    if (files == null) {
        done(new Error(`Unknown key '${key}'`))
        return
    }

    const iteratee = (memo, item, callback) => {
        const filepath = path.join(this._sourceDirectory, `./${item}.lua`)
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                callback(err)
                return
            }

            callback(null, `${memo}\n${data}\n`)
        })
    }

    const memo = ''
    async.reduce(files, memo, iteratee, done)
}

function load(key, done) {
    concatenate.call(this, key, (err, data) => {
        if (err) {
            done(err)
            return
        }

        if (this._shouldOutput) {
            fs.writeFileSync(path.join(this._sourceDirectory, `${key}.debug.lua`), data)
        }

        this._client.script('LOAD', data, (err, reply) => {
            if (err) {
                done(err)
                return
            }

            this._shas[key] = reply

            done(null, reply, data)
        })
    })
}

module.exports = LUAScriptLoader
