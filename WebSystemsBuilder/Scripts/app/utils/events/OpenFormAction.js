Ext.define('WebSystemsBuilder.utils.events.OpenFormAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['OpenFormAction'],
    requires: [
        'WebSystemsBuilder.utils.formGeneration.Form'
    ],

    constructor: function (config) {
        this.callParent(arguments);
    },

    getFormID: function () {
        var _this = this;
        return _this.getEventAction().OpenFormAction.FormID;
    },
    getFormParameterValues: function () {
        var _this = this;
        var formParameters = {};
        $.each(_this.getEventAction().OpenFormActionParameters, function (index, item) {
            var actionID = _this.getActionID();
            var formParameterID = item.FormParameterID;
            var operandID = item.OperandIDValue;
            var operand = _this.getForm().getOperandByID(operandID);

            if (operand == null) {
                throw 'Operand for Open form action parameter not found(OperandID = ' + operandID +
                ', OpenFormActionID = ' + actionID + ')';
            }

            formParameters[formParameterID] = operand.getValue();
        });

        return formParameters;
    },

    executeAction: function (callback) {
        var _this = this;
        var formID = _this.getFormID();
        var actionID = _this.getActionID();
        var formParameters = _this.getFormParameterValues();

        var newForm = Ext.create('WebSystemsBuilder.utils.formGeneration.Form', {
            formID: formID,
            formParameters: formParameters,
            callback: function () {
                if (callback) {
                    callback();
                }
            }
        });
    }
});