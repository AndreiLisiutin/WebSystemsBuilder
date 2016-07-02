Ext.define('WebSystemsBuilder.utils.operands.FormParameterHandler', {
    extend: 'WebSystemsBuilder.utils.operands.BaseOperandHandler',
    alternateClassName: ['FormParameterHandler'],
    requires:[
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],
    _value: null,
    _parameterInstance: null,
    generateParameter: function (parameterInstance, value) {
        this._parameterInstance = parameterInstance;
        this._value = ValueTypes.getValueFromString(value, parameterInstance.PropertyValueType.ValueTypeID);
    },
    //----------------------------------OPERAND-------------------------------------------------------------------------

    getOperandID: function() {
        return this._parameterInstance.FormParameter.OperandID;
    },
    getValueTypeID: function () {
        return this._parameterInstance.FormParameter.ValueTypeID;
    },
    getValue: function () {
        return this.value;
    },
    setValue: function (value) {
        return this.value = value;
    }
});