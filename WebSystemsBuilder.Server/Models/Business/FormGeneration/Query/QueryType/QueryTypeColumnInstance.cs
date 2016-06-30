using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryTypeColumnInstance
    {
        public QueryTypeColumnInstance()
        {

        }
        public QueryTypeColumnInstance(QueryTypeColumn QueryTypeColumn, Column Column)
        {
            this.QueryTypeColumn = QueryTypeColumn;
            this.Column = Column;
        }
        public QueryTypeColumn QueryTypeColumn { get; set; }
        public Column Column { get; set; }
    }
}
