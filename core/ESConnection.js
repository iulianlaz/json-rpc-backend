/**
 * -------------------------------
 * Node - hg.Core
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class is responsible for connection with ES database
 */

//FIXME: Path MUST be changed. Must be placed in NODE_PATH
var elasticsearch = require('/usr/local/lib/node_modules/elasticsearch');

module.exports = ESConnection = function(envVars) {

    /**
     * Connection details
     * @type {Object}
     */
    var connectionDetails_ = {};

    /**
     * Elastic Search client
     * @type {Object}
     */
    var client_ = null;


    if ((envVars['host'] === undefined) || (envVars['host'] === null)) {
        connectionDetails_['host'] = '127.0.0.1';
    } else {
        connectionDetails_['host'] = envVars['host'];
    }

    if ((envVars['port'] === undefined) || (envVars['port'] === null)) {
        connectionDetails_['port'] = '9200';
    } else {
        connectionDetails_['port'] = envVars['port'];
    }

    if ((envVars['index'] === undefined) || (envVars['index'] === null)) {
        connectionDetails_['index'] = 'presence';
    } else {
        connectionDetails_['index'] = envVars['index'];
    }

    var ESHost = connectionDetails_['host'] + ':' + connectionDetails_['port'];

    client_ = new elasticsearch.Client({
        host: ESHost
    });

    /**
     * Returns ES client
     * @returns {Object}
     */
    this.getClient = function() {
        return client_;
    };

    /**
     * Returns details about connection
     * @returns {Object}
     */
    this.getConnectionDetails = function() {
        return connectionDetails_;
    };
};