Ext.define('WebSystemsBuilder.utils.events.PredicateAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['PredicateAction'],
    requires: [
        'WebSystemsBuilder.utils.formGeneration.Form',
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],
    _eventAction: null,
    _form: null,
    _eventActionIDExecuted: [],

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

    executeAction: function () {
        var _this = this;
        var predicateResult = _this.executePredicate();
        var actionIDTrue = _this._eventAction.PredicateAction.ActionIDTrue;
        var actionIDFalse = _this._eventAction.PredicateAction.ActionIDFalse;

        var actionIDNext = null;
        if (predicateResult) {
            actionIDNext = actionIDTrue;
            if (actionIDFalse) {
                _this._markActionAsExecuted(actionIDFalse);
            }
        } else {
            actionIDNext = actionIDFalse;
            if (actionIDTrue) {
                _this._markActionAsExecuted(actionIDTrue);
            }
        }
        var actionNext = _this._eventAction.ChildActions.filter(function (item) {
            return item.EventAction.ActionID == actionIDNext;
        })[0];

        var actionNext = WebSystemsBuilder.utils.events.BaseAction.createEvent(actionNext, _this._form);
        actionNext.executeAction(function () {
            _this._markAsExecutedAndCallCallback(actionIDNext);

            if (!_this._eventAction.ChildActions || !_this._eventAction.ChildActions.length) {
                _this._callCallback()
            }

            $.each(_this._eventAction.ChildActions, function (index, item) {
                if (!_this._isChildActionExecuted(item.EventAction.ActionID)) {
                    var action = WebSystemsBuilder.utils.events.BaseAction.createEvent(item, _this._form);
                    action.executeAction(_this._markAsExecutedAndCallCallback(item.EventAction.ActionID));
                }
            });
        });
    },

});