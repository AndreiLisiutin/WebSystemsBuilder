using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class FormInstance
    {
        public FormInstance()
        {

        }
        public FormInstance(Form Form, ControlInstance RootControl, 
            List<FormParameterInstance> FormParameters, List<EventWithActionsInstance> Events)
        {
            this.Form = Form;
            this.RootControl = RootControl;
            this.FormParameters = FormParameters;
            this.Events = Events;
        }
        public Form Form { get; set; }
        public ControlInstance RootControl { get; set; }
        public List<FormParameterInstance> FormParameters { get; set; }
        public List<EventWithActionsInstance> Events { get; set; }
    }
}
