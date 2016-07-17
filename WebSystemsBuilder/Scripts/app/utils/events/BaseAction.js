Ext.define('WebSystemsBuilder.utils.events.BaseAction', {
    alternateClassName: ['BaseAction'],
    mixins: {
        observable: 'Ext.util.Observable'
    },
    requires: [
        'WebSystemsBuilder.utils.mapping.ActionTypes'
    ],

    _eventAction: null,
    _form: null,
    _executedActions: [],
    _callback: null,
    constructor: function (config) {
        var eventAction = config.eventAction;
        var form = config.form;
        this._executedActions = [];
        this._eventAction = eventAction;
        this._form = form;
        this._callback = config.callback;
        this.mixins.observable.constructor.call(this, config);
    },

    executeAction: function () {
    },

    _isActionExecuted: function () {
        var _this = this;
        var isExecuted = true;
        $.each(_this._eventAction.ChildActions, function (index, item) {
            if (!_this._isChildActionExecuted(item.EventAction.ActionID)) {
                isExecuted = false;
            }
        });
        return isExecuted;
    },

    _isChildActionExecuted: function (actionID) {
        var _this = this;
        return _this._executedActions.indexOf(actionID) != -1;
    },

    _markActionAsExecuted: function (actionID) {
        var _this = this;
        if (_this._executedActions.indexOf(actionID) == -1) {
            _this._executedActions.push(actionID);
        }
    },

    _markAsExecutedAndCallCallback: function (actionID) {
        var _this = this;
        _this._markActionAsExecuted(actionID);
        _this._callCallback(actionID);
    },

    _callCallback: function () {
        var _this = this;
        if (_this._isActionExecuted() && _this._callback) {
            _this._callback();
            _this._callback = null;
        }
    },

    statics: {
        createEvent: function (eventAction, form) {
            var actionTypeID = eventAction.ActionTypeID;
            var config = {
                eventAction: eventAction,
                form: form
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
                    throw 'Unknown event action type (ActionTypeID = ' + actionTypeID + ')';
                    break;
            }
        }
    }
});