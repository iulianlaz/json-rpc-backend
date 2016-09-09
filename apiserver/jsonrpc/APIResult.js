/**
 * -------------------------------
 * Node - hg.APIServer.JSONRPC
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview The class is a protocol independent class that can be passed to the classes
 * that encode the result and pass it to the client
 */

/**
 * The constructor
 * @type {APICall}
 * @implements {hg.APIServer.iAPIResult}
 */
module.exports = APIResult = function() {
    var result_ = null;

    /**
     * @inheritDoc
     */
    this.getAllParameteres = function() {
        return result_;
    };

    /**
     * @inheritDoc
     */
    this.setParameteres = function(parameteres) {
        result_ = parameteres;
    };
};