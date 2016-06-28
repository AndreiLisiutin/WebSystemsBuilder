using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server
{
    public class ValueTypeCastException : FormGenerationException
    {
        public ValueTypeCastException()
            : base()
        {
        }
        public ValueTypeCastException(object value, ValueTypeEnum valueTypeID)
            : base(string.Format(
                "Cannot cast serialized value {0} to type {1}",
                    value ?? "NULL",
                    valueTypeID.ToString()
            ))
        {
        }
        public ValueTypeCastException(object value, int valueTypeID)
            : this(value, (ValueTypeEnum)valueTypeID)
        {
        }
        public ValueTypeCastException(string message) 
            : base(message)
        {
        }
        public ValueTypeCastException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
        protected ValueTypeCastException(SerializationInfo info, StreamingContext context) 
            : base(info, context)
        {
        }
    }
}
