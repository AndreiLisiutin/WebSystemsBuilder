using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class ControlEventInstance
    {
        public ControlEventInstance()
        {

        }
        public ControlEventInstance(Event Event, EventType EventType, EventTypeControlType EventTypeControlType)
        {
            this.Event = Event;
            this.EventType = EventType;
            this.EventTypeControlType = EventTypeControlType;
        }
        public Event Event { get; set; }
        public EventType EventType { get; set; }
        public EventTypeControlType EventTypeControlType { get; set; }
        public List<ControlEventActionInstance> EventActions { get; set; }
    }

    public class ControlEventActionInstance
    {
        public int ActionTypeID { get; set; }
        public EventAction EventAction { get; set; }
        public List<BaseActionInstance> ChildActions { get; set; }
        public ClientAction ClientAction { get; set; }
    }
}
