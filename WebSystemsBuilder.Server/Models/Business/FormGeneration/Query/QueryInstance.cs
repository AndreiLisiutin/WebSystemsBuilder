using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryInstance
    {
        public QueryInstance()
        {

        }
        public QueryInstance(Query Query, List<QueryInInstance> QueryIns, List<QueryOutInstance> QueryOuts, List<QueryPartInstance> QueryParts)
        {
            this.Query = Query;
            this.QueryIns = QueryIns;
            this.QueryOuts = QueryOuts;
            this.QueryParts = QueryParts;
        }
        public Query Query { get; set; }
        public List<QueryInInstance> QueryIns { get; set; }
        public List<QueryOutInstance> QueryOuts { get; set; }
        public List<QueryPartInstance> QueryParts { get; set; }
    }
}
