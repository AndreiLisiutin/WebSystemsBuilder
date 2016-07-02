Ext.define('WebSystemsBuilder.utils.events.PredicateAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['PredicateAction'],
    requires: [
        'WebSystemsBuilder.utils.formGeneration.Form',
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],
    _eventAction: null,
    _form: null,
    _eventActionIDExecuted:[],

    constructor: function (config) {
        var eventAction = config.eventAction;
        var form = config.form;

        this._eventActionIDExecuted = [];
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
    executePredicate: function () {
        var _this = this;
        var operationID = _this._eventAction.PredicateAction.PredicateOperationID;
        var operandID_1 = _this._eventAction.PredicateAction.OperandIDFirst;
        var operandID_2 = _this._eventAction.PredicateAction.OperandIDSecond;
        var operand_1 = _this._form.getOperandByID(operandID_1);
        var operand_2 = _this._form.getOperandByID(operandID_2);

        if (operand_1 == null) {
            throw 'Operand for predicate action not found(OperandID = ' + operandID_1 + ')';
        }
        if (operand_2 == null) {
            throw 'Operand for predicate action not found(OperandID = ' + operandID_2 + ')';
        }
        var valueType_1 = operand_1.getValueTypeID();
        var valueType_2 = operand_2.getValueTypeID();

        if (valueType_1 != valueType_2) {
            throw 'Operands for predicate action have different value types(OperandID = ' +
            operandID_1 + ', ' + operandID_2 + ')';
        }

        return WebSystemsBuilder.utils.mapping.ValueTypes.executePredicate(operand_1.getValue(), operand_2.getValue(), operationID, valueType_1);
    },

    executeAction: function (callback) {
        var _this = this;
        var predicateResult = _this.executePredicate();
        var actionIDTrue = _this._eventAction.PredicateAction.ActionIDTrue;
        var actionIDFalse = _this._eventAction.PredicateAction.ActionIDFalse;

        var actionIDNext = null;
        if (predicateResult) {
            actionIDNext = actionIDTrue;

        } else {
            actionIDNext = _this._eventAction.PredicateAction.ActionIDFalse;
        }

        if (callback && _this.subtreeIsExecuted()) {
            callback();
        }
    },

    markAsExecuted: function(actionID) {
        var _this = this;
        if (_this._eventActionIDExecuted.indexOf(item.EventAction.ActionID) < 0) {
            return false;
        }
    },

    subtreeIsExecuted:function() {
        var _this = this;

        $.each(_this._eventAction.ChildActions, function(index, item) {
            if (_this._eventActionIDExecuted.indexOf(item.EventAction.ActionID) < 0) {
                return false;
            }
        });
        return true;
    }
});