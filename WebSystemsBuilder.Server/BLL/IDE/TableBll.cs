using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class TableBLL : ConnectionFactory
    {
        public List<Table> GetTableList()
        {
            using (var db = this.CreateContext())
            {
                return db.Tables.ToList();
            }
        }        
    }
}
