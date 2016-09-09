/**
 * ------------------------------------------
 * Node - hg.APIServer.JSONRPC.Interceptor
 * ------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class handles the interceptors used to filter data
 */

var Interceptor = require('apiserver/Interceptor');
var HeadersValidator = require('apiserver/jsonrpc/interceptor/HeadersValidator');
var MethodValidator = require('apiserver/jsonrpc/interceptor/MethodValidator');
var PayloadValidator = require('apiserver/jsonrpc/interceptor/PayloadValidator');

/**
 * The constructor.
 * @extends {hg.APIServer.Interceptor}
 */
module.exports = RequestInterceptor = function() {
    /**
     * Add default interceptors to validate request and his payload
     */
    this.addInterceptor(new HeadersValidator());
    this.addInterceptor(new MethodValidator());
    this.addInterceptor(new PayloadValidator());

    /**
     * Validate request and his payload.
     * @param {Object} request A http.IncomingMessage object created by http.Server
     * @data {string} data Payload of the request
     * @return null | newPayload Returns unserialized payload
     * @overload
     */
    this.intercept = function(request, data) {
        var newPayload = null;

        var interceptors = this.getInterceptors();
        var len = interceptors.length;
        for(var index = 0; index < len; index++) {
            if (interceptors[index] instanceof PayloadValidator) {
                newPayload = interceptors[index].intercept(data);
            } else {
                interceptors[index].intercept(request);
            }
        }

        if (newPayload !== null) {
            return newPayload;
        }
        return null;
    };
};

RequestInterceptor.prototype = new Interceptor();
RequestInterceptor.prototype.constructor = RequestInterceptor;

var instance_ = null;
RequestInterceptor.getInstance = function () {
    if (!instance_) {
        instance_ = new RequestInterceptor();
    }

    return instance_;
};