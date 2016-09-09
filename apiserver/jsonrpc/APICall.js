/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The class that is used to send the request information to services
 */

/**
 * The constructor
 * @param {Object} request A http.IncomingMessage object send from client
 * @type {APICall}
 * @implements {hg.APIServer.iAPICall}
 */
module.exports = APICall = function(request, data) {

    /**
     * Parameteres of the API Call
     * @type {Object}
     * @private
     */
    var parameteres_ = null;

    /**
     * Operation identifier (e.g. create, read)
     * @type {string}
     * @private
     */
    var opIdentifier_ = null;

    /**
     * Service identifiers
     * @type {string}
     * @private
     */
    var serviceIdentifier_ = null;

    /**
     * Version of the API
     * TODO: Obtained from URI path
     * @type {string}
     * @private
     */
    var version_ = null;

    /**
     * @inheritDoc
     */
    this.getAllParameteres = function() {
        if ((parameteres_ === undefined) || (parameteres_ === null)) {
            var payload = data;
            if ((payload['params'] === undefined) || (payload['params'] === null)) {
                parameteres_ = null;
            } else {
                parameteres_ = payload['params'];
            }
        }

        return parameteres_;
    };

    /**
     * @inheritDoc
     */
    this.getOpIdentifier = function() {
        if ((opIdentifier_ === undefined) || (opIdentifier_ === null)) {
            parseMethod_();
        }
        return opIdentifier_;
    };

    /**
     * @inheritDoc
     */
    this.getServiceIdentifier = function() {
        if ((serviceIdentifier_ === undefined) || (serviceIdentifier_ === null)) {
            parseMethod_();
        }
        return serviceIdentifier_;
    };

    /**
     * Returns the version of the API
     * @returns {string}
     */
    this.getVersion = function() {
        if ((version_ === undefined) || (version_ === null)) {
            parseVersion_();
        }

        return version_;
    };

    /**
     * Parses the method parameter received in the payload and saves service
     * identifier and operation identifier (e.g. For PersonService.create: person - service id., create - op id.)
     * @returns {string}
     * @private
     */
    var parseMethod_ = function() {
        // Todo: Should save the payload as Object in Request?
        var payload = data;
        if ((payload['method'] === undefined) || (payload['method'] === null)) {
            //throw exception
        }

        var result =  payload['method'].split(".");
        opIdentifier_ = result[1];

        // Get service id. (eg. Get "person" from "PersonService")
        var len = result[0].length;
        var extract = result[0].substr(0, len - 7);
        serviceIdentifier_ = extract.toLowerCase();
    };

    /**
     * Extract the version of the API that is requested to be executed
     * The version is extracted from the URI.
     * URI example: "/<path>/<versionNumber>"
     * @private
     */
    var parseVersion_ = function() {
        var uri = request.url;
        var lastSlash = uri.lastIndexOf('/');

        var ver = uri.charAt(lastSlash + 1);
        if ((ver === undefined) || (ver === null) || (ver === "") || (ver === "0") || (isNaN(ver))) {
            version_ = null;
        } else {
            version_ = parseInt(ver);
        }
    };
};