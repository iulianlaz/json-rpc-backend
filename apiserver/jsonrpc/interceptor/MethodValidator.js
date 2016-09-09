/**
 * ------------------------------------------
 * Node - hg.APIServer.JSONRPC.Interceptor
 * ------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class checks HTTP method
 */

var Util = require('core/util/Util');
var http = require('http');
var Exception = require('apiserver/jsonrpc/Exception');

/**
 * The constructor.
 * @implements {hg.APIServer.iInterceptor}
 */
module.exports = MethodValidator = function() {

    /**
     * Intercepts the request and checks HTTP method
     * @param request A http.IncomingMessage object created by http.Server
     */
    this.intercept = function(request) {
        if (!(request instanceof http.IncomingMessage)) {
            throw new Exception(Exception.HTTP_MSG_REQINV, Exception.HTTP_CODE_REQINV);
        }
        var method = request.method;

        if (method !== Util.Method.POST) {
            // Throw exception
        }

        return request;
    };
};