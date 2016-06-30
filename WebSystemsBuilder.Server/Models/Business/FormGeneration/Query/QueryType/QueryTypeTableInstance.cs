using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryTypeTableInstance
    {
        public QueryTypeTableInstance()
        {

        }
        public QueryTypeTableInstance(QueryTypeTable QueryTypeTable, Table Table)
        {
            this.QueryTypeTable = QueryTypeTable;
            this.Table = Table;
        }
        public QueryTypeTable QueryTypeTable { get; set; }
        public Table Table { get; set; }
    }
}
