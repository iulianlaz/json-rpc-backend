/**
 * -------------------------------
 * Node - hg.APIService.Presence
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class contains details about the presence of a person
 */

/**
 * The constructor.
 */
module.exports = Presence = function() {

    /**
     * The id of the person
     * @type {string}
     * @private
     */
    var personId_ = null;

    /**
     * The id of the agent that sends the information and is registered with the presence server
     * @type {string}
     * @private
     */
    var agentId_ = null;

    /**
     * The presence as set by user
     * @type {Object}
     * @private
     */
    var userRawStatus_ = null;

    /**
     * User status
     * @type {string}
     * @private
     */
    var userStatus_ = null;

    /**
     * The information about the device that send the information
     * @type {Object}
     * @private
     */
    var deviceState_ = null;

    /**
     * Last presence update
     * @type {Object}
     * @private
     */
    var lastUpdate_ = null;

    /**
     * The mood of the person
     * @type {Object}
     * @private
     */
    var userMood_ = null;

    /**
     * Gets person ID
     * @returns {string}
     */
    this.getPersonId = function() {
        return personId_;
    };

    /**
     * Sets person Id
     * @param {string} personId
     */
    this.setPersonId = function(personId) {
        personId_ = personId;
    };

    /**
     * Gets agent ID
     * @returns {string}
     */
    this.getAgentId = function() {
        return agentId_;
    };

    /**
     * Sets agent Id
     * @param {string} agentId
     */
    this.setAgentId = function(agentId) {
        agentId_ = agentId;
    };

    /**
     * Gets raw status
     * @returns {string}
     */
    this.getUserRawStatus = function() {
        return userRawStatus_;
    };

    /**
     * Sets raw status
     * @param {string} rawStatus
     */
    this.setUserRawStatus = function(userRawStatus) {
        userRawStatus_ = userRawStatus;
    };

    /**
     * Gets quick status
     * @returns {string}
     */
    this.getUserStatus = function() {
        return userStatus_;
    };

    /**
     * Sets quick status
     * @param {string} quickStatus
     */
    this.setUserStatus = function(userStatus) {
        userStatus_ = userStatus;
    };

    /**
     * Gets device state
     * @returns {string}
     */
    this.getDeviceState = function() {
        return deviceState_;
    };

    /**
     * Sets device state
     * @param {string} deviceState
     */
    this.setDeviceState = function(deviceState) {
        deviceState_ = deviceState;
    };

    /**
     * Gets last information updates
     * @returns {string}
     */
    this.getLastUpdate = function() {
        return lastUpdate_;
    };

    /**
     * Sets last information updates
     * @param {string} lastUpdate
     */
    this.setLastUpdate = function(lastUpdate) {
        lastUpdate_ = lastUpdate;
    };

    /**
     * Gets user mood
     * @returns {string}
     */
    this.getUserMood = function() {
        return userMood_;
    };

    /**
     * Sets user mood
     * @param {string} mood
     */
    this.setUserMood = function(userMood) {
        userMood_ = userMood;
    };


    /**
     * FIXME: Deprecated
     * Keeps all information about presence for a person
     * @type {Object}
     * @private
     */
    var data_ = {};

    /**
     * Returns all information about presence
     * @returns {Object}
     */
    this.getData = function() {
        return data_;
    };

    /**
     * Sets information about presence
     * @param {Object} data Information about presence
     */
    this.setData = function(data) {
        data_ = data;
    };
};