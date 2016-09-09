/**
 * ------------------------------------------
 * Node - hg.APIServer.JSONRPC.Interceptor
 * ------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class checks payload from the request
 */

var Exception = require('apiserver/jsonrpc/Exception');

/**
 * The constructor.
 * @implements {hg.APIServer.iInterceptor}
 */
module.exports = PayloadValidator = function() {

    /**
     * Intercepts the request payload
     * @param {string} payload
     * @return {Object} Unserialized payload
     */
    this.intercept = function(payload) {
        var newPayload = null;
        try {
            newPayload = JSON.parse(payload);
        } catch(e) {
            throw new Exception(Exception.HTTP_MSG_JSONINV, Exception.HTTP_CODE_JSONINV);
        }

        if ((newPayload['jsonrpc'] === undefined) || (newPayload['jsonrpc'] != '2.0')) {
            throw new Exception(Exception.HTTP_MSG_JSONRPC_VERSION_INV, Exception.HTTP_CODE_JSONRPC_VERSION_INV);
        }

        if (newPayload['method'] === undefined) {
            throw new Exception(Exception.HTTP_MSG_PARAMS_METHOD_INV, Exception.HTTP_CODE_PARAMS_METHOD_INV);
        }

        if (newPayload['id'] === undefined) {
            throw new Exception(Exception.HTTP_MSG_PARAMS_ID_INV, Exception.HTTP_CODE_PARAMS_ID_INV);
        }

        return newPayload;
    };
};