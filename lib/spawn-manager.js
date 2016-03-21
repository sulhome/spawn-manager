'use strict';

const EventEmitter = require('events');

/** This class abstracts the way you interact with spawn functionality in node by providing events which you can optionally listen to or you can just get the result of executing your command. Check return details of runCommand method */
class SpawnManager extends EventEmitter {
    /**
     * create new SpawnManager
     */
    constructor() {
        super();
    }

    /**
     * Callback to be called after the command finish executing.
     * @callback cmdResultCallback
     * @param {*} error - An object repenting an error.
     * @param {result} the result of executing the command
     */

    /**
     * execute a new command in a sub process (spawn). This class implements EventEmitter and fire certain events while executing the command. Please review spawnEvents for the list of emitted events
     * @param {string} cli the command name
     * @param {Array} cmdArguments command arguments
     * @param {string} cmdDir path to where the command will be executed. Pass null if you don't want to set it
     * @param {cmdResultCallback} cb callback function to be called after the command finish executing
     * @example
     * let manager = new SpawnManager();
     * let cmdOutput = '';
     * let exitCode;
     * manager.runCommand('ping', ['-c','4','localhost'], null, (err, result) => {
     *    // you can get the command exit code, stdout and stderr here in the result object
     *    exitCode = result.exitCode;
     * });
     * manager.on(SpawnManager.spawnEvents.stdoutChunk, (text) => {
     *    // you may want to subscribe to these events if you want to output the progress of a long running command for example but these subscription remains optional because you will get everything back in the result object
     *    cmdOutput += text;
     * });
     */
    runCommand(cli, cmdArguments, cmdDir, cb) {

        /**
         * @typedef result
         * @type Object
         * @property {string} stdoutVal command stdout value
         * @property {string} stderrVal command stderr value
         * @property {number} exitCode command exit code
         */
        let result = {
            stdoutVal: '',
            stderrVal: '',
            exitCode: null
        };
        let instance = this;
        var spawn = require('child_process').spawn;
        var child = spawn(cli, cmdArguments,
            {
                cwd: cmdDir
            }
        );

        child.stdout.on('data', function (data) {
            result.stdoutVal += data.toString('utf8');
            instance.emit(spawnEvents.stdoutChunk, data.toString('utf8'));
        });

        child.stderr.on('data', function (data) {
            result.stderrVal += data.toString('utf8');
            instance.emit(spawnEvents.stderrChunk, data.toString('utf8'));
        });

        child.on('error', (err) => {
            instance.emit(spawnEvents.error, err);
            return cb(err, null);
        });

        child.on('close', (code, signal) => {
            result.exitCode = code;
            return cb(null, result);
        });
    };
}

/**
 * Enum representing the events that will be fired by the SpawnManager.
 * @readonly
 * @enum {number}
 */
const spawnEvents = {
    /** @type {string} stdoutChunk represents a chunk of data returns from the command stdout */
    stdoutChunk: "stdoutChunk",
    /** @type {string} stderrChunk represents a chunk of data returns from the command stderr */
    stderrChunk: "stderrChunk",
    /** @type {string} error represents an error occurred while executing the command */
    error: "cmdError"
};


module.exports = SpawnManager;

module.exports.spawnEvents = spawnEvents;