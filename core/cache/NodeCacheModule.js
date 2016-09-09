/**
 * -------------------------------
 * Node - hg.Core.Cache
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Node Cache module
 */

var ExtendedQueue = require('core/util/ExtendedQueue');

/**
 * The constructor.
 */
module.exports = NodeCacheModule = function(userId) {

    /**
     * User id
     * @type {null}
     */
    var userId_ = userId;

    /**
     * Queues
     * @type {Object}
     */
    var queues_ = {};
    queues_[NodeCacheModule.LOCATION_QUEUE] = new ExtendedQueue();
    queues_[NodeCacheModule.MOOD_QUEUE] = new ExtendedQueue();
    queues_[NodeCacheModule.AV_SCORE_QUEUE] = new ExtendedQueue();
    queues_[NodeCacheModule.EVENT_QUEUE] = new ExtendedQueue();

    /**
     * Stores explicit presence for each user
     * @type {Object}
     */
    var explicitStatusCache_ = null;

    /**
     * Last location of the user based on locations from "location queue"
     * @type {{}}
     */
    var lastLocation_ = null;


    /**
     * Stores for each user the events where he is going
     * @type {Object}
     */
    var attendingEventsCache_ = new ExtendedQueue();

    /**
     * Gets explicit status
     * @param userId
     * @returns {*}
     */
    this.getExplicitStatusCache = function() {
        return explicitStatusCache_;
    };

    /**
     * Sets explicit status
     * @param userId
     * @param newStatus
     */
    this.setExplicitStatusCache = function(newStatus) {
        explicitStatusCache_ = newStatus;
    }

    /**
     * Gets last location
     * @param userId
     * @returns {*}
     */
    this.getLastLocation = function() {
        return lastLocation_;
    };

    /**
     * Sets last location
     * @param userId
     * @param newStatus
     */
    this.setLastLocation = function(lastLocation) {
        lastLocation_ = lastLocation;
    }

    /**
     * Gets a list with all attending events
     * @param userId
     * @returns {*}
     */
    this.getAttendingEventsCache = function() {
        return attendingEventsCache_;
    }

    /**
     * Sets an event to the list
     * @param userId
     * @param newAttendingEvent
     */
    this.setAttendingEventsCache = function(newAttendingEvent) {
        attendingEventsCache_.enqueue(newAttendingEvent);
    }

    /**
     * Gets userId
     * @returns {null}
     */
    this.getUserId = function() {
        return userId_;
    }

    /**
     * Gets a specific queue
     * @param queueName
     * @returns {ExtendedQueue}
     */
    this.getQueue = function(queueName) {
        if (queues_[queueName] !== undefined) {
            return queues_[queueName];
        }
    };

    /**
     * Creates a queue
     * @param queueName Name of the queue
     */
    this.createQueue = function(queueName) {
        if (queues_[queueName] === undefined) {
            queues_[queueName] = new ExtendedQueue();
        } else {
            //throw exception: queue already exists
        }
    };

    /**
     * Clears a specific queue
     * @param queueName
     */
    this.clearQueue = function(queueName) {
        if (queues_[queueName] !== undefined) {
            queues_[queueName].clear();
        }

        return true;
    };

    /**
     * Clears all queues
     */
    this.clearAllQueues = function() {
        for (var queue in queues_) {
            if (queues_.hasOwnProperty(queue)) {
                queues_[queue].clear();
            }
        }

        return true;
    };
};

NodeCacheModule.LOCATION_QUEUE = 'locationQueue';
NodeCacheModule.MOOD_QUEUE = 'moodQueue';
NodeCacheModule.AV_SCORE_QUEUE = 'avScoreQueue';
NodeCacheModule.EVENT_QUEUE = 'eventQueue';