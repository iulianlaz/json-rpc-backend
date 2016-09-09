/**
 * --------------------------------------------
 * Node - hg.Core.EventProcessor
 * --------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview EventClassProcessor class. Used to process the events a user are attending
 */

var Util = require('core/util/Util');
var CacheManager = require('core/cache/CacheManager');
var NodeCacheModule = require('core/cache/NodeCacheModule');

/**
 * The constructor.
 */
module.exports = EventOccurrenceProcessor = function() {

    /**
     * Instance of CacheManager
     * @type {*}
     * @private
     */
    var cacheManager_ = CacheManager.getInstance();

    /**
     * Maximum interval time in order to change user's presence
     * @type {number}
     * @private
     */
    var timeInterval_ = 300000;

    /**
     * Process events
     */
    this.processEvent = function() {
        var cacheManager_ = CacheManager.getInstance();
        var cache = cacheManager_.getCache();

        console.log('\n################ PROCESSING EVENT OCCURRENCE... ###################');
        for (userId in cache) {
            if (cache.hasOwnProperty(userId)) {
                var eventQueue = cache[userId].getQueue(NodeCacheModule.EVENT_QUEUE);
                processEventOccurrrence_(eventQueue, userId);
            }
        }

    };

    /**
     * Process score based on the speed of occurrence
     * @param eventQueue
     * @private
     */
    var processEventOccurrrence_ = function(eventQueue, userId) {
        console.log('>>>>>>>> Availability Score Queue: last element:');
        var avScoreQueue = cacheManager_.getQueue(userId, NodeCacheModule.AV_SCORE_QUEUE);
        console.log(avScoreQueue.getLastElement());

        var queueLength = eventQueue.getQueueLength();
        //var lastEvent = eventQueue.getLastElement();
        for (var index = 0; index < queueLength; index++) {
            var currentEvent = eventQueue.getElementAt(index);
            if (currentEvent['created'] !== undefined) {
                var inTime = checkTime_(currentEvent['created']);
                if (inTime) {
                    // check the number of events
                    var eventsNo = queueLength - index;
                    setNewScore_(eventsNo, userId);
                    return true;
                }
            }
        }
        return true;
    };

    /**
     * Verifies how many events was received in the last "timeInterval" minutes
     * @param startTime
     * @param endTime
     * @returns {boolean}
     * @private
     */
    var checkTime_ = function(startTime) {
        var currentTime = Util.getCurrentTime();
        var downLimit = currentTime - timeInterval_;
        if (startTime >= downLimit) {
            return true;
        }

        return false;
    };

    /**
     * Sets new availability score based on how many events was received in the
     * last "timeInterval" minutes
     * @param eventNo
     * @param userId
     * @private
     */
    var setNewScore_ = function(eventNo, userId) {
        console.log('****************************************');
        console.log('****************************************' +eventNo);
        console.log('****************************************');
        console.log('****************************************');

        var cachedScore = {};
        cachedScore['avScore'] = -1;

        if (eventNo >= 9) {
            cachedScore['avScore'] = EventOccurrenceProcessor.Availability.AVAILABLE;
        }

        if ((eventNo >= 6) && (eventNo <= 8)) {
            cachedScore['avScore'] = EventOccurrenceProcessor.Availability.MBE_AVAILABLE;
        }

        if ((eventNo >= 3) && (eventNo <= 5)) {
            cachedScore['avScore'] = EventOccurrenceProcessor.Availability.MBE_BUSY;
        }

        if ((cachedScore['avScore'] !== -1)) {
            var change = checkLastPresenceScore_(userId, cachedScore['avScore']);
            if (change === true) {
                cachedScore['created'] = Util.getCurrentTime();
                //FIXME: Save to ES
                saveToDb_(userId, cachedScore);

                var avScoreQueue = cacheManager_.getQueue(userId, NodeCacheModule.AV_SCORE_QUEUE);
                avScoreQueue.enqueue(cachedScore);
            }
        }
    };

    /**
     * Verifies if last availability score is not the same with the score that will be set.
     * (e.g. last score is 0.7. Then we do not have to change the presence)
     * @param userId
     * @returns {boolean}
     * @private
     */
    var checkLastPresenceScore_ = function(userId, newScore) {
        var avScoreQueue = cacheManager_.getQueue(userId, NodeCacheModule.AV_SCORE_QUEUE);
        var lastPresenceScore = avScoreQueue.getLastElement();

        if ((lastPresenceScore === undefined) || (lastPresenceScore === null)) {
            return true;
        } else {
            // Change the availability score if the current one is not the same with the one that
            // will be set or the person is in a meeting
            if ((lastPresenceScore['avScore'] !== newScore) &&
                (lastPresenceScore['avScore'] !== EventOccurrenceProcessor.LastScoreType.MEETING)) {
                        return true;
            }
        }

        return false;
    };

    /**
     * Saves events into database
     * @param data
     * @private
     */
    var saveToDb_ = function(userId, data) {
        var dbData = Util.cloneObject(data);
        dbData['userId'] = userId;

        var presence = new Presence();
        presence.setData(dbData);

        var presenceDAO = new PresenceDAO();
        presenceDAO.insert(presence, PresenceDAO.storeType.AV_SCORE);
    };
}

var instance_ = null;
EventOccurrenceProcessor.getInstance = function () {
    if (!instance_) {
        instance_ = new EventOccurrenceProcessor();
    }

    return instance_;
};

EventOccurrenceProcessor.Availability = {
    'AVAILABLE': 1,
    'MBE_AVAILABLE': 0.9,
    'MBE_BUSY': 0.8
}

EventOccurrenceProcessor.LastScoreType = {
    'MEETING': 0.2
}
