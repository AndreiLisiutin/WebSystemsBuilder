using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class FormMetaBLL : ConnectionFactory
    {
        public FormInstance GetFormMetaDescriptions(int formID)
        {
            Form rootForm = null;
            List<ControlInstance> controlInstances = null;
            ControlInstance rootControl = null;
            using (var db = this.CreateContext())
            {
                rootForm = this._GetFormByID(db, formID);
                controlInstances = this._GetControlInstancesByFormID(db, formID);
            }

            foreach (ControlInstance instance in controlInstances)
            {
                instance.ChildControls = controlInstances
                    .Where(e => e.Control.ControlIDParent == instance.Control.ControlID)
                    .ToList();
            }

            rootControl = controlInstances.SingleOrDefault(e => e.Control.ControlIDParent == null);
            if (rootControl == null)
            {
                throw new Exception(String.Format(
                    "The root element of form not found. (FormID = {0})", formID
                ));
            }
            List<FormParameterInstance> parameters = new ParametersBLL().GetParametersByFormID(formID);
            List<EventWithActionsInstance> events = new EventsBLL().GetEventsByFormID(formID);
            return new FormInstance(rootForm, rootControl, parameters, events);
        }
        
        private Form _GetFormByID(WebBuilderEFContext db, int formID)
        {
            Form form = db.Forms.FirstOrDefault(e => e.FormID == formID);
            if (form == null)
            {
                throw new FormGenerationException(String.Format(
                    "Form not found(FormID = {0})", 
                        formID
                ));
            }
            return form;
        }

        private List<ControlInstance> _GetControlInstancesByFormID(WebBuilderEFContext db, int formID)
        {
            var controlInstances = (
                    from control in db.Controls
                    where control.FormID == formID
                    join controlType in db.ControlTypes on control.ControlTypeID equals controlType.ControlTypeID
                    join ctpt in db.ControlTypePropertyTypes on controlType.ControlTypeID equals ctpt.ControlTypeID
                    join propertyType in db.PropertyTypes on ctpt.PropertyTypeID equals propertyType.PropertyTypeID
                    join valueType in db.PropertyValueTypes on propertyType.ValueTypeID equals valueType.ValueTypeID
                    join property in db.Properties on new { ControlID = control.ControlID, ControlTypePropertyTypeID = ctpt.ControlTypePropertyTypeID }
                        equals new { ControlID = property.ControlID, ControlTypePropertyTypeID = property.ControlTypePropertyTypeID }
                    into leftJoinProperty
                    from property in leftJoinProperty.DefaultIfEmpty()
                    select new
                    {
                        control = control,
                        controlType = controlType,
                        controlTypePropertyType = ctpt,
                        property = property,
                        propertyType = propertyType,
                        valueType = valueType
                    }
                ).ToList()
                .GroupBy(e => e.control)
                .Select(e => new ControlInstance(e.First().control, e.First().controlType, 
                    e.Select(prop => new PropertyInstance(prop.property, prop.controlTypePropertyType, prop.valueType, prop.propertyType)).ToList()))
                .ToList();
            
            return controlInstances;
        }
    }
}
