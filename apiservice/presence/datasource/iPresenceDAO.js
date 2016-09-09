/**
 * -------------------------------
 * Node - hg.APIService.Presence
 * -------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview Presence data access object class. This class is used to create or read presence of people
 */

/**
 * The iPresence interface
 * @interface
 */
module.exports = iPresence = function() {};

/**
 * Adds information about events that will change user's presence
 */
iPresence.prototype.insert = function() {};

/***
 * Fetches all events that could change user's presence
 */
iPresence.prototype.find = function() {};


