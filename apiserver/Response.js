/**
 * -------------------------------
 * Node - hg.APIServer
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The class handles the http responses that leave the server
 */


/**
 * The constructor.
 */
module.exports = Response = function() {
    /**
     * Contains the response headers
     * @type {Object}
     */
    var headers_ = null;

    /**
     * The status of the response
     * @type {string}
     */
    var status_ = null;

    /**
     * Contains the response payload
     * @type {Object}
     */
    var payload_ = null;

    /**
     * Payload of the request
     * @type {Object}
     * @private
     */
    var requestPayload_ = null;

    /**
     * Returns all of the headers
     * @returns {Object}
     */
    this.getHeaders = function() {
        return headers_;
    };

    /**
     * Add headers to the request
     * @param {Object} headers
     */
    this.addHeaders = function(headers) {
        headers_ = headers;
    };

    /**
     * Returns the status of the response
     * @returns {Object}
     */
    this.getStatus = function() {
        return status_;
    };

    /**
     * Sets status of the response
     * @param {string} status
     */
    this.setStatus = function(status) {
        status_ = status;
    };

    /**
     * Returns payload
     * @returns {Object}
     */
    this.getPayload = function() {
        return payload_;
    };

    /**
     * FIXME: JSON.parse(payload) to avoid parsing every time?
     * Sets the payload. If payload is string, then try to set corresponding Object.
     * @param {string} payload
     */
    this.setPayload = function(payload) {
        try {
            payload_ = JSON.parse(payload);
        } catch(e) {
            payload_ = payload;
        }
    };

    /**
     * Returns the request for which the response must be returned
     * @returns {Object}
     */
    this.getRequestPayload = function() {
        return requestPayload_;
    };

    /**
     * Sets the request payload
     * @param {Object} payload
     */
    this.setRequestPayload = function(payload) {
        requestPayload_ = payload;
    };
};