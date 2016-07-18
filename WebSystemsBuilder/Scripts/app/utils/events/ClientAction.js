Ext.define('WebSystemsBuilder.utils.events.ClientAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['ClientAction'],
    requires: [
        'WebSystemsBuilder.utils.mapping.ClientActionTypes'
    ],
    constructor: function (config) {
        this.callParent(arguments);
    },

    getControlID: function () {
        return this.getEventAction().ClientAction.ControlID;
    },
    getClientActionTypeID: function () {
        return this.getEventAction().ClientActionType.ClientActionTypeID;
    },

    executeAction: function (callback) {
        var _this = this;
        var controlID = _this.getControlID();
        var actionID = _this.getActionID();
        var clientActionTypeID = _this.getClientActionTypeID();
        var control = _this.getForm().getControlByID(controlID);
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

        if (callback) {
            callback();
        }
    }
});