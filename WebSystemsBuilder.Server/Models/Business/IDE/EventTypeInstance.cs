using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebSystemsBuilder.Server.Models
{
    public class EventTypeInstance
    {
        public EventTypeInstance()
        {

        }
        public EventTypeInstance(EventType EventType, EventTypeControlType EventTypeControlType)
        {
            this.EventType = EventType;
            this.EventTypeControlType = EventTypeControlType;
        }
        public EventType EventType { get; set; }
        public EventTypeControlType EventTypeControlType { get; set; }
    }
    
}
