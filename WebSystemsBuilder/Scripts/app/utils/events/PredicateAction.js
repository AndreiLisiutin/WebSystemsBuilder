Ext.define('WebSystemsBuilder.utils.events.PredicateAction', {
    extend: 'WebSystemsBuilder.utils.events.BaseAction',
    alternateClassName: ['PredicateAction'],
    requires: [
        'WebSystemsBuilder.utils.formGeneration.Form',
        'WebSystemsBuilder.utils.mapping.ValueTypes'
    ],

    constructor: function (config) {
        this.callParent(arguments);
    },

    getFormID: function () {
        return this.getEventAction().OpenFormAction.FormID;
    },
    getActionID: function () {
        return this.getEventAction().OpenFormAction.ActionID;
    },
    executePredicate: function () {
        var _this = this;
        var operationID = _this.getEventAction().PredicateAction.PredicateOperationID;
        var operandID_1 = _this.getEventAction().PredicateAction.OperandIDFirst;
        var operandID_2 = _this.getEventAction().PredicateAction.OperandIDSecond;
        var operand_1 = _this.getForm().getOperandByID(operandID_1);
        var operand_2 = _this.getForm().getOperandByID(operandID_2);

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

    /**
     * Executing IF-THEN-ELSE
     * @param callback
     */
    executeAction: function (callback) {
        var _this = this;
        //check predicate condition
        var predicateResult = _this.executePredicate();
        var actionIDTrue = _this.getEventAction().PredicateAction.ActionIDTrue;
        var actionIDFalse = _this.getEventAction().PredicateAction.ActionIDFalse;

        var actionIDNext = null;
        if (predicateResult) {
            //if true, false-subtree of actions must be marked as executed - 
            // it will never called
            actionIDNext = actionIDTrue;
            if (actionIDFalse) {
                _this._markActionsSubtreeAsExecuted(actionIDFalse);
            }
        } else {
            //if false, true-subtree of actions must be marked as executed - 
            // it will never called
            actionIDNext = actionIDFalse;
            if (actionIDTrue) {
                _this._markActionsSubtreeAsExecuted(actionIDTrue);
            }
        }
        var actionNext = _this.getEventAction().ChildActions.filter(function (item) {
            return item.EventAction.ActionID == actionIDNext;
        })[0];
        if (!actionNext) {
            //if "condotioned action" doesn't exists, call next action
            if (callback) {
                callback()
            }
            return;
        }

        var newAction = WebSystemsBuilder.utils.events.BaseAction.createEvent({
            eventAction: actionNext,
            form: _this.getForm(),
            executedActions: _this.getExecutedActions(),
            parentAction: _this,
            //call next action after "conditioned action" subtree executed
            actionSubtreeExecutedCallback: callback
        });
        newAction.execute();
    }
});