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

        /// <summary> Check serializedValue has correct correspondig valueTypeID and format
        /// </summary>
        /// <param name="serializedValue">serialized value to check value type</param>
        /// <param name="valueTypeID">value type to check</param>
        /// <param name="format">value type format</param>
        /// <returns></returns>
        public static bool CheckValueTypeCorrectness(string serializedValue, int valueTypeID, string format = null)
        {
            try
            {
                Deserialize(serializedValue, valueTypeID, format);
            }
            catch
            {
                return false;
            }
            return true;
        }

        public static bool PerformPredicate(object value1, object value2, int valueTypeID, int predicateOperationID)
        {
            IValueTypeHandler handler = _FindHandler(valueTypeID);
            switch (predicateOperationID)
            {
                case (int)PredicateOperationEnum.Equals:
                    return handler.Equals(value1, value2);
                    break;
                case (int)PredicateOperationEnum.NotEquals:
                    return handler.NotEquals(value1, value2);
                    break;
                case (int)PredicateOperationEnum.GreaterThan:
                    return handler.GreaterThan(value1, value2);
                    break;
                case (int)PredicateOperationEnum.LowerThan:
                    return handler.LowerThan(value1, value2);
                    break;
                default:
                    throw new FormGenerationException(string.Format(
                        "Unknown predicate operation (PredicateOperationID = {0})",
                            predicateOperationID
                    ));
            }
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
