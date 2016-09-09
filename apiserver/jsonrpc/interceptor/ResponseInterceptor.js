/**
 * ------------------------------------------
 * Node - hg.APIServer.JSONRPC.Interceptor
 * ------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Adds information that are specific to the JSON-RPC specification to the response
 */

var Interceptor = require('apiserver/Interceptor');
var ResponsePayloadInterceptor = require('apiserver/jsonrpc/interceptor/ResponsePayloadInterceptor');
var ResponseHeadersInterceptor = require('apiserver/jsonrpc/interceptor/ResponseHeadersInterceptor');

/**
 * The constructor.
 * @extends {hg.APIServer.Interceptor}
 */
module.exports = ResponseInterceptor = function() {
    /**
     * Add default interceptors to validate request and his payload
     */
    this.addInterceptor(new ResponsePayloadInterceptor());
    this.addInterceptor(new ResponseHeadersInterceptor());
};

ResponseInterceptor.prototype = new Interceptor();
ResponseInterceptor.prototype.constructor = ResponseInterceptor;

var instance_ = null;
ResponseInterceptor.getInstance = function () {
    if (!instance_) {
        instance_ = new ResponseInterceptor();
    }

    return instance_;
};