/**
 * -------------------------------
 * Node - hg.Core
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class is responsible for initializing the product and handle product operation with storage
 */

var ESConnection = require('core/ESConnection');

/**
 * The constructor.
 * @param {Object} configuration Configuration directives
 */
module.exports = Product = function(environment) {

    /**
     * Object containing all storage engines
     * @type {{}}
     */
    var storages_ = {};

    /**
     * Object containing all configuration directive
     * @type {Object}
     * @private
     */
    var environment_ = environment;

    /**
     * Retrieves instances of a complex storage. Storages are identified by storage type:
     *  - elasticsearch
     *  - mysql
     * @param storageType
     * @returns {Object}
     */
    this.getStorage = function(storageType) {
        switch (storageType) {
            case 'elasticsearch':
                var envVars = getESEnvVars_();
                storages_[storageType] = new ESConnection(envVars);
                break;

            default:
                //throw exception
        }
        return storages_[storageType];
    };

    /**
     * Get connection variables for elastic search database
     * @returns {Object}
     * @private
     */
    var getESEnvVars_ = function() {
        var envVars = {};
        envVars['host'] = environment_['es_information']['host'];
        envVars['port'] = environment_['es_information']['port'];

        return envVars;
    };

}

Product.STORAGE_ES = 'elasticsearch';

var instance_ = null;
Product.getInstance = function(config) {
    if (!instance_) {
        instance_ = new Product(config);
    }

    return instance_;
};
