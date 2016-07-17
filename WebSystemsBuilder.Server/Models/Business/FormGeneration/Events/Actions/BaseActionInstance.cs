using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public abstract class BaseActionInstance
    {
        public BaseActionInstance()
        {

        }
        public BaseActionInstance(EventAction EventAction)
        {
            this.EventAction = EventAction;
        }
        public abstract int ActionTypeID { get; }
        public EventAction EventAction { get; set; }
        public List<BaseActionInstance> ChildActions { get; set; }

        /// <summary> Execute action. If action was fully executed at server, return true. Otherwise, false
        /// </summary>
        /// <param name="scope"></param>
        /// <returns>If action was fully executed at server, return true. Otherwise, false</returns>
        public abstract bool Execute(ActionScope scope);
        
        public static void ByPassActionsTree(BaseActionInstance action, Action<BaseActionInstance> function)
        {
            function(action);
            foreach (BaseActionInstance childAction in action.ChildActions)
            {
                ByPassActionsTree(childAction, function);
            }
        }
    }
}
