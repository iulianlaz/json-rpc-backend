/**
* -------------------------------
* Node - hg.APIService.Presence
* -------------------------------
* Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
*
* @author iulianl
* @fileoverview Executor class
*/

var AbstractExecutor = require('apiservice/common/AbstractExecutor');
var Service = require('apiservice/presence/Service');
var Exception = require('apiservice/presence/Exception');

/**
 * The constructor.
 */
module.exports = Executor = function() {
    /**
     * Instance of the service
     * @type {null}
     * @private
     */
    var service_ = null;

    this.execute = function(apiCall, apiResult, cb) {
        if (service_ === null) {
            service_ = initService();
        }

        var operation = apiCall.getOpIdentifier();
        //TODO: Check if the operation is supported
        //apiResult.setParameters(operation(apicall));

        if (supportedOps.hasOwnProperty(operation)) {
            // Private methods will be called here
            supportedOps[operation](apiCall, function(result) {
                apiResult.setParameteres(result);
                cb(apiResult);
            });

        } else {
            throw new Exception(Exception.PRS_MSG_NOT_ALLOWED_OP, Exception.PRS_CODE_NOT_ALLOWED_OP);
        }
    }

    /**
     * Method that initializes the service
     * @returns {hg.APIService.Presence.Service}
     * @private
     */
    var initService = function() {
        return new Service();
    }

    /**
     *
     * @param apiCall
     * @private
     */
    var update_ = function(apiCall, cb) {
        console.log('Executor: Execute "update_" and call "update" method from Presence Service.');
        service_.update(apiCall, function(result) {
            cb(result);
        });
    }

    /**
     *
     * @param apiCall
     * @private
     */
    var read_ = function(apiCall, cb) {
        console.log('Executor: Execute "read_" and call "read" method from Presence Service.');
        console.log('----------------------------------------------------');
        service_.read(apiCall, function(result) {
            cb(result);
        });
    }

    /**
     *
     * @param apiCall
     * @private
     */
    var readPresenceHistory_ = function(apiCall, cb) {
        console.log('Executor: Execute "readPresenceHistory_" and call "read" method from Presence Service.');
        console.log('----------------------------------------------------');
        service_.readPresenceHistory(apiCall, function(hits) {
            cb(hits);
        });
    }

    /**
     *
     * @param apiCall
     * @private
     */
    var readActivityHistory_ = function(apiCall, cb) {
        console.log('Executor: Execute "readPresenceHistory_" and call "read" method from Presence Service.');
        console.log('----------------------------------------------------');
        service_.readActivityHistory(apiCall, function(hits) {
            cb(hits);
        });
    }

    /**
     * An array containing all the operations that can be executed by this executor
     * @type {Array}
     * @private
     */
    var supportedOps = {
        "update": update_,
        "read": read_,
        "readPresenceHistory": readPresenceHistory_,
        "readActivityHistory": readActivityHistory_
    }
}
Executor.prototype = new AbstractExecutor();
Executor.prototype.constructor = Executor;