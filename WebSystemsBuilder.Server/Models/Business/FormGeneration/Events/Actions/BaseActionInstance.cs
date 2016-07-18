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

        /// <summary> Execute only action without children. If action was fully executed at server, return true. Otherwise, false
        /// </summary>
        /// <param name="scope"></param>
        /// <returns>If action was fully executed at server, return true. Otherwise, false</returns>
        protected abstract bool Execute(ActionScope scope);

        /// <summary> Execute action with all children. If action completely was executed at server, return true. Otherwise, false
        /// </summary>
        /// <param name="scope"></param>
        /// <returns></returns>
        public bool ExecuteAction(ActionScope scope)
        {
            bool fullyExecuted = this.Execute(scope);
            if (!fullyExecuted)
            {
                return false;
            }

            foreach (var action in this.ChildActions)
            {
                if (scope.ExecutedActionIDS.Contains(action.EventAction.ActionID))
                {
                    continue;
                }
                fullyExecuted = action.ExecuteAction(scope);
                if (!fullyExecuted)
                {
                    return false;
                }
            }
            return true;
        }

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
