﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class ControlInstance
    {
        public ControlInstance()
        {

        }
        public ControlInstance(Control Control, ControlType ControlType, PropertyValueType ControlValueType, List<PropertyInstance> Properties)
        {
            this.Control = Control;
            this.ControlType = ControlType;
            this.Properties = Properties;
            this.ControlValueType = ControlValueType;
        }
        public Control Control { get; set; }
        public ControlType ControlType { get; set; }
        public PropertyValueType ControlValueType { get; set; }
        public List<PropertyInstance> Properties { get; set; }
        public List<ControlInstance> ChildControls { get; set; }
        public List<ControlEventInstance> Events { get; set; }
    }
}
