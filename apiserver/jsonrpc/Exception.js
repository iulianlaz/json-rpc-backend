/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
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
    this.name = 'hg.APIServer.JSONRPC.Exception';
};

Exception.prototype = new GenericException();
Exception.prototype.constructor = Exception;

Exception.HTTP_CODE_REQINV = 1000;
Exception.HTTP_CODE_REQNOCNTTYPE = 1001;
Exception.HTTP_CODE_REQCNTTYPE = 1002;
Exception.HTTP_CODE_JSONINV = 1003;
Exception.HTTP_CODE_JSONRPC_VERSION_INV = 1004;
Exception.HTTP_CODE_PARAMS_METHOD_INV = 1005;
Exception.HTTP_CODE_PARAMS_ID_INV = 1006;

Exception.HTTP_MSG_REQINV = 'Invalid request object';
Exception.HTTP_MSG_REQNOCNTTYPE = 'Content type is missing.';
Exception.HTTP_MSG_REQCNTTYPE = 'Invalid content type sent in the request';
Exception.HTTP_MSG_JSONINV = 'Parse Error. Invalid JSON.';
Exception.HTTP_MSG_JSONRPC_VERSION_INV = "Invalid JSONRPC version."
Exception.HTTP_MSG_PARAMS_METHOD_INV = 'Invalid method parameter';
Exception.HTTP_MSG_PARAMS_ID_INV = 'Invalid id parameter';