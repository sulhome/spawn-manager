'use strict';

const SpawnManager = require('./../index');
const assert = require('assert');
const chai = require('chai');
const expect = chai.expect;

describe('spawn manager', function () {
    this.timeout(0);
    it('should return command output', (done) => {
        let manager = new SpawnManager();
        manager.runCommand('date', [], null, (err, result) => {
            expect(result.stdoutVal).to.not.equal('');
            expect(result.stderrVal).to.equal('', 'stderr');
            expect(result.exitCode).to.equal(0, 'exit code');
            done();
        });
    });

    it('should return stderr output', (done) => {
        let manager = new SpawnManager();
        manager.runCommand('dir', ['s:\\'], null, (err, result) => {
            expect(result.stdoutVal).to.equal('', 'stdout');
            expect(result.stderrVal).to.not.equal('', 'stderr');
            expect(result.exitCode).to.not.equal(0, 'exit code');
            done();
        });
    });

    it('should throw error for unknown commands', (done) => {
        let manager = new SpawnManager();
        manager.runCommand('dsfgsdf', [], null, (err, result) => {
            expect(err).to.not.equal(null, 'err');
            expect(result).to.equal(null);
            done();
        });
    });

    it('should emit stdout text', (done) => {
        let manager = new SpawnManager();
        manager.runCommand('ping', ['-c','2','localhost'], null, (err, result) => {
            done();
        });
        manager.on(SpawnManager.spawnEvents.stdoutChunk, (stdoutText) => {
            expect(stdoutText).to.not.equal('');
        });
    });

    it('should emit stderr text', (done) => {
        let manager = new SpawnManager();
        manager.runCommand('ls', ['/somePath'], null, (err, result) => {
            done();
        });
        manager.on(SpawnManager.spawnEvents.stderrChunk, (stderrText) => {
            expect(stderrText).to.not.equal('');
        });
    });
});