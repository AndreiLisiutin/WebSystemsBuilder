using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class IntegerValueTypeHandler : IValueTypeHandler
    {
        public ValueTypeEnum ValueType
        {
            get
            {
                return ValueTypeEnum.Integer;
            }
        }

        public static bool IsIntegerType(Type type)
        {
            if (type == null)
            {
                return false;
            }
            switch (Type.GetTypeCode(type))
            {
                case TypeCode.Byte:
                case TypeCode.SByte:
                case TypeCode.UInt16:
                case TypeCode.UInt32:
                case TypeCode.UInt64:
                case TypeCode.Int16:
                case TypeCode.Int32:
                case TypeCode.Int64:
                    return true;
                default:
                    return false;
            }
        }

        public object Deserialize(string serializedValue, string format)
        {
            if (string.IsNullOrWhiteSpace(serializedValue))
            {
                return null;
            }
            int result;
            if (int.TryParse(serializedValue, out result))
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
            if (!IsIntegerType(value.GetType()) && !IsIntegerType(Nullable.GetUnderlyingType(value.GetType())))
            {
                throw new ValueTypeCastException(value, this.ValueType);
            }
            return value.ToString();
        }
    }
}
