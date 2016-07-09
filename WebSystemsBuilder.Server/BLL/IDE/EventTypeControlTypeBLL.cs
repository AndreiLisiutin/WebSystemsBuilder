using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class EventTypeControlTypeBLL : ConnectionFactory
    {
        public List<EventTypeControlType> GetEventTypeControlTypeList()
        {
            using (var db = this.CreateContext())
            {
                return db.EventTypeControlTypes.ToList();
            }
        }        
    }
}
