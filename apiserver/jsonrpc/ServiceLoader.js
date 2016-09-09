/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Handles the incoming calls to the JSON RPC API
 */


/**
 * The constructor.
 * @param {string} Location of the services
 * @implements {hg.APIServer.iServiceLoader}
 */
module.exports = ServiceLoader = function(pathToServices) {
    var EXECUTOR = 'Executor';

    /**
     * Service configuration details such as:
     * - path to the executor file
     * @type {Array}
     */
    var config_ = [];

    /**
     * Executor of the API Call
     * @type {Object}
     * @private
     */
    var executor_ = null;

    /**
     * Return an instance of an executor class
     * @returns {Object}
     */
    this.getExecutor = function() {
        if ((executor_ === undefined) || (executor_ === null)) {
            //FIXME: Try catch, otherwise server crashes
            var Executor = require(config_['executor']);
            executor_ = new Executor();
        }

        return executor_;
    };

    /**
     * Loads the service files
     * @param serviceIdentifier Identifier for the service (e.g. presence, person, activity)
     */
    this.loadService = function(serviceIdentifier, version) {
        if ((version === undefined) || (version === null)) {
            var servicePath = pathToServices + '/' + serviceIdentifier;
        } else {
            var servicePath = pathToServices + '/' + version + '/' + serviceIdentifier;
        }
        config_['executor'] = servicePath + '/' + EXECUTOR + '.js';
    };
};