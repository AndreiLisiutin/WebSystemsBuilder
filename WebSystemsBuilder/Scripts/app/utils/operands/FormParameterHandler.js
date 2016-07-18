Ext.define('WebSystemsBuilder.utils.operands.FormParameterHandler', {
    extend: 'WebSystemsBuilder.utils.operands.BaseOperandHandler',
    alternateClassName: ['FormParameterHandler'],
    requires: [
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],
    _value: null,
    _parameterInstance: null,
    generateParameter: function (parameterInstance, value) {
        this._parameterInstance = parameterInstance;
        this._value = ValueTypes.getValueFromString(value, parameterInstance.PropertyValueType.ValueTypeID);
        return this;
    },
    //----------------------------------OPERAND-------------------------------------------------------------------------

    isOperand: function () {
        return true;
    },
    getOperandID: function () {
        return this._parameterInstance.FormParameter.OperandID;
    },
    getValueTypeID: function () {
        return this._parameterInstance.FormParameter.ValueTypeID;
    },
    getValue: function () {
        return this._value;
    },
    setValue: function (value) {
        return this._value = value;
    },
    setValueArray: function (arrayValue) {
        return this.setValue(!arrayValue || arrayValue.length == 0 ? null : arrayValue[0]);
    }
});