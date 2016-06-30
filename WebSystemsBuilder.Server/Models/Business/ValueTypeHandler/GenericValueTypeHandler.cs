using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public static class ValueTypeConverter
    {
        private static List<IValueTypeHandler> valueTypeHandlers;
        static ValueTypeConverter()
        {
            valueTypeHandlers = new List<IValueTypeHandler>();
            valueTypeHandlers.Add(new BooleanValueTypeHandler());
            valueTypeHandlers.Add(new StringValueTypeHandler());
            valueTypeHandlers.Add(new IntegerValueTypeHandler());
            valueTypeHandlers.Add(new FloatValueTypeHandler());
            valueTypeHandlers.Add(new DateTimeValueTypeHandler());
        }

        public static object Deserialize(string serializedValue, int valueTypeID, string format = null)
        {
            IValueTypeHandler handler = _FindHandler(valueTypeID);
            return handler.Deserialize(serializedValue, format);
        }

        public static string Serialize(object value, int valueTypeID, string format = null)
        {
            IValueTypeHandler handler = _FindHandler(valueTypeID);
            return handler.Serialize(value, format);
        }

        private static IValueTypeHandler _FindHandler(int valueTypeID)
        {
            IValueTypeHandler handler = valueTypeHandlers.SingleOrDefault(e => (int)e.ValueType == valueTypeID);
            if (handler == null)
            {
                throw new FormGenerationException(string.Format(
                    "Unknown value type(ValueTypeID = {0})",
                        valueTypeID
                ));
            }
            return handler;
        }
    }
}
