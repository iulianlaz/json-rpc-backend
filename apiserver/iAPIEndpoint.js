/**
 * -------------------------------
 * Node - hg.APIServer
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Handles the incoming calls to the JSON RPC API
 */

/**
 * The iAPIEndpoint interface
 * @interface
 */
module.exports = iAPIEndpoint = function() {};

/**
 * Saves internally the entity that locates the services
 * @param {hg.APIServer.ServiceLoader} serviceLoader
 */
iAPIEndpoint.prototype.setServiceLoader = function(serviceLoader) {};

/**
 * Handles the request from the client and sends the response back if necessary.
 * After all data from the request have been received, the service executor is called. Then, the result is sent
 * back to the client.
 * @param {Object} request A http.IncomingMessage object created by http.Server and passed as the first argument to the
 * 'request' and 'response' event respectively.
 * @param {Object} response A http.ServerResponse object
 * @param {Object} data Payload of the request
 */
iAPIEndpoint.prototype.handle = function(request, response, requestPayload) {};