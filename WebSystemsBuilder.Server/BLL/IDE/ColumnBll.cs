using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class ColumnBLL : ConnectionFactory
    {
        public List<Column> GetTableColumnList(int tableID)
        {
            using (var db = this.CreateContext())
            {
                return db.Columns.Where(x => x.TableID == tableID).ToList();
            }
        }        
    }
}
