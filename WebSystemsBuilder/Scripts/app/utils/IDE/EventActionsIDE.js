Ext.define('WebSystemsBuilder.utils.IDE.EventActionsIDE', {
    singleton: true,
    alternateClassName: ['EventActionsIDE'],

//      ActionTypeID
//      EventAction
//        ActionID
//        ActionIDParent.
//        EventID
//      ChildActions List[EventActions]
    EventActions: [],

    init: function () {
        this.EventActions = [];
    },

    get: function () {
        return this.EventActions;
    },

    add: function (event) {
        this.EventActions.push(event);
    },

    clear: function () {
        this.EventActions = [];
    }
});