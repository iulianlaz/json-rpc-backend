/**
 * -------------------------------
 * Node - hg.Core.Cache
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Queue manager class. Creates new queues for a particular user if do not exist
 */

var NodeCacheModule = require('core/cache/NodeCacheModule');

/**
 * The constructor.
 */
module.exports = CacheManager = function() {
    /**
     * Keeps information about queues for each user:
     *  - Availability score queue
     *  - Location queue
     *  - Mood queue
     *  - Events queue
     * @type {Object}
     * @private
     */
    var cache_ = {};

    /**
     * Returns all information from cache
     * @returns {Object}
     */
    this.getCache = function() {
        return cache_;
    };

    /**
     * Gets all information from cache for a user
     * FIXME: Check user existance
     * @param userId
     * @returns {NodeCacheModule}
     */
    this.getCacheForUser = function(userId) {
        checkUserCache_(userId);
        return cache_[userId];
    };

    /**
     * Gets explicit status
     * @param userId
     * @returns {*}
     */
    this.getExplicitStatusCache = function(userId) {
        checkUserCache_(userId);
        return cache_[userId].getExplicitStatusCache();
    };

    /**
     * Sets explicit status
     * @param userId
     * @param newStatus
     */
    this.setExplicitStatusCache = function(userId, newStatus) {
        checkUserCache_(userId);
        cache_[userId].setExplicitStatusCache(newStatus);
    }

    /**
     * Gets a list with all attending events
     * @param userId
     * @returns {*}
     */
    this.getAttendingEventsCacheForUser = function(userId) {
        checkUserCache_(userId);
        return cache_[userId].getAttendingEventsCache();
    }

    /**
     * Sets an event to the list
     * @param userId
     * @param newAttendingEvent
     */
    this.setAttendingEventsCache = function(userId, newAttendingEvent) {
        checkUserCache_(userId);
        cache_[userId].setAttendingEventsCache(newAttendingEvent);
    }

    /**
     * Gets queue for a specific user
     * @param userId
     * @param queueName
     * @returns {*|ExtendedQueue}
     */
    this.getQueue = function(userId, queueName) {
        checkUserCache_(userId);
        return cache_[userId].getQueue(queueName);
    };

    /**
     *
     * @param userId
     */
    this.clearUserQueues = function(userId) {
        checkUserCache_(userId);
        return cache_[userId].clearAllQueues();
    };

    /**
     * Clears a user queue
     * @param queueName
     */
    this.clearUserQueue = function(userId, queueName) {
        checkUserCache_(userId);
        cache_[userId].clearQueue(queueName);
    };

    /**
     * Checks if a user has cache module activated (instantiated)
     * @param userId
     * @private
     */
    var checkUserCache_ = function(userId) {
        if (cache_[userId] === undefined) {
            cache_[userId] = new NodeCacheModule(userId);
        }
    };

};

var instance_ = null;
CacheManager.getInstance = function () {
    if (!instance_) {
        instance_ = new CacheManager();
    }

    return instance_;
};