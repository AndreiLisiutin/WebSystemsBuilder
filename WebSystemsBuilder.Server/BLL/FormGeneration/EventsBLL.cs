using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class EventsBLL : ConnectionFactory
    {
        public List<EventWithActionsInstance> GetEventsByFormID(int formID)
        {
            using (var connection = this.CreateConnection())
            {
                using (var db = base.CreateContext(connection))
                {
                    List<EventInstance> events = this._GetEventsListByFormID(db, formID);
                    List<int> eventIDs = events.Select(e => e.Event.EventID).ToList();

                    List<BaseActionInstance> actions = new List<BaseActionInstance>();

                    List<ClientActionInstance> clientActions = this._GetClientActions(db, eventIDs);
                    List<PredicateActionInstance> predicateActions = this._GetPredicateActions(db, eventIDs);
                    List<OpenFormActionInstance> formActions = this._GetOpenFormActions(db, eventIDs);

                    actions.AddRange(clientActions.Select(e => (BaseActionInstance)e));
                    actions.AddRange(predicateActions.Select(e => (BaseActionInstance)e));
                    actions.AddRange(formActions.Select(e => (BaseActionInstance)e));

                    foreach (var action in actions)
                    {
                        action.ChildActions = actions
                            .Where(e => e.EventAction.ActionIDParent == action.EventAction.ActionID)
                            .ToList();
                    }
                    
                    List<EventWithActionsInstance> eventInstances = events
                        .Select(
                            e => 
                            {
                                var eventRootActions = actions
                                    .Where(a => a.EventAction.EventID == e.Event.EventID
                                            && a.EventAction.ActionIDParent == null)
                                    .ToList();
                                return new EventWithActionsInstance(e, eventRootActions);
                            })
                        .ToList();

                    return eventInstances;
                }
            }
        }

        private List<EventInstance> _GetEventsListByFormID(WebBuilderEFContext db, int formID)
        {
            return (
                from @event in db.Events
                join control in db.Controls on @event.ControlID equals control.ControlID
                where control.FormID == formID
                join eventTypeControlType in db.EventTypeControlTypes on @event.EventTypeControlTypeID equals eventTypeControlType.EventTypeControlTypeID
                join eventType in db.EventTypes on eventTypeControlType.EventTypeID equals eventType.EventTypeID
                select new { @event = @event, control = control, eventTypeControlType = eventTypeControlType, eventType = eventType }
            )
            .ToList()
            .Select(e => new EventInstance(e.@event, e.eventType, e.eventTypeControlType))
            .ToList();
        }
        private List<ClientActionInstance> _GetClientActions(WebBuilderEFContext db, List<int> eventID)
        {
            return (
                from clientAction in db.ClientActions
                join action in db.EventActions on clientAction.ActionID equals action.ActionID
                where eventID.Contains(action.EventID)
                join clientActionTypeControlType in db.ClientActionTypeControlTypes on clientAction.ClientActionTypeControlTypeID
                    equals clientActionTypeControlType.ClientActionTypeControlTypeID
                join clientActionType in db.ClientActionTypes on clientActionTypeControlType.ClientActionTypeID equals clientActionType.ClientActionTypeID
                select new { clientAction = clientAction, action = action, clientActionTypeControlType = clientActionTypeControlType, clientActionType = clientActionType }
            )
            .ToList()
            .Select(e => new ClientActionInstance(e.action, e.clientAction, e.clientActionTypeControlType, e.clientActionType))
            .ToList();
        }
        private List<PredicateActionInstance> _GetPredicateActions(WebBuilderEFContext db, List<int> eventID)
        {
            return (
                from predicateAction in db.PredicateActions
                join action in db.EventActions on predicateAction.ActionID equals action.ActionID
                where eventID.Contains(action.EventID)
                join predicateOperation in db.PredicateOperations on predicateAction.PredicateOperationID equals predicateOperation.PredicateOperationID
                select new { predicateAction = predicateAction, action = action, predicateOperation = predicateOperation }
            )
            .ToList()
            .Select(e => new PredicateActionInstance(e.action, e.predicateAction, e.predicateOperation))
            .ToList();
        }
        private List<OpenFormActionInstance> _GetOpenFormActions(WebBuilderEFContext db, List<int> eventID)
        {
            return (
                from openFormAction in db.OpenFormActions
                join action in db.EventActions on openFormAction.ActionID equals action.ActionID
                where eventID.Contains(action.EventID)
                join openFormActionParameter in db.OpenFormActionParameters on openFormAction.ActionID equals openFormActionParameter.OpenFormActionID
                select new { openFormAction = openFormAction, action = action, openFormActionParameter = openFormActionParameter }
            )
            .ToList()
            .GroupBy(e => new { e.action, e.openFormAction })
            .Select(e => new OpenFormActionInstance(e.Key.action, e.Key.openFormAction, e.Select(x => x.openFormActionParameter).ToList()))
            .ToList();
        }
    }
}
