using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class QueryBLL : ConnectionFactory
    {
        public DataTable ExecuteSql(string sql, Dictionary<string, object> parameters)
        {
            try
            {
                using (var connection = this.CreateConnection())
                using (var command = connection.CreateCommand())
                {
                    connection.Open();
                    command.CommandText = sql;
                    foreach (var item in parameters)
                    {
                        var parameter = command.CreateParameter();
                        parameter.ParameterName = item.Key;
                        parameter.Value = item.Value;
                        command.Parameters.Add(parameter);
                    }
                    using (var reader = command.ExecuteReader())
                    {
                        var dataTable = new DataTable();
                        dataTable.Load(reader);
                        return dataTable;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new FormGenerationException("Unable to execute user's SQL query.", ex);
            }
        }
    }
}
