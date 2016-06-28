using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryTypeOutInstance
    {
        public QueryTypeOutInstance()
        {

        }
        public QueryTypeOutInstance(QueryTypeOut QueryTypeOut, PropertyValueType ValueType)
        {
            this.QueryTypeOut = QueryTypeOut;
            this.ValueType = ValueType;
        }
        public QueryTypeOut QueryTypeOut { get; set; }
        public PropertyValueType ValueType { get; set; }
    }
}
