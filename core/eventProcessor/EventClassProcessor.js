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
var NodeCacheModule = require('core/cache/NodeCacheModule');
var Presence = require('apiservice/presence/resource/Presence');
var PresenceDAO = require('apiservice/presence/datasource/PresenceDAO');
var CacheManager = require('core/cache/CacheManager');

/**
 * The constructor.
 */
module.exports = EventClassProcessor = function() {

    /**
     * Instance of CacheManager
     * @type {*}
     * @private
     */
    var cacheManager_ = CacheManager.getInstance();

    /**
     * Verifies if an event should be processed or not. If the event must be processed, it will
     * be added to attendingEventsCache list
     * @param userId
     * @param event
     */
    this.checkProcessEventClass = function(userId, event) {
        console.log('\n############################ EVENT #######################');
        var updated = updateCacheEvent_(userId, event);

        if (updated === false) {
            if (event['attendingStatus'] === EventClassProcessor.attendingStatus['ATTENDING']) {
                if ((event['startTime'] !== undefined) && (event['endTime'] !== undefined)) {
                    var currentTime = Util.getCurrentTime();
                    var startTime = Util.getTime(event['startTime']);
                    var endTime = Util.getTime(event['endTime']);

                    console.log(startTime + ' ' + currentTime + ' ' + endTime);

                    if (currentTime < endTime){
                        //FIXME: Save to ES
                        console.log('>>>>>>>>>>>> Event added...');
                        cacheManager_.setAttendingEventsCache(userId, event);
                    }
                }
            }
        }
    };

    /**
     * Process events which have EVENT class type
     */
    this.processEventClass = function() {
        console.log('\n################ PROCESSING EVENT CLASS... ###################');
        var cache = cacheManager_.getCache();
        for (var userId in cache) {
            //console.log('>>>>>>>> internal processing...' + userId);
            if (cache.hasOwnProperty(userId)) {
                console.log('>>>>>>>> Internal processing...');
                var testScore = cache[userId].getQueue(NodeCacheModule.AV_SCORE_QUEUE);
                console.log('>>>>>>>> ---------- AvScore Queue: ----------');
                console.log(testScore.getAllElements());
                var attendingEvents = cache[userId].getAttendingEventsCache().getAllElements();
                console.log('>>>>>>>> ---------- Attending Events Queue: ----------');
                console.log(attendingEvents);
                internalProcessEventClass_(userId, attendingEvents);
            }
        }
    };

    /**
     * Process events which have EVENT class type
     * @param userId
     * @param attendingEvents
     * @private
     */
    var internalProcessEventClass_ = function(userId, attendingEvents) {
        for (var eventIndex in attendingEvents) {
            if (attendingEvents.hasOwnProperty(eventIndex)) {

                if (attendingEvents[eventIndex]['attendingStatus'] === EventClassProcessor.attendingStatus['ATTENDING']) {
                    var currentTime = Util.getCurrentTime();
                    var startTime = Util.getTime(attendingEvents[eventIndex]['startTime']);
                    var endTime = Util.getTime(attendingEvents[eventIndex]['endTime']);
                    console.log('START: ' + startTime + ' CURRENT: ' + currentTime + ' END: ' + endTime);
                    console.log('>>>>>>>> Waiting for meeting...');
                    if ((currentTime > startTime) && (currentTime < endTime)) {
                        console.log('>>>>>>>> Now in a meeting...');
                        var change = checkLastPresenceScore_(userId);
                        if (change === true) {
                            //FIXME: Check event location
                            console.log('>>>>>>>> Save new presence...');
                            saveNewPresence_(userId, EventClassProcessor.Availability.DND);
                        }

                    } else {
                        if (currentTime > endTime) {
                            // Event must be removed from list
                            // FIXME: Remove from ES
                            attendingEvents.splice(eventIndex, 1);
                            saveNewPresence_(userId, EventClassProcessor.Availability.MBE_AVAILABLE);
                        }
                    }
                // If attending status has been updated (e.g. maybe, not going), then remove event
                } else {
                    attendingEvents.splice(eventIndex, 1);
                }
            }
        }
    };

    /**
     * Verifies if last availability score is not the same with the score that will be set.
     * (e.g. last score is 0.2 and action is MEETING. Then we do not have to change the presence)
     * @param userId
     * @returns {boolean}
     * @private
     */
    var checkLastPresenceScore_ = function(userId) {
        var avScoreQueue = cacheManager_.getQueue(userId, NodeCacheModule.AV_SCORE_QUEUE);
        var lastPresenceScore = avScoreQueue.getLastElement();
        if ((lastPresenceScore === undefined) || (lastPresenceScore === null)) {
            return true;
        } else {
            // If last presence is already set to 0.2 (MEETING), check the action. If the action is
            // different than "MEETING", then the presence must be changed
            if (lastPresenceScore['avScore'] === EventClassProcessor.Availability.DND) {
                if (lastPresenceScore['action'] !== undefined) {
                    if (lastPresenceScore['action'] !== EventClassProcessor.actionType['MEETING']) {
                            return true;
                    }
                }
            // If last presence is different than MEETING, then change presence.
            } else {
                return true;
            }
        }
        return false;
    };

    /**
     * Saves new availability score in cache and db
     * @param userId
     * @param availability
     * @private
     */
    var saveNewPresence_ = function(userId, availability) {
        var avScoreQueue = cacheManager_.getQueue(userId, NodeCacheModule.AV_SCORE_QUEUE);
        var newScore = {};

        switch (availability) {
            case EventClassProcessor.Availability.DND:
                newScore['avScore'] = EventClassProcessor.Availability.DND;
                newScore['action'] = EventClassProcessor.actionType.MEETING;
                newScore['created'] = Util.getCurrentTime();
                break;
            case EventClassProcessor.Availability.MBE_AVAILABLE:
                newScore['avScore'] = EventClassProcessor.Availability.MBE_AVAILABLE;
                newScore['created'] = Util.getCurrentTime();
                break;
        }

        saveToDb_(userId, newScore);
        avScoreQueue.enqueue(newScore);
    }

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

    /**
     * Updates the event from cache if it already exists here
     * @param userId
     * @param event
     * @returns {boolean}
     * @private
     */
    var updateCacheEvent_ = function(userId, event) {
        if (event['eventId'] === undefined) {
            //throw exception
            return false;
        }
        console.log('>>>>>>>>>>>> Event is already in cache?');
        var attendingEvents = cacheManager_.getAttendingEventsCacheForUser(userId);
        var allEvents = attendingEvents.getAllElements();
        for (var eventIndex in allEvents) {
            if (allEvents.hasOwnProperty(eventIndex)) {
                if (allEvents[eventIndex]['eventId'] === event['eventId']) {
                    //FIXME: Update event from ES
                    console.log('>>>>>>>>>>>> Event updated...');
                    allEvents[eventIndex] = event;
                    return true;
                }
            }
        }

        return false;
    };

};

var instance_ = null;
EventClassProcessor.getInstance = function () {
    if (!instance_) {
        instance_ = new EventClassProcessor();
    }

    return instance_;
};

/**
 * Attending status for a user:
 *  - ATTENDING - user is going to an event
 *  - MAYBE - it is possible to go to an event
 *  - NOT GOING - user is not going to an event
 * @type {Object}
 */
EventClassProcessor.attendingStatus = {
    'ATTENDING': 'ATTENDING',
    'MAYBE': 'MAYBE',
    'NOT_GOING': 'NOT GOING'
}

EventClassProcessor.actionType = {
    'MEETING': 'MEETING'
}

EventClassProcessor.Availability = {
    'MBE_AVAILABLE': 0.9,
    'DND': 0.2
}