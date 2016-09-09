/**
 * -------------------------------
 * Node - hg.APIService.Common
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The class that is used to send the request information to services
 */



/**
 * The constructor
 * @type {APICall}
 * @implements {hg.APIServer.iAPICall}
 */
module.exports = AbstractExecutor = function() {
    /**
     * An array containing all the operation that can be executed by this executor
     * FIXME: Every child class must have this field
     * @type {Array}
     * @private
     */
    var supportedOps_ = [];

}

/**
 * Initializes the service and executes the operation on the service
 * @param apicall Response information
 * @param apiResult Result information
 */
AbstractExecutor.prototype.execute = function(apicall, apiResult) {}

/**
 * Method that initializes the service
 * @returns {Object}
 */
AbstractExecutor.prototype.initService = function() {}