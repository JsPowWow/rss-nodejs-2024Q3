import {describe, it} from "node:test";
import assert from "node:assert";
import {parseCmdLine} from './index.js';

describe("parseCmdLine tests", () => {
    it('should parse command line input', () => {
        assert.deepEqual(parseCmdLine("command param1 param2 param3"), ["command", "param1", "param2", "param3"])
    });
    it('should parse command line input with spaces', () => {
        assert.deepEqual(parseCmdLine("command param1   param2 param3"), ["command", "param1", "", "", "param2", "param3"])
    });
    it('should parse command line input with quoted param', () => {
        assert.deepEqual(parseCmdLine(`command param1 "that's a long parameter" param3`), ["command", "param1", "that's a long parameter", "param3"])
    });
    it('should parse command line input with  quoted params', () => {
        assert.deepEqual(parseCmdLine(`  command param1 "that's a long parameter" "param3 is also a string"`),
            ["", "", "command", "param1", "that's a long parameter", "param3 is also a string"])
    });
});