using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class QueryActionInstance : BaseActionInstance
    {
        public QueryActionInstance()
            :base()
        {

        }
        public QueryActionInstance(EventAction EventAction, QueryAction QueryAction, List<QueryActionInInstance> QueryActionIns, 
            List<QueryActionOutInstance> QueryActionOuts, List<QueryActionPartInstance> QueryActionParts)
            : base(EventAction)
        {
            this.QueryAction = QueryAction;
            this.QueryActionIns = QueryActionIns;
            this.QueryActionOuts = QueryActionOuts;
            this.QueryActionParts = QueryActionParts;
        }

        public override int ActionTypeID
        {
            get
            {
                return (int)ActionTypeEnum.Query;
            }
        }

        public QueryAction QueryAction { get; set; }
        public List<QueryActionInInstance> QueryActionIns { get; set; }
        public List<QueryActionOutInstance> QueryActionOuts { get; set; }
        public List<QueryActionPartInstance> QueryActionParts { get; set; }

        private Dictionary<int, string> GetQueryInParameters(ActionScope scope, QueryTypeInstance queryType)
        {
            Dictionary<int, string> queryTypeInID_value = new Dictionary<int, string>();
            foreach (var queryTypeIn in queryType.QueryTypeIns)
            {
                int queryTypeInID = queryTypeIn.QueryTypeIn.QueryTypeInID;
                var queryActionIn = this.QueryActionIns
                    .FirstOrDefault(e => e.QueryTypeIn.QueryTypeIn.QueryTypeInID == queryTypeInID);
                if (queryActionIn == null)
                {
                    throw new FormGenerationException(string.Format(
                           "Query type in parameter not given in query action in parameters(QueryTypeInID = {0})",
                               queryTypeInID
                       ));
                }

                var operand = scope.OperandValues
                    .FirstOrDefault(e => e.OperandID == queryActionIn.QueryActionIn.OperandIDValue);
                if (operand == null)
                {
                    throw new FormGenerationException(string.Format(
                        "Query type in parameter operand not found in form(QueryTypeInID = {0}, OperandID = {1})",
                            queryTypeInID,
                            queryActionIn.QueryActionIn.OperandIDValue
                    ));
                }

                queryTypeInID_value.Add(queryTypeInID, operand.GetSerializedValue());
            }
            return queryTypeInID_value;
        }
        private Dictionary<int, bool> GetQueryParts(ActionScope scope, QueryTypeInstance queryType)
        {
            Dictionary<int, bool> queryTypePartID_value = new Dictionary<int, bool>();
            foreach (var queryTypePart in queryType.QueryTypeParts)
            {
                int queryTypePartID = queryTypePart.QueryTypePartID;
                var queryActionPart = this.QueryActionParts
                    .FirstOrDefault(e => e.QueryActionPart.QueryTypePartID == queryTypePartID);
                if (queryActionPart == null)
                {
                    throw new FormGenerationException(string.Format(
                           "Query type part parameter not given in query action part parameters(QueryTypePartID = {0})",
                               queryTypePartID
                       ));
                }

                var operand = scope.OperandValues
                    .FirstOrDefault(e => e.OperandID == queryActionPart.QueryActionPart.OperandIDValue);
                if (operand == null)
                {
                    throw new FormGenerationException(string.Format(
                        "Query type part parameter operand not found part form(QueryTypePartID = {0}, OperandID = {1})",
                            queryTypePartID,
                            queryActionPart.QueryActionPart.OperandIDValue
                    ));
                }

                if (operand.ValueType.ValueTypeID != (int)ValueTypeEnum.Boolean)
                {
                    throw new FormGenerationException(string.Format(
                        "Query type part parameter operand has not boolean value type(QueryTypePartID = {0}, OperandID = {1})",
                            queryTypePartID,
                            queryActionPart.QueryActionPart.OperandIDValue
                    ));
                }

                object value = operand.GetDeserializedValue();
                bool boolValue = value is bool ? (bool)value : ((bool?)value) ?? false;
                queryTypePartID_value.Add(queryTypePartID, boolValue);
            }
            return queryTypePartID_value;
        }

        private void SetOperatorValues(ActionScope scope, DataTable resultData)
        {
            foreach (var queryActionOut in this.QueryActionOuts)
            {
                int operandID = queryActionOut.QueryActionOut.OperandIDValue;
                int queryActionOutID = queryActionOut.QueryActionOut.QueryActionOutID;
                var queryTypeOut = queryActionOut.QueryTypeOut.QueryTypeOut;
                var valueType = queryActionOut.QueryTypeOut.ValueType;

                var operand = scope.OperandValues.FirstOrDefault(e => e.OperandID == operandID);
                if (operand == null)
                {
                    throw new FormGenerationException(string.Format(
                        "Operand for query action out not found (QueryActionOutID = {0}, OperandID = {1})",
                            queryActionOutID,
                            operandID
                    ));
                }

                if (operand.ValueType.ValueTypeID != valueType.ValueTypeID)
                {
                    throw new FormGenerationException(string.Format(
                        "Operand for query action has incorrect value type (QueryActionOutID = {0}, OperandID = {1})",
                            queryActionOutID,
                            operandID
                    ));
                }

                string columnName = queryTypeOut.QueryTypeAlias;
                if (!resultData.Columns.Contains(columnName))
                {
                     throw new FormGenerationException(string.Format(
                        "Query out parameter alias incorrect (QueryActionOutID = {0})",
                            queryActionOutID
                    ));
                }

                List<object> dataForOperand = resultData.AsEnumerable()
                    .Select(e => e[columnName])
                    .ToList();

                operand.SetDeserializedValues(dataForOperand);
            }
        }

        protected override bool Execute(ActionScope scope)
        {
            int queryTypeID = this.QueryAction.QueryTypeID;
            QueryTypeInstance queryType = new QueryTypeBLL().GetQueryTypeByID(queryTypeID);
            Dictionary<int, string> queryTypeInID_value = this.GetQueryInParameters(scope, queryType);
            Dictionary<int, bool> queryTypePartID_value = this.GetQueryParts(scope, queryType);
            
            var sql = queryType.ConstructSql(queryTypeInID_value, queryTypePartID_value);
            DataTable resultData = new QueryBLL().ExecuteSql(sql.Item1, sql.Item2);
            this.SetOperatorValues(scope, resultData);
            //query executed
            scope.ExecutedActionIDS.Add(this.EventAction.ActionID);

            return true;
        }
    }
}
