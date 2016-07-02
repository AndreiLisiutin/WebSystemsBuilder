Ext.define('WebSystemsBuilder.utils.events.ClientAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['ClientAction'],
    requires: [
        'WebSystemsBuilder.utils.mapping.ClientActionTypes'
    ],
    _eventAction: null,
    _form: null,

    constructor: function (eventAction, form) {
        this._eventAction = eventAction;
        this._form = form;
        this.callParent(arguments);
    },

    getControlID: function () {
        return this._eventAction.ClientAction.ControlID;
    },
    getActionID: function () {
        return this._eventAction.ClientAction.ActionID;
    },
    getClientActionTypeID: function () {
        return this._eventAction.ClientActionType.ClientActionTypeID;
    },

    executeAction: function () {
        var _this = this;
        var controlID = _this.getControlID();
        var actionID = _this.getActionID();
        var clientActionTypeID = _this.getClientActionTypeID();
        var control = _this._form.getControlByID(controlID);
        if (!control) {
            throw 'Control for client event action not found (ControlID = ' + controlID
            + ', ActionID = ' + actionID + ' )';
        }

        switch (clientActionTypeID) {
            case ClientActionTypes.Enable:
                control.executeEnable();
                break;
            case ClientActionTypes.Disable:
                control.executeDisable();
                break;
            case ClientActionTypes.SetReadOnly:
                control.executeSetReadOnly();
                break;
            case ClientActionTypes.SetNotReadOnly:
                control.executeSetNotReadOnly();
                break;
            default:
                throw 'Unknown client event action not found (ControlID = ' + controlID
                + ',ActionID = ' + actionID + ', ClientActionTypeID = ' + clientActionTypeID + ' )';
        }

        $.each(_this._eventAction.ChildActions, function(index, item) {
            var action =  WebSystemsBuilder.utils.events.BaseAction.createEvent(item, _this._form);
            action.executeAction();
        });
    }
});