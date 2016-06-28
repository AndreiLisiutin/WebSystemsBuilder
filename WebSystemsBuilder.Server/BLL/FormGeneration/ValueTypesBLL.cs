using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server
{
    public class ValueTypesBLL : ConnectionFactory
    {
        public List<PropertyValueType> GetValueTypes()
        {
            using (var db = this.CreateContext())
            {
                return db.PropertyValueTypes.ToList();
            }
        }
    }
}
