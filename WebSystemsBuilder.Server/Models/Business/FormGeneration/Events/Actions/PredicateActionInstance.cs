using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class PredicateActionInstance : BaseActionInstance
    {
        public PredicateActionInstance()
            : base()
        {

        }
        public PredicateActionInstance(EventAction EventAction, PredicateAction PredicateAction, PredicateOperation PredicateOperation)
            : base(EventAction)
        {
            this.PredicateAction = PredicateAction;
            this.PredicateOperation = PredicateOperation;
        }
        public PredicateAction PredicateAction { get; set; }
        public PredicateOperation PredicateOperation { get; set; }

        public override int ActionTypeID
        {
            get
            {
                return (int)ActionTypeEnum.Predicate;
            }
        }

        private bool PerformPredicate(ActionScope scope)
        {
            var operand1 = scope.OperandValues
                .FirstOrDefault(e => e.OperandID == this.PredicateAction.OperandIDFirst);
            if (operand1 == null)
            {
                throw new FormGenerationException(string.Format(
                    "First operand for predicate action fot found (ActionID = {0}, OperandID = {1})",
                        this.EventAction.ActionID,
                        this.PredicateAction.OperandIDFirst
                ));
            }

            var operand2 = scope.OperandValues
                .FirstOrDefault(e => e.OperandID == this.PredicateAction.OperandIDSecond);
            if (operand1 == null)
            {
                throw new FormGenerationException(string.Format(
                    "Second operand for predicate action fot found (ActionID = {0}, OperandID = {1})",
                        this.EventAction.ActionID,
                        this.PredicateAction.OperandIDSecond
                ));
            }

            if (operand1.ValueType.ValueTypeID != operand2.ValueType.ValueTypeID)
            {
                throw new FormGenerationException(string.Format(
                    "Operands for predicate action have different value types(ActionID = {0}, " +
                    "OperandIDFirst = {1}, OperandIDSecond = {2})",
                        this.EventAction.ActionID,
                        this.PredicateAction.OperandIDFirst,
                        this.PredicateAction.OperandIDSecond
                ));
            }
            object value1 = operand1.GetDeserializedValue();
            object value2 = operand2.GetDeserializedValue();
            int valueTypeID = operand1.ValueType.ValueTypeID;
            int predicateOperationID = this.PredicateAction.PredicateOperationID;

            bool result = ValueTypeConverter.PerformPredicate(value1, value2, valueTypeID, predicateOperationID);
            return result;
        }

        private bool PerformTrueAction(ActionScope scope, BaseActionInstance execute, BaseActionInstance notToExecute)
        {
            if (notToExecute != null)
            {
                ByPassActionsTree(notToExecute, (action_) =>
                {
                    //that actions will never be executed, so mark as executed
                    scope.ExecutedActionIDS.Add(action_.EventAction.ActionID);
                });
            }
            if (execute != null)
            {
                return execute.ExecuteAction(scope);
            }
            return true;
        }

        protected override bool Execute(ActionScope scope)
        {
            bool result = this.PerformPredicate(scope);
            var trueAction = this.ChildActions
                .FirstOrDefault(e => e.EventAction.ActionID == this.PredicateAction.ActionIDTrue);
            var falseAction = this.ChildActions
                .FirstOrDefault(e => e.EventAction.ActionID == this.PredicateAction.ActionIDFalse);

            //predicate executed
            scope.ExecutedActionIDS.Add(this.EventAction.ActionID);

            BaseActionInstance execute = result ? trueAction : falseAction;
            BaseActionInstance notToExecute = result ? falseAction : trueAction;
            bool fullyExecuted = this.PerformTrueAction(scope, execute, notToExecute);
            return fullyExecuted;
        }


    }
}
