using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class PropertyInstance
    {
        public PropertyInstance() { }
        public PropertyInstance(Property Property, ControlTypePropertyType ControlTypePropertyType, PropertyValueType ValueType, PropertyType PropertyType = null)
        {
            this.Property = Property;
            this.ControlTypePropertyType = ControlTypePropertyType;
            this.ValueType = ValueType;
            this.PropertyType = PropertyType;
        }
        public Property Property { get; set; }
        public ControlTypePropertyType ControlTypePropertyType { get; set; }
        public PropertyType PropertyType { get; set; }
        public PropertyValueType ValueType { get; set; }
    }
}
