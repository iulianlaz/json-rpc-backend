/**
 * -------------------------------
 * Node - hg.APIServer
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview iAPIServer interface
 */

/**
 * The iAPIServer interface
 * @interface
 * @type {iAPIServer}
 */
module.exports = iAPIServer = function() {};

/**
 * Get the API endpoint
 */
iAPIServer.prototype.getEndpoint = function() {};

