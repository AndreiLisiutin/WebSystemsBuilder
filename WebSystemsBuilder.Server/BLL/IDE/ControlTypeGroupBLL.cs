using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class ControlTypeGroupBLL : ConnectionFactory
    {
        public readonly static ControlTypeGroup ALL_INSTANCE = new ControlTypeGroup() { ControlTypeGroupID = -1, Name = "All" };

        public List<ControlTypeGroup> GetControlTypeGroupList()
        {
            using (var db = this.CreateContext())
            {
                return db.ControlTypeGroups.ToList();
            }
        }
    }
}
