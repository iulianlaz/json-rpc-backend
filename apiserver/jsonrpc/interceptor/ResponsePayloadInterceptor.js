/**
 * ------------------------------------------
 * Node - hg.APIServer.JSONRPC.Interceptor
 * ------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Adds information that are specific to the JSON-RPC specification to the response
 */

var Response = require('apiserver/Response');

/**
 * The constructor.
 * @implements {hg.APIServer.iInterceptor}
 */
module.exports = ResponsePayloadIntercepter = function() {

    /**
     * Intercepts the response. Adds information that are specific to the JSON-RPC specification such as:
     *  - jsonrpc version (obtained from request payload)
     *  - id (obtained from request payload)
     *  - result: result payload
     * @param {Object} response Response for the client
     * @return {Object} Modified response
     */
    this.intercept = function(response) {
        if (!(response instanceof Response)) {
            // throw exception
        }
        var requestPayload = response.getRequestPayload();

        var body = {};
        body['jsonrpc'] = requestPayload['jsonrpc'];
        body['result'] = response.getPayload();
        body['id'] = requestPayload['id'];
        response.setPayload(body);

        return response;
    };
};