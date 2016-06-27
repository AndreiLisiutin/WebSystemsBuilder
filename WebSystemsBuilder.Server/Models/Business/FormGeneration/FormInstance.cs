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
        public FormInstance(Form Form, ControlInstance RootControl)
        {
            this.Form = Form;
            this.RootControl = RootControl;
        }
        public Form Form { get; set; }
        public ControlInstance RootControl { get; set; }
    }
}
