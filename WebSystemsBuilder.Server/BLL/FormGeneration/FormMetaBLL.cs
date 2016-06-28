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
            if (formID <= 0)
            {
                throw new ArgumentException("formID");
            }

            using (var db = this.CreateContext())
            {
                var metadataItems = (
                    from form in db.Forms
                    join control in db.Controls on form.FormID equals control.FormID
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
                        form = form,
                        property = property,
                        propertyType = propertyType,
                        valueType = valueType
                    }
                    ).ToList();

                if (metadataItems.Count == 0)
                {
                    throw new Exception(String.Format(
                        "Form not found or empty(FormID = {0})", formID
                    ));
                }

                Func<int, ControlInstance> _createControl = (controlID) =>
                {
                    var item = metadataItems.FirstOrDefault(e => e.control.ControlID == controlID);
                    if (item == null)
                    {
                        throw new Exception(String.Format(
                            "Control not found(FormID = {0}, ControlID = {1})", formID, controlID
                        ));
                    }

                    ControlInstance controlInstance = new ControlInstance(item.control, item.controlType);
                    controlInstance.Properties = metadataItems
                        .Where(e => e.control.ControlID == controlID)
                        .Select(e => new PropertyInstance(e.property, e.controlTypePropertyType, e.valueType, e.propertyType))
                        .ToList();

                    return controlInstance;
                };

                List<ControlInstance> controlInstances = metadataItems
                    .Select(e => e.control.ControlID)
                    .Distinct()
                    .Select(e => _createControl(e))
                    .ToList();

                foreach (ControlInstance instance in controlInstances)
                {
                    instance.ChildControls = controlInstances
                        .Where(e => e.Control.ControlIDParent == instance.Control.ControlID)
                        .ToList();
                }

                Form rootForm = metadataItems.First().form;
                ControlInstance rootControl = controlInstances.FirstOrDefault(e => e.Control.ControlID == rootForm.ControlIDRoot);
                if (rootControl == null)
                {
                    throw new Exception(String.Format(
                        "The root element of form not found. (FormID = {0}, ControlID = {1})", formID, rootForm.ControlIDRoot
                    ));
                }
                return new FormInstance(rootForm, rootControl);
            }
        }
    }
}
