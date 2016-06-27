using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class ControlTypeInstance
    {
        public ControlTypeInstance() { }

        public ControlTypeInstance(ControlType ControlType, ControlTypeGroup ControlTypeGroup)
        {
            this.ControlType = ControlType;
            this.ControlTypeGroup = ControlTypeGroup;
        }

        public ControlType ControlType { get; set; }
        public ControlTypeGroup ControlTypeGroup { get; set; }
    }
}
