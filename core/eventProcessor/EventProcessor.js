/**
 * --------------------------------------------
 * Node - hg.Core.EventProcessor
 * --------------------------------------------
 * Copyright (c) $DateTime: 2014/5/10 13:11:17 $ iulianl
 *
 * @author iulianl
 * @fileoverview EventProcessor class
 */

var util = require('util');
var EventEmitter = require('events').EventEmitter;
var NodeCacheModule = require('core/cache/NodeCacheModule');
var EventClassProcessor = require('core/eventProcessor/EventClassProcessor');
var EventOccurrenceProcessor = require('core/eventProcessor/EventOccurrenceProcessor');

/**
 * The constructor.
 * @extends EventEmitter class
 */
module.exports = EventProcessor = function() {
    var self = this;

    /**
     * Verifies if the event is ready to be processed (is added to cache)
     */
    this.on('checkProcessEvent', function(userId, event) {
        var boundProcessEvent = checkProcessEvent_.bind(self, userId, event);
        //var aux = function(event, processEvent_) {
        //    return function() { processEvent_(event)};
        //};
        //var boundProcessEvent = aux(event, processEvent_);

        // Event processing is async
        process.nextTick(boundProcessEvent);
    });

    /**
     * If a "processEvent" was emitted, then process the event
     */
    this.on('processEvents', function() {
        var boundProcessEventClass = processEventClass_.bind(self);
        process.nextTick(boundProcessEventClass);

        var boundProcessEventOccurrence = processEventOccurrence_.bind(self);
        process.nextTick(boundProcessEventOccurrence);
    });

    /**
     * Verifies if an event should be processed or not.
     * @param userId
     * @param event
     * @private
     */
    var checkProcessEvent_ = function(userId, event) {
            if (event['class'] === EventProcessor.eventClass['EVENT']) {
              var processor = new EventClassProcessor();
              processor.checkProcessEventClass(userId, event['content']);
            };
    };

    /**
     * Process EVENT class type events
     * @private
     */
    var processEventClass_ = function() {
        var processor = new EventClassProcessor.getInstance();
        processor.processEventClass();
    };

    /**
     * Process event based on their speed of appearence
     * @private
     */
    var processEventOccurrence_ = function() {
        var processor = new EventOccurrenceProcessor.getInstance();
        processor.processEvent();
    };
};

/**
 * Extends EventEmitter class
 */
util.inherits(EventProcessor, EventEmitter);

EventProcessor.prototype.sendEventForProcessing = function(userId, event) {
    this.emit('checkProcessEvent', userId, event);
}

EventProcessor.prototype.processEvents = function() {
    this.emit('processEvents');
}

var instance_ = null;
EventProcessor.getInstance = function () {
    if (!instance_) {
        instance_ = new EventProcessor();
    }

    return instance_;
};

/**
 * Availability scores
 */
EventProcessor.Availability = {
    'AVAILABLE': 1,
    'BUSY': 0.5,
    'DND': 0.3,
    'MEETING': 0.2,
    'RUNNING': 0.6,
    'ONCALL': 0.2,
    'DRIVING': 0.4,
    'SLEEPING': 0.1,
    'OFFLINE': 0
};

/**
 * Device status availability
 */
EventProcessor.DeviceStatus = {
    'AVAILABLE': 1,
    'IDLE': 0.1,
    'OFFLINE': 0
};

//FIXME: change eventClass to EventClass
EventProcessor.eventClass = {
    'ACTIVITY': 'ACTIVITY',
    'EVENT': 'EVENT',
    'STATUS': 'STATUS'
};



