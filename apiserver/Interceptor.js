/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview This class handles the interceptors used to filter data
 */

/**
 * The constructor.
 * @implements {hg.APIServer.iInterceptor}
 */
module.exports = Interceptor = function() {

    /**
     * Interceptors that will be used to validate data
     * @type {Array}
     */
    var interceptors_ = [];

    /**
     * Returns the interceptors
     * @returns {Array}
     */
    this.getInterceptors = function() {
        return interceptors_;
    }

    /**
     * Validats and filters data
     * @data {string} data Data that must be filtered
     * @return New filtered data
     */
    this.intercept = function(data) {
        var interceptedData = data;
        var len = interceptors_.length;
        for(var index = 0; index < len; index++) {
            interceptedData = interceptors_[index].intercept(interceptedData);
        }
        return interceptedData;
    };

    /**
     * Add a new interceptor for data
     * @param interceptor Interceptor that filters the data
     */
    this.addInterceptor = function(interceptor) {
        interceptors_.push(interceptor);
    };
};