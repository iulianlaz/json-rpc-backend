/**
 * -------------------------------
 * Node - hg.Core.Util
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Queue implementation with size limit
 */

/**
 * FIXME: An Iterator would be nice
 * The constructor.
 */
module.exports = ExtendedQueue = function() {

    /**
     * Size of the queue
     * @type {number}
     * @private
     */
    var queueSize_ = ExtendedQueue.DEFAULT_SIZE;

    /**
     * Queue data
     * @type {Array}
     * @private
     */
    var data_ = [];

    /**
     * Verifies if queue is empty
     * @returns {boolean}
     */
    this.isEmpty = function() {
        return (data_.length === 0);
    };

    /**
     * Add element to the end of the queue
     * @param element Element to be added
     * @return {boolean}
     */
    this.enqueue = function(element) {
        if (data_.length === queueSize_) {
            data_.shift();
        }
         data_.push(element);

        return true;
    };

    /**
     * Removes the first element of the queue, and returns that element
     * @returns {*}
     */
    this.dequeue = function() {
        return data_.shift();
    };

    /**
     * Returns first element of the queue
     * @returns {Object}
     */
    this.peek = function() {
        if (data_.length !== 0) {
            return data_[0];
        }

        return null;
    };

    /**
     * Clear all data from queue
     * @return {boolean} true
     */
    this.clear = function() {
        data_ = [];

        return true;
    };

    /**
     * Gets an element from specified index
     * @param index
     * @returns {Object}
     */
    this.getElementAt = function(index) {
        if ((index >= 0) && (index < queueSize_)) {
            return data_[index];
        }

        return null;
    };

    /**
     * Get last element of the queue
     * @returns {Object}
     */
    this.getLastElement = function() {
        var length = data_.length;
        if (length !== 0) {
            return data_[length-1];
        }

        return null;
    };

    /**
     * Gets last N elements
     * @param numberOfElements Number of elements that should be returned
     * @returns {*}
     */
    this.getLastElements= function(numberOfElements) {
        var length = data_.length;
        if (length >= numberOfElements) {
            return data_.slice(length - numberOfElements);
        }

        return null;
    };

    /**
     * Gets first N elements
     * @param numberOfElements Number of elements that should be returned
     * @returns {Object}
     */
    this.getFirstElements = function(numberOfElements) {
        var length = data_.length;
        if (length >= numberOfElements) {
            return data_.slice(0, numberOfElements);
        }

        return null;
    };

    /**
     * Gets all elements from queue
     * @returns {Array}
     */
    this.getAllElements = function() {
        return data_;
    };

    /**
     * Gets queue's size
     * @returns {number}
     */
    this.getQueueSize = function() {
        return queueSize_;
    };

    /**
     * Sets queue's size
     * @param size New size of the queue
     */
    this.setQueueSize = function(size) {
        queueSize_ = size;

        return true;
    };

    this.getQueueLength = function() {
        return data_.length;
    };
}



/**
 * Default size of the queue
 * @type {number}
 */
ExtendedQueue.DEFAULT_SIZE = 10;