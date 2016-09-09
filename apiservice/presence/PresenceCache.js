/**
 * -------------------------------
 * Node - hg.Core.Cache
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Queue manager class. Creates new queues for a particular user if do not exist
 */

var CacheManager = require('core/cache/CacheManager');

/**
 * The constructor.
 */
module.exports = PresenceCache = function(userId) {

    /**
     * Id of the user
     * @type {*}
     * @private
     */
    var userId_ = userId;

    /**
     * Instance of CacheManager
     * @type {*}
     * @private
     */
    var cacheManager_ = CacheManager.getInstance();

    this.getExplicitStatus = function() {
        return cacheManager_.getExplicitStatusCache(userId_);
    }

    /**
     * Sets the explicit status
     * @param newStatus
     */
    this.setExplicitStatus = function(newStatus) {
        cacheManager_.setExplicitStatusCache(userId_, newStatus);
    };

    /**
     * Add location information to queue
     * @param locationInfo
     * @returns {boolean}
     */
    this.addLocation = function(locationInfo) {
        var queue = cacheManager_.getQueue(userId_, NodeCacheModule.LOCATION_QUEUE);
        queue.enqueue(locationInfo);
        return true;
    };

    /**
     * Add mood information to queue
     * @param moodInfo
     * @returns {boolean}
     */
    this.addMood = function(moodInfo) {
        var queue = cacheManager_.getQueue(userId_, NodeCacheModule.MOOD_QUEUE);
        queue.enqueue(moodInfo);
        return true;
    };

    /**
     * Add availability score information to queue
     * @param avScoreInfo
     * @returns {boolean}
     */
    this.addAvScoreInfo = function(avScoreInfo) {
        var queue = cacheManager_.getQueue(userId_, NodeCacheModule.AV_SCORE_QUEUE);
        queue.enqueue(avScoreInfo);
        return true;
    };

    /**
     * Add event information to queue
     * @param eventInfo
     * @returns {boolean}
     */
    this.addEvent = function(eventInfo) {
        var queue = cacheManager_.getQueue(userId_, NodeCacheModule.EVENT_QUEUE);
        queue.enqueue(eventInfo);
        return true;
    };

    /**
     * Gets last information from a specific queue
     * @param queueName Name of the queue
     * @returns {Object}
     */
    this.getLastUpdateFromQueue = function(queueName) {
        var queue = cacheManager_.getQueue(userId_, queueName);
        return queue.getLastElement();
    };

    /**
     * Gets last N updates from a specific queue
     * @param queueName Name of the queue
     * @param numberOfUpdates Number of Updates returned
     */
    this.getLastUpdatesFromQueue = function (queueName, numberOfUpdates) {

    };

    /**
     * Get all elements from a specific queue
     * @param queueName
     */
    this.getAllFromQueue = function(queueName) {
        var queue = cacheManager_.getQueue(userId_, queueName);
        return queue.getAllElements();
    };
};