using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    class PredicateActionInstance : BaseActionInstance
    {
        public PredicateActionInstance()
            : base()
        {

        }
        public PredicateActionInstance(EventAction EventAction, PredicateAction PredicateAction, PredicateOperation PredicateOperation)
            : base(EventAction)
        {
            this.PredicateAction = PredicateAction;
            this.PredicateOperation = PredicateOperation;
        }
        public PredicateAction PredicateAction { get; set; }
        public PredicateOperation PredicateOperation { get; set; }

        public override int ActionTypeID
        {
            get
            {
                return (int)ActionTypeEnum.Predicate;
            }
        }
    }
}
