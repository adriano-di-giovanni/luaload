/* eslint no-new: 0 */

const path = require('path')
const redis = require('redis')

const LUAScriptLoader = require('../LUAScriptLoader')

let client
const sourceDirectory = path.join(__dirname, './lua')
const mappings = {
    list_ninja_turtles: ['leonardo', 'michelangelo', 'donatello', 'raphael', 'ninja_turtles'],
}
const shouldOutput = true

beforeAll(() => {
    client = redis.createClient()
})

beforeEach(done => client.flushall(done))

afterAll(done => client.quit(done))

it('should be defined', () => {
    expect(LUAScriptLoader).toBeDefined()
})

it('should be a function', () => {
    expect(typeof LUAScriptLoader).toBe('function')
})

it('should be a constructor', () => {
    const instance = new LUAScriptLoader(client, sourceDirectory, mappings, shouldOutput)
    expect(instance instanceof LUAScriptLoader).toBe(true)
})

it("should throw when the argument 1, 'client', is not an object", () => {
    expect(() => {
        const client = null
        new LUAScriptLoader(client)
    }).toThrowError(TypeError, /argument 1/)
})

it("should throw when the argument 2, 'sourceDirectory', is not a string", () => {
    expect(() => {
        const sourceDirectory = null
        new LUAScriptLoader(client, sourceDirectory)
    }).toThrowError(TypeError, /argument 2/)
})

it("should throw when the argument 3, 'mappings', is not an object", () => {
    expect(() => {
        const mappings = null
        new LUAScriptLoader(client, sourceDirectory, mappings)
    }).toThrowError(TypeError, /argument 3/)
})

it("should throw when the argument 4, 'shouldOutput', is not a boolean", () => {
    expect(() => {
        const shouldOutput = null
        new LUAScriptLoader(client, sourceDirectory, mappings, shouldOutput)
    }).toThrowError(TypeError, /argument 4/)
})

it('should return a sha', done => {
    const instance = new LUAScriptLoader(client, sourceDirectory, mappings, shouldOutput)
    instance.load('list_ninja_turtles', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        expect(sha).toBeDefined()
        expect(typeof sha).toBe('string')

        done()
    })
})

it('should return the concatenated script', done => {
    const instance = new LUAScriptLoader(client, sourceDirectory, mappings, shouldOutput)
    instance.load('list_ninja_turtles', (err, sha, data) => {
        if (err) {
            done(err)
            return
        }

        expect(data).toBeDefined()
        expect(typeof data).toBe('string')

        expect(data).toBe(`
local function leonardo()
    return 'Leonardo'
end


local function michelangelo()
    return 'Michelangelo'
end


local function donatello()
    return 'Donatello'
end


local function raphael()
    return 'Raphael'
end


local return_value = {}

table.insert(return_value, donatello())
table.insert(return_value, leonardo())
table.insert(return_value, michelangelo())
table.insert(return_value, raphael())

return return_value

`)

        done()
    })
})

it('should load the script', done => {
    const instance = new LUAScriptLoader(client, sourceDirectory, mappings, shouldOutput)
    instance.load('list_ninja_turtles', (err, sha) => {
        if (err) {
            done(err)
            return
        }

        client.evalsha(sha, 0, (err, reply) => {
            if (err) {
                done(err)
                return
            }

            expect(reply).toBeDefined()
            expect(Array.isArray(reply)).toBe(true)
            expect(reply).toEqual(['Donatello', 'Leonardo', 'Michelangelo', 'Raphael'])

            done()
        })
    })
})
