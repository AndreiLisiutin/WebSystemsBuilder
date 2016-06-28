using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;

namespace WebSystemsBuilder.Server
{
    public class ConnectionFactory
    {
        private const string connectionName = "WebBuilder";
        public DbConnection CreateConnection()
        {
            var connectionString = ConfigurationManager.ConnectionStrings[connectionName];
            if (connectionString == null || connectionString.ConnectionString == null)
            {
                throw new ConfigurationErrorsException(string.Format(
                    "Connection {0} not found! Check web.config!",
                        connectionName
                ));
            }
            return new Npgsql.NpgsqlConnectionFactory().CreateConnection(connectionString.ConnectionString);
        }
        
        public WebBuilderEFContext CreateContext()
        {
            return new WebBuilderEFContext(connectionName);
        }
        
        public WebBuilderEFContext CreateContext(DbConnection connection)
        {
            return new WebBuilderEFContext(connection, false);
        }
    }
}
