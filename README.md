#luaload

> A Node.js library for concatenating and loading lua script files in redis

Please, refer to the [Installation](#Installation), [Usage](#usage), [API](#api), [Requirements](#requirements) and [License](#license) sections for more information.

## Installation <a name="installation"></a>

```bash
npm install luaload
```

## Usage <a name="usage"></a>

### ./usage.js

```javascript
const luaload = require('luaload')
const redis = require('redis')

const client = redis.createClient()
const sourceDirectory = path.join(__dirname, './lua')
const mappings = {
    ninja_turtles: [
        'leonardo',
        'michelangelo',
        'donatello',
        'raphael',
        'list_ninja_turtles'
    ],
}
const shouldOutput = true

const loader = luaload(client, sourceDirectory, mappings, shouldOutput)

loader.load('list_ninja_turtles', (err, sha) => {
    if (err) {
        throw err
    }

    client.evalsha(sha, 0, (err, reply) => {
        if (err) {
            throw err
        }

        console.log(reply) // ['donatello', 'leonardo', 'michelangelo', 'raphael']
    })
})
```

### ./lua/donatello.lua

```lua
local function donatello()
    return 'Donatello'
end
```

### ./lua/leonardo.lua

```lua
local function leonardo()
    return 'Leonardo'
end
```

### ./lua/michelangelo.lua

```lua
local function michelangelo()
    return 'Michelangelo'
end
```

### ./lua/raphael.lua

```lua
local function raphael()
    return 'Raphael'
end
```

### ./lua/list_ninja_turtles.lua

```lua
local return_value = {}

table.insert(return_value, donatello())
table.insert(return_value, leonardo())
table.insert(return_value, michelangelo())
table.insert(return_value, raphael())

return return_value
```

## API <a name="api"></a>

## Classes

<dl>
<dt><a href="#LUAScriptLoader">LUAScriptLoader</a></dt>
<dd><p>The script loader.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#luaload">luaload(client, sourceDirectory, mappings, shouldOutput)</a></dt>
<dd><p>The factory method for the <a href="LuaScriptLoader">LuaScriptLoader</a>.</p>
</dd>
</dl>

<a name="LUAScriptLoader"></a>

## LUAScriptLoader
The script loader.

**Kind**: global class  
<a name="LUAScriptLoader+load"></a>

### luaScriptLoader.load(key, done)
Concatenates and loads a script from files.
Returns the SHA-1 digest of the script.

**Kind**: instance method of [<code>LUAScriptLoader</code>](#LUAScriptLoader)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>String</code> | The key from the mappings. |
| done | <code>function</code> | The final callback. Invoked with `(err, sha)`. |

<a name="luaload"></a>

## luaload(client, sourceDirectory, mappings, shouldOutput)
The factory method for the [LuaScriptLoader](LuaScriptLoader).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| client | <code>Object</code> | The redis client. |
| sourceDirectory | <code>String</code> | The absolute path to the directory containing the lua script files to concatenate and load. The directory should exist. The Directory should be readable. If `shouldOutput` is set to true, then the directory should also be writable. |
| mappings | <code>Object</code> | An object whose keys are aliases to arrays of file paths to concatenate. |
| shouldOutput | <code>Boolean</code> | If set to `true`, the concatenated script file will be written to `sourceDirectory`. |


## Requirements <a name="requirements"></a>

* Node.js 6+
* Redis 2.8.9+

## License <a name="license"></a>

This project is [MIT-licensed](LICENSE)
