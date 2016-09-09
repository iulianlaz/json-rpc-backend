/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Handles the incoming calls to the JSON RPC API
 */

var APICall = require('apiserver/jsonrpc/APICall');
var APIResult = require('apiserver/jsonrpc/APIResult');
var Response = require('apiserver/Response');
var Util = require('core/util/Util');
var RequestInterceptor = require('apiserver/jsonrpc/interceptor/RequestInterceptor');
var ResponseInterceptor = require('apiserver/jsonrpc/interceptor/ResponseInterceptor');

/**
 * The constructor.
 * @implements {hg.APIServer.iAPIEndpoint}
 * @param {Object} requestValidator Validator for the request
 */
module.exports = HTTPEndpoint = function(requestInterceptor, responseInterceptor) {

    /**
     * Instance of a service loader
     * @type {hg.APIServer.JSONRPC.ServiceLoader}
     * @private
     */
    var serviceLoader_ = null;

    /**
     * Interceptor for the request
     * @private
     */
    var requestInterceptor_ = requestInterceptor || null;

    /**
     * Interceptor for the response
     * @private
     */
    var responseInterceptor_ = responseInterceptor || null;

    /**
     * @inheritDoc
     */
    this.setServiceLoader = function(savedServiceLoader) {
        serviceLoader_ = savedServiceLoader;
    };

    /**
     * Sets the interceptor for the request
     * @param {Object} requestInterceptor Validator for the request
     */
    this.setRequestInterceptor = function(requestInterceptor) {
        requestInterceptor_ = requestInterceptor;
    };

    /**
     * Sets the interceptor for the request
     * @param {Object} responseInterceptor Interceptor for the response
     */
    this.setResponseInterceptor = function(responseInterceptor) {
        responseInterceptor_ = responseInterceptor;
    };

    /**
     * @inheritDoc
     */
    this.handle = function(request, response, data) {
        if (requestInterceptor_ === null) {
            requestInterceptor_ = RequestInterceptor.getInstance();
        }

        // Object data from string
        var requestPayload = requestInterceptor_.intercept(request, data);

        var apiCall = getAPICall_(request, requestPayload);
        serviceLoader_.loadService(apiCall.getServiceIdentifier(), apiCall.getVersion());
        var executor =  serviceLoader_.getExecutor();

        var self = this;
        executor.execute(apiCall, getAPIResult_(), function(apiResult) {
            var resultPayload = apiResult.getAllParameteres();
            var responseInfo = createSuccessResponse_(Util.StatusCode.OK, resultPayload, requestPayload);

            sendResponse_.call(self, response, responseInfo);
        });
    };

    /**
     * Returns an APICall object
     * @param {Object} request A http.IncomingMessage object created by http.Server
     * @returns {APICall}
     * @private
     */
    var getAPICall_ = function(request, data) {
        return new APICall(request, data);
    };

    /**
     * Returns an APIResult object
     * @returns {APIResult}
     * @private
     */
    var getAPIResult_ = function() {
        return new APIResult();
    };

    /**
     * Creates an object with response information such as:
     *  - status
     *  - payload
     *  - payload of the request
     *  TODO: headers
     * @param result Payload for the response
     * @returns {Response} A Response object will be returned
     * @private
     */
    var createSuccessResponse_ = function(status, resultPayload, requestPayload) {
        var responseObj = new Response();
        responseObj.setStatus(status);
        responseObj.setPayload(resultPayload);
        responseObj.setRequestPayload(requestPayload);

        return responseObj;
    };

    /**
     * Send the response to the client. Also, information that are specific to the
     * JSON-RPC specification are added
     * @param {Object} response A http.ServerResponse object
     * @param {Object} responseInfo An object containing information about response (status, payload, headers)
     * @private
     */
    var sendResponse_ = function(response, responseInfo) {
        if (responseInterceptor_ === null) {
            responseInterceptor_ = ResponseInterceptor.getInstance();
        }
        responseInterceptor_.intercept(responseInfo);

        response.writeHead(responseInfo.getStatus(), responseInfo.getHeaders());
        response.write(JSON.stringify(responseInfo.getPayload()));
        response.end();
    };
};