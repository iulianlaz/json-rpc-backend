/**
 * -------------------------------
 * Node - hg.APIService.Presence
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Exception class
 */

var GenericException = require('core/Exception');

/**
 * The constructor.
 * @extends {hg.Core.Exception}
 */
module.exports = Exception = function(message, code) {
    this.message = message;
    this.code = code;
    this.name = 'hg.APIService.Presence.Exception';
};

Exception.prototype = new GenericException();
Exception.prototype.constructor = Exception;

Exception.PRS_CODE_NOT_ALLOWED_OP = 1000;

Exception.PRS_MSG_NOT_ALLOWED_OP = 'Method not found';