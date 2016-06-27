using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class ControlTypeBLL : ConnectionFactory
    {
        public List<ControlTypeInstance> GetControlTypeList()
        {
            using (var db = this.CreateContext())
            {
                List<ControlTypeInstance> controlTypes = (
                    from controlType in db.ControlTypes
                    join controlTypeGroup in db.ControlTypeGroups on controlType.ControlTypeGroupID equals controlTypeGroup.ControlTypeGroupID
                    select new ControlTypeInstance() { ControlType = controlType, ControlTypeGroup = controlTypeGroup }
                ).ToList();
                return controlTypes;
            }
        }
    }
}
