/**
 * -------------------------------
 * Node - hg.APIService.Presence
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Service configuration
 */

var Exception = require('apiservice/presence/Exception');
var Util = require('core/util/Util');

/**
 * The constructor.
 */
module.exports = Config = function() {};

var errorMap = {};
errorMap['hg.APIService.Presence.Exception:' + Exception.PRS_CODE_NOT_ALLOWED_OP] = {'status' : Util.StatusCode.BAD_REQUEST, 'code': '-32601', 'message': 'Invalid Request. Operation not supported.'},

Config.errorMap = errorMap;