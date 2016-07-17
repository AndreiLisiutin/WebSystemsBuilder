using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class StringValueTypeHandler : IValueTypeHandler
    {
        public ValueTypeEnum ValueType
        {
            get
            {
                return ValueTypeEnum.String;
            }
        }

        public object Deserialize(string serializedValue, string format)
        {
            return serializedValue;
        }

        public string Serialize(object value, string format)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
            {
                return null;
            }
            return value.ToString();
        }

        public new bool Equals(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return x.ToString() == y.ToString();
        }

        public bool NotEquals(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return x.ToString() != y.ToString();
        }

        public bool GreaterThan(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return x.ToString().Length > y.ToString().Length;
        }

        public bool LowerThan(object x, object y)
        {
            if (x == null || y == null)
            {
                return false;
            }
            return x.ToString().Length < y.ToString().Length;
        }
    }
}
