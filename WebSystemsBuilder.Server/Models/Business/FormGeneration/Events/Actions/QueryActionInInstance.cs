using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryActionInInstance
    {
        public QueryActionInInstance()
        {

        }
        public QueryActionInInstance(QueryActionIn QueryActionIn, QueryTypeInInstance QueryTypeIn)
        {
            this.QueryTypeIn = QueryTypeIn;
            this.QueryActionIn = QueryActionIn;
        }
        public QueryTypeInInstance QueryTypeIn { get; set; }
        public QueryActionIn QueryActionIn { get; set; }
    }
}
