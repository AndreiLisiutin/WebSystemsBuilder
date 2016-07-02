Ext.define('WebSystemsBuilder.utils.operands.BaseOperandHandler', {
    alternateClassName: ['BaseOperandHandler'],

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
    }
});