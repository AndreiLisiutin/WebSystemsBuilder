using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSystemsBuilder.Server;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.ClientWeb
{
    public class QueryController : BaseController
    {
        [HttpPost]
        public ActionResult ExecuteQueryAction(int formID, int actionID, Dictionary<int, string> operandID_Value)
        {
            ActionScope scope = this.InitializeScope(formID, actionID, operandID_Value);
            scope.Action.Execute(scope);
            return Json(scope, JsonRequestBehavior.AllowGet);
        }

        private ActionScope InitializeScope(int formID, int actionID, Dictionary<int, string> operandID_Value)
        {
            FormInstance formInstance = new FormMetaBLL().GetFormMetaDescriptions(formID);
            BaseActionInstance action = formInstance.GetEventAction(actionID);
            if (action == null)
            {
                throw new FormGenerationException(string.Format(
                    "Action not found in form actions (ActionID = {0}, FormID = {1})",
                        actionID,
                        formInstance.Form.FormID
                ));
            }
            
            List<OperandValue> operandValues = new List<OperandValue>();

            foreach (int operandID in operandID_Value.Keys)
            {
                string serializedValue = operandID_Value[operandID];
                PropertyValueType valueType = formInstance.GetOperandValueType(operandID);
                OperandValue operand = new OperandValue(operandID, valueType, serializedValue);
                operandValues.Add(operand);
            }

            return new ActionScope(action, formInstance, operandValues);
        }
    }
}