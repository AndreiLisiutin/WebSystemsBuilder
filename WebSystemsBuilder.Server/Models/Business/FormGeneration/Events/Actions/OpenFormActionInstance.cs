using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class OpenFormActionInstance : BaseActionInstance
    {
        public OpenFormActionInstance()
            : base()
        {

        }
        public OpenFormActionInstance(EventAction EventAction, OpenFormAction OpenFormAction,
            List<OpenFormActionParameter> OpenFormActionParameters)
            : base(EventAction)
        {
            this.OpenFormAction = OpenFormAction;
            this.OpenFormActionParameters = OpenFormActionParameters;
        }
        public OpenFormAction OpenFormAction { get; set; }
        public List<OpenFormActionParameter> OpenFormActionParameters { get; set; }

        public override int ActionTypeID
        {
            get
            {
                return (int)ActionTypeEnum.OpenForm;
            }
        }
        
        public override bool Execute(ActionScope scope)
        {
            return false;
        }
    }
}
