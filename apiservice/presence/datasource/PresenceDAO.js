/**
 * -------------------------------
 * Node - hg.APIService.Presence
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Presence data access object class. This class is used to create or read presence of users
 */

var configurationFile = require('core/configuration.json');
var Product = require('core/Product');

/**
 * The constructor.
 * @implements {hg.APIService.iPresenceDAO}
 */
module.exports = PresenceDAO = function() {

    // Initialize ES connection
    var envVars = configurationFile;
    var product = Product.getInstance(envVars);
    var esConn_ = product.getStorage(Product.STORAGE_ES);

    /**
     * @inheritDoc
     */
    this.insert = function(presence, storeType) {
        var esClient = esConn_.getClient();
        var connDetails = esConn_.getConnectionDetails();
        esClient.create({
            index: connDetails['index'],
            type: storeType,
            body: presence.getData()
        }, function (error, response) {
            console.log(error);
            //console.log(response);
        });
    };

    /**
     * @inheritDoc
     */
    this.find = function(storeType, count, presenceHistoryCallback) {
        var esClient = esConn_.getClient();
        var connDetails = esConn_.getConnectionDetails();
        esClient.search({
            index: connDetails['index'],
            type: storeType,
            body: {
                "size": count,
                "sort": [
                    {"created": {"order": "desc"}}
                ]
            }
        }).then(function(body) {
            var hits = body.hits.hits;
            var sourceHits = [];
            for (var index in hits) {
                if (hits[index]['_source'] !== undefined) {
                    sourceHits.push(hits[index]['_source']);
                }
            }
            presenceHistoryCallback(sourceHits);

        }, function(error) {
            console.log(error);
            presenceHistoryCallback(null);
        });
    };
};

PresenceDAO.storeType = {
    'MOOD' : 'userMood',
    'LOCATION': 'userLocation',
    'AV_SCORE': 'userAvScore',
    'EVENT': 'userEvent',
    'EXPLICIT_STATUS': 'userExplicitStatus'
};