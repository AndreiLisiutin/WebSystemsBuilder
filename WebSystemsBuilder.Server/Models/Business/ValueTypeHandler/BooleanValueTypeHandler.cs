using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class BooleanValueTypeHandler : IValueTypeHandler
    {
        public ValueTypeEnum ValueType
        {
            get
            {
                return ValueTypeEnum.Boolean;
            }
        }

        public object Deserialize(string serializedValue, string format)
        {
            if (string.IsNullOrWhiteSpace(serializedValue))
            {
                return null;
            }
            bool result;
            if (bool.TryParse(serializedValue, out result))
            {
                return result;
            }
            throw new ValueTypeCastException(serializedValue, this.ValueType);
        }

        public string Serialize(object value, string format)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return null;
            }
            if (!(value is bool) && !(value is bool?))
            {
                throw new ValueTypeCastException(value, this.ValueType);
            }

            return value.ToString();
        }
    }
}
