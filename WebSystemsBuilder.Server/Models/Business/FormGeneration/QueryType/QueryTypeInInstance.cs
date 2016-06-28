using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryTypeInInstance
    {
        public QueryTypeInInstance()
        {

        }
        public QueryTypeInInstance(QueryTypeIn QueryTypeIn, PropertyValueType ValueType)
        {
            this.QueryTypeIn = QueryTypeIn;
            this.ValueType = ValueType;
        }
        public QueryTypeIn QueryTypeIn { get; set; }
        public PropertyValueType ValueType { get; set; }
    }
}
