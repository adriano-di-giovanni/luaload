const LUAScriptLoader = require('./LUAScriptLoader')
/**
 * The factory method for the {@link LuaScriptLoader}.
 *
 * @function luaload
 * @param {Object} client The redis client.
 * @param {String} sourceDirectory The absolute path to the directory containing
 * the lua script files to concatenate and load. The directory should exist.
 * The Directory should be readable. If `shouldOutput` is set to true, then the directory
 * should also be writable.
 * @param {Object} mappings An object whose keys are aliases to arrays of file paths to
 * concatenate.
 * @param {Boolean} shouldOutput If set to `true`, the concatenated script file will be written
 * to `sourceDirectory`.
 */
module.exports = (client, sourceDirectory, mappings, shouldOutput) => {
    return new LUAScriptLoader(client, sourceDirectory, mappings, shouldOutput)
}
