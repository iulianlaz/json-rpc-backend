/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The class that handles the JSONRPC API calls. Raw requests are received and
 * handled by HTTPEndpoint.
 */

var http = require('http');

var HTTPEndpoint = require('apiserver/jsonrpc/HTTPEndpoint');
var ServiceLoader = require('apiserver/jsonrpc/ServiceLoader');
var HTTPErrorHandler = require('apiserver/jsonrpc/HTTPErrorHandler');
var RequestInterceptor = require('apiserver/jsonrpc/interceptor/RequestInterceptor');
var ResponseInterceptor = require('apiserver/jsonrpc/interceptor/ResponseInterceptor');
var CacheManager = require('core/cache/CacheManager');
var EventProcessor = require('core/eventProcessor/EventProcessor');

/**
 * The constructor.
 * @param {Object} config The configuration parameters.
 * @implements {hg.APIServer.iAPIServer}
 */
module.exports = HTTPServer = function(configuration) {

    /**
     * How often events processors should run
     * @type {number}
     */
    var timeIntervalForProcessing_ = 3000;

    var configuration_ = configuration || {};

    /**
     * Configuration parameters
     * @type {{host: (*|string), port: (*|string)}}
     * @private
     */
    var config_ = {
        host: configuration_['host'] || '127.0.0.1',
        port: configuration_['port'] || '9000'
    };

    /**
     * Hardcoded value for location of the backend services
     * Location is relative to the NODE_PATH
     * (e.g. NODE_PATH=/usr/local/iulian/licenta/presence-server/backend)
     * @type {string}
     */
    var PATH_TO_SERVICES = 'apiservice';

    /**
     * Web Server Object
     * @private
     */
    var APIServer_ = null;

    /**
     * API endpoint
     * @private
     */
    var endpoint_ = null;

    /**
     * Manages all queues for all users
     * @type {hg.Core.Cache.CacheManager}
     * @private
     */
    var cacheManager_ = CacheManager.getInstance();

    /**
     * Processor for the events
     * @type {null}
     * @private
     */
    var eventProcessor_ = EventProcessor.getInstance();

    /**
     * @inheritDoc
     */
    this.getEndpoint = function() {
        return endpoint_;
    };

    /**
     * Start HTTP Server in order to listen for new requests
     */
    this.start = function() {
        try {
            APIServer_ = http.createServer(function(request, response) {
                            requestListener_(request, response);
            });
            APIServer_.listen(config_['port'], config_['host']);
            console.log('PresenceServer: Server is running...');
            APIServer_.on('close', function() {
                console.log('PresenceServer: Server closes.');
            });
            endpoint_= new HTTPEndpoint(RequestInterceptor.getInstance(), ResponseInterceptor.getInstance());

            //FIXME cacheManager instance
            //cacheManager_ = CacheManager.getInstance();
            setInterval(startEventsProcessing_, 3000);

        } catch (error) {
            console.log(error);
        }
    };

    /**
     * Stops HTTP Server
     * TODO: implement handler function
     * @param handler
     */
    this.stop = function(handler) {
        try {
            APIServer_.close(handler);
            process.exit();
        }
        catch (error) {
            handler(error);
            console.log(error);
        }
    };

    /**
     * Listens for new requests and sends response back to the client
     * @param request A http.IncomingMessage object created by http.Server and passed as the first argument to the
     * 'request' and 'response' event respectively.
     * @param response A http.ServerResponse object
     * @private
     */
    var requestListener_ = function(request, response) {
        var errorHandlerDomain = new HTTPErrorHandler();
        errorHandlerDomain.createDomain();
        errorHandlerDomain.addEmitter(request);
        errorHandlerDomain.addEmitter(response);

        var data = '';
        request.on('data', function (bytes) {
            data += bytes;
        });
        request.on('end', function () {
            errorHandlerDomain.handleException(request, response, data);
            // Run handleRequest in domain's context
            var domain = errorHandlerDomain.getDomain();
            domain.run(function() {
                handleRequest_(request, response, data);
            });
        });

        response.on('finish', function() {
            console.log("PresenceServer: Response has been sent.");
        });
    };

    /**
     * Handles the request received from client
     * @param request A http.IncomingMessage object created by http.Server
     * @param response A http.ServerResponse object
     * @param data Payload of the request
     */
    var handleRequest_ = function(request, response, data) {
        //TODO: Check Authorization
        endpoint_.setServiceLoader(new ServiceLoader(PATH_TO_SERVICES));
        endpoint_.handle(request, response, data);
    }

    /**
     * Starts events processing
     * @private
     */
    var startEventsProcessing_ = function() {
        eventProcessor_.processEvents();
    }
};

