using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class BaseActionInstance
    {
        public BaseActionInstance()
        {

        }
        public BaseActionInstance(EventAction EventAction)
        {
            this.EventAction = EventAction;
        }
        public EventAction EventAction { get; set; }
        public List<BaseActionInstance> ChildActions { get; set; }
    }
}
