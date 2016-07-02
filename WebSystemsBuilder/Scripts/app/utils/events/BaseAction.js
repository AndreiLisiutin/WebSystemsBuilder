Ext.define('WebSystemsBuilder.utils.events.BaseAction', {
    alternateClassName: ['BaseAction'],
    requires: [
        'WebSystemsBuilder.utils.mapping.ActionTypes'
    ],

    _eventAction: null,
    _form: null,

    constructor: function (config) {
        var eventAction = config.eventAction;
        var form = config.form;

        this._eventAction = eventAction;
        this._form = form;
    },

    executeAction: function () {
    },

    statics: {
        createEvent: function (eventAction, form) {
            var actionTypeID = eventAction.ActionTypeID;
            var config = {
                eventAction:eventAction ,
                form:form
            };
            switch (actionTypeID) {
                case ActionTypes.Client:
                    return Ext.create('WebSystemsBuilder.utils.events.ClientAction', config);
                    break;
                case ActionTypes.OpenForm:
                    return Ext.create('WebSystemsBuilder.utils.events.OpenFormAction', config);
                    break;
                case ActionTypes.Predicate:
                    return Ext.create('WebSystemsBuilder.utils.events.PredicateAction', config);
                    break;
                case ActionTypes.Server:
                    return Ext.create('WebSystemsBuilder.utils.events.ServerAction', config);
                    break;
                case ActionTypes.Query:
                    return Ext.create('WebSystemsBuilder.utils.events.QueryAction', config);
                    break;
                default:
                    throw 'Unknown event action type (ActionTypeID = ' + actionTypeID + ')'
                    break;
            }
        }
    }
});