/**
 * -------------------------------
 * Node - hg.APIServer
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview iInterceptor interface. Interceptors are used to intercept action, like
 * HTTP request or response and filter the value of the request or response
 */

/**
 * The iInterceptor interface
 * @interface
 * @type {iInterceptor}
 */
module.exports = iInterceptor = function() {};

/**
 * Intercept the action and filter the value
 * @param {Object} value The value that will be filtered
 * @return {mixed} The filtered value | True
 */
iAPIServer.prototype.intercept = function(value) {};

