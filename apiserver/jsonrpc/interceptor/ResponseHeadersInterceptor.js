/**
 * ------------------------------------------
 * Node - hg.APIServer.JSONRPC.Interceptor
 * ------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Adds headers for the response
 */

var Response = require('apiserver/Response');

/**
 * The constructor.
 * @implements {hg.APIServer.iInterceptor}
 */
module.exports = ResponseHeadersInterceptor = function() {

    /**
     * Intercepts the response.
     * Adds headers for the response:
     *  - Content-Type
     *  - Content-Length
     * @param {Object} response Response for the client
     * @return {Object} Modified response
     */
    this.intercept = function(response) {
        if (!(response instanceof Response)) {
            // throw exception
        }
        var payload = response.getPayload();

        var headers = {
            "Content-Type": "application/json",
            "Content-Length": JSON.stringify(payload).length
        };
        response.addHeaders(headers);

        return response;
    };
};