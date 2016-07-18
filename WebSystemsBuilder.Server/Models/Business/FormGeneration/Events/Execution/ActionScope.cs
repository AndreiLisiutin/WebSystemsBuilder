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
            this._ResultScope = new ActionResultScope(OperandValues);
        }
        public BaseActionInstance Action { get; set; }
        public FormInstance Form { get; set; }
        public List<OperandValue> OperandValues 
        {
            get 
            {
                return this._ResultScope.OperandValues;
            }
            set
            {
                this._ResultScope.OperandValues = value;
            }
        }
        public List<int> ExecutedActionIDS
        {
            get
            {
                return this._ResultScope.ExecutedActionIDS;
            }
            set
            {
                this._ResultScope.ExecutedActionIDS = value;
            }
        }

        public ActionResultScope _ResultScope { get; private set; }
    }

    public class ActionResultScope
    {
        public ActionResultScope()
        {
        }
        public ActionResultScope(List<OperandValue> OperandValues)
        {
            this.ExecutedActionIDS = new List<int>();
            this.OperandValues = OperandValues;
        }
        public List<OperandValue> OperandValues { get; set; }
        public List<int> ExecutedActionIDS { get; set; }
    }
}
