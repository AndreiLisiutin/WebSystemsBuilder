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
                    List<ServerActionInstance> serverActions = this._GetServerActions(db, eventIDs);
                    List<QueryActionInstance> queryActions = this._GetQueryActions(db, eventIDs);

                    actions.AddRange(clientActions.Select(e => (BaseActionInstance)e));
                    actions.AddRange(predicateActions.Select(e => (BaseActionInstance)e));
                    actions.AddRange(formActions.Select(e => (BaseActionInstance)e));
                    actions.AddRange(serverActions.Select(e => (BaseActionInstance)e));
                    actions.AddRange(queryActions.Select(e => (BaseActionInstance)e));

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
        private List<ServerActionInstance> _GetServerActions(WebBuilderEFContext db, List<int> eventID)
        {
            return (
                from serverAction in db.ServerActions
                join action in db.EventActions on serverAction.ActionID equals action.ActionID
                where eventID.Contains(action.EventID)
                select new { serverAction = serverAction, action = action }
            )
            .ToList()
            .Select(e => new ServerActionInstance(e.action, e.serverAction))
            .ToList();
        }

        private List<QueryActionInstance> _GetQueryActions(WebBuilderEFContext db, List<int> eventID)
        {
            return (
                from queryAction in db.QueryActions
                join action in db.EventActions on queryAction.ActionID equals action.ActionID
                where eventID.Contains(action.EventID)
                select new { queryAction = queryAction, action = action }
            )
            .ToList()
            .Select(e => this._GetQueryInstanceByQuery(db, e.action, e.queryAction))
            .ToList();
        }
        
        private QueryActionInstance _GetQueryInstanceByQuery(WebBuilderEFContext db, EventAction action, QueryAction query)
        {
            List<QueryActionInInstance> ins = this._GetQueryIns(db, query.ActionID);
            List<QueryActionOutInstance> outs = this._GetQueryOuts(db, query.ActionID);
            List<QueryActionPartInstance> parts = this._GetQueryParts(db, query.ActionID);

            QueryActionInstance queryInstance = new QueryActionInstance(action, query, ins, outs, parts);
            return queryInstance;
        }

        public QueryActionInstance _GetQueryActionByID(WebBuilderEFContext db, int queryActionID)
        {
            var query = (
                from queryAction in db.QueryActions
                join action in db.EventActions on queryAction.ActionID equals action.ActionID
                where queryAction.ActionID == queryActionID
                select new { queryAction = queryAction, action = action }
            )
            .SingleOrDefault();
            if (query == null)
            {
                throw new Exception(string.Format(
                    "Query not found(queryActionID = {0})", queryActionID
                ));
            }

            QueryActionInstance instance = this._GetQueryInstanceByQuery(db, query.action, query.queryAction);
            return instance;
        }
        private List<QueryActionInInstance> _GetQueryIns(WebBuilderEFContext db, int queryActionID)
        {
            return (
                from queryIn in db.QueryActionIns
                where queryIn.QueryActionID == queryActionID
                join queryTypeIn in db.QueryTypeIns on queryIn.QueryTypeInID equals queryTypeIn.QueryTypeInID
                join valueType in db.PropertyValueTypes on queryTypeIn.ValueTypeID equals valueType.ValueTypeID
                select new { queryIn = queryIn, queryTypeIn = queryTypeIn, valueType = valueType }
                )
                .ToList()
                    .Select(e => new QueryActionInInstance(e.queryIn, new QueryTypeInInstance(e.queryTypeIn, e.valueType)))
                .ToList();
        }
        private List<QueryActionOutInstance> _GetQueryOuts(WebBuilderEFContext db, int queryActionID)
        {
            return (
                 from queryOut in db.QueryActionOuts
                 where queryOut.QueryActionID == queryActionID
                 join queryTypeOut in db.QueryTypeOuts on queryOut.QueryTypeOutID equals queryTypeOut.QueryTypeOutID
                 join valueType in db.PropertyValueTypes on queryTypeOut.ValueTypeID equals valueType.ValueTypeID
                 select new { queryOut = queryOut, queryTypeOut = queryTypeOut, valueType = valueType }
                 )
                 .ToList()
                     .Select(e => new QueryActionOutInstance(e.queryOut, new QueryTypeOutInstance(e.queryTypeOut, e.valueType)))
                 .ToList();
        }
        private List<QueryActionPartInstance> _GetQueryParts(WebBuilderEFContext db, int queryActionID)
        {
            return (
                from queryPart in db.QueryActionParts
                where queryPart.QueryActionID == queryActionID
                join queryTypePart in db.QueryTypeParts on queryPart.QueryTypePartID equals queryTypePart.QueryTypePartID
                select new { queryPart = queryPart, queryTypePart = queryTypePart }
            )
            .ToList()
                .Select(e => new QueryActionPartInstance(e.queryPart, e.queryTypePart))
            .ToList();
        }
    }
}
