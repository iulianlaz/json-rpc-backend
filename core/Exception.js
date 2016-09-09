/**
 * -------------------------------
 * Node - hg.Core
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Generic exception class
 */

/**
 * The constructor.
 * @extends {Error}
 */
module.exports = Exception = function(message, code) {
    this.message = message || null;
    this.code = code || null;
    this.name = 'Exception';
};

Exception.prototype = new Error();
Exception.prototype.constructor = Exception;

Exception.prototype.toString = function() {
    return '[' + this.name + ']' + ' Code:' +  this.code + '; Message:' + this.message;
}