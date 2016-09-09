/**
 * -------------------------------
 * Node - hg.APIServer
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview
 */

/**
 * The iAPIResult interface
 * @interface
 */
module.exports = iAPIResult = function() {};

/**
 * Internally set the parameters of the result
 * @param parameteres parameteres to be set
 */
iAPIResult.prototype.setParameteres = function(parameteres) {};

/**
 * Gets the parameters from the result
 * @returns {object}
 */
iAPIResult.prototype.getAllParameteres = function() {};
