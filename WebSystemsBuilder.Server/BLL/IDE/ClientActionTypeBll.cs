using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class ClientActionTypeBll : ConnectionFactory
    {
        /// <summary>
        /// Get all clent action types
        /// </summary>
        /// <returns></returns>
        public List<ClientActionType> GetClientActionTypeList()
        {
            using (var db = this.CreateContext())
            {
                return db.ClientActionTypes.ToList();
            }
        }
    }
}
