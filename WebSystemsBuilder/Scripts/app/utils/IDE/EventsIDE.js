Ext.define('WebSystemsBuilder.utils.IDE.EventsIDE', {
    singleton: true,
    alternateClassName: ['EventsIDE'],

//    EventInstance
//      Event
//        EventID
//        EventTypeControlTypeID
//        ControlID
//        EventUniqueID
//        ControlUniqueID
//      EventType
//        EventTypeID
//        Name
//      EventTypeControlType
//        EventTypeControlTypeID
//        EventTypeID
//        ControlTypeID
//    EventActions List[EventActions]
//       'UniqueID',
//       'ActionTypeID',
//       'EventActionType',
//       'ChildActions',
//       // ClientAction
//       'Control',
//       'ActionType',
//       // OpenFormAction
//       'Form',
//       'FormParameters',
//       // QueryAction
//       'QueryType',
//       'QueryTypeColumnList',
//       'QueryTypeTableList',
//       'QueryTypeInList',
//       'QueryTypeOutList',
//       // PredicateAction
//       'TrueActionUniqueID',
//       'FalseActionUniqueID',
//       'TrueAction',
//       'FalseAction'
    Events: null,

    init: function () {
        this.Events = [];
    },

    getEventsByControlUniqueID: function (controlUniqueID) {
        var list = [];
        this.Events.forEach(function (currentEvent) {
            if (currentEvent.Event.ControlUniqueID == controlUniqueID) {
                list.push(currentEvent);
            }
        });
        return list;
    },
    getEventsWithActionByControlUniqueID: function (controlUniqueID) {
        var events = this.getEventsByControlUniqueID(controlUniqueID);
        var list = [];
        events.forEach(function (currentEvent) {
            if (currentEvent.EventActions && currentEvent.EventActions.length > 0) {
                list.push(currentEvent);
            }
        });
        return list;
    },
    getEventByUniqueID: function (uniqueID) {
        var foundEvent = null;

        if (this.Events.length > 0) {
            this.Events.forEach(function (currentEvent) {
                if (currentEvent.Event.EventUniqueID == uniqueID) {
                    foundEvent = currentEvent;
                }
            });
        }

        return foundEvent;
    },
    addEvent: function (event) {
        this.Events.push(event);
    },
    deleteEvent: function (uniqueID) {
        var foundEvent = this.getEventByUniqueID(uniqueID);
        if (foundEvent) {
            Ext.Array.remove(this.Events, foundEvent);
        } else {
            console.error('EventsIDE.deleteEvent: can\'t find event [uniqueID="' + uniqueID + '"]');
        }
    },

    getEventActionByUniqueID: function (uniqueID) {
        var foundEventAction = null;

        if (this.Events.length > 0) {
            this.Events.forEach(function (currentEvent) {
                if (currentEvent.EventActions && currentEvent.EventActions.length > 0) {
                    currentEvent.EventActions.forEach(function (eventAction) {
                        if (eventAction.UniqueID == uniqueID) {
                            foundEventAction = eventAction;
                        }
                    });
                }
            });
        }

        return foundEventAction;
    },
    addEventAction: function (eventAction) {
        var event = this.getEventByUniqueID(eventAction.EventUniqueID);
        if (!event) {
            console.error('EventsIDE.addEventAction: can\'t find event [EventUniqueID="' + eventAction.EventUniqueID + '"]');
        }
        if (!event.EventActions) {
            event.EventActions = [];
        }
        event.EventActions.push(eventAction);
    },
    deleteEventAction: function (eventActionUniqueID) {
        var eventAction = this.getEventActionByUniqueID(eventActionUniqueID);
        var event = this.getEventByUniqueID(eventAction.EventUniqueID);
        if (!eventAction) {
            console.error('EventsIDE.deleteEventAction: can\'t find event action [UniqueID="' + eventActionUniqueID + '"]');
        }
        if (!event) {
            console.error('EventsIDE.deleteEventAction: can\'t find event [UniqueID="' + eventAction.EventUniqueID + '"]');
        }
        Ext.Array.remove(event.EventActions, eventAction);
    },


    clear: function () {
        this.Events = [];
    }
});