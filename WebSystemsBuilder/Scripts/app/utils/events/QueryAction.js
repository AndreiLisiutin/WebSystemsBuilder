Ext.define('WebSystemsBuilder.utils.events.QueryAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['QueryAction'],
    requires: [
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],
    _eventAction: null,
    _form: null,
    constructor: function (eventAction, form) {
        this._eventAction = eventAction;
        this._form = form;
        this.callParent(arguments);
    },

    getActionID: function () {
        return this._eventAction.EventAction.ActionID;
    },

    getInParameters: function () {
        var _this = this;
        var inValues = {};
        $.each(_this._eventAction.QueryActionIns, function (index, item) {
            var queryActionInID = item.QueryActionIn.QueryActionIn.QueryActionInID;
            var operandID = item.QueryActionIn.QueryActionIn.OperandIDValue;
            var valueTypeID = item.QueryActionIn.QueryTypeIn.ValueType.ValueTypeID;

            var operand = _this._form.getOperandByID(operandID);
            if (!operand) {
                throw 'Operand for query action in not found (OperandID = ' + operandID +
                ', QueryActionIn = ' + queryActionInID + ')';
            }

            if (valueTypeID != operand.getValueTypeID()) {
                throw 'Operand for query action in has incorrect value type (OperandID = ' + operandID +
                ', QueryActionIn = ' + queryActionInID + ')';
            }

            inValues[queryActionInID] = WebSystemsBuilder.utils.mapping.ValueTypes
                .getStringFromValue(operand.getValue(), valueTypeID);
        });
        return inValues;
    },

    getParts: function () {
        var _this = this;
        var partValues = {};
        $.each(_this._eventAction.QueryActionParts, function (index, item) {
            var queryActionPartID = item.QueryActionPart.QueryActionPartID;
            var operandID = item.QueryActionPartID.OperandIDValue;
            var valueTypeID = ValueTypes.Bool;

            var operand = _this._form.getOperandByID(operandID);
            if (!operand) {
                throw 'Operand for query action part not found (OperandID = ' + operandID +
                ', QueryActionIn = ' + queryActionPartID + ')';
            }

            if (valueTypeID != operand.getValueTypeID()) {
                throw 'Operand for query action part has incorrect value type (OperandID = ' + operandID +
                ', QueryActionIn = ' + queryActionPartID + ')';
            }

            partValues[queryActionPartID] = WebSystemsBuilder.utils.mapping.ValueTypes
                .getStringFromValue(operand.getValue(), valueTypeID);
        });
        return partValues;
    },

    executeAction: function () {
        var _this = this;
        var actionID = _this.getActionID();
        var actionInParameters = _this.getInParameters();
        var actionParts = _this.getParts();

        var postData = {
            actionID: actionID,
            actionInParameters: [],
            actionParts: []
        };
        for (var key in actionInParameters) {
            postData.actionInParameters.push({
                Key: key,
                Value: actionInParameters[key]
            });
        }
        for (var key in actionParts) {
            postData.actionParts.push({
                Key: key,
                Value: actionParts[key]
            });
        }

        Ext.Ajax.request({
            url: 'Query/ExecuteQueryAction',
            async: false,
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
            params: postData,
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {

                } else {
                    WebSystemsBuilder.utils.MessageBox.error(jsonResp.resultMessage);
                }
            },
            failure: function (objServerResponse) {
                WebSystemsBuilder.utils.MessageBox.error(objServerResponse.responseText);
            }
        });
    }

});