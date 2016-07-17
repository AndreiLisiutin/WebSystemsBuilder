using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class ActionScope
    {
        public ActionScope(BaseActionInstance Action, FormInstance Form, List<OperandValue> OperandValues)
        {
            this.Action = Action;
            this.Form = Form;
            this.OperandValues = OperandValues;
            this.ExecutedActionIDS = new List<int>();
        }
        public BaseActionInstance Action { get; set; }
        public FormInstance Form { get; set; }
        public List<OperandValue> OperandValues { get; set; }
        public List<int> ExecutedActionIDS { get; set; }
    }
}
