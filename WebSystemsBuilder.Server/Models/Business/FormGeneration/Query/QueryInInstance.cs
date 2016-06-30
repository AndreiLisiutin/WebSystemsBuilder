using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryInInstance
    {
        public QueryInInstance()
        {

        }
        public QueryInInstance(QueryIn QueryIn, QueryTypeInInstance QueryTypeIn)
        {
            this.QueryTypeIn = QueryTypeIn;
            this.QueryIn = QueryIn;
        }
        public QueryTypeInInstance QueryTypeIn { get; set; }
        public QueryIn QueryIn { get; set; }
    }
}
