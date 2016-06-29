using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class ControlTypeInstance
    {
        public ControlType ControlType { get; set; }
        public ControlTypeGroup ControlTypeGroup { get; set; }
        public List<PropertyTypeInstance> PropertiesList { get;set; }
        public Dictionary<string, object> Properties { get; set; }
    }
}
