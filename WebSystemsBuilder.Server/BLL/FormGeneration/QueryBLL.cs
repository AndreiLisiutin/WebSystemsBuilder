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
        public List<QueryInstance> GetQueriesByFormID(int formID)
        {
            using (var connection = this.CreateConnection())
            {
                using (var db = base.CreateContext(connection))
                {
                    List<Query> queries = this._GetQueriesByFormID(db, formID);
                    List<QueryInstance> queryInstances = queries
                        .Select(q => this._GetQueryInstanceByQuery(db, q))
                        .ToList();
                    return queryInstances;
                }
            }
        }
        public QueryInstance GetQueryByID(int queryID)
        {
            using (var connection = this.CreateConnection())
            {
                using (var db = base.CreateContext(connection))
                {
                    Query query = this._GetQueryByID(db, queryID);
                    QueryInstance queryInstance = this._GetQueryInstanceByQuery(db, query);
                    return queryInstance;
                }
            }
        }
        public QueryInstance _GetQueryInstanceByQuery(WebBuilderEFContext db, Query query)
        {
            List<QueryInInstance> ins = this._GetQueryIns(db, query.QueryID);
            List<QueryOutInstance> outs = this._GetQueryOuts(db, query.QueryID);
            List<QueryPartInstance> parts = this._GetQueryParts(db, query.QueryID);

            QueryInstance queryInstance = new QueryInstance(query, ins, outs, parts);
            return queryInstance;
        }

        private List<Query> _GetQueriesByFormID(WebBuilderEFContext db, int formID)
        {
            return db.Queries.Where(e => e.FormID == formID).ToList();
        }
        private Query _GetQueryByID(WebBuilderEFContext db, int queryID)
        {
            Query query = db.Queries.SingleOrDefault(e => e.QueryID == queryID);
            if (query == null)
            {
                throw new Exception(string.Format(
                    "Query not found(QueryID = {0})", queryID
                ));
            }
            return query;
        }
        private List<QueryInInstance> _GetQueryIns(WebBuilderEFContext db, int queryID)
        {
            return (
                from queryIn in db.QueryIns
                where queryIn.QueryID == queryID
                join queryTypeIn in db.QueryTypeIns on queryIn.QueryTypeInID equals queryTypeIn.QueryTypeInID
                join valueType in db.PropertyValueTypes on queryTypeIn.ValueTypeID equals valueType.ValueTypeID
                select new { queryIn = queryIn, queryTypeIn = queryTypeIn, valueType = valueType }
                )
                .ToList()
                    .Select(e => new QueryInInstance(e.queryIn, new QueryTypeInInstance(e.queryTypeIn, e.valueType)))
                .ToList();
        }
        private List<QueryOutInstance> _GetQueryOuts(WebBuilderEFContext db, int queryID)
        {
            return (
                 from queryOut in db.QueryOuts
                 where queryOut.QueryID == queryID
                 join queryTypeOut in db.QueryTypeOuts on queryOut.QueryTypeOutID equals queryTypeOut.QueryTypeOutID
                 join valueType in db.PropertyValueTypes on queryTypeOut.ValueTypeID equals valueType.ValueTypeID
                 select new { queryOut = queryOut, queryTypeOut = queryTypeOut, valueType = valueType }
                 )
                 .ToList()
                     .Select(e => new QueryOutInstance(e.queryOut, new QueryTypeOutInstance(e.queryTypeOut, e.valueType)))
                 .ToList();
        }
        private List<QueryPartInstance> _GetQueryParts(WebBuilderEFContext db, int queryID)
        {
            return (
                from queryPart in db.QueryParts
                where queryPart.QueryID == queryID
                join queryTypePart in db.QueryTypeParts on queryPart.QueryTypePartID equals queryTypePart.QueryTypePartID
                select new { queryPart = queryPart, queryTypePart = queryTypePart }
            )
            .ToList()
                .Select(e => new QueryPartInstance(e.queryPart, e.queryTypePart))
            .ToList();
        }
    }
}
