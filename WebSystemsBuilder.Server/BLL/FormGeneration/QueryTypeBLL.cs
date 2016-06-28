using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class QueryTypeBLL : ConnectionFactory
    {
        public QueryTypeInstance GetQueryTypeByID(int queryTypeID)
        {
            using (var connection = this.CreateConnection())
            {
                using (var db = base.CreateContext(connection))
                {
                    QueryType type = this._GetQueryType(db, queryTypeID);
                    List<QueryTypeInInstance> ins = this._GetQueryTypeIns(db, queryTypeID);
                    List<QueryTypeOutInstance> outs = this._GetQueryTypeOuts(db, queryTypeID);
                    List<QueryTypeTableInstance> tables = this._GetQueryTypeTables(db, queryTypeID);
                    List<QueryTypeColumnInstance> columns = this._GetQueryTypeColumns(db, queryTypeID);
                    List<QueryTypePart> parts = this._GetQueryTypeParts(db, queryTypeID);

                    QueryTypeInstance queryType = new QueryTypeInstance(type, ins, outs, parts, tables, columns);

                    //_Test(queryType, connection);

                    return queryType;
                }
            }
        }
        private void _Test(QueryTypeInstance queryType, IDbConnection connection)
        {
            var _ins = new Dictionary<int, string>();
            _ins.Add(1, "1");
            var _parts = new Dictionary<int, bool>();
            _parts.Add(1, true);
            var preparedSql = queryType.ConstructSql(_ins, _parts);
            string sql = preparedSql.Item1;
            using (var command = connection.CreateCommand())
            {
                connection.Open();
                command.CommandText = sql;
                foreach (var item in preparedSql.Item2)
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
                }
            }
        }

        private QueryType _GetQueryType(WebBuilderEFContext db, int queryTypeID)
        {
            QueryType queryType = db.QueryTypes.SingleOrDefault(e => e.QueryTypeID == queryTypeID);
            if (queryType == null)
            {
                throw new Exception(string.Format(
                    "Query type not found(QueryTypeID = {0})", queryTypeID
                ));
            }
            return queryType;
        }
        private List<QueryTypeInInstance> _GetQueryTypeIns(WebBuilderEFContext db, int queryTypeID)
        {
            return db.QueryTypeIns
                .Where(e => e.QueryTypeID == queryTypeID)
                .Join(db.PropertyValueTypes,
                    e => e.ValueTypeID,
                    e => e.ValueTypeID,
                    (i, v) => new { QueryTypeIn = i, ValueType = v })
                .ToList()
                .Select(e => new QueryTypeInInstance(e.QueryTypeIn, e.ValueType))
                .ToList();
        }
        private List<QueryTypeOutInstance> _GetQueryTypeOuts(WebBuilderEFContext db, int queryTypeID)
        {
            return db.QueryTypeOuts
                .Where(e => e.QueryTypeID == queryTypeID)
                .Join(db.PropertyValueTypes,
                    e => e.ValueTypeID,
                    e => e.ValueTypeID,
                    (i, v) => new { QueryTypeOut = i, ValueType = v })
                .ToList()
                .Select(e => new QueryTypeOutInstance(e.QueryTypeOut, e.ValueType))
                .ToList();
        }
        private List<QueryTypeTableInstance> _GetQueryTypeTables(WebBuilderEFContext db, int queryTypeID)
        {
            return db.QueryTypeTables
                .Where(e => e.QueryTypeID == queryTypeID)
                .Join(db.Tables,
                    e => e.TableID,
                    e => e.TableID,
                    (tt, t) => new { QueryTypeTable = tt, Table = t })
                .ToList()
                .Select(e => new QueryTypeTableInstance(e.QueryTypeTable, e.Table))
                .ToList();
        }
        private List<QueryTypeColumnInstance> _GetQueryTypeColumns(WebBuilderEFContext db, int queryTypeID)
        {
            return db.QueryTypeColumns
                .Where(e => e.QueryTypeID == queryTypeID)
                .Join(db.Columns,
                    e => e.ColumnID,
                    e => e.ColumnID,
                    (tc, c) => new { QueryTypeColumn = tc, Column = c })
                .ToList()
                .Select(e => new QueryTypeColumnInstance(e.QueryTypeColumn, e.Column))
                .ToList();
        }
        private List<QueryTypePart> _GetQueryTypeParts(WebBuilderEFContext db, int queryTypeID)
        {
            return db.QueryTypeParts
                .Where(e => e.QueryTypeID == queryTypeID)
                .ToList();
        }
    }
}
