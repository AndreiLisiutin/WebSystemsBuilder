using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class ControlTypeBLL : ConnectionFactory
    {

        public List<ControlTypeInstance> GetControlTypeList()
        {
            using (var db = this.CreateContext())
            {
                // Control Type and Control Group
                List<ControlTypeInstance> controlTypeList = (
                    from controlType in db.ControlTypes
                    join controlTypeGroup in db.ControlTypeGroups on controlType.ControlTypeGroupID equals controlTypeGroup.ControlTypeGroupID
                    select new ControlTypeInstance()
                    {
                        ControlType = controlType,
                        ControlTypeGroup = controlTypeGroup
                    }
                ).ToList();

                // Property Types
                foreach (ControlTypeInstance controlType in controlTypeList)
                {
                    List<PropertyTypeInstance> propertyTypeList = (
                       from ctpt in db.ControlTypePropertyTypes
                       join propertyType in db.PropertyTypes on ctpt.PropertyTypeID equals propertyType.PropertyTypeID
                       join valueType in db.PropertyValueTypes on propertyType.ValueTypeID equals valueType.ValueTypeID
                       where ctpt.ControlTypeID == controlType.ControlType.ControlTypeID
                       select new PropertyTypeInstance()
                       {
                           ControlTypePropertyType = ctpt,
                           PropertyType = propertyType,
                           ValueType = valueType
                       }
                   ).ToList();
                    controlType.PropertiesList = propertyTypeList;

                    controlType.Properties = new Dictionary<string, object>();
                    foreach (PropertyTypeInstance prop in controlType.PropertiesList)
                    {
                        var defaultValue = this.GetRightDefaultValue(prop.ValueType.ValueTypeID, prop.ControlTypePropertyType.DefaultValue);
                        controlType.Properties.Add(prop.PropertyType.Name, defaultValue);
                    }
                }

                foreach (ControlTypeInstance currentControlType in controlTypeList)
                {
                    var eventTypeList = (
                        from controlType in db.ControlTypes
                        join eventTypeControlType in db.EventTypeControlTypes on controlType.ControlTypeID equals eventTypeControlType.ControlTypeID
                        join eventType in db.EventTypes on eventTypeControlType.EventTypeID equals eventType.EventTypeID
                        where controlType.ControlTypeID == currentControlType.ControlType.ControlTypeID
                        select new EventTypeInstance()
                        {
                            EventType = eventType,
                            EventTypeControlType = eventTypeControlType
                        }
                    ).ToList();
                    currentControlType.EventTypesList = eventTypeList;
                }

                return controlTypeList;
            }
        }

        /// <summary>
        /// Функция, задающая верный тип значения свойства по умолчанию, т.к. в базе все хранится в формате строки
        /// </summary>
        private object GetRightDefaultValue(int valueTypeID, string defaultValue)
        {
            if (string.IsNullOrEmpty(defaultValue)) return string.Empty;

            switch (valueTypeID)
            {
                case (int)ValueTypeEnum.Float:
                    decimal temp;
                    if (decimal.TryParse(defaultValue, out temp)) return temp;
                    return string.Empty;
                case (int)ValueTypeEnum.Integer:
                    int tempInt;
                    if (int.TryParse(defaultValue, out tempInt)) return tempInt;
                    return string.Empty;
                case (int)ValueTypeEnum.DateTime:
                    DateTime tempDate;
                    if (DateTime.TryParse(defaultValue, out tempDate)) return tempDate;
                    return string.Empty;
                case (int)ValueTypeEnum.Boolean:
                    Boolean tempBool;
                    if (Boolean.TryParse(defaultValue, out tempBool)) return tempBool;
                    return string.Empty;
                default:
                    return defaultValue;
            }
        }

        public List<ControlTypeDependency> GetControlTypeDependencies()
        {
            using (var db = this.CreateContext())
            {
                return db.ControlTypeDependencies.ToList();
            }
        }
    }
}
