Ext.define('WebSystemsBuilder.utils.operands.BaseOperandHandler', {
    alternateClassName: ['BaseOperandHandler'],

    isOperand: function() {
        throw 'BaseOperandFactory not implemented.';
    },
    getOperandID: function() {
        throw 'BaseOperandFactory not implemented.';
    },
    getValue: function () {
        throw 'BaseOperandFactory not implemented.';
    },
    getValueTypeID: function () {
        throw 'BaseOperandFactory not implemented.';
    },
    setValue: function (value) {
        throw 'BaseOperandFactory not implemented.';
    },
    setValueArray: function (arrayValue) {
        throw 'BaseOperandFactory not implemented.';
    }
});