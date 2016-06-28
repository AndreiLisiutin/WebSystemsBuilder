using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server
{
    public class ConnectionFactory
    {
        public DbConnection CreateConnection()
        {
            return new Npgsql.NpgsqlConnectionFactory().CreateConnection("WebBuilder");
        }
        
        public WebBuilderEFContext CreateContext()
        {
            return new WebBuilderEFContext("WebBuilder");
        }
    }
}
