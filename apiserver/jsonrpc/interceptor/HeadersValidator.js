/**
 * ------------------------------------------
 * Node - hg.APIServer.JSONRPC.Interceptor
 * ------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class checks the headers of a Request instance
 */

var Util = require('core/util/Util');
var http = require('http');
var Exception = require('apiserver/jsonrpc/Exception');

/**
 * The constructor.
 * @implements {hg.APIServer.iInterceptor}
 */
module.exports = HeadersValidator = function() {

    /**
     * Intercepts the request and checks the headers
     * @param request A http.IncomingMessage object created by http.Server
     */
    this.intercept = function(request) {
        if (!(request instanceof http.IncomingMessage)) {
            throw new Exception(Exception.HTTP_MSG_REQINV, Exception.HTTP_CODE_REQINV);
        }
        var headers = request.headers;

        if (headers) {
            var contentType = headers['content-type'];
            if (((contentType) === undefined) || (contentType === null)) {
                throw new Exception(Exception.HTTP_MSG_REQNOCNTTYPE, Exception.HTTP_CODE_REQNOCNTTYPE);
            } else {
                if (contentType !== Util.CNT_TYPE_JSON) {
                    throw new Exception(Exception.HTTP_MSG_REQCNTTYPE, Exception.HTTP_CODE_REQCNTTYPE);
                }
            }
        }
        return request;
    };
};