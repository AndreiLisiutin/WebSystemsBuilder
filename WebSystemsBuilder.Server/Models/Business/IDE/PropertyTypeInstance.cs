using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class PropertyTypeInstance
    {
        public ControlTypePropertyType ControlTypePropertyType { get; set; }
        public PropertyType PropertyType { get; set; }
        public PropertyValueType ValueType { get; set; }
    }
}
