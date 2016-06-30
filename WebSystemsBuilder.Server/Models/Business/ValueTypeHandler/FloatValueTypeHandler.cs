using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class FloatValueTypeHandler : IValueTypeHandler
    {
        public ValueTypeEnum ValueType
        {
            get
            {
                return ValueTypeEnum.Float;
            }
        }
        public static bool IsDecimalType(Type type)
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
                case TypeCode.Decimal:
                case TypeCode.Double:
                case TypeCode.Single:
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
            float result;
            if (float.TryParse(serializedValue.Replace(",", "."), NumberStyles.Float, CultureInfo.InvariantCulture, out result))
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
            if (!IsDecimalType(value.GetType()) && !IsDecimalType(Nullable.GetUnderlyingType(value.GetType())))
            {
                throw new ValueTypeCastException(value, this.ValueType);
            }
            try
            {
                return (Convert.ToDecimal(value)).ToString(CultureInfo.InvariantCulture);
            }
            catch (Exception ex)
            {
                throw new ValueTypeCastException("Convert.ToDecimal exception", ex);
            }
        }
    }
}
