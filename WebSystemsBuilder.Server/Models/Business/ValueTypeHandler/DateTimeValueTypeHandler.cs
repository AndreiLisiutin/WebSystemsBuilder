using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class DateTimeValueTypeHandler : IValueTypeHandler
    {
        private const string DEFAULT_DATE_FORMAT = "dd.MM.yyyy";
        public ValueTypeEnum ValueType
        {
            get
            {
                return ValueTypeEnum.DateTime;
            }
        }
        public object Deserialize(string serializedValue, string format)
        {
            if (string.IsNullOrWhiteSpace(serializedValue))
            {
                return null;
            }
            format = format ?? DEFAULT_DATE_FORMAT;
            DateTime result;
            if (DateTime.TryParseExact(serializedValue, format, CultureInfo.InvariantCulture, DateTimeStyles.None, out result))
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
            if (!(value is DateTime) && !(value is DateTime?))
            {
                throw new ValueTypeCastException(value, this.ValueType);
            }
            try
            {
                DateTime dateTime = (value is DateTime?) ? (value as DateTime?).Value : (DateTime)value;
                return dateTime.ToString(CultureInfo.InvariantCulture);
            }
            catch (Exception ex)
            {
                throw new ValueTypeCastException("DateTime conversion exception", ex);
            }
        }

        public new bool Equals(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return ((DateTime)x).ToLongDateString() == ((DateTime)y).ToLongDateString();
        }

        public bool NotEquals(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return ((DateTime)x).ToLongDateString() != ((DateTime)y).ToLongDateString();
        }

        public bool GreaterThan(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return (DateTime)x > (DateTime)y;
        }

        public bool LowerThan(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return (DateTime)x  < (DateTime)y;
        }
    }
}
