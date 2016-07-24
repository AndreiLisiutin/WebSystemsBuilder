Ext.define('WebSystemsBuilder.utils.events.QueryAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['QueryAction'],
    requires: [
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],
    constructor: function (config) {
        this.callParent(arguments);
    },

    getFormID: function () {
        return this.getForm().getFormID();
    },

    getInParameters: function () {
        var _this = this;
        var inValues = {};
        $.each(_this.getEventAction().QueryActionIns, function (index, item) {
            var queryActionInID = item.QueryActionIn.QueryActionInID;
            var operandID = item.QueryActionIn.OperandIDValue;
            var valueTypeID = item.QueryTypeIn.ValueType.ValueTypeID;

            var operand = _this.getForm().getOperandByID(operandID);
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
        $.each(_this.getEventAction().QueryActionParts, function (index, item) {
            var queryActionPartID = item.QueryActionPart.QueryActionPartID;
            var operandID = item.QueryActionPart.OperandIDValue;
            var valueTypeID = ValueTypes.Bool;

            var operand = _this.getForm().getOperandByID(operandID);
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

    setOperandValues: function (operandValues) {
        var _this = this;
        if (!operandValues) {
            return;
        }
        $.each(operandValues, function (index, item) {
            var serializedArray = item.Value;
            var valueTypeID = item.ValueType.ValueTypeID;
            var deserializedArray = [];
            var operand = _this.getForm().getOperandByID(item.OperandID);
            if (!operand) {
                throw 'Operand for query action part not found (OperandID = ' + item.OperandID + ')';
            }

            $.each(serializedArray, function (serializedIndex, serializedItem) {
                var deserializedValue = WebSystemsBuilder.utils.mapping.ValueTypes
                    .getValueFromString(serializedItem, valueTypeID);
                deserializedArray.push(deserializedValue);
            });

            operand.setValueArray(deserializedArray);
        });
    },

    getOperandsScope: function () {
        var _this = this;
        var operandValues = {};
        $.each(_this.getForm().getOperands(), function (index, item) {
            var operandID = item.getOperandID();
            var valueTypeID = item.getValueTypeID();
            var value = item.getValue();

            operandValues[operandID] = WebSystemsBuilder.utils.mapping.ValueTypes
                .getStringFromValue(value, valueTypeID);
        });
        return operandValues;
    },

    /**
     * Execute query action
     * @param callback
     */
    executeAction: function (callback) {
        var _this = this;
        var actionID = _this.getActionID();
        var formID = _this.getFormID();
        //get list of {operand_id, serialized value} pairs
        var operandsScope = _this.getOperandsScope();

        var postData = {
            formID: formID,
            actionID: actionID,
            operandID_Value: []
        };

        //format parameters as C# Dictionary<> object
        for (var operandID in operandsScope) {
            postData.operandID_Value.push({
                Key: operandID,
                Value: operandsScope[operandID]
            });
        }

        //call server side to execute query
        Ext.Ajax.request({
            url: 'Query/ExecuteQueryAction',
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            jsonData: postData,
            success: function (objServerResponse) {
                var jsonResp = Ext.decode(objServerResponse.responseText);
                if (jsonResp.Code == 0) {
                    var data = jsonResp.Data;
                    if (data.OperandValues) {
                        //set values ин operand_id's back
                        _this.setOperandValues(data.OperandValues);
                    }

                    if (callback) {
                        callback();
                    }
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