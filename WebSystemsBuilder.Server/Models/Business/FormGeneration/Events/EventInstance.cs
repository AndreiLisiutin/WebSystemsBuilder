using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class EventInstance
    {
        public EventInstance()
        {

        }
        public EventInstance(Event Event, EventType EventType, EventTypeControlType EventTypeControlType)
        {
            this.Event = Event;
            this.EventType = EventType;
            this.EventTypeControlType = EventTypeControlType;
        }
        public Event Event { get; set; }
        public EventType EventType { get; set; }
        public EventTypeControlType EventTypeControlType { get; set; }
    }

    public class EventWithActionsInstance
    {
        public EventWithActionsInstance()
        {
                
        }
        public EventWithActionsInstance(EventInstance EventInstance, List<BaseActionInstance> EventActions)
        {
            this.EventInstance = EventInstance;
            this.EventActions = EventActions;
        }
        public List<BaseActionInstance> EventActions { get; set; }
        public EventInstance EventInstance { get; set; }
    }
}
