using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryPartInstance
    {
        public QueryPartInstance()
        {

        }
        public QueryPartInstance(QueryPart QueryPart, QueryTypePart QueryTypePart)
        {
            this.QueryTypePart = QueryTypePart;
            this.QueryPart = QueryPart;
        }
        public QueryPart QueryPart { get; set; }
        public QueryTypePart QueryTypePart { get; set; }
    }
}
