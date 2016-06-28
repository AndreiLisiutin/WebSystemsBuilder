using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server
{
    public class FormGenerationException : ApplicationException
    {
        //
        public FormGenerationException()
            : base()
        {
        }
        public FormGenerationException(string message) 
            : base(message)
        {
        }
        public FormGenerationException(string message, Exception innerException) 
            : base(message, innerException)
        {
        }
        protected FormGenerationException(SerializationInfo info, StreamingContext context) 
            : base(info, context)
        {
        }
    }
}
