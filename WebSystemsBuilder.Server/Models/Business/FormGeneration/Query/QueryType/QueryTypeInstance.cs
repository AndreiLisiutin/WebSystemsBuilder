using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryTypeInstance
    {
        public QueryTypeInstance()
        {

        }
        public QueryTypeInstance(QueryType QueryType, List<QueryTypeInInstance> QueryTypeIns, List<QueryTypeOutInstance> QueryTypeOuts,
            List<QueryTypePart> QueryTypeParts, List<QueryTypeTableInstance> QueryTypeTables, List<QueryTypeColumnInstance> QueryTypeColumns)
        {
            this.QueryType = QueryType;
            this.QueryTypeIns = QueryTypeIns;
            this.QueryTypeOuts = QueryTypeOuts;
            this.QueryTypeParts = QueryTypeParts;
            this.QueryTypeTables = QueryTypeTables;
            this.QueryTypeColumns = QueryTypeColumns;
        }
        public QueryType QueryType { get; set; }
        public List<QueryTypeInInstance> QueryTypeIns { get; set; }
        public List<QueryTypeOutInstance> QueryTypeOuts { get; set; }
        public List<QueryTypePart> QueryTypeParts { get; set; }
        public List<QueryTypeTableInstance> QueryTypeTables { get; set; }
        public List<QueryTypeColumnInstance> QueryTypeColumns { get; set; }

        public Tuple<string, Dictionary<string, object>> ConstructSql(Dictionary<int, string> parameters, Dictionary<int, bool> partsIncluded)
        {
            string baseSql = this.QueryType.Sql;
            Dictionary<string, object> sqlParams = new Dictionary<string, object>();

            foreach (var part in this.QueryTypeParts)
            {
                if (!partsIncluded.ContainsKey(part.QueryTypePartID))
                {
                    throw new FormGenerationException(string.Format(
                        "Query part is not included into query and not excluded.(QueryTypeID = {0}, QueryTypePartID = {1})",
                            part.QueryTypeID,
                            part.QueryTypePartID
                    ));
                }

                baseSql = baseSql.Replace(part.QueryTypePlaceholder, partsIncluded[part.QueryTypePartID] ? part.Sql : "");
            }

            foreach (var table in this.QueryTypeTables)
            {
                baseSql = baseSql.Replace(table.QueryTypeTable.QueryTypePlaceholder, table.Table.PhysicalTable);
            }

            foreach (var column in this.QueryTypeColumns)
            {
                baseSql = baseSql.Replace(column.QueryTypeColumn.QueryTypePlaceholder, column.Column.PhysicalColumn);
            }

            foreach (var paramIn in this.QueryTypeIns)
            {
                if (!baseSql.Contains(paramIn.QueryTypeIn.QueryTypePlaceholder))
                {
                    continue;
                }

                if (!parameters.ContainsKey(paramIn.QueryTypeIn.QueryTypeInID))
                {
                    throw new FormGenerationException(string.Format(
                        "Query parameter is not set to a value.(QueryTypeID = {0}, QueryTypeInID = {1})",
                            paramIn.QueryTypeIn.QueryTypeID,
                            paramIn.QueryTypeIn.QueryTypeInID
                    ));
                }
                string sqlParamName = "@param_" + paramIn.QueryTypeIn.QueryTypeInID;
                baseSql = baseSql.Replace(paramIn.QueryTypeIn.QueryTypePlaceholder, sqlParamName);
                object sqlValue = ValueTypeConverter.Deserialize(parameters[paramIn.QueryTypeIn.QueryTypeInID], 
                    paramIn.ValueType.ValueTypeID, paramIn.ValueType.Format);
                sqlParams.Add(sqlParamName, sqlValue);
            }

            foreach (var paramOut in this.QueryTypeOuts)
            {
                if (!baseSql.Contains(paramOut.QueryTypeOut.QueryTypeAlias))
                {
                    throw new FormGenerationException(string.Format(
                        "Query out parameter is not found.(QueryTypeID = {0}, QueryTypeOutID = {1})",
                            paramOut.QueryTypeOut.QueryTypeID,
                            paramOut.QueryTypeOut.QueryTypeOutID
                    ));
                }

                baseSql = baseSql.Replace(paramOut.QueryTypeOut.QueryTypePlaceholder, paramOut.QueryTypeOut.QueryTypeAlias);
            }

            return new Tuple<string, Dictionary<string, object>>(baseSql, sqlParams);
        }
    }

}
