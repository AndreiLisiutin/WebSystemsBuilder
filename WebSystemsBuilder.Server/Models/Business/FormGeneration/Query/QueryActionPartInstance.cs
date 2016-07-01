using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryActionPartInstance
    {
        public QueryActionPartInstance()
        {

        }
        public QueryActionPartInstance(QueryActionPart QueryActionPart, QueryTypePart QueryTypePart)
        {
            this.QueryTypePart = QueryTypePart;
            this.QueryActionPart = QueryActionPart;
        }
        public QueryActionPart QueryActionPart { get; set; }
        public QueryTypePart QueryTypePart { get; set; }
    }
}
