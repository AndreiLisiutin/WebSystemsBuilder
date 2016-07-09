Ext.define('WebSystemsBuilder.utils.IDE.EventsIDE', {
    singleton: true,
    alternateClassName: ['EventsIDE'],

//    EventInstance
//      Event
//        EventID
//        EventTypeControlTypeID
//        ControlID
//      EventType
//        EventTypeID
//        Name
//      EventTypeControlType
//        EventTypeControlTypeID
//        EventTypeID
//        ControlTypeID
//    EventActions List[EventActions]
//      ActionTypeID
//      EventAction
//        ActionID
//        ActionIDParent
//        EventID
//      ChildActions List[EventActions]
    Events: null,

    init: function () {
        this.Events = [];
    },

    get: function () {
        return this.Events;
    },

    add: function (event) {
        this.Events.push(event);
    },

    clear: function () {
        this.Events = [];
    }
});