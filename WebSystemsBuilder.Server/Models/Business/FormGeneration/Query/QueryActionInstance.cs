using System;
using System.Collections.Generic;
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
    }
}
