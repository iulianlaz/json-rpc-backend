/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The API calls usually encapsulate the HTTP request payload
 */

/**
 * The iAPICall interface
 * @interface
 */
module.exports = iAPICall = function() {};

/**
 * Returns service identifier from method (e.g. presence from PresenceService.create)
 * @returns {string}
 */
iAPICall.prototype.getServiceIdentifier = function() {};

/**
 * Extract the identifier of the operation that needs to be executed
 * @returns {string}
 */
iAPICall.prototype.getOpIdentifier = function() {};

/**
 * Get the payload from the request
 * @returns {Object}
 */
iAPICall.prototype.getAllParameteres = function() {};