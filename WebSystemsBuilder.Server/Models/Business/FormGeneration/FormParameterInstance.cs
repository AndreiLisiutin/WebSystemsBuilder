using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class FormParameterInstance
    {
        public FormParameterInstance()
        {

        }
        public FormParameterInstance(FormParameter FormParameter, PropertyValueType PropertyValueType)
        {
            this.FormParameter = FormParameter;
            this.PropertyValueType = PropertyValueType;
        }
        public FormParameter FormParameter { get; set; }
        public PropertyValueType PropertyValueType { get; set; }
    }
}
