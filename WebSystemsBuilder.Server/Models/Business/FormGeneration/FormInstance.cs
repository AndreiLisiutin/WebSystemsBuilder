using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class FormInstance
    {
        public FormInstance()
        {

        }
        public FormInstance(Form Form, ControlInstance RootControl,
            List<FormParameterInstance> FormParameters, List<EventWithActionsInstance> Events)
        {
            this.Form = Form;
            this.RootControl = RootControl;
            this.FormParameters = FormParameters;
            this.Events = Events;
        }
        public Form Form { get; set; }
        public ControlInstance RootControl { get; set; }
        public List<FormParameterInstance> FormParameters { get; set; }
        public List<EventWithActionsInstance> Events { get; set; }

        public BaseActionInstance GetEventAction(int actionID)
        {
            BaseActionInstance search = null;

            foreach (var @event in this.Events)
            {
                foreach (var action in @event.EventActions)
                {
                    BaseActionInstance.ByPassActionsTree(action, (_action) =>
                    {
                        if (_action.EventAction.ActionID == actionID)
                        {
                            search = _action;
                        };
                    });
                }
            }

            return search;
        }


        public PropertyValueType GetOperandValueType(int operandID)
        {
            var parameter = this.FormParameters
                .FirstOrDefault(e => e.FormParameter.OperandID == operandID);

            if (parameter != null)
            {
                return parameter.PropertyValueType;
            }
            ControlInstance control = null;
            this.ByPassControlTree(this.RootControl, (control_) =>
            {
                if (control_.Control.OperandID == operandID)
                {
                    control = control_;
                }
            });

            if (control == null)
            {
                throw new FormGenerationException(string.Format(
                    "Operand not found (OperandID = {0}, FormID = {1})",
                        operandID,
                        this.Form.FormID
                ));
            }
            if (!control.ControlType.IsOperand || !control.ControlType.ValueTypeID.HasValue)
            {
                throw new FormGenerationException(string.Format(
                    "Control marked as operand is not an operand (OperandID = {0}, FormID = {1})",
                        operandID,
                        this.Form.FormID
                ));
            }
            return control.ControlValueType;
        }

        /// <summary> Bypass subtree of form with root control and perform action
        /// </summary>
        /// <param name="control">root control</param>
        /// <param name="action">action to perform with each control</param>
        public void ByPassControlTree(ControlInstance control, Action<ControlInstance> action)
        {
            action(control);
            foreach (var childControl in control.ChildControls)
            {
                this.ByPassControlTree(childControl, action);
            }
        }
    }
}
