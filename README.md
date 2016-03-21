#spawn-manager module

This module contains the SpawnManager class and the spawnEvents enum. This module facilitates the management of creating sub processes using spawn.

## API Documentation
## Classes

<dl>
<dt><a href="#SpawnManager">SpawnManager</a></dt>
<dd><p>This class abstracts the way you interact with spawn functionality in node by providing events which you can optionally listen to or you can just get the result of executing your command. Check return details of runCommand method</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#spawnEvents">spawnEvents</a> : <code>enum</code></dt>
<dd><p>Enum representing the events that will be fired by the SpawnManager.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#cmdResultCallback">cmdResultCallback</a> : <code>function</code></dt>
<dd><p>Callback to be called after the command finish executing.</p>
</dd>
<dt><a href="#result">result</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="SpawnManager"></a>

## SpawnManager
This class abstracts the way you interact with spawn functionality in node by providing events which you can optionally listen to or you can just get the result of executing your command. Check return details of runCommand method

**Kind**: global class  

* [SpawnManager](#SpawnManager)
    * [new SpawnManager()](#new_SpawnManager_new)
    * [.runCommand(cli, cmdArguments, cmdDir, cb)](#SpawnManager+runCommand)

<a name="new_SpawnManager_new"></a>

### new SpawnManager()
create new SpawnManager

<a name="SpawnManager+runCommand"></a>

### spawnManager.runCommand(cli, cmdArguments, cmdDir, cb)
execute a new command in a sub process (spawn). This class implements EventEmitter and fire certain events while executing the command. Please review spawnEvents for the list of emitted events

**Kind**: instance method of <code>[SpawnManager](#SpawnManager)</code>  

| Param | Type | Description |
| --- | --- | --- |
| cli | <code>string</code> | the command name |
| cmdArguments | <code>Array</code> | command arguments |
| cmdDir | <code>string</code> | path to where the command will be executed. Pass null if you don't want to set it |
| cb | <code>[cmdResultCallback](#cmdResultCallback)</code> | callback function to be called after the command finish executing |

**Example**  
```js
let manager = new SpawnManager();
let cmdOutput = '';
let exitCode;
manager.runCommand('ping', ['-c','4','localhost'], null, (err, result) => {
   // you can get the command exit code, stdout and stderr here in the result object
   exitCode = result.exitCode;
});
manager.on(SpawnManager.spawnEvents.stdoutChunk, (text) => {
   // you may want to subscribe to these events if you want to output the progress of a long running command for example but these subscription remains optional because you will get everything back in the result object
   cmdOutput += text;
});
```
<a name="spawnEvents"></a>

## spawnEvents : <code>enum</code>
Enum representing the events that will be fired by the SpawnManager.

**Kind**: global constant  
**Read only**: true  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| stdoutChunk | <code>string</code> | <code>&quot;stdoutChunk&quot;</code> | stdoutChunk represents a chunk of data returns from the command stdout |
| stderrChunk | <code>string</code> | <code>&quot;stderrChunk&quot;</code> | stderrChunk represents a chunk of data returns from the command stderr |
| error | <code>string</code> | <code>&quot;cmdError&quot;</code> | error represents an error occurred while executing the command |

<a name="cmdResultCallback"></a>

## cmdResultCallback : <code>function</code>
Callback to be called after the command finish executing.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| error | <code>\*</code> | An object repenting an error. |
| the | <code>[result](#result)</code> | result of executing the command |

<a name="result"></a>

## result : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| stdoutVal | <code>string</code> | command stdout value |
| stderrVal | <code>string</code> | command stderr value |
| exitCode | <code>number</code> | command exit code |

