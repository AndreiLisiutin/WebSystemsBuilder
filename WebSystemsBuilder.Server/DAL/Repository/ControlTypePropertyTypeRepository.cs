using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSystemsBuilder.Server.Models;

namespace WebSystemsBuilder.Server.DAL
{
    public class ControlTypePropertyTypeRepository : GenericRepository<ControlTypePropertyType>
    {
        public ControlTypePropertyTypeRepository(WebBuilderEFContext context) : base(context) { }
    }
}
