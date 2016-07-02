Ext.define('WebSystemsBuilder.utils.events.OpenFormAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['OpenFormAction'],
    requires: [
        'WebSystemsBuilder.utils.formGeneration.Form'
    ],
    _eventAction: null,
    _form: null,

    constructor: function (config) {
        var eventAction = config.eventAction;
        var form = config.form;

        this._eventAction = eventAction;
        this._form = form;
        this.callParent(arguments);
    },

    getFormID: function () {
        return this._eventAction.OpenFormAction.FormID;
    },
    getActionID: function () {
        return this._eventAction.OpenFormAction.ActionID;
    },
    getFormParameterValues: function () {
        var _this = this;
        var formParameters = {};
        $.each(this._eventAction.OpenFormActionParameters, function (index, item) {
            var actionID = _this.getActionID();
            var formParameterID = item.FormParameterID;
            var operandID = item.OperandIDValue;
            var operand = _this._form.getOperandByID(operandID);

            if (operand == null) {
                throw 'Operand for Open form action parameter not found(OperandID = ' + operandID +
                ', OpenFormActionID = ' + actionID + ')';
            }

            formParameters[formParameterID] = operand.getValue();
        });

        return formParameters;
    },

    executeAction: function () {
        var _this = this;
        var formID = _this.getFormID();
        var actionID = _this.getActionID();
        var formParameters = _this.getFormParameterValues();

        var newForm = Ext.create('WebSystemsBuilder.utils.formGeneration.Form', {
            formID: formID,
            formParameters: formParameters,
            callback: function () {
                $.each(_this._eventAction.ChildActions, function (index, item) {
                    var action = WebSystemsBuilder.utils.events.BaseAction.createEvent(item, _this._form);
                    action.executeAction();
                });
            }
        });
    }
});