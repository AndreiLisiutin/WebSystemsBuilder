using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryOutInstance
    {
        public QueryOutInstance()
        {

        }
        public QueryOutInstance(QueryOut QueryOut, QueryTypeOutInstance QueryTypeOut)
        {
            this.QueryOut = QueryOut;
            this.QueryTypeOut = QueryTypeOut;
        }
        public QueryOut QueryOut { get; set; }
        public QueryTypeOutInstance QueryTypeOut { get; set; }
    }
}
