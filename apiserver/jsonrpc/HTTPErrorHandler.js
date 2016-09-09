/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The class handles the errors and exceptions triggered by the services or other components
 */

var domain = require('domain');
var ErrorCodes = require('apiserver/jsonrpc/ErrorMap');

/**
 * The constructor.
 */
module.exports = HTTPErrorHandler = function() {

    /**
     * Domain Object used to handle errors and exceptions
     * @type {Object}
     * @private
     */
    var errorHandlerDomain_ = null;

    /**
     * Error Codes
     * @type {Array}
     */
    var errorMapCodes = ErrorCodes.errorMap;

    /**
     * Returns Domain that handles exceptions
     * @returns {Object}
     */
    this.getDomain = function() {
        return errorHandlerDomain_;
    }

    /**
     * Creates a new Domain Object
     */
    this.createDomain = function() {
        errorHandlerDomain_ = domain.create();
    };

    /**
     * Add an emitter to the domain
      * @param emitter This can be: EventEmitter Object or Timer
     */
    this.addEmitter = function(emitter) {
        if (errorHandlerDomain_ !== null) {
            errorHandlerDomain_.add(emitter);
        }
    };

    /**
     * Handles the exceptions
     * @param request
     * @param response
     * @param data Payload of the request. Used to obtain jsonrpc version and message id
     */
    this.handleException = function(request, response, data) {
        errorHandlerDomain_.on('error', function(error) {

            console.log(error);
            var newError = null;
            var status = '404';
            switch (error.name) {
                case 'hg.APIServer.JSONRPC.Exception':
                    newError = { code: errorMapCodes[error.code]['code'],
                        message: errorMapCodes[error.code]['message']
                    };
                    status = errorMapCodes[error.code]['status'];
                    break;

                // Catch errors such as: hg.APIService.Presence.Exception
                default:
                    var serviceErrorMap = getServiceErrorMap_(error.name);
                    if ((serviceErrorMap === null) || (serviceErrorMap === undefined)) {
                        newError = { code: errorMapCodes['1000']['code'],
                            message: errorMapCodes['1000']['message']
                        };
                    } else {
                        newError = { code: serviceErrorMap[error.name + ':' + error.code]['code'],
                            message: serviceErrorMap[error.name + ':' + error.code]['message']
                        };
                        status = errorMapCodes[error.code]['status'];
                    }
            }

            var body = getBody_(data, newError);
            var headers = getHeaders_(body);

            response.writeHead(status, headers);
            response.write(JSON.stringify(body));
            response.end();
        });
    }

    /**
     * Returns Error Mapping for a specific service if exists
     * e.g. hg.APIService.Presence.Exception -> apiservice/presence/jsonrpc/Config
     * @param {string} name Name of the error
     * @return {Object} Error Map for specific service
     */
    var getServiceErrorMap_ = function(name) {
        try {
            var splittedName = name.split('.');

            if ((splittedName !== null) && (splittedName.length >= 2) && splittedName[0] === 'hg') {
                var errorMapPath = splittedName[1].toLowerCase() + '/' + splittedName[2].toLowerCase() + '/jsonrpc/Config';
                var Config = require(errorMapPath);
                return Config.errorMap;
            }
            return null;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Get payload for the response
     * @param data Payload of the request
     * @param newError Error that is sent in the response
     * @returns {{Object}}
     */
    var getBody_ = function(data, newError) {
        // TODO: Check if payload contains jsonrpc and id
        var payload = null;
        try {
            payload = JSON.parse(data);
        } catch (e) {
            payload = '';
        }

        var body = {};
        if (payload['jsonrpc'] !== undefined) {
            body['jsonrpc'] = payload['jsonrpc'];
        } else {
            body['jsonrpc'] = '2.0';
        }
        body['error'] = newError;

        if (payload['id'] !== undefined) {
            body['id'] = payload['id'];
        } else {
            body['id'] = 'null';
        }

        return body;
    }

    /**
     * Returns headers for the response
     * @param body Body of the response used to compute content length
     * @returns {Object}
     * @private
     */
    var getHeaders_ = function(body) {
        var headers = {
            "Content-Type": "application/json",
            "Content-Length": JSON.stringify(body).length
        };
        return headers;
    }
}