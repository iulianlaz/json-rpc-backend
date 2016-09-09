/**
 * -------------------------------
 * Node - hg.APIService.Presence
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Executor class
 */

var Presence = require('apiservice/presence/resource/Presence');
var PresenceDAO = require('apiservice/presence/datasource/PresenceDAO');
var PresenceCache = require('apiservice/presence/PresenceCache');
var EventProcessor = require('core/eventProcessor/EventProcessor');
var Util = require('core/util/Util');
var NodeCacheModule = require('core/cache/NodeCacheModule');

/**
 * The constructor.
 * FIXME: Cache update & saving to db should be done async
 */
module.exports = Service = function() {

    /**
     * Hardcoded userId
     * @type {string}
     * @private
     */
    var userId_ = 'iulian';

    var eventProcessor_ = EventProcessor.getInstance();

    /**
     * PresenceCache object
     * @type {hg.Core.Cache.PresenceCache}
     * @private
     */
    var presenceCache_ = null;

    /**
     * Updates presence score
     * @param apiCall
     * @returns {boolean}
     */
    this.update = function (apiCall, cb) {
        console.log('Service: Create method...');
        var params = apiCall.getAllParameteres();
        console.log('--------------------- API CALL PARAMS ---------------------------');
        console.log(params);
        console.log('-----------------------------------------------------------------');

        //FIXME: Should be done async?
        updateCache_(params);
        //saveToDb_(params);

        cb(true);
    }

    this.read = function (apicall, cb) {
        //var params = apiCall.getAllParameteres();
        //FIXME: filters!!!
        //params['filter']

       buildPresence_(apicall, cb);
    }

    this.readPresenceHistory = function(apicall, cb) {
        var presenceDAO = new PresenceDAO();
        presenceDAO.find(PresenceDAO.storeType['AV_SCORE'], 10, function(hits) {
            var lastScores = [];
            for (var index in hits) {
                if (hits[index]['avScore'] !== undefined) {
                    var presence = '';
                    presence = mapPresence_(hits[index]);
                    if (hits[index]['action'] !== undefined) {
                        presence += ' | ' + hits[index]['action'] ;
                    }
                    lastScores.push(presence);
                }
            }

            cb(lastScores);
        });
    }

    this.readActivityHistory = function(apicall, cb) {
        var presenceDAO = new PresenceDAO();
        presenceDAO.find(PresenceDAO.storeType['EVENT'], 3, function(hits) {
            var lastActivities = [];
            for (var index in hits) {
                if ((hits[index]['event'] !== undefined) && (hits[index]['event']['lastUpdate'] !== undefined)) {
                    lastActivities.push(hits[index]['event']['lastUpdate']);
                }
            }
            console.log(lastActivities);
            cb(lastActivities);
        });
    }

    /**
     * Updates queues when a new event arrives
     * @param data
     * @private
     */
    var updateCache_ = function(data) {
//        var rand = Math.floor(Math.random()*10) + 2;
//        console.log('************* RAND *************' + rand);
//        if (rand >= 5) {
          presenceCache_ = new PresenceCache(userId_);
//        } else {
//            var presenceCache = new PresenceCache('bond');
//        }

        updateCacheAvScore_(data);
        updateCacheMood_(data);
        updateCacheLocation_(data);
        updateCacheEvent_(data);
    }

    /**
     * Updates availability score queue when a new event arrives
     * @param data
     * @private
     */
    var updateCacheAvScore_ = function(data) {
        // If event's class is STATUS, then update explicit presence
        if ((data['lastUpdate'] !== undefined) &&
            (data['lastUpdate']['class'] === 'STATUS') &&
            (data['lastUpdate']['content'] !== undefined)) {
            var status = data['lastUpdate']['content']['status'];
            if (status !== undefined) {

                //TODO: Explicit presence
                if (EventProcessor.Availability[status] !== undefined) {
                    var dbStatus = {};
                    dbStatus['status'] = status;
                    dbStatus['created'] = Util.getCurrentTime();
                    saveToDb_(dbStatus, PresenceDAO.storeType['EXPLICIT_STATUS']);
                    presenceCache_.setExplicitStatus(status);
                }
            }
        // If event's class is ACTIVITY OR EVENT, then process this events
        } else {
            if ((data['lastUpdate'] !== undefined) &&
                (data['lastUpdate']['class'] === EventProcessor.eventClass['ACTIVITY']) ||
                (data['lastUpdate']['class'] === EventProcessor.eventClass['EVENT'])) {

                eventProcessor_.sendEventForProcessing(userId_, data['lastUpdate']);
                console.log('>>>>>>>>>>>>>>>>>>>>>> Process event  ended?<<<<<<<<<<<<<');
            }
        }

        console.log('============avScore QUEUE===========');
        var res = presenceCache_.getAllFromQueue('avScoreQueue');
        console.log(res);
        console.log('====================================');

        console.log('============EXPLICIT STATUS===========');
        var res = presenceCache_.getExplicitStatus();
        console.log(res);
        console.log('====================================');
    }

    /**
     * Updates mood queue when a new event arrives
     * @param data
     * @private
     */
    var updateCacheMood_ = function(data) {
        if (data['userMood'] !== undefined) {
            var cachedMood = {};
            cachedMood['mood'] = data['userMood'];
            cachedMood['created'] = Util.getCurrentTime();
            saveToDb_(cachedMood, PresenceDAO.storeType['MOOD']);
            presenceCache_.addMood(cachedMood);
        }

        console.log('============MOOD QUEUE===========');
        var res = presenceCache_.getAllFromQueue('moodQueue');
        console.log(res);
        console.log('====================================');
    };

    /**
     * Updates location queue when a new event arrives
     * @param data
     * @private
     */
    var updateCacheLocation_ = function(data) {
        var cachedLocation = {};
        if (data['device'] !== undefined) {
            if (data['device']['place'] !== undefined) {
                cachedLocation['place'] = data['device']['place'];
            }

            if (data['device']['status'] !== undefined) {
                cachedLocation['deviceStatus'] = data['device']['status'];
            }

            if (data['device']['geoCoordinates'] !== undefined) {
                cachedLocation['geoCoordinates'] = data['device']['geoCoordinates'];
            }
        }

        if (data['lastUpdate'] !== undefined) {
            if (data['lastUpdate']['content'] !== undefined) {
                cachedLocation['geoCoordinates'] = data['lastUpdate']['content']['geoCoordinates'];
            }
        }
        cachedLocation['created'] = Util.getCurrentTime();

        if (JSON.stringify(cachedLocation) === '{}') {
            saveToDb_(cachedLocation, PresenceDAO.storeType['LOCATION']);
            presenceCache_.addLocation(cachedLocation);
        }

        console.log('============LOCATION QUEUE===========');
        var res = presenceCache_.getAllFromQueue('locationQueue');
        console.log(res);
        console.log('====================================');
    };

    /**
     * Updates event queue
     * @param data
     * @private
     */
    var updateCacheEvent_ = function(data) {

        var cachedEvent = {};
        cachedEvent['event'] = data;
        cachedEvent['created'] = Util.getCurrentTime();

        saveToDb_(cachedEvent, PresenceDAO.storeType['EVENT']);
        presenceCache_.addEvent(cachedEvent);

        console.log('============EVENT QUEUE===========');
        var res = presenceCache_.getAllFromQueue('eventQueue');
        console.log(res);
        console.log('====================================');
    };

    /**
     * Saves events into database
     * @param data
     * @private
     */
    var saveToDb_ = function(data, storeType) {
        var dbData = Util.cloneObject(data);
        dbData['userId'] = userId_;

        var presence = new Presence();
        presence.setData(dbData);
        var presenceDAO = new PresenceDAO();
        presenceDAO.insert(presence, storeType);
    };

    /**
     * Map presence status based on score
     * @param lastPresence
     * @returns {*}
     * @private
     */
    var mapPresence_ = function(lastPresence) {
        if ((lastPresence === null) || (lastPresence['avScore'] === undefined)) {
            return Service.AvailabilityStatus.UNKNOWN;
        }

        if (lastPresence['avScore'] === 1) {
            return Service.AvailabilityStatus.AVAILABLE;
        }

        if ((lastPresence['avScore'] >= 0.9) && (lastPresence['avScore'] < 1)) {
            return Service.AvailabilityStatus.MBE_AVAILABLE;
        }

        if ((lastPresence['avScore'] >= 0.7) && (lastPresence['avScore'] < 0.9)) {
            return Service.AvailabilityStatus.MBE_BUSY;
        }

        if ((lastPresence['avScore'] >= 0.5) && (lastPresence['avScore'] < 0.7)) {
            return Service.AvailabilityStatus.BUSY;
        }

        if ((lastPresence['avScore'] >= 0.1) && (lastPresence['avScore'] < 0.5)) {
            return Service.AvailabilityStatus.DND;
        }

        if ((lastPresence['avScore'] > 0) && (lastPresence['avScore'] < 0.1)) {
            return Service.AvailabilityStatus.NOT_AVAILABLE;
        }

        if ((lastPresence['avScore'] === 0)) {
            return Service.AvailabilityStatus.MBE_AVAILABLE;
        }

        return null;
    }

    /**
     * Builds presence object
     * @returns {Object}
     * @private
     */
    var buildPresence_ = function(apicall, cb) {
        presenceCache_ = new PresenceCache(userId_);
        var lastPresence = presenceCache_.getLastUpdateFromQueue(NodeCacheModule.AV_SCORE_QUEUE);
        var event = presenceCache_.getLastUpdateFromQueue(NodeCacheModule.EVENT_QUEUE);
        var mood = presenceCache_.getLastUpdateFromQueue(NodeCacheModule.MOOD_QUEUE);
        var explicitStatus = presenceCache_.getExplicitStatus();
        var avStatus = mapPresence_(lastPresence);

        var presence = {};

        if (explicitStatus !== null) {
            presence['userRawStatus'] = explicitStatus;
        }

        if ((lastPresence !== null) && (avStatus !== null)) {
            presence['userStatus'] = avStatus;
        }

        if ((lastPresence !== null) && (lastPresence['action'] !== undefined)) {
            presence['userStatus'] += ' | ' + lastPresence['action'];
        }

        if ((event !== null) && (event['event']['lastUpdate'] !== undefined)) {
            presence['lastUpdate'] = event['event']['lastUpdate'];
        }

        if (mood !== null) {
            presence['userMood'] = mood['mood'];
        }

        // If cache is empty, then read from database
        if (lastPresence === null) {
            var presenceDAO = new PresenceDAO();
            presenceDAO.find(PresenceDAO.storeType['AV_SCORE'], 1, function(hits) {

                if ((hits === null) || (hits.length === 0)) {
                    if (presence['userStatus'] === undefined) {
                        presence['userStatus'] = avStatus;
                    }
                } else {
                    for (var index in hits) {
                        if (hits[index]['avScore'] !== undefined) {
                            var presenceScore = '';
                            presenceScore = mapPresence_(hits[index]);
                            if (hits[index]['action'] !== undefined) {
                                presenceScore += ' | ' + hits[index]['action'];
                            }
                            //if ((presenceScore === Service.AvailabilityStatus.DND) &&
                            //(hits[index]['action'] === 'MEETING')) {
                            //    presenceScore = Service.AvailabilityStatus.MBE_AVAILABLE;
                            //}
                            //}
                            presence['userStatus'] = presenceScore;
                            break;
                        }
                    }
                }

                cb(presence);
            });
        } else {
            cb(presence);
        }

    }

}

/**
 * Availability status send to the subscriber
 * @type {Object}
 */
Service.AvailabilityStatus = {
    'AVAILABLE': 'AVAILABLE',
    'MBE_AVAILABLE': 'MAYBE AVAILABLE',
    'MBE_BUSY': 'MAYBE BUSY',
    'BUSY': 'BUSY',
    'DND': 'DND',
    'NOT_AVAILABLE': 'NOT AVAILABLE',
    'OFFLINE': 'OFFLINE',
    'UNKNOWN': 'UNKNOWN'
}