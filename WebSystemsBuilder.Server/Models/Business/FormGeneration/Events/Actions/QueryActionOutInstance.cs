using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryActionOutInstance
    {
        public QueryActionOutInstance()
        {

        }
        public QueryActionOutInstance(QueryActionOut QueryActionOut, QueryTypeOutInstance QueryTypeOut)
        {
            this.QueryActionOut = QueryActionOut;
            this.QueryTypeOut = QueryTypeOut;
        }
        public QueryActionOut QueryActionOut { get; set; }
        public QueryTypeOutInstance QueryTypeOut { get; set; }
    }
}
