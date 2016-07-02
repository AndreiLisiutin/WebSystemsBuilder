Ext.define('WebSystemsBuilder.utils.operands.BaseOperandHandler', {
    alternateClassName: ['BaseOperandHandler'],

    getOperandID: function() {
        throw 'BaseOperandFactory not implemented.';
    },

    getValue: function (handler) {
        throw 'BaseOperandFactory not implemented.';
    },
    setValue: function (handler) {
        throw 'BaseOperandFactory not implemented.';
    }
});