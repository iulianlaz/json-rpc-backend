/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Global Error Map
 */

var Util = require('core/util/Util');

/**
 * The constructor.
 */
module.exports = ErrorMap = function() {};
ErrorMap.errorMap = {
    '1000': {'status' : Util.StatusCode.INTERNAL_SERVER_ERROR, 'code': '-32603', 'message': 'Internal Error'},
    '1001': {'status' : Util.StatusCode.BAD_REQUEST, 'code': '-32600', 'message': 'Invalid Request'},
    '1002': {'status' : Util.StatusCode.BAD_REQUEST, 'code': '-32600', 'message': 'Invalid Request'},
    '1003': {'status' : Util.StatusCode.BAD_REQUEST, 'code': '-32001', 'message': 'Parse Error. Invalid JSON'},
    '1004': {'status' : Util.StatusCode.BAD_REQUEST, 'code': '-32002', 'message': 'Invalid JSONRPC version'},
    '1005': {'status' : Util.StatusCode.BAD_REQUEST, 'code': '-32602', 'message': 'Invalid method'},
    '1006': {'status' : Util.StatusCode.BAD_REQUEST, 'code': '-32602', 'message': 'Invalid id'}
}
